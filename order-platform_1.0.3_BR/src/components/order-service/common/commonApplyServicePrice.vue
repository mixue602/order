<template>
  <el-row>
    <el-row class="common-money-group cmg__applyservice" data-before="促销优惠抵扣明细" v-if="returnExchangeDetail.returnRefundAgentDto && returnExchangeDetail.productDto.virtualOperationItemFlag !='1'">
      <!--扣款明细 start-->
      <!--扣款明细显示条件：有美豆信息，或者有赠品信息-->
      <el-row class="cmg__deduct-money" data-before="扣款明细"
              v-if="(returnExchangeDetail.returnRefundAgentDto.returnGomeBeanAgentDto &&
                  JSON.stringify(returnExchangeDetail.returnRefundAgentDto.returnGomeBeanAgentDto) != '{}') ||
                  (returnExchangeDetail.returnRefundAgentDto.shareFreeGifts &&
                  returnExchangeDetail.returnRefundAgentDto.shareFreeGifts.length > 0)">
        <!--预计扣款金额显示条件：有美豆信息，或者有赠品信息-->
        <el-row v-if="(returnExchangeDetail.returnRefundAgentDto.returnGomeBeanAgentDto &&
                  JSON.stringify(returnExchangeDetail.returnRefundAgentDto.returnGomeBeanAgentDto) != '{}') ||
                        (returnExchangeDetail.returnRefundAgentDto.shareFreeGifts &&
                        returnExchangeDetail.returnRefundAgentDto.shareFreeGifts.length > 0)">
          <el-row class="cmg__deduct-money-item" data-before="预计扣款金额："
                  v-if="returnExchangeDetail.returnRefundAgentDto.displayAllDeductAmount">
            <em class="cmg__em">-{{returnExchangeDetail.returnRefundAgentDto.displayAllDeductAmount | formatMoney}}</em>
          </el-row>
        </el-row>
        <el-row 
        v-if="(returnExchangeDetail.returnRefundAgentDto.allDeductAmount && returnExchangeDetail.returnRefundAgentDto.allDeductAmount!='0.00') || (returnExchangeDetail.returnRefundAgentDto.returnGomeBeanAgentDto && returnExchangeDetail.returnRefundAgentDto.returnGomeBeanAgentDto.accountAvailableGomeBeanNumber > 0) || (returnExchangeDetail.returnRefundAgentDto.returnGomeBeanAgentDto && returnExchangeDetail.returnRefundAgentDto.returnGomeBeanAgentDto.pendingBuyGomeBeanNumber > 0)">
          <!--美豆现金抵扣 start-->
          <el-row class="cmg_item" v-if="(returnExchangeDetail.returnRefundAgentDto.returnGomeBeanAgentDto &&
                    JSON.stringify(returnExchangeDetail.returnRefundAgentDto.returnGomeBeanAgentDto) != '{}')">
            <el-row class="cmg__deduct-money-item" data-before="美豆现金抵扣："
                    v-if="returnExchangeDetail.returnRefundAgentDto.allDeductAmount && returnExchangeDetail.returnRefundAgentDto.allDeductAmount!='0.00'">
                      <span class="cmg__span">
                      -{{returnExchangeDetail.returnRefundAgentDto.allDeductAmount | formatMoney}}&nbsp;
                      </span>
            </el-row>
          </el-row>
          <!--美豆现金抵扣 end-->
          <el-row class="cmg__deduct-money-item cmg_item" data-before="用户账户余额：" v-if="(returnExchangeDetail.returnRefundAgentDto.returnGomeBeanAgentDto || returnExchangeDetail.returnRefundAgentDto.returnGomeBeanAgentDto.accountAvailableGomeBeanNumber == 0) && returnExchangeDetail.returnRefundAgentDto.returnGomeBeanAgentDto.allGiftGomeBeanNumber">
            <em class="cmg__em">{{returnExchangeDetail.returnRefundAgentDto.returnGomeBeanAgentDto.accountAvailableGomeBeanNumber}}美豆</em>
          </el-row>
          <el-row class="cmg__deduct-money-item cmg_item" data-before="需补购美豆：" v-if="returnExchangeDetail.returnRefundAgentDto.returnGomeBeanAgentDto && returnExchangeDetail.returnRefundAgentDto.returnGomeBeanAgentDto.pendingBuyGomeBeanNumber > 0">
            <em class="cmg__em">{{returnExchangeDetail.returnRefundAgentDto.returnGomeBeanAgentDto.pendingBuyGomeBeanNumber}}美豆</em>
          </el-row>
          <el-row class="cmg_item mt5 " v-if="(returnExchangeDetail.returnRefundAgentDto.allDeductAmount && returnExchangeDetail.returnRefundAgentDto.allDeductAmount!='0.00')||((returnExchangeDetail.returnRefundAgentDto.returnGomeBeanAgentDto || returnExchangeDetail.returnRefundAgentDto.returnGomeBeanAgentDto.accountAvailableGomeBeanNumber == 0) && returnExchangeDetail.returnRefundAgentDto.returnGomeBeanAgentDto.allGiftGomeBeanNumber) || (returnExchangeDetail.returnRefundAgentDto.returnGomeBeanAgentDto && returnExchangeDetail.returnRefundAgentDto.returnGomeBeanAgentDto.pendingBuyGomeBeanNumber > 0)">
            <el-popover
              placement="right-start"
              width="400"
              trigger="hover">
              <div class="giftgomebeanbox">
                <p class="title">美豆现金抵扣明细</p>
                <p>共需收回：{{totalGomeBeanNum}}美豆</p>
                <p>需收回赠豆：{{returnExchangeDetail.returnRefundAgentDto.returnGomeBeanAgentDto.allGiftGomeBeanNumber}}美豆</p>
                <p v-if="returnExchangeDetail.returnRefundAgentDto.deductCouponisuse && returnExchangeDetail.returnRefundAgentDto.deductCouponisuse!='0.00'">需收回赠券：-￥{{returnExchangeDetail.returnRefundAgentDto.deductCouponisuse}}（{{deductionGomeBeanNum}}美豆）</p>
                <p class="mt10">1、收回赠豆：
                  <span v-if="returnExchangeDetail.returnRefundAgentDto.returnGomeBeanAgentDto.promotionGomeBeanNumber">促销赠{{returnExchangeDetail.returnRefundAgentDto.returnGomeBeanAgentDto.promotionGomeBeanNumber}}美豆；</span> 
                  <span v-if="returnExchangeDetail.returnRefundAgentDto.returnGomeBeanAgentDto.payDLGiftGomeBeanNumber">购物赠{{returnExchangeDetail.returnRefundAgentDto.returnGomeBeanAgentDto.payDLGiftGomeBeanNumber}}美豆；</span>
                  <span v-if="returnExchangeDetail.returnRefundAgentDto.returnGomeBeanAgentDto.appriseGiftGomeBeanNumber">商品评价赠{{returnExchangeDetail.returnRefundAgentDto.returnGomeBeanAgentDto.appriseGiftGomeBeanNumber}}美豆;</span>
                  <span v-if="returnExchangeDetail.returnRefundAgentDto.returnGomeBeanAgentDto.storeServiceGiftGomeBeanNumber">员工评价赠{{returnExchangeDetail.returnRefundAgentDto.returnGomeBeanAgentDto.storeServiceGiftGomeBeanNumber}}美豆;</span>
                  <span v-if="serviceGomeBeanNum">服务评价赠{{serviceGomeBeanNum}}美豆、</span>
                  <span v-if="returnExchangeDetail.returnRefundAgentDto.returnGomeBeanAgentDto.appraiseShowGiftGomeBeanNumber">晒单赠豆{{returnExchangeDetail.returnRefundAgentDto.returnGomeBeanAgentDto.appraiseShowGiftGomeBeanNumber}}美豆；</span>
                </p>
                <p>2、收回赠券：当券未被使用时，直接收回券；当券被使用时，需收回券等额美豆；</p>
                <p>3、如赠送美豆已使用等导致账户里美豆不足时，将使用现金抵扣，100美豆等于抵扣1元；</p>
                <p>4、如使用美易分支付/分期支付/商户卡/订金/支票支付，此类支付金额不可参与美豆抵扣，当用户账户美豆不足时，需补够美豆。</p>
              </div>
              <el-button slot="reference" class="cmg__popover-tips">?</el-button>
            </el-popover>
          </el-row>
        </el-row>
        <!--美豆余额 start-->
        <el-row class="cmg__promotions-table" v-if="(returnExchangeDetail.returnRefundAgentDto.returnGomeBeanAgentDto &&
                  JSON.stringify(returnExchangeDetail.returnRefundAgentDto.returnGomeBeanAgentDto) != '{}')">
          <table class="_table" v-if="returnExchangeDetail.returnRefundAgentDto.returnGomeBeanAgentDto.allGiftGomeBeanNumber">
            <thead>
            <tr>
              <th width="30%">需回收美豆</th>
              <th width="30%">可收回美豆</th>
              <th>还需扣款</th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td>{{returnExchangeDetail.returnRefundAgentDto.returnGomeBeanAgentDto.allGiftGomeBeanNumber}}美豆
              </td>
              <td>
                -{{returnExchangeDetail.returnRefundAgentDto.returnGomeBeanAgentDto.needReturnGomeBeanNumber}}美豆
              </td>
              <td>
                -{{returnExchangeDetail.returnRefundAgentDto.deductGomeBeanAmount | formatMoney}}
              </td>
            </tr>
            </tbody>
          </table>
          <!--美券 start-->
          <table class="_table" style="border-top:none" v-if="returnExchangeDetail.returnRefundAgentDto.deductCouponisuse!='0.00' ||returnExchangeDetail.returnRefundAgentDto.returnGomeBeanAgentDto.deductCouponGomeBeanNumber !='0' ||returnExchangeDetail.returnRefundAgentDto.finalDeductCouponAmount !='0.00'">
            <thead>
              <tr>
                <th width="30%">需收回券金额</th>
                <th width="30%">美豆抵扣</th>
                <th>还需扣款</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>-￥{{returnExchangeDetail.returnRefundAgentDto.deductCouponisuse}}</td>
                <td>-{{returnExchangeDetail.returnRefundAgentDto.returnGomeBeanAgentDto.deductCouponGomeBeanNumber}}美豆</td>
                <td>-￥{{returnExchangeDetail.returnRefundAgentDto.finalDeductCouponAmount}}</td>
              </tr>
            </tbody>
          </table>
        <!--美券 end-->
        </el-row>
        <!--美豆余额 end-->
        <!--赠品分摊 start-->
        <el-row v-if="returnExchangeDetail.productDto &&
              returnExchangeDetail.productDto.skuType &&
              returnExchangeDetail.productDto.skuType != 1">
          <el-row class="cmg__deduct-money-item" data-before="赠品促销分摊总额："
                  v-if="returnExchangeDetail.returnRefundAgentDto.freeGiftShareAmountSum &&
                          returnExchangeDetail.returnRefundAgentDto.freeGiftShareAmountSum > 0">
                    <span class="cmg__span">
                    -{{returnExchangeDetail.returnRefundAgentDto.freeGiftShareAmountSum | formatMoney}}&nbsp;
                    <el-popover
                      placement="right-start"
                      width="300"
                      trigger="hover">
                      <div class="giftgomebeanbox">
                        <p class="title">赠品促销分摊明细</p>
                        <p>1、赠品分摊指的是订单拆单后，配送单中主品分摊赠品金额的明细；</p>
                        <p>2、分摊计算明细详见：<router-link :to="{path: '//mpf' + cookieDomain + '/service/helpCenter/commonProblem'}" target="_blank">赠品分摊细则></router-link></p>
                      </div>
                    <el-button slot="reference" class="form__popover__tips">?</el-button>
                    </el-popover>
                    </span>
          </el-row>
          <!--显示条件：赠品促销分摊总额存在并且金额大于0，并且赠品列表大于0-->
          <el-row class="cmg__promotions-table"
                  v-if="returnExchangeDetail.returnRefundAgentDto.freeGiftShareAmountSum &&
                          returnExchangeDetail.returnRefundAgentDto.freeGiftShareAmountSum > 0 &&
                          returnExchangeDetail.returnRefundAgentDto.shareFreeGifts &&
                          returnExchangeDetail.returnRefundAgentDto.shareFreeGifts.length > 0">
            <el-table
              border
              :data="returnExchangeDetail.returnRefundAgentDto.shareFreeGifts">
              <el-table-column
                label="赠品名称">
                <template slot-scope="scope">
                  <span :title="scope.row.freeGiftName">{{scope.row.freeGiftName}}</span>
                </template>
              </el-table-column>
              <!--<el-table-column-->
              <!--prop="freeGiftQuantity"-->
              <!--label="数量">-->
              <!--</el-table-column>-->
              <el-table-column
                label="赠品价值">
                <template slot-scope="scope">
                  <span>{{scope.row.freeGiftPrice | formatMoney}}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="本单分摊总额">
                <template slot-scope="scope">
                  <span>-{{scope.row.freeGiftShareAmount | formatMoney}}</span>
                </template>
              </el-table-column>
            </el-table>
          </el-row>
        </el-row>
        <!--赠品分摊 end-->

        <!--加价换购促销分摊
        (1.jjhgItemFlag->1:加价换购商品 0：非加价换购商品  默认为0,
        2.赠品不展示换购分摊 skuType==1表示是赠品) start-->
        <el-row class="cmg__jjhg-wrapper" v-if="returnExchangeDetail.productDto.skuType != 1">
          <el-row v-if="returnExchangeDetail.returnRefundAgentDto">
            <el-row class="cmg__deduct-money-item" data-before="换购促销分摊总额："
            v-if="returnExchangeDetail.returnRefundAgentDto.jjhgShareTotalAmountSum > 0">
                    <span class="cmg__span">
                    -{{returnExchangeDetail.returnRefundAgentDto.jjhgShareTotalAmountSum | formatMoney}}&nbsp;&nbsp;
                    <el-popover
                      placement="right-start"
                      width="300"
                      trigger="hover">
                      <div class="giftgomebeanbox">
                        <p class="title">加价换购促销分摊说明</p>
                        <p>1、换购商品售价与换购价之间的优惠金额需进行分摊，参与换购商品的所有主品、换购商品都会参与分摊</p>
                        <p>2、换购促销分摊金额的计算规则为：本商品分摊金额=换购商品需分摊金额*（本商品的销售净额/（所有参与换购活动主商品销售净额+所有换购商品售价的销售净额）</p>
                        <p>3、销售净额为商品售价减去各种促销的金额；</p>
                      </div>
                      <el-button slot="reference" class="form__popover__tips">?</el-button>
                    </el-popover>
                    </span>
            </el-row>
            <!--显示条件：赠品促销分摊总额存在并且金额大于0，并且赠品列表大于0-->
            <el-row class="cmg__promotions-table" v-if="returnExchangeDetail.returnRefundAgentDto.shareJjhgItemList && returnExchangeDetail.returnRefundAgentDto.shareJjhgItemList.length > 0">
              <el-table
                class="_table"
                border
                :data="returnExchangeDetail.returnRefundAgentDto.shareJjhgItemList">
                <el-table-column
                  label="换购商品名称">
                  <template slot-scope="scope">
                    <el-tag type="danger" size="mini">换购</el-tag>
                    <span data-before="换购" class="product-name">{{scope.row.jjhgItemName}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="数量">
                  <template slot-scope="scope">
                    <span>{{scope.row.jjhgItemQuantity}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="价格">
                  <template slot-scope="scope">
                    <p>售价:{{scope.row.jjhgItemSalePrice | formatMoney}}</p>
                    <p>换购价:{{scope.row.jjhgItemPromotionPrice | formatMoney}}</p>
                  </template>
                </el-table-column>
                <el-table-column
                  label="换购优惠（需分摊）">
                  <template slot-scope="scope">
                    <span>{{scope.row.jjhghDiscountAmount | formatMoney}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="本商品分摊金额">
                  <template slot-scope="scope">
                    <span>-{{scope.row.jjhgItemShareAmount | formatMoney}}</span>
                  </template>
                </el-table-column>
              </el-table>
            </el-row>
          </el-row>
        </el-row>
        <!--加价换购促销分摊 end-->
      </el-row>
      <!--扣款明细 end-->
    </el-row>
    <el-row class="common-money-group common-nonebefore"  v-if="returnExchangeDetail.returnRefundAgentDto">
      <!--退款明细 start-->
      <el-row class="cmg__refund-money">
        <el-row class="cmg__refund-money-title">
          <span>退款明细</span>&nbsp;
          <el-popover
            placement="right-start"
            width="400"
            trigger="hover">
            <div class="giftgomebeanbox">
              <p class="title">退款明细</p>
              <p>1、计算公式：预计退款金额=商品售价-折扣优惠金额-退还美豆价值金额-使用券金额-赠品促销分摊总额-<em>加价换购促销分摊金额</em>-赠豆抵扣金额-券扣款金额；</p>
              <p>2、使用券金额请去订单详情页查看；</p>
              <p>3、满减满折促销优惠金额+使用店长券折扣金额=折扣优惠金额，具体折扣优惠金额可取订单详情页中查看；</p>
              <p>4、由于本商品在购买时已赠送券。当商品发生退货时，如所赠的券被使用，系统将会对该商品进行扣款，扣款金额将根据商品金额比例进行分摊；</p>
            </div>
            <el-button slot="reference" class="form__popover__tips">?</el-button>
          </el-popover>
        </el-row>
        <el-row class="cmg__refund-money-item" data-before="预计退款金额：">
                <span class="cmg__span">
                <!-- 预计退款金额 正常是取：suggestRefundAmount字段，只有当returnDepositAmount金额大于0的时候才获取validRefundDetailAmount-->
                <em class="cmg__em"
                    v-if="returnExchangeDetail.returnRefundAgentDto.returnDepositAmount && returnExchangeDetail.returnRefundAgentDto.returnDepositAmount > 0">
                      
                    {{returnExchangeDetail.returnRefundAgentDto.validRefundDetailAmount | formatMoney}}
                </em>
                <em class="cmg__em"
                    v-else-if="returnExchangeDetail.returnRefundAgentDto.suggestRefundAmount">

                  {{returnExchangeDetail.returnRefundAgentDto.suggestRefundAmount | formatMoney}}
                </em>
                <em class="cmg__em" v-else>￥0.00</em>
                </span>
        </el-row>
        <el-row class="cmg__refund-money-item" data-before="退还订金：" v-if="returnExchangeDetail.returnRefundAgentDto.returnDepositAmount && returnExchangeDetail.returnRefundAgentDto.returnDepositAmount !='0.00'">
                <span class="cmg__span">
                  <em class="cmg__em">{{returnExchangeDetail.returnRefundAgentDto.returnDepositAmount | formatMoney}}</em>
                </span>
        </el-row>
        <el-row class="cmg__refund-money-item" data-before="退还美豆："
                v-if="returnExchangeDetail.returnRefundAgentDto.returnGomeBeanAgentDto &&
                      returnExchangeDetail.returnRefundAgentDto.returnGomeBeanAgentDto.sharePayGomeBeanNumber">
                <span class="cmg__span">
                <em class="cmg__em">+{{returnExchangeDetail.returnRefundAgentDto.returnGomeBeanAgentDto.sharePayGomeBeanNumber}}美豆</em>
                </span>
        </el-row>
        <el-row class="cmg__refund-money-item" data-before="退还赠卡："  v-if="returnExchangeDetail.returnCardInfos && returnExchangeDetail.returnCardInfos.length > 0">
          <div class="cmg_redund_card_item">
            <table class="_table cmg__em">
              <tr v-for="(cardItem,index) in returnExchangeDetail.returnCardInfos" :key="index">
                <td width="70"><span v-if="cardItem.cardType ==1">蓝卡</span><span v-else>补贴卡</span</td>
                <td width="150">价值:￥{{cardItem.returnCardUseAmount}}</td>
                <td>关联卡号：{{cardItem.cardMobileNo}}</td>
              </tr>
            </table>
          </div>
        </el-row>
      </el-row>
      <!--退款明细 end-->
    </el-row>
  </el-row>
</template>
<script>
  import Env from '@/api/env'
  export default {
    filters: {
      formatMoney (value) {
        "use strict";
        return '￥' + Number(value).toFixed(2);
      }
    },
    props: {
      pendingBuyGomeBean: '',
      returnExchangeDetail: {}
    },
    data () {
      return {
        cookieDomain: ''
      }
    },
    created () {
      this.cookieDomain = Env.cookieDomain;
    },
    methods: {
    },
    computed: {
      serviceGomeBeanNum:function(){
        return this.returnExchangeDetail.returnRefundAgentDto.returnGomeBeanAgentDto.deliveryServiceGiftGomeBeanNumber+this.returnExchangeDetail.returnRefundAgentDto.returnGomeBeanAgentDto.installServiceGiftGomeBeanNumber;
      },
      totalGomeBeanNum:function(){
        if(this.returnExchangeDetail.returnRefundAgentDto.returnGomeBeanAgentDto.allGiftGomeBeanNumber){
          var totalGiftGomeBeanNum = this.returnExchangeDetail.returnRefundAgentDto.returnGomeBeanAgentDto.allGiftGomeBeanNumber;
        }else{
          var totalGiftGomeBeanNum = 0;
        };
        if(this.deductionGomeBeanNum){
          var deductionGomeBeanNum = this.deductionGomeBeanNum;
        }else{
          var deductionGomeBeanNum = 0;
        };
			  return totalGiftGomeBeanNum + deductionGomeBeanNum;
      },
      deductionGomeBeanNum:function(){
        if(this.returnExchangeDetail.returnRefundAgentDto && this.returnExchangeDetail.returnRefundAgentDto.deductCouponisuse){
          return this.returnExchangeDetail.returnRefundAgentDto.deductCouponisuse*100
        }else{
          return 0;
        }
      }
    },
  }
</script>
