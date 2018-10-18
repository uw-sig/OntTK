<template>
  <div>
    <el-row>
      <div>navigation properties</div>
      <el-table :data="treeProps" :border='true' empty-text='No Navigation Properties Set'>
        <el-table-column width='200' property="label" label="label" :class-name="'prop-label'"></el-table-column>
        <el-table-column property="iri" label="iri"></el-table-column>
        <el-table-column width='100' property="inv" label="inverse" :formatter='booleanRender'></el-table-column>
        <el-table-column width='100' label="action">
          <template slot-scope="scope">
            <i @click="treePropRemoveSelected(scope.$index)" class="el-icon-delete"></i>
            <i @click="treePropEditSelected(scope.$index)" class="el-icon-edit"></i>
          </template>
        </el-table-column>
        <template slot="append">
          <!--<div v-if="treeProps.length===0" >no navigation properties set</div>-->
          <i @click="addNavPropDialogVisible = true" class="el-icon-plus add-prop-icon" > Add Navigation Property</i>
        </template>
      </el-table>
    </el-row>
    <el-dialog
      title="Add Navigation Property"
      :visible.sync="addNavPropDialogVisible"
      width="600"
      append-to-body
    >
      <el-row class='tall-row' type='flex' align='middle'>
        <el-col class='label-column'>label</el-col>
        <el-col class='input-column'><el-input v-model="tempNavProp.label"></el-input></el-col>
      </el-row>
      <el-row class='tall-row' type='flex' align='middle'>
        <el-col class='label-column'>iri</el-col>
        <el-col class='input-column'><el-input v-model="tempNavProp.iri"></el-input></el-col>
      </el-row>
      <el-row class='tall-row' type='flex' align='middle'>
        <el-col class='label-column'><span>inverse</span><span class='highlight'>*</span></el-col>
        <el-col class='input-column'><el-checkbox v-model="tempNavProp.inv"></el-checkbox></el-col>
      </el-row>
      <el-row class='tall-row' type='flex' align='top'>
        <span class='highlight'>*</span><span>unusual setting for navigation trees where parent to child relationship should be the inverse of specified property</span>
      </el-row>
      <!--
      <el-row>
        <el-col><span>iri</span><el-input v-model="propToAdd.label"></el-input></el-col>
      </el-row>
      <el-row>
        <el-col><span>invert</span><span>*</span><el-checkbox v-model="propToAdd.inverse"></el-checkbox></el-col>
      </el-row>
    -->

      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelUpdateNavProp()">Cancel</el-button>
        <el-button type="primary" @click="updateNavProp()">Continue</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import SettingsView from '@/components/settingsViews/settingsView.vue';
export default {
  name: "BidiTreeSettingsView",
  extends: SettingsView,
  data() {
    return {
      addNavPropDialogVisible:false,
      tempNavProp: null,
      editIndex: -1,
    }
  },
  computed:{
    treeProps: {
      get:function(){
        //console.log(this.settings['treeProps']);
        return this.settings['treeProps'];
      },
      set:function(val){
        //var newSettings = _.cloneDeep(this.settings);
        //var newSettings = this.settings;
        //newSettings['showAxiomAnnots']=val;
        //this.settings = newSettings;
//        this.settings['treeProps']=val;
        this.$set(this.settings['treeProps'],this.editIndex,this.tempNavProp);
        //this.settingsUpdate();
      }
    }
  },
  /*
  watch: {
    settings: {
      handler: function(newVal){
        console.log('newSettings = '+JSON.stringify(newVal));
      },
      deep:true,
    },
    treeProps: {
      handler: function(newVal){
        console.log('treeProps = '+JSON.stringify(newVal));
        //this.$set(this.settings['treeProps'],this.editIndex,this.tempNavProp);
      },
      deep:true,
    }
  },
  */
  created: function(){
    this.resetTempNavProp();
  },
  methods: {
    booleanRender(row, column, cellValue) {
      return String(cellValue);
    },
    treePropRemoveSelected(index){
      this.treeProps.splice(index, 1);
      //var newTreeProps = this.treeProps.filter(item => item !== treeProp);
      //this.treeProps = newTreeProps;
    },
    treePropEditSelected(index,treeProp){
      this.editIndex = index;
      this.tempNavProp = this.treeProps[index];
      this.addNavPropDialogVisible = true;
      //TODO: not yet implemented
    },
    updateNavProp(){
      if(this.editIndex===-1){
        this.treeProps.push(this.tempNavProp);
      }
      else{
        //this.treeProps.splice(this.editIndex, 1, this.tempNavProp);
        this.$set(this.treeProps,this.editIndex,this.tempNavProp);
        //this.treeProps[this.editIndex]=this.tempNavProp;
      }
      //this.treeProps.push(this.tempNavProp);
      this.resetTempNavProp();
      this.addNavPropDialogVisible = false;
    },
    cancelUpdateNavProp(){
      this.resetTempNavProp();
      this.addNavPropDialogVisible = false;
    },
    resetTempNavProp(){
      this.editIndex = -1;
      this.tempNavProp = {
        label:null,
        iri:null,
        inv:false,
      };
    }
  }
}
</script>

<style>
.inv-label{
  font-style: italic;
}
.prop-label{
  font-weight: bold;
}
.add-prop-icon{
  color:#409EFF;
  padding:5px;
  cursor:pointer;
}
.label-column{
  width:50px !important;
}
.input-column{
  width:calc( 100% - 50px );
}
.tall-row{
  height:50px;
}
.highlight{
  color:#409EFF;
  font-style:bold;
  padding-right:5px;
}
</style>
