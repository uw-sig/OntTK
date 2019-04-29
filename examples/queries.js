var queries = {
  iri_query: function(search_iri) {
    return `
    PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#>
    PREFIX cpo: <http://purl.org/sig/ont/cpo/>
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
    PREFIX ocdm: <http://purl.org/sig/ont/ocdm/>
    SELECT distinct ?subject (?literal AS ?term) ?label ?species
    WHERE {
      VALUES ?property {cpo:preferred_name cpo:synonym cpo:non-English_equivalent rdfs:label}.
      (?subject ?score ?literal) text:query (?property '${search_term}').
      ?subject rdfs:label ?label.
      OPTIONAL
      {
        BIND ("human" AS ?species).
        Values ?human_roots {ocdm:ocdm0000001}.
        ?subject rdfs:subClassOf* ?human_roots.
      }
      OPTIONAL
      {
        BIND ("mouse" AS ?species).
        Values ?mouse_roots {ocdm:ocdm0000002}.
        ?subject rdfs:subClassOf* ?mouse_roots.
      }
      OPTIONAL
      {
        BIND ("zebrafish" AS ?species).
        Values ?zebrafish_roots {ocdm:ocdm0000003}.
        ?subject rdfs:subClassOf* ?zebrafish_roots.
      }
      FILTER(bound(?species)).
    }
    ORDER BY DESC(?score)
    `;
  },
  all_properties_query: function(iri) {
    return `
    PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
	  PREFIX owl: <http://www.w3.org/2002/07/owl#>
    PREFIX cpo: <http://purl.org/sig/ont/cpo/>
    SELECT distinct ?property ?value ?label ?annotProperty ?annotValue
    WHERE
    {
      BIND (<${iri}> AS ?subject).
  	  #?subject rdf:type owl:NamedIndividual.

      ?subject ?property ?value.
      FILTER(STRSTARTS(STR(?property), "http://purl.org/sig/ont/cpo/")).

      # get value label if it has one
      OPTIONAL{?value rdfs:label ?label}

      # ignore blank nodes since we have puns
      FILTER (!isBlank(?value)).

      # get axiom annotations if present
      OPTIONAL {
        ?subproperty rdfs:subPropertyOf ?property.
        ?axiom owl:annotatedSource ?subject.
        ?axiom owl:annotatedProperty ?subproperty.
        ?axiom owl:annotatedTarget ?value.
        ?axiom ?annotProperty ?annotValue.
        FILTER(STRSTARTS(STR(?annotProperty), "http://purl.org/sig/ont/cpo/")).
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

  // The queries beyond this point were used to demonstrate "smart" queries
  related_non_lateralized_query: function(iri){
    return `
    PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX owl: <http://www.w3.org/2002/07/owl#>
    PREFIX cpo: <http://purl.org/sig/ont/cpo/>
    SELECT distinct ?result ?resultLabel
    WHERE{
      BIND (<${iri}>  AS ?subject).

      # will bind if concept is lateralized
      ?subject cpo:part_of* ?sup.
      ?sup rdfs:label ?label.
      FILTER(STRSTARTS(STR(?label), "Right")||STRSTARTS(STR(?label), "Left")).

      ?subject rdfs:subClassOf ?result.
      ?result rdfs:label ?resultLabel.
    }
    `
  },
  related_parts_query: function(iri){
    return `
    PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX owl: <http://www.w3.org/2002/07/owl#>
    PREFIX cpo: <http://purl.org/sig/ont/cpo/>
    SELECT distinct ?result ?resultLabel
    WHERE{
      BIND (<${iri}> AS ?subject).

      ?subject cpo:part{1,2} ?candidate.

      {
      	bind (?candidate as ?result).
        ?result rdfs:label ?resultLabel.
      }
      union
      {
        ?candidate cpo:part_of* ?sup.
        ?sup rdfs:label ?label.
        FILTER(STRSTARTS(STR(?label), "Right")||STRSTARTS(STR(?label), "Left")).
        ?candidate rdfs:subClassOf ?result.
        ?result rdfs:label ?resultLabel.
      }
    }
    `
  },
  related_development_query: function(iri){
    return `
    PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX owl: <http://www.w3.org/2002/07/owl#>
    PREFIX cpo: <http://purl.org/sig/ont/cpo/>
    SELECT distinct ?result ?resultLabel
    WHERE{
      BIND (<${iri}>  AS ?subject).

      ?subject cpo:matures_from+/^rdfs:subClassOf* ?candidate.

      {
        bind (?candidate as ?result).
        ?result rdfs:label ?resultLabel.
      }
      union
      {
        ?candidate cpo:part_of* ?sup.
        ?sup rdfs:label ?label.
        FILTER(STRSTARTS(STR(?label), "Right")||STRSTARTS(STR(?label), "Left")).
        ?candidate rdfs:subClassOf ?result.
        ?result rdfs:label ?resultLabel.
      }
    }
    `
  },
  related_dev_part_query: function(iri){
    return `
    PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX owl: <http://www.w3.org/2002/07/owl#>
    PREFIX cpo: <http://purl.org/sig/ont/cpo/>
    SELECT distinct ?result ?resultLabel
    WHERE{
      BIND (<${iri}>  AS ?subject).

      ?subject rdfs:subClassOf{,2}/cpo:part+/^rdfs:subClassOf{,2} ?candidate.
      ?subject cpo:has_embryonic_day ?subjDay.
      ?candidate cpo:has_embryonic_day ?candDay.

      FILTER(?subjDay=?candDay).

      {
        bind (?candidate as ?result).
        ?result rdfs:label ?resultLabel.
      }
      union
      {
        ?candidate cpo:part_of* ?sup.
        ?sup rdfs:label ?label.
        FILTER(STRSTARTS(STR(?label), "Right")||STRSTARTS(STR(?label), "Left")).
        ?candidate rdfs:subClassOf ?result.
        ?result rdfs:label ?resultLabel.
      }
    }
    `
  }
}

export {queries};
