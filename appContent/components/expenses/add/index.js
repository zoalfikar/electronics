const comp = {
    data() {
        return {
            name: null,
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
            var totall = this.totall;
            var description = this.description
            let funcInsert = async() => {
                var ok = await controllers.expensesAndDebts.addExpenses({
                    name: name,
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
    }
}

export default () => {
    return fetch('./appContent/components/expenses/add/index.html')
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