<template>
  <div id="container-area">
    <el-row class="full-height">
      <el-col id="nav-col" :span="navWidth" class="full-height">

        <!-- sort this out
        <navview :node="node" @node-selected="nodeSelected"></navview>
        -->
        <component
          :is="navViews[0].view"
          :node="node"
          @node-selected="nodeSelected"
        />

      </el-col>


      <!--
      <el-col class="tree-col" :span="6">
        <div class="tree-prop-area">
          <span class="property-input-label">property: {{treeProps[1].label}}</span>
        </div>
        <div class="tree-area">
          <biditree :subject="subject" :property="treeProps[1]" @node-selected="treeNodeSelected"></biditree>
        </div>
      </el-col>
      -->

      <el-col id="content-col" :span="contentWidth">
        <!--
        <div>Property = {{property}}</div>
        <div>Selected = {{node}}</div>
      -->
        <el-tabs v-model="activeDataView" @tab-click="handleClick" >
          <!--
          <el-tab-pane label="Description" name="Description"><nodeinfo v-if="node!=undefined" :node="node" @node-selected="treeNodeSelected"></nodeinfo></el-tab-pane>
          -->
          <el-tab-pane v-for="dataView in dataViews" :key="dataView.name" :label="dataView.name" :name="dataView.name" :disabled="!dataView.isActive">
            <div id="tab-content">
              <component
                :is="dataView.view"
                :node="node"
                :property="$store.getters.getProperty"
                @active="dataView.isActive=arguments[0]"
                @node-selected="nodeSelected"
                @property-selected=""
              />
            </div>
          </el-tab-pane>
        </el-tabs>
        <!--
        <nodeinfo v-if="node!=undefined" :node="node" @node-selected="treeNodeSelected"></nodeinfo>
      -->
      </el-col>
    </el-row>
    <!--
    <div id="info-area">
      <div>Property = {{propertyName}}</div>
      <div>Selected = {{node.label}}</div>
    </div>
    <div id="tree-area">
      <biditree :subject="{data:{iri:'http://purl.org/sig/ont/fma/fma52748'},label:'Mandible'}" :property="propertyName" @node-selected="treeNodeSelected"></biditree>
    </div>
  -->
  </div>
</template>

<script>
import bidimultitree from '@/components/navViews/bidiMultiTree';
import {config} from '@/config';
//import nodeinfo from './NodeInfo';

//import Vue from 'vue';
//const ontology = new Ontology();
//import store from '../state/store'

export default {
  props: ['navWidth'],
  components: {
    /*
    ...(() => {
      const context = require.context('@/components/dataViews', true, /\.(js|vue)$/i);
      return context
        .keys().map(key => {
          const name = key.match(/\w+/)[0];
          return context(key);
        });
    })(),
    */
    //navview: bidimultitree,
    //nodeinfo: nodeinfo,

  },
  data () {
    return {
      //config:this.$state.getters.getConfig,
      //property:{iri:"http://purl.org/sig/ont/cpo/part",label:"part",inv:false},
      //config: config,
      propertyIndex: config.init.propertyIndex,
      //treeProps: config.navProperties,
      dataViews: [],
      activeDataView:config.initDataView,

      navViews: [],
      activeNavView:config.initNavView,
    }
  },
  created: function(){
    // only up to 4 properties supported
    /*
    if(this.treeProps.length>4){
      this.treeProps.length=4;
    }
    */
    this.loadNavViews();
    this.loadDataViews();
  },
  computed: {
    /*
    componentLoader (filePath) {
      return () => import(filePath);
    },
    */


    /*
    config: function(){
      return this.$store.getters.getConfig
    },
    treeProps: function(){
      return this.config.treeProps
    },
    */
    contentWidth: function(){
      return 24-(this.navWidth);
    },
    node: {
      get() {
        return this.$store.getters.getNode;
      },
      set(value) {
        //this.$store.commit('setNode', value);
        this.$store.dispatch('setNodeWithHistory',value);
      }
    },

  },
  methods: {
    /*
    viewInactive(dataView){
      dataView['inactive']=true;
      console.log(dataView);
    },
    */
    handleClick(tab, event) {
      //console.log(tab, event);
    },
    loadDataViews: function(){
      //var allViews = [];
      var vm = this;
      const context = require.context('@/components/dataViews', true, /\.(js|vue)$/i);
      //console.log("dataview context = "+JSON.stringify(context.keys()));

      // load all data views discovered
      var allDataViews = [];
      context.keys().forEach(function(key){
        var module = context(key);
        if(module.default.extends!=undefined && module.default.extends.name==="DataView"){
          allDataViews.push({name:module.default.name,view:module.default,isActive:true});
          //vm.dataViews.push({name:module.default.name,view:module.default,isActive:true});
        }
      });

      // read config to get configured data views, include if also discoverable
      var confDataViewNames = config.dataViews;
      var dataViews = allDataViews.filter(view => confDataViewNames.includes(view.name));
      //vm.dataViews = dataViews;
      // TODO: Your are here!

      vm.$store.commit("setAllDataViews",allDataViews);
      vm.$store.commit("setSelectedDataViews",dataViews);
      vm.dataViews = dataViews; // TODO: replace with selected


      /*
      for(var key in context.keys()){
        var dataViewFile = context.keys()[key];
        this.loadDataView(dataViewFile);
        //console.log(context.keys()[key]);
      }
      */
    },
    loadNavViews: function(){
      var vm = this;
      const context = require.context('@/components/navViews', true, /\.(js|vue)$/i);

      // load all nav views discovered
      var allNavViews = [];
      context.keys().forEach(function(key){
        var module = context(key);
        if(module.default.extends!=undefined && module.default.extends.name==="NavView"){
          allNavViews.push({name:module.default.name,view:module.default,isActive:true});
          //vm.dataViews.push({name:module.default.name,view:module.default,isActive:true});
        }
      });

      // read config to get configured nav views, include if also discoverable
      var confNavViewNames = config.navViews;
      var navViews = allNavViews.filter(view => confNavViewNames.includes(view.name));
      vm.navViews = navViews;
    },
    /*
    loadDataView(filePath) {
      console.log("loadDataView called with filePath = "+filePath);
      //return () => import(filePath);
      // @/components/dataViews
      var parts = filePath.split('/');
      var fileName = parts[parts.length - 1];
      var currInst = this;
      var filePath = '@/components/dataViews/'+fileName;
      console.log("actual path to use "+filePath);
      import(filePath)
        .then((module) => {
          // if module is an extension of DataView, include in dataViews list
          if(module.default.extends!=undefined && module.default.extends.name==="DataView"){
            currInst.dataViews.push({name:module.default.name,view:module.default,isActive:true});
          }
        });
    },
    */
    nodeSelected: function(node){
      this.node = node;
      var tabContent = document.getElementById('tab-content');
      //temp tabContent.scrollTop = 0;
    },
    updateNodeData: function(results){
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
        var currProp = binding.property.value;

        if(lastProp===null||currProp!==lastProp){
          // new property found
          lastProp = currProp;
          currValArray = [];
          propVals.push({property:lastProp,values:currValArray});
        }
        var val={};
        val['value']=binding.value.value;
        if(typeof binding.label !== "undefined"){
          val['label']=binding.label.value;
        }
        currValArray.push(val);
      }

      this.nodeData = propVals;
    },
    handleErrors: function(errors){
      //TODO: need to do something better with error handling
      alert("browser errors: "+errors);
    }
  }
}
</script>

<style>
#nav-col{
  /*border-right:2px dotted gray;*/
  /*background-color: #c8d5e1;*/
}
#container-area, .full-height, .tree-col, #content-col
{
  height:100%;
}
#container-area {
  overflow:hidden;
}
#content-col {
  margin:0px;
  padding:10px;
  height:100%;
}

.el-tabs, .el-tab-pane {
  height: 100%;
}

.el-tabs {
  display: flex;
  flex-direction: column;
}

.el-tabs__content {
  flex: 1;
}

#tab-content {
  max-height: 100%;
  height:100%;
  overflow:auto;
}

.tree-area {
  height:calc( 100% - 40px );
  margin:0px;
  padding:0px;
}
.tree-prop-area {
  line-height: 30px;
  height:30px;
  padding:5px;
  margin:0px;
  white-space: nowrap;
  overflow:auto;
  text-align: center;
  font-style: italic;
}


/*
.el-select-dropdown__item span {
  font:inherit;
}
*/
</style>
