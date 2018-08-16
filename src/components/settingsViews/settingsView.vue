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
      //internalSettings:{}
      //settings:{}
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
        var type = this.view.view.extends.name;
        var viewName = this.view.view.name;
        if(type==='DataView'){
          return this.dataViewSettings[viewName];
        }
        else if(type==='NavView'){
          return this.navViewSettings[viewName];
        }
        /*
        var latestSettings = {};
        if(this.view.view.extends!=undefined && this.view.view.extends.name==="DataView"){
          latestSettings = this.$store.getters.getDataViewSettings(this.view.name);
        }
        return latestSettings;
        */
        //return this.internalSettings;
      },
      set:function(val){
        var type = this.view.view.extends.name;
        var settingsReg = {
          name:this.view.view.name,
          settings:val,
        };
        if(type==='DataView'){
          this.$store.commit('addDataViewSettings',settingsReg);
        }
        else if(type==='NavView'){
          this.$store.commit('addNavViewSettings',settingsReg);
        }

        //this.$store.dispatch('settingsRegister',settingsReg);
        //this.internalSettings = val;
      }
    }

  },
  watch: {
    /*
    settings:{
      handler: function(newValue){
        console.log("settings changed, new value = "+JSON.stringify(newValue));
      },
      deep: true
    },
    */
    /*
    currSettings: {
      handler: function(newValue) {
          console.log("currSettings changed, new value = "+JSON.stringify(newValue));
          this.settingsUpdate(newValue);
      },
      deep: true
    }
    */
  },
  created: function(){
    //this.settings = this.internalSettings;
  },
  mounted: function(){
    //this.settings = this.internalSettings;
    /*
    if(this.view.view.extends!=undefined && this.view.view.extends.name==="DataView"){
      this.settings = this.$store.getters.getDataViewSettings(this.view.name);
    }
    */

  },
  methods: {

    // methods to wrap store
    //(so DataView implementations don't need to reference it)
    /*
    queryOntology: function(sparql) {
      var queryObj = {
        query:sparql
      }

      return this.$store.dispatch('query',queryObj)
    },
    getQueries: function() {
      var settingsViewMap = this.$store.getters.getSettingsViewMap;
      return this.$store.getters.getQueries;
    },
    */
    /*
    settingsUpdate: function(){
      var newSettings = this.settings;
      var settingsObj = {name:this.view.name,type:this.view.view.extends.name,settings:newSettings}
      this.$store.dispatch('settingsRegister',settingsObj);
      //this.$emit('settings-update',settingsObj);
    }
    */
  }
}

</script>
