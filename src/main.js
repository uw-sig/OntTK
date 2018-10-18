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
import _ from 'lodash'

Vue.config.productionTip = false

// global registration of View plugins
var allDataViews = loadDataViews();
var allNavViews = loadNavViews();

/* eslint-disable no-new */
new Vue({
  el: '#app',
  data: {
    allDataViews,
    allNavViews
  },
  store: store,
  router,
  template: '<App/>',
  components: { App },

  beforeCreate() {
		this.$store.commit('initializeSettings');
	}
});

function loadDataViews(){
  const context = require.context('@/components/dataViews', true, /\.(js|vue)$/i);
  //console.log("dataview context = "+JSON.stringify(context.keys()));

  // load all data views discovered
  var allDataViews = [];
  context.keys().forEach(function(key){
    var module = context(key);
    if(module.default.extends!=undefined && module.default.extends.name==="DataView"){
      var dataViewComp = Vue.component(module.default.name,module.default);
      allDataViews.push({name:module.default.name,view:dataViewComp,isActive:true});
      //vm.dataViews.push({name:module.default.name,view:module.default,isActive:true});
    }
  });

  return allDataViews;
}

function loadNavViews(){
  const context = require.context('@/components/navViews', true, /\.(js|vue)$/i);
  //console.log("dataview context = "+JSON.stringify(context.keys()));

  // load all data views discovered
  var allNavViews = [];
  context.keys().forEach(function(key){
    var module = context(key);
    if(module.default.extends!=undefined && module.default.extends.name==="NavView"){
      var navViewComp = Vue.component(module.default.name,module.default);
      allNavViews.push({name:module.default.name,view:navViewComp,isActive:true});
      //vm.dataViews.push({name:module.default.name,view:module.default,isActive:true});
    }
  });

  return allNavViews;
}
