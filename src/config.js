import {queries} from './queries'

// this is a template file, places marked ##replace## will need use specific values
var config = {
  // info needed at start-up
  title: '##replace##',
  init: {
    node:{label:"##replace##",iri:"##replace##"},
    //propertyIndex: 0
  },

  // trees to include
  navProperties: [
    {iri: '##replace##',label: '##replace##', inv: ##replace##},
  ],

  navViews: [
    '##replace##'
  ],
  initNavView: '##replace##',
  dataViews:[
    '##replace##'
  ],
  initDataView: '##replace##',

  // info to show in content area
  browser_property_prefs:['##replace##'],
  browser_property_exclusions:['##replace##'],

  // server communication
  sparql_endpoint: {url:'##replace##'},
  search:{query:queries.search_query,fields:['##replace##']},
  iri_search:{query:queries.iri_query},
  queries: queries,

  // layout
  navWidth:16, //out of 24
};

export {config};
