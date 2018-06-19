<template>
  <div id="content-area">
    <div>Images for: {{node.label}}</div>
    <div><span v-if="images.length===0">... no images available</span><img v-for="image in images" id="image-data" :src="image"></div>
  </div>
</template>

<script>
import DataView from '@/components/dataViews/dataView.vue';

export default {
  name: 'Images',
  extends: DataView,
  data () {
    return {
      imageMap:[
        {iri:"http://purl.obolibrary.org/obo/MA_0001487",
        images:["http://www.informatics.jax.org/cookbook/images/15.jpg",
          "http://media.springernature.com/full/springer-static/image/art%3A10.1186%2F1471-2148-14-85/MediaObjects/12862_2013_Article_2567_Fig1_HTML.jpg"]}],
    }
  },
  watch: {
    node: function (val) {
      // node change,
      //console.log("node val = "+JSON.stringify(val));
    }
  },
  computed: {
    images: function(){
      var mapEntry = this.imageMap.find(item => item.iri === this.node.iri);
      if(mapEntry==undefined){
        return [];
      }
      else{
        return mapEntry.images;
      }
    }
  },
  methods: {
    notifyActive: function(){
      // emit 'inactive' if this view has nothing to show
      if(this.images.length>0){
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
  #image-data {
    max-width:100%;
  }
  #tab-content, #content-area {
    height: 100%;
  }
</style>
