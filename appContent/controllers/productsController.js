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
                var cond = String(product.name) == String(sellingPriceE);
                if (cond) {
                    opt = {
                        save: "التعديلات حفظ",
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
                                    // swal("تم", "تم ادخال البيانات بشكل صحيح", "success");
                                break;

                            default:
                                updateP(product.id, { price: priceE, quantity: parseInt(product.quantity) + parseInt(quantityE) })
                                controller.mysqlConect(sql, function(r) {
                                        console.log("data inserted");
                                    })
                                    // swal("تم", "تم   الابقاء على القيمة القديمة", "success");
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
                            resolve({ q: quantity })
                        }

                    })
            }

        })
    })
}
module.exports.asynicUpdateProcess = (id, QP) => {
    return new Promise((resolve, reject) => {
        if (QP.quantity) {
            if (!QP.code) {
                throw ('code is requir when updating code')

            }
            this.selectProductCode(QP.code, (p) => {
                var product = p[0];
                this.selectProcessId(id, (pros) => {
                    var process = pros[0]
                    var newQuantity = product.quantity + (QP.quantity - process.quantity);
                    this.updateProductId(product.id, { quantity: newQuantity }, (res) => {
                        controller.update("buying_payments", QP, { id: { o: '=', v: id } }, (r) => {
                            console.log("data updated");
                            resolve(r)
                        })
                    })

                })

            })
        } else {
            controller.update("buying_payments", QP, { id: { o: '=', v: id } },
                (r) => {
                    console.log("data updated");
                    resolve(r)
                })
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