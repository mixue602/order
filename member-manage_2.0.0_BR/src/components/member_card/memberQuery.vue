<template>
  <div>
    <el-form size="small" :model="rulesList" ref="rulesList" :rules="rulesEvt" :inline="true" label-width="140px" class="informationService" @submit.native.prevent>
      <el-form-item label="会员卡号或手机号：" prop="cartNumber">
        <el-input maxLength="30" placeholder="请输入会员卡号或手机号" v-model="rulesList.cartNumber"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" v-if="LOGINDATA.membermanage_memberQuery_check" @click="querycart('rulesList')">查询</el-button>
        <a :href="['//mpf'+Env.cookieDomain+'/member/memberNewlyBuild?phone='+rulesList.cartNumber]" v-if="LOGINDATA.membermanage_memberQuery_open" target="_blank"><el-button type="primary" size="small">开卡</el-button></a>
      </el-form-item>
    </el-form>
    <div class="queryText" v-if="memberList==''">请输入会员账号进行查询，为用户升级会合并用户的账户信息。</div>
    <div class="queryText" v-else><span>{{memberList.pc}}</span> 账号查询到<span>{{memberList.cardSize}}</span>张会员卡信息</div>
    <div class="queryInfo" v-for="item in memberList.memberListRDTOS" v-if="memberList.memberListRDTOS != null">
      <div class="queryInfoHead">
        <div class="infoHead">会员信息</div>
        <div class="infoCont">
          <div style="float:left;">
            <el-button type="primary" plain size="mini" @click="freezeCard('D',item.cardNum, item.status)" v-if="(item.status == '1' || item.status == '2') && LOGINDATA.membermanage_memberQuery_thaw">解冻</el-button>
            <el-button type="primary" plain size="mini" @click="freezeCard('D',item.cardNum, item.status)" v-if="item.status == '0' && item.cardStyle == 'Y' && LOGINDATA.membermanage_memberQuery_frozen">冻结</el-button>
            <el-button type="primary" plain size="mini" @click="freezeCard('S',item.cardNum, item.status)" v-if="item.status == '0' && item.cardStyle == 'Y' && LOGINDATA.membermanage_memberQuery_sfrozen">申请冻结</el-button>
            <el-button type="primary" plain size="mini" @click="freezeCard('S',item.cardNum, item.status)" v-if="(item.status == '1' || item.status == '2') && LOGINDATA.membermanage_memberQuery_sthaw">申请解冻</el-button>
          </div>
          <div style="float:left;"  v-if="item.cardStyle == 'N' && item.status == '0' && LOGINDATA.membermanage_memberQuery_upgrade && item.phone!='NULL' && /^1[3456789]\d{9}$/.test(item.phone)">
            <el-button type="primary" plain size="mini" @click="upgradeCard(item.cardNum, item.cardType,item.phone)">升级</el-button>
          </div>
          <div style="float:left;"  v-if="item.status == '0' && (item.phone=='' || !/^1[3456789]\d{9}$/.test(item.phone)) && LOGINDATA.membermanage_memberQuery_perfectSure">
            <el-button type="primary" plain size="mini" @click="perfectPhone(item.cardNum)">完善手机号</el-button>
          </div>
          <!--<a v-if="item.cardStyle == 'Y' && LOGINDATA.membermanage_memberQuery_address" target="_blank" :href="['//mpf'+Env.cookieDomain+'/member/memberAddress/'+item.userId]">
            <el-button type="primary" plain size="mini">收货地址管理</el-button>
          </a>-->
          <a v-if="item.cardStyle == 'Y' && LOGINDATA.membermanage_memberQuery_viewDetails" target="_blank" :href="['//mpf'+Env.cookieDomain+'/member/memberDetails?cid='+item.cardNum]"><el-button size="mini">查看详情</el-button></a>
          <a :href="['//mpf'+Env.cookieDomain+'/member/memberHelpContent']" target="_blank"><i class="el-icon-question" style="font-size:18px;color:#333;"></i></a>
        </div>
      </div>
      <div class="queryState">
        <span class="stateNum">卡号：{{item.cardNum}}</span>
        <el-tag type="success" size="small" class="stateTag">{{item.cardTypeDesc}}</el-tag>
        <el-tag type="success" v-if="item.status == 0" size="small" class="stateTag">正常</el-tag>
        <el-tag type="danger" v-else size="small" class="stateTag">冻结</el-tag>
        <el-row class="stateList">
          <el-col class="cardNameBox" :span="3">姓名：<p class="cardName" >{{item.name}}</p></el-col>
          <el-col :span="3">性别：{{item.sex=="2" ?"男":item.sex=="1"?'女':''}}</el-col>
          <el-col :span="4">手机号：{{item.phone}}</el-col>
          <el-col :span="4">出生日期：{{item.birthday}}</el-col>
          <el-col :span="4">开卡时间：{{item.createDate}}</el-col>
          <el-col class="cardNameBox" :span="3">开卡员工：<p class="cardName" style="left:55px;">{{item.employeeName}}</p></el-col>
        </el-row>
      </div>
      <ul class="queryList">
        <li v-if="LOGINDATA.membermanage_memberQuery_mnum">美豆：<router-link :to="{name:'member_BeanRecord',params:{memberId:item.userId}}">{{item.gomedoQuantity}}</router-link></li>
        <li v-if="LOGINDATA.membermanage_memberQuery_qnum && item.cardStyle == 'Y'">优惠券：<router-link :to="{name:'member_VoucherRecord',params:{memberId:item.userId}}">{{item.couponQuantity || 0}}</router-link></li>
        <!-- <li v-if="LOGINDATA.membermanage_memberQuery_ordernum">订单数：<router-link :to="{name:'member_OrderRecord',params:{memberId:item.userId}}">{{item.orderQuantity}}</router-link></li> -->
      </ul>
    </div>
    <upgradeDialog
      v-if="isUpgradeDialog"
      :upgradeData='upgradeData' 
      :upgradeList='upgradeList'
      v-on:refreshList = "refreshLists"
      v-on:isClose="isDialogClose"
    ></upgradeDialog>
    <Dialog 
      v-if="isDialog"
      :dialogType='isDialog'
      :flowQueryginseng ="flowQueryginseng"
      v-on:refreshList = "refreshLists"
      v-on:Istype="IsDialogType">
    </Dialog>
    <dialogErr
      v-if="errMessageDialog" 
      :phoneStatus = errMessageList.phoneStatus 
      :markedWords = errMessageList.markedWords 
      :phone = rulesList.cartNumber 
      :newlyUserId = errMessageList.abnormalUserId 
      :LOGINDATAErr = LOGINDATAErr 
      v-on:isErrLog = isErrDialog
    ></dialogErr>
    <el-dialog title="完善手机号" :visible.sync="isPerfect" :before-close = "cleanContent" :show-close = 'false' width="600px">
      <el-form :model="rulesList2" ref="rulesList2" :rules="rulesEvt2">
        <el-row class="upgradeVer"> 
          <el-col :span="6" :offset="2">
            <el-form-item class="formItem" prop="perfectphoneNum">
              <el-input size="mini" @keyup.native="isNumber" placeholder="请输入手机号" v-model="rulesList2.perfectphoneNum"></el-input>
            </el-form-item>
          </el-col>    
          <el-col :span="5" :offset="1">
            <el-form-item class="formItem" prop="perfectVerification">
              <el-input size="mini" maxlength=6 placeholder="请输入验证码" v-model="rulesList2.perfectVerification"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5" :offset="1"><el-button type="warning" style="margin-top:8px;" v-if="LOGINDATA.membermanage_memberQuery_perfectSend" @click="perfectSendCode('rulesList2')" size="mini">{{sendCodeText}}</el-button></el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="medium" @click="cancledialog('rulesList2')">取 消</el-button>
        <el-button type="primary" size="medium" v-if="LOGINDATA.membermanage_memberQuery_perfectSure" @click="perfectSure('rulesList2')">确 认</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import {mapState,mapActions} from  'vuex';
  import CAPI from "@/api/api_card/cardCommon";
  import API from "@/api/api_card/memberQuery";
  import DiaLog from '../member_common/dialog';
  import upgradeDialog from '../member_common/upgrade-dialog';
  import Env from '@/api/env';
  import dialogErr from '../member_common/dialogError';  
  export  default {
    data() {
      var checkCard = (rule, value, callback) => {
        if(value == ""){
          callback(new Error("卡号不能为空"));
        }else if(/\D/.test(value)){
          callback(new Error("卡号不能输入非数字"));
        }else{
          callback();
        }
      }
      var phonePerfect = (rule, value, callback) => {
        if(value == ""){
          callback(new Error('手机号不能为空'));
        }else if(!/^1[3456789]\d{9}$/.test(value)){
          callback(new Error('请输入正确的手机号'));
        }else{
          callback();
        }
      };
      var perfectCode = (rule, value, callback) => {
        if(value == ""){
          callback(new Error("验证码不能为空"));
        }else if(/\D/.test(value)){
          callback(new Error("验证码不能输入非数字"));
        }else{
          callback();
        }
      };
      return {
        Env,
        times: '',
        isPerfect: false,
        userID: "",
        isDialog: false,
        isSendCode: true,          //判断验证码是否发送
        errMessageDialog: false,    //查卡错误提示
        sendCodeText: '发送验证码',  //验证码文字
        errMessageList: {},       //查卡错误数据
        errCardNum: '',           //查卡错误卡号
        countDown: 60,            //验证码秒数
        memberList: '',           //卡列表数据
        upgradeList:{},
        flowQueryginseng:{},      //冻结参数
        dialogFreezeCard: false,     //冻结弹框显示数据    
        isUpgradeDialog: false,    //升级弹框显示数据
        upgradeData: {},             //升级弹框展示数据
        LOGINDATAErr:{},            //去操作权限码
        rulesList: {                //卡号校验
          cartNumber: ""            //用户输入会员卡号
        },
        rulesList2:{
          perfectphoneNum: "",
          perfectVerification: ''
        },
        rulesEvt:{
          cartNumber:[
            {validator: checkCard, trigger: 'blur'}
          ]
        },
        rulesEvt2:{
          perfectphoneNum:[
            {validator: phonePerfect, trigger: 'blur'}
          ],
          perfectVerification:[
            {validator: perfectCode, trigger: 'blur'}
          ]
        }
      };
    },
    computed:mapState({
      LOGINDATA:'LOGINDATA'
    }),
    created(){
      var query = this.$router.history.current.query;
      if(query.phone){
        this.querycartRequest(query.phone);
      }
    },
    methods:{
      // 路由跳转
      toJump(to){
        this.$router.push(to?to:'/member/memberQuery')
      },
      // 关闭弹框清空表单验证
      cancledialog(formRule){
        this.$refs[formRule].resetFields();
        this.isPerfect = false;
        clearInterval(this.times);
        this.sendCodeText = '发送验证码';
        this.countDown = 60;
        this.isSendCode = true;
      },
      cleanContent(){
        this.isPerfect = true;
      },
      // 不是数字清空输入框
      isNumber(){
        this.rulesList2.perfectphoneNum = this.rulesList2.perfectphoneNum.replace(/[^\d]/g, '');
      },
      // 查卡错误信息返回数据
      isErrDialog(data){
        this.errMessageDialog = data;
      },
      refreshLists(isRefresh){
        if(isRefresh){
          this.querycartRequest(this.rulesList.cartNumber);
        }
      },
      // 查询卡列表
      querycart(rulesList){
        this.$refs[rulesList].validate((valid) =>{
          if(valid){
            this.querycartRequest(this.rulesList.cartNumber);
          }
        })
      },
      querycartRequest(phone){
        API.queryCard({pc:phone}).then(res => {
          if(res.success){
            if(res.data.cardSize == "0"){
              if(res.data.checkPhoneStatusRDTO.phoneStatus == '1'){
                this.$confirm('未查询到会员卡信息，是否开通会员卡', {
                  confirmButtonText: '去开卡',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  window.open("//mpf"+Env.cookieDomain+"/member/memberNewlyBuild?phone="+this.rulesList.cartNumber);
                }).catch(()=>{});
              }else{
                this.errMessageList = res.data.checkPhoneStatusRDTO;
                this.errMessageDialog = true;
                this.LOGINDATAErr.tosetup = this.LOGINDATA.membermanage_memberQuery_tosetup;
                this.LOGINDATAErr.upgradeSee = this.LOGINDATA.membermanage_memberQuery_upgradeSee;
              }
            }else{
              var memberListRDTOS = res.data.memberListRDTOS
              this.memberList = res.data;
              this.userID = memberListRDTOS[0].userId;
            }
          }else{
            this.alertFn(res.errMsg);
          }
        })
      },
      //点击冻结查询是否被申请
      freezeCard(type, cardNum, status){
        this.flowQueryginseng.cardNum = cardNum;
        this.flowQueryginseng.status = status;
        this.flowQueryginseng.userId = this.userID;        
        this.flowQueryginseng.type = type;
        this.flowQueryginseng.sfrozen = this.LOGINDATA.membermanage_memberQuery_sfrozen;
        this.flowQueryginseng.frozen = this.LOGINDATA.membermanage_memberQuery_frozen;
        this.flowQueryginseng.thaw = this.LOGINDATA.membermanage_memberQuery_thaw;
        this.flowQueryginseng.sthaw = this.LOGINDATA.membermanage_memberQuery_sthaw;
        this.isDialog = true;
      },
      IsDialogType(data){
        this.isDialog = data;
      },
      isDialogClose(data){
        this.isUpgradeDialog = data;
      },
      //升级
      upgradeCard(cardNum, cardType, cardPhone){
        if(cardPhone == null){
          this.alertFn('手机号格式错误，请在尽力系统修改会员手机号码或在金立中开单');
          return;
        }
        API.checkCard({'cid':cardNum}).then(res => {
          if(res.success && res.data){
            this.upgradeList = res.data;
            this.isUpgradeDialog = true;
            this.upgradeData.userId = this.userID;
            this.upgradeData.cardType = cardType;
            this.upgradeData.cardNum = cardNum;
          }else{
            this.alertFn(res.errMsg);
          }
        })
      },
      // 完善手机号
      perfectPhone(cardNum){
        this.isPerfect = true;
        this.errCardNum = cardNum;
      },
      // 完善手机号发送验证码
      perfectSendCode(ruleForm){
        var _this = this;
        _this.$refs[ruleForm].validateField('perfectphoneNum',function(err){
          if(err == ""){
            if(_this.countDown === 60 && _this.isSendCode){
              _this.isSendCode = false;
              API.updateCardPhone({'ph':_this.rulesList2.perfectphoneNum, 'cid':_this.errCardNum}).then(res => {
                if(res.success && res.data){
                  _this.times = setInterval(function(){
                    if(_this.countDown>1){
                      _this.countDown --;
                      _this.sendCodeText = _this.countDown+'秒后重新获取';
                    }else{
                      clearInterval(_this.times);
                      _this.sendCodeText = '重新获取';
                      _this.countDown = 60;
                      _this.isSendCode = true;
                    }
                  },1000)
                }else{
                  _this.alertFn(res.errMsg);
                  _this.isSendCode = true;
                }
              })
            }
          }
        })
      },
      perfectSure(ruleForm){
        this.$refs[ruleForm].validate((valid) =>{
          if(valid){
            API.phoneMobileVcode({'ph':this.rulesList2.perfectphoneNum, 'cid':this.errCardNum, 'vCode': this.rulesList2.perfectVerification}).then(res => {
              if(res.success && res.data){
                this.alertFn('完善手机号成功', action => {
                  this.isPerfect = false;
                  this.querycartRequest(this.rulesList.cartNumber);
                });
              }else{
                if(res.errCode == '0010010015'){
                  this.alertFn(res.errMsg, action => {
                    this.isPerfect = false;
                    this.querycartRequest(this.rulesList.cartNumber);
                  });
                }else{
                  this.alertFn(res.errMsg);
                }
                
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
      'Dialog': DiaLog,
      'upgradeDialog': upgradeDialog,
      'dialogErr': dialogErr
    }
  }
</script>
<style>
  .queryHeader{
    height: 36px;
    background: #409EFF;
    line-height: 36px;
    color: #fff;
    text-indent: 12px;
    font-size: 14px;
  }
  .cardNameBox{
    position: relative;
    margin-right: 10px;
  }
  .cardName{
    width: 75%;
    height: 16px;
    line-height: 15px;
    position: absolute;
    overflow: hidden;
    left: 30px;
    top: 0px;
    padding: 0 5px;
    word-wrap:break-word; 
    word-break:break-all; 
  }
  .cardName:hover{
    height: auto;
  }
  .informationService{
    height:60px;
    border: 1px solid #DCDFE6;
    padding-top: 20px;
  }
  .queryText{
    font-size: 14px;
    margin-top: 20px;
    text-align: center;
  }
  .queryText span{
    color: #F56C6C;
  }
  .queryInfo{
    margin-top: 25px;
    border: 1px solid #DCDFE6;
  }
  .queryInfo:hover{
    background: #F2F6FC;
  }
  .queryInfoHead{
    height:36px;
    line-height: 36px;
    font-size: 12px;
    background: #E4E7ED;
    text-indent: 12px;
  }
  .infoHead{
    float: left;
  }
  .infoCont{
    float: right;
    margin-right: 15px;
  }
  .queryState{
    height: 88px;
    border-bottom:1px dashed #E4E7ED;
    padding-left: 12px;
  }
  .stateNum{  
    font-size: 12px;
    line-height: 56px;
  }
  .stateTag{
    margin-left: 15px;
  }
  .queryList{
    height: 88px;
    padding-left: 12px;
  }
  .queryList li{
    float: left;
    width: 20%;
    line-height: 88px;
  }
  .queryList li a{
    color: #409EFF;
  }
</style>

