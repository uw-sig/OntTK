import {queries} from './queries'

var config = {
  // info needed at start-up
  title: 'OCDM Browser',
  init: {
    node:{label:"Mandible",iri:"http://purl.org/sig/ont/fma/fma52748"}
  },

  // trees to include
  navProperties: [
    {iri: 'http://www.w3.org/2000/01/rdf-schema#subClassOf',label: 'subclass of', inv: true},
    {iri:'http://purl.org/sig/ont/cpo/part', label:'part', inv:false},
  ],

  navViews: [
    'BidiCarouselCardTree','BidiCarouselTree','BidiMultiTree'
  ],
  initNavView: 'BidiCarouselTree'
  dataViews:[
    'Description','Images','Scenes'
  ],
  initDataView: 'Description',

  // info to show in content area
  browser_property_prefs:["preferred_name","synonym","non-English_equivalent","definition","mapsTo"],
  browser_property_exclusions:["part","part_of","verified","verified_by"],

  // server communication
  sparql_endpoint: {url:"http://synapse.si.washington.edu:3030/ocdm/sparql"},
  search:{query:queries.search_query,fields:['term','species']},
  iri_search:{query:queries.iri_query},
  queries: queries,

  // layout
  navWidth:16, //out of 24
};

export {config};
