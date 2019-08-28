<template>
<el-container>
    <el-header class="header">会员购买记录</el-header>
    <el-main>
      
      <div class="modify-record">
          <el-form :model="ruleForm"  ref="ruleForm" label-width="100px" class="ruleForm" :rules="rules">
            <el-row>
              <el-col :span="12" class="input-box">
                <el-form-item label="会员手机号："  prop="phone">
                  <el-input v-model="ruleForm.phone" placeholder="请输入会员手机号" @blur="bindBlur(ruleForm.phone,'1')" :disabled="phoneDisabled"></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="12" class="input-box">
                <el-form-item label="会员卡号："  prop="cardNumber">
                  <el-input v-model="ruleForm.cardNumber" placeholder="请输入会员卡号" @blur="bindBlur(ruleForm.cardNumber,'2')" :disabled="cardNumberDisabled"></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="12" class="input-box">
                <el-form-item label="会员账号："  prop="account">
                  <el-input v-model="ruleForm.account" placeholder="请输入会员账号" @blur="bindBlur(ruleForm.account,'3')" :disabled="accountDisabled"></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="12" class="input-box">
                <el-form-item label="会员编码："  prop="coding">
                  <el-input v-model="ruleForm.coding" placeholder="请输入会员编码" @blur="bindBlur(ruleForm.coding,'4')" :disabled="codingDisabled"></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="12" class="input-box">
                <el-form-item label="购买日期："  prop="buyDate">
                  <el-date-picker
                      v-model="ruleForm.buyDate"
                      type="daterange"
                      range-separator="至"
                      start-placeholder="选择开始日期"
                      end-placeholder="选择结束日期"
                      :picker-options="ruleForm.pickerOptions"
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd"
                      >
                    </el-date-picker>
                  </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="24" class="center searchbtnbox">
                <el-form-item>
                  <el-button @click="resetForm" class="inquiry-btn inquiry-reset">重置</el-button>
                  <el-button type="primary" class="inquiry-btn inquiry-search" @click="submitForm">查询</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>

          <div class="tab-box" v-if="isShowTab">

            <el-table
              :data="dataList"
              border
              empty-text="共查到0条记录"
              style="width: 100%"
              class="center"
            >
              <el-table-column
                prop="submittedDateStr"
                label="购买日期"
                >
              </el-table-column>
              <el-table-column
                prop="memberName"
                label="会员姓名"
                >
                <template slot-scope="scope">
                  <span v-if="!scope.row.trueName">{{scope.row.memberName}}</span>
                  <span v-if="scope.row.trueName">{{scope.row.trueName}}</span>
                  <el-button class="view-btn" type="primary" size="mini" @click="bindShowTrueVal(scope.row)" v-if="scope.row.isShowViewNameBtn">查看</el-button>
                </template>
              </el-table-column>
              <el-table-column
                prop="storeName"
                label="销售门店"
                >
              </el-table-column>

              <el-table-column
                prop="categoryName"
                label="商品品类"
                >
              </el-table-column>
              
              <el-table-column
                prop="twoCategoryName"
                label="二级分类"
                >
              </el-table-column>
              <el-table-column
                prop="bandName"
                label="品牌名称"
                >
              </el-table-column>
              <el-table-column
                prop="skuName"
                label="商品名称"
                >
              </el-table-column>
              <el-table-column
                prop="quentity"
                label="数量"
                >
              </el-table-column>
              <el-table-column
                prop="totalAmount"
                label="销售金额"
                >
              </el-table-column>
              <el-table-column
                prop="dueAmount"
                label="实付金额"
                >
              </el-table-column>
              <el-table-column
                prop="shippingGroupId"
                label="配送单号"
                >
              </el-table-column>

              <el-table-column
                prop="shipStateDesc"
                label="配送单状态"
                >
              </el-table-column>
              <el-table-column
                prop="salesChannelDesc"
                label="来源"
                >
              </el-table-column>
            </el-table>
            <div class="pager-box" v-if="dataList && dataList.length>0 && pager.totalSize > 15">
              <el-pagination
                @current-change="handleCurrentChange"
                background
                layout="total, prev, pager, next"
                :current-page="pager.currentPage"
                :page-sizes="[10,20,50]"
                :page-size="pager.pageSize"
                :total="pager.totalSize">
              </el-pagination>
            </div>
          </div>

      </div>
    </el-main>
  </el-container>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex';
import { Loading } from "element-ui"
import API from '@/api/api_record/mPurchaseRecords';

export default {
  created() {
    this.setInitDate();
  },
  data(){
    return {
        ruleForm: {
          phone: '',
          cardNumber: '',
          account: '',
          coding: '',
          buyDate: null,
        },
        rules: {
        },
        //以下四个只要失去焦点一个对应的有值，则其余的不能编辑
        phoneDisabled: false,
        cardNumberDisabled: false,
        accountDisabled: false,
        codingDisabled: false,
        pickerOptions: {

        },
        isShowTab: false,//是否显示表格
        dataList: [],
        pager: {},//分页
        storeParams: {}//存储查询数据的入参，主要是用于分页

    }
  },
  computed: {
    ...mapState([
      'LOGINDATA'
    ]),
  },
  
  methods: {
    
    //手机号、卡号、账号、编码只要有一项有值，失去焦点时，其它几项则置灰
    bindBlur(val,num) {
      
      val = (val ? val.trim() : '');
      let ruleForm = this.ruleForm,
          phoneDisabled = true,
          cardNumberDisabled  = true,
          accountDisabled = true,
          codingDisabled = true;
      if(val) {
        if(num == 1) {
          phoneDisabled  = false; 
        }
        if(num == 2) {
          cardNumberDisabled  = false; 
        }
        if(num == 3) {
          accountDisabled  = false; 
        }
        if(num == 4) {
          codingDisabled  = false; 
        }
       
      }else{
        
        phoneDisabled = false;
        cardNumberDisabled = false;
        accountDisabled = false;
        codingDisabled = false;
      } 
      this.phoneDisabled = phoneDisabled;
      this.cardNumberDisabled = cardNumberDisabled;
      this.accountDisabled = accountDisabled;
      this.codingDisabled = codingDisabled;
    },

    //查看真实会员姓名
    bindShowTrueVal(item) {
      let _this = this;
      API.queryMemberName({userId:item.memberId}).then(res => {
          if(res.success){
            item.isShowViewNameBtn = false;
            item.trueName = res.response || '';
          }else{
            _this.popBlankMessage(res.errMsg||res.respMsg||'处理异常');
          }
          
      })
    },

    //处理分页
    handleCurrentChange(val) {
      this.storeParams.currentPage = val;
      this.queryData(this.storeParams);
    },

    //重置
    resetForm() {
      this.$refs.ruleForm.resetFields();
      this.setInitDate();
      this.isShowTab = false;
      this.dataList = [];
      this.pager = {};
      this.bindBlur();
      this.storeParams = {};
    },
    
    //查询事件
    submitForm() {
        let phone = this.ruleForm.phone = this.ruleForm.phone.trim(),
            cardNumber = this.ruleForm.cardNumber = this.ruleForm.cardNumber.trim(),
            account = this.ruleForm.account = this.ruleForm.account.trim(),
            coding = this.ruleForm.coding = this.ruleForm.coding.trim(),
            buyDate = this.ruleForm.buyDate;
        if(phone.length) {
          let checkPhone = /^\d{11}$/.test(this.ruleForm.phone);
          if(!checkPhone) {
            this.popBlankMessage('请输入正确的手机号')
            return false;
          }
        }

        if(cardNumber.length) {
          let checkCardNumber = /^[\dA-Za-z]*$/.test(this.ruleForm.cardNumber);
          if(!checkCardNumber) {
            this.popBlankMessage('请输入正确的会员卡号')
            return false; 
          }
        }

        if(account.length) {
          let checkAccount = /^[\u4e00-\u9fa5\w.]*$/.test(this.ruleForm.account);
          if(!checkAccount) {
            this.popBlankMessage('请输入正确的会员账号')
            return false;
          }
        }
        if(coding.length) {
          let checkCoding = /^[\dA-Za-z]*$/.test(this.ruleForm.coding);
          if(!checkCoding) {
            this.popBlankMessage('请输入正确的会员编码')
            return false;
          }
          
        }
        if(phone.length || cardNumber.length || account.length || coding.length) {
          
          if(!buyDate) {
            this.popBlankMessage('请选择购买日期')
            return false;
          }

          let params = {
            mobilePhone: phone,
            cardId: cardNumber,
            userName: account,
            userId: coding,
            submitStartDate: this.ruleForm.buyDate[0] + ' 00:00:00',
            submitEndDate: this.ruleForm.buyDate[1] + ' 23:59:59',
            pageSize: 15,
            currentPage: 1
          };
          
          this.storeParams = params;
          this.queryData(params);
        }else {
          this.popBlankMessage('会员手机号、会员卡号、会员账号、会员编码四项里面需要选一项，请选择后进行查询')
        }
    
    },
    
    //请求查询接口
    queryData(params) {
      let _this = this;
      this.isShowTab = true;
      
      let loadingInstance = Loading.service({
          text: '加载中',
          target: document.querySelector(".tab-box")
      })
      API.queryMemberBuyRecordList(params).then(res => {
          loadingInstance.close()
          if(res.success){
            _this.dealQueryData(res.response);
          }else{
            _this.popBlankMessage(res.errMsg||res.respMsg||'处理异常');
            _this.dataList = [];
            _this.pager = {};
          }
          
      })


    },

     //处理查询结果数据
    dealQueryData(data) {
      let dataList = [];
      if(data && data.list && data.list.length) {
        dataList = data.list;
        this.pager = data.pager;
      }else {
        
        this.pager = {};
      }

      if(this.LOGINDATA.member_record_check_name) {
        dataList.forEach(item => {
          item.isShowViewNameBtn = true;
          item.trueName = '';
        })
      }
      this.dataList = dataList;

    },

    //设置初始日期
    setInitDate() {
      this.ruleForm.buyDate = [];
      let startDate = new Date(),
          endDate,
          date = new Date(), 
          y = date.getFullYear(), 
          m = date.getMonth();
      startDate.setDate(1);
      endDate = new Date(y, m + 1, 0);

      this.ruleForm.buyDate.push(this.dateFormatter(startDate, false));
      this.ruleForm.buyDate.push(this.dateFormatter(endDate, false));

    },
    dateFormatter(str){//默认返回yyyy-MM-dd HH-mm-ss
        var hasTime = arguments[1] != false ? true : false;//可传第二个参数false，返回yyyy-MM-dd
        var d = new Date(str);
        var year = d.getFullYear();
        var month = (d.getMonth()+1)<10 ? '0'+(d.getMonth()+1) : (d.getMonth()+1);
        var day = d.getDate()<10 ? '0'+d.getDate() : d.getDate();
        var hour = d.getHours()<10 ? '0'+d.getHours() : d.getHours();
        var minute = d.getMinutes()<10 ? '0'+d.getMinutes() : d.getMinutes();
        var second = d.getSeconds()<10 ? '0'+d.getSeconds() : d.getSeconds();
        if(hasTime){
            return [year, month, day].join('-') + " " + [hour, minute, second].join(':');
        }else{
            return [year, month, day].join('-');
        }
    },

    popBlankMessage(message){
      this.$message({
        message:message,
        type: 'warning'
      })
    },
  },

  watch:{
  },
}
</script>

<style>
.modify-record .el-input__inner {
    height: 32px;
    line-height: 32px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    box-sizing: border-box;
    vertical-align: middle;
}
.modify-record .el-form-item {
  /* margin-bottom: 10px; */
}
.modify-record .departmentLists {
  max-width: 100%;
}
.modify-record .ruleForm .el-button {
   width: 100px;
   padding: 8px 15px;
}
.modify-record .view-btn {
   padding: 4px 6px;
   margin-left:5px;
}
.modify-record .el-form-item__label, .modify-record  .el-form-item__content {
  line-height: 32px;
}
.modify-record  .el-range-editor.el-input__inner {
  padding: 0 10px;
}
.modify-record .el-date-editor.el-input, .modify-record .el-date-editor.el-input__inner {
  width: 100%;
}
.modify-record .el-table th,.modify-record  .el-table td {
  text-align: center
}
.modify-record .el-input__icon {
  line-height: 32px;
}
</style>

<style scoped>
.el-container {
  overflow: visible;
  margin: 20px;
  border: 1px solid #ccc;
}
.center {
  text-align: center;
}
.header {
  position: relative;
  background: #409eff;
  font-size: 14px;
  height: 36px !important;
  line-height: 36px;
  color: #fff;
}

.goBack{position: absolute;  top: 4px;  right: 20px;cursor: pointer;}
.pager-box {
  background: #fff;
  text-align: right;
  margin-top: 20px;
}


</style>


