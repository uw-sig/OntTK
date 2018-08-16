<template>
</template>

<script>
/*
  Because DataViews may need to issue their own ontology queries, we should
  assume that they have access to the Vuex store. Hopefully we can limit store
  interaction to this base component.
*/
export default {
  name: 'DataView',
  props: ['node','property'],
  data () {
    return {
      //settings:{},//this.$store.getters.getDataViewSettings,
      initSettings:{},
      settingsView:null,
    }
  },
  computed: {
    dataViewSettings:function(){
      return this.$store.getters['getDataViewSettings'];
    },

    settings:{
      get:function(){
        return this.dataViewSettings[this.$options.name];
      },
      set:function(value){
        var settingsReg = {
          name:this.$options.name,
          settings:value,
        };
        this.$store.commit('addDataViewSettings',settingsReg);
      }
    },
  },
  watch: {
    node: function (val) {
      // node change, may need to send inactive event to parent
      this.notifyActive();
    },
    property: function (val) {
      // property change, may need to send inactive event to parent
      this.notifyActive();
    },
  },
  created: function(){
    // if this view has settings, register it in the store
    this.settingsRegister();
  },
  mounted: function(){

    var vm = this;
    /*
    this.$store.watch(vm.$store.getters.getSettings, n => {
      console.log('watched: ', n)
    });

    /*
    vm.$store.watch(
      function (state) {
        return state;
      },
      function(){
        //vm.settings = vm.$store.getters['getDataViewSettings'](vm.$options.name);
        console.log("reset to "+JSON.stringify("store settings changed!"));
          //alert("new settings: "+JSON.stringify(vm.$store.getters.getSettings));
      },
      {
        deep: true,
        //immediate: true,
      }
    );
    */
    /*
      Test upon mounted if this DataView has results to show, notify parent
      if not.
      */
    this.notifyActive();



    //test
    //this.settings = initSettings;
  },

  methods: {
    notifyActive: function(){
      // noop in base DataView
      // emit 'active' if this view has nothing to show
    },
    notifyNodeSelect: function(item){
      this.$emit('node-selected',item);
    },
    notifyPropertySelect: function(item){
      this.$emit('property-selected',item);
    },
    /*
    getSettings: function(){
      return this.settings;
    },
    setSettings: function(settings){
      this.settings = settings;
    },

    getCurrentSettings: function(){
      return this.settings;//this.currentSettings;
    },
    */
    getSettingsView: function(){
      return this.settingsView;
    },

    // methods to wrap store
    //(so DataView implementations don't need to reference it)
    queryOntology: function(sparql) {
      var queryObj = {
        query:sparql
      }

      return this.$store.dispatch('query',queryObj)
    },
    getQueries: function() {
      return this.$store.getters.getQueries;
    },
    /*
    updateSettings: function(newSettings){
      this.settings = newSettings;
      alert("Description view settings changed to "+JSON.stringify(this.settings));
    },
    */

    settingsRegister: function(){
      if(!_.isEmpty(this.initSettings)){
        this.settings = this.initSettings;
      }
    },
    /*
    settingsUnregister: function(){

    }
    */
  }
}

</script>
