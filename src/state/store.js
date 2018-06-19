import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

import VueResource from 'vue-resource';
Vue.use(VueResource);

//Separate Module States
import app from './modules/app'
import query from './modules/query'
//import {app} from './modules/app'
//import {query} from './modules/query';

export default new Vuex.Store({
  modules: {
    'query': query,
    'app': app
  }
})
