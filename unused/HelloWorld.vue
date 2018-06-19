<template>
  <div class="hello">
    <el-row>
      <el-col :span="24">
        <el-input
          type="textarea"
          :rows="10"
          placeholder="Enter Query"
          v-model="queryString">
        </el-input>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-button type="primary" plain v-on:click="query(queryString,displayResults,displayErrors)">Execute</el-button>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="24">
        <el-tree :props="treeProps" :load="loadNode" lazy :render-content="renderNode"></el-tree>
      </el-col>
    </el-row>

    <!--
    <v-container grid-list-xl fluid>
        <v-layout wrap>
          <v-flex xs12>
            <v-text-field
              name="input-1"
              label="Query:"
              v-model="queryString"
              multi-line
            ></v-text-field>
            <v-btn v-on:click='query(queryString)'>Execute Query</v-btn>
          </v-flex>
        </v-layout>
      </v-container>
    -->
  </div>
</template>

<script>
//import Ontology from '../ontology';
//const ontology = new Ontology();
//import store from '../state/store'

export default {
  name: 'Query',
  data () {
    return {
      queryString: '',
      //ontology: ontology
      treeProps: {
        label: 'label',
        children: 'children',
        isLeaf: 'leaf'
      }
    }
  },
  computed: {

  },
  methods: {
    query: function (queryString,successCallback,errorCallback) {
      //var queryString = 'SELECT * WHERE {?a ?b ?c} limit 10';
      var promise = this.$store.dispatch('query',{query:queryString});
      promise.then((results) => {
        // successMessage is whatever we passed in the resolve(...) function above.
        // It doesn't have to be a string, but if it is only a succeed message, it probably will be.

        //console.log(results)
        successCallback(results);
      }).catch((errors) => {
        //console.log(errors);
        errorCallback(errors.statusText);
      });
    },
    //getChildren: function() YOU ARE HERE!
    displayResults: function(results){
      alert(results);
    },
    displayErrors: function(errors){
      alert(errors);
    },
    loadNode: function(node, resolve) {
      // test query
      if(node.level===0)
      {
        return resolve([{iri:"http://purl.org/sig/ont/fma/fma67498",label:"Organ"}])
      }
      var queries = this.$store.getters.getQueries;
      var subclassPropIRI = "http://www.w3.org/2000/01/rdf-schema#subClassOf";
      var subclassQuery = queries.directional_relation_query(node.data.iri,subclassPropIRI,true);
      //var subclassQuery = queries.subclasses_query(node.label);
      function success(results) {
        // form results here

        var resObj = JSON.parse(results);
        var bindings = resObj.results.bindings;
        var children = [];
        for (var count = 0; count < bindings.length; count++) {
          var binding = bindings[count];
          var child = {'iri': binding.related.value, 'label': binding.label.value, 'leaf': (binding.terminal.value === 'true')};
          children.push(child);
        }
        //data = [{iri:"node.iri",label:"node.label"}];
        return resolve(children);
        /*
        //alert("got results?")
        if (node.level === 0) {
          return resolve([{ label: node.label }]);
        }
        if (node.level > 1) return resolve([{ label: 'region' }]);
        */
      }

      this.query(subclassQuery,success,this.displayErrors);

    },
    renderNode: function(h, { node, data, store }) {
      /*
      THIS DOESN"T WORK, need to use vue createElement function
      // create a new span element
      var nodeSpan = document.createElement("span");
      // create a span for the label and give it some content
      var labelSpan = document.createElement("span");
      var nodeLabel = document.createTextNode(node.data.label);
      // compose above elements
      labelSpan.appendChild(nodeLabel);
      nodeSpan.appendChild(labelSpan);
      return nodeSpan;
      */
      return this.$createElement('span',
        [
          this.$createElement('span', node.data.label),
          //this.$createElement('i', {'class': {'el-icon-caret-top': true}},"")
        ]
      )
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
</style>
