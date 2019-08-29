<script>
  module.exports = {
    data(){
      return {
      	categoryprop:{
          categoryCode:null,
          isDirector:false,
          isCheckMyself:false,
        }
      }
    },
    methods: {
      reset(){
        this.categoryprop.categoryCode = "reset";//重置
      },
      //调用子组件的方法获得id值
      changeend(data){
        console.log(data.mainCategoryCode)
      },
      test(){
      	console.log(this.categoryprop);
      },
    } 
  };
</script>

## g-category 品类组件

常用于中台页面选择品类

### 基础用法
显示选择品类组件

<div class="demo-box">
  <div class="demo-block">
    <el-form label-width="150px" size="mini">
      <el-row>
          <el-form-item label="商品品类：">
            <g-category v-model="categoryprop"></g-category>
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
            <el-form-item label="商品品类：">
              <g-category v-model="categoryprop"></g-category>
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
      	categoryprop:{
          categoryCode:"",
          isDirector:true,
        }
      }
    },
    methods: {
      changeend(data) {
        console.log(data.mainCategoryCode)
      },
       reset(){
        this.categoryprop.categoryCode = "reset";//重置
      },
    }
  }
</script>
```
:::


### Attributes
| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| mainCategoryCode| 一级品类ID | String  | — | — |
| isDirector| 是否是主任 | boolean  | — | false|

### Events
| 事件名 | 说明 |
| ---- | ---- |
| changeend | 点击弹层里的确定回调操作,返回已选的品类对应的code;数据：data{mainCategoryCode:""} |

### 其他
重置时需将品类编码设置为reset  =>   this.categoryprop.categoryCode = "reset";