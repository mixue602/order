<template>
  <div class="custom-tree-container">

    <div class="block">
      <ul class="report-head">
        <li style="width:220px">展示层级</li>
        <li>销售额</li>
        <li>销售数量</li>
        <li>销售额同比</li>
        <li>销售数量同比</li>
        <li class="last">操作</li>
      </ul>
        <el-tree :data="data5" node-key="id" 
        accordion :indent="10">
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span class="wid treeNode" :class="'treeNode'+node.level">{{ node.label }}、{{node.level}}</span>
              <span class="wid">{{ data.price }}</span>
              <span class="wid">{{ data.number }}</span>
              <span class="wid">{{ data.xiaoshou }}</span>
              <span class="wid">{{ data.baifenbi }}</span>
              <span class="wid last" v-if="data.caozuo ==1">查看详情</span>
              <span v-else  class="wid last"></span>
            </span>
        </el-tree>
    </div>



    <el-tree :data="data4" :load="loadNode1" lazy :indent="10" accordion>
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span class="wid treeNode" :class="'treeNode'+node.level">{{ node.label }}、{{node.level}}</span>
        <span class="wid">{{ data.price }}</span>
        <span class="wid">{{ data.number }}</span>
        <span class="wid">{{ data.xiaoshou }}</span>
        <span class="wid">{{ data.baifenbi }}</span>
        <span class="wid last" v-if="data.caozuo ==1">查看详情</span>
        <span v-else  class="wid last"></span>
      </span>
  </el-tree>

</div>


</template>
<script>

import API from "@/api/order-service/salesReport";
let id = 1000;

  export default {
    data() {
      const data = [
        {
        id: 1,
        price:"111",
        number:'1111',
        xiaoshou:'1111',
        baifenbi:'1111',
        zengzhang:'1111',
        caozuo:'1',
        label: '一级 1',
        children: [{
          id: 4,
          price:"111-1",
          number:'1111-1',
          label: '二级 1-1',
          xiaoshou:'1111',
          baifenbi:'1111',
          zengzhang:'1111',
          children: [{
            id: 9,
            label: '三级 1-1-1',
            price:"111-1-1",
            number:'1111-1-1',
            xiaoshou:'1111',
            baifenbi:'1111',
            zengzhang:'1111',
            children: [{
              id: 11,
              label: '四级 1-1-1-1',
              price:"111-1-1-1",
              number:'1111-1-1-1',
            }, {
              id: 12,
              label: '三级 1-1-2'
          	}]
          }, {
            id: 10,
            label: '三级 1-1-2'
          }]
        }]
      }, {
        id: 2,
        label: '一级 2',
        children: [{
          id: 5,
          label: '二级 2-1'
        }, {
          id: 6,
          label: '二级 2-2'
        }]
      }, {
        id: 3,
        label: '一级 3',
        children: [{
          id: 7,
          label: '二级 3-1'
        }, {
          id: 8,
          label: '二级 3-2'
        }]
      }];
      return {
        data5: JSON.parse(JSON.stringify(data)),
        data4: JSON.parse(JSON.stringify(data))
      }
    },

    methods: {
      append(data) {
        const newChild = { id: id++, label: 'testtest', children: [] };
        if (!data.children) {
          this.$set(data, 'children', []);
        }
        data.children.push(newChild);
      },

      remove(node, data) {
        const parent = node.parent;
        const children = parent.data.children || parent.data;
        const index = children.findIndex(d => d.id === data.id);
        children.splice(index, 1);
      },
      handcallback(data,node,el){
        const newChild = { id: id++, label: 'testtest', children: [] };
        if (!data.children) {
          this.$set(data, 'children', []);
        }
        data.children.push(newChild);
      },
      loadNode1(node, resolve) {
        if (node.level === 0) {
          return resolve([{
            price:"111",
            number:'1111',
            xiaoshou:'1111',
            baifenbi:'1111',
            zengzhang:'1111',
            caozuo:'1',
            label: '一级 1',
          },{
            price:"222",
            number:'2222',
            xiaoshou:'2222',
            baifenbi:'2222',
            zengzhang:'2222',
            caozuo:'1',
            label: '一级 2',
          }]);
        }
        //if (node.level > 1) return resolve([]);
        // if (node.level > 1) {
        //   alert('s')
        // }
        setTimeout(() => {
          var data = [];
          API.getTwoData().then(function(data){
              data = data.data.children;
              
              resolve(data);
          })
        }, 500);
      }
    }
  };
</script>

<style>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
  .report-head{
    overflow: hidden;
    height: 30px;
    border:1px solid #dedede;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .report-head li{
    float: left;
    height: 30px;
    line-height:30px;
    text-align:center;
    width:220px;
    border-right:1px solid #dedede;
  }
  .report-head li.last{
    border-right:none
  }
  .wid{
    width:200px;
    text-align:center;
    height:30px;
    border-right:1px solid #dedede;
    line-height:30px;
  }
  .last{
    text-align:center;
    height:30px;
    border-right:none;
    line-height:30px;
  }
  .el-tree-node__content{
    border:1px solid #dedede;
    height:30px;
    border-top:none;
    box-sizing:border-box;  
    -moz-box-sizing:border-box; /* Firefox */  
    -webkit-box-sizing:border-box; /* Safari */  
  }
  .treeNode{
    text-align:left;
    width:197px;
    box-sizing:border-box;  
    -moz-box-sizing:border-box; /* Firefox */  
    -webkit-box-sizing:border-box; /* Safari */  
  }
  .treeNode2{
    width:187px;
  }
  .treeNode3{
    width:177px;
  }
  .treeNode4{
    width:167px;
  }
</style>

