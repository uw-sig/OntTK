<template>
  <el-row>
    <el-checkbox v-model="showAxiomAnnots">Include Axiom Annotations</el-checkbox>
  </el-row>
</template>

<script>
import SettingsView from '@/components/settingsViews/settingsView.vue';
export default {
  name: "DescriptionDataViewSettings",
  extends: SettingsView,
  data() {
    return {
      internalSettings:{showAxiomAnnots:true}
    }
  },
  computed:{
    showAxiomAnnots: {
      get:function(){
        return this.settings['showAxiomAnnots'];
      },
      set:function(val){
        //var newSettings = _.cloneDeep(this.settings);
        //var newSettings = this.settings;
        //newSettings['showAxiomAnnots']=val;
        //this.settings = newSettings;
        this.settings['showAxiomAnnots']=val;
        //this.settingsUpdate();
      }
    }
  },
  mounted: function(){
    //alert("test "+this.currSettings);
    //alert(JSON.stringify(settings));
  },
}
</script>

<style>

</style>
