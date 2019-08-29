<script>
  module.exports = {
    data(){
      return {
        initheader:{
          "curstyle":{  //自己定义样式
              color:"yellow"
                    },
            "showclose":"X",  //右面的关闭
            "content":"这个是自己定义的名字" //tit名字
        }
      }
    },
    methods: {
      clickClose(){
        alert('点击返回执行对应操作')
      }
    }
  };
</script>

## g-header 展示

常用于中台页面公共头展示

### 基础用法

头部显示以下内容<br/>
支持自定义tittle<br/>
支持自定义头部样式<br/>
支持插入slot<br/>

<div class="demo-box">
  <div class="demo-block">
    <g-header  @clickClose="clickClose" v-model="initheader">
      <!-- <template slot="child-nav">需要的话自己加内容</template> -->
    </g-header>
  </div>
</div>

:::demo 
```html
<template>
   <g-header  @clickClose="clickClose" v-model="initheader">
    <!-- <template slot="child-nav">需要的话自己加内容</template> -->
    </g-header>
</template>
<script>
  export default {
   data(){
      return {
        initheader:{
          "curstyle":{  //自己定义样式
              color:"yellow"
                    },
            "showclose":"X",  //右面的关闭
            "content":"这个是自己定义的名字" //tit名字
        }
      }
    },
    methods: {
      clickClose(){
        alert('点击返回执行对应操作')
      }
    }
  }
</script>
```
:::

### Attributes
| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| curstyle | 头部样式 | string  | — | — |
| showclose| 头部关闭按钮展示 | string  | — | — |
| content| 头部tittle展示 | string  | — | — |


### Events
| 事件名 | 说明 |
| ---- | ---- |
| clickClose | 返回按钮或者关闭当前页面的回调操作 |
