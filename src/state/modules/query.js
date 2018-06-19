import {config} from '@/config'

import Vue from 'vue';
//import VueResource from 'vue-resource';
//Vue.use(VueResource);
const state = {
	'endpoint': config.sparql_endpoint.url,
	'queries': config.queries
}

const getters = {
	'getEndpoint': state => {
		return state.endpoint;
	},
	'getQueries': state => {
		return state.queries;
	}
}

const mutations = {}

const actions = {
	/*
	query: function (context,queryInfo) {
		var queryString = queryInfo.query;
		var successCallback = queryInfo.successCallback;
		var errorCallback = queryInfo.errorCallback;
		//queryString,successCallback,errorCallback
		var promise = context.sendquery(queryString);
		promise.then((results) => {
			successCallback(results);
		}).catch((errors) => {
			errorCallback(errors.statusText);
		});
	},
	*/
  query: function(context,queryObject)//queryString, resulttype, success_function, error_function)
  {
    var queryString = queryObject.query;
    var resultType = queryObject.resultType;
		if(resultType==null)
		{
			resultType = "json"
		}
    //var success_function = queryObject.success_function;
    //var error_function = queryObject.error_function;
    var accept,datatype;
    if(resultType === "xml")
    {
      accept = "application/rdf+xml; charset=utf-8";
      //datatype = "xml";
    }
    else if(resultType === "json")
    {
      accept = "application/sparql-results+json; charset=utf-8";
      //datatype = "json";
    }
		/*
		else if(resultType === "json-ld"){
			accept = "application/ld+json"
		}*/

    // Note, we are not currently using the "datatype" field
    var options = {
      params: {query: queryString},
      headers: {Accept:accept},
      //responseType: 'json'
    };

    var queryUrl = this.getters.getEndpoint;//+"?query="+encodeURIComponent(queryString);
    //var http = this.getters.getHttp();
    return Vue.http.get(queryUrl,options).then((response) => Promise.resolve(response.data))
      .catch((error) => Promise.reject(error));
      /*
    Vue.http.get(queryUrl,options).then(
      response => success_function, response => error_function
    );
    */
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
