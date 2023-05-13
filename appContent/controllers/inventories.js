const controller = require('./controller/index')
const productsController = require('./productsController')

module.exports.addInventories = (values) => {
    return new Promise((resolve, reject) => {
        controller.insert('inventories', values, (r) => {
            resolve(r)
        })
    })
}
module.exports.claculat = (date, date2) => {
    var conditions = {}
    var conditionsDebt = {}
    if (date) {
        conditions.created_at = [{ v: date, o: '>=' }]
        conditionsDebt.created_at = [{ v: date, o: '>=' }]
        if (date2) {
            conditions.created_at = [{ v: date, o: '>=' }, { v: date2, o: '<=' }]
            conditionsDebt.created_at = [{ v: date, o: '>=' }, { v: date2, o: '<=' }]
        }
    } else {
        conditions.clacualted = [{ v: 0, o: '=' }]
        conditionsDebt.clacualted = [{ v: 0, o: '=' }]
    }
    conditionsDebt.paid = [{ v: 0, o: '=' }]
    return new Promise((resolve, reject) => {
        controller.columnSumWhere('buying_payments', 'totall', conditions, (rb) => {
            var costs = rb[0].sum;
            controller.columnSumWhere('selling_payments', 'totall', conditions, (rs) => {
                var sells = rs[0].sum
                controller.columnSumWhere('debt', 'totall', conditionsDebt, (rc) => {
                    var debt = rc[0].sum
                    controller.columnSumWhere('expenses', 'totall', conditions, (re) => {
                        var expenses = re[0].sum;
                        if (!date) controller.update('buying_payments', { clacualted: 1 }, { clacualted: { o: "=", v: 0 } }, (r1) => {
                            controller.update('selling_payments', { clacualted: 1 }, { clacualted: { o: "=", v: 0 } }, (r2) => {
                                controller.update('debt', { clacualted: 1 }, { clacualted: { o: "=", v: 0 }, paid: { o: "=", v: 0 } }, (r3) => {
                                    controller.update('expenses', { clacualted: 1 }, { clacualted: { o: "=", v: 0 } }, async(r3) => {
                                        costs = costs ? costs : 0;
                                        sells = sells ? sells : 0;
                                        debt = debt ? debt : 0;
                                        expenses = expenses ? expenses : 0;
                                        await this.addInventories({ costs: costs, sells: sells, debt: debt, expenses: expenses, reguler: 1 })
                                        resolve({ costs: costs, sells: sells, debt: debt, expenses: expenses })
                                    })
                                })
                            })
                        })
                        else
                            resolve({ costs: costs, sells: sells, debt: debt, expenses: expenses })
                    })
                })
            })
        })
    })
}
module.exports.allInventories = () => {
    return new Promise((resolve, reject) => {
        controller.selectAllOrderedBy('inventories', 'created_at', 'DESC', (r) => {
            resolve(r)
        })
    })
}
module.exports.deletInventory = async(id) => {
    return new Promise((resolve, reject) => {
        controller.delet('inventories', { id: { o: '=', v: id } }, (r) => {
            resolve(r)
        })
    })
}