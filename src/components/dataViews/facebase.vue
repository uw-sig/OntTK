<template>
  <div id="content-area">
    <div id="fb-label">FaceBase datasets with samples annotated with {{node.label}}:</div>
    <div id="no-data-found" v-if="!loading&&fbDatasetLinks.length===0">...no datasets found</div>
    <div v-loading="loading" id="fb-area">
      <!--<span v-if="fbDatasetLinks==undefined||fbDatasetLinks.length===0">... no FaceBase data available</span>-->
        <div class="pointer val-text" v-for="dataset in fbDatasetLinks">
          <!--<i class="el-icon-view"></i>-->
          <!--https://www.facebase.org/data/record/#1/isa:dataset/accession=FB00000969-->
          <a :href="'https://www.facebase.org/data/record/#1/isa:dataset/accession='+dataset.accession" target="_blank">
            <span class="val-text">{{ dataset.title }}</span>
          </a>
        </div>

      <!--<iframe id="facebase" v-if="fbLink!=undefined" :src="fbLink"/>-->
    </div>
  </div>
</template>

<script>
import DataView from '@/components/dataViews/dataView.vue';
import Vue from 'vue';

export default {
  name: 'FaceBase',
  extends: DataView,
  data () {
    return {
      //fbLink:null
      fbDatasetLinks:[],
      loading:false
    }
  },
  methods: {
    getAnnotatedDatasets : function(classIRI)
    {
      var facebase = {
        dataset_url: function getDatasetURL(class_iri){
          var encoded_class_iri = encodeURIComponent(class_iri);
          return `
          https://www.facebase.org/ermrest/catalog/1/entity/vocabulary:anatomy/iri=${encoded_class_iri}/sample/dataset
          `
        }
      };

      var options = {
        params: {},
        headers: {Accept:"application/sparql-results+json; charset=utf-8"},
        //responseType: 'json'
      };

      // var proxy_url='http://localhost/ocdm/browser/simple-facebase-proxy.php?url='
      //var proxy_url='static/simple-facebase-proxy.php?url=';

      // TODO: replace this temp proxy
      var proxy_url = 'https://cors-anywhere.herokuapp.com/'
      var facebase_dataset_url = facebase.dataset_url(classIRI).trim();//+'?callback=results';
      //var proxied_facebase_dataset_url = proxy_url+encodeURIComponent(facebase_dataset_url);
      var proxied_facebase_dataset_url = proxy_url+facebase_dataset_url;

      //console.log(proxied_facebase_dataset_url);
      return Vue.http.get(proxied_facebase_dataset_url,options).then((response) => Promise.resolve(response.data))
        .catch((error) => Promise.reject(error));

        /*
      promise.then((response) => success_function(response))
        .catch((error) => error_function(error));
        */
    },
    notifyActive: function(){
      // make tab inactive until we can get results from FB
      this.$emit('active',false);

      // empty previous links if any
      this.fbDatasetLinks = [];

      this.loading = true;
      var promise = this.getAnnotatedDatasets(this.node.iri);
      promise.then((response) => {
        if(response.length>0){
          //this.fbLink = "https://www.facebase.org/data/record/#1/vocabulary:anatomy/iri="+encodeURIComponent(this.node.iri);
          for(var i=0; i<response.length; i++){
            var result = response[i];

            // test
            this.fbDatasetLinks.push(result);
          }
          this.$emit('active',true);

        }
        else{
          this.$emit('active',false);
        }

        this.loading = false;
      }).catch((error) => alert(JSON.stringify(error)));

      // make tab inactive until we can get results from FB
      /*
      if(this.fbDatasetLinks==undefined||this.fbDatasetLinks.length===0){
        this.$emit('active',false);
      }
      else {
        this.$emit('active',true);
      }
      */

      // emit 'inactive' if this view has nothing to show
      /*
      if(this.fbDatasetLinks.length>0){
        this.$emit('active',true);
      }
      else {
        this.$emit('active',false);
      }
      */
    },
    testQuery: function(){
      var success = function(results){alert("results = "+results)};
      var error = function(errors){alert("errors = "+errors)};
      this.getAnnotatedDatasets("http://purl.obolibrary.org/obo/MA_0000023", success, error);
    }
  },
}
</script>

<style scoped>
#fb-label {
  height:20px;
}
#fb-area, #facebase {
  width:100%;
  height:calc(100% -  20px);
  overflow:auto;
}
#content-area {
  overflow: hidden;
}
#tab-content, #content-area {
  height: 100%;
}

#no-data-found {
  padding-top:20px;
}

.val-text{
  width:calc(100% -  20px);
  display:inline-block;
  text-indent : -15px ;
  margin-left :  15px ;
  padding-top:5px;
}

.dataset-link {

}

.pointer {
  display: inline-block
}
</style>
