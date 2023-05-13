const comp = {
    data() {
        return {
            debt: null,
            filterDebt: null,
            allDebt: null,
            name: null,
            phone: null,
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
            var debt = await controllers.expensesAndDebts.allDebts();
            console.log(debt);
            this.allDebt = debt;
            this.debt = this.allDebt;
        },
        deleteProcessConfirm: async function(id) {
            if (await swal({
                    title: "تاكيد",
                    text: "هل انت متاكد من حذف هذه الدين",
                    icon: "warning",
                    button: "تاكيد"
                }))
                this.deleteProcess(id)
        },
        deleteProcess: async function(id) {
            var result = await controllers.expensesAndDebts.deletDebt(id)
            if (result) {
                this.updateFrontEnd(id)
                swal(" تم الحذف")
            }
        },
        updateFrontEnd: function(id) {
            this.debt = this.debt.filter((bp) => {
                return bp.id !== id
            });
            this.alldDebt = this.alldDebt.filter((bp) => {
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
                var debtId = $(this.currentCell).parents('tr').attr('id');
                var newValue = $(this.currentCell).children('.input').val();
                var isNameCell = $(this.currentCell).hasClass("ntd")
                var isPhoneCell = $(this.currentCell).hasClass("ptd")
                var isTotallCell = $(this.currentCell).hasClass("ttd")
                var isDescriptionCell = $(this.currentCell).hasClass("dtd")
                var debt = this.debt.find((p) => {
                    return p.id == debtId
                })
                if (newValue) {

                    if (isNameCell) controllers.expensesAndDebts.updateDebt(debtId, { name: newValue }).then((v) => {
                        debt.name = newValue;
                        swal('تم التعديل')
                    })
                    if (isTotallCell) {
                        if (!isNaN(newValue) && (newValue >= 0)) {
                            controllers.expensesAndDebts.updateDebt(debtId, { totall: newValue }).then(
                                (v) => {
                                    debt.totall = newValue;
                                    swal('تم التعديل')
                                }
                            )
                        }

                    }

                }
                if (isPhoneCell) controllers.expensesAndDebts.updateDebt(debtId, { phoneNumber: newValue }).then(
                    (v) => {
                        debt.phoneNumber = newValue;
                        swal('تم التعديل')
                    })
                if (isDescriptionCell) controllers.expensesAndDebts.updateDebt(debtId, { description: newValue }).then(
                    (v) => {
                        debt.description = newValue;
                        swal('تم التعديل')
                    })

            }

        },
        paidProcessConfirm: async function(id) {
            if (await swal({
                    title: "تاكيد",
                    text: "هل انت متاكد من سداد هذه الدين",
                    icon: "warning",
                    button: "تاكيد"
                }))
                this.paidProcess(id)
        },
        paidProcess: function(id) {
            controllers.expensesAndDebts.updateDebt(id, { paid: 1 }).then(
                (v) => {
                    this.debt.find((p) => p.id == id).paid = 1;
                    swal('تم التعديل')
                }
            )
        },
        notPaidaidProcessConfirm: async function(id) {
            if (await swal({
                    title: "تاكيد",
                    text: "هل انت متاكد من عدم سداد هذه الدين",
                    icon: "warning",
                    button: "تاكيد"
                }))
                this.notPaidProcess(id)
        },
        notPaidProcess: function(id) {
            controllers.expensesAndDebts.updateDebt(id, { paid: 0 }).then(
                (v) => {
                    this.debt.find((p) => p.id == id).paid = 0;
                    swal('تم التعديل')
                }
            )
        }
    },
    watch: {
        filter: {
            handler(n, o) {
                if (!n) {
                    this.debt = this.allDebt
                    this.name = null
                    this.phone = null
                }
            },
            immediate: true
        },
        name: function(n, o) {
            this.filterDebt = this.allDebt.filter((p) => {
                if ((n !== '') && n) {
                    return p.name.includes(n)
                }
            })
        },
        phone: function(n, o) {
            this.filterDebt = this.allDebt.filter((p) => {
                return p.phoneNumber == n;
            })
        },
        filterDebt: function(n, o) {
            if (n && (n.length > 0)) {
                this.debt = n;
            } else {
                this.debt = this.allDebt
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
    return fetch('./appContent/components/debt/display/index.html')
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