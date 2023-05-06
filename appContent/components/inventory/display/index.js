const comp = {
    data() {
        return {
            inventories: null,
        }
    },
    computed: {
        alter: () => mainVueApp._instance.data.alter,
    },
    methods: {
        pringAll: async function() {
            var inventories = await controllers.inventories.allInventories();
            this.inventories = inventories;
        },
        deleteProcessConfirm: async function(id) {
            await swal({
                title: "تاكيد",
                text: "هل انت متاكد من حذف هذا الارشيف",
                icon: "warning",
                button: "تاكيد"
            })
            this.deleteProcess(id)
        },
        deleteProcess: async function(id) {
            var result = await controllers.expensesAndDebts.deletDebt(id)
            if (result) {
                this.updateFrontEnd(id)
                swal(" تم الحذف")
            }
        },
        updateFrontEnd: function(id) {
            this.inventories = this.inventories.filter((bp) => {
                return bp.id !== id
            });
        },
    },

    mounted: function() {
        this.pringAll()
    }
}

export default () => {
    return fetch('./appContent/components/inventory/display/index.html')
        .then((response) => {
            return response.text();
        })
        .then((html) => {
            return {
                template: html,
                ...comp

            }
        });
};