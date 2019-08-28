<template>
  <el-dialog
    title="使用订金"
    :visible.sync="depositVisible"
    width="900px"
    :show-close="false"
    class="deposit-dialog"
    :close-on-click-modal="false"
  >
    <!-- <span>这是一段信息</span> -->

    <div class="deposit-conclusion" v-if="depositObjData">
      <div class="conclusion-item">
        <span class="conclusion-name">总订金</span>

        <span
          class="conclusion-number"
        >{{ Number(Math.floor(depositObjData.sweepCodeDposit * 100) / 100 + Math.floor(depositObjData.checkoutDeposit * 100) / 100).toFixed(2)}}</span>
      </div>
      <div class="conclusion-item">
        <div class="conclusion-type">
          <span>扫码订金：</span>
          <span>{{ depositObjData.sweepCodeDposit.toFixed(2) }}</span>
        </div>
        <span>|</span>
        <div class="conclusion-type">
          <span>款台订金：</span>
          <span>{{ depositObjData.checkoutDeposit.toFixed(2) }}</span>
        </div>
      </div>
      <div class="conclusion-item">
        <span class="tip">（订单的尾款需要与订金的充值支付方式一致）</span>
      </div>
    </div>
    <div class="deposit-contain">
      <div class="mb20">请选择订金翻倍方案：</div>
      <el-tabs type="border-card" v-model="activeName" @tab-click="handleClickTab">
        <!-- 扫码订金 -->
        <el-tab-pane label="扫码订金" name="sweepCode">
          <el-radio-group v-model="useMode" v-if="sweepCodeData.amount!= '0.00'">
            <div
              class="deposit-item"
              v-if="sweepCodeData && sweepCodeData.promotions && sweepCodeData.promotions.length > 0"
            >
              <el-radio @click.native.prevent="clickDepositType(2)" :label="2">选择订金翻倍方案</el-radio>
              <template>
                <div v-for="(item, index) in sweepCodeData.promotions">
                  <div class="item-contain">
                    <span
                      class="disblock item-tip"
                    >购买如下商品（总金额{{ item.floorPrice }}-{{ item.upperPrice }}元）可选：</span>
                    <div class="item-option">
                      <div class="images-list">
                        <img
                          :src="imageSrc"
                          :onerror="noImg"
                          alt
                          v-for="imageSrc in item.benefitedSkuImages"
                        >
                      </div>
                      <p
                        class="mutex-tip"
                        v-if="item.ruleDetails && item.ruleDetails[0].tips == '01'"
                      >同一商品仅可参加一次订金翻倍(主品互斥)</p>
                      <div>
                        <el-radio-group v-model="ruleSelectId[index]">
                          <template v-for="(rule, i) in item.ruleDetails">
                            <el-radio
                              @click.native.prevent="clickGoods(index, rule.ruleId, rule.canUse, i)"
                              :label="rule.ruleId"
                              :disabled="!rule.canUse"
                              class="deposit-radio"
                            >{{ rule.preDeposit }}抵扣{{rule.preDepositDiscount}}元</el-radio>
                          </template>
                        </el-radio-group>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </div>
            <div
              class="deposit-item"
              v-if="sweepCodeData && sweepCodeData.promotions && sweepCodeData.promotions.length == 0"
            >
              <el-radio disabled>暂无订金翻倍方案</el-radio>
            </div>
            <div class="deposit-item">
              <el-radio :label="3" @click.native.prevent="clickDepositType(3)">订金原额使用</el-radio>
              <el-input
                v-model="amountDirectlyUsed"
                placeholder="请输入金额"
                class="deposit-data"
                @blur="valiedateMoneyInput()"
                @focus="valiedateMoneyFocus()"
                @keyup.native="handleOldInput()"
                :disabled="sweepCodeData.amount== '0.00' || useMode != '3'"
              ></el-input>
              <el-button
                type="primary"
                :disabled="useMode != '3'"
                @click="getAllMoney()"
                class="money-button"
              >全部</el-button>
              <span class="money-tips" v-if="showMoney">订单总金额:{{ showMoneyNum }}</span>
            </div>
            <div class="deposit-item">
              <el-radio :label="1" @click.native.prevent="clickDepositType(1)">不使用订金</el-radio>
            </div>
          </el-radio-group>
          <p class="deposit-none" v-if="sweepCodeData.amount== '0.00'">
            <span>暂无订金</span>
          </p>
        </el-tab-pane>
        <!-- 款台订金 -->
        <el-tab-pane label="款台订金" name="checkout">
          <el-radio-group v-model="useMode" v-if="checkoutData.amount!= '0.00'">
            <div
              class="deposit-item"
              v-if="checkoutData && checkoutData.promotions && checkoutData.promotions.length > 0"
            >
              <el-radio :label="2" @click.native.prevent="clickDepositType(2)">选择订金翻倍方案</el-radio>
              <template>
                <div v-for="(item, index) in checkoutData.promotions">
                  <div class="item-contain">
                    <span
                      class="disblock item-tip"
                    >购买如下商品（总金额{{ item.floorPrice }}-{{ item.upperPrice }}元）可选：</span>
                    <div class="item-option">
                      <div class="images-list">
                        <img
                          :src="imageSrc"
                          alt
                          :onerror="noImg"
                          v-for="imageSrc in item.benefitedSkuImages"
                        >
                      </div>
                      <p
                        class="mutex-tip"
                        v-if="item.ruleDetails && item.ruleDetails[0].tips == '01'"
                      >同一商品仅可参加一次订金翻倍(主品互斥)</p>
                      <div>
                        <el-radio-group v-model="ruleSelectId[index]">
                          <template v-for="(rule, i) in item.ruleDetails">
                            <el-radio
                              @click.native.prevent="clickGoods(index, rule.ruleId, rule.canUse, i)"
                              :label="rule.ruleId"
                              :disabled="!rule.canUse"
                              class="deposit-radio"
                            >{{ rule.preDeposit }}抵扣{{rule.preDepositDiscount}}元</el-radio>
                          </template>
                        </el-radio-group>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </div>
            <div
              class="deposit-item"
              v-if="checkoutData && checkoutData.promotions && checkoutData.promotions.length == 0"
            >
              <el-radio disabled>暂无订金翻倍方案</el-radio>
            </div>
            <div class="deposit-item">
              <el-radio :label="3" @click.native.prevent="clickDepositType(3)">订金原额使用</el-radio>

              <el-input
                v-model="amountDirectlyUsed"
                placeholder="请输入金额"
                class="deposit-data"
                @blur="valiedateMoneyInput()"
                @focus="valiedateMoneyFocus()"
                @keyup.native="handleOldInput()"
                :disabled="checkoutData.amount== '0.00' || useMode != '3'"
              ></el-input>
              <el-button
                type="primary"
                :disabled="useMode != '3'"
                @click="getAllMoney()"
                class="money-button"
              >全部</el-button>
              <span class="money-tips" v-if="showMoney">订单总金额:{{ showMoneyNum }}</span>
            </div>
            <div class="deposit-item">
              <el-radio :label="1" @click.native.prevent="clickDepositType(1)">不使用订金</el-radio>
            </div>
          </el-radio-group>
          <p class="deposit-none" v-if="checkoutData.amount== '0.00'">
            <span>暂无订金</span>
          </p>
        </el-tab-pane>
      </el-tabs>
    </div>
    <span slot="footer" class="dialog-footer">
      <span
        class="total-use"
        v-if="totalUse.useAmount"
      >共计使用：{{ totalUse.useAmount }} 抵扣 {{ totalUse.discountAmount }}元</span>
      <span
        class="total-use"
        v-if="amountDirectlyUsed !== '0' && useMode == '3' && amountDirectlyUsed !== ''"
      >共计使用：{{ amountDirectlyUsed }}元</span>
      <el-button @click="cancelDeposit()" :disabled="btnDisabled">取 消</el-button>
      <el-button
        type="primary"
        @click="confirmDeposit()"
        :disabled="useMode == 0 || btnDisabled"
      >确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { mapActions, mapState, mapMutations } from "vuex";
import API from "@/api/billingPurchase/billingPurchase";
import { parse } from "path";
// import "@/common/tofixed";
export default {
  props: ["depositObjData", "deposit"],
  data() {
    return {
      depositVisible: false,
      activeName: "sweepCode", // 选中的tab标签
      sweepCodeData: {}, // 扫码对象
      checkoutData: {}, // 款台对象
      amountDirectlyUsed: "", // 	直接使用的金额
      useMode: 0, // 1不使用,2翻倍,3不翻倍
      depositOpt1: "",
      depositOpt2: "",
      ruleSelectId: [],
      tabSelectIndex: 0, // 选择的tab选项 0 扫码订金 1 款台订金
      showMoney: false, // 订单原额使用展示订单总金额
      showMoneyNum: 0, //  订单原额全部订金总额
      btnDisabled: false, // 取消和确定按钮置灰的控制
      useDepositOpt: 0, // 0代表没选择。1 代表选择扫码。2代表选择款台
      totalUse: {
        discountAmount: "0",
        useAmount: "0"
      },
      noImg: 'this.src="' + require("../../assets/images/noImg.png") + '"' //没有图片的情况
    };
  },
  computed: {
    ...mapState([
      "billingpurchase" //大接口数据
    ])
  },
  watch: {
    useMode: "handleSelectType",
    tabSelectIndex: "clearData"
  },
  methods: {
    ...mapActions(["billingpurchaseInit"]),
    openDepositDialog() {
      this.ruleSelectId.splice(0);
      this.useMode = this.depositObjData.depositTypeVal + 1;
      this.handleDepositData();
      // 点击弹框判断订金翻倍方案是否有选中的选项
      if (this.ruleSelectId.length > 0) {
        this.useMode = 2;
      }
      if (this.useMode == 3) {
        this.$nextTick(() => {
          this.amountDirectlyUsed = this.depositObjData.preAmount;
        });
      }
      // 预存款勾选定金互斥校验 以及打开弹出框时默认选中的tab
      let dataObj = {};
      if (this.useDepositOpt == "0") {
        if (
          this.depositObjData.sweepCodeDposit >
          this.depositObjData.checkoutDeposit
        ) {
          dataObj = Object.assign(this.sweepCodeData);
          this.activeName = "sweepCode";
          this.tabSelectIndex = 0;
        } else {
          dataObj = Object.assign(this.checkoutData);
          this.activeName = "checkout";
          this.tabSelectIndex = 1;
        }
      } else {
        if (this.useDepositOpt == "1") {
          dataObj = Object.assign(this.sweepCodeData);
          this.activeName = "sweepCode";
          this.tabSelectIndex = 0;
        } else {
          dataObj = Object.assign(this.checkoutData);
          this.activeName = "checkout";
          this.tabSelectIndex = 1;
        }
      }
      this.checkDeposit(dataObj);
      this.depositVisible = true;
    },
    checkDeposit(dataObj) {
      API.checkDeposit({ currentDeposit: dataObj }).then(data => {
        if (data.success) {
          if (this.activeName == "sweepCode") {
            this.sweepCodeData = data.response.checkedDeposit;
          } else if (this.activeName == "checkout") {
            this.checkoutData = data.response.checkedDeposit;
          }
          this.totalUse.discountAmount = data.response.discountAmount;
          this.totalUse.useAmount = data.response.useAmount;
        } else {
          this.$message({
            message: data.respMsg,
            type: "warning"
          });
        }
      });
    },
    handleDepositData() {
      let billingDepositData = this.billingpurchase.deposits;
      let isSelectDepositIndex = 0;
      if (billingDepositData && billingDepositData.length > 0) {
        billingDepositData.forEach((item, i) => {
          if (item.depositType == "01") {
            // 根据amountDirectlyUsed判断当订金不翻倍时使用的是扫码还是款台
            if (item.amountDirectlyUsed > 0) {
              this.useDepositOpt = 1; //使用的订金是扫码
            }
            this.sweepCodeData = Object.assign(item);
          } else if (item.depositType == "02") {
            if (item.amountDirectlyUsed > 0) {
              this.useDepositOpt = 2; //使用的订金是款台
            }
            this.checkoutData = Object.assign(item);
          }
          if (item.promotions) {
            item.promotions.forEach((element, index) => {
              if (element.ruleDetails) {
                element.ruleDetails.forEach(list => {
                  if (list.selected) {
                    this.$set(this.ruleSelectId, index, list.ruleId);
                    this.useDepositOpt = i + 1;
                  }
                });
              }
            });
          }
        });
      }
    },
    // 取消订金方案弹出框
    cancelDeposit() {
      this.depositVisible = false;
      this.ruleSelectId.splice(0);
      this.billingpurchaseInit(this);
    },
    // 保存选择的订金方案
    confirmDeposit() {
      let comParams = {
        memberId: this.billingpurchase.member.memberId, // 会员ID
        sellerNum: this.billingpurchase.seller.sellerNum, //员工编号
        storeCode: this.billingpurchase.seller.storeCode, // 门店编码
        memberCard: this.billingpurchase.member.memberCard, //会员卡号
        temporaryCardFlag: this.billingpurchase.member.temporaryCardFlag, //是否临时卡 0:正常 1:临时卡
        depositType: this.tabSelectIndex == "0" ? "01" : "02", // 01是扫码，02是款台
        useMode: this.useMode, // 1不使用,2翻倍,3不翻倍
        amountDirectlyUsed: this.useMode == "3" ? this.amountDirectlyUsed : "0"
      };
      let usedDeposit = [];
      if (this.useMode == "2") {
        if (this.activeName == "sweepCode") {
          usedDeposit = this.handleUsedDeposit(this.sweepCodeData);
        } else if (this.activeName == "checkout") {
          usedDeposit = this.handleUsedDeposit(this.checkoutData);
        }
      }
      if (this.useMode == "3" && !this.valiedateMoneyInput()) {
        return false;
      }
      comParams["usedDeposit"] = usedDeposit;
      API.submitCheckDeposit(comParams).then(data => {
        if (data.success) {
          this.depositVisible = false;
          this.billingpurchaseInit(this);
        } else {
          this.billingpurchaseInit(this);
          this.$message({
            message: data.respMsg,
            type: "warning"
          });
        }
      });
    },
    // 处理选中的订金方案
    handleUsedDeposit(data) {
      var compArr = [];
      data.promotions.forEach((item, index) => {
        var compObj = {};
        item.ruleDetails.forEach((el, i) => {
          if (el.selected) {
            compObj["ruleId"] = el.ruleId;
            if (!compObj["benefitedItemIds"]) {
              compObj["benefitedItemIds"] = item.benefitedItemIds;
            }
            if (!compObj["promotionId"]) {
              compObj["promotionId"] = item.promotionId;
            }
            compArr.push(compObj);
          }
        });
      });
      return compArr;
    },
    // 点击订金方案选项
    clickGoods(index, val, canUse, i) {
      if (canUse) {
        this.useMode = 2;
        val === this.ruleSelectId[index]
          ? this.$set(this.ruleSelectId, index, "")
          : this.$set(this.ruleSelectId, index, val);
        if (this.activeName == "sweepCode") {
          this.handleCheckDeposit(
            this.sweepCodeData,
            index,
            this.ruleSelectId[index],
            i
          );
          if (this.handleHaveSelect(this.sweepCodeData)) {
            this.useMode = 2;
          } else {
            this.useMode = 0;
          }
        } else if (this.activeName == "checkout") {
          this.handleCheckDeposit(
            this.checkoutData,
            index,
            this.ruleSelectId[index],
            i
          );
          if (this.handleHaveSelect(this.checkoutData)) {
            this.useMode = 2;
          } else {
            this.useMode = 0;
          }
        }
      }
    },
    // 处理订金原额输入框只能输入数字
    handleOldInput() {
      // this.amountDirectlyUsed = this.amountDirectlyUsed.replace(/[^0-9.]/g, "");
      this.amountDirectlyUsed = this.amountDirectlyUsed.replace(/[^\d.]/g, ""); // 去除除了数字和点以外的字符
      this.amountDirectlyUsed = this.amountDirectlyUsed.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
      this.amountDirectlyUsed = this.amountDirectlyUsed
        .replace(".", "$#$")
        .replace(/\./g, "")
        .replace("$#$", ".");
      // this.amountDirectlyUsed = this.amountDirectlyUsed.replace(
      //   /^(\-)*(\d+)\.(\d\d).*$/,
      //   "$1$2.$3"
      // ); //只能输入两个小数
      // 此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
      if (
        this.amountDirectlyUsed.indexOf(".") < 0 &&
        this.amountDirectlyUsed != ""
      ) {
        this.amountDirectlyUsed = parseFloat(this.amountDirectlyUsed) + "";
      }
      // 当第一个为.的时候直接在前面加0
      if (
        typeof this.amountDirectlyUsed == "string" &&
        this.amountDirectlyUsed.indexOf(".") == 0
      ) {
        this.amountDirectlyUsed = "0" + this.amountDirectlyUsed;
      }
    },
    // 判断是否全部没有选中
    handleHaveSelect(data) {
      let result = false;
      if (data.promotions && data.promotions.length > 0) {
        data.promotions.forEach((item, index) => {
          if (item.ruleDetails && item.ruleDetails.length > 0) {
            item.ruleDetails.forEach(list => {
              if (list.selected) {
                result = true;
                return false;
              }
            });
          }
        });
      }
      return result;
    },
    // 处理选中订金方案
    handleCheckDeposit(data, index, val, i) {
      let that = this;
      if (this.ruleSelectId[index]) {
        data.promotions[index].ruleDetails.forEach((el, num) => {
          num == i ? (el.selected = true) : (el.selected = false);
        });
      }
      if (val) {
        data.promotions[index].ruleDetails[i].selected = true;
      } else {
        data.promotions[index].ruleDetails[i].selected = false;
      }
      // 预存款勾选定金互斥校验
      this.checkDeposit(data);
    },
    clickDepositType(e) {
      // 取消选中订金翻倍的方案发送互斥请求
      if (this.useMode == 2) {
        // 取消选中订金翻倍的方案选项
        if (this.activeName == "sweepCode") {
          this.handleCancelSelect(this.sweepCodeData);
        } else if (this.activeName == "checkout") {
          this.handleCancelSelect(this.checkoutData);
        }
      }
      e == this.useMode ? (this.useMode = "") : (this.useMode = e);
      if (this.useMode != 3) {
        this.amountDirectlyUsed = "";
      }
    },
    // 取消选中订金翻倍的方案选项
    handleCancelSelect(data) {
      if (data.promotions && data.promotions.length > 0) {
        data.promotions.forEach(item => {
          if (item.ruleDetails && item.ruleDetails.length > 0) {
            item.ruleDetails.forEach(el => {
              el.selected = false;
            });
          }
        });
      }
      this.checkDeposit(data);
    },
    // 切换tab
    handleClickTab(tab, event) {
      this.tabSelectIndex = tab.index;
      this.totalUse.discountAmount = null;
      this.totalUse.useAmount = null;
      if (this.tabSelectIndex * 1 + 1 == this.useDepositOpt) {
        // tab切换重新处理原来已经选中的数据
        this.handleTabOldData();
        if (this.useDepositOpt == "1" && this.useMode == "2") {
          this.checkDeposit(this.sweepCodeData);
          this.ruleSelectId.splice(0, this.ruleSelectId.length);
          this.judgeSelect(this.sweepCodeData);
        } else if (this.useDepositOpt == "2" && this.useMode == "2") {
          this.checkDeposit(this.checkoutData);
          this.ruleSelectId.splice(0, this.ruleSelectId.length);
          this.judgeSelect(this.checkoutData);
        }
      } else {
        // 清空原来选中的数据
        this.clearDeposit();
        this.useMode = 0;
      }
      // 如有一个类型的订金完全没有余额，只展示出无订金的提示，切换到无订金的标签下时，底部<总计提交区>进去无可选的置灰状态。
      if (tab.index == "0") {
        this.sweepCodeData.amount == "0.00"
          ? (this.btnDisabled = true)
          : (this.btnDisabled = false);
        this.us;
      } else if (tab.index == "1") {
        this.checkoutData.amount == "0.00"
          ? (this.btnDisabled = true)
          : (this.btnDisabled = false);
      }
    },
    clearDeposit() {
      if (this.tabSelectIndex == "0") {
        this.sweepCodeData.promotions.forEach(item => {
          item.ruleDetails.forEach(el => {
            el.selected = false;
            el.tips = null;
            el.canUse = true;
          });
        });
      } else {
        this.checkoutData.promotions.forEach(item => {
          item.ruleDetails.forEach(el => {
            el.selected = false;
            el.tips = null;
            el.canUse = true;
          });
        });
      }
    },
    handleTabOldData() {
      // this.billingpurchaseInit(this);
      let depositCompData = this.billingpurchase.deposits;
      if (depositCompData && depositCompData.length > 0) {
        depositCompData.forEach((item, i) => {
          if (item.depositType == "01") {
            this.sweepCodeData = Object.assign(item);
            if (item.amountDirectlyUsed != "0.00") {
              this.useMode = 3;
              this.amountDirectlyUsed = item.amountDirectlyUsed;
              this.$nextTick(() => {
                this.amountDirectlyUsed = item.amountDirectlyUsed;
              });
            }
          } else if (item.depositType == "02") {
            this.checkoutData = Object.assign(item);
            if (item.amountDirectlyUsed != "0.00") {
              this.useMode = 3;
              this.amountDirectlyUsed = item.amountDirectlyUsed;
              this.$nextTick(() => {
                this.amountDirectlyUsed = item.amountDirectlyUsed;
              });
            }
          }
          if (item.promotions) {
            item.promotions.forEach((element, index) => {
              if (element.ruleDetails) {
                element.ruleDetails.forEach(list => {
                  if (list.selected) {
                    this.$set(this.ruleSelectId, index, list.ruleId);
                  }
                });
              }
            });
          }
          if (
            item.amountDirectlyUsed == "0.00" ||
            item.amountDirectlyUsed == ""
          ) {
            if (this.ruleSelectId.length > 0) {
              this.useMode = 2;
            }
            if (this.useMode != 2 && this.useMode != 3) {
              this.useMode = 1;
            }
          } else {
            this.ruleSelectId.splice(0);
            this.clearDeposit();
          }
        });
      }
    },
    handleSelectType() {
      if (this.useMode == 2) {
        this.amountDirectlyUsed = "";
        if (this.activeName == "sweepCode") {
          this.judgeSelect(this.sweepCodeData);
        } else if (this.activeName == "checkout") {
          this.judgeSelect(this.checkoutData);
        }
      } else {
        if (this.useMode == 1) {
          this.amountDirectlyUsed = "";
        }
        this.ruleSelectId.splice(0, this.ruleSelectId.length);
      }
    },
    // 清空数据
    clearData() {
      this.amountDirectlyUsed = "";
      this.discountAmount = null;
      this.useAmount = null;
    },
    judgeSelect(data) {
      let isSelect = false;
      if (data.promotions && data.promotions.length > 0) {
        data.promotions.forEach((item, index) => {
          this.ruleSelectId.push("");
          if (item.ruleDetails && item.ruleDetails.length > 0) {
            item.ruleDetails.forEach(list => {
              if (list.selected) {
                isSelect = true;
                this.ruleSelectId[index] = list.ruleId;
              }
            });
          }
        });

        // 当没有选中任意一个方案时，可单独选中<方案总标题>选项，但方案内需要自动将第一个方案的第一个抵扣选项处理为选中。该<方案总标题>选项，也支持取消选中，即取消选中所有方案的抵扣选项。

        // let result = 0;
        // this.ruleSelectId.forEach(list => {
        //   if (list.indexOf("") > -1) {
        //     result += 1;
        //   }
        // });
        // if (result == data.promotions.length) {
        //   if (data.promotions[0].ruleDetails.length > 0) {
        //     data.promotions[0].ruleDetails[0].selected = true;
        //     // this.ruleSelectId[0] = data.promotions[0].ruleDetails[0].ruleId;
        //     this.handleCheckDeposit(data, 0, this.ruleSelectId[0], 0);
        //   }
        // }
        if (
          !isSelect &&
          data.promotions[0].ruleDetails.length > 0 &&
          this.useMode == "2"
        ) {
          data.promotions[0].ruleDetails[0].selected = true;
          this.ruleSelectId[0] = data.promotions[0].ruleDetails[0].ruleId;
          this.handleCheckDeposit(data, 0, this.ruleSelectId[0], 0);
        }
      }
    },
    // 获取焦点时显示的最大订单金额
    valiedateMoneyFocus() {
      var finalAmount =
        Math.floor(this.billingpurchase.totalInfo.finalAmount * 100) / 100;
      var depositDiscountAmount =
        Math.floor(this.billingpurchase.totalInfo.depositDiscountAmount * 100) /
        100;
      this.showMoneyNum = 0;
      if (depositDiscountAmount) {
        this.showMoneyNum = Number(finalAmount + depositDiscountAmount).toFixed(
          2
        );
      } else {
        this.showMoneyNum = Number(finalAmount).toFixed(2);
      }
      this.showMoney = true;
    },
    // 输入金额验证
    valiedateMoneyInput() {
      this.showMoney = false;
      var cardNumberVal = this.amountDirectlyUsed.replace(/\s/g, "");
      var reg = /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/;
      var isBeyondAmount = false;
      var isMessage = ""; // 提醒信息
      if (cardNumberVal.length <= 0) {
        this.$message({
          message: "金额不能为空",
          type: "warning"
        });
        return false;
      }
      if (!reg.test(cardNumberVal)) {
        this.$message({
          message: "金额只能输入大于0的数据",
          type: "warning"
        });
        return false;
      }
      if (this.activeName == "sweepCode") {
        isBeyondAmount = this.handleMaxMoney(
          this.sweepCodeData,
          Number(this.depositObjData.sweepCodeDposit)
        ).bol;
        isMessage = this.handleMaxMoney(
          this.sweepCodeData,
          Number(this.depositObjData.sweepCodeDposit)
        ).mes;
      } else if (this.activeName == "checkout") {
        isBeyondAmount = this.handleMaxMoney(
          this.checkoutData,
          Number(this.depositObjData.checkoutDeposit)
        ).bol;
        isMessage = this.handleMaxMoney(
          this.checkoutData,
          Number(this.depositObjData.checkoutDeposit)
        ).mes;
      }
      if (isBeyondAmount) {
        this.$message({
          message: isMessage,
          type: "warning"
        });
        return false;
      }
      this.amountDirectlyUsed = Number(this.amountDirectlyUsed).toFixed(2);
      // 判断输入的金额是否小于可用的金额
      return true;
    },
    // 处理是否超出最大可用金额
    handleMaxMoney(data, data1) {
      let compObj = { bol: false, mes: "" };
      let Amount = Number(data.amount);
      var finalAmount = this.billingpurchase.totalInfo.finalAmount;
      var depositDiscountAmount = this.billingpurchase.totalInfo
        .depositDiscountAmount;
      let generationPayment = 0;
      if (depositDiscountAmount) {
        generationPayment = Number(finalAmount) + Number(depositDiscountAmount);
      } else {
        generationPayment = Number(finalAmount);
      }
      let canInputMoney =
        Amount > generationPayment ? generationPayment : Amount;
      if (
        this.amountDirectlyUsed > data1 &&
        this.amountDirectlyUsed < generationPayment
      ) {
        return { bol: true, mes: "使用的订金金额超出了订金余额，请修改" };
        // return true;
      } else if (this.amountDirectlyUsed > generationPayment) {
        return { bol: true, mes: "使用的订金金额超出订单待支付金额，请修改" };
      } else {
        return { bol: false, mes: "" };
      }
    },
    // 点击获取全部的订金
    getAllMoney() {
      if (this.activeName == "sweepCode") {
        this.getMaxMoney(this.sweepCodeData);
      } else if (this.activeName == "checkout") {
        this.getMaxMoney(this.checkoutData);
      }
    },
    getMaxMoney(data) {
      let Amount = Number(data.amount);
      var finalAmount = this.billingpurchase.totalInfo.finalAmount;
      var depositDiscountAmount = this.billingpurchase.totalInfo
        .depositDiscountAmount;
      let generationPayment = 0;
      if (depositDiscountAmount) {
        generationPayment = Number(finalAmount) + Number(depositDiscountAmount);
      } else {
        generationPayment = Number(finalAmount);
      }
      Amount > generationPayment
        ? (this.amountDirectlyUsed = generationPayment + "")
        : (this.amountDirectlyUsed = Amount + "");
    }
  }
};
</script>
<style>
.deposit-dialog .el-dialog__header {
  padding: 10px 20px;
}
.deposit-dialog .el-dialog__body {
  padding: 0 20px;
}
</style>

<style scoped>
.mb20 {
  margin-bottom: 20px;
}
.disblock {
  display: block;
}
.item-tip {
  font-size: 14px;
}
.mutex-tip {
  font-size: 15px;
  color: #e6a23c;
  margin: 10px;
}
.deposit-conclusion {
  border: 1px solid #ccc;
  padding: 5px;
  text-align: center;
  /* font-size: 16px; */
  /* display: inline-block; */
  width: 400px;
  margin: 0 auto;
}
.conclusion-item {
  margin: 10px;
}
.conclusion-item .tip {
  color: #969595;
}
.conclusion-type {
  display: inline-block;
  margin: 0 10px;
}
.conclusion-name {
  color: #969595;
}
.conclusion-number {
  /* font-size: 17px; */
  font-weight: 500;
}
.deposit-item {
  margin: 10px 0;
}
.item-contain {
  margin: 10px 0;
  display: block;
}
.item-option {
  border-left: 1px solid #ccc;
  padding: 0 10px;
  margin: 10px 0;
}
.images-list {
  overflow-x: auto;
  white-space: nowrap;
  width: 800px;
  margin-bottom: 15px;
}
.images-list img {
  margin: 10px;
  width: 100px;
  height: 100px;
}
.deposit-data.el-input--small {
  display: inline-block;
  width: 150px;
  margin-left: 10px;
}
.money-tips {
  color: red;
  display: inline-block;
  font-size: 14px;
  margin-left: 10px;
}
.money-button {
  margin-left: 10px;
}
.deposit-none {
  min-height: 100px;
  text-align: center;
  line-height: 100px;
}
.total-use {
  position: absolute;
  bottom: 28px;
  left: 50px;
}
.deposit-radio.el-radio {
  margin-right: 20px;
  margin-top: 10px;
}
.deposit-radio.el-radio + .el-radio {
  margin-left: 0;
}
</style>