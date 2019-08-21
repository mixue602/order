<template>
  <div class="eMorder_detailsbox">
    <div class="eMorder_detailsbox_l">
      <el-collapse
        v-model="pageactiveNames"
        class="orderdetails_title"
        @change="handleChange"
      >
        <el-collapse-item :title="orderIdname + orderId" name="1">
          <div class="order_details_cont">
            <div class="states">
              <div class="states_l">{{ response.statusName }}
                <span class="tips" v-if="response.statusName=='待解锁'">使用支票支付，待财务解锁支票，解锁后才可充值成功</span>
              </div>
              <div class="states_r">
                <el-button type="primary"  @click="delateReasonlist" size="mini" v-if="response.unlockCancelFlag == 1">取消订单</el-button>
              </div>
            </div>
            <div class="content_title">商品信息</div>
            <div
              class="el-table el-table--fit el-table--border el-table--enable-row-hover el-table--enable-row-transition el-table--small"
            >
              <el-table :data="response.goodsDetailList" style="width: 100%">
                <el-table-column type="expand">
                  <template slot-scope="props">
                    <el-form
                      label-position="left"
                      inline
                      class="demo-table-expand"
                    >
                      <div class="ml40" v-if="props.row.categorys">
                        购买意向：{{ props.row.categorys }}
                      </div>
                      <div class="ml40" v-if="props.row.remark">
                        备注：{{ props.row.remark }}
                      </div>
                      <div
                        class="ml40"
                        v-if="!props.row.categorys && !props.row.remark"
                      >
                        <div class="paymentmesg1">暂无促销信息</div>
                      </div>
                    </el-form>
                  </template>
                </el-table-column>
                <el-table-column
                  label="商品名称"
                  align="center"
                  prop="displayName"
                >
                </el-table-column>
                <el-table-column
                  label="充值金额"
                  align="center"
                  prop="paidamount"
                  width="100"
                >
                  <template slot-scope="scope">
                    ¥{{ scope.row.paidamount }}
                  </template>
                </el-table-column>
                <el-table-column
                  label="已使用金额"
                  align="center"
                  prop="usedAmount"
                >
                  <template slot-scope="scope">
                    ¥{{ scope.row.usedAmount }}
                  </template>
                </el-table-column>
                <el-table-column
                  label="当前剩余可用金额"
                  align="center"
                  prop="leftAmount"
                >
                  <template slot-scope="scope">
                    ¥{{ scope.row.leftAmount }}
                  </template>
                </el-table-column>
                <el-table-column
                  label="导购员编号"
                  align="center"
                  prop="sellerId"
                >
                </el-table-column>
                <el-table-column
                  label="导购员姓名"
                  align="center"
                  prop="sellerName"
                >
                </el-table-column>
                <el-table-column
                  label="操作"
                  fixed="right"
                  width="100"
                  align="center"
                  prop="refundFlag"
                >
                  <template slot-scope="scope">
                    <div
                      v-if="
                        scope.row.refundFlag == 1 &&
                          LOGINDATA.orderplatform_earnestMoneyorder_money
                      "
                    >
                      <a
                        @click="
                          jumpto('/order/depositRetreat_apply', {
                            orderId: orderId
                          })
                        "
                      >
                        申请退定金
                      </a>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="content_title">订金变更明细</div>
            <div
              class="el-table el-table--fit el-table--border el-table--enable-row-hover el-table--enable-row-transition el-table--small"
              style="overflow-x:auto;"
            >
              <el-table
                :data="response.orderRichLogList"
                border
                style="width: 100%"
                :show-header="true"
              >
                <el-table-column
                  prop="createDate"
                  label="时间"
                  align="center"
                ></el-table-column>
                <el-table-column
                  prop="changeTypeName"
                  label="订金明细类型"
                  align="center"
                >
                </el-table-column>
                <el-table-column
                  prop="changeAmount"
                  label="明细金额"
                  align="center"
                >
                  <template slot-scope="scope">
                    <div
                      v-if="
                        scope.row.changeType == 1 || scope.row.changeType == 4
                      "
                    >
                      +¥{{ scope.row.changeAmount }}
                    </div>
                    <div
                      v-if="
                        scope.row.changeType == 2 || scope.row.changeType == 3
                      "
                    >
                      -¥{{ scope.row.changeAmount }}
                    </div>
                    <div
                      v-if="
                        scope.row.changeType == 0
                      "
                    >
                      ¥{{ scope.row.changeAmount }}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="sceneType"
                  label="操作类型"
                  align="center"
                >
                  <template slot-scope="scope">
                    <div v-if="scope.row.sceneType == 1">
                      订金充值
                    </div>
                    <div v-if="scope.row.sceneType == 2">
                      购物消耗
                    </div>
                    <div v-if="scope.row.sceneType == 3">
                      消耗返还(订单取消/退货)
                    </div>
                    <div v-if="scope.row.sceneType == 4">
                      订金退还(审核中)
                    </div>
                    <div v-if="scope.row.sceneType == 5">
                      订金退还(审核不通过)
                    </div>
                    <div v-if="scope.row.sceneType == 6">
                      订金退还(取消)
                    </div>
                    <div v-if="scope.row.sceneType == 7">
                      订金退还(成功)
                    </div>
                    <div v-if="scope.row.sceneType == 8">
                      订金退还
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="surplusAmount"
                  label="剩余使用金额"
                  align="center"
                >
                  <template slot-scope="scope">
                    ¥{{ scope.row.surplusAmount }}
                  </template>
                </el-table-column>
                <el-table-column label="备注" align="center">
                  <template slot-scope="scope">
                    <div v-if="scope.row.sceneType == 1 && scope.row.changeType != 0">
                      订金编号：{{ scope.row.businessId }}
                    </div>
                    <div
                      v-if="
                        scope.row.sceneType == 2 || scope.row.sceneType == 3
                      "
                    >
                      订单编号：
                      <a
                        @click="
                          jumpto('/order/orderdetails', {
                            orderId: scope.row.businessId,
                            storeCode: response.storeCode
                          })
                        "
                      >
                        {{ scope.row.businessId }}
                      </a>
                    </div>
                    <div
                      v-if="
                        scope.row.sceneType == 4 ||
                          scope.row.sceneType == 5 ||
                          scope.row.sceneType == 6 ||
                          scope.row.sceneType == 7
                      "
                    >
                      退订金编号：<a
                        @click="
                          jumpto('/order/depositRetreat_details', {
                            refundId: scope.row.refundId
                          })
                        "
                      >
                        {{ scope.row.refundId }}
                      </a>
                    </div>
                     <div v-if="scope.row.changeType == 0">
                      支票待解锁
                    </div>
                    <div v-if="scope.row.sceneType == 8">
                      支票未解锁，订单已取消
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-collapse-item>
        <el-collapse-item title="订单履历" name="2">
          <!-- 订单履历 -->
          <div class="ordercont_box" v-if="orderHistoryList.length">
            <ul>
              <li
                class="item"
                v-for="item in orderHistoryList"
                :key="item.remark"
              >
                <span class="item_time">{{ item.createDate }}</span
                ><span class="item_cont">{{ item.remark }}</span>
              </li>
            </ul>
          </div>
          <div class="ordercont_box" v-if="!orderHistoryList.length">
            暂无信息
          </div>
        </el-collapse-item>
        <el-collapse-item
          title="支付信息"
          name="3"
          v-if="response.orderPayList"
        >
          <!-- 支付信息 -->
          <div
            class="order_details_cont"
            v-for="(paymentItem) in response.orderPayList"
            :key="paymentItem.paymentId"
          >
            <div class="paymentmesg">
              <span class="ml20">支付单号：{{ paymentItem.paymentId }}</span
              ><span class="ml20">支付类型：{{ paymentItem.paymentType }}</span>
            </div>
            <div
              class="el-table el-table--fit el-table--border el-table--enable-row-hover el-table--enable-row-transition el-table--small"
              style="overflow-x:auto;"
            >
              <el-table
                :data="paymentItem.paymentGroupInfoList"
                border
                :show-header="true"
                size="small "
              >
                <el-table-column
                  prop="paymentMethod"
                  label="支付方式"
                  align="center"
                ></el-table-column>
                <el-table-column
                  prop="transId"
                  label="交易流水号"
                  align="center"
                ></el-table-column>
                <el-table-column
                  prop="cashierPayNo"
                  label="收银台支付号"
                  align="center"
                ></el-table-column>
                <el-table-column
                  prop="paymentAmount"
                  label="交易金额"
                  align="center"
                >
                  <template slot-scope="scope">
                    ¥{{ scope.row.paymentAmount }}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="createDate"
                  label="交易时间"
                  align="center"
                ></el-table-column>
                <el-table-column
                  prop="updateDate"
                  label="交易处理时间"
                  align="center"
                ></el-table-column>
              </el-table>
            </div>
          </div>
        </el-collapse-item>
        <el-collapse-item title="退订金信息" name="4">
          <div class="order_details_cont">
            <div
              class="el-table el-table--fit el-table--border el-table--enable-row-hover el-table--enable-row-transition el-table--small"
              style="overflow-x:auto;"
            >
              <el-table
                :data="response.refundList"
                border
                style="width: 100%"
                :show-header="true"
              >
                <el-table-column
                  prop="refundId"
                  label="退订金单号"
                  align="center"
                >
                  <template slot-scope="scope">
                    <a
                      @click="
                        jumpto('/order/depositRetreat_details', {
                          refundId: scope.row.refundId
                        })
                      "
                    >
                      {{ scope.row.refundId }}
                    </a>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="createDate"
                  label="提交时间"
                  align="center"
                ></el-table-column>
                <el-table-column
                  prop="auditStatusName"
                  label="退订金状态"
                  align="center"
                ></el-table-column>
                <el-table-column
                  prop="refundId"
                  label="退款单号"
                  align="center"
                ></el-table-column>
                <el-table-column
                  prop="refundStatusName"
                  label="退款单状态"
                  align="center"
                ></el-table-column>
                <el-table-column
                  prop="refundDate"
                  label="退订金完成时间"
                  align="center"
                ></el-table-column>
              </el-table>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
    <div class="order_details_r">
      <g-header v-model="righttitle"></g-header>
      <div
        class="orderinfo"
        v-if="response.orderId || response.createDate || response.statusName"
      >
        <div class="item" v-if="response.orderId">
          <span class="label">订单编号： </span>
          <div class="info-rcol">{{ response.orderId }}</div>
        </div>
        <div class="item" v-if="response.createDate">
          <span class="label">下单时间：</span>
          <div class="info-rcol">{{ response.createDate }}</div>
        </div>
        <div class="item" v-if="response.statusName">
          <span class="label"> 订单状态：</span>
          <div class="info-rcol">{{ response.statusName }}</div>
        </div>
      </div>
      <div class="orderinfo" v-if="response.userCard || response.userMobile">
        <div class="item" v-if="response.userCard">
          <span class="label">会员卡号： </span>
          <div class="info-rcol">{{ response.userCard }}</div>
        </div>
        <div class="item" v-if="response.userMobile">
          <span class="label">会员电话：</span>
          <div class="info-rcol">{{ response.userMobile }}</div>
        </div>
      </div>
      <div
        class="orderinfo"
        v-if="response.payType || response.payMethod || response.site"
      >
        <div class="item" v-if="response.payType">
          <span class="label">支付类型： </span>
          <div class="info-rcol">{{ response.payType }}</div>
        </div>
        <div class="item" v-if="response.payMethod">
          <span class="label">支付方式：</span>
          <div class="info-rcol">{{ response.payMethod }}</div>
        </div>
        <div class="item" v-if="response.site">
          <span class="label">订单站点：</span>
          <div class="info-rcol">{{ response.site }}</div>
        </div>
      </div>
      <div class="payinfor">
        <div
          class="item mt10"
          v-for="(item, index) in response.amountDetailList"
          :key="index"
        >
          <span class="label">{{ item.name }}：</span>
          <div class="info-rcol">¥{{ item.amount }}</div>
        </div>
        <div class="item mt10">
          <span class="label">实收金额总计：</span>
          <div class="info-rcol">¥{{ response.orderAmount }}</div>
        </div>
      </div>
      <div class="orderctrolbox" v-if="param.source!=='4'">
        <el-button
          type="primary"
          size="small"
          @click="delateReasonlist"
          v-if="
            response.cancelFlag == 1 &&
              LOGINDATA.orderplatform_earnestMoneyorder_delete
          "
          >删单</el-button
        >
        <el-button
          type="primary"
          size="small"
          @click="payFor"
          v-if="
            response.payFlag == 1 &&
              LOGINDATA.orderplatform_earnestMoneyorder_receivables
          "
          >立即收款</el-button
        >
      </div>
    </div>
    <iframe
      v-show="isPayFor"
      id="payFrame"
      name="payFrame"
      pay-state="getPayStates"
      onload="this.style.height=document.body.clientHeight"
      height="100%"
      scrolling="auto"
      frameborder="0"
      width="100%"
      style="position: fixed;top: 0px;left: 0px;width: 100%;height: 100%;z-index: 999999999;"
      allowtransparency="true"
    ></iframe>
  </div>
</template>
<script type="text/javascript">
import { mapState, mapActions } from "vuex";
import API from "@/api/earnestmoneyorder/earnestmoneyorder";
export default {
  data() {
    return {
      isPayFor: false, //收银台弹窗
      righttitle: {
        showclose: "", //右面的关闭
        content: "订单信息"
      },
      param: { orderId: this.$route.query.orderId, source: this.$route.query.source },
      orderIdname: "订单id：",
      orderId: this.$route.query.orderId,
      queryorder: false, //是否刷新履历
      returninfo: false, //退货信息是否刷新
      pageactiveNames: ["1"], //页面左侧第一个展开
      orderHistoryList: [],
      response: {}
    };
  },
  computed: {
    ...mapState({
      //vuex取值
      LOGINDATA: "LOGINDATA"
    })
  },
  created() {
    var that = this;
    if (!this.$route.query.orderId) {
      location.href = "/order/earnestMoneyorder_select";
      return false;
    }

    that.initData();
  },
  mounted() {
    var that = this;
    window.getPayStates = function(val) {
      that.isPayFor = false;
      document.getElementById("payFrame").src = "";
      if (val.order_status == "00") {
        that.initData();
      }
    };
  },
  methods: {
    initData() {
      var that = this;

      API.queryOrderDetail(that.param).then(res => {
        //详情页初始化展示大load

        if (res.success) {
          that.response = res.response;
        }
      });
      API.queryOrderLogList(that.param).then(res => {
        //订单履历

        if (res.success) {
          that.orderHistoryList = res.response;
        }
      });
    },
    //订单履历
    handleChange(val) {
      //订单履历 标题栏点击回调，val 是数组
      //订单履历 标题栏点击回调，val 是数组
      let _this = this;
      if (val.length > 0) {
        val.forEach(function(element) {
          if (element == 2) {
            //订单
            _this.queryorder = true;
          } else {
            _this.queryorder = false;
          }
          if (element == 4) {
            //退货
            _this.returninfo = true;
          } else {
            _this.returninfo = false;
          }
        }, this);
      } else {
        _this.queryorder = false;
        _this.returninfo = false;
      }
    },
    delateReasonlist() {
      var that = this;

      that
        .$confirm("您确定要删除此订单吗?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          API.cancelOrder(that.param).then(res => {
            console.log(res);
            if (res.success) {
              that.$message({
                showClose: true,
                message: "删单成功",
                type: "success",
                onClose: function() {
                  //刷新页面
                  location.reload();
                }
              });
            } else {
              that.$message({
                showClose: true,
                message: res.respMsg,
                type: "error"
              });
            }
          });
        });
    },
    payFor() {
      var that = this;
      API.confirmPayForCart(that.param).then(res => {
        if (res.success) {
          if (res.response != null) {
            that.isPayFor = true;
            document.getElementById("payFrame").src = res.response;
          }
        } else {
          that.$message({
            showClose: true,
            message: res.respMsg,
            type: "warning"
          });
        }
      });
    },
    //跳转
    jumpto(path, parms) {
      //跳转页面
      //this.$router.push(to?to:'/order/orderindex');
      let routeData = this.$router.resolve({ path: path, query: parms });
      window.open(routeData.href, "_blank");
    }
  }
};
</script>
<style type="text/css">
a {
  cursor: pointer;
  color: #409eff;
}
.mb10 {
  margin-bottom: 10px;
}
.mr20 {
  margin-right: 20px;
}
.mt10 {
  margin-top: 10px;
}
.ml20 {
  margin-left: 20px;
}
.eMorder_detailsbox_l {
  margin-right: 320px;
  border: 1px solid #e4e7ed;
}
.order_details_r {
  position: fixed;
  width: 300px;
  border: 1px solid #e4e7ed;
  right: 20px;
  top: 20px;
}
.orderinfo,
.payinfor,
.orderctrolbox {
  width: 280px;
  margin: 10px auto;
  background: #f2f6fc;
  color: #303133;
  padding: 5px 0;
}
.orderinfo .item {
  width: 260px;
  display: flex;
  /* height: 30px; */
  line-height: 30px;
  padding-left: 20px;
}
.orderinfo .item .label {
  /* flex: 0 0 100px; */
  text-align: right;
}
.orderinfo .item .info-rcol {
  flex: 1;
  text-align: left;
}
.mb10 {
  margin-bottom: 10px;
}
.payinfor {
  background: #ebeef5;
  font-size: 12px;
}
.payinfor .item {
  width: 220px;
  display: flex;
  height: 24px;
  line-height: 24px;
  padding-left: 20px;
}
.payinfor .item .label {
  /* flex: 0 0 200px; */
  text-align: right;
}
.payinfor .item .info-rcol {
  flex: 1;
  text-align: left;
}
.orderdetails_title .el-collapse-item__header {
  line-height: 36px;
  background: #409eff;
  height: 36px;
  color: #fff;
  font-size: 14px;
  font-weight: bold;
  padding-left: 15px;
  overflow: hidden;
  clear: both;
}
.el-collapse-item__header.focusing:focus:not(:hover) {
  color: #fff;
}
.order_details_cont {
  padding: 20px;
}
.content_title {
  height: 30px;
  line-height: 30px;
  margin-top: 10px;
  font-weight: bold;
  border-bottom: 1px solid #e4e7ed;
  margin-bottom: 10px;
}
.states {
  display: flex;
  border-bottom: 1px solid #409eff;
  height: 39px;
  margin-bottom: 20px;
}
.states .states_l {
  position: relative;
  flex: 0 0 500px;
  line-height: 40px;
  text-align: left;
  font-weight: bold;
}
.states .states_r {
  flex: 1;
  text-align: right;
}
.ordercont_box {
  border: none;
  padding: 10px;
}
.ordercont_box .item {
  line-height: 30px;
  display: flex;
  color: #303133;
}
.ordercont_box .item .item_time {
  flex: 0 0 180px;
  margin-left: 50px;
}
.ordercont_box .item .item_cont {
  flex: 1;
}
thead.has-gutter th,
.el-table th.is-leaf {
  background: #eef6ff;
  padding: 8px;
  font-size: 12px;
}
.paymentmesg {
  height: 30px;
  line-height: 30px;
  margin-bottom: 10px;
}
.el-collapse-item__arrow {
  height: 35px;
  line-height: 35px;
}
.el-table__expand-icon > .el-icon {
  width: 16px;
  height: 16px;
  margin-top: -6px;
  background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjA2NDg0QUYzMTU3RjExRTk4NDBBRkQwODZFOURERTQxIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjA2NDg0QUY0MTU3RjExRTk4NDBBRkQwODZFOURERTQxIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MDY0ODRBRjExNTdGMTFFOTg0MEFGRDA4NkU5RERFNDEiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MDY0ODRBRjIxNTdGMTFFOTg0MEFGRDA4NkU5RERFNDEiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6RhlW0AAAB00lEQVR42mL8//8/AxL4/ebejfOnj9z9BGTzK1uaG6ori7AiK2CEa/j95vTC/gVH37DKamhLcoKFvr+4fOPJbxHLlMJoc7i2/2Dw4eSsvLSS9q03PvxHAx+ub+0BSk07CZUBafh1aVZmUtOqh78Qyn59/YrMe7i2Nil/2qVfEA03Zmen9Rz5imzss621FVufI4t8PTIxIXv+9f//mX6f2nmUyynUmosBL+CyDgvhP7711G+mG+euSjjYyzEQBBJG1uJXzt1kefSYQdJMAhRKz6+ce/wdIvnx3vdvDFdPnnoMNV7WQFeSVVJCguHoExa4CR9v7ly28QWU8+3TJ4Ydy+5CeZL+irqSIhA2CxcXw+/vvxkYWEUciic6QFU831Y3iSGr3UsCxVF/gHZxMikrCd+9cZOBCHD58i1hJSUmOQc7/mNb9n8kpPzbsV3H+BwdZJkYJJ2jTF8s6t/xHEmWlYufn4sFSeDF1q6Fd03D3CShSeP5lvq0zM49yHGNFM+PdnbmJ9RvfwbmwRLf78e7+ictv8tp6B8UYK0myc/FyvD728cXN45uXr3x4jflsOJCZzlW1NQKCtlHxzYs3nLk3ts/UAEWYSWrgFgfGzl+uBqAAAMArAgwrgV46BAAAAAASUVORK5CYII=");
}
.el-table__expand-icon--expanded {
  transform: none;
}
.el-icon-arrow-right:before {
  content: "";
}
.el-table__expand-icon--expanded > .el-icon {
  background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkVGRDcxNkUzMTU3RTExRTk5QkUxODkyMTExMkE2RUM4IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkVGRDcxNkU0MTU3RTExRTk5QkUxODkyMTExMkE2RUM4Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RUZENzE2RTExNTdFMTFFOTlCRTE4OTIxMTEyQTZFQzgiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RUZENzE2RTIxNTdFMTFFOTlCRTE4OTIxMTEyQTZFQzgiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4a0wOWAAABFFBMVEWTlZiveWb19+Lw9/qvfWbd9/pgfbRgebRgYmaOyPptZnP18t7Z8vr1yJT19/Vth7lgldDLlWb137SFsdXB5PWJw/VgZn3r6d7w5Mdga51yo96htdCFuudpYoHLmW/Z6fDwzZjrv4/nw5jn28Liuovww4/17cKXa2bL3/Xn9/rw5NlpZma4gmaTw+xgdKazh293ZmaJv/W92+yJv/Bph7ndsX3GsZTPsYtpldDU5PXLtaav3/rw26vP9/rw39D19+yJYn1ygqKTzfVpmdBkeZ2cgnhgZm9ggr3LlW97i5il2/X199XZ9/qXeWp3seJkYmZgYmp7Ym+zh3P1w5TZo3iTi4GOscu46fp3YoZtb3PBw8f19/of7bF8AAAAq0lEQVR42kyPhQ6DQAxAy5gwYMzd3d3d3V3u//9jd4MMXtKmfU3TFBAh0wHwtn8l4HDtF2uAe3ZmE0WEtabJbNhk80SE/Bsk0TtPEGyTVfQn7O5DvLCThYqyg/mAFNRNQOnR4CORQgYdEbG3hI+IXFm5cl3CbaoUAQ9YXk+5T4y6IKy0mv9VdYsGnGu82HNFPMO/cBfHI0gLzkbJyIvfouj8yDCncYXUXwEGAAiCRD0akPSeAAAAAElFTkSuQmCC");
}
.tips{
  margin-left:20px;
  color: #FF161A;
  font-weight: normal;  
}
</style>