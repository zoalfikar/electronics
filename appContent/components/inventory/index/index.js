const comp = {
    data() {
        return {
            selectMode: true,
            inventory: null,
            costs: null,
            sells: null,
            debt: null,
            expenses: null,
            noExpenses: 'no',
            noDebt: 'no',
            noCost: 'no',
            date: undefined,
            date2: null,
            currencyFormat: currencyFormat,
        }
    },
    computed: {
        profit: function() {
            return this.sells - (
                ((this.noCost == 'no') ? this.costs : 0) +
                ((this.noExpenses == 'no') ? this.expenses : 0) +
                ((this.noDebt == 'no') ? this.debt : 0)
            )
        },

    },
    methods: {
        clearInput: (e) => {
            e.target.value = null
        },
        pringAll: async function(date, date2) {
            if (date !== null) {
                if ((date == undefined) || (date === '')) {
                    await swal('ادخل تاريخ')
                    return 0
                }
                date = date.replace('T', ' ')
                if (date2) {
                    date2 = date2.replace('T', ' ')
                }
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
            this.inventory = await controllers.inventories.claculat(date, date2);
            this.costs = this.inventory.costs ? this.inventory.costs : 0;
            this.sells = this.inventory.sells ? this.inventory.sells : 0;
            this.debt = this.inventory.debt ? this.inventory.debt : 0;
            this.expenses = this.inventory.expenses ? this.inventory.expenses : 0;
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
            if (inventory) {
                var values = {
                    costs: inventory.costs ? inventory.costs : 0,
                    expenses: inventory.expenses ? inventory.expenses : 0,
                    sells: inventory.sells ? inventory.sells : 0,
                    debt: inventory.debt ? inventory.debt : 0,
                }
                await controllers.inventories.addInventories(values)
                var confirm = await swal("تم")
            } else {
                swal('لم يتم إجراء جرد')
            }


        },
    },
    mounted: function() {
        document.addEventListener('keypress', function(e) {
            if ((e.key == 'Enter')) {
                e.preventDefault()
                if ($('.swal-button--confirm').length && (parseInt($('.swal-modal').css('opacity')) == 1))
                    $('.swal-button--confirm')[0].click()
                else $('#save-inventory').click()
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