<template>
  <el-dialog
    title="Settings"
    :visible="visible"
    @close="close"
  >
    <!-- settings options go here -->
    <!-- general settings -->
    <span class="settings-header">General Settings</span>
    <div class="settings-area">
      <el-row class="option-row">
        <el-col :span="6" class="settings-label">
          <span>active navigation view:</span>
        </el-col>
        <el-col :span="18">
          <el-select v-model="tempActiveNavView" placeholder="Select" value-key="name">
            <el-option
              v-for="view in $store.getters.getAllNavViews"
              :key="view.name"
              :label="view.name"
              :value="view"
              >
            </el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row class="option-row">
        <el-col :span="6" class="settings-label">
          <span>active data views:</span>
        </el-col>
        <el-col :span="18">
          <el-select v-model="tempActiveDataViews" multiple placeholder="Select" value-key="name">
            <el-option
              v-for="view in $store.getters.getAllDataViews"
              :key="view.name"
              :label="view.name"
              :value="view"
              >
            </el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row>
        <el-button @click="clearStoredSettings" size="mini">clear saved settings</el-button>
        <span class="warning">* Warning, this will reset selected concept as well</span>
      </el-row>
    </div>

    <!-- nav view settings -->
    <span class="settings-header">Navigation View Settings</span>
    <div class="settings-area">
      <div
        v-if="tempActiveNavView.view.data().settingsView !== undefined"
      >
        <span class="view-name">{{tempActiveNavView.name}} navigation view settings:</span>
        <component
          :is='tempActiveNavView.view.data().settingsView'
          :view='tempActiveNavView'
          :ref="tempActiveNavView.view.data().settingsView.name"
        ></component>
      </div>
    </div>

    <!-- data view settings -->
    <span class="settings-header">Data View Settings</span>
    <div class="settings-area">
      <div
        v-for="dataView in tempActiveDataViews"
        v-if="dataView.view.data().settingsView !== undefined"
      >
        <span class="view-name">{{dataView.name}} data view settings:</span>
        <component
          :is='dataView.view.data().settingsView'
          :view='dataView'
          :ref="dataView.view.data().settingsView.name"
        ></component>
      </div>
    </div>

    <span slot="footer" class="dialog-footer">
      <!--<el-button @click="persist" disabled>Persist</el-button>-->
      <!--<el-button @click="close">Close</el-button>-->
      <el-button type="primary" @click="update">Update</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props:['visible'],
  data() {
    return {
      tempActiveNavView:null,
      tempActiveDataViews:[],
    }
  },
  created: function(){
    this.tempActiveNavView = this.$store.getters.getActiveNavView;
    this.tempActiveDataViews = this.$store.getters.getActiveDataViews;
  },
  computed:{
    /*
    activeNavView:{
      get: function(){
        return this.$store.getters.getActiveNavView;
      },
      set: function(newValue){
        this.tempActiveNavView = newValue;
        //this.$store.commit('setActiveNavView',newValue);
      }
    },
    activeDataViews:{
      get: function(){
        return this.$store.getters.getActiveDataViews;
      },
      set: function(newValue){
        this.tempActiveDataViews = newValue;
        //this.$store.commit('setActiveNavView',newValue);
      }
    }
    */
  },
  methods: {
    clearStoredSettings: function(event){
      this.$store.dispatch('clearStoredSettings');
    },
    persist: function(event){
      //TODO: you are here, add store method to persist settings to local storage, also need code to load these in on start-up
    },
    update: function(event){
      this.$store.commit('setActiveNavView',this.tempActiveNavView);
      this.$store.commit('setActiveDataViews',this.tempActiveDataViews);

      var vm = this;
      Object.keys(this.$refs).forEach(function(key,index) {
          // key: the name of the object key
          // index: the ordinal position of the key within the object

          // check if array (TODO:figure out why this is needed)
          var settingsView = vm.$refs[key];
          if(settingsView==undefined){
            return;
          }
          if(Array.isArray(settingsView)){
            if(settingsView.length>0){
              settingsView[0].saveSettings();
            }
          }
          else {
            settingsView.saveSettings()
          }
      });

      vm.$store.dispatch('storeSettings');

      //this.$emit('settings-update');
      this.$emit('settings-close');
    },
    close: function(event){
      this.$emit('settings-close');
    }

  }
}
</script>

<style>
.settings-label{
  max-width:150px;
}
.settings-header{
  font-size: 14pt;
  text-decoration: underline;
}
.settings-area {
  padding-bottom:15px;
}
.view-name {
  font-weight:bold;
}
.option-row {
  padding-bottom:5px;
}
.el-select__tags {
  margin-left:5px;
}
.warning {
  color:#E6A23C;
}
</style>
