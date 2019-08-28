<template>
  <div class="add-address-box">
    <div class="add-address">
      <p class="text-tip">新建地址</p>
      <div class="form-address">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="95px" class="demo-ruleForm">
          <el-row>
            <el-col :span="12">
              <el-form-item label="收货人：" prop="name" class="name">
                <el-input v-model="ruleForm.name" ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          
          <el-row>
            <el-col :span="17" >
              <div ref="billingAddress">

                <el-form-item label="所在区域：" class="box-cityinput" prop="address" >
                  <g-city :class="{'g-city-border-color': addressIsError}" v-model="ruleForm.cityobj" @changeend="bindChangeCity"></g-city>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="7">
              <p class="tip">如不确定乡镇或街道，请选择就近区域</p>
            </el-col>
          </el-row>  

          <el-form-item label="详细地址：" prop="detailAddress" class="detail-address">
            <el-input v-model="ruleForm.detailAddress" auto-complete="off"></el-input>
          </el-form-item>

          <el-row>
            <el-col :span="12">
              <el-form-item label="手机号码：" prop="phone" class="phone">
                <el-input v-model="ruleForm.phone" auto-complete="off"></el-input>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="12">
              <el-form-item label="固定电话" prop="call" class="call">
                <el-input v-model="ruleForm.call" auto-complete="off"></el-input>
              </el-form-item>
            </el-col> -->
          </el-row>
          <!-- <el-row>
            <el-col :span="12">
              <el-form-item label="邮件：" prop="email" class="email">
                <el-input v-model="ruleForm.email" auto-complete="off"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <p class="tip">方便您实时接收订单状态提醒</p>
            </el-col>
          </el-row> -->
          <el-form-item>
            <div  class="footer">

              <el-button type="primary" @click="submitForm('ruleForm')">确认收货人地址</el-button>
              <el-button @click="bindCancel()">取消</el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div> 
</template>

<script>
  import { mapActions, mapState, mapMutations } from 'vuex';
  import API from '@/api/billing/billing';
  export default {
    props: {
      pFrom: {//1表示门店自提无收货地址，2表示门店配送无地址
        type: Number,
        default: 0
      }
    },
    components: {
    },
    created: function() {
    },
    data() {
      //校验姓名
      function validateName(rule, value, callback) {
        //排除中文括号
        var notZhSign = !(/^[^（）]+$/.test(value));
        //非汉字英文和数字空格
        var notEnNumCn = !(/^[\u4E00-\u9FFF|0-9|a-z|A-Z|（|）|\s]+$/.test(value));
        if (notZhSign) {
          callback(new Error('请输入正确的收货人姓名'));
        } else if (notEnNumCn) {
          callback(new Error('请输入正确的收货人姓名'));
        } else {
          callback();
        }
      }

      //详细地址校验
      function validateDetailAddress(rule, value, callback) {
        ////英文、数字、汉字、井号（#）、大中小括弧、逗号、句号、分隔符（|）、点、中横线
        var notAddress = !(/^[\u4E00-\u9FFF|0-9\-|a-z|A-Z|\s|#\{\}\(\)\[\],\.。，（）｛｝【】\|]+$/.test(value));
        if (notAddress) {
          callback(new Error('输入格式不正确'));
        } else {
          callback();
        }
      } 

      //校验手机号 
      function validatePhone(rule, value, callback){
        var checkPhone = !(/^(1[3|5|4|6|7|8|9]\d{1}[*|\d]{4}\d{4})$/.test(value));
        if (checkPhone) {
          callback(new Error('请输入正确的手机号码'));
        } else {
          callback();
        }
      }

      //校验固定电话 
      function validateCall(rule, value, callback){
        //固定电话校验  暂时先放在这，以后用这个，需要验证规则
          /*规则：
          ^(\([0-9]{3,4}\))?([0-9]{7,8})(-[0-9]{1,4})?|
          ([0-9]{2,4}-)?([0-9]{3,4}-)?([0-9]{7,8})(-[0-9])?$
          区号3到4位，第一位为0；
          中间7到8位，0-9的数字；
          分机号1到4位，0-9的数字。
          举例为：010-12345678、0912-1234567、(010)-12345678、(0912)1234567、(010)12345678、(0912)-1234567、01012345678、09121234567、
          010-12345678-1 010-12345678-12 010-12345678-123 010-12345678-1234*/
        var chenkCall = !(/^0[0-9]{6,11}$|^(\(0[0-9]{2,3}\))?([0-9]{7,8})(-[0-9]{1,4})?$|^([0-9]{2,4}-)?(0[0-9]{2,3}-)?([0-9]{7,8})(-[0-9]{1,4})?$/.test(value));
        if(value.length == 0) {
          callback();
          return true;
        }
        if (chenkCall) {
          callback(new Error('请输入正确的固定电话'));
        } else {
          callback();
        }
      }

      //校验邮箱 
      function validateEmall(rule, value, callback){
        var notEmail = !( /^[a-zA-Z0-9_]+[a-zA-Z0-9_\-\.]+[a-zA-Z0-9_]+@[\w-]+\.[\w-]+$|^[a-zA-Z0-9_]+[a-zA-Z0-9_\-\.]+[a-zA-Z0-9_]+@[\w-]+\.[\w-]+\.[\w-]+$/.test(value));
        if(value.length == 0) {
          callback();
          return true;
        }
        if (notEmail) {
          callback(new Error('请输入正确的邮箱'));
        } else {
          callback();
        }
      }
      return {
        addressIsError: false,
        ruleForm: {
          name: '',
          address: '',
          detailAddress: '',
          cityobj:{   //四级区域
            curstyle: {
            },
            "aeracode1":{
                "label":"",
                "code":"",
                "disable":false   
              },
              "aeracode2":{
                  "label":"",
                  "code":"",
                  "disable":false
              },
              "aeracode3":{
                  "label":"",
                  "code":"",
                  "disable":false
              },
              "aeracode4":{
                  "label":"",
                  "code":"",
                  "disable":false
              }
          }, 
          phone: '',
          call: '',
          email: ''
        },
        rules: {
          name: [
            { required: true, message: '请输入收货人姓名', trigger: 'blur' },
            {  max: 30, message: '收货人姓名最多30个字符!', trigger: 'blur' },
            { validator: validateName, trigger: 'blur' }
          ],
          address: [
            { required: true, message: '请选择所在地', trigger: 'blur' }
          ],
          detailAddress:  [
            { required: true, message: '请填写详细地址', trigger: 'blur' },
            { max: 80, message: '详细地址最多输入80个字符', trigger: 'blur' },
            { validator: validateDetailAddress, trigger: 'blur'}
          ],
          phone:  [
            { required: true, message: '请输入手机号码', trigger: 'blur' },
            { validator: validatePhone, trigger: 'blur' }
          ],
          call:  [
            { validator: validateCall, trigger: 'blur' }
          ],
          email: [
            { validator: validateEmall, trigger: 'blur' }
          ]
          
        }
      };
    },
    computed:{
    },
    methods: {
      ...mapMutations([
        'IS_OPERATE_BILLING_PAGE'
      ]),
       ...mapActions([
        'initOrder', 
      ]),
      bindChangeCity(address) {
        this.ruleForm.address = address;
        var billingAddress = this.$refs.billingAddress;
        var content = billingAddress.querySelector('.el-form-item__content');
        var error = billingAddress.querySelector('.el-form-item__error');
        this.dealAddressBorderColor();
        if(content && error) {
          content.removeChild(error);
        }
        
      },
     submitForm(formName) {
       var that = this;

        that.$refs[formName].validate((valid) => {
          //处理地区错误的边框颜色的变化
          that.dealAddressBorderColor();
          if (valid) {
            var cityobj = that.ruleForm.address;
            var param = JSON.parse(JSON.stringify(that.$store.state.billingUsedParam));
              if(that.pFrom){
                param.sellerBillId = that.$store.state.billingInitData.sellerBillId;
              }
              if(that.pFrom == 2) {
                param.deliveryType = 9;
              }
              param.receiveName = that.ruleForm.name,
              param.detailAddress = that.ruleForm.detailAddress,
              param.receiveMobile = that.ruleForm.phone,
              param.stateCode = cityobj[0].code,
              param.cityCode = cityobj[1].code,
              param.countyCode = cityobj[2].code,
              param.townCode = cityobj[3].code,
              param.stateName = cityobj[0].label,
              param.cityName = cityobj[1].label,
              param.countyName = cityobj[2].label,
              param.townName = cityobj[3].label
            //新增地址接口
            that.callAddMemberAddress(param);
          } else {
            return false;
          }
        });
      },
      //param调用保存地址的入参；noSupport为true表示不支持门店配送，false表示支持
      callAddMemberAddress(param, noSupport) {
        let that = this;
        let cityobj = that.ruleForm.address;
        API.addMemberAddress(param).then((data) => {
          that.IS_OPERATE_BILLING_PAGE(true);
          if(data.success) {
            if(data.response) {
              let cityData = {
                townCode: cityobj[3].code
              };
              if(!that.pFrom) {
                that.initOrder(that);
              }

              if(that.pFrom == 2) {//2表示门店配送无地址
                cityData.used = (noSupport ? false : true);
              }
              that.$emit('bind-confirm-add-address',cityData);

            }
          }else {
            if(data.respCode == 'error.saveAddress.fail.storeDelivery') {
              this.$confirm('该收获地址不支持门店配送，是否继续？', '提示', {
                  confirmButtonText: '继续',
                  cancelButtonText: '取消',
                  type: 'warning',
                  customClass: 'deal-billing-message-box',
                  showClose: false
                }).then(() => {
                  delete  param.deliveryType;
                  that.callAddMemberAddress(param, true);
                }).catch(() => {
                });
              return false;
            }
            that.$message({
              showClose: true,
              message: data.respMsg + '（' + data.linkId + '）',
              type: 'warning'
            });
          }
          
        }).then(function() {
        })
      },
      bindCancel(formName) {
        this.$emit('bind-cancel-add-address');
      },

      dealAddressBorderColor() {
         this.addressIsError = !this.ruleForm.address ? true : false;
      }
    }
  };
</script>

<style lang="stylus">

.form-address  {
  .el-input, .billing-container .billing-info .el-radio {
    margin-bottom: 0;
  }
  .el-input,  .el-radio {
    margin-bottom: 0;
  }
  .cityinput {
    line-height: 28px;
    height: 28px;
    box-sizing: border-box;
  }
  .g-city-border-color {
    border-color: #f56c6c !important 
  }
  .gctSelect a.cur, .citycolor,.gctBox span:hover {
    color: #409eff;
  }
  .cityinput .cityinputarrow {
    top: 7px;
  }
  .el-form-item.is-success .el-input__inner, .el-form-item.is-success .el-input__inner:focus, .el-form-item.is-success .el-textarea__inner, .el-form-item.is-success .el-textarea__inner:focus {
    border-color: #dcdfe6;
  }
}

</style>

<style lang="stylus"  scoped>
  .add-address {
    .text-tip {
      line-height: 32px;
      float: left;
    }
    .footer {
      text-align: center;
      margin-left: -220px;
    }
    a {
      text-decoration: none;
    }
  }
  .form-address {
    margin-left: 70px;
    .tip {
      font-size: 12px;
      line-height: 32px;
      color: #a5a5a5;
    }
  }
</style>

