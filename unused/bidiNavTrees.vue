<template>
  <div id="content-area">
    <div id="multi-tree-area" v-for="property in treeProps">
      <div class="tree-prop-area">
        <span class="property-input-label">property: {{property.label}}</span>
      </div>
      <div class="tree-area">
        <biditree v-if="node!=undefined" :subject="subject" :property="property" @node-selected="treeNodeSelected"></biditree>
      </div>
    </div>
  </div>
</template>

<script>
import DataView from '@/components/dataViews/dataView.vue';
import biditree from '@/components/BidiMultiTree';
import {config} from '@/config';

export default {
  name: 'BidiNavTrees',
  extends: DataView,
  components: {
    biditree: biditree,
  },
  data () {
    return {
      propertyIndex: config.init.propertyIndex,
      treeProps: config.navProperties,
      subject: this.node,
    }
  },
  watch: {
    node: function (val) {
      // node change,
      //console.log("node val = "+JSON.stringify(val));
    }
  },
  mounted: function(){
    console.log(JSON.stringify(this.node));
  },
  methods: {
    notifyActive: function(){
      // emit 'inactive' if this view has nothing to show
      this.$emit('active',true);
    },
    treeNodeSelected: function(node){
      this.subject = node;
    },
  }
}
</script>

<style scoped>
  #tab-content, #content-area {
    height: 100%;
  }
</style>
