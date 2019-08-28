<template>
  <el-container class="billing-el-container">
    <el-header class="billing-el-header">
      <BillHeader @bind-header="bindHeader" :isShowSearch="false" :type="2"></BillHeader>
    </el-header>
    <el-main style="padding: 0px;overflow:visible; min-height: 550px;">
        <div  class="billing-container">

            <div class="title"><em class="required-mark">*</em>会员选择</div>

            <div class="deal-member-box">
                <div class="deal-member">
                    <div class="input-member clearfloat" v-clickoutside="bindMemberClose">
                    <el-input size="small"
                        placeholder="请输入手机号/会员卡号"
                        maxlength="20"
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

            <div class="member-infor-box" v-if="memberData && memberData.memberCardInfo">
              <p>会员手机号：{{memberData.memberCardInfo.memberMobile || ''}}</p>
              <p v-if="memberData.memberCardInfo.memberName">会员姓名：{{memberData.memberCardInfo.memberName || ''}}</p>
              <p>当前美豆余额：<span>{{ memberData.memberCardInfo.gomeDoCount || 0 }} 美豆</span></p>
            </div>

            <div class="input-meidou-box">
              <div class="title"><em class="required-mark">*</em> 会员积分充值金额（100美豆=1元）</div>
              <div class="input-meidou">
                <span class="symbol">￥</span>
                <el-input size="small"
                    class="meidou-box"
                    placeholder="输入金额"
                    v-model="amount"
                    @keyup.native="bindDealPrice($event)"
                    @blur="bindBlurDealPrice"
                    @change="bindChangeDealPrice"
                    clearable>
                </el-input>
                <span class="unit">元，共{{meidou}}个美豆</span>
              </div>
            </div>
            
            <div class="confirm-box">
              <el-button type="primary" :disabled="confirmButtonDisabled"  @click="bindSaveOrderConfirm">开 单</el-button>
              <!-- <div class="errTip">抱歉，联营门店、加盟店暂时不支持订金的充值与使用</div> -->
            </div>
        </div>
    </el-main>
  </el-container>
</template>

<script>
  import { mapActions, mapState, mapMutations } from 'vuex';
  import API from '@/api/billing/billing';
  import APID from '@/api/buyPoints/buyPoints';
  import ENV from '@/api/env';
  import BillHeader from '@/components/billHeader/billHeader';
  import "@/common/tofixed";
  export default {
    components: {
      BillHeader
    },
    created: function() {//只针对这一个540014457商品
    },
    data() {
      return {
        memberNo: '',//会员卡号/手机号
        errorMemberNoTip: "",//手机号校验错误提示语
        memberPanelShow: false,
        memberNewlyBuildUrl: 'http://mpf' + ENV.cookieDomain + '/member/memberNewlyBuild',//开卡地址
        memberData: null,//会员信息初始化时是null
        amount: '0.01',
        oldAmount: '0.01',
        meidou: 1,
      };
    },
    computed: {
        ...mapState([
        'LOGINDATA',
        'billingUsedParam',
      ]),

      //确定按钮是否可点击
      confirmButtonDisabled() {
        if(!(this.memberData && this.memberData.memberCardInfo && this.memberData.memberCardInfo.memberId) ) {
          return true;
        }
        if(!Number(this.amount)) {
          return true;
        }
        return false;
      },

    },

    watch: {
      
    },
    methods: {

      //头部接口调用自定义事件
      bindHeader() {
      },

      //绑定输入会员信息，只能输入1-18位数字
      bindInputMemberInfo(ev) {
        if(ev.keyCode == 13) {//回车事件
          this.bindQueryMemberInfo();
          return false;
        }
        this.memberPanelShow = false;
        //校验规则只能输入1-20位数字
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
        if(this.memberNo.length>20) {
          this.memberNo = '';
          this.errorMemberNoTip = '会员卡号不能超过20位';
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
            this.errorMemberNoTip = '未查询到相关会员信息，请重新输入';
          }
        }).then((data => {
          
        }))
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

      //处理修改价格事件
      bindDealPrice(ev) {
        var that = this;
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

        this.amount = this.amount.replace(/^(\d+\.\d{2})(\d+)$/,'$1');

        //最多支持输入小数点之前8位数，既输入无小数点的8位数后，仅支持输入小数点（输入其他无效）
        this.amount = this.amount.replace(/^(\d+)/,function($0,$1) {
          if($1>100000000) {
            return that.oldAmount;
          }
          return $0;
        });
        
        this.oldAmount = this.amount;
        this.countMeidou();

      },

      bindBlurDealPrice() {
        this.amount += '';
        if(!Number(this.amount)) {
          this.amount = '0.01';
          this.countMeidou();
          return false;
        }
        var isNum = !isNaN( Number(this.amount) )
        if(!isNum) {
          this.amount = '0.01';
          this.countMeidou();
          return false;
        }
        this.amount = Number(this.amount).toFixed(2) + '';
        this.oldAmount = this.amount;
        this.countMeidou();
      },

      bindChangeDealPrice() {
        this.countMeidou();
      },

      bindSaveOrderConfirm() {
        const h = this.$createElement;
        let phoneStr = `会员手机号：${this.memberData.memberCardInfo.memberMobile}`,
            amountStr = `充值积分金额：${this.amount}元（共${this.meidou}个美豆）`,
            arr = [
              h('p', { }, phoneStr),
              h('p', { style: 'color: #f00' }, amountStr),
            ];

        if(this.memberData.memberCardInfo.memberName) {
          arr.unshift(h('p', { }, `会员姓名：${this.memberData.memberCardInfo.memberName}`))
        }
        
        this.$msgbox({
          title: '会员积分充值确认',
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
          remark: '',
          orderUsage: '3'
        };
        
        APID.saveGomedoOrder(param).then((data) => {

            if(data.success) {
              if (data.response != null) {
                let url = "//mpf" + ENV.cookieDomain + '/order/integralrecharge_datails?orderId=' + data.response;
                window.location.href = url
              }
            }else {
              _this.ajaxMessageTip(data.respMsg);
            }

          })
      },

      //计算美豆
      countMeidou() {
        var num = this.amount * 100
        this.meidou = Math.round(num);
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
    font-weight: bold;
    font-size: 16px;
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

  .member-infor-box {

    p {
      line-height: 14px;
      margin-bottom: 10px;
      span {
        color: #f00;
      }
    }
    margin-bottom: 10px;
  }
  .input-meidou-box {
    margin-top: 40px;
  }
  .input-meidou {
    position: relative;
    overflow: hidden;
    .meidou-box {
      float: left;
      width: 150px;
    }
    .symbol {
        position: absolute;
        z-index: 10;
        line-height: 28px;
        left: 0px;
        top: 0;
        font-size: 14px;
        font-weight: bold;
        color: #f00;
    }
    .unit {
        float: left;
        line-height: 28px;
        padding-left: 10px;
    }
  }

  .confirm-box {
    margin-top: 80px;
    width: 600px;
    text-align: left;
  }
  .errTip {
    line-height: 36px;
    color: red;
  }

  


</style>

