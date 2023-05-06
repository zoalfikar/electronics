const comp = {
    data() {
        return {
            products: null,
            filterPrdocucts: null,
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
            var products = await controllers.productsController.pringAllProducts();
            this.products = products;
            this.allPrdocucts = products;
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
        updateProductValue: function() {
            if (this.alter) {
                var productId = $(this.currentCell).parents('tr').attr('id');
                var newValue = $(this.currentCell).children('.input').val();
                var isNameCell = $(this.currentCell).hasClass("ntd")
                var isCodeCell = $(this.currentCell).hasClass("ctd")
                var isSellingPriceCell = $(this.currentCell).hasClass("std")
                var isDescriptionCell = $(this.currentCell).hasClass("dtd")
                var product = this.products.find((p) => {
                    return p.id == productId
                })
                if (newValue) {
                    if (isNameCell) controllers.productsController.asynicUpdateProduct(productId, { name: newValue }).then((v) => {
                        product.name = newValue;
                        swal('تم التعديل')

                    })
                    if (isCodeCell) controllers.productsController.asynicUpdateProduct(productId, { code: newValue }).then(
                        (v) => {
                            product.code = newValue;
                            swal('تم التعديل')

                        }
                    ).catch((v) => {
                        swal('هذا الرمز موجود مسبقا')
                    })
                    if (isSellingPriceCell) controllers.productsController.asynicUpdateProduct(productId, { sellingPrice: newValue }).then(
                        (v) => {
                            product.sellingPrice = newValue;
                            swal('تم التعديل')
                        })

                }
                if (isDescriptionCell) controllers.productsController.asynicUpdateProduct(productId, { description: newValue }).then(
                    (v) => {
                        product.description = newValue;
                        swal('تم التعديل')

                    }
                )
            }

        }
    },
    watch: {
        filter: {
            handler(n, o) {
                if (!n) {
                    this.products = this.allPrdocucts
                    this.name = null
                    this.code = null
                }
            },
            immediate: true
        },
        name: function(n, o) {
            this.filterPrdocucts = this.allPrdocucts.filter((p) => {
                if ((n !== '') && n) {
                    return p.name.includes(n)
                }
            })
        },
        code: function(n, o) {
            this.filterPrdocucts = this.allPrdocucts.filter((p) => {
                return p.code == n;
            })
        },
        filterPrdocucts: function(n, o) {
            if (n && (n.length > 0)) {
                this.products = n;
            } else {
                this.products = this.allPrdocucts
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
    return fetch('./appContent/components/products/display/index.html')
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