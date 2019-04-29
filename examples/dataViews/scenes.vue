<template>
  <div id="content-area">
    <div id="scene-label">Scene for: {{node.label}}</div>
    <div id="scene-area">
      <span v-if="scene==undefined">... no scenes available</span>
      <iframe id="scene" v-if="scene!=undefined" :src="scene"/>
    </div>
  </div>
</template>

<script>
import DataView from '@/components/dataViews/dataView.vue';

export default {
  name: 'Scenes',
  extends: DataView,
  data () {
    return {
      sceneMap:[
        {iri:"http://purl.org/sig/ont/fma/fma46565",
        scene:"http://resources.si.washington.edu/scene"},
        {iri:"http://purl.org/sig/ont/fma/fma52740",
        scene:"http://resources.si.washington.edu/scene?selected_id=18185"},
        {iri:"http://purl.org/sig/ont/fma/fma52734",
        scene:"http://resources.si.washington.edu/scene?selected_id=18186"},
        {iri:"http://purl.org/sig/ont/fma/fma53646",
        scene:"http://resources.si.washington.edu/scene?selected_id=18187"},
        {iri:"http://purl.org/sig/ont/fma/fma53650",
        scene:"http://resources.si.washington.edu/scene?selected_id=18188"},
        {iri:"http://purl.org/sig/ont/fma/fma53648",
        scene:"http://resources.si.washington.edu/scene?selected_id=18189"},
        {iri:"http://purl.org/sig/ont/fma/fma52789",
        scene:"http://resources.si.washington.edu/scene?selected_id=18190"},
        {iri:"http://purl.org/sig/ont/fma/fma52893",
        scene:"http://resources.si.washington.edu/scene?selected_id=18191"},
        {iri:"http://purl.org/sig/ont/fma/fma53645",
        scene:"http://resources.si.washington.edu/scene?selected_id=18192"},
        {iri:"http://purl.org/sig/ont/fma/fma53649",
        scene:"http://resources.si.washington.edu/scene?selected_id=18193"},
        {iri:"http://purl.org/sig/ont/fma/fma53647",
        scene:"http://resources.si.washington.edu/scene?selected_id=18194"},
        {iri:"http://purl.org/sig/ont/fma/fma52788",
        scene:"http://resources.si.washington.edu/scene?selected_id=18195"},
        {iri:"http://purl.org/sig/ont/fma/fma52892",
        scene:"http://resources.si.washington.edu/scene?selected_id=18196"},
        {iri:"http://purl.org/sig/ont/fma/fma52736",
        scene:"http://resources.si.washington.edu/scene?selected_id=18197"},
      ],
    }
  },
  watch: {
    node: function (val) {
      // node change,
      //console.log("node val = "+JSON.stringify(val));
    }
  },
  computed: {
    scene: function(){
      var mapEntry = this.sceneMap.find(item => item.iri === this.node.iri);
      if(mapEntry==undefined){
        return null;
      }
      else{
        return mapEntry.scene;
      }
    }
  },
  methods: {
    notifyActive: function(){
      // emit 'inactive' if this view has nothing to show
      if(this.scene!=undefined){
        this.$emit('active',true);
      }
      else {
        this.$emit('active',false);
      }
    },
  }
}
</script>

<style scoped>
#scene-label {
  height:20px;
}
#scene-area, #scene {
  width:100%;
  height:calc(100% -  20px);
}
#content-area {
  overflow: hidden;
}
#tab-content, #content-area {

  height: 100%;
}
</style>
