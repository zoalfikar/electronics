const comp = {
    data() {
        return {
            buyingProcess: null,
            filterBuyingProcess: null,
            allBuyingProcess: null,
            allPrdocucts: null,
            name: null,
            code: null,
            created_at: null,
            updated_at: null,
            currentCell: null,
            temoraryCellId: null,
        }
    },
    computed: {
        filter: () => mainVueApp._instance.data.filter,
        alter: () => mainVueApp._instance.data.alter,
    },
    methods: {
        pringAll: async function() {
            var buyingProcess = await controllers.productsController.pringAllBuyingProcess();
            var products = await controllers.productsController.pringAllProducts();
            this.allPrdocucts = products;
            this.allBuyingProcess = buyingProcess;
            this.buyingProcess = this.allBuyingProcess;
        },
        deleteProcessConfirm: async function(id) {
            if (await swal({
                    title: "تاكيد",
                    text: "هل انت متاكد من حذف هذه الفاتورة",
                    icon: "warning",
                    button: "تاكيد"
                }))
                this.deleteProcess(id)
        },
        deleteProcess: async function(id) {
            var result = await controllers.productsController.deleteProcessId(id)
            this.updateFrontEnd(result.processId)
            if (result.code) {
                if (result.q > 0) {
                    swal(" تم الحذف")
                } else {
                    if (result.q == 0) {
                        var confirm = await swal({
                            title: "تنبيه",
                            text: " لم تبقى كمية من هذا المنتج هل تريد حذفه ",
                            icon: "warning",
                            button: "تاكيد"
                        })
                        if (confirm) {
                            this.deleteProduct(result.productId)
                        }
                    } else {
                        (swal('لاتوجد كمية كافية لارجاعها'))
                    }

                }
            } else {
                var newcode = await swal({
                    title: "تنبيه",
                    text: ` هذه الفاتورة غير مطابقة لأي منتج , هذ الامر يحدث بعد حذف المنتج نهائيا
                    
                            يجب اسناد رمز المنتج الخاص بهذه الفاتورة
                            `,
                    icon: "warning",
                    content: "input",
                    buttons: "تاكيد"

                })
                if (!newcode) swal('لم يتم ادخال كود')
                else {
                    var prod = await this.setProcessCode(id, newcode)
                    if (prod) this.deleteProcess(id)
                }
            }
        },
        setProcessCode: async function(id, code) {
            var process = await this.findProcess(id)
            var product = await this.findProductByCode(code)
            if (product) {
                await swal(`اسم المنتج ${product.name}`)
                var ok = await controllers.productsController.asynicUpdateProcess(id, { code: code })
                if (ok) {
                    process.code = code
                    return new Promise((resolve, reject) => {
                        resolve(product)
                    })
                }
            } else {
                var ok = await controllers.productsController.asynicUpdateProcess(id, { code: null })
                if (ok) {
                    process.code = null
                    await swal(`هذا الرمز لا ينتمي لاي منتج`)

                    return new Promise((resolve, reject) => {
                        resolve(false)
                    })
                }
            }

        },
        findProcess: function(id) {
            return new Promise((resolve, reject) => {
                var process = this.allBuyingProcess.find((p) => {
                    return p.id == id
                })
                resolve(process)
            })
        },
        findProductByCode: function(code) {
            return new Promise((resolve, reject) => {
                var product = this.allPrdocucts.find((p) => {
                    return p.code == code
                })
                resolve(product)
            })
        },
        deleteProduct: function(id) {
            controllers.productsController.deleteProductId(id)
            swal('تم')
        },
        updateFrontEnd: function(id) {
            this.buyingProcess = this.buyingProcess.filter((bp) => {
                return bp.id !== id
            });
            this.allBuyingProcess = this.allBuyingProcess.filter((bp) => {
                return bp.id !== id
            });
        },
        alterEventHolder: function(e) {
            if (!this.currentCell.contains(e.target)) {
                this.closeCellUpdating()
            }
        },
        setCellToUpdate: function(ee, target) {
            ee.preventDefault()
            var cell = target;
            if (this.currentCell) {
                if ((!this.currentCell.contains(cell))) {
                    this.closeCellUpdating()
                    this.currentCell = cell;
                    this.temoraryCellId = cell.id;
                    $(this.currentCell).children('.input').css('display', 'block');
                    document.addEventListener('click', this.alterEventHolder)
                }
            } else {
                this.currentCell = cell;
                this.temoraryCellId = cell.id;
                $(this.currentCell).children('.input').css('display', 'block');
                document.addEventListener('click', this.alterEventHolder)
            }
        },
        closeCellUpdating: function() {
            $(this.currentCell).children('.input').css('display', 'none')
            this.currentCell = null
            this.temoraryCellId = null;
            document.removeEventListener('click', this.alterEventHolder)
        },
        updateProcessValue: async function() {
            if (this.alter && this.buyingProcess) {
                var processtId = $(this.currentCell).parents('tr').attr('id');
                var newValue = $(this.currentCell).children('.input').val();
                var isNameCell = $(this.currentCell).hasClass("ntd")
                var isPriceCell = $(this.currentCell).hasClass("ptd")
                var isQuantityCell = $(this.currentCell).hasClass("qtd")
                var isTotallPriceCell = $(this.currentCell).hasClass("ttd")
                var process = this.buyingProcess.find((p) => {
                    return p.id == processtId
                })
                if ((newValue) || (newValue >= 0)) {
                    if (isNameCell) controllers.productsController.asynicUpdateProcess(processtId, { name: newValue }).then((v) => {
                        process.name = newValue;
                        swal('تم التعديل')

                    })
                    if (isQuantityCell) {
                        if (!isNaN(newValue) && (newValue >= 0)) {
                            controllers.productsController.asynicUpdateProcess(processtId, { quantity: newValue, code: process.code }).then(
                                (v) => {
                                    process.quantity = newValue;
                                    swal('تم التعديل')
                                }
                            )
                        }

                    }
                    if (isPriceCell) {
                        if (!isNaN(newValue) && (newValue >= 0)) {
                            var changeProduct = await swal({ title: "تاكيد", text: " هل تريد تطبيق هذا التغيرات على المنتج ايضا ", button: "تطبيق" })
                            controllers.productsController.asynicUpdateProcess(processtId, { price: newValue, code: process.code, changeProduct: changeProduct ? 1 : 0 }).then(
                                (v) => {
                                    process.price = newValue;
                                    swal('تم التعديل')
                                }
                            )
                        }

                    }
                    if (isTotallPriceCell)
                        if (!isNaN(newValue) && (newValue >= 0))
                            controllers.productsController.asynicUpdateProcess(processtId, { totall: newValue }).then(
                                (v) => {
                                    process.totall = newValue;
                                    swal('تم التعديل')
                                })
                }
            }

        }
    },
    watch: {
        filter: {
            handler(n, o) {
                if (!n) {
                    this.buyingProcess = this.allBuyingProcess
                    this.name = null
                    this.code = null
                }
            },
            immediate: true
        },
        name: function(n, o) {
            this.filterBuyingProcess = this.allBuyingProcess.filter((p) => {
                if ((n !== '') && n) {
                    return p.name.includes(n)
                }
            })
        },
        code: function(n, o) {
            this.filterBuyingProcess = this.allBuyingProcess.filter((p) => {
                return p.code == n;
            })
        },
        created_at: function(n, o) {
            n = n.substr(0, 10).replaceAll('-', '/');
            this.filterBuyingProcess = this.allBuyingProcess.filter((p) => {
                return p.created_at_formated.substr(-10) == n;
            })
        },
        updated_at: function(n, o) {
            n = n.substr(0, 10).replaceAll('-', '/');
            this.filterBuyingProcess = this.allBuyingProcess.filter((p) => {
                return p.updated_at_formated.substr(-10) == n;
            })
        },
        filterBuyingProcess: function(n, o) {
            if (n && (n.length > 0)) {
                this.buyingProcess = n;
            } else {
                this.buyingProcess = this.allBuyingProcess
            }
        }
    },
    mounted: function() {
        this.pringAll()
        let updateProcessValue = this.updateProcessValue
        document.addEventListener('keypress', function(e) {
            if (e.key == "Enter") {
                updateProcessValue()
            }
        })
    }
}

export default () => {
    return fetch('./appContent/components/buyingProcess/display/index.html')
        .then((response) => {
            return response.text();
        })
        .then((html) => {
            return {
                template: html,
                ...comp

            }
        });
};