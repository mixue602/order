<template>
  <div class="agency-counter-due">
    <!-- 查询条件  -->
    <div class="select-div">
      <div class="build-head"></div>
      <el-form
        label-width="120px"
        style="width:300px;"
        ref="form"
        :label-position="labelPosition"
        :model="form"
      >
        <el-form-item label="订单号:" prop="orderId" class="buy-form-item">
          <el-input
            size="small"
            placeholder="请输入订单号"
            auto-complete="off"
            v-model.trim="form.orderId"
            @blur="checkOrderId"
          ></el-input>
          <span class="valiedateTips" v-if="ShowOrderIdTip.isShow">{{ ShowOrderIdTip.message }}</span>
        </el-form-item>
        <el-form-item label="配送单号:" prop="shippingGroupId" class="buy-form-item">
          <el-input
            size="small"
            placeholder="请输入配送单号"
            auto-complete="off"
            v-model.trim="form.shippingGroupId"
            @blur="checkShipOrderId"
          ></el-input>
          <span
            class="valiedateTips"
            v-if="ShowShippingGroupIdTip.isShow"
          >{{ ShowShippingGroupIdTip.message }}</span>
        </el-form-item>
        <el-row class="form-tip">
          <p>说明：仅支持对本门店订单购买延保</p>
        </el-row>
        <el-form-item>
          <el-button size="small" plain @click="reset('form')">重置</el-button>
          <el-button size="small" type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 搜索结果 -->
    <div class="search-results">
      <el-table
        :data="search.list"
        border
        style="width: 100%"
        :show-header="true"
        empty-text="没有可购买延保的订单商品"
      >
        <el-table-column type="index" label="序号" width="100" align="center"></el-table-column>
        <el-table-column prop="storeName" label="销售部门" align="center"></el-table-column>
        <el-table-column prop="orderId" label="订单号" align="center"></el-table-column>
        <el-table-column prop="shippingGroupId" label="配送单号" align="center"></el-table-column>
        <el-table-column prop="shippingGroupState" label="配送单状态" align="center"></el-table-column>
        <el-table-column prop="memberCardNo" label="会员卡号" align="center"></el-table-column>
        <el-table-column prop="itemName" label="商品名称" align="center"></el-table-column>
        <el-table-column prop="skuNo" label="商品编码" align="center"></el-table-column>
        <el-table-column
          prop="itemAmount"
          label="金额"
          align="center"
          label-class-name="本页搜索出的订单商品金额为原订单商品在用券后的商品售价，与订单实付金额有所区别"
          :render-header="renderHeader"
        ></el-table-column>
        <el-table-column
          prop="quantity"
          label="数量"
          align="center"
          label-class-name="本页搜索出的订单商品数量为可补购延保的商品数量，与订单实际商品数量有所区别"
          :render-header="renderHeader"
        ></el-table-column>
        <el-table-column prop="submittedDate" label="下单时间" align="center" :formatter="formatTime"></el-table-column>
        <el-table-column prop="splitType" label="操作" align="center" fixed="right">
          <template slot-scope="scope">
            <div>
              <el-button type="text" size="small" @click="getExtensionMessage(scope.row)">购买延保</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- <el-table></el-table> -->
      <!-- :pGoodsData="item.buyIncrement" -->
      <ExtendedWarranty
        @getdialogvisible="getdialogvisible"
        :pGoodsData="buyInsuranceData"
        v-if="insuranceDialogVisible"
      ></ExtendedWarranty>
    </div>
  </div>
</template>
<script>
import { setTimeout } from "timers";
import { formatDate } from "@/common/time";
import API from "@/api/buy_extended_warranty/buy_extended_warranty";
import ExtendedWarranty from "@/components/buyExtendedWarranty/extendedWarranty";
export default {
  data() {
    // var checkOrderId = function(rule, value, callback) {
    //   let orderIdFlag = /^[0-9]+$/;
    //   // console.log(Vue);
    //   setTimeout(() => {
    //     if (value == "" && this.form.shippingGroupId == "") {
    //       callback(new Error("请输入搜索内容！"));
    //     } else if (value != "" && !orderIdFlag.test(value)) {
    //       callback(new Error("填写信息错误，请输入数字！"));
    //     } else {
    //       callback();
    //     }
    //   }, 200);
    // };
    // var checkShipOrderId = function(rule, value, callback) {
    //   var orderRegex = /^[0-9]+$/;
    //   setTimeout(() => {
    //     if (value == "") {
    //       callback(new Error("请输入搜索内容！"));
    //     } else if (value != "" && !orderRegex.test(value)) {
    //       callback(new Error("填写信息错误，请输入数字！"));
    //     } else {
    //       callback();
    //     }
    //   }, 200);
    // };
    return {
      //查询条件右对齐
      labelPosition: "right",
      form: {
        shippingGroupId: "", // 配送单号
        orderId: "" //订单号
      },
      ShowOrderIdTip: {
        isShow: false,
        message: ""
      },
      ShowShippingGroupIdTip: {
        isShow: false,
        message: ""
      },
      // rules: {
      //   shippingGroupId: [{ validator: checkShipOrderId, trigger: "blur" }],
      //   orderId: [{ validator: checkOrderId, trigger: "blur" }]
      // },
      search: {},
      extendData: {}, // 延保数据
      insuranceData: {}, //查询购买延保数据
      buyInsuranceData: {}, //查询购买延保数据
      insuranceDialogVisible: false, //补够延保弹层是否展示
      prarentinsuranceDialogVisible: false, //补够延保弹层是否展示
      addIncrement: {} //购买延保需要提交的数据
    };
  },
  watch: {
    insuranceData: {
      handler: function() {
        this.buyInsuranceData = this.insuranceData;
      },
      deep: true
    },
    insuranceDialogVisible: {
      handler: function() {
        this.prarentinsuranceDialogVisible = this.insuranceDialogVisible;
      },
      deep: true
    }
  },
  methods: {
    checkOrderId() {
      let orderIdFlag = /^[0-9]+$/;
      if (this.form.orderId == "" && this.form.shippingGroupId == "") {
        this.ShowOrderIdTip.isShow = true;
        this.ShowOrderIdTip.message = "请输入搜索内容！";
        return false;
      } else if (
        this.form.orderId != "" &&
        !orderIdFlag.test(this.form.orderId)
      ) {
        this.ShowOrderIdTip.isShow = true;
        this.ShowOrderIdTip.message = "填写信息错误，请输入数字！";
        return false;
      } else {
        this.ShowOrderIdTip.isShow = false;
        this.ShowOrderIdTip.message = "";
        this.ShowShippingGroupIdTip.isShow = false;
        this.ShowShippingGroupIdTip.message = "";
        return true;
      }
    },
    checkShipOrderId() {
      var orderRegex = /^[0-9]+$/;
      if (this.form.shippingGroupId == "" && this.form.orderId == "") {
        this.ShowShippingGroupIdTip.isShow = true;
        this.ShowShippingGroupIdTip.message = "请输入搜索内容！";
        return false;
      } else if (
        this.form.shippingGroupId != "" &&
        !orderRegex.test(this.form.shippingGroupId)
      ) {
        this.ShowShippingGroupIdTip.isShow = true;
        this.ShowShippingGroupIdTip.message = "填写信息错误，请输入数字！";
        return false;
      } else {
        this.ShowOrderIdTip.isShow = false;
        this.ShowOrderIdTip.message = "";
        this.ShowShippingGroupIdTip.isShow = false;
        this.ShowShippingGroupIdTip.message = "";
        return true;
      }
    },
    formatTime(row) {
      let date = new Date(row.submittedDate);
      return formatDate(date, "yyyy-MM-dd");
    },
    renderHeader(h, { column, $index }) {
      return (
        <el-tooltip
          class="item"
          effect="light"
          content={column.labelClassName}
          placement="top"
        >
          <span class="buy-num">{column.label}</span>
          <i class="el-icon-question head-question" />
        </el-tooltip>
      );
    },
    // 重置
    reset(formName) {
      this.$refs[formName].resetFields();
      this.form.shippingGroupId = "";
      this.form.orderId = "";
      // this.search.list.splice(0);
    },
    // 点击查询
    onSubmit() {
      this.gettableData();
    },
    // 查询
    gettableData() {
      if (this.form.shippingGroupId == "" && this.form.orderId == "") {
        this.$message({
          message: "请至少输入一个查询条件",
          type: "warrning"
        });
        return false;
      }
      if (!this.checkOrderId() || !this.checkShipOrderId()) {
        return false;
      }
      API.querySupplyWarrantyOrderList(this.form).then(data => {
        if (data.success) {
          this.search = data.response;
        } else {
          this.$message({
            showClose: true,
            message: data.respMsg,
            type: "warning"
          });
        }
      });
    },
    // 点击购买延保按钮获取延保信息
    getExtensionMessage(item) {
      var that = this;
      that.insuranceDialogVisible = false;
      let comParams = {
        skuNo: item.skuNo, //商品skuNo
        gomePrice: item.itemAmount, //国美价
        organCode: item.salesOrganization, //销售组织
        shippingGroupId: item.shippingGroupId, //配送单号
        commerceItemId: item.commerceItemId, //商品ID
        storeId: item.storeCode, //销售门店
        siteType: 3 //固定写死站点
      };
      let addIncrement = {
        commerceItemId: item.commerceItemId, //商品ID
        shippingGroupId: item.shippingGroupId //配送单号
      };
      API.queryIncrementServiceDetail(comParams).then(data => {
        if (data.success && data.response != null) {
          that.insuranceDialogVisible = true; //调子组件
          that.insuranceData = data.response;
          that.insuranceData.addIncrement = addIncrement;
        } else {
          that.$message({
            message: data.respMsg,
            type: "error"
          });
        }
      });
    },
    //获取补够延保子组件的数据
    getdialogvisible(value) {
      var that = this;
      // alert(value)
      if (value) {
        that.insuranceDialogVisible = value;
      }
    }
  },
  components: {
    ExtendedWarranty
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
  border: 1px solid #e2e3e4;
  margin: 0 auto;
}
.build-head {
  font-size: 14px;
  height: 18px;
  text-indent: 12px;
}
.form-tip {
  margin-bottom: 10px;
  margin-left: 50px;
  font-size: 12px;
  text-align: left;
  color: #909399;
}
.red {
  color: #e3101e;
}
.search-results {
  margin-top: 40px;
}
.warnningIcon {
  border: 1px solid #e3101e;
  width: 10px;
  height: 10px;
}
.buy-num:after {
  content: "";
  background: url("../../assets/images/question.png");
  width: 14px;
  height: 14px;
  display: inline-block;
  vertical-align: middle;
  margin-left: 2px;
  background-size: contain;
}
.num-tips {
  display: inline-block;
  position: absolute;
}
.el-form-item--small.el-form-item.buy-form-item {
  margin-bottom: 28px;
  position: relative;
}
.valiedateTips {
  color: red;
  font-size: 12px;
  position: absolute;
  top: 26px;
  left: 0;
}
</style>