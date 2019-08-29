<script>
  module.exports = {
    data(){
      return {
      	storeCodes:{
          storeCodes:"",
         // isDirector:true,
        }
      }
    },
    methods: {
      reset(){
        this.storeCodes.storeCodes = "reset";//重置
      },
      //调用子组件的方法获得id值
      changeend(data){
        console.log(data.storeCodes)
      },
      test(){
      	console.log(this.storeCodes);
        
      },
    } 
  };
</script>

## g-branch 销售部门

常用于中台页面选择销售部门

### 基础用法
显示选择销售部门组件

<div class="demo-box">
  <div class="demo-block">
    <el-form label-width="150px" size="mini">
      <el-row>
          <el-form-item label="销售部门：" v-show="storeCodes.isdata == 1">
            <g-branch v-model="storeCodes"></g-branch>
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
            <el-form-item label="销售部门："  v-show="storeCodes.isdata == 1">
              <g-branch v-model="storeCodes"></g-branch>
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
      	storeCodes:{
          storeCodes:"",
         // isDirector:true,
        }
      }
    },
    methods: {
      changeend(data) {
        console.log(data.storeCodes)
      },
       reset(){
        this.storeCodes.storeCodes = "reset";//重置时将设置为reset
      },
    }
  }
</script>
```
:::


### Attributes
| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| storeCodes| 门店ID | String  | — | — |
| isdata| 是否展示插件 | String  | 1展示，0不展示 (0也标示是门店登录，没权限)| 1 |
| isall| 是否是全选 | double  | true全选,false不全选 | true|
| istotal| 是否是总部账户 | double  | true,false | true|


### Events
| 事件名 | 说明 |
| ---- | ---- |
| changeend | 点击弹层里的确定回调操作,返回已选的品类对应的code;数据：data{mainCategoryCode:""} |

### 其他
重置时需将品类编码设置为reset  =>   this.storeCodes.storeCodes = "reset";
需要区分当前登录账户的类型（总部，大区或者分部还是门店）；门店不展示这个筛选项，总部，大区或者分部要展示，而且还要区分是不是总部的，总部全选要给个标示，不能全部传给后端 ； positionLevel：0是总部，1是大区，2是一级分部，3是二级分部，4门店，5仓库，6售后