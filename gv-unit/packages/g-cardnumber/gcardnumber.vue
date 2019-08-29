<template>
    <div>
     <input type="text" ref="input" :value="value" @input="doThis" style="display:none"/>
     <el-form   :model="form" ref="form" :rules="rules" :inline="true"  label-width="150px"  size="mini" >
      <el-form-item label="会员卡号或手机号：" v-bind:class="{iserror:cardNumError}" prop="memberCardNo">
          <el-col :span="24">
              <el-input v-model.trim="form.memberCardNo"  placeholder="请输入会员卡号或手机号" style="width:176px;float:left;"  @keyup.enter.native="cardNumberEvent"><i slot="suffix" class="el-input__icon icon iconfont" @click="cardNumberEvent">&#xe61c;</i></el-input>
               <el-input :value="form.cardName" style="width:120px;float:left;" readonly="true" class="bg"></el-input>
              <div class="el-form-item__error" v-if="cardNumError">{{errorCardNum}}</div>
          </el-col>
      </el-form-item>
      </el-form>
    </div>
</template>

<script>
  import axios from 'axios'
  export default {
    name: 'g-cardnumber',
   
    data () {

      var validateMemberCardNo = (rule, value, callback) => {
       
          var newRegex = /^[0-9a-zA-Z]*$/g;
          if (!newRegex.test(value)) {
              callback(new Error('会员卡号只能是数字和字母'));
              this.cardNumError=false;
              this.memberCardNoPamas="error";
              this.form.cardName="";
              
          }else if (value ==''){
              this.cardNumError=false;
              if(this.memberCardNoPamas=="error"){
                this.memberCardNoPamas="";
              }
          }else{
             
              callback();
          }
          this.doThis();
      };
      return {
        form: {
          memberCardNo:"",
          cardName:'',
        },
        memberCardNoPamas:"",
        cardNumError:"",
        rules: {//校验规则
           
            memberCardNo:[//会员卡号或手机号
                {validator: validateMemberCardNo, trigger: 'change' }
            ]
        },
      }
    },
    created(){
     let that=this;
     // 配置环境变量
     var  curhost = location.host;
     that.url = "//"+curhost+"/pcorderview/queryMemberInfo";
    },
   watch: {
       'value':{
           handler(a,b){
              let that=this;
             // console.log(a);
              if(!a.memberCardNo){
                that.form.memberCardNo="";
                that.memberCardNoPamas="";
                that.form.cardName="";
              }
           },
         deep: true 
       } 
   },
    methods: {
      //查询会员卡 手机号
      cardNumberEvent(){
          var that=this;
          var reg=/^[A-Za-z0-9]+$/; //字母数字正则
        if( !reg.test(that.form.memberCardNo)){
            that.form.cardName="";
            return false
        }else{
            var memberCardNo=that.form.memberCardNo;
            axios.post(that.url,{memberCardNo}).then(function(data){
              var data = data.data;
            if((data.response && that.form.memberCardNo==data.response.memberCardNo) || (data.response && that.form.memberCardNo==data.response.memberPhone)){
                that.memberCardNoPamas=data.response.memberCardNo; //点击查询按钮的时候 需要统一传改接口里面的会员卡号
               
                if(data.response.memberName){  //如果获取的会员接口 没有会员姓名就取会员卡号
                    that.form.cardName=data.response.memberName;
                }else{
                    that.form.cardName=data.response.memberCardNo;
                }
                that.cardNumError=false;
            }else{

              
                that.errorCardNum="未查询到会员卡信息";
                that.cardNumError=true;
                that.form.cardName="";
                that.memberCardNoPamas="error";
                
            }
             that.doThis();
        })
        }
      },
      doThis() {
        let  that = this;
        //that.doThis()
        this.$emit('input', {memberCardNoPamas:that.memberCardNoPamas,memberCardNo:that.form.memberCardNo});
      }
    },
    props: {
       
        value: {
          required: true
        }
    }
  }
</script>
