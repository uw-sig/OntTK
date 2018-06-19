<template>
  <div id='container'>
    <model-obj src="static/models/2704.obj" @on-mousemove="onMouseMove"></model-obj>
    <model-three src="static/models/scene.json" ></model-three>
  </div>
</template>

<script>
import DataView from '@/components/dataViews/dataView.vue';
import { ModelThree } from 'vue-3d-model';
import { ModelObj } from 'vue-3d-model';
//var objFile = require('../../assets/models/scene.json');
//var objFile2 = require('../../assets/models/2706.obj');

export default {
  name: 'SceneTest',
  extends: DataView,
  components: {
    'model-three':ModelThree,
    'model-obj':ModelObj
  },
  data () {
    return {
    }
  },
  mounted: function(){
    this.$forceUpdate();
  },
  methods: {
    notifyActive: function(){
      // emit 'inactive' if this view has nothing to show
      this.$emit('active',true);

    },
    onMouseMove ( event ) {

        console.log( event );   // event: { distance, face, faceIndex, point, index, uv, object }

        if ( !event ) {

            if ( this.intersected ) {
                this.intersected.material.color.setStyle( '#fff' );
            }

            this.intersected = null;
            return;
        }

        this.intersected = event.object;
        this.intersected.material.color.setStyle( 'orange' );
    }
  }
}
</script>

<style>
#container , canvas , model-obj {
  width:100%;
  height:100%;
}
</style>
