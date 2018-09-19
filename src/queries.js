var queries = {
  iri_query: function(search_iri) {
    return `
    PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#>
    SELECT ?label
    WHERE
    {
      #<${search_iri}> rdfs:label ?label.
      BIND (<${search_iri}> AS ?iri)
      OPTIONAL {?iri rdfs:label ?label}.
      OPTIONAL {?actualIRI cpo:altIRI ?iri. ?actualIRI rdfs:label ?label}
    }
    `
  },
  search_query: function(search_term) {
    return `
    PREFIX text: <http://jena.apache.org/text#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX owl: <http://www.w3.org/2002/07/owl#>
    PREFIX cpo: <http://purl.org/sig/ont/cpo/>
    PREFIX fma: <http://purl.org/sig/ont/fma/>
    SELECT distinct ?subject (?literal AS ?term) ?label
    WHERE {
      VALUES ?property {fma:preferred_name fma:synonym fma:non-English_equivalent rdfs:label}.
      (?subject ?score ?literal) text:query (?property '${search_term}').
      ?subject rdfs:label ?label.
    }
    ORDER BY DESC(?score)
    `;
  },
  all_properties_query: function(iri) {
    return `
    PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
	  PREFIX owl: <http://www.w3.org/2002/07/owl#>
    PREFIX fma: <http://purl.org/sig/ont/fma/>
    SELECT distinct ?property ?value ?label ?annotProperty ?annotValue
    WHERE
    {
      BIND (<${iri}> AS ?subject).
  	  #?subject rdf:type owl:NamedIndividual.

      ?subject ?property ?value.
      FILTER(STRSTARTS(STR(?property), "http://purl.org/sig/ont/fma/")).

      # get value label if it has one
      OPTIONAL{?value rdfs:label ?label}

      # ignore blank nodes since we have puns
      FILTER (!isBlank(?value)).

      # get axiom annotations if present
      OPTIONAL {
        ?axiom owl:annotatedSource ?subject.
        ?axiom owl:annotatedProperty ?property.
        ?axiom owl:annotatedTarget ?value.
        ?axiom ?annotProperty ?annotValue.
        FILTER(STRSTARTS(STR(?annotProperty), "http://purl.org/sig/ont/fma/")).
      }
    }
    ORDER BY (lcase(str(?property)))
    `
  },
  axiom_annotations_query: function(subject,property,object){
    return `
    PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
	  PREFIX owl: <http://www.w3.org/2002/07/owl#>
    PREFIX fma: <http://purl.org/sig/ont/fma/>
    SELECT distinct ?rel ?annot
    WHERE
    {
      # get axiom annotations if present
      OPTIONAL {
        ?axiom owl:annotatedSource <${subject}>.
        ?axiom owl:annotatedProperty <${property}>.
        ?axiom owl:annotatedTarget <${object}>.
        ?axiom ?rel ?annot.
        FILTER(STRSTARTS(STR(?rel), "http://purl.org/sig/ont/fma/")).
      }
    }
    ORDER BY (lcase(str(?rel)))
    `
  },
  directional_relation_query: function(iri, relationship, inverse){
    if(!inverse)
    {
      return `
      PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#>
      SELECT distinct ?related ?label (!bound(?next) as ?terminal)
      WHERE
      {
        <${iri}> <${relationship}> ?related .
        ?related  rdfs:label ?label.
        OPTIONAL{?related <${relationship}> ?next.}
      }
      `
    }
    else
    {
      return `
      PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#>
      SELECT distinct ?related ?label (!bound(?next) as ?terminal)
      WHERE
      {
        ?related <${relationship}> <${iri}> .
        ?related  rdfs:label ?label.
        OPTIONAL{?next <${relationship}> ?related.}
      }
      `
    }
  },
  property_list_query:function() {
    return `
    PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX owl: <http://www.w3.org/2002/07/owl#>
    PREFIX fma: <http://purl.org/sig/ont/fma/>
    SELECT distinct ?property
    WHERE
    {
      VALUES ?property_type { owl:ObjectProperty }.
      ?property rdf:type ?property_type.
    }
    ORDER By ?property
    `
  }
}

export {queries};
