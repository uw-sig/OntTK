<template>
  <el-dialog title="Search Results" :visible="visible" @close="close">
    <!--
    <el-table :data="results">
      <el-table-column property="date" label="Date" width="150"></el-table-column>
      <el-table-column property="name" label="Name" width="200"></el-table-column>
      <el-table-column property="address" label="Address"></el-table-column>
    </el-table>
  -->
  <el-table :data="results" stripe height="300" @row-click="resultSelected">
    <el-table-column v-for="(item, index) in fields" :key="index" :property="item" :label="item" sortable></el-table-column>
  </el-table>
  </el-dialog>
</template>

<script>
export default {
  props:['visible','fields','results'],
  data() {
    return {

    }
  },
  /*
  computed: {
    isVisible: function(){
      return this.visible;
    },
    isVisible: {
      get() {
        return this.$store.getters['personal/getContact'];
      },
      set(value) {
        this.$store.commit('personal/setContact', value)
      }
    }
  },
  */
  methods: {
    resultSelected: function(event){
      var node = {label:event.label,iri:event.subject}
      this.$emit('node-selected',node);
      this.$emit('search-close');
      //TODO: 'event' above does not include iri
      //alert(JSON.stringify(event));
    },
    close: function(event){
      this.$emit('search-close');
    }
  }
  /*
  watch: {
    visible: function (val) {
      this.visible = val;
    }
  }
  */
}
</script>
