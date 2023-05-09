import routes from "./router/routes.mjs";
const app = Vue.createApp({
    data() {
        return {
            title: null,
            filter: false,
            alter: false,
            alterPassword: null
        }
    },
    computed: {
        alterPasswordCorrect: function() {
            return this.alterPassword == config.alterPassword
        }
    },
    methods: {
        goto: function(url, title) {
            this.title = title
            router.push(url)
        },
        setAlter: function() {
            if (this.alter)
                this.alter = false
            if ($('#check-alter-password-groub').css('display') == 'none')
                $('#check-alter-password-groub').css('display', 'inline')
            else {
                $('#check-alter-password-groub').css('display', 'none')
                this.alterPassword = null
            }
        },
        checkAlterPassword: function() {
            if (this.alterPasswordCorrect) {
                this.alter = true
                this.alterPassword = '***************'
            } else {
                swal('كلمة المرور خاطئة')
            }
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