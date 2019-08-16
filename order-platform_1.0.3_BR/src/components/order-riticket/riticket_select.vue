<template>
  <div class="riticket">
    <el-form
      class="from-query"
      :inline="true"
      :model="form"
      ref="form"
      :rules="rules"
      label-width="150px"
      size="mini"
    >
      <el-row>
        <el-col :xs="24" :sm="24" :md="12" :lg="10" :xl="12">
          <el-form-item label="订单号：" prop="orderId">
            <el-input
              v-model.trim="form.orderId"
              placeholder="请输入订单号"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="10" :xl="12">
          <el-form-item label="配送单号：" prop="shippingGroupId">
            <el-input
              v-model.trim="form.shippingGroupId"
              placeholder="请输入配送单号"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :xs="24" :sm="24" :md="12" :lg="10" :xl="12">
          <el-form-item label="退换货单号：" prop="returnReplaceOrderId">
            <el-input
              v-model.trim="form.returnReplaceOrderId"
              placeholder="请输入退换货单号"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="10" :xl="12">
          <el-form-item label="发票号码：" prop="invoiceNumber">
            <el-input
              v-model.trim="form.invoiceNumber"
              placeholder="请输入发票号码"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :xs="24" :sm="24" :md="12" :lg="10" :xl="12">
          <el-form-item>
            <g-cardnumber v-model="cardumber"></g-cardnumber>
          </el-form-item>
        </el-col>
        <el-form-item label="是否收回：">
          <el-select v-model="form.orderState" style="width:179px">
            <el-option
              v-for="stateItem in orderStateList"
              :key="stateItem.statusCode"
              :label="stateItem.statusName"
              :value="stateItem.statusCode"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-row>
      <el-row>
        <el-col :xs="24" :sm="24" :md="12" :lg="10" :xl="12">
          <el-form-item
            label="提交申请时间："
            v-bind:class="{ iserror: dateerror }"
          >
            <el-date-picker
              placeholder="开始日期"
              value-format="timestamp"
              :picker-options="pickerStart"
              v-model="form.startTime"
              style="width: 142px;"
              @change="endtimeblur"
              class="memberCar_input"
              :editable="false"
            ></el-date-picker>
            <span>-</span>
            <el-date-picker
              type="date"
              placeholder="结束日期"
              value-format="timestamp"
              :picker-options="pickerEnd"
              v-model="form.endTime"
              style="width: 142px;"
              @change="endtimeblur"
              class="memberCar_input"
              :editable="false"
            ></el-date-picker>
            <div class="el-form-item__error" v-if="dateerrorMesg != ''">
              {{ dateerrorMesg }}
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="button-box">
        <el-button size="mini" class="button" @click.stop="onReset('form')"
          >重置</el-button
        >
        <el-button
          type="primary"
          size="mini"
          class="button right"
          @click.stop="onSubmit"
          >查询</el-button
        >
      </div>
    </el-form>
    <div class="bable-query">
      <el-table
        :data="resultObj.returnInvoices"
        border
        style="width: 100%"
        :show-header="true"
        empty-text="请在查询条件区域，输入发票相关信息查询发票信息"
        size="small"
      >
        <el-table-column prop="shippingGroupId" label="配送单号" align="center">
         
        </el-table-column>
        <el-table-column
          prop="orderId"
          label="订单号"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="returnReplaceOrderId"
          label="退换货单号"
          align="center"
        >
        </el-table-column>
        <el-table-column prop="refundAmount" label="退款金额" align="center">
          <template slot-scope="scope">
            ¥{{ scope.row.refundAmount }}
          </template>
        </el-table-column>
        <el-table-column
          prop="memberCardId"
          label="会员卡号"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="invoiceNumber"
          label="发票号码"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="invoiceHead"
          label="发票抬头"
          align="center"
        ></el-table-column>
        <el-table-column prop="isReturn" label="是否收回" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.isReturn == 0">未收回</div>
            <div v-if="scope.row.isReturn == 1">已收回</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="operatorPosition"
          label="操作员岗位"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="operatorId"
          label="操作员编号"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="operatorDate"
          label="操作时间"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="remark"
          label="备注"
          align="center"
        ></el-table-column>
        <el-table-column label="操作" align="center"
        width="110px"
         fixed="right">
          <template slot-scope="scope">
            <div>
              <el-button
                size="mini"
                @click.stop="
                  tipInfo(
                    scope.row.returnReplaceOrderId,
                    scope.row.orderId,
                    scope.row.invoiceNumber,
                    scope.row.shippingGroupId
                  )
                "
                v-if="scope.row.isReturn == 0"
                >确认已收回</el-button
              >
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="block pagebox" v-if="resultObj.returnInvoices.length != 0">
        <el-pagination
          background
          @current-change="handleCurrentChange"
          :current-page="resultObj.pager.currentPage"
          :page-size="resultObj.pager.pageSize"
          layout="total,prev, pager, next, jumper"
          :total="resultObj.pager.totalSize"
        >
        </el-pagination>
      </div>
    </div>
    <div></div>
  </div>
</template>
<script type="text/javascript">
import { mapState, mapActions } from "vuex";
import API from "@/api/riticketSelect/riticketSelect";
export default {
  data() {
    var validatorOderid = (rule, value, callback) => {
      var orderRegex = /^[0-9]+$/;
      if (value == "") {
        this.orderId = true;
      } else if (!orderRegex.test(value)) {
        this.orderId = false;
        callback(new Error("填写信息错误，请输入数字"));
      } else {
        this.orderId = true;
      }
    };

    return {
      resultObj: {
        pager: {},
        returnInvoices: []
      },
      dateerror: false, //开单时间是不是再30天范围内
      dateerrorMesg: "", //结束时间不能大于开始时间
      orderStateList: [
        { statusCode: "2", statusName: "全部" },
        { statusCode: "0", statusName: "未收回" },
        { statusCode: "1", statusName: "已收回" }
      ],
      orderId: true, //订单号
      form: {
        orderId: "", //订单id
        shippingGroupId: "", //配送单id
        returnReplaceOrderId: "", //退换货id
        invoiceNumber: "", //发票号码
        startTime: null, //开始时间
        endTime: null, //结束时间
        orderNumber: "",
        dataTime: "", //开单时间
        orderState: "2" //订单状态
      },
      cardumber: {
        // 会员卡或者手机号
        memberCardNoPamas: "",
        memberCardNo: ""
      },
      rules: {
        //校验规则
        orderId: [
          //订单号
          { validator: validatorOderid, trigger: "change" }
        ],
        shippingGroupId: [
          //配送单id
          { validator: validatorOderid, trigger: "change" }
        ],
        returnReplaceOrderId: [
          //退换货id
          { validator: validatorOderid, trigger: "change" }
        ]
      },
      /** 判断前一个日历的日期不能大于后面的日历日期，且没有到的日期，不能选择 */

      pickerStart: {
        // startTime1:"",
        // endTime1:""
        disabledDate: time => {
          //alert(time)
          if (this.form.endTime !== "" && this.form.endTime !== null) {
            var d = new Date(this.form.endTime).getTime();
            // return time.getTime() > Date.now() || time.getTime() > d
            return time.getTime() > Date.now() || time.getTime() > d;
          } else {
            return time.getTime() > Date.now();
          }
        }
      },
      /** 今日以前日期，后面日期不可选择 */
      pickerEnd: {
        disabledDate: time => {
          if (this.form.startTime !== "") {
            var d = new Date(this.form.startTime).getTime() - 86400000;

            return time.getTime() <= d || time.getTime() > Date.now();
            //   return time.getTime() > d + 86400000*30 || time.getTime() > Date.now()
          } else {
            return time.getTime() > Date.now();
          }
        }
      }
    };
  },
  // created(){
  // 	this.tipInfo()
  // },
  methods: {
    endtimeblur() {
      //时间校验 不能超过30天 // startTime1:"",
      // endTime1:""
      let _this = this;
      if (
        this.form.endTime !== "" &&
        this.form.endTime !== null &&
        this.form.startTime !== "" &&
        this.form.startTime !== null
      ) {
        // if (this.form.startTime !== '' && this.form.endTime !== null) {
        let endDay = new Date(this.form.endTime).getTime();
        let startDay = new Date(this.form.startTime).getTime();
        if (endDay - startDay < 0) {
          _this.dateerror = true;
          _this.dateerrorMesg = "结束时间不能小于开始时间";
        } else {
          if (startDay == 0) {
            _this.dateerror = true;
            _this.dateerrorMesg = "请输入开始时间";
          } else {
            let chaday = (endDay - startDay) / 86400000;
            if (chaday > 30) {
              _this.dateerror = true;
              _this.dateerrorMesg = "请选择30天内的时间范围";
            } else {
              _this.dateerror = false;
              _this.dateerrorMesg = "";
            }
          }
        }
      } else {
        if (
          this.form.startTime == "" ||
          this.form.startTime == null ||
          new Date(this.form.startTime).getTime() == 0
        ) {
          _this.dateerror = true;
          _this.dateerrorMesg = "请输入开始时间";
        }
        if (
          this.form.endTime == "" ||
          this.form.endTime == null ||
          new Date(this.form.endTime).getTime() == 0
        ) {
          _this.dateerror = true;
          _this.dateerrorMesg = "请输入结束时间";
        }
        if (
          (this.form.startTime == "" ||
            this.form.startTime == null ||
            new Date(this.form.startTime).getTime() == 0) &&
          (this.form.endTime == "" ||
            this.form.endTime == null ||
            new Date(this.form.endTime).getTime() == 0)
        ) {
          _this.dateerror = false;
          _this.dateerrorMesg = "";
        }
      }
    },

    onReset(formName) {
      var _this = this;
      _this.$refs[formName].resetFields();

      (_this.cardumber.memberCardNoPamas = ""),
        (_this.cardumber.memberCardNo = "");
      this.form.startTime = "";
      this.form.endTime = "";
      this.form.orderState = "2";
      this.form.shippingGroupId = "";
      this.form.returnReplaceOrderId = "";
      this.form.invoiceNumber = "";
      this.dateerrorMesg = "";
      this.dateerror = false;
    },
    onSubmit() {
      let _this = this;

      if (
        _this.orderId &&
        _this.cardumber.memberCardNoPamas != "error" &&
        !_this.dateerror
      ) {
        if (
          _this.form.orderId ||
          (_this.form.startTime && _this.form.endTime) ||
          _this.cardumber.memberCardNoPamas ||
          _this.form.shippingGroupId ||
          _this.form.returnReplaceOrderId ||
          _this.form.invoiceNumber
        ) {
          var endTime = _this.form.endTime
            ? _this.form.endTime + 86400000 - 1
            : "";
          var formData = {
            orderId: _this.form.orderId,
            isReturn: _this.form.orderState,
            invoiceNumber: _this.form.invoiceNumber,
            returnReplaceOrderId: _this.form.returnReplaceOrderId,
            shippingGroupId: _this.form.shippingGroupId,
            memberCardId: _this.cardumber.memberCardNoPamas,
            startSubmittedDate: _this.form.startTime ? _this.form.startTime : "",
            endSubmittedDate: endTime,
            currentPage: 1,
            pageSize: 15
          };
          _this.formsubmitdata = formData;
          _this.manageInit(formData);
        } else {
          this.$message({
            message: "请至少再输入一个查询条件",
            type: "warning"
          });
        }
      }
    },
    tipInfo(returnReplaceOrderId, orderId, invoiceNumber, shippingGroupId) {
      // 点击确认收回按钮  退货换货单号 订单号 发票号 配送单号
      var _this = this;
      this.$prompt(
        '请确认是否已收回全部增票，点击确认后，系统将给用户进行退款操作。',
        "确认收回增票",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          customClass: "tipInforemark",
          inputPlaceholder:"备注信息可选填，可填写交票人岗位及名称等信息。",
          inputErrorMessage: '已超出100个字符！',
          inputValidator(a){
            if(a && a.length>100)
            return "已超出100个字符！"
          },
          dangerouslyUseHTMLString: true
         
        }
      ).then(({ value }) => {
        var data = {
          returnReplaceOrderId: returnReplaceOrderId,
          orderId: orderId,
          invoiceNumber: invoiceNumber,
          shippingGroupId: shippingGroupId,
          remark: value
        };
        API.confirmReturnInvoice(data).then(res => {
          if (res.success && res.resultObj) {
            _this.$message({
              message: "收回成功",
              type: "success"
            });
          } else {
            _this.$message({
              message: "收回失败",
              type: "error"
            });
          }
           _this.manageInit(_this.formsubmitdata);
        });
      });
    },
    manageInit(data) {
      var _this = this;
      if (_this.cardumber.memberCardNoPamas == "error") {
        _this.cardumber.memberCardNoPamas = "";
        _this.cardumber.memberCardNo = "";
      }

      API.queryOrderList(data).then(res => {
        if (res.success && res.resultObj != null) {
          _this.resultObj = res.resultObj;
        } else {
          _this.resultObj.returnInvoices = [];
          if (res.errMsg != null) {
            _this.$message({
              message: res.errMsg,
              type: "error"
            });
          }
        }
      });
    },
    handleCurrentChange(currentPage) {
      //orderindexpage

      //this.resultObj.pager.currentPage = currentPage;
      let formData = this.formsubmitdata;
      formData.currentPage = currentPage;
      this.manageInit(formData);
    },
    jumpto(path, parms) {
      //跳转页面
      //this.$router.push(to?to:'/order/orderindex');
      let routeData = this.$router.resolve({ path: path, query: parms });
      window.open(routeData.href, "_blank");
    }
  },
  computed: {
    ...mapState({
      //vuex取值
      LOGINDATA: "LOGINDATA"
    })
  }
};
</script>

<style type="text/css">
.from-query {
  border: 1px solid #eaeefb;
  padding: 20px 10px 10px;
}

.bable-query {
  border: 1px solid #eaeefb;
}
.el-table--fit {
  margin-top: 20px;
}
.el-table th {
  background-color: #eef7ff;
  font-family: "Microsoft YaHei";
  color: #606266;
  text-align: center;
}
.button-box {
  width: 30%;
  padding: 20px 0;
  margin: 0 auto;
}
.button.right {
  margin-left: 100px;
}
.riticket .cell a {
  cursor: pointer;
  color: #409eff;
}

.pagebox {
  text-align: right;
  margin-top: 20px;
}
.tipInforemark .el-message-box__header  .el-message-box__title {
  text-align: center;
}
</style>