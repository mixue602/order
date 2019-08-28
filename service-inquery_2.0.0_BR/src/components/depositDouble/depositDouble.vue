<template>
  <el-container class="billing-el-container">
    <el-header class="billing-el-header">
      <BillHeader @bind-header="bindHeader" :isShowSearch="false" :type="1"></BillHeader>
    </el-header>
    <el-main style="padding: 0px;overflow:visible; min-height: 550px;">
        <div  class="billing-container">

            <div class="title"><em class="required-mark">*</em>会员选择</div>

            <div class="deal-member-box" v-if="!memberData">
                <div class="deal-member">
                    <div class="input-member clearfloat" v-clickoutside="bindMemberClose">
                    <el-input size="small"
                        placeholder="请输入手机号/会员卡号"
                        maxlength="30"
                        v-model="memberNo"
                        @focus="bindPhoneFocus"
                        @keyup.native="bindInputMemberInfo($event)"
                        @change="bindMemberChange"
                        clearable>
                    </el-input>
                    <el-button type="primary" @click="bindQueryMemberInfo">查找</el-button>
                    <el-card class="select-member-panel"  v-show="memberPanelShow">
                        <div class="open-card" v-if="!memberData">
                        <p>此会员卡号未注册，</p>
                        <p v-if="LOGINDATA.service_billing_opencard">请<a :href="memberNewlyBuildUrl" target="blank">点击开卡</a></p>
                        </div>

                        <template v-if="memberData">
                        <div class="open-card"  style="width: 230px;"  v-if="memberData.isNeedUp == 1">
                            <p>此会员卡号需升级，请去服务台处理</p>
                        </div>
                        <div class="open-card" style="width: 230px;"  v-else>
                            <p>此会员卡已冻结，请去服务台处理</p>
                        </div>
                        </template>
                    </el-card>
                    
                    </div>
                </div>

                <p class="verify-error" v-if="errorMemberNoTip">{{errorMemberNoTip}}</p>

            </div>

            <div class="selected-member" v-if="memberData">
              <span>{{ memberData.memberCardInfo.memberName || '' }}{{ ' ' + memberData.memberCardInfo.mobile || ''}}</span>
              <em @click="bindSwitchMember">切换</em>
            </div>

            <div class="amount-info-wrapper" v-if="surplusAmount">
                <p v-if="Number(surplusAmount.scanSurplusAmount) && Number(surplusAmount.deskSurplusAmount)">总订金：{{surplusAmount.surplusAmount}}</p>
                <p v-if="Number(surplusAmount.scanSurplusAmount)">扫码订金：{{surplusAmount.scanSurplusAmount}}</p>
                <p v-if="Number(surplusAmount.deskSurplusAmount)">款台订金：{{surplusAmount.deskSurplusAmount}}</p>
                <p v-if="!Number(surplusAmount.scanSurplusAmount) && !Number(surplusAmount.deskSurplusAmount)">账户内没有订金金额</p>

            </div>

            <div class="title"><em class="required-mark">*</em>购买意向</div>
            <div class="buy-intention">
                <el-input size="small"
                    placeholder="请添加订金的购买意向"
                    v-model="buyIntention"
                    readonly
                    @click.native="editBuyIntention"
                >
                </el-input>
                <img src="../../assets/images/arrow-right.png" class="icon">
            </div>

            <div class="title"><em class="required-mark">*</em>充值金额</div>
            <div class="recharge-amount">
                <span class="symbol">￥</span>
                <el-input size="small"
                    placeholder="输入要充值的金额"
                    v-model="amount"
                    @keyup.native="bindDealPrice($event)"
                    @blur="bindBlurDealPrice"
                    >
                </el-input>
                <span class="unit">元</span>
            </div>

            <div class="instructions">
                <i class="el-icon-warning"></i>
                <span>{{instructionsTitle}}</span>
                <div class="tooltip-wraper">
                    <p>1. 订金的用途：充值订金可以用于提前锁定顾客的购买意向，还可以参加门店的订金翻倍活动，可在【活动说明】中查看详细规则。</p>
                    <p>2. 订金的使用：由于现阶段受支付中心系统所限，来购APP收款的订金和服务台款台收款的订金不可以归集同时使用，所以如顾客账户中已有订金余额，在充值时推荐沿用上一次的收款方式以便订金可以集中使用。</p>
                    <span class="arrow"></span>
                </div>
            </div>

              <div class="recharge-box">
                <el-button type="primary" :disabled="rechargeDisabled"  @click="bindSaveOrderConfirm">充 值</el-button>
                <div class="errTip" v-if="surplusAmount && !surplusAmount.supportFlag">抱歉，联营门店、加盟店暂时不支持订金的充值与使用</div>
              </div>
        </div>


      <purchaseIntention
        :dialogVisible="dialogVisible"
        @bindDialogVisible="bindDialogVisible"
      ></purchaseIntention>
    </el-main>
  </el-container>
</template>

<script>
  import { mapActions, mapState, mapMutations } from 'vuex';
  import API from '@/api/billing/billing';
  import APID from '@/api/depositDouble/depositDouble';
  import ENV from '@/api/env';
  import BillHeader from '@/components/billHeader/billHeader';
  import PurchaseIntention from './purchaseIntention';
  import "@/common/tofixed";
  export default {
    components: {
      BillHeader,
      PurchaseIntention
    },
    created: function() {
    },
    data() {
      return {
        memberNo: '',//会员卡号/手机号
        errorMemberNoTip: "",//手机号校验错误提示语
        memberPanelShow: false,
        memberNewlyBuildUrl: 'http://mpf' + ENV.cookieDomain + '/member/memberNewlyBuild',//开卡地址
        memberData: null,//会员信息初始化时是null
        surplusAmount: null,//账户内用什么充值，还有多少钱
        buyIntention: '',//已选的购买意向和品类
        amount: '',
        dialogVisible: false,
        categoryList: [],
        orderUsage: '',
        remark: ''
      };
    },
    computed: {
        ...mapState([
        'LOGINDATA',
        'billingUsedParam',
      ]),

      //充值方式说明标题
      instructionsTitle() {
          let surplusAmount = this.surplusAmount;
          if(surplusAmount) {
            if(Number(surplusAmount.scanSurplusAmount) && !Number(surplusAmount.deskSurplusAmount)) {
              return '推荐使用手机扫码支付';
            }
            if(Number(surplusAmount.deskSurplusAmount) && !Number(surplusAmount.scanSurplusAmount)) {
              return '推荐使用款台支付';
            }
          }
          return '查看充值方式说明';
      },

      //充值按钮是否可点击
      rechargeDisabled() {
        if(!(this.memberData && this.memberData.memberCardInfo && this.memberData.memberCardInfo.memberId) ) {
          return true;
        }
        if(!Number(this.amount)) {
          return true;
        }
        if(!this.buyIntention.length) {
          return true;
        }

        if(this.surplusAmount && !this.surplusAmount.supportFlag) {
          return true;
        }

        return false;

      }
    },

    watch: {
      
    },
    methods: {

      //头部接口调用自定义事件
      bindHeader() {
      },

      bindSwitchMember() {

        this.$confirm('重选会员后，部分已选内容需重选', '提示', {
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          type: 'warning',
          customClass: 'deal-billing-message-box'
        }).then(() => {
          this.memberData = null;
          this.surplusAmount = null;
          this.memberNo = '';
         }).catch(() => {
           
         })
      },

      //绑定输入会员信息，只能输入1-18位数字
      bindInputMemberInfo(ev) {
        if(ev.keyCode == 13) {//回车事件
          this.bindQueryMemberInfo();
          return false;
        }
        this.memberPanelShow = false;
        //校验规则只能输入1-30位数字
        var re = /[^\d]/g;
        if(re.test(this.memberNo)) {
          this.memberNo = this.memberNo.replace(re,'');
        }
      },

      bindMemberChange() {
        this.memberData = null;
        this.surplusAmount = null;
      },

      //查询会员信息及校验，校验规则只能输入1-18位数字
      bindQueryMemberInfo() {
        var re = /[^\d]/g;
        this.memberPanelShow = false;

        //校验输入的会员或手机号
        if(!this.memberNo || re.test(this.memberNo)) {
          this.memberNo = '';
          this.errorMemberNoTip = '请输入正确的手机号/会员卡号';
          return false;
        }
        if(this.memberNo.length>30) {
          this.memberNo = '';
          this.errorMemberNoTip = '会员卡号不能超过30位';
          return false;
        }

        this.errorMemberNoTip = '';
        
        //请求ajax获取到会员的信息
        API.queryMemberCardList({
          cardKey: this.memberNo
        }).then((data) => {
          if(data.success) {
            if (data.response != null) {
              var response = data.response;
              if(response && response.memberCardInfo && response.memberCardInfo.memberMobile) {
                response.memberCardInfo.mobile = response.memberCardInfo.memberMobile.replace(/^(\d{3})\d{4}(\d{4}$)/,'$1****$2');
              }
              this.memberData = response;
             
              if(response.isNeedUp > 0) {//需要升级,以及冻结
                this.memberPanelShow = true;
              }else {
                return response.memberCardInfo.memberId
              }
            }else {
              this.memberPanelShow = true;
              this.memberData = data.response;
            }
          }else {
            this.ajaxMessageTip(data.respMsg);
          }
        }).then((data => {
          if(data) {
            APID.queryUserStoreDeposit({
              userId: data,
              storeCode: this.billingUsedParam.storeCode
            }).then((data) => {
            this.surplusAmount = null;
              if(data.success) {
                if (data.response != null) {
                  var response = data.response;
                  this.surplusAmount = response;
                }
              }else {
                this.ajaxMessageTip(data.respMsg);
              }

            })

          }
        }))
      },

      //处理修改价格事件
      bindDealPrice(ev) {
        
        if(ev.keyCode == 13) {//回车事件
          this.bindBlurDealPrice();
          return false;
        }
        this.amount += '';
        var re = /[^\d\.]/g;
        //限制不能输入数字和.以外的字符
        if(re.test(this.amount)) {
          this.amount = this.amount.replace(re,'');
        }
        //此处控制的是如果没有小数点，首位不能为类似于 01、02的金额 
        if(this.amount.indexOf(".")< 0 && this.amount !=""){
            this.amount = parseFloat(this.amount) + ''; 
        } 

        //首位不能输入小数点
        if(this.amount.indexOf(".") == 0){ 
            this.amount = this.amount.replace(/^\./,''); 
        } 

         //限制只能输入一个小数点  
        if(this.amount.indexOf(".") != -1){  
            var subPrice = this.amount.substr(this.amount.indexOf(".")+1);  
            this.amount = this.amount.substr(0,this.amount.indexOf(".") + 1) + subPrice.replace(/\./g,'');
        } 

        if(this.amount > 1000000) {
          this.amount = 1000000;
        }

      },

      bindBlurDealPrice() {
        this.amount += '';
        if(!Number(this.amount)) {
          this.amount = '';
          return false;
        }
        var isNum = !isNaN( Number(this.amount) )
        if(!isNum) {
          this.amount = '';
          return false;
        }
        this.amount = Number(this.amount).toFixed(2) + '';
      },

      //获取焦点让错误提示隐藏
      bindPhoneFocus() {
        this.memberPanelShow = false;
        this.errorMemberNoTip = '';
      },
      //选择会员面板消失
      bindMemberClose(e) {
        this.memberPanelShow = false;
      },
      bindSelectClose(e) {
        this.showFollowSelect = false;
      },

      //购买意向事件
      editBuyIntention() {
        this.dialogVisible  = true;
      },
     
      bindDialogVisible(data) {
        this.dialogVisible = false;
        if(data) {
          this.buyIntention = data.buyIntention;
          this.categoryList = data.categoryList;
          this.orderUsage = data.orderUsage;
          this.remark = data.remark;
        }
      },
      bindSaveOrderConfirm() {
        const h = this.$createElement;
        let member = `充值会员：${this.memberData.memberCardInfo.memberName ? this.memberData.memberCardInfo.memberName + ' ' : ''}${this.memberData.memberCardInfo.mobile}`,
            amountStr = `充值金额：${this.amount}`,
            explain = '',
            arr = [
              h('p', { }, member),
              h('p', { style: 'margin-bottom: 20px;' }, amountStr),
            ];
        if(Number(this.surplusAmount.scanSurplusAmount) && Number(this.surplusAmount.deskSurplusAmount)) {
          explain = '该顾客账户有两种充值方式的订金，由于订金无法一块使用，请确认好顾客的订金使用方式。'
          arr.push(h('p', { }, explain))
        }

        this.$msgbox({
          title: '充值订金',
          message: h('div', null, arr),
          showCancelButton: true,
          confirmButtonText: '提交',
          cancelButtonText: '取消',
        }).then(action => {
          this.saveOrder();
        }).catch(() => {
          
        });
      },

      saveOrder() {
        let _this = this;
        let param = {
          userCard: this.memberData.memberCardInfo.memberCardId,
          userId: this.memberData.memberCardInfo.memberId,
          amount: this.amount,
          orderUsage: this.orderUsage,
          remark: this.remark,
          categoryList: this.categoryList
        };
        
        APID.saveOrder(param).then((data) => {
            if(data.success) {
              if (data.response != null) {
                let url = "//mpf" + ENV.cookieDomain + '/order/earnestMoneyorder_detaile?orderId=' + data.response;
                window.location.href = url
              }
            }else {
              _this.ajaxMessageTip(data.respMsg);
            }

          })
      },

      //接口错误提示
      ajaxMessageTip(respMsg) {
        this.$message({
          showClose: true,
          message: respMsg,
          type: 'warning'
        });
      }

    },
    directives:{
      clickoutside:{
        // 点击空白下拉列表消失事件
        bind(el, binding, vnode) {
          function documentHandler(e) {
            // 这里判断点击的元素是否是本身，是本身，则返回
            if (el.contains(e.target)) {
                return false;
            }
            // 判断指令中是否绑定了函数
            if (binding.expression) {
                // 如果绑定了函数 则调用那个函数，此处binding.value就是handleClose方法
                binding.value(e);
            }
          }
          // 给当前元素绑定个私有变量，方便在unbind中可以解除事件监听
          el.__vueClickOutside__ = documentHandler;
          document.addEventListener('click', documentHandler);
        },
        update() {},
        unbind(el, binding) {
          // 解除事件监听
          document.removeEventListener('click', el.__vueClickOutside__);
          delete el.__vueClickOutside__;
        }
      },
      onfocus:{
        inserted:function(el){
          el.focus()
        }
      }
    },
  };
</script>
<style lang="stylus"  >
  $b-c-g = #ccc;
  a {
    text-decoration: none;
  }
  .clearfloat:after {
    display:block;
    clear:both;
    content:"";
    visibility:hidden;
    height:0
  }
  
  .billing-tip {
    padding: 6px;
    line-height: 1;
  }
  .billing-dialog .el-input--small .el-input__inner,.billing-container .el-input--small .el-input__inner {
    height: 28px;
    line-height: 28px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    box-sizing: border-box;
  }

  .billing-container {
    .el-dialog__body {
      padding-top: 0;
    }

    margin: 0 auto;
    .deal-member {
      .el-input {
        width: 544px;
        float: left;
      }
      .el-input--small .el-input__inner {
        border-right: none;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;

      }
      .el-button {
        float: left;
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
        padding-top: 0;
        padding-bottom: 0;
        line-height: 28px;
        height: 28px;
        box-sizing: border-box;
      }
    }
    .buy-intention {
        .el-input--small .el-input__inner {
            padding-right: 40px;
        }
    }
  }
  .follow-select-box  {
    .el-input__inner {

      padding-right: 30px;
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
    }

    .el-scrollbar__wrap {
      overflow-x: hidden;
    }
  }
  .recharge-box .el-button--small, .el-button--small.is-round {
    padding-left: 50px;
    padding-right: 50px;
    font-size: 14px;
  }

</style>

<style lang="stylus"  scoped>
  $b-c-g = #ccc;
  $a-c = #409EFF;
  .verify-error {
    color: #f56c6c;
    font-size: 12px;
    line-height: 12px;;
    text-align: left;
    margin-top: 5px;
  }
  .required-mark {
    vertical-align: top;
    color: #f00;
    padding-right: 5px;
  }

  .billing-el-header {
    padding-left: 0;
    padding-right: 0;
    box-sizing: border-box;
  }

  .billing-el-container {
    padding: 0;
    min-width: 900px;
    width: 100%;
  }

  .billing-container {

    box-sizing: border-box;
    padding: 20px;
    font-size: 14px;
    min-height: 400px;
    border: 1px solid $b-c-g;
    box-sizing: border-box;
  }

  .title {
    line-height: 14px;
    margin-bottom: 10px;
  }
  .deal-member-box {
    position: relative;
    margin-bottom: 20px;
  }
  .deal-member {
    height: 28px;
  }
  .input-member {
    position: relative;
    width: 600px;
    float: left;
  }

  .selected-member {
    margin: 10px 0;
    font-size: 14px;
    line-height: 14px;

    em {
      font-style: normal;
      display: inline-block;
      color: #409eff;
      cursor: pointer;
      margin-left: 20px;
    }
  }

  .select-member-panel {
    z-index: 10;
    position: absolute;
    left: 0;
    top: 29px;
    width: 520px;
    max-height: 400px;
    a {
      color: $a-c;
    }
  }

  .select-member {
    .item {
      font-size: 12px;
      line-height: 1;
      padding: 10px 0;
      border-bottom: 1px solid $b-c-g;
      a {
        float: right;
        text-decoration: none;
      }
    }
    .item:first-of-type {
      padding-top: 0;
    }
  }

  .open-card {
    line-height: 20px;
    padding: 20px 0;
    width: 130px;
    margin: 0 auto;
  }
  .amount-info-wrapper, .buy-intention, .recharge-amount, .instructions, .tooltip-wraper,.recharge-box  {
    width: 600px;  
    box-sizing:border-box;
    margin-bottom: 20px;
  }
  .recharge-box {
    margin-top: 20px;
  }
  .amount-info-wrapper {
     
      border: 1px solid #ccc;
      margin-bottom: 20px; 
      padding: 5px 15px;
      line-height: 20px;
      color: #868686;
      
  }
  .buy-intention {
      position: relative;
      .icon {
          width: 24px;
          height: 24px;
          position: absolute;
          right: 5px;
          top: 50%;
          font-size: 16px;
          margin-top: -12px;
          color: #ccc;
      }
  }

  .recharge-amount {
    width: 200px;
    position: relative;
    .symbol, .unit {
        position: absolute;
        z-index: 10;
        line-height: 28px;
    }
    .symbol {
        left: 0px;
        top: 0;
        font-size: 14px;
        font-weight: bold;
    }
    .unit {
        right: -20px;
        top: 0;
    }
  }

.instructions {
    position: relative;
    line-height:28px;
}
.tooltip-wraper {
    position: relative;
    background: #fff;
    border: 1px solid #303133;
    padding: 10px;
    border-radius: 4px;
    line-height: 24px;
    color: #868686;
     .arrow, .arrow::after {
      position: absolute;
      display: block;
      width: 0;
      height: 0;
      border-color: transparent;
      border-style: solid;
     }
    .arrow {
      border-width: 6px;
      top: -6px;
      border-top-width: 0;
      border-bottom-color: #303133;
      left: 20px;
      &:after {
        content: " ";
        border-width: 5px;
        top: 1px;
        margin-left: -5px;
        border-top-width: 0;
        border-bottom-color: #303133;
        border-bottom-color: #fff;
      }
    }
}
.recharge-box {
  text-align: right;
}
.errTip {
  line-height: 36px;
  color: red;
}



</style>

