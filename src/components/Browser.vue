<template>
  <div id="container-area">

    <el-row class="full-height">
      <el-col id="nav-col" :span="navWidth" class="full-height">
        <component
          v-if="navView !== null"
          :is="navView.view"
          :node="node"
          @node-selected="nodeSelected"
        />
      </el-col>

      <el-col id="content-col" :span="contentWidth">
        <el-tabs v-if="dataViews.length>0" v-model="selectedDataView" @tab-click="handleClick" >
          <el-tab-pane v-for="dataView in dataViews" :key="dataView.name" :label="dataView.name" :name="dataView.name" :disabled="!dataView.isActive">
            <div id="tab-content">
              <component
                v-if="node != undefined"
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
      </el-col>
    </el-row>

  </div>
</template>

<script>
import bidimultitree from '@/components/navViews/bidiMultiTree';
import {config} from '@/config';

export default {
  props: ['navWidth'],
  components: {
  },
  data () {
    return {
      propertyIndex: config.init.propertyIndex,
      selectedDataView:config.initDataView,
    }
  },
  created: function(){
    this.loadNavViews();
    this.loadDataViews();
  },
  computed: {
    navView: function(){
      return this.$store.getters.getActiveNavView;
    },
    dataViews: function(){
      return this.$store.getters.getActiveDataViews;
    },
    contentWidth: function(){
      return 24-(this.navWidth);
    },
    node: {
      get() {
        return this.$store.getters.getNode;
      },
      set(value) {
        this.$store.dispatch('setNodeWithHistory',value);
      }
    },

  },
  methods: {
    loadDataViews: function(){
      //var allViews = [];
      var vm = this;
      const context = require.context('@/components/dataViews', true, /\.(js|vue)$/i);

      // load all data views discovered
      var allDataViews = [];
      context.keys().forEach(function(key){
        var module = context(key);
        if(module.default.extends!=undefined && module.default.extends.name==="DataView"){
          allDataViews.push({name:module.default.name,view:module.default,isActive:true});
        }
      });

      // read config to get configured data views, include if also discoverable
      var confDataViewNames = config.dataViews;
      var dataViews = allDataViews.filter(view => confDataViewNames.includes(view.name));
      vm.$store.commit("setAllDataViews",dataViews);

      // determine active dataViews from localStorage or config as appropriate
      var settingsFromLocalStorage = vm.$store.getters.settingsFromLocalStorage;
      if(settingsFromLocalStorage===true){
        var activeDataViewsStore = vm.$store.getters.getActiveDataViews;
        var activeDataViewNames = activeDataViewsStore.map(view => view.name);
        var currActiveDataViews = dataViews.filter(view => activeDataViewNames.includes(view.name));
      }
      else {
        var currActiveDataViews = dataViews.filter(view => confDataViewNames.includes(view.name));
      }

      vm.$store.commit("setActiveDataViews",currActiveDataViews);
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

      vm.$store.commit("setAllNavViews",navViews);

      // determine active dataViews from localStorage or config as appropriate
      var settingsFromLocalStorage = vm.$store.getters.settingsFromLocalStorage;
      if(settingsFromLocalStorage===true){
        var activeNavViewStore = vm.$store.getters.getActiveNavView;
        var currActiveNavView = navViews.find(view => (view.name===activeNavViewStore.name));
      }
      else {
        var currActiveNavView = navViews.find(view => view.name===config.initNavView);
      }
      vm.$store.commit("setActiveNavView",currActiveNavView);
    },
    nodeSelected: function(node){
      this.node = node;
      var tabContent = document.getElementById('tab-content');
      //temp tabContent.scrollTop = 0;
    },
    updateNodeData: function(results){
      var resObj = results;
      var bindings = resObj.results.bindings;
      var propVals = [];

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
</style>
