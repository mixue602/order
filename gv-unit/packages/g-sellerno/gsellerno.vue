<template>
    <div>
     <input type="text" ref="input" :value="value" @input="doThis" style="display:none"/>
       <el-form :inline="true"  ref="form" :rules="rules" :model="form" label-width="150px" size="mini">
       <el-form-item label="导购员编号：" prop="sellerNo" v-bind:class="{iserror:sellerNoisError}" >
            <el-col :span="24">
                <el-input placeholder="请输入导购员编号" :disabled="disabledInput" style="width:176px;float:left;" v-model.trim="form.sellerNo" size="mini" @keyup.enter.native="sellerNofn" class="memberCar_input"><i slot="suffix" class="el-input__icon icon iconfont"  @click="sellerNofn">&#xe61c;</i></el-input>
                <el-input v-model="form.sellername" disabled style="width:120px;float:left;"></el-input>
            </el-col>
            <div class="el-form-item__error" v-if="sellerNoisError">未查询到导购员信息</div>
        </el-form-item>
       </el-form>
    </div>
</template>

<script>
  import axios from 'axios'
  export default {
    name: 'g-sellerno',
   
    data () {
     
     var validatesellerNo = (rule, value, callback) => {
        // this.sellerNoisError=false;

         var newRegex = /^[0-9a-zA-Z]*$/g;
         if (!newRegex.test(value)) {                   
             this.sellerNoError=false;//导购员编号格式错误
             callback(new Error('填写信息错误，请输入数字或字母'));
             this.form.guiderCode='error';
             this.form.sellername='';
             
         } else if (value ==''){
             this.sellerNoError=true;
             if(this.form.guiderCode=="error"){
               this.form.guiderCode="";
             }
         }else{
             if(this.isseller){
                 this.sellerNoisError=true;
                 this.isseller =false;
             }else{
                 this.sellerNoisError=false;
             }
             this.sellerNoError=true;
             callback();
         }
         this.doThis();
     };
      return {
        sellerNoisError:"",
        disabledInput:false,
        form: {
          sellerNo:"",
          sellername:""
        },
        rules: {//校验规则
          sellerNo:[//导购员编号
              { validator: validatesellerNo, trigger: 'change' }
          ]
        },
      }
    },
    created(){
     let that=this;
     // 配置环境变量
     var  curhost = location.host;
     that.url = "//"+curhost+"/pcorderview/queryEmployeeInfoByAccount";
     this.form.sellerNo=this.value.sellerNo;
     this.form.guiderCode=this.value.guiderCode;
     if(this.form.guiderCode){
      this.form.sellername=this.form.guiderCode;
     }
    },
   watch: {
       'value':{
           handler(a,b){
              let that=this;
             // console.log(a);
            if(!a.sellerNo){
              that.form.sellername='';
              that.form.sellerNo = "";
              that.form.guiderCode="";//导购员编号
              that.sellerNoisError=false
            }else{
              if(a.disabled){
                that.disabledInput=a.disabled;
                that.form.sellerNo = a.sellerNo;
                that.form.guiderCode=a.guiderCode;
              }
              
            }
           },
         deep: true 
       } 
   },
    methods: {
      //查询会员卡 手机号
     sellerNofn:function(){//导购员编号
           let _this =this;
           var newRegex = /^[0-9a-zA-Z]*$/g;
           //alert(newRegex.test(value))
           if (!newRegex.test(this.form.sellerNo) || this.form.sellerNo =="") {
               _this.form.sellername='';
               _this.form.sellerNo = "";
               _this.form.guiderCode="";//导购员编号
               return false;

           } else{
              // alert(this.form.sellerNo)
               axios.post(_this.url,{
                   account:_this.form.sellerNo
               }).then(function(data){
                var data = data.data;
                   if(data.success==false){
                        _this.isseller=true;
                       _this.sellerNoisError=true;
                       _this.form.sellername='';
                       _this.form.guiderCode="error";
                   }else{
                       _this.sellerNoisError=false;
                       if(data.response.name=='' || data.response.name==null){
                           _this.form.sellername=data.response.userNo;
                       }else{
                           _this.form.sellername=data.response.name;
                       }  
                       _this.form.guiderCode=data.response.userNo;//点击查询按钮的时候 需要统一传改接口里面的导购员便号
                   }
                     _this.doThis();
               });
           }
       },
      doThis() {
        let  that = this;
        //that.doThis()
        this.$emit('input', {
          guiderCode:that.form.guiderCode,
          sellerNo:that.form.sellerNo
        });
      }
    },
    props: {
       
        value: {
          required: true
        }
    }
  }
</script>
