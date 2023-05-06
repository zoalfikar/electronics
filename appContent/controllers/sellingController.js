const controller = require('./controller/index')
const productsController = require('./productsController')

module.exports.allSellingPayment = () => {
    return new Promise((resolve, reject) => {
        controller.selectAll('selling_payments', (r) => {
            resolve(r)
        })
    })
}
module.exports.addSellingPayment = async(product, quantity, sellingPrice) => {
    return new Promise((resolve, reject) => {
        controller.insert('selling_payments', { name: product.name, code: product.code, quantity: quantity, sellingPrice: sellingPrice }, (rs) => {
            var newQuantity = product.quantity - quantity;
            productsController.updateProductId(product.id, { quantity: newQuantity }, (r) => {
                resolve(r)
            })
        })
    })
}
module.exports.pringAllSellingProcess = () => {
    return new Promise((resolve, reject) => {
        controller.selectAllOrderedBy('selling_payments', 'created_at', 'DESC', (r) => {
            resolve(r)
        })
    })
}
module.exports.selectProcessId = (id, func) => {
    controller.selectId("selling_payments", id, func);
}
module.exports.deleteProcessId = (id) => {
    return new Promise((resolve, reject) => {
        this.selectProcessId(id, (proc) => {
            var process = proc[0]
            if (process.code) {
                productsController.selectProductCode(process.code,
                    (prod) => {
                        var product = prod[0]
                        var quantity = product.quantity + process.quantity;
                        productsController.updateProductId(product.id, { quantity: quantity },
                            (r) => {
                                controller.delet("selling_payments", { id: { o: '=', v: id } }, (r2) => {
                                    resolve({ processId: process.id, productId: product.id, code: product.code })
                                })
                            }
                        )
                    })
            } else {
                resolve({ code: null })
            }

        })
    })
}
module.exports.asynicUpdateProcess = (id, QP) => {
    return new Promise((resolve, reject) => {

        controller.update("selling_payments", QP, { id: { o: '=', v: id } }, (r) => {
            console.log("data updated");
            resolve(r)
        })

    })
}