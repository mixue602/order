<template>
  <div class="agency-counter-due">
    <div class="select-div">
      <div class="build-head"></div>
      <el-form :label-position="labelPosition" :model="form" :rules="rules" ref="form" label-width="120px" style="width:300px;">
        <el-form-item label="会员手机号:" class="is-required" prop="memberPhoneNo">
          <el-input size="small" placeholder="请输入会员手机号" maxlength="11" v-model.trim="form.memberPhoneNo" auto-complete="off" @keyup.enter.native="selectList('form')" clearable></el-input>
        </el-form-item>
        <el-form-item label="会员卡号:" class="is-required" prop="memberCardNo">
          <el-input size="small" placeholder="请输入会员卡号" v-model.trim="form.memberCardNo" auto-complete="off" @keyup.enter.native="selectList('form')" clearable></el-input>
        </el-form-item>
        <el-form-item label="订单号:" class="is-required" prop="orderId">
          <el-input size="small" placeholder="请输入订单号" auto-complete="off" v-model.trim="form.orderId" @keyup.enter.native="selectList('form')" clearable></el-input>
        </el-form-item>
        <el-form-item label="订单类型:" class="" prop="orderType">
          <el-select v-model="form.orderType" style="width:179px">
            <el-option v-for="orderItem in orderTypeList" :key="orderItem.orderTypeCode"  :label="orderItem.orderTypeName" :value="orderItem.orderTypeCode" ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button size="small" plain @click="clearInput('form')">重置</el-button>
          <el-button v-if="LOGINDATA.orderplatform_agencyCounterDue_list" size="small" type="primary" @click="selectList('form')">查询</el-button>
        </el-form-item>
      </el-form>
      <el-row class="form-tip">
        <p>注：带<span class="red">*</span>号的查询条件必需填写一项，仅支持订单类型为普通订单的当前页多个订单合并收款</p>
      </el-row>
    </div>
    <div class="div-pay" v-if="orderTypeFlag">
      <label class="ft-co">应收金额:
        <span v-text="payMoney">0.00</span>
      </label>
      <el-button v-if="LOGINDATA.orderplatform_agencyCounterDue_pay" type="primary" size="small" class="confirm" @click="payFor(2)">确认收款</el-button>
    </div>
    <!-- 待收款列表 -->
    <div class="div-table" :style="orderTypeFlag? '':'margin-top:35px;'">
      <el-table v-loading="loading" :data="tableData" ref="multipleTable" border :header-row-class-name="headerName" :header-cell-style="headerstyle" @selection-change="handleSelectionChange" style="text-align:center;color:#606266" :empty-text="noDataTip">
        <el-table-column type="selection" :selectable="selectable" v-if="orderTypeFlag" width="55"></el-table-column>
        <el-table-column prop="storeName" label="销售门店" show-overflow-tooltip></el-table-column>
        <el-table-column prop="orderId" label="订单号"></el-table-column>        
        <el-table-column prop="receivableMoney" label="应收金额"></el-table-column>
        <el-table-column prop="useGomeBeanMoney" label="使用美豆金额"></el-table-column>
        <el-table-column prop="preSaleFalg" width="80" label="是否预售" :formatter="isSell"></el-table-column>        
        <el-table-column prop="orderType" label="订单类型" :formatter="orderTypeTip"></el-table-column>
        <el-table-column prop="memberCardId" label="会员卡号"></el-table-column>
        <el-table-column prop="temporaryCard" width="100" label="是否临时卡" :formatter="isCard"></el-table-column>
        <el-table-column prop="status" fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button v-if="LOGINDATA.orderplatform_agencyCounterDue_detail && orderTypeFlag" @click="handleClick(scope.row)" type="text" size="small">查看商品</el-button>
            <el-button v-if="LOGINDATA.orderplatform_agencyCounterDue_pay" type="text" size="small" @click="payFor(1,scope.row)">确认收款</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页：待收款列表 -->
    <div class="div-pagination">
      <el-pagination background v-show="isHaveData" @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageSize" layout="total, prev, pager, next, jumper" :total="totalSize">
      </el-pagination>
    </div>
    <!-- 弹窗：商品详情 -->
    <DialogTable v-if="dialogTableVisible" :params="params" v-on:IsClose='isClose'></DialogTable>
    <!-- 弹窗：付款 -->
    <iframe v-show="isPayFor" id="payFrame" name="payFrame" pay-state="getPayStates" onload="this.style.height=document.body.clientHeight" height="100%" scrolling="auto" frameborder="0" width="100%" style="position: fixed;top: 0px;left: 0px;width: 100%;height: 100%;z-index: 999999999;" allowtransparency="true"></iframe>
  </div>
</template>
<script>
import DialogTable from "@/components/agencyCounterDue/goodsInfo-dialog";
import API from "@/api/agency_counter_due/agency_counter_due";
import { mapState } from "vuex";

export default {
  created() {
    let that = this;
    window.getPayStates = function(val) {
      that.isPayFor = false;
      //val = 1 表示成功完成收款
      //val = 0 表示取消支付
      if (val == 1) {
        that.changeCurrentData();
      }
    };
  },
  computed: mapState({
    LOGINDATA: "LOGINDATA"
  }),
  data() {
    //创建校验规则提示
    var checkPhoneNo = (rule, value, callback) => {
      let phoneNumFlag = /^(1[3|5|4|6|7|8|9]\d{1}[*|\d]{4}\d{4})$/;
      setTimeout(() => {
        if(value != "" && !phoneNumFlag.test(value)){
          callback(new Error('请输入正确的手机号！'));
        }else {
          callback();
        }
      }, 200);
    };
    var checkMemberCardNo = (rule, value, callback) => {
      let memberCardIdFlag = /^[0-9a-zA-Z]*$/g;
      setTimeout(() => {
        if(value != "" && !memberCardIdFlag.test(value)){
          callback(new Error('请输入有效的会员卡号！'));
        }else {
          callback();
        }
      }, 200);
    };
    var checkOrderId = (rule, value, callback) => {
      let orderIdFlag = /^[0-9]+$/;
      setTimeout(() => {
        if(value != "" && !orderIdFlag.test(value)){
          callback(new Error('请输入有效的订单号！'));
        }else {
          callback();
        }
      }, 200);
    };
    return {
      //查询条件右对齐
      labelPosition: "right",
      //隐藏付款iframe
      isPayFor: false,
      // 查询条件
      form: {
        memberPhoneNo: "", //会员手机号
        memberCardNo: "", //会员卡号
        orderId: "", //订单号
        orderType: 1 //默认普通订单， 1-普通订单,2-订金订单
      },
      orderTypeList: [   //订单类型选择
        {
          orderTypeName:'普通订单',
          orderTypeCode:1
        },
        {
          orderTypeName:'订金充值订单',
          orderTypeCode:2
        },
        {
          orderTypeName:'积分充值订单',
          orderTypeCode:3
        }
      ],
      orderTypeFlag: true,// 根据订单类型的选择，是否显示:确认收款按钮及查询结果的复选框，目前：普通订单：显示，其他不显示
      rules: {
        memberPhoneNo: [
          { validator: checkPhoneNo, trigger: 'blur' }
        ],
        memberCardNo: [
          { validator: checkMemberCardNo, trigger: 'blur' }
        ],
        orderId: [
          { validator: checkOrderId, trigger: 'blur' }
        ]
      },

      //表格样式
      headerName: "headerName", //表格头部名称
      headerstyle: {
        //表格头部样式
        background: "#eef6ff"
      },

      //应付金额和复选框
      payMoney: (0).toFixed(2), //应付金额
      multipleSelection: [], //未付款订单列表多选框选项

      //未付款订单列表和分页
      loading: false,//首次查询加载
      tableData: [], //未付款订单列表
      isHaveData: false,
      currentPage: 1, //当前页
      pageSize: 100, //每页条数
      totalSize: 0, //总条数
      noDataTip: "暂无相关记录",

      //翻页功能使用
      pagerParams: {
        memberPhoneNo: "", //会员手机号
        memberCardNo: "", //会员卡号
        orderId: "", //订单号
        orderType: 1, //默认 普通订单：1
        currentPage: 1, //当前页码
        pageSize: 100 //当前页多少条数据
      },

      //商品详情列表弹窗
      dialogTableVisible: false, //弹窗默认关闭
      params: {} //传给弹窗的接口参数
    };
  },
  methods: {
    //重置查询条件
    clearInput(formName) {
      this.$refs[formName].resetFields();
    },
    //查询未付款订单事件
    selectList(formName) {
      this.tableData = [];
      this.isHaveData = false;
      if ( this.form.memberPhoneNo == "" && this.form.memberCardNo == "" && this.form.orderId == "" ) {
        this.$message({
          showClose: true,
          message: "带*查询条件必填一项",
          type: "warning"
        });
      }
      else {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.loading = true;
            if (this.form.orderType == 1) {
              this.orderTypeFlag = true;
            }
            else {
              this.orderTypeFlag = false;
            }
            API.queryUnPaidOrderList({
              memberPhoneNo: this.form.memberPhoneNo,
              memberCardNo: this.form.memberCardNo,
              orderId: this.form.orderId,
              orderType: this.form.orderType,
              currentPage: this.currentPage,
              pageSize: this.pageSize
            }).then(data => {
              this.loading = false;
              if (data.success) {
                if (data.response && data.response.list.length > 0) {
                  let tempList = data.response.list;
                  tempList.map(item => {
                    item.isCheck = true;
                  });
                  this.tableData = tempList;
                  //打开分页
                  this.isHaveData = true;
                  this.currentPage = data.response.pager.currentPage;
                  this.pageSize = data.response.pager.pageSize;
                  this.totalSize = data.response.pager.totalSize;
                  //缓存查询条件，为翻页使用
                  this.pagerParams.memberPhoneNo = this.form.memberPhoneNo;
                  this.pagerParams.memberCardNo = this.form.memberCardNo;
                  this.pagerParams.orderId = this.form.orderId;
                  this.pagerParams.orderType = this.form.orderType;
                  this.pagerParams.currentPage = this.currentPage;
                }
              } else {
                this.$message({
                  showClose: true,
                  message: data.respMsg,
                  type: "warning"
                });
              }
            });
          }
        });
      }
    },
    //未付款列表复选框勾选事件:实时显示当前应付金额数
    handleSelectionChange(val) {
      this.multipleSelection = val;
      let sum = arr => {
        let s = 0;
        if (arr.length == 0) {
          return 0;
        } else if (arr.length == 1) {
          return arr[0].receivableLongMoney;
        } else {
          for (let i = 0; i < arr.length; i++) {
            s += arr[i].receivableLongMoney;
          }
          return s;
        }
      };
      this.payMoney = (sum(val) / 100).toFixed(2);
    },
    //复选框控制事件
    selectable(row, index) {
      //arguments[0]是row  arguments[1]是index 如果直接想隐藏第几条，就是arguments[1]===1 就隐藏第2条
      if (row.preSaleFalg == "1") {
        return false;
      } else {
        return true;
      }
    },
    //查看商品列表弹窗事件
    handleClick(row) {
      this.params.storeCode = row.storeCode;
      this.params.orderId = row.orderId;
      this.dialogTableVisible = true;
    },
    //确认付款事件
    payFor(param, row) {
      if (param === 1 || (param === 2 && this.multipleSelection.length >= 1)) {
        if (!this.orderTypeFlag) {
          API.confirmPayForOrder({
            orderId: row.orderId
          }).then(data => {
            if (data.success) {
              if (data.response != null) {
                this.isPayFor = true;
                document.getElementById("payFrame").src = data.response;
              }
            } else {
              this.$message({
                showClose: true,
                message: data.respMsg,
                type: "warning"
              });
            }
          });
        }
        else {
          let params = [];
          if (param === 1) {
            params.push(row.orderId);
          } else {
            for (let i = 0; i < this.multipleSelection.length; i++) {
              params.push(this.multipleSelection[i].orderId);
            }
          }
          API.confirmReceipt({
            orderIdList: params
          }).then(data => {
            if (data.success) {
              if (data.response != null) {
                this.isPayFor = true;
                document.getElementById("payFrame").src = data.response;
              }
            } else {
              this.$message({
                showClose: true,
                message: data.respMsg,
                type: "warning"
              });
            }
          });
        }
        
      } else {
        this.$message({
          showClose: true,
          message: "未选择付款项",
          type: "warning"
        });
      }
    },
    //过滤：是否预售
    isSell(row) {
      return row.preSaleFalg == "1" ? "是" : " ";
    },
    //过滤：是否临时卡
    isCard(row) {
      return row.temporaryCard == "1" ? "是" : " ";
    },
    //过滤：订单类型
    orderTypeTip(row){
      return row.orderType == "1" ? "普通订单" : row.orderType == "2" ? "订金充值订单" : "积分充值订单";
    },
    //付款刷新和翻页刷新数据
    changeCurrentData() {
      this.tableData = [];
      this.isHaveData = false;
      this.loading = true;
      API.queryUnPaidOrderList({
        memberPhoneNo: this.pagerParams.memberPhoneNo,
        memberCardNo: this.pagerParams.memberCardNo,
        orderId: this.pagerParams.orderId,
        orderType: this.pagerParams.orderType,
        currentPage: this.pagerParams.currentPage,
        pageSize: this.pagerParams.pageSize
      }).then(data => {
        this.loading = false;
        if (data.success && data.response.list.length > 0) {
          let tempList = data.response.list;
          tempList.map(item => {
            item.isCheck = true;
          });
          this.tableData = tempList;
          //打开分页
          this.isHaveData = true;
          this.currentPage = data.response.pager.currentPage;
          this.pageSize = data.response.pager.pageSize;
          this.totalSize = data.response.pager.totalSize;
        } else {
          this.$message({
            showClose: true,
            message: data.respMsg,
            type: "warning"
          });
        }
      });
    },
    //当前页改变时触发事件
    handleCurrentChange(val) {
      this.pagerParams.currentPage = val;
      this.changeCurrentData();
    },
    //绑定弹窗是否关闭事件监听器
    isClose(val) {
      this.dialogTableVisible = val;
    }
  },
  components: {
    DialogTable: DialogTable
  },
  watch: {
    dialogTableVisible: (val, oldval) => {
      // console.log(val+"----------------"+oldval)
    }
  }
};
</script>
<style>
.input-phoneNo__error {
  color: #f56c6c;
  font-size: 12px;
  line-height: 1;
  position: relative;
}
.agency-counter-due {
  margin: 0 auto;
}
.select-div {
  border: 1px solid #ccc;
  margin: 0 auto;
}
.build-head {
  font-size: 14px;
  height: 18px;
  text-indent: 12px;
}
.build-list {
  height: 59px;
  line-height: 59px;
  margin-bottom: 20px;
}
.pl-12 {
  padding-left: 12px;
}
.pl-60 {
  padding-left: 60px;
}
.ft-co {
  color: #606266;
}
.div-pay {
  margin-top: 35px;
  margin-bottom: 35px;
}
.headerName div {
  text-align: center;
  font-size: 14px;
  color: #909399;
}
.confirm {
  margin-left: 25px;
}
.div-pagination {
  margin-top: 50px;
  float: right;
}
.form-tip {
  margin-bottom: 10px;
  margin-left: 10px;
  font-size: 12px;
  text-align: left;;
  color: #909399;
}
.red {
  color: #e3101e;
}
.el-form-item.is-required .el-form-item__label:before {
  content: "*";
  color: #f56c6c;
  margin-right: 4px;
}
</style>
