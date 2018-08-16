<template>
  <div id='multitree-container'>
    <el-row id="full-height">
      <el-col v-for="property,index in treeProps" :key="index" class="tree-col" :span="treeColWidth">
        <div class="tree-prop-area">
          <span class="property-input-label">property: {{property.label}}</span>
        </div>
        <div class="tree-area">
          <biditree v-if="node!=undefined" :subject="subject" :property="property" @node-selected="treeNodeSelected"></biditree>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {config} from "@/config";
import NavView from '@/components/navViews/navView.vue';
import biditree from '@/components/navViews/bidiTree';
export default {
  props: ['node'],
  components:{
    biditree:biditree
  },
  name: 'BidiMultiTree',
  extends: NavView,
  data() {
    return {
      treeProps: config.navProperties,
    }
  },
  created: function(){
    // only up to 4 properties supported
    if(this.treeProps.length>4){
      this.treeProps.length=4;
    }
  },
  computed: {
    treeColWidth: function(){
      return Math.floor(24/this.treeProps.length);
    },
    subject: function(){
      if(this.node==undefined){
        return null;
      }
      return {data:{iri:this.node.iri},label:this.node.label};
    }
  },
  methods: {
    treeNodeSelected: function(nodeinfo){
      this.$emit('node-selected',nodeinfo);
      //this.refresh(item);
    },
  }
}
</script>

<style>
#multitree-container, #full-height, .tree-col, #content-col
{
  height:100%;
}
.tree-col {
  margin:0px;
  padding:0px;
  /*
  border-left: 1px dotted red;
  border-right: 1px dotted red;
  */
  /*border: 2px solid DarkGray;*/
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
