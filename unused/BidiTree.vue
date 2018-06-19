<template>
  <div id="tree-container" v-loading="loading">
    <div class="ancestors">
      <ul class="ancestor-content">
        <li
          v-for="item in upNodesAsList"
          v-if="isVisible(item,'up')"
          v-bind:style="{ marginLeft: item.level*20 + 'px' }"
          v-bind:id="nodeID(item)"
          :class="nodeInfo(item,'up').style"
          >
          <i class="treenode clickable" v-bind:class="nodeInfo(item,'up').icon" v-on:click.stop="treeIconClicked(item)"></i>
          <span class="clickable" v-bind:class="nodeInfo(item,'up').style" v-on:click.stop="nodeSelected(item)">{{item.label}}</span>
        </li>
      </ul>
    </div>
    <div class="subject">
      <span>{{subjectNode.label}}</span>
    </div>
    <div class="descendants">
      <ul class="descendant-content">
        <li
          v-for="item in downNodesAsList"
          v-if="isVisible(item,'down')"
          v-bind:style="{ marginLeft: item.level*20 + 'px' }"
          v-bind:id="nodeID(item)"
          :class="nodeInfo(item,'down').style"
          >
          <i class="treenode clickable" v-bind:class="nodeInfo(item,'down').icon" v-on:click.stop="treeIconClicked(item)"></i>
          <span class="clickable" v-bind:class="nodeInfo(item,'down').style" v-on:click.stop="nodeSelected(item)">{{item.label}}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: ['property', 'subject'],
  data () {
    return {
      'loading':false,
      'subjectNode':{'level':0,'label':this.subject.label,'isleaf':false,'expanded':true,'data':this.subject.data},
      'upNodesAsList':[],
      'downNodesAsList':[],
      'lastExpanded':null
    }
  },
  watch: {
    property: function (val) {
      this.refresh(this.subjectNode);
    },
    subject: function (val) {
      this.subjectNode = {'level':0,'label':val.label,'isleaf':false,'expanded':true,'data':val.data}
      this.refresh(this.subjectNode);
      //this.nodeSelected(val);
    }
  },
  created: function () {
    //this.subjectNode = {'level':0,'label':this.subject.label,'isleaf':false,'expanded':true,'data':this.subject.data};
    this.refresh(this.subjectNode);
  },
  methods: {
    refresh: function(subjectNode){
      //this.subjectNode = subjectNode;
      this.subjectNode = {'level':0,'label':subjectNode.label,'isleaf':false,'expanded':true,'data':subjectNode.data};
      //{'level':0,'label':this.subject.label,'isleaf':false,'expanded':true,'data':this.subject.data};
      this.upNodesAsList = [];
      this.downNodesAsList = [];
      this.loadNode(this.subjectNode,"up",this.addChildren);
      this.loadNode(this.subjectNode,"down",this.addChildren);
    },
    addChildren: function(node,direction,children) {
      //console.log("node:"+node.label+", dir:"+direction+", children"+children );

      if(direction==="up")
      {
        // find node in list
        var nodeIndex = this.upNodesAsList.indexOf(node);
        for(var childInd=0; childInd<children.length; childInd++){
          var currChild = children[childInd];
          if(nodeIndex===-1){nodeIndex=0;}
          this.upNodesAsList.splice(nodeIndex,0,{'level':node.level+1,'label':currChild.label,'isleaf':currChild.leaf,
            'expanded':false,'data':{'iri':currChild.iri},'loaded':false});
        }
      }
      else
      {
        // find node in list
        var nodeIndex = this.downNodesAsList.indexOf(node);
        for(var childInd=0; childInd<children.length; childInd++){
          var currChild = children[childInd];
          this.downNodesAsList.splice(nodeIndex+1,0,{'level':node.level+1,'label':currChild.label,'isleaf':currChild.leaf,
            'expanded':false,'data':{'iri':currChild.iri},'loaded':false});
        }
      }
      node.loaded=true;
    },
    loadNode: function(node, direction, resolve) {

      var queries = this.$store.getters.getQueries;
      var inverse = (direction==="up") ? true : false

      // swap this if inv is set in property
      if(this.property.inv){
        inverse = !inverse;
      }

      var subordinateQuery = queries.directional_relation_query(node.data.iri,this.property.iri,inverse);

      function success(results) {
        // form results here

        var resObj = results;//JSON.parse(results);
        var bindings = resObj.results.bindings;
        var children = [];
        for (var count = 0; count < bindings.length; count++) {
          var binding = bindings[count];
          var child = {'iri': binding.related.value, 'label': binding.label.value, 'leaf': (binding.terminal.value === 'true')};
          children.push(child);
        }
        resolve (node,direction,children);
      }

      this.query(subordinateQuery,success,this.displayErrors);

      /*
      for(var upInd=0; upInd<upChildren.length; upIndex++){
        var upChild = upChildren[upInd];
        upNodesAsList.push({'level':1,'label':upChild.label,'expanded':false,'isleaf':upChild.leaf,'data':{iri:upChild.iri}});
      }
      */
    },
    query: function (queryString,successCallback,errorCallback) {
      //var queryString = 'SELECT * WHERE {?a ?b ?c} limit 10';
      var promise = this.$store.dispatch('query',{query:queryString});
      promise.then((results) => {
        // successMessage is whatever we passed in the resolve(...) function above.
        // It doesn't have to be a string, but if it is only a succeed message, it probably will be.

        //console.log(results)
        successCallback(results);
      }).catch((errors) => {
        //console.log(errors);
        errorCallback(errors.statusText);
      });
    },
    //getChildren: function() YOU ARE HERE!
    displayResults: function(results){
      alert("results: "+results);
    },
    displayErrors: function(errors){
      alert("errors: "+errors);
    },

    nodeID: function(node){
      var id = ((node.level===0) ? 'subject' : 'node');
      return id;
    },
    nodeInfo: function(node,dir) {
      // compute css class for node li
      var nodeInfo;
      if(node.isleaf){
        var nodestyle = "leaf";
        var nodeicon = "el-icon-remove-outline hidden"
        nodeInfo = {"style":nodestyle,"icon":nodeicon};
      }
      else if(!node.expanded) {
        var nodestyle = "unexpanded";
        var nodeicon = "el-icon-arrow-right";
        var iconevent = "expand";
        nodeInfo = {"style":nodestyle,"icon":nodeicon,"event":iconevent};
      }
      else if(dir==="up"){
        var nodestyle = "upexpanded";
        var nodeicon = "el-icon-arrow-up";
        nodeInfo = {"style":nodestyle,"icon":nodeicon};
      }
      else if(dir==="down"){
        var nodestyle = "downexpanded";
        var nodeicon = "el-icon-arrow-down";
        var iconevent = "test()";
        nodeInfo = {"style":nodestyle,"icon":nodeicon,"event":iconevent};
      }
      else {
        // this should only happen for subject node
        var nodestyle = "subject"
        nodeInfo = {"style":nodestyle};
      }
      return nodeInfo
    },
    test: function() {
      alert(this.property)
    },
    nodeSelected: function(item){
      this.$emit('node-selected',{iri:item.data.iri,label:item.label});
      //this.refresh(item);
    },
    treeIconClicked: function(node){
      this.lastExpanded = node;

      /*
      // if it is expanded and is not the subject, then collapse
      if(node.expanded && node.level!==0){
        this.collapse(node);
      }
      */
      if(node.expanded){
        this.collapse(node);
      }
      // if node is not expanded, and is not a leaf, expand it
      else if(!node.expanded && !node.isleaf) {
        if(!node.loaded)
        {
          var isUp = (this.upNodesAsList.indexOf(node)===-1) ? false : true;
          var dir = isUp ? 'up' : 'down';
          this.loadNode(node,dir,this.addChildren);
        }
        this.expand(node);
      }
    },
    expand: function(node){
      node.expanded=true;
    },
    collapse: function(node){
      node.expanded=false;
    },
    getParent: function(node,dir){
      // get proper list
      var nodesAsList = (dir==="up") ? this.upNodesAsList : this.downNodesAsList;

      // get index of current node in list
      var nodeIndex = nodesAsList.indexOf(node);

      // get the level of the current node
      var nodeLevel = node.level;

      // get the direction of the current node
      var nodeDir = dir;

      if(nodeDir==='up'){
        for(var currIndex=nodeIndex+1; currIndex<nodesAsList.length; currIndex++){
          var currNode = nodesAsList[currIndex];
          if(currNode.level<nodeLevel){
            return currNode;
          }
        }
        // if we didn't find an "up-tree" node with a lesser level, then
        // this node is a direct child of the subject node
        return this.subjectNode;
      }
      else if(nodeDir==='down'){
        for(var currIndex=nodeIndex-1; currIndex>=0; currIndex--){
          var currNode = nodesAsList[currIndex];
          if(currNode.level<nodeLevel){
            return currNode;
          }
        }
        // if we didn't find an "up-tree" node with a lesser level, then
        // this node is a direct child of the subject node
        return this.subjectNode;
      }

      alert("should not have made it here: "+node.label);
    },
    isVisible: function(node,dir){
      // only one node should be without a direction,
      // that is the subject and it should be visible
      if (typeof dir === 'undefined') {
        return true;
      }

      var parentNode = this.getParent(node,dir);
      if(parentNode.expanded){
        return true;
      }
      else {
        return false;
      }
    }
  }
}
</script>


<style>

ul {
  list-style: none;
  margin-left: 0;
  padding-left: 0;
}
.subject {
  width:calc(100% - 10px);
  height:50px;
  line-height: 50px;
  font-weight: bolder;
  white-space: nowrap;
  overflow-x: auto;
  overflow-y: hidden;
}
.ancestors, .descendants {
  overflow:auto;
  height:calc(50% - 25px);
  width:calc(100% - 10px);
  margin:0;
  padding:0;

  background-color:Gray;
  color:white;

  display: flex;
  border-radius:8px;
}
.ancestors {
  flex-direction: column-reverse;
  /*
  border-top-left-radius:5px;
  border-top-right-radius:10px;
  */
}
.descendants {
  /*
  border-bottom-left-radius:5px;
  border-bottom-right-radius:10px;
  */
}
.ancestor-container, .descendant-container {

}
.ancestor-content {
  margin-bottom:8px;
}
.descendant-content {
  margin-top:8px;
}
.ancestor-content li, .descendant-content li {
  white-space: nowrap;
}
#tree-container {
  /*position:relative;*/
  height:calc(100% - 10px);
  width:100%;
  margin:0px;
  padding:5px;
}
.clickable { cursor: pointer; }
.treenode {
  padding-right: 2px;
}
.hidden {
  visibility: hidden;
}
</style>
