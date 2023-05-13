const comp = {
    data() {
        return {
            name: null,
            phone: null,
            totall: null,
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
            var name = this.name;
            var phone = this.phone;
            var totall = this.totall;
            var description = this.description
            let funcInsert = async() => {
                var ok = await controllers.expensesAndDebts.addDebt({
                    name: name,
                    phoneNumber: phone,
                    totall: totall,
                    description: description
                })
                if (ok) {
                    swal('تم')
                }
            }
            if (name && (totall >= 0) && (totall !== null))
                funcInsert()

            else $('.errorMessage').html('مطلوب');
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
    return fetch('./appContent/components/debt/add/index.html')
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