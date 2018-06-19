// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/en'
import 'element-ui/lib/theme-chalk/index.css'

//import Vuex from 'vuex'
//Vue.use(Vuex)

//import Vuetify from 'vuetify'
//Vue.use(Vuetify)
Vue.use(ElementUI, {locale})

//import VueResource from 'vue-resource'
//Vue.use(VueResource);

import store from './state/store'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store: store,
  router,
  template: '<App/>',
  components: { App }
})
