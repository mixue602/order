<template>
  <div class="NewBuildBox">
    <el-row class="queryInfoHead">
      <div class="queryInfo">会员信息</div>
      <div class="detailsHead">
         <el-button size="mini" v-if="LOGINDATA.membermanage_memberDetails_frozen && detailsList.cardStyle=='Y' && detailsList.status == 0 && detailsList.cardNum" @click="freezeCard('D')">冻结</el-button>
         <el-button size="mini" v-if="LOGINDATA.membermanage_memberDetails_thaw && (detailsList.status == 1 || detailsList.status == 2)" @click="freezeCard('D')">解冻</el-button>
         <el-button size="mini" v-if="LOGINDATA.membermanage_memberDetails_sfrozen && detailsList.cardStyle=='Y' && detailsList.status == 0 && detailsList.cardNum" @click="freezeCard('S')">申请冻结</el-button>
         <el-button size="mini" v-if="LOGINDATA.membermanage_memberDetails_sthaw && (detailsList.status == 1 || detailsList.status == 2)" @click="freezeCard('S')">申请解冻</el-button>
        <el-button size="mini" v-if="LOGINDATA.membermanage_memberDetails_preservation && detailsList.cardNum && detailsList.status == 0" @click="editInfo('rulesList2')">保存</el-button>
      </div>
    </el-row>
    <el-form :inline="true" label-width="100px">
      <div class="build-list cardInfo">
        <el-form-item style="font-size:12px;" label="卡号：">
          <span class="stateNum">{{detailsList.cardNum?detailsList.cardNum:'---'}}</span>
          <el-tag type="success" v-if='detailsList.cardTypeDesc' size="small" class="stateTag">{{detailsList.cardTypeDesc}}</el-tag>
          <el-tag v-if="detailsList.status == 0" type="success" size="small" class="stateTag">正常</el-tag>
          <el-tag v-else type="danger" size="small" class="stateTag">冻结</el-tag>
        </el-form-item>
        <el-form-item label="开卡时间：">
          <span class="stateNum">{{detailsList.createDate?detailsList.createDate:'---'}}</span>
        </el-form-item>
        <el-form-item label="开卡员工：">
          <span class="stateNum">{{detailsList.employeeName?detailsList.employeeName:'---'}}</span>
        </el-form-item>
      </div>
      <!-- <div class="build-list">
        <el-form-item label="开卡时间：">
          <span class="stateNum">{{detailsList.createDate?detailsList.createDate:'---'}}</span>
        </el-form-item>
      </div>
      <div class="build-list">
        <el-form-item label="开卡员工：">
          <span class="stateNum">{{detailsList.employeeName?detailsList.employeeName:'---'}}</span>
        </el-form-item>
      </div> -->
    </el-form>
    <el-form :model="rulesList2" ref="rulesList2" :rules="rulesEvt2" :inline="true" label-width="100px">
      <div class="build-list">
        <el-form-item label="姓名：" prop="name">
          <el-input v-if="detailsList.cardNum" size="mini" v-model="rulesList2.name" placeholder="请输入会员姓名"></el-input>
          <span v-else>---</span>
          
        </el-form-item>
        <el-form-item>
          <span>会员姓名可支持3次修改，超过3次上报OA由分部门管进行修改</span>
          <el-button type="primary" size="mini" plain v-if="LOGINDATA.membermanage_memberDetails_nameChange"  @click="toJump({path:'/member/mNameModifyRecord',query:{phone: detailsList.phone}})">姓名修改次数查询</el-button>
        </el-form-item>
      </div>
      <div class="build-list">
        <el-form-item label="性别：">
          <el-radio v-model="detailsList.sex" label="2">男</el-radio>
          <el-radio v-model="detailsList.sex" label="1">女</el-radio>
        </el-form-item>
      </div>
      <div class="build-list">
        <el-form-item label="出生日期：">
          <el-date-picker
            size="mini"
            style="width:178px;"
            v-if="dateBirth==null"
            v-model="detailsList.birthday"
            type="date"
            placeholder="选择日期"
            :picker-options="pickerOptions1">
          </el-date-picker>
          <span v-else class="stateNum">{{detailsList.birthday}}</span>
        </el-form-item>
      </div>
    </el-form>
    <el-form :model="rulesList" ref="rulesList" :rules="rulesEvt" :inline="true" class="build-list" label-width="100px">
      <div v-show="newPhone">
        <el-form-item label="手机号：">
          <span class="datailText">{{detailsList.phone}}</span>
        </el-form-item>
        <el-form-item v-show="!changeCode">
          <el-button type="primary" plain size="mini" v-if="detailsList.status == 0" @click="changePhone">变更</el-button>
        </el-form-item>
        <el-form-item v-if="changeCode" prop="verification1">
          <el-input size="mini" placeholder="请输入验证码" v-model="rulesList.verification1" maxLength="6"></el-input>
        </el-form-item>
        <el-form-item class="formItem" v-if="changeCode">
          <el-button type="primary" plain size="mini" v-if="LOGINDATA.membermanage_memberDetails_changeUsedHair" @click="detailSendCode($event)">发送验证码</el-button>
          <el-button type="primary" plain size="mini" v-if="LOGINDATA.membermanage_memberDetails_changeUsed" @click="confirmChange('rulesList')">确定</el-button>
        </el-form-item>
      </div>
      <div v-show="!newPhone">
        <el-form-item prop="phone">
          <el-input size="mini" placeholder="请输入新手机号码" v-model="rulesList.phone"></el-input>
        </el-form-item>
        <el-form-item prop="verification2">
          <el-input size="mini" placeholder="请输入验证码" v-model="rulesList.verification2" maxLength="6"></el-input>
        </el-form-item>
        <el-form-item class="formItem">
          <el-button type="primary" plain size="mini" v-if="LOGINDATA.membermanage_memberDetails_changeNewHair" @click="detailSendCode2($event, 'rulesList')">发送验证码</el-button>
          <el-button type="primary" plain size="mini" v-if="LOGINDATA.membermanage_memberDetails_changeNew" @click="confirmTheChange('rulesList')" >确定变更</el-button>
        </el-form-item>
      </div>
    </el-form>
    <div class="NewBuilList">
      <p class="NewBuilmd datailText" v-if="LOGINDATA.membermanage_memberDetails_mnum">美豆：<router-link :to="{name:'member_BeanRecord',params:{memberId:detailsList.userId}}">{{detailsList.gomedoQuantity}}</router-link></p>
      <!-- <p class="NewBuilInfo datailText" v-if="LOGINDATA.membermanage_memberDetails_ordernum">订单数：<a href="javascript:void(0);">{{detailsList.orderQuantity}}</a></p> -->
    </div>
    <div class="NewBuilList">
      <p class="NewBuilyhq datailText" v-if="LOGINDATA.membermanage_memberDetails_qnum && detailsList.cardStyle == 'Y'">优惠券：<router-link :to="{name:'member_VoucherRecord',params:{memberId:detailsList.userId}}">{{detailsList.couponQuantity}}</router-link></p>
    </div>
    <div class="NewBuilList">
      <p class="datailText NewBuilAddress">默认收货地址：{{defaultAddress}}</p>
      <a class="addressBtn" href="javascript:void(0);" v-if="LOGINDATA.membermanage_memberDetails_address" @click="toJump({name:'member_Address',params:{userId:detailsList.userId}})" >地址管理</a>
    </div>
    <Dialog 
      v-if="isDialog"
      :dialogType='isDialog'
      :flowQueryginseng ='flowQueryginseng'
      v-on:refreshList="refreshLists"
      v-on:Istype="IsDialogType">
    </Dialog>
  </div>
</template>
<script>
import {mapState,mapActions} from  'vuex';
import API from '@/api/api_card/memberDetails';
import DiaLog from '../member_common/dialog';
import util from '@/common/util';
export default {
  data(){
    var detailsPhone = (rule, value, callback) => {
      if(value == ""){
        callback(new Error('手机号不能为空'));
      }else if(!/^1[3456789]\d{9}$/.test(value)){
        callback(new Error('请输入正确的手机号'));
      }else{
        callback();
      }
    }
    var detailsCode = (rule, value, callback) => {
      if(value == ""){
        callback(new Error("验证码不能为空"));
      }else if(/\D/.test(value)){
        callback(new Error("验证码不能输入非数字"));
      }else{
        callback();
      }
    }
    var detailsName = (rule, value, callback) => {
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
      pickerOptions1: {         //日历控制禁止选择未来日期
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      timers: '',
      dateBirth: '',
      flowQueryList: {},          //申请冻结信息
      frozenBtnFn: "init",        //确定函数
      isDialog: false,     //冻结弹框显示数据    
      detailsList: {},            //详情信息
      defaultAddress:'',          //默认地址
      flowQueryginseng:{},      //冻结参数
      changeCode: false,          //变更手机判断操作
      detailsCountDown: 60,        //发送验证倒计时
      newPhone: true,             //判断新旧手机
      rulesList: {                //变更手机数据
        phone: "",
        verification1: "",
        verification2: ""
      },
       rulesList2: {                //变更手机数据
        name: ''
      },
      rulesEvt:{
        phone:[
          {validator: detailsPhone, trigger: 'blur'}
        ],
        verification1:[
          {validator: detailsCode, trigger: 'blur'}
        ],
        verification2:[
          {validator: detailsCode, trigger: 'blur'}
        ]
      },
      rulesEvt2:{
        name:[
          {validator: detailsName, trigger: 'blur'}
        ]
      }
    }
  },
  created(){
    this.cardQueryInit();
  },
  computed:mapState({
    LOGINDATA:'LOGINDATA'
  }),
  methods:{
    toJump(to){
      this.$router.push(to?to:'/member/memberQuery')
    },
    refreshLists(isRefresh){
      if(isRefresh){
        this.cardQueryInit();
      }
    },
    // 详情资料
    cardQueryInit(){
      var obj = {},
          query = this.$router.history.current.query;
      if(query.cid){
        obj = {'cid':query.cid};
        API.cardQueryCardDetail(obj).then(res => {
          if(res.success && res.data){
            this.detailsList = res.data.memberCard;
            this.defaultAddress = res.data.defaultAddress;
            this.dateBirth = res.data.memberCard.birthday;
            this.rulesList2.name = res.data.memberCard.name;
          }else{
            this.alertFn(res.errMsg);
          }
        })
      }else{
        obj = {'uid':query.userId};
        API.cardQueryUserDetail(obj).then(res => {
          if(res.success && res.data){
            this.detailsList = res.data.memberCard;
            this.defaultAddress = res.data.defaultAddress;
            this.dateBirth = res.data.memberCard.birthday;
            this.rulesList2.name = res.data.memberCard.name;
          }else{
            this.alertFn(res.errMsg);
          }
        })
      }
    },
    // 修改信息资料
    editInfo(rulesList2){
      var obj = {
        cid: this.detailsList.cardNum,
        uid: this.detailsList.userId,
        name: this.rulesList2.name,
        sex: this.detailsList.sex
      }
      if(this.dateBirth==null && this.detailsList.birthday!=null){
        obj.birthday = util.formatDate.format(this.detailsList.birthday);
      }
      this.$refs[rulesList2].validate((valid) =>{
        if(valid){
          API.cardUpdateCard(obj).then(res => {
            if(res.success){
              if(res.data){
                this.alertFn('个人资料修改成功',action => {window.location.reload();});
              }else{
                this.alertFn(res.errMsg);
              }
            }else{
              this.alertFn(res.errMsg);
            }
          })
        }
      })
    },
    // 冻结，申请冻结，解冻，申请解冻
    freezeCard(type){
      this.flowQueryginseng.cardNum = this.detailsList.cardNum;
      this.flowQueryginseng.status = this.detailsList.status;
      this.flowQueryginseng.userId = this.detailsList.userId;        
      this.flowQueryginseng.type = type;
      this.flowQueryginseng.sfrozen = this.LOGINDATA.membermanage_memberDetails_sfrozen;
      this.flowQueryginseng.frozen = this.LOGINDATA.membermanage_memberDetails_frozen;
      this.flowQueryginseng.thaw = this.LOGINDATA.membermanage_memberDetails_thaw;
      this.flowQueryginseng.sthaw = this.LOGINDATA.membermanage_memberDetails_sthaw;
      this.isDialog = true;
    },
    IsDialogType(data){
      this.isDialog = data;
    },
    // 点击变更
    changePhone(){
      this.changeCode = true;
    },
    // 点击发送验证码(验证老手机)
    detailSendCode(ev){
      var _this = this;
      if(_this.detailsCountDown === 60){ 
        API.phoneSending({'ph':_this.detailsList.phone, 'ps':'2','ct':_this.detailsList.cardType}).then(res => {
          if(res.success){
            _this.times = setInterval(function(){
              if(_this.detailsCountDown>1){
                _this.detailsCountDown --;
                ev.target.innerText = _this.detailsCountDown+'秒后重新获取';
              }else{
                clearInterval(_this.times);
                ev.target.innerText = '重新获取';
                _this.detailsCountDown = 60;
              }
            },1000)
          }else{
            _this.alertFn(res.errMsg);
          }
        })
      }
    },
    // 老手机校验手机验证码
    confirmChange(rulesList){
      this.$refs[rulesList].validateField('verification1', res => {
        if(res == ""){
          API.phoneCheck({'ph':this.detailsList.phone, 'vCode': this.rulesList.verification1, 'ps':'2'}).then(res => {
            if(res.success && res.data){
              this.newPhone = false;
              this.detailsCountDown = 60;
              clearInterval(this.times);
            }else{
              this.alertFn(res.errMsg);
            }
          })
        }
      })
    },
    // 点击发送验证码(验证新手机)
    detailSendCode2(ev, rulesList){
      var _this = this;
      this.$refs[rulesList].validateField('phone', res => {
        if(res == ""){
          if(_this.detailsCountDown === 60){
            API.phoneSending({'ph':this.rulesList.phone,'ps':'3','ct':_this.detailsList.cardType}).then(res => {
              if(res.success){
                  _this.times = setInterval(function(){
                  if(_this.detailsCountDown>1){
                    _this.detailsCountDown --;
                    ev.target.innerText = _this.detailsCountDown+'秒后重新获取';
                  }else{
                    clearInterval(_this.times);
                    ev.target.innerText = '重新获取';
                    _this.detailsCountDown = 60;
                  }
                },1000)
              }else{
                _this.alertFn(res.errMsg);
              }
            })
          }
        }
      })
    },
    // 确认变更手机
    confirmTheChange(rulesList){
      this.$refs[rulesList].validateField('verification2', res => {
        if(res == ""){
          API.phoneUpdate({uid:this.detailsList.userId,ph:this.rulesList.phone, vCode:this.rulesList.verification2}).then(res => {
            if(res.success){
              if(res.data){
                this.alertFn("信息已更新");
                this.newPhone = true;
                this.changeCode = false;
                this.cardQueryInit();
              }
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
  components: {
    'Dialog': DiaLog  
  }
}
</script>
<style>
  .queryInfoHead{
    height: 36px;
    background: #409EFF;
    line-height: 36px;
    color: #fff;
    text-indent: 12px;
  }
  .queryInfo{
    font-size: 14px;
    float: left;
  }
  .detailsHead{
    float: right;
    margin-right: 10px;
  }
  .NewBuilList{
    height: 62px;
    line-height: 62px;
    padding: 0 30px;
  }
  .datailText{
    font-size: 14px;
    color: #606266;
  }
  .NewBuilmd{
    margin-left: 91px;
  }
  .NewBuilyhq{
    margin-left: 78px;
  }
  .datailText a{
    color: #409EFF;
  }
  .NewBuilAddress{
    white-space:nowrap; 
    overflow:hidden; 
    text-overflow:ellipsis;
    border-bottom: none;
    width: 360px;
    float: left;
    margin-left: 36px;
  }
  .addressBtn{
    width: 80px;
    height: 28px;
    background: #ecf5ff;
    border:1px solid #b3d8ff;
    display: inline-block;
    text-align: center;
    line-height: 28px;
    color: #409EFF;
    text-decoration: none;
    margin-left: 100px;
    border-radius: 3px;
  }
  .NewBuilAddress a:hover{
    background: #409EFF;
    color: #fff;
  }
  .cardInfo{
    height: 65px;
    background: #f7f7f7;
    margin: 35px 0 10px 0px;
  }
  /* .el-form-item__label{
    font-size: 12px; 
    color: #000; 
  } */
  .build-list{
    height: 59px;
    /* border-bottom: 1px solid #DCDFE6; */
    /* line-height: 59px; 
    padding-left: 12px;*/
    padding-top: 15px;
    font-size: 14px;
    margin-left: 75px;
  }
  /* .formItem{
    margin-left:30px;
  } */
</style>

