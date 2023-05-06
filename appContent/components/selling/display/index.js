const comp = {
    data() {
        return {
            sellingProccess: null,
            filterSellingProccess: null,
            allSellingProccess: null,
            allPrdocucts: null,
            name: null,
            code: null,
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
            var sellingProccess = await controllers.sellingController.pringAllSellingProcess();
            var products = await controllers.productsController.pringAllProducts();
            this.allPrdocucts = products;
            this.allSellingProccess = sellingProccess;
            this.sellingProccess = this.allSellingProccess;
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
        updateFrontEnd: function(id) {
            this.sellingProccess = this.sellingProccess.filter((bp) => {
                return bp.id !== id
            });
            this.allSellingProccess = this.allSellingProccess.filter((bp) => {
                return bp.id !== id
            });
        },
        deleteProcessConfirm: async function(id) {
            await swal({
                title: "تاكيد",
                text: "هل انت متاكد من حذف هذه الفاتورة",
                icon: "warning",
                button: "تاكيد"
            })
            this.deleteProcess(id)
        },
        deleteProcess: async function(id) {
            var result = await controllers.sellingController.deleteProcessId(id)
            if (result.code) {
                this.updateFrontEnd(result.processId)
                swal(" تم الحذف")

            } else {
                var confirm = await swal({
                    title: "تنبيه",
                    text: ` هذ المنتج تم حذفه اعد ملىء بياناته من جديد وحاول  مجددا 

                    إذا كنت قد ادخلت البنات ادخل كود المنتج
                    `,
                    icon: "warning",
                    buttons: {
                        code: "ادخل كود",
                        goto: 'ادخال بيانات',
                    },
                })
                if (confirm) {
                    if (confirm == "code") {
                        var newcode = await swal({
                            title: "تنبيه",
                            text: ` 
                            ادخل الكود
                            `,
                            icon: "warning",
                            content: "input",
                            buttons: "تاكيد"

                        })
                        await this.setProcessCode(id, newcode)
                        this.deleteProcess(id)

                    }
                    if (confirm == "goto") {
                        mainVueApp._instance.ctx.goto('/buying-process', 'إضافة شراء')
                    }
                }
            }
        },
        updateProductValue: function() {
            if (this.alter) {
                var proccessId = $(this.currentCell).parents('tr').attr('id');
                var newValue = $(this.currentCell).children('.input').val();
                var isSellingPriceCell = $(this.currentCell).hasClass("std")
                var isDescriptionCell = $(this.currentCell).hasClass("dtd")
                var proccess = this.sellingProccess.find((p) => {
                    return p.id == proccessId
                })
                if (newValue) {
                    if (isSellingPriceCell) controllers.sellingController.asynicUpdateProcess(proccessId, { sellingPrice: newValue }).then(
                        (v) => {
                            proccess.sellingPrice = newValue;
                            swal('تم التعديل')
                        })

                }
                if (isDescriptionCell) controllers.sellingController.asynicUpdateProcess(proccessId, { description: newValue }).then(
                    (v) => {
                        proccess.description = newValue;
                        swal('تم التعديل')

                    }
                )
            }

        },
        setProcessCode: async function(id, code) {
            var pro = await this.findProcess(id)
            var product = await this.findProductByCode(code)
            if (product) {
                swal(`اسم المنتج ${product.name}`)
                var ok = await controllers.sellingController.asynicUpdateProcess(id, { code: code })
                if (ok) {
                    pro.code = code
                    return new Promise((resolve, reject) => {
                        resolve(pro)
                    })
                }
            } else {
                swal(' المنتج غير موجود')
            }
        },
        findProcess: function(id) {
            return new Promise((resolve, reject) => {
                var process = this.allSellingProccess.find((p) => {
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
    },
    watch: {
        filter: {
            handler(n, o) {
                if (!n) {
                    this.sellingProccess = this.allSellingProccess
                    this.name = null
                    this.code = null
                }
            },
            immediate: true
        },
        name: function(n, o) {
            this.filterSellingProccess = this.allSellingProccess.filter((p) => {
                if ((n !== '') && n) {
                    return p.name.includes(n)
                }
            })
        },
        code: function(n, o) {
            this.filterSellingProccess = this.allSellingProccess.filter((p) => {
                return p.code == n;
            })
            console.log(this.filterSellingProccess);
        },
        filterSellingProccess: function(n, o) {
            if (n && (n.length > 0)) {
                this.sellingProccess = n;
            } else {
                this.sellingProccess = this.allSellingProccess
            }
        }
    },
    mounted: function() {
        this.pringAll();
        let updateProductValue = this.updateProductValue
        document.addEventListener('keypress', function(e) {
            if (e.key == "Enter") {
                updateProductValue()
            }
        })
    }
}

export default () => {
    return fetch('./appContent/components/selling/display/index.html')
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