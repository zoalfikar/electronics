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
            if (productName && productCode && (quantity >= 0) && (totall >= 0) && (price >= 0) && sellingPrice)
                funcInsert()

            else $('.errorMessage').html('مطلوب');
        }
    },
    watch: {
        totall: function(nt, ot) {
            if (this.quantity && nt >= this.quantity) {
                this.price = parseInt(nt / this.quantity)
            } else {
                this.price = 0
            }
        },
        quantity: function(nt, ot) {
            if (nt && this.totall >= nt) {
                this.price = parseInt(this.totall / nt)
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