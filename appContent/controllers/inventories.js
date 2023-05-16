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
        conditions.inventoryId = [{ v: null, o: 'is' }]
        conditionsDebt.inventoryId = [{ v: null, o: 'is' }]
    }
    conditionsDebt.paid = [{ v: 0, o: '=' }]
    return new Promise((resolve, reject) => {
        controller.columnSumWhere('buying_payments', 'totall', conditions, (rb) => {
            var costs = rb[0].sum;
            controller.columnSumWhere('selling_payments', 'totall', conditions, (rs) => {
                var sells = rs[0].sum
                controller.columnSumWhere('debt', 'totall', conditionsDebt, (rc) => {
                    var debt = rc[0].sum
                    controller.columnSumWhere('expenses', 'totall', conditions, async(re) => {
                        var expenses = re[0].sum;
                        if (!date) {
                            costs = costs ? costs : 0;
                            sells = sells ? sells : 0;
                            debt = debt ? debt : 0;
                            expenses = expenses ? expenses : 0;
                            var inv = await this.addInventories({ costs: costs, sells: sells, debt: debt, expenses: expenses, reguler: 1 })
                            controller.update('buying_payments', { inventoryId: inv.insertId }, { inventoryId: { v: null, o: 'is' } }, (r1) => {
                                controller.update('selling_payments', { inventoryId: inv.insertId }, { inventoryId: { v: null, o: 'is' } }, (r2) => {
                                    controller.update('debt', { inventoryId: inv.insertId }, { inventoryId: { v: null, o: 'is' }, paid: { o: "=", v: 0 } }, (r3) => {
                                        controller.update('expenses', { inventoryId: inv.insertId }, { inventoryId: { v: null, o: 'is' } }, async(r3) => {
                                            resolve({ costs: costs, sells: sells, debt: debt, expenses: expenses })
                                        })
                                    })
                                })
                            })
                        } else {
                            costs = costs ? costs : 0;
                            sells = sells ? sells : 0;
                            debt = debt ? debt : 0;
                            expenses = expenses ? expenses : 0;
                            resolve({ costs: costs, sells: sells, debt: debt, expenses: expenses })
                        }
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