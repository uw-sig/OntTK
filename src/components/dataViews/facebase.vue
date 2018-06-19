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
      loading:false,
      idPrefixToAccessionPrefix:{}
    }
  },
  created: function(){
    this.idPrefixToAccessionPrefix = this.createIRIToAccessionMap();
    this.getAccessionsLinkedToDatasets();
  },
  methods: {
    createIRIToAccessionMap: function(){
      // In the OCDM, all foreign IRIs are OBO based (have the same OBO domain)
      // The following ID prefixes are present and need to be mapped:
      // "DOID","EMAP","EMAPA","HP","MA","MP","ZFA","ZFS"
      var idPrefixToAccessionPrefix = {}
      idPrefixToAccessionPrefix["fma","FMA:"]
      idPrefixToAccessionPrefix["DOID_"]="DOID:";
      idPrefixToAccessionPrefix["EMAP_"]="EMAP:";
      idPrefixToAccessionPrefix["EMAPA_"]="EMAPA:";
      idPrefixToAccessionPrefix["HP_"]="HP:";
      idPrefixToAccessionPrefix["MA_"]="MA:";
      idPrefixToAccessionPrefix["MP_"]="MP:";
      idPrefixToAccessionPrefix["ZFA_"]="ZFA:";
      idPrefixToAccessionPrefix["ZFS_"]="ZFS:";
      return idPrefixToAccessionPrefix;
    },
    getAccessionsLinkedToDatasets: function(){
      //https://www.facebase.org/ermrest/catalog/1/entity/dataset/biosample/vocab:anatomy_terms
      var facebase_terms_url = 'https://www.facebase.org/ermrest/catalog/1/entity/dataset/biosample/vocab:anatomy_terms';
      var promise = this.resolveFacebaseQuery(facebase_terms_url);

      promise.then(results => {
        console.log(results);
      }, error => {
        alert(error);
      });
    },
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
      /*
      var facebase = {
        dataset_url: function getDatasetURL(class_iri){
          var encoded_class_iri = encodeURIComponent(class_iri);
          var datasetURL = 'https://www.facebase.org/ermrest/catalog/1/entity/vocabulary:anatomy/iri='+class_iri+'/sample/dataset';
          var encodedDatasetURL = encodeURIComponent(datasetURL);
          return encodedDatasetURL;
        }
      };
      */

      var options = {
        params: {},
        headers: {Accept:"application/sparql-results+json; charset=utf-8"},
        //responseType: 'json'
      };

      // var proxy_url='http://localhost/ocdm/browser/simple-facebase-proxy.php?url='
      //var proxy_url='static/simple-facebase-proxy.php?url=';

      // TODO: replace this temp proxy
      var proxy_url = 'https://cors-anywhere.herokuapp.com/'
      //var proxy_url = 'http://xiphoid.biostr.washington.edu/ocdm/browser/simple-facebase-proxy.php?url='
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
    resolveFacebaseQuery: function(facebase_query){
      var options = {
        params: {},
        headers: {Accept:"application/sparql-results+json; charset=utf-8"},
        //responseType: 'json'
      };

      // TODO: replace this temp proxy
      var proxy_url = 'https://cors-anywhere.herokuapp.com/';

      var proxied_facebase_query = proxy_url+facebase_query;

      //console.log(proxied_facebase_dataset_url);
      return Vue.http.get(proxied_facebase_query,options).then((response) => Promise.resolve(response.data))
        .catch((error) => Promise.reject(error));
    },
    notifyActive: function(){
      // make tab inactive until we can get results from FB
      this.$emit('active',false);

      //NOTE: FB tab is currently inactive due to breaking changes in FaceBase API

      /*
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
      }).catch((error) => alert("facebase error: "+error));
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
  font-weight: bold;
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
