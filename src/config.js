
/*
var facebase = {
  dataset_url: function getDatasetURL(class_iri){
    var encoded_class_iri = encodeURIComponent(class_iri);
    return `
    https://www.facebase.org/ermrest/catalog/1/entity/vocabulary:anatomy/iri=${encoded_class_iri}/sample/dataset
    `
  }
};
*/

import {queries} from './queries'

var config = {
  // info needed at start-up
  init: {
    node:{label:"Mandible",iri:"http://purl.org/sig/ont/fma/fma52748"},
    //propertyIndex: 0
  },

  // trees to include
  navProperties: [
    {iri: 'http://www.w3.org/2000/01/rdf-schema#subClassOf',label: 'subclass of', inv: true},
    {iri:'http://purl.org/sig/ont/cpo/part', label:'part', inv:false},

    /*
    {iri: 'http://purl.org/sig/ont/cpo/regional_part', label: 'regional part', inv: false},
    {iri: 'http://www.w3.org/2000/01/rdf-schema#subClassOf',label: 'subclass of', inv: true},
    {iri:'http://purl.org/sig/ont/cpo/part', label:'part', inv:false},
    */
  ],

  dataViews:[
    'description.vue','facebase.vue','images.vue'
  ],

  // info to show in content area
  browser_property_prefs:["preferred_name","synonym","non-English_equivalent","definition","mapsTo"],
  browser_property_exclusions:["part","part_of","verified","verified_by"],

  // server communication
  sparql_endpoint: {url:"http://xiphoid.biostr.washington.edu:3030/ocdm/sparql"},
  search:{query:queries.search_query,fields:['term','species']},
  iri_search:{query:queries.iri_query},
  queries: queries,

  // layout
  all_trees_width:16, // out of 24

  // modules to include
  //modules:[{"title":"Info","path":"@/components/NodeInfo"}, {"title":"Images","path":"@/components/Images"}]
};

export {config};
