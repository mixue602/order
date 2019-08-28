<template>
<el-container>
    <el-header class="header">会员姓名修改记录<el-button v-if="isFromMember"  @click='goBack'  size='mini' class='goBack'>返回</el-button></el-header>
    <el-main>
      
      <div class="modify-record">
          <el-form :model="ruleForm"  ref="ruleForm" label-width="100px" class="ruleForm" :rules="rules">
            <el-row>
              <el-col :span="12" class="input-box">
                <el-form-item label="会员手机号："  prop="phone">
                  <el-input v-model="ruleForm.phone" placeholder="请输入会员手机号"></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="12" class="input-box">
                <el-form-item label="员工编码："   prop="employeeId">
                  <el-input v-model="ruleForm.employeeId" placeholder="请输入员工编码"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="20" class="input-box">
                <el-form-item label="部门："  v-show="storeCodes.isdata == 1">
                  <g-branch v-model="storeCodes"></g-branch>
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
                prop="userName"
                label="会员姓名"
                >
                <template slot-scope="scope">
                  <span v-if="!scope.row.trueName">{{scope.row.userName}}</span>
                  <span v-if="scope.row.trueName">{{scope.row.trueName}}</span>
                  <el-button class="view-btn" type="primary" size="mini" @click="bindShowTrueVal(scope.row,'name')" v-if="scope.row.isShowViewNameBtn">查看</el-button>
                </template>
              </el-table-column>

              <el-table-column
                prop="userId"
                label="会员ID"
                >
              </el-table-column>

              <el-table-column
                prop="mobile"
                label="会员手机号"
                width="140px"
                >
                <template slot-scope="scope">
                  <span v-if="!scope.row.truePhone">{{scope.row.mobile}}</span>
                  <span v-if="scope.row.truePhone">{{scope.row.truePhone}}</span>
                  <el-button class="view-btn" type="primary" size="mini" @click="bindShowTrueVal(scope.row,'phone')" v-if="scope.row.isShowViewPhoneBtn">查看</el-button>
                </template>
              </el-table-column>

              <el-table-column
                prop="operateDate"
                label="操作时间"
                >
              </el-table-column>
              <el-table-column
                prop="applyCode"
                label="操作员工编码"
                >
              </el-table-column>
              <el-table-column
                prop="applyName"
                label="操作员工姓名"
                >
              </el-table-column>
              <el-table-column
                prop="areaName"
                label="大区名称"
                >
              </el-table-column>
              
              <el-table-column
                prop="firstDivision"
                label="一级分部名称"
                >
              </el-table-column>
              <el-table-column
                prop="secondDivision"
                label="二级分部名称"
                >
              </el-table-column>
              <el-table-column
                prop="shopName"
                label="销售门店"
                >
              </el-table-column>
              <el-table-column
                prop="source"
                label="来源"
                >
              </el-table-column>

            </el-table>
            <div class="pager-box" v-if="dataList && dataList.length>0 && pager.total > 15">
              <el-pagination
                @current-change="handleCurrentChange"
                background
                layout="total, prev, pager, next"
                :current-page="pager.pageIndex"
                :page-sizes="[10,20,50]"
                :page-size="pager.pageSize"
                :total="pager.total">
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
import API from '@/api/api_record/mNameModifyRecord';
export default {
  created() {
    let phone = this.$route.query.phone;
    if(phone) {
      this.isFromMember = true;
      this.memberPhone = phone;
      this.ruleForm.phone = phone;
    }
  },
  data(){
    return {
        ruleForm: {
          employeeId: '',
          phone: ''
        },
        rules: {
        },
        memberPhone: '',
        storeCodes: {
          storeCodes: ''
        },
        isFromMember: false,//是否从会员详情页跳过来
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
    //如果从商品详情页过来，则点击跳回到商品详情页
    goBack: function () {
      this.$router.go(-1)
    },

    //查看真实会员姓名
    bindShowTrueVal(item,flag) {
      let _this = this;
      
      API.queryCardNameOrMobile({cardId:item.cardId,recordId:item.recordId,flag:flag}).then(res => {
          if(res.success){
            if(flag == 'name') {
              item.isShowViewNameBtn = false;
              item.trueName = res.data || '';
            }else {
              item.isShowViewPhoneBtn =  false;
              item.truePhone =  res.data || '';;
            }
          }else{
            _this.popBlankMessage(res.errMsg||res.respMsg||'处理异常');
          }
          
      })
    },

    //处理分页
    handleCurrentChange(val) {
      this.storeParams.pageIndex = val;
      this.queryData(this.storeParams);
    },

    //重置
    resetForm() {
      this.$refs.ruleForm.resetFields();
      this.ruleForm.phone = this.memberPhone;
      this.storeCodes.storeCodes = 'reset';
      this.isShowTab = false;
      this.dataList = [];
      this.pager = {};
      this.storeParams = {};
    },

    //查询事件
    submitForm() {
        let phone = this.ruleForm.phone = this.ruleForm.phone.trim();
        let employeeId = this.ruleForm.employeeId = this.ruleForm.employeeId.trim();

        if(phone.length) {
          let checkPhone = /^\d{11}$/.test(this.ruleForm.phone);
          if(!checkPhone) {
            this.popBlankMessage('请输入正确的会员手机号')
            return false;
          }
        }

        if(employeeId.length) {
          let checkEmployeeId = /^[\dA-Za-z]*$/.test(this.ruleForm.employeeId);
          if(!checkEmployeeId) {
            this.popBlankMessage('请输入正确的员工编号')
            return false;
          }
        }
        if(phone.length || employeeId.length || this.storeCodes.storeCodes) {
          let params = {
            mobile: phone,
            applyCode: employeeId,
            pageSize: 15,
            pageIndex: 1
          };
          console.log(this.storeCodes,999)
          if(this.storeCodes.isdata){//有权限
            if(this.storeCodes.istotal){//总部的
              if(this.storeCodes.isall){//全选将storeNums改成all
                params.departmentCodeList = 'all';
              }else{
                params.departmentCodeList = this.storeCodes.storeCodes.join(',');
              }
            }else{
              params.departmentCodeList = this.storeCodes.storeCodes.join(',');
            }; 
          };
          this.storeParams = params;
          console.log(params)
          this.queryData(params);
        }else {

          let str = this.storeCodes.isdata == 1 ? '会员手机号、员工编号、部门三项里面至少选一项，请选择后进行查询' : '会员手机号、员工编号里面至少选一项，请选择后进行查询';
          this.popBlankMessage(str);
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
      API.queryCardNameModifyRecords(params).then(res => {
          loadingInstance.close()
          if(res.success){
            _this.dealQueryData(res);
          }else{
            _this.dataList = [];
            _this.pager = {};
            _this.popBlankMessage(res.errMsg||res.respMsg||'处理异常');
          }
          
      })


    },

    //处理查询结果数据
    dealQueryData(res) {
      let dataList = [];
      if(res.data.dataList && res.data.dataList.length) {
        dataList = res.data.dataList;
        this.pager = {
          total: res.data.total,
          totalPage: res.data.totalPage,
          pageIndex: res.data.pageIndex,
          pageSize: res.data.pageSize,
        };
      }else {
        this.pager = {};
      }
      
      if(this.LOGINDATA.member_record_check_name_or_phone) {
        dataList.forEach(item => {
          item.isShowViewNameBtn = true;
          item.trueName = '';
          item.isShowViewPhoneBtn = true;
          item.truePhone = '';
        })
      }

      this.dataList = dataList

    },

    popBlankMessage(message,s){
      this.$message({
        message:message,
        type: 'warning'
      })
    },
  }
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


