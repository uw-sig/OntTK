<template>
  <div id="app">
    <el-container>
      <el-header height="60px">
        <el-row type="flex" class="row-bg" align="middle">
          <el-col :span="12">
            <el-row type="flex">
              <img id="logo" src="./assets/sig_logo_3.png"></img>
              <span id="logo-text">{{title}}</span>
            </el-row>
          </el-col>
          <el-col :span="12" id="header-tools">
            <el-row type="flex" align="middle">
              <el-col :span="18">
                <el-row type="flex" justify="end">
                  <span id="search-label">search:</span>
                  <el-input class="search-input" placeholder="enter search term ..." prefix-icon="el-icon-search" v-on:keyup.enter.native="search"></el-input>
                </el-row>
              </el-col>
              <el-col :span="6">
                <el-row type="flex" justify="end" align="middle">
                    <el-popover
                      ref="backpop"
                      placement="bottom"
                      trigger="hover"
                      :content="$store.getters.getNextNodeBackwardLabel">
                    </el-popover>
                    <el-popover
                      ref="forwardpop"
                      placement="bottom"
                      trigger="hover"
                      :content="$store.getters.getNextNodeForwardLabel">
                    </el-popover>
                    <el-button-group>
                      <el-button class="history-button" type="primary" size="mini" v-popover:backpop
                        icon="el-icon-arrow-left" :disabled="!$store.getters.getHasHistoryBackward" @click="$store.dispatch('historyBackward')">
                      </el-button>
                      <el-button class="history-button" type="primary" size="mini" v-popover:forwardpop
                        icon="el-icon-arrow-right" :disabled="!$store.getters.getHasHistoryForward" @click="$store.dispatch('historyForward')">
                      </el-button>
                    </el-button-group>
                    <i id="settings-button" class="el-icon-setting" @click="showSettings"></i>
                </el-row>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </el-header>
      <el-container id="middle">
        <!--<el-aside width="150px"></el-aside>-->
        <el-main>
          <browser :navWidth="navWidth" v-loading="isLoading" />
        </el-main>
      </el-container>
      <el-footer height="40px">
        <el-row type="flex" class="row-bg" >
          <el-col :span="14" type="flex">
            <span>Copyright &copy; 2018 University of Washington Structural Informatics Group</span>
          </el-col>
          <el-col :span="6">
            <el-row type="flex" justify="end">
              <span id="nav-width-label-area">display:</span>
              <div id="nav-width-slider-area"><el-slider v-model="navWidth" :max="24" :step="1"></el-slider></div>
            </el-row>
          </el-col>
          <el-col :span="4" id="footer-tools">
            <el-row type="flex" justify="end" id="bookmark-area" align="middle">
              <i v-if="!isBookmarked" class="el-icon-star-off" @click="bookmarkAdd"></i>
              <i v-else class="el-icon-star-on" @click="bookmarkRemove"></i>
              <span class="bookmark-label">bookmarks:</span>
              <el-popover
                ref="bookmarkPopover"
                placement="top"
                width="200"
                trigger="hover"
              >
                <ul v-if="bookmarks.length>0">
                  <li class="bookmark-text" v-for="item in bookmarks">
                    <i @click="bookmarkRemoveSelected(item)" class="el-icon-delete"></i>
                    <span @click="setSelectedNode(item)">{{item.label}}</span>
                  </li>
                </ul>
                <span v-else>no bookmarks set</span>
              </el-popover>
              <el-button size="mini" type="primary" v-popover:bookmarkPopover>select</el-button>
            </el-row>
          </el-col>
        </el-row>
      </el-footer>
    </el-container>
    <search-results-dialog
      :visible="searchResultsDialogVisible"
      :fields="config.search.fields"
      :results="searchResults"
      @node-selected="setSelectedNode"
      @search-close="searchResultsDialogVisible=false"
    ></search-results-dialog>
    <settings-dialog
      :visible="settingsDialogVisible"
      @settings-update="settingsUpdate"
      @settings-close="settingsDialogVisible=false"
    ></settings-dialog>
  </div>
</template>

<script>
import searchResultsDialog from "@/components/dialogs/searchResultsDialog"
import settingsDialog from "@/components/dialogs/settingsDialog"
import browser from "@/components/Browser"
import {config} from '@/config'
export default {
  name: 'OntTK',
  components: {
    browser:browser,
    searchResultsDialog: searchResultsDialog,
    settingsDialog: settingsDialog,
  },
  data() {
    return {
      title: config.title,
      bookmarks: [],
      selectedBookmark: null,
      settingsDialogVisible: false,
      currSettings: {},

      // search related fields
      config:config,
      searchResultsDialogVisible: false,
      searchResults:[],

      // layout related fields
      navWidth: config.navWidth,
      //navWidthMax: 24,
    }
  },
  created: function(){
    // retrieve stored bookmarks
    var persistentBookmarks = localStorage.getItem('onttk-bookmarks');
    if(persistentBookmarks!=undefined){
      this.bookmarks = JSON.parse(persistentBookmarks);
    }

    // TODO: check local storage
    //this.currSettings = this.$store.getters.getSettings;

    // check and see if there was an IRI specified in the URL
    var iri = this.$route.query.iri;
    if(iri!=undefined){
      this.setNodeByIRI(iri);
    }
    else{
      this.$store.dispatch('setNodeWithHistory',config.init.node);
    }
  },
  computed: {
    isLoading: function(){
      return this.$store.getters.getLoading
    },
    currNode: function(){
      return this.$store.getters.getNode
    },
    isBookmarked: function(){
      if(this.currNode==undefined)
        return false;

      var currIRI = this.currNode.iri;
      var match = this.bookmarks.filter(bookmark => (bookmark.iri === currIRI));
      return match.length>0
    }
  },
  methods: {
    showSettings: function(){
      this.settingsDialogVisible=true;
    },
    bookmarkAdd: function(){
      var node = this.currNode;
      this.bookmarks.push(node);
      localStorage.setItem('onttk-bookmarks', JSON.stringify(this.bookmarks));
      //alert('bookmarking '+node.label);
    },
    bookmarkRemove: function(){
      var node = this.currNode;
      this.bookmarks = this.bookmarks.filter(item => item.iri !== node.iri);
      localStorage.setItem('onttk-bookmarks', JSON.stringify(this.bookmarks));
      //alert('deleting bookmark '+node.label);
    },
    bookmarkRemoveSelected: function(selected){
      this.bookmarks = this.bookmarks.filter(item => item.iri !== selected.iri);
      localStorage.setItem('onttk-bookmarks', JSON.stringify(this.bookmarks));
    },
    setNodeByIRI: function(iri){
      var promise = this.$store.dispatch('query',{query:this.config.iri_search.query(iri)});

      promise.then((results) => {
        this.searchResults=[];
        var resObj = results;//JSON.parse(results);
        var bindings = resObj.results.bindings;
        if(bindings.length>0){
          var binding = bindings[0];
          var nodeForIRI = {label:binding.label.value,iri:iri};
          //this.$store.commit('setNodeWithHistory',nodeForIRI);
          this.$store.dispatch('setNodeWithHistory',nodeForIRI);
        }
        else {
          // TODO: improve error handling
          alert("No class found for IRI: "+iri)
        }
      }).catch((errors) => {
        // TODO: improve error handling
        alert("failed iri search for "+iri);
      });
    },
    search: function(event){
      var searchTerm = event.target.value;
      searchTerm = searchTerm.trim();
      searchTerm = searchTerm.replace(/[\/\(\)\{\}\+\_\&\|\!\{\}\^\"\~\:\\]/g, "?");
    	searchTerm = searchTerm.replace(/ /g, '\\\\ ');
      console.log("searchTerm = "+searchTerm);
      var promise = this.$store.dispatch('query',{query:this.config.search.query(searchTerm)});
      promise.then((results) => {
        this.searchResults=[];
        var resObj = results;//JSON.parse(results);
        var bindings = resObj.results.bindings;
        var searchResults = [];
        for (var count = 0; count < bindings.length; count++) {
          var binding = bindings[count];
          var searchResult = {};
          for(var bindingVar in binding)
          {
            searchResult[bindingVar] = binding[bindingVar].value;
          }
          this.searchResults.push(searchResult);
        }
        this.searchResultsDialogVisible=true;
      }).catch((errors) => {
        console.log("failed search for "+searchTerm);
      });
    },
    setSelectedNode(node){
      //this.$store.commit('setNode',node);
      this.$store.dispatch('setNodeWithHistory',node);
    },
    settingsUpdate(){
      this.settingsDialogVisible=false;
    }
  }
}
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    min-width:1200px;
  }
  .el-header, .el-footer {
    background-color: #B3C0D1;
    color: #333;
  }
  .el-header {
    font-size: 20pt;
    font-weight: bold;
    line-height: 60px;
  }
  #header-tools {
    line-height:normal;
  }
  #footer-tools {
    line-height:normal;
  }
  #logo {
    height:48px;
    padding:6px;
    background: linear-gradient(to right, #B3C0D1 , #E9EEF3, #B3C0D1);
  }
  #logo-text {
    padding-left:10px;
  }
  #search-label {
    display: inline-block;
    font-size:12pt;
    padding-right:5px;
    line-height: 40px;
    padding-left:10px;
  }
  .search-input {
    padding-right:5px;
  }
  .history-button {
    margin: 0;
  }
  #settings-button{
    padding-left:10px;
    cursor:pointer;
  }
  #nav-width-label-area {
    font-size:12pt;
    margin-left:10px;
    margin-right:10px;
    //width: 100px;
  }
  #nav-width-slider-area {
    width: calc(100% - 100px);
    padding-left:10px;
  }
  .bookmark-label {
    padding-right:5px;
    padding-left:5px;
    line-height: 40px;
  }
  .el-icon-star-off, .el-icon-star-on{
    color:#409EFF;
    cursor: pointer;
  }
  .bookmark-text {
    color:blue;
    cursor: pointer;
  }
  .el-button--primary:focus {
    border-color: #409EFF;
    background-color: #409EFF;
  }
  .el-button--primary.is-disabled, .el-button--primary.is-disabled:active, .el-button--primary.is-disabled:focus, .el-button--primary.is-disabled:hover {
    border-color: lightgray !important;
    background-color: gray !important;
  }
  .el-button-group {
    white-space: nowrap;
  }
  .el-footer {
    font-weight: light;
    line-height: 40px;
  }
  .el-aside {
    background-color: #D3DCE6;
    color: #333;
  }
  .el-main {
    background-color: #E9EEF3;
    color: #333;
    margin: 0px !important; padding: 0px !important;
    height: 100%;
  }

  html,body,#app,#app > .el-container{ height: 100%; margin: 0px; padding: 0px;}

</style>
