<template>
  <div>
    <el-header class="billing-el-header">
      <BillHeader @bind-header="bindHeader"></BillHeader>
    </el-header>
    <div v-if="billingpurchase==null" style="text-align:center;margin-top:150px">
      <img src="../../assets/images/default.png" alt>
    </div>
    <div v-if="billingpurchase==null" style="text-align:center;margin-top:15px">导购单没有商品!</div>
    <div class="border" v-if="billingpurchase">
      <div>
        <el-row v-if="billingpurchase.member">
          <el-col :span="24" v-if="billingpurchase.member.temporaryCardFlag!='1'">
            <span
              style="margin-right:15px"
              v-if="billingpurchase.member.memberCardName"
            >{{billingpurchase.member.memberCardName}}</span>
            <span>{{billingpurchase.member.memberMobile}}</span>
          </el-col>
          <el-col :span="24" v-if="billingpurchase.member.temporaryCardFlag=='1'">
            <span style="margin-right:15px">临时卡</span>
            <span>{{billingpurchase.member.memberCard}}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div class="line"></div>
          </el-col>
        </el-row>
        <div
          class="mt20 el-table el-table--fit el-table--border el-table--enable-row-hover el-table--enable-row-transition"
          style="width: 100%;"
        >
          <div class="el-table__body-wrapper is-scrolling-none">
            <table
              cellspacing="0"
              cellpadding="0"
              border="0"
              class="el-table__header"
              style="width: 100%;"
            >
              <thead class="has-gutter">
                <tr>
                  <th
                    colspan="1"
                    rowspan="1"
                    class="el-table_2_column_4 is-center is-leaf"
                    width="400px"
                  >
                    <div class="cell">可购买延保的商品</div>
                  </th>
                  <th colspan="1" rowspan="1" class="el-table_2_column_5 is-center is-leaf">
                    <div class="cell">选择延保</div>
                  </th>
                  <th colspan="1" rowspan="1" class="el-table_2_column_6 is-center is-leaf">
                    <div class="cell">可购数量</div>
                  </th>
                  <th colspan="1" rowspan="1" class="el-table_2_column_7 is-center is-leaf">
                    <div class="cell">单价</div>
                  </th>
                  <th colspan="1" rowspan="1" class="el-table_2_column_8 is-center is-leaf">
                    <div class="cell">金额</div>
                  </th>
                </tr>
              </thead>
              <tbody
                class="el-table__body"
                v-for="item in billingpurchase.sellerBillList"
                :key="item.id"
              >
                <tr v-if="item.buyIncrement.incrementInfoList.length>1">
                  <td
                    class="el-table_2_column_5 is-center"
                    :rowspan="(item.buyIncrement.incrementInfoList.length)+2"
                  >
                    <div class="cell">
                      <div>商品编码：{{item.buyIncrement.mainSkuNo}}</div>
                      <div class="product">{{item.buyIncrement.mainDisplaySkuName}}</div>
                    </div>
                  </td>
                </tr>
                <tr
                  class="el-table__row"
                  v-for="list in item.buyIncrement.incrementInfoList"
                  :key="list.id"
                >
                  <td
                    class="el-table_2_column_5 is-center"
                    v-if="item.buyIncrement.incrementInfoList.length==1"
                    rowspan="2"
                  >
                    <div class="cell">
                      <div>商品编码：{{item.buyIncrement.mainSkuNo}}</div>
                      <div class="product">{{item.buyIncrement.mainDisplaySkuName}}</div>
                    </div>
                  </td>
                  <td class="el-table_2_column_5 is-center">
                    <div class="cell">{{list.displaySkuName}} {{list.years}}年</div>
                    <!-- <ExtendedWarranty 
                                :pGoodsData="item.buyIncrement"
                                :displaySkuName="list.displaySkuName"
                                :years="list.years"
                              >
                    </ExtendedWarranty>-->
                  </td>
                  <td class="el-table_2_column_6 is-center">
                    <div class="cell">{{list.quantity}}</div>
                  </td>
                  <td class="el-table_2_column_7 is-center">
                    <div class="cell">￥{{list.incrementPrice}}</div>
                  </td>
                  <td class="el-table_2_column_8 is-center">
                    <div class="cell">￥{{list.incrementAmount}}</div>
                  </td>
                </tr>
                <tr class="el-table__row">
                  <td class="el-table_2_column_5 is-center">
                    <ExtendedWarranty :pGoodsData="item.buyIncrement"></ExtendedWarranty>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="border footer mt20" v-if="billingpurchase">
        <!-- 发票 -->
        <el-row class="mb10">
          <el-col>
            <Invoice
              :invoiceP="billingpurchase.invoice || {}"
              :poolFlag="billingpurchase.seller && billingpurchase.seller.poolFlag || ''"
            ></Invoice>
          </el-col>
        </el-row>
        <el-row>
          <el-col
            v-if="billingpurchase.gomedo && billingpurchase.gomedo.canUseGomedos>=100 && billingpurchase.isShowGomedo=='1' && billingpurchase.gomedo.status == '1'"
          >
            <span style="margin-right:10px;">美豆：</span>
            <el-checkbox @change="isSelectedMeidou" v-model="ismeidou"></el-checkbox>
            <span>本次可使用</span>
            <el-select
              v-model="gomedoValue"
              filterable
              @blur="meidou"
              name="meidou"
              style="width:120px"
              @change="changeMeidou"
            >
              <el-option v-for="item in gomedo" :label="item" :key="item" :value="item"></el-option>
            </el-select>
            <span>美豆，用户账户共</span>
            <span
              class="font_f"
              v-if="billingpurchase.gomedo"
            >{{billingpurchase.gomedo.totalGomedos}}</span>美豆，可抵
            <span
              class="font_f red"
              style
              v-if="billingpurchase.gomedo"
            >{{billingpurchase.gomedo.canUseGomedoAmount}}</span>元
          </el-col>
          <!-- 美豆当日限额用完&& billingpurchase.gomedo.canUseGomedos==0 -->
          <el-col
            v-if="billingpurchase && billingpurchase.gomedo &&   billingpurchase.gomedo.canUseGomedos==0 && billingpurchase.isShowGomedo=='1' &&  billingpurchase.gomedo.status == '3'"
          >
            <span style="margin-right:10px;">美豆：</span>
            <el-checkbox disabled></el-checkbox>
            <span>本次可使用</span>
            <span>{{ billingpurchase.gomedo.canUseGomedos }}</span>
            <span>美豆，用户账户共</span>
            <span
              class="font_f"
              v-if="billingpurchase.gomedo"
            >{{billingpurchase.gomedo.totalGomedos}}</span>美豆，已超单日最大100万使用限额
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div class="line2"></div>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <div style="float:right" v-if="billingpurchase.totalInfo">
              <span class="mr">
                数量：
                <span class="font_f">{{billingpurchase.totalInfo.quantity}}</span>
              </span>
              <span class="mr" v-if="billingpurchase.totalInfo.incrementAmount!='0.00'">
                延保金额:
                <span class="font_f">￥{{billingpurchase.totalInfo.incrementAmount}}</span>
              </span>
              <span class="mr" v-if="billingpurchase.totalInfo.couponAmount!='0.00'">
                用券金额:
                <span class="font_f">-￥{{billingpurchase.totalInfo.couponAmount}}</span>
              </span>
              <span class="mr" v-if="billingpurchase.totalInfo.gomedoAmount!='0.00'">
                使用美豆:
                <span class="font_f">-￥{{billingpurchase.totalInfo.gomedoAmount}}</span>
              </span>
              <span class="mr">
                应收金额：
                <span class="font_f red">¥{{billingpurchase.totalInfo.finalAmount}}</span>
              </span>
              <el-button type="primary" @click="submit()">提交</el-button>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-dialog
            title="输入美豆支付验证码"
            :visible.sync="meidouInformatione"
            width="400px"
            class="meidou"
            @close="closeCode"
          >
            <el-row v-if="billingpurchase.member">
              <div class="mb10">会员手机号：{{billingpurchase.member.memberMobile}}</div>
              <el-input placeholder="请输入验证" style="width:240px;" class="mr10" v-model="chapchaCode"></el-input>
              <el-button
                plain
                round
                v-if="!show"
                class="count"
              >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{count}} s&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</el-button>
              <el-button plain round v-if="show" @click="getIdentifyingCode()">获取验证码</el-button>
            </el-row>
            <div slot="footer" class="dialog-footer">
              <el-button
                type="primary"
                @click="meidouSure()"
                size="mini"
                style="margin-left:220px"
              >确定</el-button>
              <el-button type="primary" @click="closeCode" size="mini">取消</el-button>
            </div>
          </el-dialog>
        </el-row>
        <!-- <el-row>
         <el-dialog
              title="提示"
              :visible.sync="lastVisible"
              width="450px"
              align="left"
              :show-close="false"
              :close-on-click-modal="false"
              :close-on-press-escape="false">
              <span>{{messageTip}}</span>
              <div slot="footer" class="dialog-footer">
                  <el-button type="primary" size="mini" @click="goto">确 定</el-button>
              </div>
          </el-dialog>
        </el-row>-->
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapState, mapMutations } from "vuex";
import Promotion from "@/components/billingPurchase/promotion";
import Invoice from "@/components/commons/invoice";
import BillHeader from "@/components/billHeader/billHeader";
import API from "@/api/billingPurchase/billingPurchase";
import { formatDate } from "@/common/time";
import "@/common/tofixed";
import ExtendedWarranty from "@/components/purchaseExtension/extendedWarranty";
import Env from "@/api/env";
export default {
  data() {
    return {
      checkAll: false,
      checkedCities: [],
      gomedo: [], //美豆下拉框list
      gomedoValue: 0,
      // 发票变量 结束
      meidouInformatione: false,
      chapchaCode: "", //短信验证码
      submitchapchaCode: "",
      ismeidou: false, //是否勾选美豆
      dialogFormVisible: false,
      //倒计时变量
      show: true,
      count: "",
      timer: null,
      flag: true,
      isFrontmoney: false
      // lastVisible:false,
      // messageTip:''
    };
  },
  components: {
    BillHeader,
    Invoice,
    ExtendedWarranty
  },
  computed: {
    ...mapState([
      "billingpurchase", //大接口数据
      "billingUsedParam" //会员信息
    ])
  },
  created() {
    this.init();
  },
  watch: {
    billingpurchase: {
      handler: function() {
        this.init();
      },
      deep: true
    }
  },
  methods: {
    ...mapMutations({
      SET_BILLING_USED_PARAM: "SET_BILLING_USED_PARAM"
    }),
    ...mapActions(["billingpurchaseInit"]),
    //头部接口调用自定义事件
    bindHeader(v) {
      var that = this;
      //大load参数赋值
      for (var attr in this.$route.query) {
        this.SET_BILLING_USED_PARAM({
          attr: attr,
          value: this.$route.query[attr]
        });
      }
      this.billingpurchaseInit(this);
    },
    init(v) {
      var that = this;

      //美豆阶梯
      if (that.billingpurchase && that.billingpurchase.gomedo) {
        var gomedo = [];
        var maxMeidou = that.billingpurchase.gomedo.canUseGomedos; //用户账户中可使用的最大美豆数
        if (that.billingpurchase.gomedo.isUsed == "1") {
          that.ismeidou = true;
          that.gomedoValue = that.billingpurchase.gomedo.offlineGomedos;
        } else {
          that.ismeidou = false;
          that.gomedoValue = maxMeidou; //默认值是可使用的最大美豆数
        }
        gomedo.push(maxMeidou);
        while (maxMeidou > 100) {
          maxMeidou = maxMeidou - 100;
          gomedo.push(maxMeidou);
        }
        that.gomedo = gomedo;
      }
      //判断全选还是不全选
      that.checkAll = true;
      that.isFrontmoney = false;
      if (that.billingpurchase && that.billingpurchase.sellerBillList) {
        var sellerBillList = that.billingpurchase.sellerBillList;
        for (var i = 0; i < sellerBillList.length; i++) {
          if (sellerBillList[i].isSelected == "0") {
            that.checkAll = false;
          }
          if (
            that.billingUsedParam.siteType == 2 &&
            head != "" &&
            sellerBillList[i].isSelected == "1"
          ) {
            //判断是预售商品并且是定金
            that.isFrontmoney = true;
          }
        }
      }
    },

    //点击提交按钮
    submit() {
      var that = this;
      //判断是否填写发票
      if (
        that.billingpurchase.invoice.headType == "" &&
        that.billingpurchase.invoice.invoiceType == "" &&
        that.billingpurchase.seller.poolFlag != "1" &&
        that.billingpurchase.seller.poolFlag != "2"
      ) {
        this.$message({
          message: "请输入发票信息后提交",
          type: "warning"
        });
        return false;
      }
      //判断是否勾选美豆
      if (that.ismeidou) {
        that.meidouInformatione = true;
      } else {
        var billingUsedParam = JSON.parse(
          JSON.stringify(this.billingUsedParam)
        );

        billingUsedParam.agentId = that.billingpurchase.seller.sellerNum;
        billingUsedParam.sellerCartId = that.billingpurchase.sellerCartId;
        billingUsedParam.chapchaCode = that.submitchapchaCode;
        billingUsedParam.temporaryCardFlag = Number(
          that.billingUsedParam.temporaryCardFlag
        );
        billingUsedParam.dccc = that.billingpurchase.dccc;
        var storeCode = billingUsedParam.storeCode;
        API.commitOrder(billingUsedParam).then(data => {
          if (data.success && data.response && data.response.orderId) {
            that.meidouInformatione = false;
            // that.lastVisible=true;
            // that.messageTip='导购单已提交成功，生成的订单号为：'+data.response.orderId+'；请告知或引导顾客去收银台付款。'
            var url =
              "//mpf" +
              Env.cookieDomain +
              "/order/orderdetailsbeforesplit?orderId=" +
              data.response.orderId +
              "&storeCode=" +
              storeCode;
            window.location.href = url;
            this.billingpurchaseInit(this);
            //this.init();
          } else {
            this.$message({
              message: data.respMsg,
              type: "warning"
            });
          }
        });
      }
    },
    // goto(){
    //   var url='//mpf'+Env.cookieDomain+'/order/orderindex';
    //   window.location.href=url;
    //   this.lastVisible=false;
    //   this.billingpurchaseInit(this);
    // },
    closeCode() {
      this.meidouInformatione = false;
      clearInterval(this.timer);
      this.timer = null;
      this.show = true;
    },
    //获取验证码
    getIdentifyingCode() {
      var that = this;
      var TIME_COUNT = 60;
      var data = {
        memberId: that.billingpurchase.member.memberId, //会员id
        mobile: that.billingpurchase.member.memberMobileShow //手机号18511752667
      };

      API.resendVerificationCode(data).then(data => {
        if (data.success) {
        } else {
          this.$message({
            message: data.respMsg,
            type: "warning"
          });
        }
      });
      if (!this.timer) {
        this.count = TIME_COUNT;
        this.show = false;
        this.timer = setInterval(() => {
          if (this.count > 0 && this.count <= TIME_COUNT) {
            this.count--;
          } else {
            this.show = true;
            clearInterval(this.timer);
            this.timer = null;
          }
        }, 1000);
      }
    },
    //使用美豆提交订单
    meidouSure() {
      var that = this;
      var billingUsedParam = JSON.parse(JSON.stringify(this.billingUsedParam));
      that.submitchapchaCode = that.chapchaCode;
      billingUsedParam.agentId = that.billingpurchase.seller.sellerNum;
      billingUsedParam.sellerCartId = that.billingpurchase.sellerCartId;
      billingUsedParam.temporaryCardFlag = Number(
        that.billingUsedParam.temporaryCardFlag
      );
      billingUsedParam.dccc = that.billingpurchase.dccc;
      var storeCode = billingUsedParam.storeCode;
      if (that.submitchapchaCode) {
        billingUsedParam.chapchaCode = that.submitchapchaCode;
        API.commitOrder(billingUsedParam).then(data => {
          if (data.success && data.response && data.response.orderId) {
            that.meidouInformatione = false;
            // that.lastVisible=true;
            // that.messageTip='导购单已提交成功，生成的订单号为：'+data.response.orderId+'；请告知或引导顾客去收银台付款。'
            var url =
              "//mpf" +
              Env.cookieDomain +
              "/order/orderdetailsbeforesplit?orderId=" +
              data.response.orderId +
              "&storeCode=" +
              storeCode;
            window.location.href = url;
            this.billingpurchaseInit(this);
          } else {
            this.$message({
              message: data.respMsg,
              type: "warning"
            });
          }
        });
      } else {
        this.$message({
          message: "请输入验证码",
          type: "warning"
        });
      }
    },
    //删除导购单
    delate(val) {
      var that = this;
      var data = {
        memberId: that.billingUsedParam.memberId, //会员卡ID
        memberCard: that.billingUsedParam.memberCard, //会员卡号
        temporaryCardFlag: that.billingUsedParam.temporaryCardFlag, //是否是临时卡
        sellerNum: that.billingUsedParam.sellerNum, //导购员编号
        storeCode: that.billingUsedParam.storeCode, //门店编码
        sellerBillId: val, //导购单ID
        sellerCartId: that.billingpurchase.sellerCartId, //导购车ID
        siteType: that.billingUsedParam.siteType //站点类型
      };
      this.$confirm("商品删除后无法恢复", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        customClass: "deal-billing-message-box",
        type: "warning"
      })
        .then(() => {
          API.deleteSellerBill(data).then(data => {
            if (data.success) {
              this.$message({
                type: "success",
                message: "删除成功"
              });
              this.billingpurchaseInit(this);
              // this.init();
            } else {
              this.$message({
                message: data.respMsg,
                type: "error"
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //是否使用美豆
    isSelectedMeidou(val) {
      var billingUsedParam = JSON.parse(JSON.stringify(this.billingUsedParam));
      if (this.ismeidou) {
        billingUsedParam.useGomeDoNum = String(this.gomedoValue);
        this.ismeidou = true;
      } else {
        this.ismeidou = false;
        billingUsedParam.useGomeDoNum = "0";
      }
      //console.log(this.ismeidou)
      //使用美豆
      API.useGomeDo(billingUsedParam).then(data => {
        if (data.success) {
          // this.bindHeader(this.gomedoValue);
          this.billingpurchaseInit(this);
        } else {
          this.$message({
            message: data.respMsg,
            type: "warning"
          });
        }
      });
    },
    //改变美豆数值
    changeMeidou(val) {
      //使用美豆
      var billingUsedParam = JSON.parse(JSON.stringify(this.billingUsedParam));
      billingUsedParam.useGomeDoNum = String(this.gomedoValue);
      //console.log(this.ismeidou)
      //使用美豆
      if (this.ismeidou) {
        API.useGomeDo(billingUsedParam).then(data => {
          if (data.success) {
            this.billingpurchaseInit(this);
          } else {
            this.$message({
              message: data.respMsg,
              type: "warning"
            });
          }
        });
      }
    },
    //美豆下拉框失去焦点
    meidou() {
      var that = this;
      var re = /^[0-9]+.?[0-9]*$/;
      var input = Number(document.getElementsByName("meidou")[0].value);
      var reg = /^[0-9]+$/;
      if (that.billingpurchase.gomedo) {
        if (!reg.test(input)) {
          this.$message({
            type: "warning",
            message: "请输入数字"
          });
        } else {
          if (input > that.billingpurchase.gomedo.canUseGomedos) {
            this.$message({
              type: "warning",
              message: "输入的美豆需要小于现有的可用金额"
            });
          } else if (input % 100 != 0) {
            this.$message({
              type: "warning",
              message: "输入的美豆需要为100的整数倍"
            });
          } else {
            that.gomedoValue = input;
            that.changeMeidou();
          }
        }
      }
    }
  },

  filters: {
    //时间格式转换
    formatDate(time) {
      if (time != null) {
        let date = new Date(time);
        return formatDate(date, "yyyy-MM-dd hh:mm:ss");
      }
    },
    formatDate2(time) {
      if (time != null) {
        let date = new Date(time);
        return formatDate(date, "yyyy-MM-dd");
      }
    }
  }
};
</script>
<style>
.mt {
  margin-top: 20px;
}
.mr {
  margin-right: 20px;
}
.mt20 {
  margin-top: 20px;
}
.mr10 {
  margin-right: 10px;
}
.mt15 {
  margin-top: 15px;
}
.mb10 {
  margin-bottom: 10px;
}
.font_f {
  font-family: "微软雅黑";
}
.red {
  color: #f56c6c;
}
.fl {
  float: left;
}
.line {
  background: #409eff;
  width: 100%;
  height: 2px;
  margin-top: 10px;
}
.line2 {
  background: #dcdfe6;
  width: 100%;
  height: 1px;
  margin: 10px 0 20px 0;
}
.border {
  border: 1px solid #dcdfe6;
  padding: 40px 20px 20px 20px;
}
.border2 {
  border: 1px solid #e4e7ed;
}
/* 表格样式 */
.el-table .has-gutter th,
.el-table .has-gutter tr {
  background: #eef6ff;
}
.product {
  white-space: nowrap; /* 不换行 */
  overflow: hidden; /* 内容超出宽度时隐藏超出部分的内容 */
  text-overflow: ellipsis; /* 当对象内文本溢出时显示省略标记(...) ；需与overflow:hidden;一起使用。*/
}
.skuName {
  vertical-align: middle;
  color: #409eff;
  cursor: pointer;
}

.borderleftline {
  padding-top: 20px;
  display: inline-block;
  width: 100px;
  height: 100px;
}
.product_img {
  float: left;
  border-left: 1px solid #e4e7ed;
  width: 140px;
  height: 140px;
  padding: 0 30px;
}
.product_price {
  position: absolute;
  top: 0;
  right: 10px;
}
.product_info {
  position: relative;
  top: 0;
  right: 0;
}
.product_name {
  height: 40px;
  margin: 5px 115px 15px 0;
  overflow: hidden;
}
[class*=" el-icon-"],
[class^="el-icon-"] {
  font-size: 18px;
  vertical-align: middle;
}
.gift_img {
  float: left;
}
.gift_name {
  float: left;
  width: 580px;
}
.gift_box {
  max-height: 500px;
  overflow-y: auto;
}
.disabledBackground {
  background: #ebeef5;
  cursor: not-allowed;
}
.disabledBackground .el-checkbox__input {
  cursor: not-allowed;
}
.span-info {
  border-color: hsla(220, 4%, 58%, 0.2);
  width: 100px;
  height: 33px;
  display: inline-block;
  text-align: center;
  line-height: 30px;
  border: 1px solid #dcdfe6;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.div-danger {
  background-color: hsla(0, 87%, 69%, 0.1);
  border-color: hsla(0, 87%, 69%, 0.2);
  color: #606266;
  border: 1px solid rgba(64, 158, 255, 0.2);
  padding: 15px;
  margin: 0 15px 0 0;
  width: 550px;
  font-size: 13px;
  line-height: 22px;
}
.billInfo .el-input__inner {
  border-radius: 0;
}
.cuxiao {
  margin: 0 20px 0 55px;
  width: 420px;
  display: block;
  float: left;
  white-space: nowrap; /* 不换行 */
  overflow: hidden; /* 内容超出宽度时隐藏超出部分的内容 */
  text-overflow: ellipsis; /* 当对象内文本溢出时显示省略标记(...) ；需与overflow:hidden;一起使用。*/
}
/* 覆盖头部样式 */
.el-header {
  padding: 0;
}
/* 发票样式 */
.invoiceHead {
  margin-right: 20px;
  display: inline-block;
  max-width: 240px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  height: 24px;
  vertical-align: middle;
}
</style>



