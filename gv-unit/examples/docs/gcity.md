<script>
  module.exports = {
    data(){
      return {
        codeobj:{
          "curstyle":{  //自己定义样式
                    },
           "aeracode1":{
              "label":"北京",
              "code":11000000,
              "disable":false
           },
           "aeracode2":{
              "label":"北京市",
              "code":11010000,
              "disable":false
           },
           "aeracode3":{
              "label":"朝阳区",
              "code":11010200,
              "disable":false
           },
           "aeracode4":{
              "label":"朝外街道",
              "code":11010202,
              "disable":false,
              "firstaera":false,  // false 不需要验证可不可改 true需要验证
              "commerceItemId":"", // 如果需要验证 则需要参数
              "shippingGroupId":""// 如果需要验证 则需要参数
           }
        }
      }
    },
    methods: {
      changeend(changeend){
        console.log(changeend)
      }
    }
  };
</script>

## g-city 城市组件

常用于中台页面调用城市

### 基础用法
显示一二三四级区域组件

<div class="demo-box">
  <div class="demo-block">
    <g-city @changeend="changeend" v-model="codeobj"></g-city>
  </div>
</div>

:::demo 
```html
<template>
  <g-city @changeend="changeend" v-model="codeobj"></g-city>
</template>
<script>
  export default {
  data(){
      return {
        codeobj:{
          "curstyle":{  //自己定义样式
                    },
           "aeracode1":{
              "label":"北京",
              "code":11000000,
              "disable":false
           },
           "aeracode2":{
              "label":"北京市",
              "code":11010000,
              "disable":false
           },
           "aeracode3":{
              "label":"朝阳区",
              "code":11010200,
              "disable":false
           },
           "aeracode4":{
              "label":"朝外街道",
              "code":11010202,
              "disable":false,
              "firstaera":false,  // false 不需要验证可不可改 true需要验证
              "commerceItemId":"", // 如果需要验证 则需要参数
              "shippingGroupId":""// 如果需要验证 则需要参数
           }
        }
      }
    },
    methods: {
      changeend(changeend){
        console.log(changeend)
      }
    }
  }
</script>
```
:::

### Attributes
| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| curstyle | 头部样式 | object  | — | — |
| aeracode1| 一级区域 | object  | — | — |
| aeracode2| 二级区域 | object  | — | — |
| aeracode3| 三级区域 | object  | — | — |
| aeracode4| 四级区域 | object  | — | — |


### Events
| 事件名 | 说明 |
| ---- | ---- |
| changeend | 返回按钮或者关闭当前页面的回调操作 |
