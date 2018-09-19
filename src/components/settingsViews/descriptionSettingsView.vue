<template>
  <div>
    <el-row>
      <el-checkbox v-model="showAxiomAnnots">Include Axiom Annotations</el-checkbox>
    </el-row>
  </div>
</template>

<script>
import SettingsView from '@/components/settingsViews/settingsView.vue';
export default {
  name: "DescriptionSettingsView",
  extends: SettingsView,
  data() {
    return {
    }
  },
  computed:{
    showAxiomAnnots: {
      get:function(){
        return this.settings['showAxiomAnnots'];
      },
      set:function(val){
        this.settings['showAxiomAnnots']=val;
      }
    }
  },
  mounted: function(){

  },
}
</script>

<style>

</style>
