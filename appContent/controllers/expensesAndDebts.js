2
const controller = require('./controller/index')

module.exports.allDebts = () => {
    return new Promise((resolve, reject) => {
        controller.selectAllOrderedBy('debt', 'created_at', 'DESC', (r) => {
            resolve(r)
        })
    })
}
module.exports.addDebt = async(values) => {
    return new Promise((resolve, reject) => {
        controller.insert('debt', values, (r) => {
            resolve(r)
        })
    })
}
module.exports.deletDebt = async(id) => {
    return new Promise((resolve, reject) => {
        controller.delet('debt', { id: { o: '=', v: id } }, (r) => {
            resolve(r)
        })
    })
}
module.exports.updateDebt = async(id, values) => {
    return new Promise((resolve, reject) => {
        controller.update('debt', values, { id: { o: '=', v: id } }, (r) => {
            resolve(r)
        })
    })
}


// expenses

module.exports.allExpenses = () => {
    return new Promise((resolve, reject) => {
        controller.selectAllOrderedBy('expenses', 'created_at', 'DESC', (r) => {
            resolve(r)
        })
    })
}
module.exports.addExpenses = async(values) => {
    return new Promise((resolve, reject) => {
        controller.insert('expenses', values, (r) => {
            resolve(r)
        })
    })
}
module.exports.deletExpenses = async(id) => {
    return new Promise((resolve, reject) => {
        controller.delet('expenses', { id: { o: '=', v: id } }, (r) => {
            resolve(r)
        })
    })
}
module.exports.updateExpenses = async(id, values) => {
    return new Promise((resolve, reject) => {
        controller.update('expenses', values, { id: { o: '=', v: id } }, (r) => {
            resolve(r)
        })
    })
}