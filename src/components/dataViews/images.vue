<template>
  <div id="content-area">
    <div class="head">Images for {{node.label}}</div>

    <div class="sub-head">Exact matches:</div>
    <div class="image-area">
      <span v-if="images.length===0">... no images available</span>
      <el-tooltip class="item" effect="dark" :content="node.label" placement="top-start" v-for="image,index in images" :key="index">
        <el-button class="image-btn" @click="openImage(node.label,image)">
          <img :src="image" class="preview">
        </el-button>
      </el-tooltip>
    </div>

    <div id="related-non-lateralized" v-if="imagesNonLat.length!==0">
      <div class="sub-head">Related (no laterality):</div>
      <div class="image-area">
        <template v-for="nonLatImage in imagesNonLat">
          <template v-for="image,index in nonLatImage.images">
            <el-tooltip class="item" effect="dark" :content="nonLatImage.label" placement="top-start" :key="nonLatImage.label+'_'+index">
              <el-button class="image-btn" @click="openImage(nonLatImage.label,image)">
                <img :src="image" class="preview">
              </el-button>
            </el-tooltip>
          </template>
        </template>
      </div>
    </div>

    <div id="related-parts" v-if="partImages.length!==0">
      <div class="sub-head">Related (parts):</div>
      <div class="image-area">
        <template v-for="partImage in partImages">
          <template v-for="image,index in partImage.images">
            <el-tooltip class="item" effect="dark" :content="partImage.label" placement="top-start" :key="partImage.label+'_'+index">
              <el-button class="image-btn" @click="openImage(partImage.label,image)">
                <img :src="image" class="preview">
              </el-button>
            </el-tooltip>
          </template>
        </template>
      </div>
    </div>

    <div id="related-dev" v-if="devImages.length!==0">
      <div class="sub-head">Related (development):</div>
      <div class="image-area">
        <template v-for="devImage in devImages">
          <template v-for="image,index in devImage.images">
            <el-tooltip class="item" effect="dark" :content="devImage.label" placement="top-start" :key="devImage.label+'_'+index">
              <el-button class="image-btn" @click="openImage(devImage.label,image)">
                <img :src="image" class="preview">
              </el-button>
            </el-tooltip>
          </template>
        </template>
      </div>
    </div>

    <div id="related-dev-part" v-if="devPartImages.length!==0">
      <div class="sub-head">Related (development+part):</div>
      <div class="image-area">
        <template v-for="devPartImage in devPartImages">
          <template v-for="image,index in devPartImage.images">
            <el-tooltip class="item" effect="dark" :content="devPartImage.label" placement="top-start" :key="devPartImage.label+'_'+index">
              <el-button class="image-btn" @click="openImage(devPartImage.label,image)">
                <img :src="image" class="preview">
              </el-button>
            </el-tooltip>
          </template>
        </template>
      </div>
    </div>

    <el-dialog :title="selectedImage.label" width="60%" top="50px" :visible.sync="imageDialogVisible" append-to-body v-if="selectedImage!=undefined">
      <div class="full-image-area">
        <img :src="selectedImage.image" class="fullview"></img>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="closeImage">Close</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import DataView from '@/components/dataViews/dataView.vue';

export default {
  name: 'Images',
  extends: DataView,
  data () {
    return {
      imageDialogVisible:false,
      selectedImage:null,
      imageMap:[
        {
          label:"Mandible (Mus musculus)",
          iri:"http://purl.obolibrary.org/obo/MA_0001487",
          images:["http://www.informatics.jax.org/cookbook/images/15.jpg","http://www.vivo.colostate.edu/hbooks/pathphys/digestion/pregastric/ratlatman.jpg"]
        },
        {
          label:"Skull (Mus musculus)",
          iri:"http://purl.obolibrary.org/obo/MA_0000316",
          images:["http://ungeziefer-im-haus.de/wp-content/uploads/2015/02/Sch%C3%A4del-einer-HAsuratte.jpg"]
        },
        {
          label:"Coronoid process of mandible (Mus musculus)",
          iri:"http://purl.obolibrary.org/obo/MA_0002819",
          images:["http://www.genetics.org/content/genetics/157/2/785/F5.large.jpg"]
        },
        {
          label:"Articular cartilage of head of mandible (Mus musculus)",
          iri:"http://purl.org/sig/ont/cmo/cmo0006782",
          images:["https://www.researchgate.net/profile/Rachel_Menegaz/publication/51215982/figure/fig4/AS:277216668733442@1443105012531/Mouse-TMJ-articular-cartilage-composition-Coronal-sections-of-middle-joint-sites-for-KO.png"]
        },
        {
          label:"E18.5 maxilla (Mus musculus)",
          iri:"http://purl.org/sig/ont/cmo/cmo0030241",
          images:["https://face.usc.edu/files/2011/05/maxilla-landmarks-1024x903.jpg"]
        },
        {
          label:"E18.5 palatine bone (Mus musculus)",
          iri:"http://purl.org/sig/ont/cmo/cmo0030251",
          images:["https://face.usc.edu/files/2011/05/palatine-landmarks-1024x902.jpg"]
        },
        {
          label:"E18.5 skull (Mus musculus)",
          iri:"http://purl.org/sig/ont/cmo/cmo0030261",
          images:[
            "https://face.usc.edu/files/2012/03/AH244CCMB_control_Msx1-littermate_Bone_coronalA.jpg",
            "https://face.usc.edu/files/2012/03/AH244CCMB_control_Msx1-littermate_Bone_coronalP.jpg",
            "https://face.usc.edu/files/2012/03/AH244CCMB_control_Msx1-littermate_Bone_sagittalL.jpg",
            "https://face.usc.edu/files/2012/03/AH244CCMB_control_Msx1-littermate_Bone_sagittalR.jpg",
            "https://face.usc.edu/files/2012/03/AH244CCMB_control_Msx1-littermate_Bone_transverseI.jpg",
            "https://face.usc.edu/files/2012/03/AH244CCMB_control_Msx1-littermate_Bone_transverseS.jpg"
          ]
        }

      ],

      images:[],
      imagesNonLat:[],
      partImages:[],
      devImages:[],
      devPartImages:[]
    }
  },
  watch: {
    node: function (newVal,oldVal) {
      // node change,
      if(newVal!==oldVal){
        this.images = this.imagesNonLat = this.partImages = this.devImages = this.devPartImages = [];
        this.updateImageData();
      }
    },
    images: function(val){
      this.notifyActive();
    },
    partImages: function(val){
      this.notifyActive();
    },
    devImages: function(val){
      this.notifyActive();
    }
  },
  mounted: function(){
    this.updateImageData();
  },
  computed: {

  },
  methods: {
    notifyActive: function(){
      // emit 'inactive' if this view has nothing to show
      if(this.images.length>0||this.partImages.length>0||this.devImages.length>0){
        this.$emit('active',true);
      }
      else {
        this.$emit('active',false);
      }
    },
    updateImageData: function(){
      // empty things out first
      //this.images = this.partImages = this.devImages = [];

      // direct matches
      this.images = this.imagesForIri(this.node.iri);

      // images of non lateralized entity
      var nonLatQueryString = this.getQueries().related_non_lateralized_query(this.node.iri);
      var nonLatPromise = this.queryOntology(nonLatQueryString);
      nonLatPromise.then((results) => {
        this.imagesNonLat = this.getImagesForResults(results);
      }).catch((errors) => {
        this.handleErrors(errors);
      });

      // images of parts
      var partQueryString = this.getQueries().related_parts_query(this.node.iri);
      var partPromise = this.queryOntology(partQueryString);
      partPromise.then((results) => {
        this.partImages = this.getImagesForResults(results);
      }).catch((errors) => {
        this.handleErrors(errors);
      });

      // images of developmentally related entities
      var devQueryString = this.getQueries().related_development_query(this.node.iri);
      var devPromise = this.queryOntology(devQueryString);
      devPromise.then((results) => {
        this.devImages = this.getImagesForResults(results);
      }).catch((errors) => {
        this.handleErrors(errors);
      });

      // images related using developmental and part properties
      var devPartQueryString = this.getQueries().related_dev_part_query(this.node.iri);
      var devPartPromise = this.queryOntology(devPartQueryString);
      devPartPromise.then((results) => {
        this.devPartImages = this.getImagesForResults(results);
      }).catch((errors) => {
        this.handleErrors(errors);
      });
    },
    imagesForIri: function(iri){
      var mapEntry = this.imageMap.find(item => item.iri === iri);
      if(mapEntry==undefined){
        return [];
      }
      else{
        return mapEntry.images;
      }
    },
    getImagesForResults: function(results) {
      // property, value, label
      var resObj = results;
      var bindings = resObj.results.bindings;

      var imageInfo = [];
      for (var count = 0; count < bindings.length; count++) {
        var binding = bindings[count];

        var val = {};
        var iri = binding.result.value;
        var images = this.imagesForIri(iri);
        if(images.length>0)
        {
          val['iri'] = iri;
          if(binding.resultLabel != undefined){
            val['label'] = binding.resultLabel.value;
          }
          val['images'] = images;
          imageInfo.push(val);
        }
      }
      return imageInfo;
    },
    openImage: function(label,image) {
      this.selectedImage = {'label':label,'image':image};
      this.imageDialogVisible = true;
    },
    closeImage: function(){
      this.selectedImage=null;
      this.imageDialogVisible=false;
    },
    handleErrors: function(errors){
      alert("images errors: "+errors);
    },
  }
}
</script>

<style scoped>
  .head {
    font-size: large;
  }
  .sub-head {
    margin-top:10px;
    font-weight:bold;
  }
  .preview {
    padding:0;
    max-height:100px;
    max-width:100px;
    display: block;
    margin:auto;
  }
  .fullview {
    padding:0;
    max-height:100%;
    max-width:100%;
    display: block;
    margin:auto;
  }
  .image-area {
    display: block;
  }
  .image-btn {
    padding:0;
    margin:1px;
    width:100px;
    height:100px;
    min-width:100px;
    min-height:100px;
    overflow:hidden;
    background-color: white;
  }
  .full-image-area {
    overflow:auto;
  }
  #tab-content, #content-area {
    height: 100%;
  }
</style>
