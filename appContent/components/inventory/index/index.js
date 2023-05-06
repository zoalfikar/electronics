const comp = {
    data() {
        return {
            selectMode: true,
            inventory: null,
            costs: null,
            sells: null,
            debt: null,
            expenses: null,
            profit: null,
            noExpenses: false,
            noDebt: false,
            noCost: false,
            date: undefined,
        }
    },
    methods: {
        clearInput: (e) => {
            e.target.value = null
        },
        pringAll: async function(date) {
            if (date !== null) {
                if (date == undefined) {
                    await swal('ادخل تاريخ')
                    return 0
                }
                date = date.replace('T', ' ') + ':00'
                this.selectMode = true
            } else {
                this.selectMode = false
                var confirm = await swal({
                    title: 'تاكيد',
                    text: `
                سيتم تعليم جميع السجلات الغير محسوبة ك سجلات تم حسابها 
                وإضافة نسخة من الجرد الى الارشيف`
                })
                if (!confirm) {
                    return 0
                }
            }
            this.inventory = await controllers.inventories.claculat(date);
            this.costs = this.inventory.costs ? this.inventory.costs : 0;
            this.sells = this.inventory.sells ? this.inventory.sells : 0;
            this.debt = this.inventory.debt ? this.inventory.debt : 0;
            this.expenses = this.inventory.expenses ? this.inventory.expenses : 0;
            this.profit = this.sells - (this.costs + this.expenses + this.debt)
        },
        archivConfirm: async function() {
            var confirm = await swal({
                title: "تاكيد",
                button: "نعم"
            })
            if (confirm) {
                this.archive()
            }
        },
        archive: async function() {
            var inventory = this.inventory
            var values = {
                costs: inventory.costs ? inventory.costs : 0,
                expenses: inventory.expenses ? inventory.expenses : 0,
                sells: inventory.sells ? inventory.sells : 0,
                debt: inventory.debt ? inventory.debt : 0
            }
            await controllers.inventories.addInventories(values)
            var confirm = await swal("تم")
        },
    },
    watch: {
        noExpenses: function(n, o) {
            if (n == 'yes') {
                this.profit = this.profit + this.expenses;
            } else {
                this.profit = this.profit - this.expenses;
            }
        },
        noDebt: function(n, o) {
            if (n == 'yes') {
                this.profit = this.profit + this.debt;
            } else {
                this.profit = this.profit - this.debt;
            }
        },
        noCost: function(n, o) {
            if (n == 'yes') {
                this.profit = this.profit + this.costs;
            } else {
                this.profit = this.profit - this.costs;
            }
        },
    },
    mounted: function() {
        document.addEventListener('keypress', function(e) {
            if ((e.key == 'Enter')) {
                e.preventDefault()
                if ($('.swal-button--confirm').length && (parseInt($('.swal-modal').css('opacity')) == 1))
                    $('.swal-button--confirm')[0].click()
                else $('#sell-production').click()
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
    return fetch('./appContent/components/inventory/index/index.html')
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