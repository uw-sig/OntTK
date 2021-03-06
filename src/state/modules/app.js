import {config} from '@/config'
import Vue from 'vue'

const state = {
  //config:config,
  settings: {
    fromLocalStorage:false,
    general:{
      navProperties:config.navProperties, // TODO: centralize nav properties (e.g. not per nav view)
      activeDataViews:[],
      activeNavView:null,
    },
    views:{
      dataViews:{},
      navViews:{},
    }
  },
  /*
  settingsViewMap: {
    dataViews:{},
    navViews:{},
  },
  */
  /*
  settingsReg:{
    DataViews:{},
    NavViews:{},
  },
  */

  node: null,
  property: null,
  history:[],
  historyIndex:-1,
  runningQueries:[],

  allDataViews:[],
  //selectedDataViews:[],
  allNavViews:[],
  //selectedNavViews:[],
}

const getters = {
  /*
  getConfig(state) {
    return state.config;
  },
  */
  getSettings(state) {
    return state.settings;
  },
  getDataViewSettings(state) {
    //return viewName => state.settings.views.dataViews[viewName];
    return state.settings.views.dataViews;
  },
  getNavViewSettings(state){
    return state.settings.views.navViews;
  },

  getActiveDataViews(state){
    return state.settings.general.activeDataViews;
  },
  getActiveNavView(state){
    return state.settings.general.activeNavView;
  },
  settingsFromLocalStorage(state){
    return state.settings.fromLocalStorage;
  },
  //getDataViewSettings: state => viewName => state.settings.views.dataViews[viewName],
  /*
  getDataViewSettings(state) {
    return state.settings.views.dataViews[viewName];
  },
  getNavViewSettings(state,navViewName){
    return state.settings.views.navViews[navViewName];
  },
  */
  /*
  getSettingsViewMap(state){
    return settingsViewMap;
  },
  */
  getNode(state) {
    return state.node;
  },
  getProperty(state) {
    return state.property;
  },
  getHasHistoryForward(state) {
    return (state.history.length>state.historyIndex+1) ? true : false;
  },
  getHasHistoryBackward(state) {
    return (state.historyIndex>0) ? true : false;
  },
  getNextNodeForwardLabel(state){
    var nextForwardNode = state.history[state.historyIndex+1];
    if(nextForwardNode !== undefined){
      return nextForwardNode.label;
    }
    else {
      return '';
    }
  },
  getNextNodeBackwardLabel(state){
    var nextBackwardNode = state.history[state.historyIndex-1];
    if(nextBackwardNode !== undefined){
      return nextBackwardNode.label;
    }
    else {
      return '';
    }
  },

  getAllDataViews(state){
    return state.allDataViews;
  },
  getAllNavViews(state){
    return state.allNavViews;
  },
  getLoading(state){
    if(state.runningQueries && state.runningQueries.length){
      return true;
    }
    return false;
  }

  /*
  getSelectedDataViews(state){
    return state.settings.general.selectedDataViews;
  },
  getSelectedNavViews(state){
    return state.settings.general.selectedNavViews;
  }
  */
}

const mutations = {
  setNode(state,node)
  {
    state.node = node;
  },
  setProperty(state,property)
  {
    state.property = property;
  },
  setAllDataViews(state, views){
    state.allDataViews = views;
  },
  setAllNavViews(state, views){
    state.allNavViews = views;
  },
  /*
  setSettings(state,settings){
    state.settings = settings;
  },
  */
  setActiveDataViews(state, views){
    state.settings.general.activeDataViews = views;
  },
  setActiveNavView(state, view){
    state.settings.general.activeNavView = view;
  },

  addDataViewSettings(state,settingsEntry){
    var name = settingsEntry.name;
    var settings = _.cloneDeep(settingsEntry.settings);
    Vue.set(state.settings.views.dataViews, name, settings);
    //state.settings.views.dataViews[name]=settings;
  },
  addNavViewSettings(state,settingsEntry){
    var name = settingsEntry.name;
    var settings = _.cloneDeep(settingsEntry.settings);
    Vue.set(state.settings.views.navViews, name, settings);
    //state.settings.views.navViews[name]=settings;
  },
  initializeSettings(state) {
		// Check if the ID exists
		if(localStorage.getItem('settings')) {
			state.settings = JSON.parse(localStorage.getItem('settings'));
      state.settings.fromLocalStorage=true;
      //console.log("settings =  "+JSON.stringify(state.settings));
		}
	},
  setQueryStarted(state,queryID) {
    state.runningQueries.push(queryID);
  },
  setQueryFinished(state,queryID) {
    _.pull(state.runningQueries,queryID);
  },
  /*
  setNodeWithHistory(state,node){
    state.node = node;
    //add to history (clear all previous history after this node)
    state.historyIndex++;
    state.history.length = state.historyIndex;
    state.history.push(node);
  },
  */
  /*
  setLoading(state,isLoading){
    state.loading=isLoading;
  }
  */
  /*
  addDataViewSettings(state,settingsEntry){
    state.settings = settings;
  },
  addNavViewSettings(state,settingsEntry){
    state.settings = settings;
  },

  addSettingsViewMap(state,mapEntry){
    // TODO,you are here!
    var viewType = mapEntry.viewType;
    var view = mapEntry.view;
    var settingsObj = mapEntry.settings;

    var viewMapInfo = mapEntry.mapInfo
  }
  */
}

const actions = {
  /*
  setNodeByIRI(context,iri){
    context.dispatch('query')
  },
*/
  setNodeWithHistory(context,node){
    context.state.node = node;
    //add to history (clear all previous history after this node)
    context.state.historyIndex++;
    context.state.history.length = context.state.historyIndex;
    context.state.history.push(node);
  },
  historyForward: function(context){
    context.state.historyIndex++;
    var toNode = context.state.history[context.state.historyIndex];
    context.state.node = toNode;
  },
  historyBackward: function(context){
    context.state.historyIndex--;
    var toNode = context.state.history[context.state.historyIndex];
    context.state.node = toNode;
  },
  storeSettings: function(context){
    localStorage.setItem('settings', JSON.stringify(context.state.settings));
  },
  clearStoredSettings: function(context){
    // clear local storage
    localStorage.removeItem('settings');

    // tell all views to load init settings
    var activeNavView = context.state.settings.general.activeNavView;
    //activeNavView.reinit();
    //TODO: finish/redo the above logic of resetting settings to default

    //temp solution
    window.location.reload(true);
  }

  /*
  settingsRegister(context,settingsReg){
    //alert("asdfasd"+JSON.stringify(settingsReg));
    var type = settingsReg.type;
    var name = settingsReg.name;
    var settings = settingsReg.settings;
    if(type==="DataView"){
      context.state.settings.views.dataViews[name]=settings;
    }
    else if(type==="NavView"){
      context.state.settings.views.navViews[name]=settings;
    }
  }
  */
}

const module = {
  namespaced: false,
  state,
  getters,
  mutations,
  actions
};

export default module;
