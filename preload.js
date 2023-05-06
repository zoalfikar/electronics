const { contextBridge } = require('electron');
contextBridge.exposeInMainWorld('electronics', {
    startInitialization: () => require('./initDatabase.js')
})
contextBridge.exposeInMainWorld('controllers', {
    index: require('./appContent/controllers/controller/index'),
    productsController: require('./appContent/controllers/productsController'),
    sellingController: require('./appContent/controllers/sellingController'),
    expensesAndDebts: require('./appContent/controllers/expensesAndDebts'),
    inventories: require('./appContent/controllers/inventories'),
})