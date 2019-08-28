<template>
<div class="invoice">
    <el-form :model="invoiceInfo" :rules="rules" ref="invoiceInfo" label-width="100px" >
        <el-form-item label="抬头内容：" prop="head" class="mt15">
            <el-input v-model.trim="invoiceInfo.head" placeholder="请输入单位名称" style="width:400px;" @blur="getData"  maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="单位税号："  prop="taxpayerNo" class="mt15">
            <el-input v-model.trim="invoiceInfo.taxpayerNo" placeholder="请输入单位税号" style="width:400px;" @blur="getData"></el-input>
        </el-form-item>
        <el-form-item label="收票手机：" prop="mobile" class="mt15">
            <el-input v-model.trim="invoiceInfo.mobile" placeholder="请输入手机号码" style="width:400px;" @blur="getData"></el-input>
        </el-form-item>
        <el-form-item label="收票邮箱：" prop="email" class="mt15">
            <el-input v-model.trim="invoiceInfo.email" placeholder="用于接收电子发票及延保协议邮件" style="width:400px;" @blur="getData"></el-input>
        </el-form-item>
    </el-form>
</div>
</template>
<script>
export default {
  props:{
    invoiceInfoP:{},
  },
  data(){
      //检查抬头内容
     var checkHead = (rule, value, callback) => {
       var that=this;
        if (value=='') {
            that.invoicePersonel.isHeadNull=false;
            return callback(new Error('请输入单位名称'));
        }else if(value=="个人"){
          that.invoicePersonel.isHeadNull=false;
          return callback(new Error('发票抬头不能是个人'));
           
        }else{
          if(value.indexOf(" ")!=-1){
            that.invoicePersonel.isHeadNull=false;
            return callback(new Error('请输入正确的抬头内容'));
          }else{
              that.invoicePersonel.isHeadNull=true;
              return callback();
          }
          
        }
      };
     //检查单位税号
     var checkTaxpayerNo = (rule, value, callback) => {
        var that=this;
        //非数字大写英文字母
	      var notUpenNum=/^[0-9|A-Z]+$/;
	      var checkTax=/^[A-Z0-9]{15}$|^[A-Z0-9]{18}$|^[A-Z0-9]{20}$/;  //验证税号* 15或者18或者20位大写字母、数字组成
        if (value=='') {
          that.invoicePersonel.isTaxpayerNoNull=false;
          callback(new Error('请输入单位税号'));
        }else{
          if(!notUpenNum.test(value)){
            that.invoicePersonel.isTaxpayerNoNull=false;
            callback(new Error('单位税号为数字和大写英文字母'));
          }else if(!checkTax.test(value)){
            that.invoicePersonel.isTaxpayerNoNull=false;
            callback(new Error('单位税号为15位、18位、20位数字和大写英文字母'));
          }else{
            that.invoicePersonel.isTaxpayerNoNull=true;
            callback();
          }
        }
        
      };
      //检查手机号
     var checkmMobile = (rule, value, callback) => {
        var that=this;
        if (value=='') {
          that.invoicePersonel.isMobileNull=false;
          callback(new Error('请输入手机号码'));
        }else{
          var reg=/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
          if(!reg.test(value)){
            that.invoicePersonel.isMobileNull=false;
            callback(new Error('请输入正确的手机号码'));
          }else{
            that.invoicePersonel.isMobileNull=true;
            callback();
          }
        }
      };
      //检查邮箱
      var checkEmail = (rule, value, callback) => {
        var that=this;
        if (value=='') {
          that.invoicePersonel.isEmailNull=true;
          callback();
        }else{
          var reg=/^[a-zA-Z0-9_]+[a-zA-Z0-9_\-\.]+[a-zA-Z0-9_]+@[\w-]+\.[\w-]+$|^[a-zA-Z0-9_]+[a-zA-Z0-9_\-\.]+[a-zA-Z0-9_]+@[\w-]+\.[\w-]+\.[\w-]+$/;
          if(!reg.test(value)){
            that.invoicePersonel.isEmailNull=false;
            callback(new Error('请输入正确的邮箱地址'));
          }else{
            that.invoicePersonel.isEmailNull=true;
             callback();
          }
        }
      }
    return {
      rules:{
        head:[{required: true, validator: checkHead,  trigger: 'blur'}],
        taxpayerNo:[{required: true,validator:checkTaxpayerNo,trigger: 'blur'}],
        mobile:[{ required: true ,validator:checkmMobile,trigger:'blur'}],
        email:[{validator:checkEmail,trigger:'blur'}],
      },
     invoiceInfo: JSON.parse(JSON.stringify(this.invoiceInfoP)),
      invoicePersonel:{
        invoice:{
          head:'',
          taxpayerNo:'',
          mobile:'',
          email:'',
          headType:'1',
        },
        isHeadNull:true,
        isTaxpayerNoNull:true,
        isMobileNull:true,
        isEmailNull:true,
      }
    }
  },
  created(){

  },
  watch: {
      invoiceInfo: {
        handler: function () {
          this.invoiceInfo = JSON.parse(JSON.stringify(this.invoiceInfo));
        }
      },
    },
  methods:{
      getData(){
         this.invoicePersonel.invoice=this.invoiceInfo
         this.$emit('getInvoice',this.invoicePersonel)
      }
  }
}
</script>

