<template>
  <div id='carouseltree-container'>

    <el-row class="full-height">
      </el-col :span="24">
        <el-carousel
          trigger="click"
          :autoplay='false'
          height='100%'
          type='card'
          @change="changeActive"
          :initial-index="selectedSlideIndex"
        >
          <el-carousel-item v-for="property,index in properties" :key="property.key" class="tree-col" :label="property.label" >
            <div class="tree-area">
              <biditree
                v-if="node!=undefined"
                :subject="subject"
                :property="property"
                :displaySubject="index===selectedSlideIndex"
                @node-selected="treeNodeSelected"
              >
              </biditree>
            </div>
          </el-carousel-item>

        </el-carousel>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {config} from "@/config";
import NavView from '@/components/navViews/navView.vue';
import biditree from '@/components/navViews/bidiTree';
import bidiTreeSettingsView from '@/components/settingsViews/bidiTreeSettingsView'
export default {
  props: ['node'],
  components:{
    biditree:biditree
  },
  name: 'BidiCarouselCardTree',
  extends: NavView,
  data() {
    return {
      settingsDialogVisible: false,

      selectedSlideIndex:0,
      initSettings: {
        treeProps:_.cloneDeep(config.navProperties),
        isCardStyle:true,
      },
      settingsView:bidiTreeSettingsView,
    }
  },
  watch: {
    properties: {
      handler: function(newVal){
        this.assignKeys();
      },
      deep:true,
    }
  },
  mounted: function(){
    this.assignKeys();
  },
  computed: {
    subject: function(){
      if(this.node==undefined){
        return null;
      }
      return {data:{iri:this.node.iri},label:this.node.label};
    },
    getStyle: function(){
      var style = (this.settings.isCardStyle) ? 'card' : '';
      return style;
    },
    properties: function(){
      if(this.settings == undefined){
        return [];
      }
      return this.settings.treeProps;
    },
  },
  methods: {
    treeNodeSelected: function(nodeinfo){
      this.$emit('node-selected',nodeinfo);
      //this.refresh(item);
    },
    assignKey: function(propIndex){
      var prop = this.properties[propIndex];
      prop.key = prop.label+'_'+Date.now();
    },
    assignKeys: function(){
      this.properties.forEach(function(prop) {
        prop.key = prop.label+'_'+Date.now();
      });
    },
    changeActive: function(index){
      this.selectedSlideIndex = index;
      //alert("new active slide index = "+index);
    },
  }
}
</script>

<style>
span.clear { clear: left; display: block; }
#settings {
  top:5px;
  left:5px;
  position:absolute;
  z-index:999;
}
.nav-props{
  margin-top:10px;
}
#carouseltree-container, .full-height, .tree-col
{
  height:100%;
}
#carouseltree-container{
  position:relative;
}
.el-carousel {
  height:100%;
  overflow:hidden;
}
.el-carousel__indicators{
  position:absolute !important;
  bottom:0px !important;
}
.el-carousel__button {
  font-weight:bolder;
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
