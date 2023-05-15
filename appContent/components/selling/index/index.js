const comp = {
    data() {
        return {
            code: null,
            quantity: null,
            products: null,
            currentProduct: null,
            sellingPrice: null,
            sellingPriceEdite: false,
            tottal: null,
            autoCumpleteArray: null,
            currencyFormat: currencyFormat,
        }
    },
    methods: {
        codeChanged: function(v) {
            this.code = v
        },
        clearInput: (e) => {
            e.target.value = null
        },
        pringAll: async function() {

            this.products = await controllers.productsController.pringAllProducts();
            if (this.products.length !== 0) {
                this.autoCumpleteArray = Object.values(this.products.map(p => p.code));
                let codeChanged = this.codeChanged
                $("#code").autocomplete({
                    source: this.autoCumpleteArray,
                    select: function(event, ui) {
                        codeChanged(ui.item.value.toString())
                    }
                });
            } else {
                $("#code").attr('placeholder', 'لاتوجد بضائع')
            }

        },
        setInfo: function(p) {
            $('.error').text(null)
            this.sellingPrice = p.sellingPrice;
            this.quantity = 1;
        },
        resetInfo: function() {
            this.currentProduct = null;
            this.sellingPrice = null
            this.quantity = null;
            this.tottal = null;
        },
        checkAvailabeQuantity: function() {
            var cond = parseInt(this.quantity) <= parseInt(this.currentProduct.quantity);

            if (cond || !this.quantity)
                $('.quantity-input .quantity-error').text(null)
            else
                $('.quantity-input .quantity-error').text('الكمية غير متوفرة')
            return cond
        },
        claculateTottal: function() {
            if (this.sellingPrice && this.quantity) {
                this.tottal = currencyFormat.format(this.sellingPrice * this.quantity);
            } else {
                this.tottal = null
            }
        },
        initSelling: function() {
            $('.error').text(null)
            if (this.currentProduct) {
                if (this.code && (this.quantity >= 0) && (this.sellingPrice >= 0)) {
                    var cond = parseInt(this.quantity) <= parseInt(this.currentProduct.quantity);
                    if (!cond) {
                        $('.quantity-error').text("الكمية غير متوفرة")
                        return 0
                    }
                } else {
                    $('.error').text("الحقل مطلوب")
                    return 0
                }
            } else {
                $('.code-error').text("لم يتم تحديد منتج")
                return 0
            }
            return true
        },
        sellConfirm: async function() {
            if (this.initSelling()) {
                var confirm = await swal({
                    title: "تاكيد",
                    text: `المنتج : ${this.currentProduct.name}  سعر الواحدة : ${this.sellingPrice} ل.س

                           عدد : ${this.quantity}   سعر إجمالي : ${this.tottal} ل.س`,
                    button: "تاكيد"

                })
                if (confirm) {
                    this.sell()
                }
            }
        },
        sell: async function() {
            var product = JSON.stringify(this.currentProduct)
            product = JSON.parse(product);
            var quantity = this.quantity;
            var sellingPrice = this.sellingPrice;
            await controllers.sellingController.addSellingPayment(product, quantity, sellingPrice)
            this.currentProduct.quantity -= quantity;
            if (this.currentProduct.quantity > 0) {
                swal('تم')
            } else {
                var confirm = await swal({
                    title: "تنبيه",
                    text: " لم تبقى كمية من هذا المنتج هل تريد حذفه ",
                    icon: "warning",
                    dangerMode: true,
                    button: "تاكيد"
                })
                if (confirm) {
                    var pid = this.currentProduct.id
                    this.deleteProduct(pid)
                    this.products = this.products.filter((prod) => {
                        return prod.id !== pid;
                    })
                    this.resetInfo()
                    this.code = null
                }
            }

        },
        deleteProduct: function(id) {
            controllers.productsController.deleteProductId(id)
            swal('تم')
        },
    },
    watch: {
        code: function(n, o) {
            this.currentProduct = this.products.find((p) => {
                return p.code === n;
            })
            if (this.currentProduct) {
                this.setInfo(this.currentProduct)
                this.checkAvailabeQuantity(this.currentProduct)
            } else
                this.resetInfo()
        },
        quantity: function(n, o) {
            if (this.currentProduct)
                if (this.checkAvailabeQuantity())
                    this.claculateTottal()
                else this.tottal = 0
        },
        sellingPrice: function(n, o) {
            this.claculateTottal()
        }
    },
    mounted: function() {
        var ctrlDown = false;
        this.pringAll()
        document.addEventListener('keydown', (e) => {
            if (e.key == 'Shift') {
                e.preventDefault()
                ctrlDown = true
            }
        })
        document.addEventListener('keyup', (e) => {
            if (e.key == 'Shift') {
                e.preventDefault()
                ctrlDown = false
            }
        })
        document.addEventListener('keypress', function(e) {
            if (ctrlDown) {
                if (e.key == 'r' || e.key == 'R' || e.key == "r") {
                    e.preventDefault()
                    $('#code').focus()
                }
                if (e.key == 'q' || e.key == 'Q' || e.key == "ض") {
                    e.preventDefault()
                    $('#quantity').focus()
                }
                if (e.key == 's' || e.key == 'S' || e.key == "س") {
                    e.preventDefault()
                    $('#price').focus()
                }
            } else {
                if ((e.key == 'Enter')) {
                    e.preventDefault()
                    if ($('.swal-button--confirm').length && (parseInt($('.swal-modal').css('opacity')) == 1))
                        $('.swal-button--confirm')[0].click()
                    else $('#sell-production').click()
                }
            }

        })
        document.querySelectorAll("input[type='number']").forEach(element => {
            element.addEventListener("keypress", function(evt) {
                if (evt.which != 8 && evt.which != 0 && evt.which < 48 || evt.which > 57) {
                    evt.preventDefault();
                }
            });
        });
    }
}

export default () => {
    return fetch('./appContent/components/selling/index/index.html')
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