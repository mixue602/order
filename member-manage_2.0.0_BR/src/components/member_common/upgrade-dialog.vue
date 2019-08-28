<template>
    <el-dialog width="900px" title="会员卡升级" :visible.sync="upgradeDialogCard" :before-close="upgradeHandleClose">
        <el-form :model="ruleForm" ref="ruleForm" :rules="rules2">
            <!-- <div class="upgradeBox"> -->
            <el-row v-if="upgradeList.status == '1'" class="upgradeVer"> 
                <el-col :span="3" :offset="2"><span>{{upgradeList.reservePhone}}</span></el-col>
                <el-col :span="8">
                    <el-form-item class="formItem" prop="verification">
                        <el-input size="mini" maxlength=6 v-model="ruleForm.verification" placeholder="请输入验证码" ></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="5" :offset="1"><el-button v-if="LOGINDATA.membermanage_memberQuery_upgradeSend" type="warning" @click="sendCode($event, 'reserve')" size="mini">发送验证码</el-button></el-col>
            </el-row>
            <!-- </div> -->
            <el-tabs
                v-else-if="upgradeList.status == '2' || upgradeList.status == '3' || upgradeList.status == '5' || upgradeList.status == '6' || upgradeList.status == '7'"
                v-model="activeName2"
                type="card">
                <el-tab-pane v-if="upgradeList.status == '2' || upgradeList.status == '6'" label="使用新手机升级" name="first">
                    <el-row class="upgradeVer"> 
                        <el-col :span="7" :offset="2">
                            <el-form-item class="formItem" prop="phone">
                                <el-input size="mini" placeholder="请输入手机号" v-model="ruleForm.phone" ></el-input>
                            </el-form-item>
                        </el-col>    
                        <el-col :span="4" :offset="1">
                            <el-form-item class="formItem" prop="verification">
                                <el-input size="mini" maxlength=6 v-model="ruleForm.verification" placeholder="请输入验证码" ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="5" :offset="1"><el-button v-if="LOGINDATA.membermanage_memberQuery_upgradeSend" type="warning" @click="sendCode($event, 'new', 'ruleForm')" size="mini">发送验证码</el-button></el-col>
                    </el-row>
                </el-tab-pane>
                <el-tab-pane v-if="upgradeList.status == '3' || upgradeList.status == '5' || upgradeList.status == '7'" label="使用激活手机升级" name="first">
                    <el-row class="upgradeVer"> 
                        <el-col :span="3" :offset="2"><span>{{upgradeList.activatePhone}}</span></el-col>
                        <el-col :span="6" :offset="1">
                            <el-form-item class="formItem" prop="verification">
                                <el-input size="mini" maxlength=6 v-model="ruleForm.verification" placeholder="请输入验证码" ></el-input>
                            </el-form-item>    
                        </el-col>
                        <el-col :span="5" :offset="1"><el-button v-if="LOGINDATA.membermanage_memberQuery_upgradeSend" type="warning" @click="sendCode($event, 'activation')" size="mini">发送验证码</el-button></el-col>
                    </el-row>
                </el-tab-pane>
                <el-tab-pane v-if="upgradeList.status == '3'" label="使用预留手机升级" name="reserve">
                    <el-row class="upgradeVer"> 
                        <el-col :span="3" :offset="2"><span>{{upgradeList.reservePhone}}</span></el-col>
                        <el-col :span="6" :offset="1">
                            <el-form-item class="formItem" prop="verification2">
                                <el-input size="mini" maxlength=6 v-model="ruleForm.verification2" placeholder="请输入验证码" ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="5" :offset="1"><el-button v-if="LOGINDATA.membermanage_memberQuery_upgradeSend" type="warning" @click="sendCode($event, 'reserve')" size="mini">发送验证码</el-button></el-col>
                    </el-row>
                </el-tab-pane>
                <el-tab-pane v-if="upgradeList.status == '2' || upgradeList.status == '5' || upgradeList.status == '6' || upgradeList.status == '7'" label="使用被占用预留手机升级" name="second">
                    <h5 class="upgradePrompt" v-if="upgradeList.status == '2' || upgradeList.status == '5'">如客户坚持使用此号码进行激活,需要选择以下账户后才可发送验证码</h5>
                    <el-row class="upgradeVer" v-if="upgradeList.status == '2' || upgradeList.status == '5'"> 
                        <el-col :span="3" :offset="2"><span>{{upgradeList.reservePhone}}</span></el-col>
                        <el-col :span="8">
                            <el-form-item class="formItem" prop="verification2">
                                <el-input size="mini" maxlength=6 v-model="ruleForm.verification2" placeholder="请输入验证码" ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="5" :offset="1"><el-button v-if="LOGINDATA.membermanage_memberQuery_upgradeSend" type="warning" @click="sendCode($event, 'reserve')" size="mini">发送验证码</el-button></el-col>
                    </el-row>
                    <div class="upgradePrompt2" v-if="upgradeList.status == '6' || upgradeList.status == '7'"><span class="reserveNum">{{upgradeList.reservePhone}}</span>如客户坚持使用此号码进行激活,需要处理以下账户后才可进行升级</div> 
                    <ul class="upgradelist" v-for="(item,index) in upgradeList.userRDTOS">
                        <li class="list-start"><input v-if="(upgradeList.status == '2' || upgradeList.status == '5') && index==0" type="radio" checked></li>
                        <li class="list-name">会员ID：{{item.userId}}</li>
                        <li class="list-num" @click="toJump({name:'member_BeanRecord',params:{memberId:item.userId}})" v-if="LOGINDATA.membermanage_memberQuery_mnum"><a style="color:#409EFF;" href="javascript:void(0);" >美豆：{{item.gomedoQuantity}}</a></li>
                        <!-- <li class="list-num">订单数：{{item.orderQuantity}}</li> -->
                        <li class="list-prompt">{{item.desc}}</li>
                        <li class="upgradeBtn" v-if="(upgradeList.status == '2' || upgradeList.status == '5') && index == 1 && LOGINDATA.membermanage_memberQuery_tosetup"><a :href="['//omscsc'+Env.cookieDomain+'/csc/user/search.action']" target="_blank"><el-button type="primary" size="mini" plain>去操作</el-button></a></li>
                        <li class="upgradeBtn" v-if="(upgradeList.status == '6' || upgradeList.status == '7') && LOGINDATA.membermanage_memberQuery_tosetup"><a :href="['//omscsc'+Env.cookieDomain+'/csc/user/search.action']" target="_blank"><el-button type="primary" size="mini" plain>去操作</el-button></a></li>
                    </ul>
                </el-tab-pane>
            </el-tabs>
            <div class="errorStatus" v-else>{{upgradeList.markedWords}}</div>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="upgradeHandleClose">取 消</el-button>
            <a v-if="upgradeList.status == '8' && LOGINDATA.membermanage_memberQuery_upgradeSee" target="_blank" :href="['//mpf'+Env.cookieDomain+'/member/memberDetails?userId='+upgradeList.gomeUserId]"><el-button type="primary">查看线上会员</el-button></a>
            <a v-else-if="upgradeList.status == '9' && LOGINDATA.membermanage_memberQuery_tosetup" target="_blank" :href="['//omscsc'+Env.cookieDomain+'/csc/user/search.action']"><el-button type="primary">去操作</el-button></a>
            <a v-else-if="upgradeList.status == '10' && LOGINDATA.membermanage_memberQuery_tosetup" target="_blank" :href="['//omscsc'+Env.cookieDomain+'/csc/user/detail.action?userId='+upgradeList.gomeUserId]"><el-button type="primary">去操作</el-button></a>
            <el-button v-else-if="upgradeList.status == '13'" @click="upgradeHandleClose">确 认</el-button>
            <el-button v-else type="primary" @click="bindingCard('ruleForm')">验证升级</el-button>
        </span>
    </el-dialog>
</template>
<script>
import {mapState,mapActions} from  'vuex';
import API from '@/api/api_card/memberQuery';
import Env from '@/api/env';
export default {
    props: {
        upgradeData: Object,
        upgradeList: Object
    },
    data(){
        var upgradePhone = (rule, value, callback) => {
            if(value == ""){
                callback(new Error('手机号不能为空'));
            }else if(!/^1[345789]\d{9}$/.test(value)){
                callback(new Error('请输入正确的手机号'));
            }else{
                callback();
            }
        };
        var upgradeCode = (rule, value, callback) => {
            if(value == ""){
                callback(new Error("验证码不能为空"));
            }else if(/\D/.test(value)){
                callback(new Error("验证码不能输入非数字"));
            }else{
                callback();
            }
        };
        return{
            Env,
            upgradeDialogCard: true,
            // upgradeList: {},
            times : '',
            activeName2: 'first',       //升级弹框切换判断
            upgradePhone: "",           //输入新手机数据
            countDown: 60,                //点击获取验证码倒计时
            ruleForm:{
                phone: '',
                verification: '',
                verification2: ''
            },
            rules2: {
                phone:[
                    {validator: upgradePhone, trigger: 'blur'}
                ],
                verification:[
                    {validator: upgradeCode, trigger: 'blur'}
                ],
                verification2:[
                    {validator: upgradeCode, trigger: 'blur'}
                ]
            }
        }
    },
    created(){
        // API.checkCard({'cid':this.upgradeData.cardNum}).then(res => {
        //   if(!res.success){
        //     if(res.data){
        //         this.upgradeList = res.data;
        //     }
        //   }else{
        //       this.upgradeHandleClose();
        //       this.alertFn(res.errMsg);
        //   }
        // })
    },
    computed:mapState({
      LOGINDATA:'LOGINDATA'
    }),
    methods: {
        toJump(to){
            this.$router.push(to?to:'/member/memberQuery');
            this.$emit('isClose',false);
        },
        // 发送验证码
        sendCode(ev, type){
            var _this = this;
            var ph = '';
            if(type == 'new'){
                ph = this.ruleForm.phone;
                this.$refs['ruleForm'].validateField('phone',res => {
                    if(res == ""){
                        this.sendOut(ev, ph);
                    }
                })
                return;
            }else if(type=="activation"){
                ph = this.upgradeList.activatePhone;
            }else{
                ph = this.upgradeList.reservePhone;
            }
            this.sendOut(ev,ph); 
        },
        sendOut:function(ev, ph){
            var _this = this;
            if( this.countDown === 60){
                API.phoneSending({'ph':ph,'ps':'1','ct':this.upgradeData.cardType}).then(res => {
                    if(res.success){
                        if(res.data){
                            _this.times = setInterval(function(){
                                if(_this.countDown>1){
                                    _this.countDown --;
                                    ev.target.innerText = _this.countDown+'秒后重新获取';
                                }else{
                                    clearInterval(_this.times);
                                    ev.target.innerText = '重新获取';
                                    _this.countDown = 60;
                                }
                            },1000)
                        }
                    }else{
                        _this.alertFn(res.errMsg);
                    }
                })
            }
        },
        upgradeHandleClose(){
            this.$emit('isClose',false);
            this.activeName2 = 'first';
            this.ruleForm.verification = '';
            this.ruleForm.verification2 = '';
            clearInterval(this.times);
            this.countDown = 60;
        },
        bindingCard(ruleForm){
            if(this.upgradeList.status == '9' || this.upgradeList.status == '10' || this.upgradeList.status == '11' || this.upgradeList.status == '12' || this.upgradeList.status == '13'){
                this.upgradeHandleClose();
            }
            if(this.activeName2 == 'first'){
                if(this.upgradeList.status == '1'){
                    this.$refs[ruleForm].validateField('verification', res => {
                        if(res == ""){
                            this.cardBinding(this.upgradeList.reservePhone, this.ruleForm.verification);
                        }
                    })
                }else if(this.upgradeList.status == '2' || this.upgradeList.status == '6'){
                    this.$refs[ruleForm].validateField('phone', res1 => {
                        this.$refs[ruleForm].validateField('verification', res2 => {
                            if(res1 == "" && res2 ==""){
                                this.cardBinding(this.ruleForm.phone, this.ruleForm.verification);
                            }
                        })
                    })
                }else{
                    this.$refs[ruleForm].validateField('verification', res => {
                        if(res == ""){
                            this.cardBinding(this.upgradeList.activatePhone, this.ruleForm.verification);
                        }
                    })
                }
            }else{
                this.$refs[ruleForm].validateField('verification2', res => {
                    if(res == ""){
                        this.cardBinding(this.upgradeList.reservePhone, this.ruleForm.verification2);
                    }
                })
            }
        },
        cardBinding(phone,vCode){
            var _this = this;
            API.cardBindingCard({'cid':this.upgradeList.cid,'uid':this.upgradeData.userId,'ph':phone,'vCode':vCode})
            .then(res => {
                if(res.success){
                    if(res.data){
                        _this.alertFn('升级成功');
                        _this.$emit('refreshList',true);
                        _this.upgradeHandleClose();
                    }
                }else{
                    _this.alertFn(res.errMsg);
                }
            })
            .catch(error => {
                alert('服务器繁忙，请稍后再试');
            })
        },
        alertFn(Hint, callbacks){
            this.$alert(Hint, {
                confirmButtonText: '确定',
                callback: callbacks
            });
        }
    }
}
</script>
<style>
    .upgradeVer{
        margin: 20px 0px;
    }
    .upgradelist{
        height: 60px;
        line-height: 60px;
        border-top: 1px solid #DCDFE6;
    }
    .upgradelist li{
        float: left;
        text-align:center;
    }
    .upgradelist li.list-start{
        width:60px;
        height:50px;
    }
    .upgradelist li.list-name{
        width:146px;
        height:50px;
    }
    .upgradelist li.list-num{
        width:130px;
        height:50px;
    }
    .upgradelist li.list-prompt{
        width:350px;
        height:50px;
    }
    .upgradeBtn{
        margin-left: 20px;
    }
    .formItem{
        margin-top:-7px;
    }
    .upgradePrompt,.upgradePrompt2{
        text-align:center;
    }
    .upgradePrompt2{
        height:80px;
        line-height:80px;
    }
    .reserveNum{
        color:#F56C6C;
    }
    .errorStatus{
        font-size:16px;
    }
</style>

