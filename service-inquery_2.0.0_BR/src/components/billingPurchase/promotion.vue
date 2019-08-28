<template>
  <div class="promotion-box">
    <div
      v-if="this.billingpurchase.jjhgSellerBillList && this.billingpurchase.jjhgSellerBillList.length>0"
    >
      <span style="display: inline-block; height: 44px" @click.stop>多品促销：</span>
      <span class="mutex">加价换购与多品促销、满折满减不可同享</span>
    </div>
    <div
      class="preferential-box deal-promotion-box"
      v-if="this.billingpurchase.jjhgSellerBillList && this.billingpurchase.jjhgSellerBillList.length<=0"
    >
      <div
        class="promotion-default"
        @click.stop="onceGiftsShowFn()"
        v-if="unCheckedPromotion && unCheckedPromotion.promotionGiftList"
      >
        <span>
          <span style="display: inline-block; height: 44px" @click.stop>多品促销：</span>
          <span class="cursor">
            <i
              class="el-icon-circle-plus"
              style="padding-right: 10px;"
              v-if="!checkedPromotion||Object.keys(checkedPromotion).length==0"
            ></i>
            <span v-if="!checkedPromotion||Object.keys(checkedPromotion).length==0">可享受多品促销活动</span>
          </span>
        </span>
        <div
          class="selected-show"
          style="margin-left:14px;"
          v-if="checkedPromotion &&(checkedPromotion.gomedoDescription || (checkedPromotion.gift && checkedPromotion.gift.baseSkuInfoList.length>0) || checkedPromotion.couponDescription)"
        >
          <span v-if="billingUsedParam.temporaryCardFlag==0">
            <p
              v-if="checkedPromotion && checkedPromotion.gomedoDescription"
              class="text cursor"
            >{{checkedPromotion.gomedoDescription}}</p>
            <!-- 赠券 -->
            <p
              v-if="checkedPromotion && checkedPromotion.couponDescription"
              class="text cursor"
            >{{checkedPromotion.couponDescription}}</p>
          </span>
          <div
            class="gifts text pos_re"
            v-if="checkedPromotion && checkedPromotion.gift && checkedPromotion.gift.baseSkuInfoList.length>0"
          >
            <span class="gifts-btn">
              <em>赠品</em>
            </span>
            <span class="arrow el-icon-arrow-up"></span>
          </div>
        </div>
      </div>

      <div
        class="preferential-content"
        v-if="checkedPromotion && Object.keys(checkedPromotion).length>0"
      >
        <el-row class="promotion">
          <el-col
            :span="24"
            v-if="checkedPromotion && checkedPromotion.gift && checkedPromotion.gift.baseSkuInfoList.length>0"
          >
            <div class="detail-gifts-box gifts-list clearfloat">
              <div v-for="item in checkedPromotion.gift.baseSkuInfoList" :key="item.id">
                <div class="content">
                  <img :src="item.skuImage||''" :onerror="onImg">
                  <div class="gift-num">X {{item.quantity}}</div>
                  <div class="specific-desc">
                    <p>商品码：{{item.skuNo}}</p>
                    <p>{{item.skuName}}</p>
                  </div>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <!-- 赠品弹窗 -->
    <el-dialog
      :visible.sync="giftsVisible"
      width="850px"
      title="促销"
      class="billing-dialog gifts-dialog"
      :append-to-body="true"
    >
      <div class="gifts-content-box" v-if="unCheckedPromotion">
        <div
          class="delivery-box"
          v-if="unCheckedPromotion.gomedoList && unCheckedPromotion.gomedoList.length>0"
        >
          <h5>赠豆</h5>
          <ul class="selectBT">
            <li v-for="(item,index) in unCheckedPromotion.gomedoList" :key="item.promotionId">
              <div
                class="self-select-box select-item"
                :class="{active: item.isSelected}"
                @click="bindSelectedGiveBean(item,index)"
              >
                {{item.promotionDescription}}
                <span class="select-icon" v-show="item.isSelected"></span>
              </div>
            </li>
          </ul>
        </div>
        <div
          class="delivery-box"
          v-if="unCheckedPromotion.couponList && unCheckedPromotion.couponList.length>0"
        >
          <h5>赠券</h5>
          <ul class="selectBT selectTicket">
            <!-- <li v-for="(item,index) in unCheckedPromotion.couponList" :key="item.promotionId">
              <div
                class="self-select-box select-item"
                :class="{active: item.isSelected}"
                @click="bindSelectedGiveTicket(item,index)"
              >
                {{item.promotionDescription}}
                <span class="select-icon" v-show="item.isSelected"></span>
              </div>
            </li> -->
            
            <li v-for="(item,index) in unCheckedPromotion.couponList" :key="item.promotionId">
              <div class="self-select-box select-item" :class="{active: item.isSelected}" @click="bindSelectedGiveTicket(item,index)">
                <div v-for="(coupon,iCur) in item.promotionDescriptions" :key="iCur">
                  <p>{{coupon}}</p>
                </div>
                <span class="select-icon" v-show="item.isSelected"></span></div>
              
            </li>
          </ul>
        </div>
        <div class="delivery-box">
          <h5>赠品</h5>
          <div class="selectBT">
            <span>配送方式：</span>
            <el-radio-group v-model="delivery" @change="selectDeliveryType">
              <el-radio
                v-for="(item,index) in unCheckedPromotion.promotionDeliverWay"
                :label="item.deliverWay"
                :key="index"
              >{{item.deliverWayName}}</el-radio>
            </el-radio-group>
            <div
              class="delivery"
              v-for="item in unCheckedPromotion.promotionDeliverWay"
              :key="item.deliverWay"
            >
              <el-select
                style="width:467px"
                v-if="delivery==0 && item.addressList && item.addressList.length>0"
                v-model="addressId"
                placeholder="请选择"
                @change="selectDeliveryType"
              >
                <el-option
                  v-for="cItem in item.addressList"
                  :key="cItem.sellerBillId"
                  :label="cItem.addressInfo"
                  :value="cItem.sellerBillId"
                ></el-option>
              </el-select>
            </div>
          </div>
        </div>
        <div v-if="unCheckedPromotion && isLoading" class="warning">
          <span v-if="isLoading">正在加载赠品...</span>
        </div>
        <div
          class="warning"
          style="text-align:center;"
          v-if="giftsVisible && unCheckedPromotion.promotionGiftList && unCheckedPromotion.promotionGiftList.length==0 && !isLoading"
        >当前配送方式，赠品已无货</div>
        <div
          class="gifts-content selectBT"
          v-if="giftsVisible && unCheckedPromotion.promotionGiftList && unCheckedPromotion.promotionGiftList.length>0"
        >
          <div
            class="gifts-list"
            v-for="(fItem,idx) in unCheckedPromotion.promotionGiftList"
            :key="fItem.promotionId"
          >
            <p class="plan-name">{{fItem.promotionDescription}}</p>
            <div class="content-box">
              <div v-for="(cItem,cIdx) in fItem.promLineContentList" :key="cItem.groupNo">
                <div v-for="(tItem,tIdx) in cItem.giftGoodsList" :key="tItem.giftId">
                  <el-checkbox-group v-model="checkList">
                    <div class="content">
                      <div class="check-box">
                        <el-checkbox
                          v-if="tItem.giftNum>0"
                          @change="changeState(fItem,idx,cItem,cIdx,tItem,tIdx)"
                          :label="idx+''+cIdx+'-'+tItem.skuNo"
                          :disabled="tItem.disabled"
                        ></el-checkbox>
                        <el-checkbox
                          v-if="tItem.giftNum==0"
                          :label="idx+''+cIdx+'-'+tItem.skuNo"
                          disabled
                        ></el-checkbox>
                      </div>
                      <img :src="tItem.giftImage||''" :onerror="onImg">
                      <div
                        class="specific-desc"
                        :class="{ grey: tItem.disabled && tItem.giftNum>0 }"
                      >
                        <p>商品编码：{{tItem.skuNo}}</p>
                        <p>{{tItem.giftName}}</p>
                        <p class="red-text" v-if="tItem.giftNum==0">无可卖数</p>
                      </div>
                    </div>
                  </el-checkbox-group>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="dialog-footer">
        <el-button type="primary" @click="selectedGifts">确 定</el-button>
        <el-button @click="giftsVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import API from "@/api/billing/billing";
import GoodsInfo from "@/components/billing/goodsInfo";
import DeliveryWay from "@/components/billing/deliveryWay";
export default {
  props: {
    pPromotionInfo: {
      type: Object,
      default: function() {
        return {};
      }
    },
    pSellerBillList: {
      type: Object,
      default: function() {
        return {};
      }
    },
    pPromotionInfoBak: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  components: {
    GoodsInfo,
    DeliveryWay
  },
  created: function() {},
  watch: {
    pPromotionInfo: {
      handler: function() {
        this.promotionInfo = JSON.parse(
          JSON.stringify(this.pPromotionInfo || {})
        );
      },
      deep: true
    },
    pPromotionInfoBak: {
      handler: function() {
        this.validPromotionListBak = JSON.parse(
          JSON.stringify(this.pPromotionInfoBak || {})
        );
      },
      deep: true
    },
    pSellerBillList: {
      handler: function() {
        this.sellerBillList = JSON.parse(
          JSON.stringify(this.pSellerBillList.data || [])
        );
      },
      deep: true
    }
  },
  computed: {
    ...mapState([
      "billingpurchase", //大接口数据
      "billingUsedParam" //会员信息
    ]),
    checkedPromotion() {
      return (this.promotionInfo && this.promotionInfo.checkedPromotion) || {};
    },
    unCheckedPromotion() {
      return (
        (this.promotionInfo && this.promotionInfo.unCheckedPromotion) || {}
      );
    }
  },
  data() {
    return {
      promotionInfo: JSON.parse(JSON.stringify(this.pPromotionInfo)), //促销信息
      sellerBillList: JSON.parse(JSON.stringify(this.pSellerBillList.data)), //导购单集合
      validPromotionListBak: JSON.parse(JSON.stringify(this.pPromotionInfoBak)), //大loading促销信息原数据
      giftsVisible: false, //赠品弹窗显示
      delivery: 8, //配送方式
      isLoading: false, //点击弹框配送方式加载数据
      isSubmit: true, ////防止重复提交(点击保存赠品时)
      detailGiftsShow: false, //赠品详情展示
      checkList: [], //赠品选中列表
      addressId: "", //选择地址
      sellerBillIdList: [], //导购单集合
      onceGiftsShow: true, //买即赠赠品详情展示
      onImg: 'this.src="' + require("../../assets/images/noImg.png") + '"'
    };
  },
  methods: {
    ...mapActions(["billingpurchaseInit"]),
    onceGiftsShowFn() {
      //显示赠品弹框
      let self = this;
      if (
        this.billingpurchase.jjhgSellerBillList &&
        this.billingpurchase.jjhgSellerBillList.length > 0
      ) {
        self.giftsVisible = false;
        return false;
      } else {
        self.giftsVisible = true;
      }

      self.getSellerBillIdList(); //导购单id集合
      self.defaultSelectedDeliveryWay(); //默认选中的配送方式（弹框里）
      self.defaultAddress(); //默认选中地址（弹框里）
      //点击弹框自动请求一次(大loading中没有赠品就不需要调用查询赠品接口)
      if (
        self.unCheckedPromotion.promotionGiftList &&
        self.unCheckedPromotion.promotionGiftList.length > 0
      ) {
        self.selectDeliveryType();
      }
    },
    defaultAddress() {
      //默认显示配送地址
      let self = this;
      if (self.unCheckedPromotion.promotionDeliverWay) {
        self.unCheckedPromotion.promotionDeliverWay.forEach(function(
          item,
          index
        ) {
          if (item.addressList && item.addressList.length > 0) {
            item.addressList.forEach(function(cItem, cIndex) {
              if (cItem.isSelected) {
                self.addressId = cItem.sellerBillId;
              }
            });
          }
        });
      }
    },
    defaultSelectedDeliveryWay() {
      //配送方式默认选中
      let self = this;
      if (self.unCheckedPromotion.promotionDeliverWay) {
        self.unCheckedPromotion.promotionDeliverWay.forEach(function(
          item,
          index
        ) {
          if (item.isSelected) {
            self.delivery = item.deliverWay;
            return;
          }
        });
      }
    },
    bindSelectedGiveBean(data, idx) {
      //赠豆
      let self = this;
      data.isSelected = data.isSelected == 1 ? 0 : 1;
      self.unCheckedPromotion.gomedoList.forEach(function(item, idx) {
        if (item != data) {
          item.isSelected = 0;
        }
      });
    },
    bindSelectedGiveTicket(data, idx) {
      //赠券
      let self = this;
      data.isSelected = data.isSelected == 1 ? 0 : 1;
      self.unCheckedPromotion.couponList.forEach(function(item, idx) {
        if (item != data) {
          item.isSelected = false;
        }
      });
    },
    changeState(fItem, idx, cItem, cIdx, tItem, tIdx) {
      //选择赠品互斥
      let self = this;
      tItem.isSelected = tItem.isSelected == 0 ? 1 : 0;
      let usedLen = 0;
      // self.checkList = [];
      self.unCheckedPromotion.promotionGiftList.forEach(function(item, index) {
        //不同方案和不同组之间互斥
        item.promLineContentList.forEach(function(pItem, pIdx) {
          pItem.giftGoodsList.forEach(function(gItem, gIdx) {
            if (index == idx && cIdx != pIdx) {
              //同方案下同组互斥并设置disabled
              gItem.disabled = true;
              let currentSelected = index + "" + pIdx + "-" + gItem.skuNo;
              self.checkList = self.checkList.filter(item => {
                if (currentSelected == item) {
                  gItem.isSelected = gItem.isSelected == 0 ? 1 : 0;
                }
                return currentSelected != item;
              });
            }
            if (index != idx && gItem.giftNum > 0) {
              gItem.disabled = false;
            }
            if (index != idx) {
              let currentSelected = index + "" + pIdx + "-" + gItem.skuNo;
              self.checkList = self.checkList.filter(item => {
                if (currentSelected == item) {
                  gItem.isSelected = gItem.isSelected == 0 ? 1 : 0;
                }
                return currentSelected != item;
              });
            }
            if (self.checkList.length == 0 && gItem.giftNum > 0) {
              gItem.disabled = false;
            }
          });
        });
      });
    },
    getSellerBillIdList() {
      //多品赠获取导购单id集合
      let self = this;
      self.sellerBillIdList = []; //每次弹框打开先清空
      if (self.sellerBillList.length > 0) {
        self.sellerBillList.forEach(function(item, index) {
          if (item.isSelected) {
            self.sellerBillIdList.push(item.sellerBillId);
          }
        });
      }
    },
    selectDeliveryType() {
      //点击配送方式请求赠品api
      let self = this;
      let params = {
        deliverWay: self.delivery,
        memberId: self.billingUsedParam.memberId, //会员ID
        memberCard: self.billingUsedParam.memberCard, //会员卡号
        temporaryCardFlag: self.billingUsedParam.temporaryCardFlag, //是否是临时卡
        sellerNum: self.billingUsedParam.sellerNum, //会员编号
        storeCode: self.billingUsedParam.storeCode, //门店编号
        validPromotionList:
          self.validPromotionListBak.unCheckedPromotion.promotionGiftList, //赠品信息列表
        promotionType: 1, //0单品赠，1多品赠
        addressellerBillId: self.addressId, //多品赠时传入
        siteType: self.billingUsedParam.siteType //站点类型 1普通 2预售
      };
      if (params.addressellerBillId == "") {
        params.addressellerBillId = self.sellerBillIdList[0];
      }
      if (params.validPromotionList.length == 0) return; //当validPromotionList为[]空的时候,说明赠品无货，不需要再请求赠品数据接口，直接返回
      self.selectGift(params);
    },
    selectGift(params) {
      //请求国美配送和门店自提赠品数据
      let self = this;

      API.queryShowGift(params).then(data => {
        self.isLoading = false;
        self.unCheckedPromotion.promotionGiftList = [];
        if (data.success) {
          setTimeout(function() {
            self.unCheckedPromotion.promotionGiftList = data.response;
            self.isLoading = false;
            self.defaultGiftDisabledBak();
          }, 60);
        } else {
          this.$message({
            showClose: true,
            message: data.respMsg + "（" + data.linkId + "）",
            type: "warning"
          });
        }
      });
    },
    defaultGiftDisabledBak() {
      //点开弹框加载赠品数据，给赠品设置默认disabled状态
      let self = this;
      if (
        self.unCheckedPromotion &&
        self.unCheckedPromotion.promotionGiftList
      ) {
        self.checkList = [];
        let flag, flagIndex;
        self.unCheckedPromotion.promotionGiftList.forEach(function(
          item,
          index
        ) {
          item.promLineContentList.forEach(function(pItem, pIdx) {
            pItem.giftGoodsList.forEach(function(gItem, gIdx) {
              gItem.disabled = true;
              if (gItem.isSelected && gItem.giftNum > 0) {
                self.checkList.push(index + "" + pIdx + "-" + gItem.skuNo);
                gItem.disabled = false;
                flag = index;
                flagIndex = pIdx;
              }
            });
          });
        });
        self.unCheckedPromotion.promotionGiftList.forEach(function(
          item,
          index
        ) {
          item.promLineContentList.forEach(function(pItem, pIdx) {
            pItem.giftGoodsList.forEach(function(gItem, gIdx) {
              if (index == flag && !gItem.isSelected && flagIndex != pIdx) {
                gItem.disabled = true;
              } else {
                gItem.disabled = false;
              }
            });
          });
        });
        // console.log(self.checkList);
        // console.log('self.checkList-----------------------------');
      }
    },
    selectedGifts() {
      //赠品弹框点击确认请求保存接口,关闭弹框，刷新页面赠品信息
      let self = this;
      let params = {
        memberId: self.billingUsedParam.memberId, //会员ID
        memberCard: self.billingUsedParam.memberCard, //会员卡号
        temporaryCardFlag: self.billingUsedParam.temporaryCardFlag, //是否是临时卡
        sellerNum: self.billingUsedParam.sellerNum, //会员编号
        storeCode: self.billingUsedParam.storeCode, //门店编号
        promotionInfo: {
          sellerBillIdList: self.sellerBillIdList, //导购单时传当前导购单id 导购车时多值
          pageFrom: 2, //1导购单 2导购车
          promToSellerBillList: [
            //赠豆 赠券 赠品被选中时传入
            // {
            //   promotionId:'',//勾选后的值（未勾选的不传入）
            //   promotionType:'',//1赠豆 2赠券 3赠品
            //   sellerBillIdList:[] //导购单时即为传入的导购单id 导购车时为此促销为哪几个导购单的赠送信息
            // }
          ],
          promGiftList: [
            //促销赠品信息，为空就是删除赠品
            // {
            //   sellerBillIdList:[],
            //   skuNo:'',
            //   groupNo:'',
            //   addressSellerBillId:'', //多品赠选的地址的导购单ID
            //   deliverWay:'' //配送方式
            // }
          ]
        },
        siteType: self.billingUsedParam.siteType //站点类型 1普通 2预售
      };

      //赠豆相关参数获取
      let dou = self.unCheckedPromotion.gomedoList.filter(item => {
        return item.isSelected == 1;
      });
      if (dou.length > 0) {
        params.promotionInfo.promToSellerBillList.push({
          promotionId: dou[0].promotionId,
          promotionType: dou[0].promotionType, //1赠豆
          sellerBillIdList: dou[0].mainSellerBillIdSet
        });
      }
      //赠券相关参数获取
      let coupon = self.unCheckedPromotion.couponList.filter(item => {
        return item.isSelected == 1;
      });
      if (coupon.length > 0) {
        params.promotionInfo.promToSellerBillList.push({
          promotionId: coupon[0].promotionId,
          promotionType: coupon[0].promotionType, //2赠券
          sellerBillIdList: coupon[0].mainSellerBillIdSet
        });
      }
      //赠品相关参数获取
      let fangAnInfo = {}; //方案的promotionId
      params.promotionInfo.promGiftList = [];
      self.unCheckedPromotion.promotionGiftList.forEach(function(
        fItem,
        fIndex
      ) {
        fItem.promLineContentList.forEach(function(sItem, sIndex) {
          let groupNo = sItem.groupNo;
          sItem.giftGoodsList.forEach(function(tItem, tIndex) {
            if (
              tItem.isSelected == 1 &&
              tItem.giftNum > 0 &&
              self.checkList.indexOf(
                fIndex + "" + sIndex + "-" + tItem.skuNo
              ) != -1
            ) {
              params.promotionInfo.promGiftList.push({
                sellerBillIdList: tItem.mainSellerBillIdSet,
                skuNo: tItem.skuNo,
                groupNo: groupNo,
                addressSellerBillId:
                  self.addressId == ""
                    ? self.sellerBillIdList[0]
                    : self.addressId, //多品赠时传参
                deliverWay: self.delivery
              });
              fangAnInfo.promotionId = fItem.promotionId;
              fangAnInfo.promotionType = fItem.promotionType;
            }
          });
        });
      });
      if (params.promotionInfo.promGiftList.length > 0) {
        params.promotionInfo.promToSellerBillList.push({
          promotionId: fangAnInfo.promotionId,
          promotionType: fangAnInfo.promotionType, //3赠品
          sellerBillIdList: self.sellerBillIdList
        });
      }

      if (self.isSubmit) {
        //防止重复提交
        self.isSubmit = false;
        API.savePromotion(params).then(data => {
          if (data.success) {
            self.giftsVisible = false; //隐藏弹框
            self.isSubmit = true;
            self.billingpurchaseInit(); //刷新页面赠品信息（重新调用初始化赠品方法）
          } else {
            this.$message({
              showClose: true,
              message: data.respMsg + "（" + data.linkId + "）",
              type: "warning"
            });
          }
        });
      }
    }
  }
};
</script>
<style lang="stylus">
.gifts-dialog {
  .el-dialog__body {
    padding-top: 10px;
  }

  .el-checkbox-group {
    font-size: 14px;
  }

  .el-checkbox__label {
    font-size: 0;
  }
}

.delivery-box .el-select-dropdown__item span {
  width: 427px;
  overflow: hidden;
  display: inline-block;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>

<style lang="stylus" scoped>
$b-c-g = #ccc;

.mutex {
  color: #e6a23c;
}

.grey {
  color: #999;
}

.pos_re {
  position: relative;
}

.promotion-default {
  display: inline-block;
  position: initial;
  z-index: 99;
  height: 44px;
}

.cursor {
  cursor: pointer;
}

.gifts-content {
  max-height: 400px;
  max-height: 400px;
  // overflow-y: scroll;

  overflow-y: auto;
  .plan-name {
    line-height: 30px;
  }
}

.deal-promotion-box {
  margin-bottom: 0;
}

.selectBT {
  padding-left: 20px;
}

.selectBT li {
  display: inline-block;
  margin-bottom: 5px;
}
.self-select-box {
    min-height: 32px;
    height: auto;
    text-align: left;
  }
  .selectTicket li {
    display: block;
  }

.selectBT .delivery {
  display: inline;
  padding-left: 20px;
}

.main-address {
  width: 75%;
  position: relative;
  background: #f2f6fc;
}

.giftWarning {
  clear: both;
}

.red-text {
  color: red;
}

.promotion-box {
  .promotion-default {
    .el-icon-arrow-up {
      position: absolute;
      top: 30px;
      left: 5px;
    }

    .el-icon-circle-plus {
      padding: 0 20px 2px 20px;
    }
  }

  .el-icon-arrow-up {
    position: absolute;
    top: 22px;
    left: 5px;
  }

  .selected-show {
    display: inline-block;
    border: 1px solid #fff;
    box-sizing: border-box;
    line-height: 30px;
    padding: 0 5px;

    /* cursor: pointer; */
    &:hover {
      border-color: $b-c-g;
      cursor: pointer;
    }
  }

  .text {
    display: inline-block;
    line-height: 32px;
    margin-right: 5px;
  }

  line-height: 32px;

  .preferential-content {
    padding-left: 74px;
  }

  .give-tip {
    display: inline-block;
    cursor: pointer;

    em {
      font-style: normal;
    }
  }

  .go-promotion {
    display: inline-block;
    cursor: pointer;
  }

  .gifts {
    position: relative;
    display: inline-block;
    cursor: pointer;

    em {
      font-style: normal;
      vertical-align: middle;
    }
  }

  .detail-gifts-box {
    /* position: relative; */
    padding: 10px;
    /* top: -10px; */
    left: 0;
    box-sizing: border-box;
    background: #F8F8F8;
    min-height: 100px;
    z-index: 1;
    border: 1px solid $b-c-g;
    line-height: 28px;

    .arrow {
      position: absolute;
      left: 44%;
      top: -12px;
      z-index: 8;
      font-size: 16px;
      color: $b-c-g;
    }
  }

  .once-gifts {
    top: 0;

    .arrow {
      left: 0;
      margin-left: 239px;
    }
  }

  .server-info {
    float: left;
    width: 48%;
    padding-right: 20px;
    box-sizing: border-box;
    /* border-right: 1px solid $b-c-g; */
    clear: both;
    margin-bottom: 10px;
  }

  .deal-goods-info {
    position: relative;
    left: -1px;
    border-left: 1px solid $b-c-g;
    float: left;
    width: 52%;
    padding-left: 20px;
    box-sizing: border-box;
  }
}

.gifts-dialog {
  .warning {
    color: red;
    font-size: 16px;
    padding: 20px 0 0 20px;
  }

  .delivery-box {
    line-height: 32px;

    span {
      display: inline-block;
      vertical-align: middle;
    }
  }

  .content-box {
    padding-left: 10px;
    border: 1px solid $b-c-g;
  }

  .dialog-footer {
    text-align: center;
    margin-top: 20px;
  }
}

.gifts-list {
  margin-bottom: 10px;

  .content {
    padding: 5px 0;
    height: 80px;

    .check-box {
      float: left;
      font-size: 0;
    }

    img {
      float: left;
      width: 80px;
      height: 80px;
      box-sizing: border-box;
      border: 5px solid $b-c-g;
    }

    .specific-desc {
      float: left;
      padding-left: 10px;

      p {
        line-height: 20px;
      }

      min-width: -490px;
      overflow: -hidden;
    }

    .gift-num {
      position: absolute;
      right: 30px;
    }
  }
}
</style>

