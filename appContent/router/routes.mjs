import buyingProcess from "../components/buyingProcess/add/index.js";
import allBuyingProcess from "../components/buyingProcess/display/index.js";
import allProducts from "../components/products/display/index.js";
import indexSelling from "../components/selling/index/index.js";
import allSellingProcess from "../components/selling/display/index.js";
import addDebt from "../components/debt/add/index.js";
import allDebt from "../components/debt/display/index.js";
import addExpenses from "../components/expenses/add/index.js";
import allExpenses from "../components/expenses/display/index.js";
import invetory from "../components/inventory/index/index.js";
import invetories from "../components/inventory/display/index.js";
const routes = [
    { path: '/buying-process', component: buyingProcess() },
    { path: '/all-buying-process', component: allBuyingProcess() },
    { path: '/all-products', component: allProducts() },
    { path: '/selling-index', component: indexSelling() },
    { path: '/all-selling-process', component: allSellingProcess() },
    { path: '/add-debt', component: addDebt() },
    { path: '/all-debt', component: allDebt() },
    { path: '/add-expenses', component: addExpenses() },
    { path: '/all-expenses', component: allExpenses() },
    { path: '/inventory', component: invetory() },
    { path: '/inventories', component: invetories() },
]
export default routes