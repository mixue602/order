
<template>
<!-- 全额订金提前发货 -->
  <el-container class="billing-el-container">
    <el-header class="billing-el-header">
      <BillHeader @bind-header="bindHeader" :isShowSearch="false" :type="3"></BillHeader>
    </el-header>
    <el-main style="padding: 0px;overflow:visible; min-height: 550px;">
        <div  class="billing-container">

            <div class="title">全额订金发货：</div>

            <div class="f-input-info-box">
              <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" >
                <el-row>
                  <el-col :span="16">
                    <el-form-item label="商品编码：" prop="skuno">
                      <el-input 
                        v-model="ruleForm.skuno" 
                        placeholder="请输入商品编码"
                        maxlength="15"
                        @keyup.native="bindDealSkuno($event)"
                        clearable
                      ></el-input>
                    </el-form-item>
                </el-col>
                </el-row>

                <el-row>
                  <el-col :span="16">

                    <el-form-item label="活动日期：" prop="date">
                      <el-date-picker 
                      type="date" 
                      placeholder="选择日期" 
                      v-model="ruleForm.date" 
                      :picker-options="pickerOptions"
                      style="width: 100%;"
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd"
                      clearable
                      >
                      </el-date-picker>
                      
                    </el-form-item>
                  </el-col>
                  
                  <el-col :span="8">
                    <el-form-item>
                      <el-button style="padding:7px 15px; " type="primary" @click="submitForm('ruleForm')">查询</el-button>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>

            <div class="explain-box">
              <h5>全额订金提前发货说明：</h5>
              <p>1.全额订金商品开单后到活动日期可转销售；</p>
              <p>2.转销售之前不开发票，转销售之后开具电子发票；</p>
              <p>3.转销售之前不支持取消订单和申请退货，转销售之后可申请退货退款；</p>
              <p>4.转销售之前不支持自提或小件商品换货，仅支持大件商品换货，转销售之后支持全部商品换货； </p>
              <p>5.转销售之前拒收商品，不支持退款，转销售之后可自动退款； </p>
            </div>

            <ul class="goods-list-box" v-if="searchData.length">
              <li class="clearfloat" v-for="(item, index) in searchData" :key="item.skuNo">
                <div class="item-img fl">
                  <img 
                    :src="item.skuImgUrl||''" 
                    :onerror="onImg" 
                    alt="国美在线">
                </div>
                <div class="item-info fl">
                  <div class="item-name"><em class="tag">全额订金</em><span :title="item.skuName">{{item.skuName}}</span></div>
                  <div class="item-price"><span class="price">{{item.activityPrice}}</span> <em class="gray">价签价：{{item.basePrice}}</em></div>
                  <div class="item-supplier gray">供应商：<span class="code">{{item.supplierName}}</span></div>
                  <div class="item-code">商品编码：<span class="code">{{item.skuNo}}</span></div>
                </div>
                <div class="fr item-btn">
                  <el-button style="width: 100px" type="primary" @click="goBilling(item)">开单</el-button>
                </div>
              </li>
            </ul>

        </div>
    </el-main>
  </el-container>
</template>

<script>
  import { mapActions, mapState, mapMutations } from 'vuex';
  import API from '@/api/billing/billing';
  import APIF from '@/api/fullDeposit/fullDeposit';
  import ENV from '@/api/env';
  import BillHeader from '@/components/billHeader/billHeader';
  import "@/common/tofixed";
  export default {
    components: {
      BillHeader
    },
    created: function() {
      var that = this;
      APIF.queryFullAmountTime().then((data) => {
        if(data.status = 200) {
          that.pickerOptions.disabledDate = function(time) {

            let y = Number(data.startDate.substring(0,4)),
                  m = Number(data.startDate.substring(4,6)) - 1,
                  d = Number(data.startDate.substring(6,8)),
                  startDate = new Date(y,m,d,0,0,0),
                  endDate = new Date(y,m,d,0,0,0);
              startDate.setDate(startDate.getDate());
              endDate.setDate(endDate.getDate() + Number(data.effective) - 1);
              return time.getTime() < startDate.getTime() || time.getTime() > endDate.getTime()
          }
        }else {
          that.ajaxMessageTip(data.msg || '该日期没有全额订金活动价格或已售罄');
        } 
      })
    },
    data() {

      var checkSkuno = (rule, value, callback) => {
        var re = /^\d+$/;
        value = (value ? value.trim() : '');
        if (!re.test(value)) {
          callback(new Error('请输入正确的商品编码'));
        } else {
          callback();
        }
      };
      var checkDate = (rule, value, callback) => {
        if (!value || !value.length) {
          callback(new Error('请选择日期'));
        } else {
          callback();
        }
      };
      return {
        ruleForm: {
          skuno: '',
          date: ''
        },
        rules: {
          skuno: [
            { required: true, message: '请输入商品编码', trigger: 'blur' },
            { validator: checkSkuno, trigger: 'blur' },
            {  min: 3, max: 15, message: '请输入正确的商品编码', trigger: 'blur' }
          ],
          date: [
             { required: true, message: '请选择日期', trigger: 'change' },
             { validator: checkDate, trigger: 'change' },
          ]

        },
        pickerOptions: {
          disabledDate(time) {
            let startDate = new Date(),
                endDate = new Date();
            endDate.setDate(endDate.getDate() + 15);
            return time.getTime() < startDate.getTime() || time.getTime() > endDate.getTime()
          }
        },
        searchData: [],
        onImg: 'this.src="' + require('../../assets/images/noImg.png') + '"'
      };
    },
    computed: {
        ...mapState([
        'LOGINDATA',
        'billingUsedParam',
      ]),

    },

    watch: {
      
    },
    methods: {

      //头部接口调用自定义事件
      bindHeader() {
      },

      bindDealSkuno(ev) {
        
        if(ev.keyCode == 13) {//回车事件
          return false;
        }
        let re = /[^\d]/g;
        let skuno = this.ruleForm.skuno;
        //限制不能输入数字以外的字符
        if(re.test(skuno)) {
          skuno = skuno.replace(re,'');
        }
        
        this.ruleForm.skuno = skuno;
      },

      submitForm(formName) {
        let that = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let params = {
              skuNo: this.ruleForm.skuno.trim(),
              date: this.ruleForm.date,
              storeCode: this.billingUsedParam.storeCode
            }
            APIF.queryFullAmount(params).then((data) => {
              if(data.status = 200 && data.skuList && data.skuList.length) {
                this.searchData = data.skuList;
              }else {
                that.ajaxMessageTip(data.msg || '该日期没有全额订金活动价格或已售罄');
              }
            })
          } else {
          }
        });
      },

      goBilling(item){
        var dateS = this.ruleForm.date.replace(/\-/g,'/');
        var timestamp = (new Date(dateS)).getTime();


        var url = '/service/billing/?';
        url += ('activityPrice='+(item.activityPrice.substring(1)) + '&timestamp=' + timestamp + '&skuNo=' + item.skuNo + '&supplierCode=' + item.supplierCode + '&basePrice='+(item.basePrice.substring(1)) ) 
        this.$router.push(url);
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

  .f-input-info-box  {

    .el-form-item__label {
      text-align: left;
    }
  }
  

</style>

<style lang="stylus"  scoped>
  $b-c-g = #ccc;
  $a-c = #409EFF;
  .fl {
    float: left;
  }
  .fr {
    float: right;
  }
  em {
    font-style: normal;
  }
  .required-mark {
    vertical-align: top;
    color: #f00;
    padding-right: 5px;
    font-style: bold;
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
  
  .errTip {
    line-height: 36px;
    color: red;
  }
 
  .f-input-info-box {
    width: 500px;
  }
  .explain-box {
    margin-top: 10px;
    h5 {
      margin-bottom: 10px;
    }
    p {
      line-height: 24px;
    }
    width: 400px
    color: #FF6600;
  }

  .goods-list-box{
    margin-top: 20px;
    li {
      border: 1px solid #ccc;
      padding: 20px;
      margin-bottom: 10px;
      min-width: 800px;
    }
    .tag {
      color: #fff;
      padding:  2px 3px 4px;
      font-size: 12px;
      display: inline-block;
      line-height: 12px;
      border-radius: 3px;
      background: rgba(255, 102, 0, 1);
      margin-right: 10px;
    }
    .item-img {
      position: relative;
      img {
        width: 100px;
        height: 100px;
      }
    }
    .item-info {
      width: calc(100% - 214px);
      line-height: 1.5em;
      padding-left: 20px;
      box-sizing: border-box;
      .item-name {
        min-height: 1.5em;
        padding-bottom: 5px;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .item-rec-suit {
        padding-bottom: 5px;
      }
      .item-price {
        padding-bottom: 5px;
        .price {
          padding-right: 10px;
          color: #f00;
          font-weight: bold;
        }
      }
      .item-code {

      }
      .gray {
        color: #999;
      }
    }
    .item-btn {
      text-align: center;
      padding-top: 50px;
    }
  }
  
      
      

  


</style>

