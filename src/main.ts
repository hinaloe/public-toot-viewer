// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VCA, {createApp, h} from '@vue/composition-api'
import App from './App.vue'

import 'bootstrap/dist/css/bootstrap.css'

Vue.use(VCA)
Vue.config.productionTip = false

const app = createApp({
  render: () => h(App),
})
app.mount('#app')
