<template>
  <div class="container">
    <g-header  @clickClose="clickClose" v-model="initheader">
    </g-header>
    <el-steps class="tit" :active="active" finish-status="success" align-center>
      <el-step title="输入员工应用系统号"></el-step>
      <el-step title="确认员工信息"></el-step>
      <el-step title="确认解绑"></el-step>
    </el-steps>
    <div class="cont" v-if="active === 0" >
     <el-input v-model="userId" placeholder="请输入员工应用系统号" class="user"></el-input>
     <el-button class="button-box" @click="next">下一步</el-button>
   </div>
   <div class="cont" v-else-if="active === 1" >
    <div class="table-box">
      <el-row>
        <el-col :span="5"><div class="table-tit">员工姓名</div></el-col>
        <el-col :span="19"><div class="table-cont">{{info.name}}</div></el-col>
      </el-row>
      <el-row>
        <el-col :span="5"><div class="table-tit">员工编号</div></el-col>
        <el-col :span="19"><div class="table-cont">{{info.id}}</div></el-col>
      </el-row>
      <el-row>
        <el-col :span="5"><div class="table-tit">岗位名称</div></el-col>
        <el-col :span="19"><div class="table-cont">{{info.post}}</div></el-col>
      </el-row>
      <el-row>
        <el-col :span="5"><div class="table-tit">手机号码</div></el-col>
        <el-col :span="19"><div class="table-cont">{{info.tel}}</div></el-col>
      </el-row>
      <el-row>
        <el-col :span="5"><div class="table-tit">手机号码</div></el-col>
        <el-col :span="19"><div class="table-cont">{{info.tel}}</div></el-col>
      </el-row>

    </div>
    <div class="table-desc">是否确定将该员工账号与现有设备解绑？</div>
    <el-button  class="button-box step2" @click="next">确认</el-button>
  </div>
  <div class="cont" v-else >
   <div class="desc">账号<font>{{info.gomeId}}</font>与设备解绑成功</div>
    <div class="desc">下次登录成功将完成绑定</div>
    <el-button  class="button-box" @click="next">确定</el-button>
  </div>
</div>
</template>
<style>
  *{
    font-family: "Mircosoft YaHei";
  }
  .container{
    width: 80%;
    margin: 0 auto;
  }
  .tit{
    margin-top: 40px;
  }

  .el-step__icon{
    width: 50px;
    height: 50px;
    border-radius: 25px;
  }
  .el-step.is-horizontal .el-step__line{
    top: 24px;
  }
  .el-step__icon-inner{
    font-size: 24px;
    font-weight: 500;
  }
  .el-step__head.is-finish .el-step__icon-inner {
    color: #fff;
  }
  .is-finish .el-step__line{
    background: #409EFF;
  }
  .el-step__head.is-finish .el-step__icon{
    background: #409EFF;
  }
  .el-step__head.is-process{
    color: #409EFF;
    border-color: #409EFF;
    font-weight: 500;
  }
  .el-step__title.is-process{
   color: #409EFF;
 }
 .cont{
  width: 400px;
  margin: 40px auto 0 auto;
}
.user{
  width: 300px;
  margin: 0 auto;
}
.button-box{
  width: 300px;
  margin-top: 20px;
  background: #eee;
}
.el-row{
  border:1px solid #eee;
  margin-top: -1px;
  text-align: center;
  font-size: 14px;
  line-height: 50px;
}
.table-desc{
  line-height: 50px;
  font-size: 16px;
  color: #409EFF;
}
.table-cont{
  border-left: 1px solid #eee;
}
.button-box.step2{
  margin-left: 50px;
  margin-top: 0;
}
.desc{
   line-height: 50px;
  font-size: 16px;
}
.desc>font{
  color: #409EFF;
}
</style>
<script>
  import {mapState,mapActions} from  'vuex';
  export default{
    data(){
      return{
        active:0,
        userId:'',//员工系统号
        initheader:{ 
          "curstyle":{
            "margin-bottom":"30px"
          },
          "content":"设备解绑"
        },
        info:{
          'gomeId':'gh177',
          'name':'小仙女',
          'id':'11111111',
          'post':'国美全国大区苏州国际大厦分店门店主管',
          'tel':'183****1202',
        }
      }
    },
    computed:mapState({
      LOGINDATA:"LOGINDATA"
    }),
    methods:{
     next() {
      if (this.active++ > 2) this.active = 0;
    }

  }
}

</script>