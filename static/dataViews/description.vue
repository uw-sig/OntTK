<template>
<div id="node-info-container">
  <div class="node-iri">{{node.iri}}</div>
  <div class="section-break"></div>
  <hr>

  <div v-for="browser_prop in config.browser_property_prefs">
    <div class="node-data" v-for="nodeDatum in nodeData.filter(datum => datum.property===browser_prop)">
      <div class="prop-label">{{nodeDatum.property.replace(/_/g, " ")}}</div>
      <div class="prop-val" v-for="val in nodeDatum.values">
        <div class="pointer val-text" v-if="(typeof val.label !== 'undefined')" @click="treeNodeSelectedInternal({label:val.label,iri:val.value})">{{val.label}}</div>
        <div class="val-text" v-if="(typeof val.label === 'undefined')">{{val.value}}</div>
      </div>
      <div class="section-break"></div>
      <hr>
    </div>
  </div>
  <div class="node-data" v-for="nodeDatum in nodeData.filter(datum => (config.browser_property_prefs.indexOf(datum.property)===-1 && config.browser_property_exclusions.indexOf(datum.property)===-1))">
    <div class="prop-label">{{nodeDatum.property.replace(/_/g, " ")}}</div>
    <div class="prop-val" v-for="val in nodeDatum.values">
      <div class="pointer val-text" v-if="(typeof val.label !== 'undefined')" @click="treeNodeSelectedInternal({label:val.label,iri:val.value})">{{val.label}}</div>
      <div class="val-text" v-if="(typeof val.label === 'undefined')">{{val.value}}</div>
    </div>
    <!-- ? val.label : val.value}}</div>-->
    <div class="section-break"></div>
    <hr>
  </div>
</div>
</template>

<script>
import {config} from "@/config";
import DataView from '@/components/dataViews/dataView.vue';
export default {
  name: "Description",
  extends: DataView,
  data() {
    return {
      nodeData: [],
      config:config
    }
  },
  watch: {
    node: function(val) {
      this.treeNodeSelected(val);
    }
  },
  mounted: function(){
    this.treeNodeSelected(this.node);
  },
  methods: {
    treeNodeSelectedInternal: function(node) {
      //this.$emit('node-selected',{iri:node.iri,label:node.label});
      this.notifyNodeSelect({iri:node.iri,label:node.label});
      this.treeNodeSelected(node);
    },
    treeNodeSelected: function(node) {
      var queryString = this.getQueries().all_properties_query(node.iri);
      //var queryInfo = {query: queryString};
      var promise = this.queryOntology(queryString);
      promise.then((results) => {
  			this.updateNodeData(results);
  		}).catch((errors) => {
  			this.handleErrors(errors.statusText);
  		});
    },
    updateNodeData: function(results) {
      //this.raw=results;
      // property, value, label
      var resObj = results;//JSON.parse(results);
      var bindings = resObj.results.bindings;
      var propVals = [];

      // test
      var lastProp = null;
      var currValArray = null;
      for (var count = 0; count < bindings.length; count++) {
        var binding = bindings[count];
        var currProp = /[^/]*$/.exec(binding.property.value)[0];//binding.property.value;

        if (lastProp === null || currProp !== lastProp) {
          // new property found
          lastProp = currProp;
          currValArray = [];
          propVals.push({
            property: lastProp,
            values: currValArray
          });
        }
        var val = {};
        val['value'] = binding.value.value;
        if (typeof binding.label !== "undefined") {
          val['label'] = binding.label.value;
        }
        currValArray.push(val);
      }
      this.nodeData = propVals;
    },
    handleErrors: function(errors){
      alert(errors);
    },
  }
}
</script>

<style>
.property-input-label {}

.section-break {
  height: 10px;
}

.node-iri {
  font-style:italic;
  /*
  background-color: gray;
  color: white;
  */
}

.prop-label {
  font-weight: bold;
}

.prop-val {
  font-weight: normal;
}

.val-text{
  text-indent : -15px ;
  margin-left :  15px ;
}

.pointer {
  cursor: pointer;
  color: blue;
  display: inline-block
}
</style>
