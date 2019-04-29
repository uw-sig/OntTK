// this is a template file, places marked ##replace## will need use specific values
var queries = {
  iri_query: function(search_iri) {
    return `
    ##replace##
    `
  },
  search_query: function(search_term) {
    return `
    ##replace##
    `;
  },
  all_properties_query: function(iri) {
    return `
    ##replace##
    `
  },
  axiom_annotations_query: function(subject,property,object){
    return `
    ##replace##
    `
  },
  directional_relation_query: function(iri, relationship, inverse){
    if(!inverse)
    {
      return `
      ##replace##
      `
    }
    else
    {
      return `
      ##replace##
      `
    }
  }
}

export {queries};
