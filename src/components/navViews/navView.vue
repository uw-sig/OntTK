<template>
</template>

<script>
/*
  Because NavViews may need to issue their own ontology queries, we should
  assume that they have access to the Vuex store. Hopefully we can limit store
  interaction to this base component.
*/
export default {
  name: 'NavView',
  props: ['node','property'],
  data () {
    return {
      initSettings:{},
      settingsView:null,
    }
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
  computed: {
    navViewSettings:function(){
      return this.$store.getters['getNavViewSettings'];
    },

    settings:{
      get:function(){
        return this.navViewSettings[this.$options.name];
      },
      set:function(value){
        var settingsReg = {
          name:this.$options.name,
          settings:value,
        };
        this.$store.commit('addNavViewSettings',settingsReg);
      }
    },
  },
  created: function(){
    // if this view has settings, register it in the store
    this.settingsRegister();
  },
  mounted: function(){
    /*
      Test upon mounted if this DataView has results to show, notify parent
      if not.
      */
    this.notifyActive();
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

    getSettingsView: function(){
      return this.settingsView;
    },

    settingsRegister: function(){
      if(_.isEmpty(this.settings)&&!_.isEmpty(this.initSettings)){
        this.settings = this.initSettings;
      }
    },
    reinit: function(){
      if(!_.isEmpty(this.initSettings)){
        this.settings = this.initSettings;
      }
    }
  }
}

</script>
