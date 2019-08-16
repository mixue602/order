<template>
	<el-row>		
		<!-- <el-row class="common-money-group cmg__cancelRefuse" data-before="促销优惠抵扣明细"  v-if="orderDetail.virtualOperationItemFlag != '1' && cancelDeliveryOrderDetail"> -->
		<el-row class="common-money-group cmg__cancelRefuse" data-before="促销优惠抵扣明细"  v-if="cancelDeliveryOrderDetail">
			<!--扣款明细 start-->
			<!--扣款明细显示条件：有美豆信息，或者有赠品信息-->
			<el-row class="cmg__deduct-money">
				<el-row class="cmg__deduct-money-title">
					<span>赠美豆</span>&nbsp;
					<el-popover
					placement="right-start"
					width="300"
					trigger="hover">
					<div class="giftgomebeanbox">
						<p class="title">美豆明细</p>
						<p>1、收回赠豆：促销赠{{orderDetail.giftGomeBean.promotionGomeBeanNum}}美豆；
							购物赠{{orderDetail.giftGomeBean.payDeliveredGomeBeanNum}}美豆；
						</p>
						<p>2、如赠送美豆已使用等导致账户里美豆不足时，将使用现金抵扣，100美豆等于抵扣1元；</p>
						<p>3、如使用美易分支付/分期支付，美易分支付/分期支付金额不可参与美豆抵扣，当用户账户美豆不足时，需补够美豆。</p>
					</div>
					<el-button slot="reference" class="cmg__popover-tips">?</el-button>
					</el-popover>
				</el-row>
				<!--预计扣款金额显示条件：有美豆信息，或者有赠品信息-->
				<el-row class="cmg__deduct-money-item" data-before="预计扣款金额：">
					<!-- <em class="cmg__em">-{{realDeductAmount | formatMoney}}</em> -->
					<em class="cmg__em">-{{orderDetail.returnRefundSummary.realDeductAmount | formatMoney}}</em>
				</el-row>
				<el-row v-if="(orderDetail.giftGomeBean && JSON.stringify(orderDetail.giftGomeBean) != '{}')">
					<el-row class="cmg__deduct-money-item" data-before="需补购美豆：" v-if="orderDetail.giftGomeBean.supplyGomeBeanNum && orderDetail.giftGomeBean.supplyGomeBeanNum > 0">
						<em class="cmg__em">{{orderDetail.giftGomeBean.supplyGomeBeanNum}}美豆</em>
					</el-row>
					<el-row class="cmg__deduct-money-item" data-before="美豆现金抵扣：" v-if="deductGomeBeanAmount">
						<span class="cmg__span">
							-{{deductGomeBeanAmount | formatMoney}}&nbsp;
						</span>
					</el-row>
					<!--美豆余额-->
					<el-row class="cmg__promotions-table">
						<table class="_table"  v-if="(orderDetail.giftGomeBean && JSON.stringify(orderDetail.giftGomeBean) != '{}') && orderDetail.giftGomeBean.totalGiftGomeBeanNum">
							<thead>
								<tr>
									<th width="30%">需回收美豆</th>
									<th width="30%">账户余额</th>
									<th>可收回美豆</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>
										{{orderDetail.giftGomeBean.totalGiftGomeBeanNum}}美豆
									</td>
									<td>
										{{orderDetail.giftGomeBean.accountAvailableGomeBeanNum}}美豆
									</td>
									<td>
										-{{orderDetail.giftGomeBean.needReturnGomeBeanNum}}美豆
									</td>
								</tr>
							</tbody>
						</table>
						<!--美豆余额 end-->
						<!--美券 start-->
						<table class="_table" style="border-top:none"  v-if="(orderDetail.giftCouponShare && JSON.stringify(orderDetail.giftCouponShare) != '{}')">
							<thead>
								<tr>
									<th width="30%">需收回券金额</th>
									<th width="30%">美豆抵扣</th>
									<th>还需扣款</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>
										<span v-if="orderDetail.giftCouponShare">-￥{{orderDetail.giftCouponShare.shareGiftCouponAmount}}</span>
									</td>
									<td>
										<span v-if="orderDetail.giftCouponShare">-{{orderDetail.giftCouponShare.deductionGomeBeanNum}}美豆</span>
									</td>
									<td>
										<span v-if="orderDetail.giftCouponShare">-￥{{orderDetail.giftCouponShare.deductAmount}}</span>
									</td>
								</tr>
							</tbody>
						</table>
					<!--美券 end-->
					</el-row>
				</el-row>
			</el-row>
			<!--扣款明细 end-->
		</el-row>
		<el-row class="common-money-group cmg__cancelRefuse" data-before="促销优惠抵扣明细"  v-else>
			<!--扣款明细 start-->
			<!--扣款明细显示条件：有美豆信息，或者有赠品信息-->
			<el-row class="cmg__deduct-money">
				<!--预计扣款金额显示条件：有美豆信息，或者有赠品信息-->
				<el-row class="cmg__deduct-money-item" data-before="预计扣款金额：">
					<!-- <em class="cmg__em">-{{realDeductAmount | formatMoney}}</em> -->
					<em class="cmg__em">-{{orderDetail.returnRefundSummary.realDeductAmount | formatMoney}}</em>
				</el-row>
				<el-row v-if="(orderDetail.giftGomeBean && JSON.stringify(orderDetail.giftGomeBean) != '{}')">
					<el-row>
						<el-row class="cmg__deduct-money-item cmg_item" data-before="美豆现金抵扣：" v-if="deductGomeBeanAmount">
							<span class="cmg__span">
								-{{deductGomeBeanAmount | formatMoney}}&nbsp;
							</span>	
						</el-row>
						<el-row class="cmg__deduct-money-item cmg_item" data-before="用户账户余额：" v-if="(orderDetail.giftGomeBean.accountAvailableGomeBeanNum || orderDetail.giftGomeBean.accountAvailableGomeBeanNum >= 0) && orderDetail.giftGomeBean.totalGiftGomeBeanNum">
							<em class="cmg__em">{{orderDetail.giftGomeBean.accountAvailableGomeBeanNum}}美豆</em>
						</el-row>
					
						<el-row class="cmg__deduct-money-item cmg_item" data-before="需补购美豆：" v-if="orderDetail.giftGomeBean.supplyGomeBeanNum && orderDetail.giftGomeBean.supplyGomeBeanNum > 0">
							<em class="cmg__em">{{orderDetail.giftGomeBean.supplyGomeBeanNum}}美豆</em>
						</el-row>
						<el-row class="cmg_item mt5 " v-if="(orderDetail.giftGomeBean.accountAvailableGomeBeanNum && orderDetail.giftGomeBean.totalGiftGomeBeanNum) || (orderDetail.giftGomeBean.supplyGomeBeanNum) || deductGomeBeanAmount">
							<el-popover
								placement="right-start"
								width="400"
								trigger="hover">
								<div class="giftgomebeanbox">
									<p class="title">美豆明细</p>
									<p>共需收回：{{totalGomeBeanNum}}美豆</p>
									<p>需收回赠豆：{{orderDetail.giftGomeBean.totalGiftGomeBeanNum}}美豆</p>
									<p v-if="orderDetail.giftCouponShare">需收回赠券：-￥{{orderDetail.giftCouponShare.shareGiftCouponAmount}}<span v-if="orderDetail.giftCouponShare">（{{deductionGomeBeanNum}}美豆）</span></p>
									<p class="mt10">1、收回赠豆：
										<span v-if="orderDetail.giftGomeBean.promotionGomeBeanNum">促销赠{{orderDetail.giftGomeBean.promotionGomeBeanNum}}美豆；</span>
										<span v-if="orderDetail.giftGomeBean.payDeliveredGomeBeanNum"> 购物赠{{orderDetail.giftGomeBean.payDeliveredGomeBeanNum}}美豆；</span>
										<span v-if="orderDetail.giftGomeBean.goodsAppraisedGomeBeanNum">商品评价赠{{orderDetail.giftGomeBean.goodsAppraisedGomeBeanNum}}美豆，</span>
										<span v-if="orderDetail.giftGomeBean.storeAppraisedGomeBeanNum">员工评价赠{{orderDetail.giftGomeBean.storeAppraisedGomeBeanNum}}美豆，</span>
										<span  v-if="serviceGomeBeanNum">服务评价赠{{serviceGomeBeanNum}}美豆、</span>
										<span v-if="orderDetail.giftGomeBean.pictureAppraisedGomeBeanNum">晒单赠豆{{orderDetail.giftGomeBean.pictureAppraisedGomeBeanNum}}美豆；</span></p>
									<p>2、收回赠券：当券未被使用时，直接收回券；当券被使用时，需收回券等额美豆；</p>
									<p>3、如赠送美豆已使用等导致账户里美豆不足时，将使用现金抵扣，100美豆等于抵扣1元；</p>
									<p>4、如使用美易分支付/分期支付/商户卡/订金/支票支付，此类支付金额不可参与美豆抵扣，当用户账户美豆不足时，需补够美豆。</p>
								</div>
								<el-button slot="reference" class="cmg__popover-tips">?</el-button>
							</el-popover>
						</el-row>
					</el-row>
					<!--美豆余额-->
					<el-row class="cmg__promotions-table">
						<table class="_table"  v-if="(orderDetail.giftGomeBean && JSON.stringify(orderDetail.giftGomeBean) != '{}') && orderDetail.giftGomeBean.totalGiftGomeBeanNum">
							<thead>
								<tr>
									<th width="30%">需回收美豆</th>
									<th width="30%">可收回美豆</th>
									<th>还需扣款</th>
									
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>
										{{orderDetail.giftGomeBean.totalGiftGomeBeanNum}}美豆
									</td>
									<td>
										-{{orderDetail.giftGomeBean.needReturnGomeBeanNum}}美豆
									</td>
									<td>
										-{{orderDetail.returnRefundSummary.deductGomeBeanAmount | formatMoney}}
									</td>
								</tr>
							</tbody>
						</table>
						<!--美豆余额 end-->
						<!--美券 start-->
						<table class="_table" style="border-top:none"  v-if="(orderDetail.giftCouponShare && JSON.stringify(orderDetail.giftCouponShare) != '{}')">
							<thead>
								<tr>
									<th width="30%">需收回券金额</th>
									<th width="30%">美豆抵扣</th>
									<th>还需扣款</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>
										-￥{{orderDetail.giftCouponShare.shareGiftCouponAmount}}
									</td>
									<td>
										-{{orderDetail.giftCouponShare.deductionGomeBeanNum}}美豆
									</td>
									<td>
										-{{orderDetail.giftCouponShare.deductAmount | formatMoney}}
									</td>
								</tr>
							</tbody>
						</table>
					<!--美券 end-->
					</el-row>
				</el-row>
			</el-row>
			<!--扣款明细 end-->
		</el-row>
		<el-row class="common-money-group common-nonebefore">
			<!--退款明细 start-->
			<el-row class="cmg__refund-money">
				<el-row class="cmg__refund-money-title">
					<span>退款金额</span>&nbsp;
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
						<em class="cmg__em" v-if="suggestRefundAmount">
							{{suggestRefundAmount | formatMoney}}
						</em>
						<em class="cmg__em" v-else>￥0.00</em>
					</span>
				</el-row>
				<el-row class="cmg__refund-money-item" data-before="退还订金：" v-if="orderDetail.useDepositAmount && orderDetail.useDepositAmount !='0.00'">
								<span class="cmg__span">
									<em class="cmg__em">{{orderDetail.useDepositAmount | formatMoney}}</em>
								</span>
				</el-row>
				<el-row class="cmg__refund-money-item" data-before="退还美豆：" v-if="orderDetail.gomeBeansCount">
								<span class="cmg__span">
								<em class="cmg__em">+{{orderDetail.gomeBeansCount}}美豆</em>
								</span>
				</el-row>
				<el-row class="cmg__refund-money-item" data-before="退还赠卡："  v-if="orderDetail.useCardList && orderDetail.useCardList.length > 0">
					<div class="cmg_redund_card_item">
						<table class="_table cmg__em">
							<tr v-for="(cardItem,index) in orderDetail.useCardList" :key="index">
								<!-- <td width="70"><span v-if="cardItem.cardType ==1">蓝卡</span><span v-else>补贴卡</span</td> -->
								<td width="100">{{cardItem.cardName}}</td>
								<td width="100">价值:￥{{cardItem.cardAmount}}</td>
								<td>关联卡号：{{cardItem.cardMobileNo}}</td>
							</tr>
						</table>
					</div>
				</el-row>
			</el-row>
		</el-row>
			<!--退款明细 end-->
	</el-row>
</template>
<script>
  import Env from '@/api/env'

  export default {
    filters: {
      formatMoney(value) {
        "use strict";
        return '￥' + Number(value).toFixed(2);
      }
    },
    props: {
      deductGomeBeanAmount: '',
      realDeductAmount: '',
      suggestRefundAmount: '',
      orderDetail: {},
      useDepositAmount:'',//退还订金
      returnExchangeDetail:'',//退还美豆
	  cancelDeliveryOrderDetail:false,
    },
    data() {
      return {
        cookieDomain: ''
      }
    },
    created() {
      this.cookieDomain = Env.cookieDomain;
    },
    methods: {},
	computed: {
		serviceGomeBeanNum:function(){
			return this.orderDetail.giftGomeBean.deliveryAppraisedGomeBeanNum+this.orderDetail.giftGomeBean.installAppraisedGomeBeanNum;
		},
		totalGomeBeanNum:function(){
			if(this.orderDetail.giftGomeBean && this.orderDetail.giftGomeBean.totalGiftGomeBeanNum){
				var totalGiftGomeBeanNum = this.orderDetail.giftGomeBean.totalGiftGomeBeanNum;
			}else{
				var totalGiftGomeBeanNum = 0;
			};
			if(this.deductionGomeBeanNum){
				var deductionGomeBeanNum = this.deductionGomeBeanNum;
			}else{
				var deductionGomeBeanNum = 0;
			}
			return totalGiftGomeBeanNum + deductionGomeBeanNum;
		},
		deductionGomeBeanNum:function(){
			if(this.orderDetail.giftCouponShare && this.orderDetail.giftCouponShare.shareGiftCouponAmount){
				return this.orderDetail.giftCouponShare.shareGiftCouponAmount*100
			}else{
				return 0;
			}
		}
	},
  }
</script>
