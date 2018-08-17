import {config} from '@/config'
import Vue from 'vue'

const state = {
  //config:config,
  settings: {
    general:{
      selectedDataViews:[],
      selectedNavViews:[],
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

  //allDataViews:[],
  //selectedDataViews:[],
  //allNavViews:[],
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
  /*
  getAllDataViews(state){
    return state.allDataViews;
  },
  getAllNavViews(state){
    return state.allNavViews;
  },
  */
  getSelectedDataViews(state){
    return state.settings.general.selectedDataViews;
  },
  getSelectedNavViews(state){
    return state.settings.general.selectedNavViews;
  }
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
  setSettings(state,settings){
    state.settings = settings;
  },
  setSelectedDataViews(state, views){
    state.settings.general.selectedDataViews = views;
  },
  setSelectedNavViews(state, views){
    state.settings.general.selectedNavViews = views;
  },

  addDataViewSettings(state,settingsEntry){
    var name = settingsEntry.name;
    var settings = settingsEntry.settings;
    Vue.set(state.settings.views.dataViews, name, settings);
    //state.settings.views.dataViews[name]=settings;
  },
  addNavViewSettings(state,settingsEntry){
    var name = settingsEntry.name;
    var settings = settingsEntry.settings;
    Vue.set(state.settings.views.navViews, name, settings);
    //state.settings.views.navViews[name]=settings;
  }
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
  setNodeByIRI(context,iri){
    context.dispatch('query')
  },
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
