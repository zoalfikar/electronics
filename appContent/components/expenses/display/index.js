const comp = {
    data() {
        return {
            expenses: null,
            filterExpenses: null,
            allExpenses: null,
            name: null,
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
            var expenses = await controllers.expensesAndDebts.allExpenses();
            this.allExpenses = expenses;
            this.expenses = this.allExpenses;
        },
        deleteProcessConfirm: async function(id) {
            await swal({
                title: "تاكيد",
                text: "هل انت متاكد من حذف  المصروف",
                icon: "warning",
                button: "تاكيد"
            })
            this.deleteProcess(id)
        },
        deleteProcess: async function(id) {
            var result = await controllers.expensesAndDebts.deletExpenses(id)
            if (result) {
                this.updateFrontEnd(id)
                swal(" تم الحذف")
            }
        },
        updateFrontEnd: function(id) {
            this.expenses = this.expenses.filter((bp) => {
                return bp.id !== id
            });
            this.allExpenses = this.allExpenses.filter((bp) => {
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
        updateProcessValue: function() {
            if (this.alter) {
                var ExpensesId = $(this.currentCell).parents('tr').attr('id');
                var newValue = $(this.currentCell).children('.input').val();
                var isNameCell = $(this.currentCell).hasClass("ntd")
                var isTotallCell = $(this.currentCell).hasClass("ttd")
                var isDescriptionCell = $(this.currentCell).hasClass("dtd")
                var expenses = this.expenses.find((p) => {
                    return p.id == ExpensesId
                })
                if (newValue) {

                    if (isNameCell) controllers.expensesAndDebts.updateExpenses(ExpensesId, { name: newValue }).then((v) => {
                        expenses.name = newValue;
                        swal('تم التعديل')
                    })
                    if (isTotallCell) {
                        if (!isNaN(newValue) && (newValue >= 0)) {
                            controllers.expensesAndDebts.updateExpenses(ExpensesId, { totall: newValue }).then(
                                (v) => {
                                    expenses.totall = newValue;
                                    swal('تم التعديل')
                                }
                            )
                        }

                    }

                }
                if (isDescriptionCell) controllers.expensesAndDebts.updateExpenses(ExpensesId, { description: newValue }).then(
                    (v) => {
                        expenses.description = newValue;
                        swal('تم التعديل')
                    })

            }

        },
    },
    watch: {
        filter: {
            handler(n, o) {
                if (!n) {
                    this.expenses = this.allExpenses
                    this.name = null
                }
            },
            immediate: true
        },
        name: function(n, o) {
            this.filterExpenses = this.allExpenses.filter((p) => {
                if ((n !== '') && n) {
                    return p.name.includes(n)
                }
            })
        },
        filterExpenses: function(n, o) {
            if (n && (n.length > 0)) {
                this.expenses = n;
            } else {
                this.expenses = this.allExpenses
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
    return fetch('./appContent/components/expenses/display/index.html')
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