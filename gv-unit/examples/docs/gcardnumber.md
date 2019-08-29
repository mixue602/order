<script>
  module.exports = {
    data(){
      return {
      	cardumber:{
          memberCardNoPamas:"",
          memberCardNo:""
        }
      }
    },
    methods: {
         test(){
            console.log(this.cardumber.memberCardNoPamas);
            console.log(this.cardumber.memberCardNo);
          },
          test1(){
            this.cardumber.memberCardNo= "";
            this.cardumber.memberCardNoPamas="";
          }
    } 
  };
</script>

## g-cardnumber 会员卡号和手机号选择

常用于中台页面选择页面

### 基础用法
显示会员卡号和手机号选择组件

<div>
    <g-cardnumber  v-model="cardumber"></g-cardnumber>
</div>
<button  @click="test">点击我查看value</button>
<button  @click="test1">重置</button> 请到控制台查看
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
  <div>
      <g-cardnumber  v-model="cardumber"></g-cardnumber>
  </div>
</template>
<script>
 export default {
  data(){
    return{
      cardumber:{
        memberCardNoPamas:"",
        memberCardNo:""
      }
    }
  }
 }

</script>

```
:::

### Attributes
| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| cardumber| 选项的值 | Object  | — | — |
| memberCardNoPamas| 实际后续请求所用的参数，error代表查询出错不能继续点查询按钮，有值可以点击查询 | String  | — | — |
| memberCardNo| input显示 | String  | — | — |