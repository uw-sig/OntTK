<template>
  <div id='carouseltree-container'>
    <div id="settings">
      <el-button type="secondary" icon="el-icon-setting" size="mini" @click="showSettings">Settings</el-button>
    </div>
    <el-dialog
      title="Settings"
      :visible.sync="settingsDialogVisible"
    >
      <div>
        <span>Style: </span>
        <el-switch
          v-model="settings.isCardStyle"
          active-text="Card"
          inactive-text="Basic">
        </el-switch>
      </div>
      <div class="nav-props">
        <span>Properties: </span>
        <ul>
          <li v-for="treeProp in settings.treeProps">{{treeProp}}</li>
        </ul>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="settingsDialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="settingsDialogVisible = false">Save</el-button>
      </span>
    </el-dialog>


    <el-row class="full-height">
      </el-col :span="24">
        <el-carousel trigger="click" :autoplay='false' height='100%' :type='getStyle' @change="changeActive">
          <el-carousel-item v-for="property,index in settings.treeProps" :key="index" class="tree-col" :label="property.label" height="100%">
            <div class="tree-area">
              <biditree v-if="node!=undefined" :subject="subject" :property="property" :displaySubject="index===selectedSlideIndex" @node-selected="treeNodeSelected"></biditree>
            </div>
          </el-carousel-item>
        </el-carousel>
      </el-col>
      <!--
      <el-col v-for="property,index in treeProps" :key="index" class="tree-col" :span="treeColWidth">
        <div class="tree-prop-area">
          <span class="property-input-label">property: {{property.label}}</span>
        </div>
        <div class="tree-area">
          <biditree v-if="node!=undefined" :subject="subject" :property="property" @node-selected="treeNodeSelected"></biditree>
        </div>
      </el-col>
    -->
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
  name: 'BidiCarouselCardTree',
  extends: NavView,
  data() {
    return {
      settingsDialogVisible: false,
      //treeProps: config.navProperties,
      selectedSlideIndex:0,
      settings: {
        treeProps:config.navProperties,
        isCardStyle:true,
      }
    }
  },
  created: function(){

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
    }
  },
  methods: {
    treeNodeSelected: function(nodeinfo){
      this.$emit('node-selected',nodeinfo);
      //this.refresh(item);
    },
    showSettings: function(){
      this.settingsDialogVisible=true;
    },
    changeActive: function(index){
      this.selectedSlideIndex = index;
      //alert("new active slide index = "+index);
    }
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
}
.el-carousel__indicators--outside{
  position:absolute;
  bottom:0px;
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
