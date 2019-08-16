<template>
  <div>
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
          <g-cardnumber v-model="cardumber"></g-cardnumber>
        </el-col>
      </el-row>
      <el-row>
        <el-col :xs="24" :sm="24" :md="12" :lg="10" :xl="12">
          <g-sellerno v-model="sellerno"></g-sellerno>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="10" :xl="12">
          <el-form-item
            label="开单时间："
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
      <el-row>
        <el-col :xs="24" :sm="24" :md="12" :lg="10" :xl="12">
        <el-form-item label="订单状态：">
          <el-select v-model="form.orderState" style="width:179px">
            <el-option
              v-for="stateItem in orderStateList"
              :key="stateItem.statusCode"
              :label="stateItem.statusName"
              :value="stateItem.statusCode"
            ></el-option>
          </el-select>
        </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="10" :xl="12">
          <el-form-item label="充值来源：">
            <el-select v-model="form.orderSource" style="width:179px">
              <el-option
                v-for="item in orderSourceList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
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
        :data="response.list"
        v-loading="loading"
        border
        style="width: 100%"
        :show-header="true"
        size="small"
      >
        <el-table-column
          prop="storeName"
          label="销售部门"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="orderId"
          label="订金单号"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="statusName"
          label="订单状态"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="userCard"
          label="会员卡号"
          align="center"
        ></el-table-column>
        <el-table-column prop="orderAmount" label="金额" align="center">
          <template slot-scope="scope">
            ¥{{ scope.row.orderAmount }}
          </template>
        </el-table-column>
        <el-table-column prop="orderSource" label="充值来源" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.orderSource == '0'">财富增值</div>
            <div v-if="scope.row.orderSource == '1'">美豆</div>
            <div v-if="scope.row.orderSource == '2'">优惠券</div>
            <div v-if="scope.row.orderSource == '3'">付费会员</div>
            <div v-if="scope.row.orderSource == '4'">订金集客</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" fixed="right">
          <template slot-scope="scope">
            <div>
              <router-link
                :to="{
                  path: '/order/earnestMoneyorder_detaile',
                  query: { orderId: scope.row.orderId, source: scope.row.orderSource }
                }"
                target="_blank"
                ><el-button
                  v-if="LOGINDATA.orderplatform_earnestMoneyorder_check"
                  type="text"
                  size="small"
                  >查看详情</el-button
                ></router-link
              >
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="block pagebox" v-if="response.list.length != 0">
        <el-pagination
          background
          @current-change="handleCurrentChange"
          :current-page="response.pageNo"
          :page-size="response.pageSize"
          layout="total,prev, pager, next, jumper"
          :total="response.total"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script type="text/javascript">
import { mapState, mapActions } from "vuex";
import API from "@/api/earnestmoneyorder/earnestmoneyorder";
export default {
  data() {
    var validatorOderid = (rule, value, callback) => {
      var orderRegex = /^[0-9]+$/;
      if (value == "") {
        this.orderId = false;
      } else if (!orderRegex.test(value)) {
        this.orderId = false;
        callback(new Error("填写信息错误，请输入数字"));
      } else {
        this.orderId = true;
      }
    };

    return {
      response: {
        pager: {},
        list: []
      },
      dateerror: false, //开单时间是不是再30天范围内
      dateerrorMesg: "", //结束时间不能大于开始时间
      orderStateList: [],
      orderSourceList: [{
          value: "0",
          label: '订金充值订单'
        }, {
          value: "4",
          label: '订金集客订单'
        }
      ],
      orderId: true, //订单号
      form: {
        orderId: "",
        startTime: null, //开始时间
        endTime: null, //结束时间
        orderNumber: "",
        dataTime: "", //开单时间
        orderState: "", //订单状态
        orderSource: "4" //充值状态
      },
      cardumber: {
        // 会员卡或者手机号
        memberCardNoPamas: "",
        memberCardNo: ""
      },
      sellerno: {
        //导购员编号
        guiderCode: "",
        sellerNo: "",
        disabled: ""
      },
      rules: {
        //校验规则
        orderId: [
          //订单号
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
      },
      loading: false
    };
  },
  mounted() {
    this.orderState();
    //console.log(this.response);
  },
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
    orderState() {
      var _this = this;
      //订单状态数据请求
      API.queryOrderStatusList().then(res => {
        if (res.success) {
          _this.orderStateList = res.response;
        }
      });
      //如果是导购员，将检索条件中的导购员置灰并获取默认数据
      if (_this.LOGINDATA.storeStaffId != null) {
        _this.sellerno.sellerNo = _this.LOGINDATA.storeStaffId;
        _this.sellerno.guiderCode = _this.LOGINDATA.storeStaffId;
        _this.sellerno.disabled = true;
      }
     // console.log(_this.sellerno)
    },
    onReset(formName) {
      var _this = this;
      _this.$refs[formName].resetFields();
      if (_this.LOGINDATA.storeStaffId == null) {
        _this.sellerno.sellerNo = "";
        _this.sellerno.guiderCode = "";
      }
      (_this.cardumber.memberCardNoPamas = ""),
        (_this.cardumber.memberCardNo = "");
      this.form.startTime = "";
      this.form.endTime = "";
      this.form.orderState = "";
      this.form.orderSource = "4";
      this.dateerrorMesg = "";
      this.dateerror = false;
    },
    onSubmit() {
      let _this = this;
      if (
        _this.cardumber.memberCardNoPamas != "error" &&
        _this.sellerno.guiderCode != "error" &&
        !_this.dateerror
      ) {
        if (
          _this.form.orderId ||
          (_this.form.startTime && _this.form.endTime) ||
          _this.cardumber.memberCardNoPamas ||
          _this.sellerno.guiderCode ||
          _this.form.orderState || 
          _this.form.orderSource
        ) {
          var endTime = _this.form.endTime
            ? _this.form.endTime + 86400000 - 1
            : "";
          var formData = {
            orderId: _this.form.orderId,
            status: _this.form.orderState,
            orderSource: _this.form.orderSource,
            userCard: _this.cardumber.memberCardNoPamas,
            sellerId: _this.sellerno.guiderCode,
            startCreateDate: _this.form.startTime,
            endCreateDate: endTime,
            pageNo: 1,
            pageSize: 15
          };
          _this.formsubmitdata = formData;
          _this.manageInit(formData);
        } else {
          this.$message({
            message: "请至少输入一个查询条件",
            type: "warning"
          });
        }
      }
    },
    manageInit(data) {
      var _this = this;
      _this.loading = true
      if (_this.cardumber.memberCardNoPamas == "error") {
        _this.cardumber.memberCardNoPamas = "";
        _this.cardumber.memberCardNo = "";
      }
      if (_this.sellerno.guiderCode == "error") {
        _this.cardumber.memberCardNoPamas = "";
        _this.sellerno.sellerNo = "";
      }
      API.queryOrderList(data).then(res => {
        _this.loading = false
        if (res.success && res.response != null) {
          _this.response = res.response;
        } else {
          _this.response.list = [];
          if (res.respMsg != null) {
            _this.$message({
              message: res.respMsg,
              type: "error"
            });
          }
        }
      });
    },
    handleCurrentChange(currentPage) {
      //orderindexpage

      //this.response.pager.currentPage = currentPage;
      let formData = this.formsubmitdata;
      formData.pageNo = currentPage;
      this.manageInit(formData);
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
</style>