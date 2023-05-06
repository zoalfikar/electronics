import routes from "./router/routes.mjs";
const app = Vue.createApp({
    data() {
        return {
            title: null,
            filter: false,
            alter: false,
        }
    },
    methods: {
        goto: function(url, title) {
            this.title = title
            router.push(url)
        }
    },
    mounted: function() {
        document.querySelectorAll('.navigation button').forEach((b, key) => {
            b.addEventListener('click', (e) => {
                $('.navigation button').removeClass('active')
                $(e.target).addClass('active')
            })
            if (key == 0) {
                $(b).click()
            }
        })

    }
})
const router = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(),
    routes
})
app.use(router)
app.mount('#app');
window.mainVueApp = app;