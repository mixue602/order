<script>
  module.exports = {
    data(){
      return {
      	closeshop:{
          value:"",
          isdata:"",
          options:[{"storeCode":1,storeName:"sss"}]

        }
      }
    },
    methods: {
      changeend(l1,l2){ //选择完之后的回调函数

        console.log("回调storeName："+l1)
        console.log("回调storeCode："+l2)
       
      },
      test(){
      	console.log(this.closeshop.value);
        console.log(this.closeshop.isdata);
      },
      test1(){
      	this.closeshop.value= "";
      }
    }
  };
</script>

## g-closeshop 闭店组件

常用于中台页面选择闭店

### 基础用法
显示选择闭店组件

<div class="demo-box">
  <div class="demo-block">
    <g-closeshop class="demo-gcs" v-model="closeshop" @changeend="changeend" placeholder="请选择"></g-closeshop>
    <button  @click="test">点击我查看value</button>
    <button  @click="test1">重置</button> 请到控制台查看
  </div>
</div>
<style type="text/css">
	.demo-gcs{
		width: 240px;
	}
	button{
		  display: inline-block;
    outline: none;
    cursor: pointer;
    text-align: center;
    text-decoration: none;
    font: 14px/100% Arial, Helvetica, sans-serif;
    padding: 5px 2px 4px;
    text-shadow: 0 1px 1px rgba(0,0,0,.3);
    -webkit-border-radius: 5px; 
    -moz-border-radius: 5px;
    border-radius: 5px;
    -webkit-box-shadow: 0 1px 2px rgba(0,0,0,.2);
    -moz-box-shadow: 0 1px 2px rgba(0,0,0,.2);
    box-shadow: 0 1px 2px rgba(0,0,0,.2);
    color: #d9eef7;
    border: solid 1px #0076a3;
    background: #0095cd;
    background: -webkit-gradient(linear, left top, left bottom, from(#0095cc), to(#00678e));
    background: -moz-linear-gradient(top, #00adee, #00678e);
    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#00adee', endColorstr='#00678e');
	}
	button:hover{
    background: #007ead;
    background: -webkit-gradient(linear, left top, left bottom, from(#00678e), to(#0095cc));
    background: -moz-linear-gradient(top, #00678e, #0095cc);
    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#00678e', endColorstr='#0095cc');
}

</style>

:::demo 
```html
<template>
 <div class="demo-box">
  <div class="demo-block">
    <g-closeshop class="demo-gcs" v-model="closeshop" @changeend="changeend" placeholder="请选择"></g-closeshop>
  </div>
</div>
</template>
<script>
  export default {
  data(){
      return {
      	closeshop:{
          value:"",
          isdata:"",
          options:[{"storeCode":1,storeName:"sss"}]
        }
      }
    },
    methods: {
      changeend(l1,l2){ //选择完之后的回调函数

        console.log("回调storeName："+l1)
        console.log("回调storeCode："+l2)
       
      }
    }
  }
</script>
```
:::


### Attributes
| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| placeholder | 默认提示 | String  | — | — |
| value| 选项的值 | String  | — | — |
| isdata| 显示为1 隐藏为0 | String  | 0/1 | — |
| options| 有则走默认，没有就走接口 | String  | — | — |

### Events
| 事件名 | 说明 |
| ---- | ---- |
| changeend | 点击完下拉回调操作 |