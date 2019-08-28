<template>
  <div class="NewBuildBox">
    <p class="build-head">会员开卡</p>
    <el-form :model="ruleList1" :inline="true" label-width="120px" ref="ruleList1" :rules="rules2">
      <div class="build-list">
        <el-form-item label="手机号：" prop="phone" class="is-required">
          <el-input size="mini" v-model="ruleList1.phone" placeholder="请输入手机号码" ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" plain size="mini" v-if="LOGINDATA.membermanage_memberNewlyBuild_sendout" @click="sendCode($event,'ruleList1')">发送验证码</el-button>
        </el-form-item>
      </div>
      <div class="build-list">
        <el-form-item prop="identifyingCode" label="验证码：" class="is-required">
          <el-input size="mini" maxlength=6 v-model="ruleList1.identifyingCode" placeholder="请输入验证码" ></el-input>
        </el-form-item>
      </div>
      <div class="build-list">
        <el-form-item label="姓名：" prop="name" class="is-required">
          <el-input size="mini" v-model="ruleList1.name" placeholder="请输入会员姓名" ></el-input>
        </el-form-item>
      </div>
      <div class="build-list">
        <el-form-item label="性别：">
          <el-radio v-model="ruleList1.sex" label="2">男</el-radio>
            <el-radio v-model="ruleList1.sex" label="1">女</el-radio>
        </el-form-item>
      </div>
      <div class="build-list">
        <el-form-item label="出生日期：">
          <el-date-picker
            style="width:178px;"
            size="mini"
            v-model="ruleList1.birthday"
            type="date"
            placeholder="选择日期"
            :picker-options="pickerOptions1">
          </el-date-picker>
          <!-- <el-input size="mini" v-model="ruleList1.dateBirth" placeholder="" ></el-input> -->
        </el-form-item>
      </div>
    </el-form>
    <el-row type="flex" class="build-listend">
      <el-col :span="4" style="margin-left:130px;">
        <el-button size="medium" @click="closeWindow">取消</el-button>
        <el-button type="primary" v-if="LOGINDATA.membermanage_memberNewlyBuild_determine" @click="newBuild('ruleList1')" size="medium">确认</el-button>
      </el-col>
      <!-- <el-col :span="3"><el-button type="primary" @click="newBuild('ruleList1')" size="medium">确认</el-button></el-col> -->
    </el-row>
    <dialogErr
      v-if="newBuildDialog"
      :phoneStatus = phoneSending.phoneStatus 
      :markedWords = phoneSending.markedWords 
      :phone = ruleList1.phone 
      :newlyUserId = newlyUserId 
      :LOGINDATAErr = LOGINDATAErr 
      v-on:isErrLog = isErrDialog
    ></dialogErr>
    <!-- <el-dialog title="提示" width="500px" :visible.sync="newBuildDialog">
      <p class="logText">{{phoneSending.markedWords}}</p>
      <span slot="footer" class="dialog-footer">
        <el-button v-if="phoneSending.phoneStatus == 3 || phoneSending.phoneStatus == 2 || phoneSending.phoneStatus == 4 || phoneSending.phoneStatus == 5" class="buildBtn" @click="newBuildDialog = false">取 消</el-button>
        <a v-if="phoneSending.phoneStatus == 2 && LOGINDATA.membermanage_memberNewlyBuild_see" :href="['//mpf'+Env.cookieDomain+'/member/memberQuery?phone='+ruleList1.phone]" target="_blank"><el-button class="buildBtn" type="primary">查看会员</el-button></a>
        <a v-else-if="phoneSending.phoneStatus == 4 && LOGINDATA.membermanage_memberNewlyBuild_sees" :href="['//mpf'+Env.cookieDomain+'/member/memberDetails?userId='+newlyUserId]" target="_blank"><el-button class="buildBtn" type="primary">查看线上会员</el-button></a>
        <a v-else-if="phoneSending.phoneStatus == 5 && LOGINDATA.membermanage_memberNewlyBuild_tosetup" :href="['//omscsc'+Env.cookieDomain+'/csc/user/search.action']" target="_blank"><el-button class="buildBtn" type="primary">去操作</el-button></a>
        <a v-else-if="phoneSending.phoneStatus == 3 && LOGINDATA.membermanage_memberNewlyBuild_tosetup" :href="['//omscsc'+Env.cookieDomain+'/csc/user/detail.action?userId='+newlyUserId]" target="_blank"><el-button class="buildBtn" type="primary">去操作</el-button></a>
        <el-button v-else class="buildBtn" @click="newBuildDialog = false" type="primary">确定</el-button>
      </span>
    </el-dialog> -->
  </div>
</template>
<script>
import {mapState,mapActions} from  'vuex';
import API from '@/api/api_card/memberNewlyBuild';
import util from '@/common/util';
import Env from '@/api/env';
import dialogErr from '../member_common/dialogError';
export default {
  data(){
    var newlyBuildPhone = (rule, value, callback) => {
      if(value == ""){
        callback(new Error('手机号不能为空'));
      }else if(!/^1[3456789]\d{9}$/.test(value)){
        callback(new Error('请输入正确的手机号'));
      }else{
        callback();
      }
    }
    var newlyBuildCode = (rule, value, callback) => {
      if(value == ""){
        callback(new Error("验证码不能为空"));
      }else if(/\D/.test(value)){
        callback(new Error("验证码不能输入非数字"));
      }else{
        callback();
      }
    }
    var newlyBuildName = (rule, value, callback) => {
      var len = 0;
      value?value=value:value="";
      for(var i=0; i<value.length; i++){
        var a = value .charAt(i);
        if(a.match(/[^\x00-\xff]/ig) != null){
          len += 2;
        }else{
          len += 1;
        }
      }
      if(len == 0){
        callback(new Error("请输入会员姓名"));
      }else if(len > 60 || len < 4){
        callback(new Error("姓名长度在4-60个字符"));
      }else if(!/^[0-9a-zA-Z\u4e00-\u9fa5\.()\·\_]+$/.test(value)){
        callback(new Error("不能输入特殊字符"));
      }else{
        callback();
      }
    }
    return{
      Env,
      pickerOptions1: {         //日历控制禁止选择未来日期
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      newlyUserId: '',
      countDown : 60,            //发送验证码倒计时
      newBuildDialog: false,    //提示弹框
      phoneSending:{},          //提示弹框数据
      LOGINDATAErr:{},          //错误提示权限码
      ruleList1:{               //新建会员卡信息
        phone: "",
        identifyingCode: "",
        name: "",
        sex: "2",
        birthday: ""
      },
      rules2: {
        phone: [
          {validator: newlyBuildPhone, trigger: 'blur'}
        ],
        identifyingCode: [
          {validator: newlyBuildCode, trigger: 'blur'}
        ],
        name: [
          {validator: newlyBuildName, trigger: 'blur'}
        ]
      }
    }
  },
  computed:mapState({
    LOGINDATA:'LOGINDATA'
  }),
  created() {
    let query= this.$router.history.current.query;
    if(query.phone && /^1[3456789]\d{9}$/.test(query.phone)){
      this.ruleList1.phone = query.phone;
    }
  },
  methods:{
    isErrDialog(data){
      this.newBuildDialog = data;
    },
    sendCode(ev,ruleList1){
      var _this = this;
      this.$refs[ruleList1].validateField('phone',function(err){
        if(err == ""){
          if(_this.countDown === 60){
            API.phoneSendingAndCheck({'ph':_this.ruleList1.phone}).then(res => {
              if(res.success){
                if(res.data.abnormalUserId){
                  _this.newlyUserId = res.data.abnormalUserId;
                }
                if(res.data.phoneStatus == '1'){
                  var times = setInterval(function(){
                    if(_this.countDown>1){
                      _this.countDown --;
                      ev.target.innerText = _this.countDown+'秒后重新获取';
                    }else{
                      clearInterval(times);
                      ev.target.innerText = '重新获取';
                      _this.countDown = 60;
                    }
                  },1000)
                }else{
                  _this.phoneSending = res.data;
                  _this.newBuildDialog = true;
                  _this.LOGINDATAErr.see = _this.LOGINDATA.membermanage_memberNewlyBuild_see;
                  _this.LOGINDATAErr.upgradeSee = _this.LOGINDATA.membermanage_memberNewlyBuild_sees;
                  _this.LOGINDATAErr.tosetup = _this.LOGINDATA.membermanage_memberNewlyBuild_tosetup;
                }
                
              }else{
                _this.alertFn(res.errMsg);
              }
            })
          }
        }
      })
    },
    closeWindow(){
      window.location.href="about:blank";
      window.close();
    },
    newBuild(ruleList1){
      this.$refs[ruleList1].validate((valid) =>{
        if(valid){
          if(this.ruleList1.birthday != ""){
            this.ruleList1.birthday = util.formatDate.format(this.ruleList1.birthday);
          }
          API.openCard(this.ruleList1).then(res => {
            if(res.success && res.data){
              this.$alert('会员卡新建成功', {
                confirmButtonText: '确定',
                callback: action => {
                  window.location.reload();
                }
              });
            }else{
              this.alertFn(res.errMsg);
            }
          })
        }
      })
    },
    alertFn(Hint, callbacks){
      this.$alert(Hint, {
        confirmButtonText: '确定',
        callback: callbacks
      });
    }
  },
  components:{
    dialogErr:dialogErr
  }
}
</script>
<style>
  .NewBuildBox{
    border:1px solid #DCDFE6;
  }
  .build-head{
    height: 36px;
    line-height: 36px;
    background: #409EFF;
    color: #fff;
    text-indent: 12px;
    font-size: 14px;
  }
  .build-list{
    height: 60px;
    /* border-bottom: 1px solid #DCDFE6; */
    /* line-height: 59px; */
    padding-left: 12px;
    padding-top: 15px;
  }
  .formItem{
    margin-left:68px;
  }
  .build-listend{
    height: 110px;
    line-height: 110px;
  }
  .logText{
    font-size: 14px;
  }
  .buildBtn{
    width: 120px;
  }
  .dataList{
    width:178px;
  }
</style>

