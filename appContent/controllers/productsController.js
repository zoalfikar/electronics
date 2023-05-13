const controller = require('./controller/index')
module.exports.insertBuyingProcess = function(nameE, codeE, quantityE, totallE, priceE, sellingPriceE, descriptionE, swal) {
    var sql = `
    INSERT INTO buying_payments (
        name,
        code,
        quantity,
        price,
        sellingPrice,
        totall,
        description
    )
    VALUES 
    (
        "${nameE}","${codeE}",${quantityE},${priceE},${sellingPriceE},${totallE},"${descriptionE}"
    )
    `
    controller.uniqeColumn('products', 'code', codeE,
        (r) => {
            controller.insert('products', { name: nameE, code: codeE, quantity: quantityE, price: priceE, sellingPrice: sellingPriceE, description: descriptionE }, () => {
                controller.mysqlConect(sql, function(r) {
                    swal('تم')
                    console.log("data inserted");
                })
            })
        },
        async function(r) {
            return new Promise((resolve, reject) => {
                resolve(r)
            }).then((re) => {
                var opt;
                var product = re[0];
                var cond = String(product.sellingPrice) == String(sellingPriceE);
                if (cond) {
                    opt = {
                        save: "حفظ",
                    }
                } else {
                    opt = {
                        save: "حفظ",
                        saveOld: "حفظ القيمة القديمة"
                    }
                }
                var text = `  هذا المنتج موجود مسبقا باسم ${product.name}
                                ${cond ?
                                    'بنفس السعر المدخل' 
                                    :
                                    'بسعر مبيع ' +product.sellingPrice +' ل.س '
                            }
                                `
                swal(text, {
                        dir: 'rtl',
                        buttons: opt,
                    })
                    .then((value) => {
                        switch (value) {
                            case "save":
                                updateP(product.id, { name: nameE, description: descriptionE, price: priceE, sellingPrice: sellingPriceE, quantity: parseInt(product.quantity) + parseInt(quantityE) })
                                controller.mysqlConect(sql, function(r) {
                                    console.log("data inserted");
                                })
                                swal("تم", "تم ادخال البيانات بشكل صحيح", "success");
                                break;
                            case "saveOld":
                                updateP(product.id, { quantity: parseInt(product.quantity) + parseInt(quantityE) })
                                controller.mysqlConect(sql, function(r) {
                                    console.log("data inserted");
                                })
                                swal("تم", "تم   الابقاء على القيمة القديمة", "success");
                                break;
                            default:
                                return 0;

                        }
                    });
            })
        })
}
module.exports.pringAllBuyingProcess = () => {
    return new Promise((resolve, reject) => {
        controller.selectAllOrderedBy('buying_payments', 'created_at', 'DESC', (r) => {
            resolve(r)
        })
    })
}
module.exports.selectProcessId = (id, func) => {
    controller.selectId("buying_payments", id, func);
}
module.exports.deleteProcessId = (id) => {
    return new Promise((resolve, reject) => {
        this.selectProcessId(id, (proc) => {
            var process = proc[0]
            if (!process.code) {
                resolve({ code: null })

            } else {
                this.selectProductCode(process.code,
                    (prod) => {
                        var product = prod[0]
                        var quantity = product.quantity - process.quantity;
                        if (quantity >= 0) {
                            this.updateProductId(product.id, { quantity: quantity },
                                (r) => {
                                    controller.delet("buying_payments", { id: { o: '=', v: id } }, (r2) => {
                                        resolve({ q: quantity, processId: process.id, productId: product.id, code: product.code })
                                    })
                                }
                            )
                        } else {
                            resolve({ q: quantity, code: process.code })
                        }

                    })
            }

        })
    })
}
module.exports.asynicUpdateProcess = (id, QP) => {
    var changeProduct = 0;
    if (QP.changeProduct !== null) {
        changeProduct = QP.changeProduct
        delete QP.changeProduct
    }
    return new Promise((resolve, reject) => {
        if ((QP.quantity !== null) && (QP.quantity >= 0)) {
            if (!QP.code) {
                throw ('code is requir when updating quantity')

            }
            this.selectProductCode(QP.code, (p) => {
                var product = p[0];
                this.selectProcessId(id, (pros) => {
                    var process = pros[0]
                    var newQuantity = product.quantity + (QP.quantity - process.quantity);
                    console.log(newQuantity);
                    this.updateProductId(product.id, { quantity: newQuantity }, (res) => {
                        controller.update("buying_payments", QP, { id: { o: '=', v: id } }, (r) => {
                            console.log("data updated");
                            resolve(r)
                        })
                    })

                })

            })
        } else {
            if ((QP.price !== null) && (changeProduct)) {
                if (!QP.code) {
                    throw ('code is requir when updating product')
                }
                this.updateProductByCode(QP.code.toString(), { price: QP.price }, (res) => {

                    controller.update("buying_payments", QP, { id: { o: '=', v: id } }, (r) => {
                        console.log("data updated");
                        resolve(r)
                    })
                })


            } else {
                controller.update("buying_payments", QP, { id: { o: '=', v: id } },
                    (r) => {
                        console.log("data updated");
                        resolve(r)
                    })
            }

        }
    })
}

//// products 


module.exports.updateProduct = (id, QP) => {
    controller.update("products", QP, { id: { o: '=', v: id } }, (r) => {
        console.log("data updated");
    })
}
module.exports.updateProductId = (id, QP, func) => {

    controller.update("products", QP, { id: { o: '=', v: id } }, func)
}
module.exports.updateProductByCode = (code, QP, func) => {
    controller.update("products", QP, { code: { o: '=', v: code } }, func)
}
module.exports.deleteProductId = (id, func) => {
    controller.delet("products", { id: { o: '=', v: id } }, func)
}
module.exports.selectProductId = (id, func) => {
    controller.selectId("products", id, func);
}
module.exports.selectProductCode = (code, func) => {
    controller.select("products", { code: code }, func);
}
module.exports.asynicUpdateProduct = (id, QP) => {
    var o = {};
    if (QP.quantity) {
        o.quantity = QP.quantity;
    }
    if (QP.sellingPrice) {
        o.sellingPrice = QP.sellingPrice;
    }
    if (QP.description) {
        o.description = QP.description;
    }
    if (QP.price) {
        o.price = QP.price;
    }
    if (QP.name) {
        o.name = QP.name;
    }
    if (QP.code) {
        o.code = QP.code;
    }
    return new Promise((resolve, reject) => {

        if (o.code) {
            controller.uniqeColumn('products', 'code', o.code, (r) => {
                controller.update("products", o, { id: { o: '=', v: id } }, (r) => {
                    console.log("data updated");
                    resolve(r)
                })
            }, (r) => {
                console.log("data not updated");
                reject('موجود مسبقا')
            })
        } else {
            controller.update("products", o, { id: { o: '=', v: id } }, (r) => {
                console.log("data updated");
                resolve(r)
            })
        }
    })

}

module.exports.pringAllProducts = () => {
    return new Promise((resolve, reject) => {
        controller.selectAllOrderedBy('products', 'created_at', 'DESC', (r) => {
            resolve(r)
        })
    })
}
let updateP = this.updateProduct;