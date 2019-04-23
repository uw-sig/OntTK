<template>
<div id="node-info-container" v-if="node!=undefined">
  <div class="node-iri">{{node.iri}}</div>
  <div class="section-break"></div>
  <hr>

  <div v-for="browser_prop in config.browser_property_prefs">
    <div class="node-data" v-for="nodeDatum in nodeData.filter(datum => datum.property===browser_prop)">
      <div class="prop-label">{{nodeDatum.property.replace(/_/g, " ")}}</div>
      <div class="prop-val" v-for="val,index in nodeDatum.values">
          <el-row type="flex" justify="space-between" class="value-row" align="middle">
            <div class="pointer val-text" v-if="(typeof val.label !== 'undefined')" @click="treeNodeSelectedInternal({label:val.label,iri:val.value})">{{val.label}}</div>
            <div class="val-text" v-else>{{val.value}}</div>

            <div v-if="settings.showAxiomAnnots===true && (typeof val.annotations !== 'undefined')">
              <el-popover
                placement="bottom"
                width="400"
                trigger="click"
                title="annotations:"
              >
                <el-table :data="val.annotations" :show-header='false'>
                  <el-table-column width="200" property="annotationProperty" label="property"></el-table-column>
                  <el-table-column width="200" property="annotationValue.value" label="value"></el-table-column>
                </el-table>
                <i class="annot-icon el-icon-info" type="primary" slot="reference"></i>
              </el-popover>
            </div>
          </el-row>
        <!--<div v-for="annotation in val.annotations">annot: {{annotation}}</div>-->
      </div>
      <div class="section-break"></div>
      <hr>
    </div>
  </div>
  <div class="node-data" v-for="nodeDatum in nodeData.filter(datum => (config.browser_property_prefs.indexOf(datum.property)===-1 && config.browser_property_exclusions.indexOf(datum.property)===-1))">
    <div class="prop-label">{{nodeDatum.property.replace(/_/g, " ")}}</div>
    <div class="prop-val" v-for="val in nodeDatum.values">
      <el-row type="flex" justify="space-between" class="value-row">
        <div class="pointer val-text" v-if="(typeof val.label !== 'undefined')" @click="treeNodeSelectedInternal({label:val.label,iri:val.value})">{{val.label}}</div>
        <div class="val-text" v-else>{{val.value}}</div>
        <div v-if="settings.showAxiomAnnots===true && (typeof val.annotations !== 'undefined')">
          <el-popover
            placement="bottom"
            width="400"
            trigger="click"
            title="annotations:"
          >
            <el-table :data="val.annotations" :show-header='false'>
              <el-table-column width="200" property="annotationProperty" label="property"></el-table-column>
              <el-table-column width="200" property="annotationValue.value" label="value"></el-table-column>
            </el-table>
            <i class="annot-icon el-icon-info" type="primary" slot="reference"></i>
          </el-popover>
        </div>
      </el-row>
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
import descriptionSettingsView from '@/components/settingsViews/descriptionSettingsView'
export default {
  name: "Description",
  extends: DataView,
  data() {
    return {
      nodeData: [],
      config:config,
      initSettings : {showAxiomAnnots:true},
      settingsView:descriptionSettingsView,
    }
  },
  computed: {
    /*
    showAxiomAnnots:{
      get:function(){
        return this.settings.views.dataViews['Descriptiong'].show; // could dynamically retrieve name
      }
    }
    */
  },
  watch: {
    node: function(val) {
      this.treeNodeSelected(val);
    }
  },
  mounted: function(){
    if(this.node!=undefined){
      this.treeNodeSelected(this.node);
    }
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
      var comp = function(a,b){return (a.property.value===b.property.value&&a.value.value===b.value.value);};
      var uniqueResults = _.uniqWith(resObj.results.bindings, comp);
      /*
      if(resObj.results.bindings.length>0){
        var uniqueResults = _.uniqWith(resObj.results.bindings, comp);
        //alert(uniqueResults);
      }
      */
      var bindings = uniqueResults;//resObj.results.bindings;
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

        // get axiom annotations
        var annotations = [];
        var axiomOccurences = resObj.results.bindings.filter(currAxBinding => currAxBinding.property.value===binding.property.value
          &&currAxBinding.value.value===binding.value.value);
        axiomOccurences.forEach(function(element){
          // skip annotations that are not completely defined
          if (typeof element.annotProperty == "undefined" || typeof element.annotValue =="undefined"){
            return;
          }
          var currAnnot = {};
          var currAnnotProp = /[^/]*$/.exec(element.annotProperty.value)[0];
          currAnnot['annotationProperty'] = currAnnotProp;
          currAnnot['annotationValue'] = element.annotValue;
          annotations.push(currAnnot);
        });

        if(annotations.length>0){
          val['annotations']=annotations;
        }

        currValArray.push(val);
      }
      this.nodeData = propVals;
    },

    /*
    getAxiomAnnotations: function(subject, property, object){
      var queryString = this.getQueries().axiom_annotations_query(subject,property,object);
      //var queryInfo = {query: queryString};
      var promise = this.queryOntology(queryString);
      promise.then((results) => {
  			this.updateNodeData(results);
  		}).catch((errors) => {
  			this.handleErrors(errors.statusText);
  		});
    }
    */
    handleErrors: function(errors){
      alert("description errors: "+errors);
    },
  }
}
</script>

<style>
.property-input-label {}

.annot-icon {
  color:gray;
  margin: 5px;
  cursor: pointer;
}

.value-row{
  border-radius:5px;
}
.value-row:hover{
  filter: brightness(85%);
}

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
