<template>
</template>

<script>
/*
  SettingsViews need access to the Vuex store. Hopefully we can limit store
  interaction to this base component.
*/
export default {
  name: 'SettingsView',
  props: ['view'],
  data () {
    return {
      internalSettings:{}
    }
  },
  computed:{
    dataViewSettings:function(){
      return this.$store.getters['getDataViewSettings'];
    },
    navViewSettings:function(){
      return this.$store.getters['getNavViewSettings'];
    },
    settings:{
      get:function(){
        return this.internalSettings;
      },
      set:function(val){
        this.internalSettings = val;
      }
    }

  },
  watch: {

  },
  created: function(){

  },
  mounted: function(){
    // initialize settings
    var type = this.view.view.extends.name;
    var viewName = this.view.view.name;
    if(type==='DataView'){
      this.settings = _.cloneDeep(this.dataViewSettings[viewName]);
    }
    else if(type==='NavView'){
      this.settings = _.cloneDeep(this.navViewSettings[viewName]);
    }
  },
  methods: {
    saveSettings: function(){
      console.log("saveSettings called!");
      var type = this.view.view.extends.name;
      var settingsReg = {
        name:this.view.view.name,
        settings:this.internalSettings,
      };
      if(type==='DataView'){
        this.$store.commit('addDataViewSettings',settingsReg);
      }
      else if(type==='NavView'){
        this.$store.commit('addNavViewSettings',settingsReg);
      }
    },
  }
}

</script>
