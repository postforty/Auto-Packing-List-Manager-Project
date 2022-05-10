import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import mixin from './mixins'
import VueSweetalert2 from 'vue-sweetalert2'
import VueLoading from 'vue-loading-overlay'
import { XLSX } from 'xlsx'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.js'
import 'sweetalert2/dist/sweetalert2.min.css'
import 'vue-loading-overlay/dist/vue-loading.css'

const app = createApp(App)
app.use(store)
app.use(router)
app.use(XLSX)
app.use(VueSweetalert2)
app.use(VueLoading)
app.mixin(mixin)

app.mount('#app')
