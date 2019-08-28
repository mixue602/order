<template>
  <div class="note-box">
    <div class="preferential-box">
      <div class="preferential-tip">备注：</div>
      
      <div class="preferential-content">
        
        <div v-if="pRemark&&(pRemark.content || pRemark.ticketCode || pRemark.intermediaryId)"  class="selected-show" @click="dialogVisible = true">
          <span class="note-list" v-if="pRemark.ticketCode">入场券：{{pRemark.ticketCode}}</span>
          <span class="note-list" v-if="pRemark.content">备注：{{pRemark.content}}</span>
          <span class="note-list" v-if="pRemark.intermediaryId">带单导购员：{{pRemark.intermediaryId}}</span>
        </div>
        <span v-else class="click-btn" @click="dialogVisible = true"><i class="el-icon-circle-plus"></i></span>
      </div>
    </div>
    <el-dialog 
      :visible.sync="dialogVisible"
      width="800px"
      center
      class="billing-dialog billing-note-dialog"
      :append-to-body="true"
      :before-close="bindCancel"
      >
      <div class="write-note">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
          <el-form-item label="入场券：" prop="ticket">
            <el-input v-model="ruleForm.ticket" placeholder="30字内" maxlength="30"></el-input>
          </el-form-item>
          <el-form-item label="备注：" prop="note">
            <el-input type="textarea" v-model.trim="ruleForm.note"  placeholder="50字内" maxlength="50"></el-input>
          </el-form-item>
          <div class="label-box">
            <span class="tip">标签：</span>
            <div class="label-content clearfloat">
              <span class="label-list" :class="{ active: item.isActive }" v-for="item in labels" :key="item.id" @mouseover="addClass(item)" @mouseout="removeClass(item)" @click="copyLabel(item)">{{item.name}}</span>
            </div>
          </div>
          <el-form-item label="带单导购员：" prop="intermediaryId" v-if="isIntermediaryShop || pRemark.intermediaryId">
            <el-input v-model="ruleForm.intermediaryId" placeholder="输入8位数字带单导购员编号" maxlength="8"></el-input>
          </el-form-item>

          <el-form-item class="dialog-footer">
            <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
            <el-button @click="bindCancel">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
     
    </el-dialog>
  </div> 
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex';

import API from '@/api/billing/billing';

  
  export default {
    props: {
      pRemark:{
        type:Object,
        default:function(){
          return {
            ticketCode:'',
            content:'',
            intermediaryId: ''
          }
        }
      },
      isIntermediaryShop: Boolean
    },
    created: function() {
     
    },
    data() {
      var that = this;
      var validateTicket = (rule, value, callback) => {
        var re = /^[A-Za-z0-9]*$/;
        if(value==undefined||value=='undefined') {
          value = ''
          callback();
        }
        if (!re.test(value)) {
           callback(new Error('请输入字母或数字'));
        } else {
          callback();
        }
      };

       var validateIntermediaryId = (rule, value, callback) => {
        var re = /^\d{8}$/;
        if(!value) {
          value = ''
          callback();
        }
        value = value.trim()
        if (!re.test(value)) {
           callback(new Error('请输入8位数字的带单导购员编号'));
        } else {
          callback();
        }
      };

  //     var validateNote= (rule, value, callback) => {
  //       var len=0,
  //       　  strlen = 0,//累计字符串长度
  //           newValue='';//100个字符内的字符串
           
  //       if(value==undefined || value=='undefined'){
  //          value='';
  //          callback();
  //       }
      
  //       for(var i = 0,len = value.length; i<len; i++){
  //         if(strlen<98){
  //           if(value.charCodeAt(i)>255){ //如果是汉字，则字符串长度加2
  // 　　　　　　　　strlen += 2;
  // 　　　　　　}else{
  // 　　　　　　　　strlen++;
  //           }
  //           newValue += value.charAt(i);
  //           callback();
  //         }else{
  //           that.ruleForm.note = newValue;
  //           callback(new Error('请输入50个字内'));
  //           break;
  //         }
  // 　　　}
  //     };

      return {
        dialogVisible: false,
        labels: [
          {name:'节能补贴',isActive:false},
          {name:'外联单位',isActive:false},
          {name:'领导同意',isActive:false},
          {name:'参加套购',isActive:false},
          {name:'累购送积分',isActive:false},
          {name:'以旧换新',isActive:false},
          {name:'暂存赠品',isActive:false}
        ],
        ruleForm: {
          ticket: this.pRemark.ticketCode,
          note: this.pRemark.content,
          intermediaryId: this.pRemark.intermediaryId
        },
        rules: {
          ticket: [
            { validator: validateTicket, trigger: 'change'},
          ],
          note:[
            // { validator: validateNote, trigger: 'change'},
          ],
          intermediaryId: [
            { validator: validateIntermediaryId, trigger: 'blur'},
          ],
        }
      };
    },
    computed:{
      ...mapState([
        'billingEdit',
        'eidtNeedParam'
      ])
    },
    watch:{
      pRemark: {
        handler: function () {
          this.ruleForm = {
            ticket: this.pRemark.ticketCode,
            note: this.pRemark.content,
            intermediaryId: this.pRemark.intermediaryId
          }
        },
        deep: true
      }
    },
    methods: {
      ...mapActions([
        'initOrder',
        'initLloadEditSellerBill'
      ]),
      ...mapMutations([
      'IS_OPERATE_BILLING_PAGE'
      ]),
      addClass(item){
          item.isActive=true;
      },
      removeClass(item){
        item.isActive=false;
      },
      copyLabel(labelName){
         var that = this,
            formContent =  that.ruleForm.note||'';

            formContent+=','+labelName.name;

         if(formContent.charAt(0)==','){
            that.ruleForm.note= formContent.substring(1,51);
         }else{
            that.ruleForm.note= formContent.substring(0,50);
         }
      },
      submitForm(ruleForm) {
        var that = this;
        this.$refs[ruleForm].validate((valid) => {
        
          if (valid) {
            var param = JSON.parse(JSON.stringify(this.$store.state.billingUsedParam));
                param.couponId = that.ruleForm.ticket;
                param.remarks = that.ruleForm.note;
                param.intermediaryId = that.ruleForm.intermediaryId ? (that.ruleForm.intermediaryId.trim()) : '';
                
            if(this.billingEdit) {
              param.sellerBillId = this.eidtNeedParam.sellerBillId;
            }

            //编辑备注接口
            API.saveRemarks(param).then((data) => {
              if(data.success) {
                if(!that.$store.state.billingEdit){ //开单页 调用大load 接口
                     
                      that.initOrder(that);
                }else{                           //调用编辑导购单所有信息接口
                    
                    that.initLloadEditSellerBill(that);
                }
                that.dialogVisible = false;
                that.IS_OPERATE_BILLING_PAGE(true);
              }else {
                that.$message({
                  showClose: true,
                  message: data.respMsg + '（' + data.linkId + '）',
                  type: 'warning'
                });
              }
            });
            
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      bindCancel(){
        this.dialogVisible = false;
        this.ruleForm = {
          ticket: this.pRemark.ticketCode,
          note: this.pRemark.content,
          intermediaryId: this.pRemark.intermediaryId
        }
      }
    }
  };
</script>

<style lang="stylus">
.billing-note-dialog {

    .el-form-item.is-success .el-input__inner, .el-form-item.is-success .el-input__inner:focus, .el-form-item.is-success .el-textarea__inner, .el-form-item.is-success .el-textarea__inner:focus {
      border-color: #dcdfe6;
    }

     .el-input,  .el-radio {
      margin-bottom: 0;
    }
    .dialog-footer {
      margin-bottom: 0;
    }
}
</style>

<style lang="stylus"  scoped>
  $b-c-g = #ccc;
  .note-box {
    .write-note {
      padding-top: 10px;
      margin-right: 20px;
    }
    
  }
  .label-box {
    padding-left: 32px;
    line-height: 20px;
    position: relative;
    .tip {
      position: absolute;
      left: 46px;
      top: 0;
    }
    .label-content {
      padding-left: 68px;
    }
    .label-list {
      border: 1px solid $b-c-g;
      float: left;
      margin-right: 10px;
      margin-bottom: 10px;
      font-size: 12px;           
      padding: 0 5px;
      cursor:pointer;
      &.active {
        border-color:#409EFF;
      }
    }
  }
  .dialog-footer {
    margin-top: 20px;
    margin-left: -60px;
    text-align: center;
  }

  .billing-container .preferential-box .preferential-content .selected-show .note-list {
    display: block;
    line-height: 26px;
    &:first-child {
      padding-top: 7px;
    }
  }
</style>

