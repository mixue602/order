<template>
  <div class="use-ticket-box">
    <div class="preferential-box">
      <div class="preferential-tip">用券/卡：</div>
      
      <div class="preferential-content">
        <span 
          class="go-ticket click-btn"
          v-if="useCoupon&&!useCoupon.isSelected"
          @click="visibleclick">
          <i class="el-icon-circle-plus"></i>
          <em v-if="useCoupon.useCouponQuantity>0">请选择</em>
          <!-- <em v-else></em> -->
          </span>
        <p v-else class="selected-show" @click="visibleclick">{{useCoupon&&useCoupon.selCouponDesc}}</p>
      </div>
    </div>
    <el-dialog 
      :visible.sync="dialogVisible" 
      width="850px"
      center
      class="billing-dialog ticket-dialog"
      :append-to-body="true"
      :close-on-click-modal="false"
      :before-close="bindConfirm"
      >

      <div class="ticket-tab-box">
        <el-button-group>
          
          <el-button type="" :class="ticketType == 1 ? 'selBtn' : ''" @click="bindSwitchTicket(1)">{{ticketDes}}</el-button>
          <el-button type="" :class="ticketType == 2 ? 'selBtn' : ''" @click="bindSwitchTicket(2)">优惠券</el-button>
          <el-button type="" :class="ticketType == 3 ? 'selBtn' : ''" @click="bindSwitchTicket(3)">蓝卡/机价补贴卡</el-button>
        </el-button-group>
      </div>

      <div class="use-ticket-content">

         <div class="shopkeeper-ticket-box" v-if="!initParam.temporaryCardFlag && ticketType == 1">
          <p class="title">{{ticketDes}}</p>

          <div v-if="!managerCouponDesc || !managerCouponDesc.trim()" class="input-ticket clearfloat">
            <el-input class="count-input" 
            v-model="shopkeeperCountInput" 
            @blur="validatorAmount(shopkeeperCountInput)" 
            @focus="shopkeeperErrorTip = ''"
            placeholder="输入减免金额"></el-input>
            <el-input class="password-input" 
            v-model="shopkeeperPasswordInput" 
            @blur="validatorPassword(shopkeeperPasswordInput)" 
            @focus="shopkeeperErrorTip = ''"
            :placeholder="ticketPlaceDes"
             maxlength="6"></el-input>
            <el-button @click="shopkeeperTicketOpereation(1)">使用</el-button>
            <p class="error" v-show="shopkeeperErrorTip">{{shopkeeperErrorTip}}</p>
          </div>

          <ul v-else class="select-good-ticket clearfloat">
            <li  class="self-select-box ticket-list active">
              <p class="name">{{managerCouponDesc}}</p>
              <span class="select-icon"></span>
              <span class="delete el-icon-circle-close" @click.prevent="shopkeeperTicketOpereation(0)"></span>
            </li>
          </ul>

        </div>

        <template v-if="ticketType == 2">

          <div class="input-ticket-box">
            <p class="title">导购员输入的券</p>

            <div class="input-ticket clearfloat">
              <el-input v-model="inputGoodTicket" @keyup.native="validator(inputGoodTicket,$event)" placeholder="输入美券/券号"></el-input><el-button @click="bindQueryUserGoodTicket(inputGoodTicket)">使用</el-button>
              <p class="error" v-show="errorTip">{{errorTip}}</p>
            </div>

            <ul class="select-good-ticket clearfloat" v-if="goodTickets && goodTickets.length>0">

              <li 
                class="gm-select-ticket-box el-checkbox__input"
                v-for="item in goodTickets"
                :key="item.id"
                :class="{'is-checked': (item.isSelected&&item.isUsed),'is-disabled':!item.isUsed}"
              >
                <div class="btn">
                  <span class="el-checkbox__inner"></span>
                </div>

                <div class="gm-select-ticket">
                  <div class="left-select">
                    <p class="price" :style="{'font-size': item.couponValue>=10000 ? '26px' : '34px'}"><em>￥</em><span>{{item.couponValue}}</span></p>
                    <p class="use-price">满{{item.limitedAmount}}元可用</p>
                    <span class="mark">{{item.couponType == 'MarketCoupon' ? '营销券' : '美券'}}</span>
                  </div>

                  <div class="right-select">
                    <p class="des">{{item.couponShowName||'优惠券'}}</p>
                    <p class="use-store">{{item.couponScopeType ? (item.couponScopeType + ' ') : ''}}{{item.couponLabelDesc || ''}} </p>
                    <p class="validity">{{item.beginDate | timeToDate}} - {{item.endDate | timeToDate}}</p>
                  </div>

                  <span class="del-ticket el-icon-circle-close" @click.prevent="bindDelGoodTicket(item)"></span>
                  
                </div>
              </li>

            </ul>

          </div>

          <div class="accout-ticket" style="max-height: 260px;overflow-y:auto;">
            <p class="title">会员账户里的优惠券</p>
            <ul class="clearfloat" v-if="accountTickets && accountTickets.length>0">

              <li 
                class="gm-select-ticket-box el-checkbox__input"
                v-for="item in accountTickets"
                :key="item.id"
                :class="{'is-checked': (item.isSelected&&item.isUsed),'is-disabled':!item.isUsed}"
                @click="bindSelectAccountTicket(item)"
              >
                <div class="btn">
                  <span class="el-checkbox__inner"></span>
                </div>

                <div class="gm-select-ticket">
                  <div class="left-select">
                    <p class="price" :style="{'font-size': item.couponValue>=10000 ? '26px' : '34px'}"><em>￥</em><span>{{item.couponValue}}</span></p>
                    <p class="use-price">满{{item.limitedAmount}}元可用</p>
                    <span class="mark">{{item.couponType == 'MarketCoupon' ? '营销券' : '美券'}}</span>
                  </div>

                  <div class="right-select">
                    <p class="des">{{item.couponShowName || '优惠券'}}</p>
                    <p class="use-store">{{item.couponScopeType ? (item.couponScopeType + ' ') : ''}}{{item.couponLabelDesc || ''}} </p>
                    <p class="validity">{{item.beginDate | timeToDate}} - {{item.endDate | timeToDate}}</p>
                  </div>
                  
                </div>
              </li>
              
            </ul>
            <div class="no-ticket" v-else>暂无可用优惠券</div>

          </div>
        </template>

        <template  v-if="ticketType == 3">
          <div class="operator-ticket-box">
            <div class="input-operator-ticket clearfloat">
              <span class="o-title">客户卡号：</span>
              <el-input class="operator-input" 
              placeholder="请输入客户卡号，只允许输入11位数字"
              v-model="phone"
              @blur="bindCheckPhone"
              maxlength="11"></el-input>
              <el-button @click="bindUseOperatorTicket">使用</el-button>
              <p class="error" style="padding-left: 80px;" v-show="operatorErrorTip">{{operatorErrorTip}}</p>
            </div>

            <ul class="operator-ticket-lists">
              <li 
                v-for="(item, index) in operatorCoupon" 
                :key="item.cardNo"
                class="active"
              >
                <span class="o-ticket-price">¥{{item.useOperatorAmount}}</span>
                <div class="o-ticeket-select-box">
                  <p>{{item.description}}</p>
                  <p>客户卡号：{{item.cardNo}}</p>
                  <span class="icon el-icon-success"></span>
                  <span class="del el-icon-circle-close" @click.prevent="deleteOperatorTicket(item)"></span>
                </div>
              </li>
            </ul>

          </div>

        </template>

        
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="bindConfirm">确 定</el-button>
      </span>
    </el-dialog>

     <!--  运营商商品绑卡手机号 -->
      <el-dialog 
        v-if="protocoPhoneDialog"
        :visible.sync="protocoPhoneDialog" 
        width="400px"  
        class="protoco-phone-box" 
        :show-close="false"
        >
          <auth-code-phone 
          @deal-protoco-phone="bindProtocoPhone"
          :from="2"
          :pBindMobile="peratorPhoneCheckData.phone||''"
          :peratorPhoneCheckData="peratorPhoneCheckData"
      ></auth-code-phone>
      </el-dialog>
  </div> 
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex';
import API from '@/api/billing/billing';
import "@/common/tofixed";
import AuthCodePhone from '@/components/billing/authCodePhone';
import util from '@/common/util';

  export default {
    props: {
      useCoupon: {
        type: Object
      }
    },
    components: {
      AuthCodePhone
    },
    created: function() {
    },
    data() {
      return {
        usedTicket: JSON.parse(JSON.stringify(this.useCoupon)),
        dialogVisible: false,
        errorTip: '',//美券错误提示
        inputGoodTicket: '',//输入的美券
        shopkeeperCountInput:'',//输入的店长券金额
        shopkeeperPasswordInput:'',//输入的店长券密码
        shopkeeperErrorTip:'',//店长券错误提示语
        goodTickets:  JSON.parse(JSON.stringify(this.useCoupon)).sellerUseCoupon,//导购员可用券信息列表
        accountTickets:  JSON.parse(JSON.stringify(this.useCoupon)).memberUseCoupon,//会员可用券信息列表
        managerCouponDesc: this.useCoupon.managerCouponDesc,//店长券描述
        operatorCoupon: this.useCoupon.useOperatorDTOS||[],//蓝卡/机价补贴卡数据
        ticketType: this.$store.state.temporaryCardFlag ? 2: 1,//tab券类型
        phone: '',//查询运营商卡的手机号
        operatorErrorTip: '',//输入运营商卡时的错误提示
        protocoPhoneDialog: false,// 运营商商品绑卡手机号弹窗是否展示
        peratorPhoneCheckData: {},//运营商券校验数据
      };
    },
    computed:{
      ...mapState({
        'initParam': state => state.billingUsedParam,
        'poolFlag': state => state.poolFlag,
        'billingInitData': state => state.billingInitData,
      }),
      useParams() {
				return  {
              ...this.initParam,
							customerType: this.initParam.temporaryCardFlag ? 2 : 1,
							customerId: this.initParam.memberId,
							source: 1,
							businessType: this.initParam.siteType
					}
      },
      ticketDes() {
        return this.poolFlag == 2 ? '折扣券' : '店长券'
      },
      ticketPlaceDes() {
        return '输入' + (this.poolFlag == 2 ? '折扣券' : '店长券') + '密码';
      }
    },
    watch: {
      useCoupon: {
        handler: function () {
          this.ticketType = this.initParam.temporaryCardFlag ? 2: 1;
          this.usedTicket = JSON.parse(JSON.stringify(this.useCoupon));
          this.goodTickets =  JSON.parse(JSON.stringify(this.useCoupon)).sellerUseCoupon;
          this.accountTickets = JSON.parse(JSON.stringify(this.useCoupon)).memberUseCoupon;
          this.managerCouponDesc = JSON.parse(JSON.stringify(this.useCoupon)).managerCouponDesc;
          this.operatorCoupon = JSON.parse(JSON.stringify(this.useCoupon)).useOperatorDTOS||[];
        },
        deep: true
      }
    },
    methods: {
        ...mapActions([
          'initOrder',
        ]),
        ...mapMutations([
        'IS_OPERATE_BILLING_PAGE'
        ]),
        //切换券
        bindSwitchTicket(type) {
          this.ticketType = type;
        },
        //运营商卡失去焦点事件
        bindCheckPhone() {
          
          var reg = /^(1[34578]\d{9})|(19[89]\d{8})|(166\d{8})$/;
          if(!(reg.test(this.phone))) {
            this.operatorErrorTip = '请输入正确的卡号';
            return false;
          }else {
            this.operatorErrorTip = '';
            return true;
          }
        },
        //校验运营商卡手机号
        bindUseOperatorTicket() {
          let that = this;
          if(this.bindCheckPhone()) {
            let params = {
              ...this.useParams,
              mobile: that.phone,
              payAmount: that.billingInitData.totalInfo.finalAmount || 0,
              itemCount: that.billingInitData.totalInfo.quantity || 0
            };
            if(that.operatorCoupon && that.operatorCoupon.length) {
              params.cardType = that.operatorCoupon[0].cardType;
            }
            API.queryGiftCard(params).then((data) => {
              if(data.success&&data.response) {
                that.queryGiftCardData = data.response;
                this.peratorPhoneCheckData = {
                  phone: this.phone,
                  cardType: data.response.cardType || '',
                  amount: data.response.amount || '0.00',
                  surplusAmount: data.response.surplusAmount || '0.00'
                }
                that.protocoPhoneDialog = true;
              }else {
                that.ajaxMessageTip(data.respMsg);
              }
            })
          } 
        },
        //处理运营商手机号短信验证自定义事件事件
        bindProtocoPhone(data) {
          let that = this;
          this.protocoPhoneDialog = false;

          
          if(data.isConfirm) {
            let params = {
              ...this.useParams,
              mobile: that.queryGiftCardData.bindMobile,
              cardType: that.queryGiftCardData.cardType,
              amount: that.queryGiftCardData.surplusAmount,
              protocolId: that.queryGiftCardData.protocolId,
              
              invokeFrom: 'pc_cart'
            };
           
            API.useGiftCard(params).then((data) => {
              if(data.success) {
                
                //加载用券信息
                that.loadUseCouponAjax();
              }else {
                that.ajaxMessageTip(data.respMsg);
              }
            })
          }
        },
         //删除蓝卡和机价补贴卡
        deleteOperatorTicket(item) {
          let that = this;
          that.$confirm('是否删除当前卡券?', '提示', {
              cancelButtonText: '取消',
              confirmButtonText: '确定',
              type: 'warning',
              customClass: 'deal-billing-message-box'
            }).then(()=>{
              
                let params = {
                  ...this.useParams,
                  mobile: item.cardNo,
                  cardType: that.queryGiftCardData.cardType,
                  protocolId: that.queryGiftCardData.protocolId,
                  invokeFrom: 'pc_cart'
                };
                API.cancelGiftCard(params).then((data) => {
                  if(data.success) {
                    //加载用券信息
                    that.loadUseCouponAjax();
                  }else {
                    that.ajaxMessageTip(data.respMsg);
                  }
                })
            });
        },
        //验证器，验证美券的格式
        validator(value,ev){
           var that = this,
               re =/^[A-Za-z0-9]+$/;
               value = value.trim();
            if(value==''){
               that.errorTip = '';
               return false;
            }
            if (!re.test(value)) {
               that.errorTip = '请输入字母或数字';
            } else {
              that.errorTip = '';
            }
        },
       
        //验证店长券金额
        validatorAmount(value){
           var that = this,
               re = /(^[1-9]\d*\.?\d*$)|(^0\.\d*$)/;
               value = value.trim();
            if(value===''){
               that.shopkeeperErrorTip = '请输入减免金额';
               return false;
            }
            if(value==='0'){
               that.shopkeeperErrorTip = '输入的金额不正确';
               return false;
            }
            
            if (!re.test(value)) {
               that.shopkeeperErrorTip = '输入的金额格式不正确';
               return false;
            } else {
              if(!Number(value)) {
                that.shopkeeperErrorTip = '输入的金额不正确';
                return false;
              }
              that.shopkeeperErrorTip = '';
            }
            this.shopkeeperCountInput = String(Number(this.shopkeeperCountInput).toFixed(2));
            return true;
        },
        //验证店长密码
        validatorPassword(value){
          var that = this,
              re =/^(\d){6}$/;
              value = value.trim();
          if(value==''){
              that.shopkeeperErrorTip = '请输入'+that.ticketDes+'密码';
              return false;
          }
          if (!re.test(value)) {
              that.shopkeeperErrorTip = '请输入6位数字的'+that.ticketDes+'密码';
              return false;
          } else {
            that.shopkeeperErrorTip = '';
          }
          
          return true;
        },
        //店长券操作
        shopkeeperTicketOpereation(type){
          
          //请求参数处理
          var that = this,
              useStoreParam = JSON.parse(JSON.stringify(that.initParam));
              useStoreParam.password = that.shopkeeperPasswordInput;

          //添加的情况下，校验信息是否正确
          if(type==1){

            if(!this.validatorAmount(that.shopkeeperCountInput) || !this.validatorPassword(that.shopkeeperPasswordInput)) {
              return false;
            }


            //处理店长金额小数点,传入
            useStoreParam.amount = String(Number(that.shopkeeperCountInput).toFixed(2));
             
            that.shopkeeperTicketAjax(useStoreParam,function(){});

          }else{ //取消店长券的情况下
           
            that.$confirm('是否删除此'+that.ticketDes+'?', '提示', {
              cancelButtonText: '取消',
              confirmButtonText: '确定',
              type: 'warning',
              customClass: 'deal-billing-message-box'
            }).then(()=>{
                //处理店长金额
                useStoreParam.amount ='0';
                that.shopkeeperTicketAjax(useStoreParam,function(){
                   //如果已经成功取消,操作类型变成添加
                   that.shopkeeperCountInput='';
                   that.shopkeeperPasswordInput='';
                });
            });
          }
        },
        //店长券请求封装
        shopkeeperTicketAjax(useStoreParam,callBack){
          API.useStoreCoupon(useStoreParam).then((data) => {
              if(data.success) {
                callBack&&callBack();

               this.loadUseCouponAjax();
              }else {
                this.$message({
                  showClose: true,
                  message: data.respMsg + '（' + data.linkId + '）',
                  type: 'warning'
                });
              }
            });
        },
        //券操作
        ticketOpereation(object){
           var that = this,
            opereationParam = JSON.parse(JSON.stringify(that.initParam));
            opereationParam.couponId = object.couponId;
            opereationParam.couponType = object.couponType || '';
            opereationParam.operationType = object.operationType; //选中或者不选中
       
          API.opereationUseCoupon(opereationParam).then((data) => {
            if(data.success) {
              //清空错误信息
              that.errorTip = '';
              //成功后的操作
              object.successCallback && object.successCallback(data);

              //加载用券信息
              that.loadUseCouponAjax();

            }else {
              object.errorCallback && object.errorCallback(data);
            }
          });
        },


        //小load接口调用
        loadUseCouponAjax() {
          var that = this;
          //加载用券信息
          API.loadUseCoupon(that.initParam).then((data)=>{
            if(data.success) {
              that.goodTickets = data.response&&data.response.sellerUseCoupon ||[];
              that.accountTickets = data.response&&data.response.memberUseCoupon||[];
              that.managerCouponDesc = data.response&&data.response.managerCouponDesc;
              that.operatorCoupon = data.response&&data.response.useOperatorDTOS || [];
              if(data.response.removeIncrementFalg) {
                that.$confirm('商品金额发生变动，请重新选择延保', '提示', {
                  confirmButtonText: '好的',
                  type: 'warning',
                  showCancelButton: false,
                }).then(() => {
                }).catch(() => {
                });
              }
            }else {
              that.$message({
                showClose: true,
                message: data.respMsg + '（' + data.linkId + '）',
                type: 'warning'
              });
            }
          });
        },

        //绑定通过查询使用美券
        bindQueryUserGoodTicket(couponId) {
          var that = this;
          if(couponId.trim()==''){
            that.errorTip = '请输入美券编号';
            return false;
          }
          that.ticketOpereation({
            "couponId":couponId.trim(),
            "operationType":1,
            "errorCallback":function(data){
                //勾选提示错误
                that.errorTip =  data.respMsg;
            }
          });
        },
        //绑定删除美券事件
        bindDelGoodTicket(item) {
          var that = this;
          that.ticketOpereation({
            "couponId":item.id,
            "operationType":0,
            "couponType": item.couponType,
            "errorCallback":function(data){
                //勾选提示错误
                that.errorTip =  data.respMsg;
            }
          });
        },
        //选择账户里的券
        bindSelectAccountTicket(item) {
            var that = this,
                operationType;
          //选中\取消勾选
          if(!item.isUsed){ //如果只是是互斥关系不处理样式
              return false;
          }else if(item.isSelected&&item.isUsed){
            operationType = 0;
          }else if(!item.isSelected&&item.isUsed){
            operationType =1;
          }

        
          that.ticketOpereation({
            "item":item,
            "couponId":item.id,
            "couponType": item.couponType,
            "operationType":operationType,
            "successCallback":function(data){
                item.isSelected = operationType;
            },
            "errorCallback":function(data){
                that.$message({
                  showClose: true,
                  message: data.respMsg + '（' + data.linkId + '）',
                  type: 'warning'
                });
            }
          });
        },
        bindConfirm() {
          let that = this;
          this.dialogVisible = false;
          this.inputGoodTicket ='';
          this.errorTip= '';
          this.shopkeeperCountInput='';
          this.shopkeeperPasswordInput='';
          this.shopkeeperErrorTip='';
          if(this.operatorCoupon && this.operatorCoupon.length>0) {
            
            let total = 0;
            this.operatorCoupon.forEach(item => {
              total += Number(item.useOperatorAmount);
            });
            if( that.billingInitData.totalInfo && total>Number(that.billingInitData.totalInfo.amount)) {
              that.$confirm('当前使用卡内金额大于商品金额，使用后将扣减全部卡内金额，确认使用吗？', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning',
                  customClass: 'deal-billing-message-box',
                }).then(() => {
                  that.$emit('bind-used-ticket');
                }).catch(() => {
                  
                });
            }else {
              this.$emit('bind-used-ticket');
            }
          }else {
            this.$emit('bind-used-ticket');
          }
          this.IS_OPERATE_BILLING_PAGE(true);
        },
        //点击是否可弹出弹框进行修改
        visibleclick(){

          if(!this.$store.state.billingEdit){//开单前
              this.dialogVisible = true;
          }else{ //开单后
              this.dialogVisible = false;
          }
        },
        //接口错误提示
        ajaxMessageTip(str) {
          this.$message({
            showClose: true,
            message: str,
            type: 'warning'
          });
        }
    },
    filters:{
      timeToDate(time){
        if(!time) return '';
        return util.formatDate.format(new Date(time),'y.M.d')
      }
    },
  };
</script>

<style lang="stylus">
.ticket-dialog {
  .el-input--small .el-input__inner {
    line-height: 32px;
    height: 32px;
  }
  .input-ticket {
    
    .el-input {
      width: 500px;
      float: left;
      font-size:14px;
    }
    
    .el-input--small .el-input__inner {
      line-height: 32px;
      height: 32px;
    }
    .el-input--small .el-input__inner {
      border-right-width: 0;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }
    .el-button {
      float: left;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }
    .count-input{
      width: 150px;
      float: left;
      font-size:14px;
      .el-input__inner {
        border-right-width: 1px;
      }
    }
   .password-input{
      width: 340px;
      margin-left:10px;
      float: left;
      font-size:14px;
      .el-input__inner{
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
      }
    }
  }
  .el-dialog__footer {
    padding: 0;
    padding-bottom: 30px;
  }

  .ticket-tab-box .el-button-group .el-button {
    width: 140px;
  }

  .operator-input{
    width: 340px;
    float: left;
    font-size:14px;
    .el-input__inner{
      border-right-width: 0;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }
  }
  .input-operator-ticket {
    .el-button {
      float: left;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }

  }
 
}
</style>


<style lang="stylus"  scoped>
  $b-c-g = #ccc;
  
  .gm-select-ticket-box {
    font-family: "Microsoft Yahei",Arial;
    float: left;
    margin-right: 24px;
    overflow: hidden;
    height: 102px;
    margin-bottom: 10px;
    .btn {
      
      float: left;
      height: 100%;
      line-height: 102px;
      margin-right: 10px;
    }
    .gm-select-ticket {
      float: left;
      width: 328px;
      height: 100%;
      background: url('../../assets/images/ticket-bg.png');
    }
    .left-select {
      float: left;
      width: 104px;
      color: #fff;
      font-size: 12px;
      text-align: center;
      line-height: 1;
      .price {
        padding-top: 11px;
        font-size: 32px;
        em {
          font-size: 14px;
          font-style: normal;
          vertical-align: bottom;
          display: inline-block;
          line-height: 18px;
        }
        span {
          display: inline-block;
          line-height: 1;
          font-style: normal;
          vertical-align: bottom;
        }
      }
      .use-price {
        padding-top: 10px;
        padding-bottom: 9px;
      }
      .mark {
        display: inline-block;
        background: #fff;
        color: #f20c59;
        padding: 2px 12px;
        border-radius: 15px;
      }
    }
    .right-select {
      float: left;
      width: 222px;
      padding-left: 15px;
      padding-right: 18px;
      box-sizing: border-box;
      font-size: 12px;
      color: #333;
      .des {
        white-space: normal;
        width: 100%;
        margin-top: 10px;
        margin-bottom: 12px;
        font-size: 14px;
        line-height: 18px;
        height: 36px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical; 
 
      }
      .use-store {
        color: #f20c59;
        margin-bottom: 8px;
        line-height: 1;
        height: 12px;
      }
      .validity {
        line-height: 1;
      }

     
    }
    .del-ticket {
      display: none;
      position: absolute;
      right: 8px;
      top: 50%;
      font-size: 20px;
      transform: translateY(-50%)
      cursor: pointer;
    }
    &:hover {
      .del-ticket {
        display: block;
      }
    }
  }
  .gm-select-ticket-box.is-disabled {
    opacity: 0.6;
  }
  .input-ticket-box,.shopkeeper-ticket-box {

    min-height: 70px;
  }
  .shopkeeper-ticket-box .self-select-box{
    padding: 0 23px 0 10px;
  }
  .use-ticket-box {
    line-height: 32px;
    .go-ticket {
      display: inline-block;
      cursor: pointer;
      span {
      }
      em {
        font-style: normal;
        padding-left: 5px;
        vertical-align: middle;
      }
    }
  }
  .ticket-dialog {
    line-height: 32px;
    .error {
      padding-top: 10px;
      clear: both;
      color: #f56c6c;
      font-size: 12px;
      line-height: 1;
    }
    
    .select-good-ticket {
      margin-top: 10px;
      margin-bottom: 10px;
      .ticket-list{
        cursor:default;
      }
    }
    .accout-ticket {
      margin-top: 10px;
      min-height: 100px;
      .no-ticket {
        font-size: 16px;
        text-align: center;
        padding-top: 15px;
        color: #909399;
      }
    }
    .ticket-list {
      position: relative;
      float: left;
      
      margin-bottom: 10px;
      cursor:pointer;
      &.active {
        .delete {
       		color: #606266;
     	 }
      }
      &.grey {
        border-color:#E6E6E6;
        background:#F6F6F6;
        cursor:default;
        .name {
          color: #ccc;
        }
      }
      &:hover {
        .delete {
          display: block;
        }
      }
    }
  .input-ticket-box{
    margin-top:10px;
  }  
	.input-ticket-box,.input-ticket-box {
      .ticket-list {
        padding-right: 25px;
        &:hover {
          .delete {
            display: block;
          }
        }
      }
    }
    .delete {
      display: none;
      width: 20px;
      position: absolute;
      right: 3px;
      top: 8px;
      cursor: pointer;
    }
  }

  .ticket-tab-box {
    margin-bottom: 10px;
  }
  .selBtn {
    color: #fff;
    background-color: #409eff;
    border-color: #409eff;
  }
  .operator-ticket-box {
    margin-top: 20px;
    min-height: 150px;
    .o-title {
      float: left;
      line-height: 32px;
      padding-right: 10px;
    }
  }
  .operator-ticket-lists {
    margin-top: 40px;
    padding-left: 80px;
    li {
      width: 382px;
      height: 60px;
      margin-bottom: 30px;
      overflow: hidden;
      cursor: pointer;
      .del {
        display: none;
      }
      
      &:hover {
        .del {
          display: block;
        }
        .el-icon-success {
          display: none;
        }
      }
    }
    .o-ticket-price {
      position: relative;
      z-index: 4;
      float: left;
      width: 100px;
      height: 60px;
      line-height: 60px;
      text-align:center;
      color:#fff;
      font-size: 20px;
      border-radius: 5px;
      background: #0cf;
      font-weight: bold;
    }
    .o-ticeket-select-box {
      
      float: left;
      height: 60px;
      box-sizing: border-box;
      position: relative;
      border: 1px solid #dcdfe6;
      border-top-right-radius: 5px;
      border-bottom-right-radius: 5px;
      padding: 10px 30px 0 10px;
      
      p {
        width: 240px;
        line-height: 14px;
        padding-bottom:10px;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
      }
      &::before, &::after {
        position: absolute;
        z-index: 2;
        left: -4px;
        content: '';
        display: block;
        width: 7px;
        height: 7px;
        border-radius: 50%;
        border: 1px solid #dcdfe6;
        background: #fff;
        box-sizing: border-box;
      }
      &::before {
        top: -5px;
      }
      &::after {
        bottom: -5px;
      }

      .icon,.del {
        font-size: 18px;
        position: absolute;
        z-index: 2;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
        -webkit-transform: translateY(-50%);
        
      }
      .del {
        font-size: 20px;
        color: #606266;
      }
      .el-icon-success {
        color: #02c990;
      }
      
    }
  }


</style>

