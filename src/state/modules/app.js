import {config} from '@/config'

const state = {
  //config:config,
  user_preferences: {},
  node: null,
  property: null,
  history:[],
  historyIndex:-1
}

const getters = {
  /*
  getConfig(state) {
    return state.config;
  },
  */
  getUserPreferences(state) {
    return state.user_preferences;
  },
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
  }
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
  }
}

const module = {
  namespaced: false,
  state,
  getters,
  mutations,
  actions
};

export default module;
