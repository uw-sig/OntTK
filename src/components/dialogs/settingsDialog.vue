<template>
  <el-dialog
    title="Settings"
    :visible="visible"
    @close="close"
  >
    <!-- settings options go here -->
    <!-- general settings -->
    <!--
    <span class="settings-header">General Settings</span>
    <div class="settings-area">

    </div>
    -->

    <!-- nav view settings -->
    <span class="settings-header">Navigation View Settings</span>
    <div class="settings-area">
      <div
        v-for="navView in $store.getters.getSelectedNavViews"
        v-if="navView.view.data().settingsView !== undefined"
      >
        <span>{{navView.name}} navigation view settings:</span>
        <component
          :is='navView.view.data().settingsView'
          :view='navView'
        ></component>
      </div>
    </div>

    <!-- data view settings -->
    <span class="settings-header">Data View Settings</span>
    <div class="settings-area">
      <div
        v-for="dataView in $store.getters.getSelectedDataViews"
        v-if="dataView.view.data().settingsView !== undefined"
      >
        <span>{{dataView.name}} data view settings:</span>
        <component
          :is='dataView.view.data().settingsView'
          :view='dataView'
        ></component>
      </div>
    </div>



    <span slot="footer" class="dialog-footer">
      <el-button @click="close">Close</el-button>
      <!--<el-button type="primary" @click="updateSettings">Update</el-button>-->
    </span>
  </el-dialog>
</template>

<script>
export default {
  props:['visible'],
  data() {
    return {

    }
  },
  methods: {
    /*
    getSettingsForDataView: function(currDataView){
      return currDataView.view.extends.methods.getCurrentSettings();
    },
    */
    /*
    updateSettings: function(settingsObj){

      //alert("settings = "+JSON.stringify(settingsObj));
      var view = settingsObj.view;
      var settings = settingsObj.settings;

      // clunky way of calling base object method
      //view.view.extends.methods.updateSettings(settings);

      //console.log(JSON.stringify(view.view.settings));
      //TODO: 'event' above does not include iri
      //alert(JSON.stringify(event));
    },
    */
    close: function(event){
      this.$emit('settings-close');
    }

  }
}
</script>

<style>
.settings-header{
  font-size: 14pt;
  text-decoration: underline;
}
.settings-area {
  padding-bottom:10px;
}
</style>
