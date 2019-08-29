<script>
  module.exports = {
    data(){
      return {
      	brandcode:{
          value:"",
        }
      }
    },
    methods: {
      reset(){
        this.brandcode.value = "reset";//重置
      },
      //选择完之后的回调函数
      changeend(data){
        console.log(data)
      },
      test(){
      	console.log(this.brandcode);
      },
    } 
  };
</script>

## g-brandcode 品牌编码

常用于中台页面选择品牌编码

### 基础用法
显示选择品牌编码组件

<div class="demo-box">
  <div class="demo-block">
    <el-form label-width="150px" size="mini">
      <el-row>
          <el-form-item label="品牌编码：">
            <g-brandcode v-model="brandcode" @changeend="changeend"></g-brandcode>
          </el-form-item>
      </el-row>
    </<el-form>  
    <button  @click="test" class="button">点击我查看value</button>
    <button  @click="reset" class="button">重置</button> 请到控制台查看
  </div>
</div>
<style type="text/css">
	.demo-gcs{
		width: 240px;
	}
	.button{
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
    <!--品类 start-->
			<el-form label-width="150px" size="mini">
        <el-row>
            <el-form-item label="品牌编码：">
              <g-brandcode v-model="brandcode" @changeend="changeend"></g-brandcode>
            </el-form-item>
        </el-row>
    </<el-form> 
    
  </div>
</div>
</template>
<script>
  export default {
    data(){
      return {
      	brandcode:{
          value:"",
        }
      }
    },
    methods: {
      reset(){
        this.brandcode.value = "reset";//重置
      },
      //选择完之后的回调函数
      changeend(data){
        console.log(data)
      },
      test(){
      	console.log(this.brandcode.value);
      },
    } 
  }
</script>
```
:::


### Attributes
| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| value| 品牌编码 | String  | — | — |

### Events
| 事件名 | 说明 |
| ---- | ---- |
| changeend | 输入框改变,返回已输入的品牌编码;数据：{brandcode:""} |

### 其他
重置时需将品牌编码设置为reset  =>   this.brandcode.value = "reset";