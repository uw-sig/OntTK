import {config as config} from './config.js';
/*
import Vue from 'vue';
import VueResource from 'vue-resource';

Vue.use(VueResource);
*/

export default class {
  constructor(endpoint)
  {
    if(endpoint === undefined)
    {
      this.endpoint = config.sparql_endpoint.url;
    } else {
      this.endpoint = endpoint;
    }
  }
  search(term,callback) {
    // get the search query
    var query = config.search_query(term);
    //d3sparql.query(this.endpoint, query, callback/*this.search_result_formatter*/)
  }
  search_result_formatter(json)
  {
    var resultArray = []
    var bindingArray = json.results.bindings;
    for(var bindingArrayIndex in bindingArray)
    {
      var varList = bindingArray[bindingArrayIndex];
      var result = new SearchResult(varList["literal"].value,varList["subject"].value,
        varList["property"].value,varList["score"].value);
      resultArray.push(result);
      /*
      for(var variable in varList)
      {
        console.log(variable+":"+varList[variable].value); //NOTE other info available besides value (like type)

      }
      */
    }
    console.log(resultArray);
  }
  query(queryString, resulttype, success_function, error_function)
  {
    var accept,datatype;
    if(resulttype === "xml")
    {
      accept = "application/rdf+xml; charset=utf-8";
      datatype = "xml";
    }
    else if(resulttype === "json")
    {
      accept = "application/sparql-results+json; charset=utf-8";
      datatype = "json";
    }

    // Note, we are not currently using the "datatype" field
    var options = {
      params: {query: queryString},
      headers: {Accept:accept},
      //responseType: 'json'
    };

    var queryUrl = this.endpoint;//+"?query="+encodeURIComponent(queryString);
    Vue.http.get(queryUrl,options).then(response => success_function, response => error_function);
    /*
    $j.ajax({
      headers: {
        Accept: accept
      },
      dataType: datatype,
      url: queryUrl,
      success: success_function,
      error: error_function,
    });
    */
  }

  getPropertyDisplayName(propertyName)
  {
    propertyName = propertyName.replace(/_/g,' ');
    return propertyName.charAt(0).toUpperCase() + propertyName.substr(1);
  }

  cleanXML(node)
  {
    for(var n = 0; n < node.childNodes.length; n ++)
    {
      var child = node.childNodes[n];
      if
      (
        child.nodeType === 8
        ||
        (child.nodeType === 3 && !/\S/.test(child.nodeValue))
      )
      {
        node.removeChild(child);
        n --;
      }
      else if(child.nodeType === 1)
      {
        this.cleanXML(child);
      }
    }
  }

  test(input)
  {
    alert('test of '+input);
  }
}
