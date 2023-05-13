const comp = {
    data() {
        return {
            productName: null,
            productCode: null,
            quantity: null,
            totall: null,
            price: null,
            sellingPrice: null,
            description: null,
            //
            inputCodeError: null
        }
    },
    methods: {
        clearInput: (e) => {
            e.value = null
        },
        initSubmet: function() {
            $('.errorMessage').html(null);
        },
        submit: function(e) {
            e.preventDefault();
            this.initSubmet();
            var productName = this.productName;
            var productCode = this.productCode;
            var quantity = this.quantity;
            var totall = this.totall;
            var price = this.price;
            var sellingPrice = this.sellingPrice;
            var description = this.description
            let funcInsert = () => {
                controllers.productsController.insertBuyingProcess(
                    productName,
                    productCode,
                    quantity,
                    totall,
                    price,
                    sellingPrice,
                    description, swal)
            }
            if (productName && productCode && ((quantity >= 0) && (quantity !== null)) && ((totall >= 0) && (totall !== null)) && ((price >= 0) && (price !== null)) && sellingPrice)
                funcInsert()

            else $('.errorMessage').html('مطلوب');
        }
    },
    watch: {
        totall: function(nt, ot) {
            if (this.quantity && nt >= this.quantity) {
                this.price = parseFloat(nt / this.quantity).toFixed(2)
            } else {
                this.price = 0
            }
        },
        quantity: function(nt, ot) {
            if (nt && this.totall >= nt) {
                this.price = parseFloat(this.totall / nt).toFixed(2)
            } else {
                this.price = 0
            }
        }
    },
    mounted: function() {
        document.querySelectorAll("input[type='number']").forEach(element => {
            element.addEventListener("keypress", function(evt) {
                if (evt.which != 8 && evt.which != 0 && evt.which < 48 || evt.which > 57) {
                    evt.preventDefault();
                }
            });
        });
        document.addEventListener('keypress', function(e) {

            if ((e.key == 'Enter')) {
                e.preventDefault()
                if ($('.swal-button--confirm').length && (parseInt($('.swal-modal').css('opacity')) == 1))
                    $('.swal-button--confirm')[0].click()
                else $('#submit').click()
            }

        })
    }
}

export default () => {
    return fetch('./appContent/components/buyingProcess/add/index.html')
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