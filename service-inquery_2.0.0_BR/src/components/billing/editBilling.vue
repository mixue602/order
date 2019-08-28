<template>
  <div class="billing-info-box" :class="{'edit-billing-info-box': billingEdit}"> 
    <div class="selected-member" v-if="billingInitData.member && !billingEdit">
      <span v-if="billingInitData.member.temporaryCardFlag == 1">临时卡{{' ' + billingInitData.member.memberCard}}</span>
      <span v-if="memberData && memberData.memberCardInfo">{{ memberData.memberCardInfo.memberName || '' }}{{ ' ' + billingInitData.member.memberMobile || ''}}</span>
      <em @click="bindSwitchMember" v-if="billingInitData.sellerBillType != 4">切换</em>
      
    </div>
    <div class="billing-info">
      <div class="suit-title-tip-box" v-if="billingInitData.sellerBillType == 2 && billingInitData.suitInfo"><span>{{billingInitData.suitInfo.suitName}}</span> <span v-if="billingInitData.suitInfo.suitNo">TZ码：{{billingInitData.suitInfo.suitNo}}</span><em style="color: #ccc;">该套餐内所有商品{{billingInitData.suitInfo.sameMasloc == 1 ? '' : '不'}}要求同仓出库</em></div>
      <div class="main-billing-content clearfloat" :class="{'main-billing-suit-content': billingInitData.sellerBillType == 2}">
        <div class="billing-info-content"  v-for="(goods, goodsIndex) in billingInitData.skuInfoList" :key="goods.commerceItemId">
          <div class="clearfloat" style="margin-bottom: 10px;">
            <div class="server-info">
              <template v-if="goodsIndex===0">
                <el-radio-group 
                  v-if="!billingInitData.protocolId"
                  v-model="curDeliverWay"
                  @change="bindMainProDelivery" 
                  :disabled="billingEdit" 
                >
                  <!-- 如果是预售要隐藏带货安装 -->
                  <template v-for="(item, index) in deliverWayData">
                    <el-radio 
                      
                      v-if="billingInitData.sellerBillType != 1 || (billingInitData.sellerBillType == 1 && index !=2)"
                      :key="item.value" 
                      :label="item.value"
                      >{{item.label}}</el-radio>
                  </template>
                </el-radio-group>

                <!-- 
                  国美配送和带货安装都必须有地址
                  自提有地址的情况，无论是否需要建档都显示地址，原因是按照默认的地址展示该仓库商品的信息
                  自提无地址的情况，都隐藏地址，地址选择在建档里选择
                  -->

                  <div
                    v-if="billingInitData.deliverWay != 1 ||(billingInitData.deliverWay == 1 && billingInitData.address)"
                    class="input-address main-address" 
                    @click="bindDealAddress">{{billingInitData.address ? '地址：'+ billingInitData.address.addressInfo : ''}}<span v-show="!billingInitData.address">请选择地址</span>
                  </div>
                </template>


              <!-- 如果是运营商商品需要填写手机号 -->
              <div
                  v-if="isShowOperatorTicket"
                  class="input-phone main-phone" 
                  :protocoPhoneDialog="true"
                  :style="{cursor: (isVerifyOperatorTicketPhone ? '' : 'pointer')}"
                  @click="!isVerifyOperatorTicketPhone && bindDealPhone()">
                 
                    手机号码：<span v-show="!billingInitData.bindMobile">请输入会员手机号作为赠送的客户卡号</span>{{billingInitData.bindMobile ? (billingInitData.bindMobile.replace(/^(\d{4})(\d{4})(\d{3})$/,'$1****$3')) : ''}}
              </div>


              <!-- 主品无货或无价格，隐藏建档 -->
              <DeliveryWay 
                v-if="goods.transportAndInstall && goods.transportAndInstall.documentType != 0"
                :tiModel="goods.transportAndInstall"
                :query = "{
                  commerceItemId : goods.commerceItemId, 
                  fixInstallSyncFlag:goods.transportAndInstall.fixInstallSyncFlag,
                  shipmentsDate : billingUsedParam.siteType==2 && goods.presellInfo && goods.presellInfo.shipmentsDate? goods.presellInfo.shipmentsDate :null 
                }"
              ></DeliveryWay>
            
            </div>
          
            <!-- 处理商品信息模块 -->
            <div class="deal-goods-info">
              <GoodsInfo 
              :protocolId="billingInitData.protocolId||''" 
              :pGoodsData="goods" 
              :isShowNumPrice="goodsIndex == 0 ? true : false" 
              :isAllowance="goodsIndex == 0 ? isAllowance : false"
              :isFullDeposit="billingInitData.sellerBillType == 6 ? true : false"
              ></GoodsInfo>
            </div>
          </div>
          <!-- 延保 -->
          <ExtendedWarranty
            v-if="goods.loadIncrementInfo && goods.loadIncrementInfo.incrementFlag"
            :pGoodsData="goods"
            :pDialogVisible="eWarrantyDialogNum == goodsIndex ? eWarrantyDialogVisible : false"
          >
          </ExtendedWarranty>
          
        </div>
    </div>
      

      <!-- 使用券 -->
      <UseTicket 
        v-if="billingInitData.useCoupon&&billingInitData.useCoupon.useCouponShowFlag"
        :useCoupon="billingInitData.useCoupon"
        @bind-used-ticket ="bindUsedTicket"
      ></UseTicket>

      <!-- 促销 -->
      <Promotion 
        :pBuyPresent="billingInitData.buyPresent"
        :pPromotionInfo="billingInitData.promotionInfo"
        :pPromotionInfoBak="billingInitData.promotionInfo"
      ></Promotion>

      <div class="preferential-box" v-if="billingInitData.cartOperator && billingInitData.cardIsShow">
        <div class="preferential-tip">赠送卡：</div>
      
        <div class="preferential-content">
          <span> {{billingInitData.cartOperator}}</span>
          <span style=" margin-left: 20px;"> 赠送总额 <em style="color: #f60;font-style:normal;">{{billingInitData.cartOperatorAmonut || 0}}</em></span>
        </div>
      </div>

      <!-- 备注 -->
      <Note 
        :pRemark="billingInitData.remark || {}"
        :isIntermediaryShop="isIntermediaryShop"
      ></Note>
      <!-- 开单按钮盒子 -->
      <div class="belling-btn-box" v-if="billingInitData && billingInitData.totalInfo">
        
        <template v-if="isShowTotalBox && Number(billingInitData.totalInfo.amount) && Number(billingInitData.totalInfo.finalAmount)">
          <span class="num">数量：{{billingInitData.totalInfo.quantity}}</span>
          <span class="price">商品金额：¥{{billingInitData.totalInfo.amount}}</span>
          <span class="price" v-if="Number(billingInitData.totalInfo.couponAmount)">用券：-¥{{billingInitData.totalInfo.couponAmount}}</span>
          <span class="price" v-if="Number(billingInitData.totalInfo.managerCouponAmount)">店长券：-¥{{billingInitData.totalInfo.managerCouponAmount}}</span>
          <span class="price" v-if="Number(billingInitData.totalInfo.incrementAmount)">延保金额：¥{{billingInitData.totalInfo.incrementAmount}}</span>
          <template v-if="billingInitData.totalInfo.operatorCAmount&&billingInitData.totalInfo.operatorCAmount.length">
            <span v-for="(item, index) in billingInitData.totalInfo.operatorCAmount" :key="item" >{{item}}</span>
          </template>


          <template v-if="billingInitData.totalInfo.operatorQAmount&&billingInitData.totalInfo.operatorQAmount.length">
            <span v-for="(item, index) in billingInitData.totalInfo.operatorQAmount" :key="item" >{{item}}</span>
          </template>

          <span class="total-price" v-if="billingInitData && billingInitData.sellerBillType != 1">总计：<span>¥{{billingInitData.totalInfo.finalAmount}}</span></span>

          <template v-if="billingInitData.sellerBillType == 1 && billingInitData.skuInfoList && billingInitData.skuInfoList[0].presellInfo">
            <span class="total-price">{{billingInitData.skuInfoList[0].presellInfo.presellType === 0 ? '预售订金：' : '预售全款：'}}<span>{{billingInitData.totalInfo.finalAmount}}</span></span>
          </template>
        </template>
        <span class="no-price-tip" v-if="billingInitData.sellerBillType == 4 && billingInitData.skuInfoList && billingInitData.skuInfoList.length>0 && billingInitData.skuInfoList[0].priceInfo && !Number( billingInitData.skuInfoList[0].priceInfo.price)">该商品的换购活动已过期或数据异常，无法换购</span>
        <el-button
          v-if="LOGINDATA.service_billing_btn"
          :disabled="billingBtnDisabled || !billingInitData.totalInfo || !Number(billingInitData.totalInfo.finalAmount)" type="primary" 
          @click="bindGoBilling"
        >{{confirmButtonTxt}}</el-button>

          <p class="tooltip-wraper" v-if="isAllowanceInfoTip">
              当前商品有赠品或延保，开单后无法申请节能补贴
              <i class="arrow"></i>
          </p>
      </div>
      <!-- 新增地址弹窗 -->
      <el-dialog 
        :visible.sync="addAddressDialog" 
        :show-close="false"
        width="850px"
        :append-to-body="true"
        :closeOnClickModal="false"
        :closeOnPressEscape="false"
        class="billing-dialog"
        >
        <AddAddress 
          v-if="addAddressDialog"
          @bind-confirm-add-address="bindConfirmAddAddress"
          @bind-cancel-add-address="bindCancelAddAddress"
        ></AddAddress>
      </el-dialog>

      <!-- 选择地址弹窗 -->
      <el-dialog 
        :visible.sync="selectAddressDialog" 
        :show-close="false"
        width="850px"
        :append-to-body="true"
        :closeOnClickModal="false"
        :closeOnPressEscape="false"
        class="billing-dialog"
        >
      
        <SelectAddress 
          @bind-confirm-select-address="bindConfirmSelectAddress"
          @bind-cancel-select-address="bindCancelSelectAddress"
          @bind-add-new-address="bindAddNewAddress"
          :pAddressList="addressList"
          class="billing-dialog select-address"
        ></SelectAddress>
      </el-dialog>

      <!--  运营商商品绑卡手机号 -->
      <el-dialog 
      :visible.sync="protocoPhoneDialog" 
      v-if="protocoPhoneDialog"
      width="400px"  
      class="protoco-phone-box" 
      :show-close="false"
      >
        <auth-code-phone 
        @deal-protoco-phone="bindProtocoPhone"
        :from="1"
        :pBindMobile="billingInitData.bindMobile||''"
    ></auth-code-phone>
      </el-dialog>
    </div>
</div>

      
</template>

<script>
  import { mapActions, mapState, mapMutations } from 'vuex';
  import API from '@/api/billing/billing';
  import ENV from '@/api/env';
  import GoodsInfo from '@/components/billing/goodsInfo';
  import DeliveryWay from '@/components/billing/deliveryWay';
  import AddAddress from '@/components/billing/addAddress';
  import SelectAddress from '@/components/billing/selectAddress';
  import UseTicket from '@/components/billing/useTicket';
  import Promotion from '@/components/billing/promotion';
  import Note from '@/components/billing/note';
  import ExtendedWarranty from '@/components/billing/extendedWarranty';
  import AuthCodePhone from '@/components/billing/authCodePhone';
  export default {
    components: {
      GoodsInfo,
      DeliveryWay,
      AddAddress,
      SelectAddress,
      UseTicket,
      Promotion,
      Note,
      ExtendedWarranty,
      AuthCodePhone
    },
    props: {
      goodsInfo: Object,
      memberData: Object,
      isRetBindOpCard: Boolean
    },
    created: function() {
      //如果是开单页首先要调用加入导购车接口，然后再调用初始化接口
      //进入的是编辑开单页，调用编辑开单页接口
      if(this.billingEdit == true) {
        this.initLloadEditSellerBill(this)
      }
      this.curDeliverWay = this.billingInitData.deliverWay || 0;
      this.IS_OPERATE_BILLING_PAGE(false);
      
    },
    data() {
      return {
        addAddressDialog: false,//新增地址弹窗显示隐藏变量
        selectAddressDialog: false,//选择地址弹窗显示隐藏变量
        addressList: [],//地址列表数据
        disabledBillingBtnMoreClick: false,//控制开单按钮多次点击
        curDeliverWay:  0,
        deliverWayData: [
          {
            value: 0,
            label: '国美配送'
          },
          {
            value: 1,
            label: '门店自提'
          },
          {
            value: 2,
            label: '带货安装'
          },
        ],
        eWarrantyIsTip: 0,//延保是否选择，如果没有开单时提示，但只提示一次0表示没有提示，1表示已提示，2表示已提示过
        eWarrantyDialogVisible: false,//延保弹窗展示
        eWarrantyDialogNum: 0,//第几个延保展示
        isAllowanceInfoTip: false,//如果是节能补贴且选了延保，赠品，需要在开单按钮处提示
        isAllowance: false,//是否有节能补贴
        protocoPhoneDialog: false,// 运营商商品绑卡手机号弹窗是否展示
      }
    },
    computed: {
      ...mapState([
        'LOGINDATA',
        'billingInitData',
        'billingUsedParam',
        'billingEdit',
        'isOperateBillingPage'
      ]),
     //开单按钮是否置灰
      billingBtnDisabled() {
        //如果是现货或套装，用仓库来判断，如果仓库字段status=N开单按钮置灰
        //如果是运营商开票则不需要判断仓库
        //如果是预售锁库存，则有仓库字段status=N或者预售剩余库存totalLeft=0则开单按钮置灰，预售的商品信息的预售剩余数样式标红
        //如果是预售不锁库存，如果预售剩余库存totalLeft=0则开单按钮置灰，预售的商品信息的预售剩余数样式标红
        if(this.billingInitData.deliverWay>=0 && this.billingUsedParam.memberId && this.billingInitData.skuInfoList && this.billingInitData.skuInfoList.length>0) {
          //预售通过预售剩余总数来判断
          if(this.billingInitData.sellerBillType == 1 && this.billingInitData.skuInfoList[0].presellInfo && this.billingInitData.skuInfoList[0].presellInfo.totalLeft<=0) {
            return true;
          }

          //运营商开票无仓库，不需要判断仓库
          if(this.billingInitData.protocolId) {
            if(this.isShowOperatorTicket && this.billingUsedParam.temporaryCardFlag) {
              if(!this.billingInitData.bindMobile) {
                return true;
              }
            }
            return false;
          }

          //锁库存用仓库来判断
          if(this.isNoneGoods()) {
            return true;
          }

          var goodInfo = this.billingInitData.skuInfoList[0];
          //全额订金商品，仅有在途时不能点看到
          if(this.billingInitData.sellerBillType == 6 && goodInfo.dragonInfo && goodInfo.dragonInfo.masloc && goodInfo.dragonInfo.status == 'Y') {
            if(goodInfo.dragonInfo.masloc.qty<=0 &&  goodInfo.dragonInfo.masloc.abQty>0) {
              return true;
            }
          }

          return false;
        }

        return true;
      },

      //是否总计等价格数量信息
      isShowTotalBox() {
        if(this.billingInitData.skuInfoList && this.billingInitData.skuInfoList.length> 0) { 

          //运营商开票无仓库，不需要判断仓库
          if(this.billingInitData.protocolId) {
            return true;
          }

          if(this.isNoneGoods()) {
            return false;
          }
        }
        return true;
      },

      //确认按钮内容
      confirmButtonTxt() {
        if(this.billingEdit) {
          return '确定';
        }
        if(this.billingInitData.sellerBillType == 4) {
          return '换购';
        }
        return '开单';
      },

      //是否有带单商品
      isIntermediaryShop() {
        if(this.billingInitData.skuInfoList && this.billingInitData.skuInfoList.length> 0) { 
          let skuInfoList = this.billingInitData.skuInfoList;
          for(var i=0; i<skuInfoList.length; i++) {
            var dragonInfo = skuInfoList[i].dragonInfo;
            if(dragonInfo && dragonInfo.masloc && dragonInfo.masloc.intermediary) {
              return true;
            }
          }
        }
        return false;
      },

      //运营商商品是否展示蓝卡
      isShowOperatorTicket() {
        if(this.billingInitData.protocolId && this.billingInitData.cartOperator && this.billingInitData.cardIsShow) {
          return true;
        }
        return false;
      },

      //运营商商品是否需要校验绑定手机号
      isVerifyOperatorTicketPhone() {
        if(this.billingInitData.protocolId && this.billingInitData.cartOperator && this.billingInitData.cardIsShow && (!this.billingInitData.member || this.billingInitData.member && this.billingInitData.member.memberMobile)) {
          return true;
        }
        return false;
      }
    }, 
    
    methods: {
       ...mapMutations([
          'SET_BILLING_USED_PARAM',
          'SET_BILLING_INIT_DATA',
          'IS_OPERATE_BILLING_PAGE'
       ]),
       ...mapActions([
        'initOrder',
        'initLloadEditSellerBill' 
      ]),
      //绑定切换会员
      bindSwitchMember() {
         var tip = '重选会员后，部分已选内容需重选（建档、商品信息、价格、开单数量、用券、促销、备注等）。';
         this.dealSelectedConfirm(tip).then(() => {
           //1.回到临时卡模板
           this.$emit('bind-switch-member');
           this.SET_BILLING_INIT_DATA({});
         }).catch(() => {
           
         })
        
      },
      //绑定主品配送方式
      bindMainProDelivery(value) {
        var tip = '更改配送方式后，部分已选内容需重选（地址、建档、商品信息、价格、开单数量、用券、促销）。';
        if(!this.isOperateBillingPage) {
          this.dealChangeDeliveryWay();
          return false;
        }
        this.dealSelectedConfirm(tip).then(() => {
          this.dealChangeDeliveryWay();
        }).catch(() => {
          this.curDeliverWay = this.billingInitData.deliverWay;
        });

      },

      dealChangeDeliveryWay() {
        var param = JSON.parse(JSON.stringify(this.billingUsedParam));
        param.deliveryWay = this.curDeliverWay + '';
        
        API.changeDeliveryWay(param).then((data) => {
          this.IS_OPERATE_BILLING_PAGE(false);
          if(data.success) {
            this.initOrder(this);
          }else {
            this.$message({
              showClose: true,
              message: data.respMsg + '（' + data.linkId + '）',
              type: 'warning'
            });
          }
        })
      },

      //绑定配送地址事件
      bindDealAddress() {
        if(this.billingEdit) {
          return false;
        }
        var billingInitData = this.billingInitData;
        this.addressList = [];
        API.queryMemberAddressList({
          memberId: this.billingUsedParam.memberId,
          addressId: (billingInitData.address ? billingInitData.address.addressId : '')
        }).then((data) => {
          if(data.success) {
            if(data.response && data.response.length>0) {//如果返回有地址列表，则展示地址列表弹窗，如果没有则展示新增地址弹窗
              if(!billingInitData.address) {
                this.selectAddressDialog = true;
                this.addressList = data.response;
                return false;
              }
              var tip = '更更改地址后，部分已选内容需重选（建档、商品信息、价格、开单数量量、⽤用券、促销）。';
              this.dealSelectedConfirm(tip).then(() => {
                  this.selectAddressDialog = true;
                  this.addressList = data.response;
              }).catch(() => {
              });
            }else {
              this.addAddressDialog = true;
            }
          }else {
            this.$message({
              showClose: true,
              message: data.respMsg + '（' + data.linkId + '）',
              type: 'warning'
            });
          }
        })

      },

      //处理运营商手机号事件
      bindDealPhone() {
        this.protocoPhoneDialog = true;
      },

      //绑定去开单按钮，跳转到导购车页
      bindGoBilling() {

        //如果有运营商商品且有卡并且是会员的的情况
        if(this.isVerifyOperatorTicketPhone && this.isRetBindOpCard) {
          this.ajaxMessageTip('该会员手机已绑卡，请更换手机号后重试');
          return false;
        }

        //延保第一次开单时没选则弹窗提示
        this.dealEWarrantyDialogIsShow();
        
        if(!this.isAllowance && this.eWarrantyIsTip == 1 &&  !this.billingEdit) {
          this.$confirm('该商品支持购买延长保修服务，确认不需要购买吗？', '提示', {
            confirmButtonText: '直接开单',
            cancelButtonText: '购买延保',
            type: 'warning',
            customClass: 'deal-billing-message-box',
            closeOnClickModal: false,
            closeOnPressEscape: false,
            showClose: false
          }).then(() => {
            this.eWarrantyIsTip = 2;
            this.bindGoBilling();
          }).catch(() => {
            this.eWarrantyIsTip = 2;
            this.eWarrantyDialogVisible = true;
          });
          return false;
        }
        
        if(this.billingInitData.inTransitFalg && !this.billingEdit) {
          this.$confirm('当前所选的库存包含【在途商品】，是否继续开单？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            customClass: 'deal-billing-message-box',
          }).then(() => {
            this.dealGOBilling();
          }).catch(() => {
          });
          
        }else {
          this.dealGOBilling();
        }
      },

      //处理延保弹窗是否展示，如果有延保则eWarrantyIsTip=1，eWarrantyDialogNum表示展示第几个延保弹窗，如果是套装则展示有延保的那个弹窗
      dealEWarrantyDialogIsShow() {
        if(!this.eWarrantyIsTip) {
          let skuInfoList = this.billingInitData.skuInfoList;
          for(let i=0; i<skuInfoList.length; i++) {
            let loadIncrementInfo = skuInfoList[i].loadIncrementInfo;
            if(loadIncrementInfo && loadIncrementInfo.incrementFlag && loadIncrementInfo.unCheckedIncrementInfo && loadIncrementInfo.unCheckedIncrementInfo.showGroupList && loadIncrementInfo.unCheckedIncrementInfo.showGroupList.length>0) {
              if(loadIncrementInfo.checkedIncrementInfo && loadIncrementInfo.checkedIncrementInfo.length>0) {
                this.eWarrantyIsTip = 0;
                break;
              }
              if(this.eWarrantyIsTip == 1) {
                continue;
              }
              this.eWarrantyIsTip = 1;
              this.eWarrantyDialogNum = i;
            }
          }
        }
        
      },

      //处理去开单
      dealGOBilling() {
        
        var url = '/service/billingpurchase?';
            url += `memberId=${this.billingUsedParam.memberId}&memberCard=${this.billingUsedParam.memberCard}&temporaryCardFlag=${this.billingUsedParam.temporaryCardFlag}&siteType=${this.billingUsedParam.siteType}`;
        //是编辑导购单直接跳转
        if(this.billingEdit) {
          this.$router.push(url);

          return false;
        }

        var param = JSON.parse(JSON.stringify(this.billingUsedParam));
        if(this.disabledBillingBtnMoreClick) {
          return false;
        }
        this.disabledBillingBtnMoreClick = true;
        API.commitSellerBill(param).then((data) => {
          this.disabledBillingBtnMoreClick = false;
          if(data.success) {
            var url = '/service/billingpurchase?';
            url += `memberId=${this.billingUsedParam.memberId}&memberCard=${this.billingUsedParam.memberCard}&temporaryCardFlag=${this.billingUsedParam.temporaryCardFlag}&siteType=${this.billingUsedParam.siteType}`;
            for(var attr in this.billingUsedParam) {
              this.SET_BILLING_USED_PARAM({attr: attr, value: ''});
            }
            this.SET_BILLING_USED_PARAM({attr: 'temporaryCardFlag', value: 0});
            this.SET_BILLING_USED_PARAM({attr: 'siteType', value: 1});
            
            this.$router.push(url);
          }else {
            if(data.respCode == '0210030015') {//弹窗提示是否继续开单
              this.goBillingErrorDeal();
            }else if( data.respCode == 'D0210030034' || data.respCode == 'D0210150013' || data.respCode == '0210030043') {
              //D0210030034 促销的错误码, D0210150013店长券预算不足的错误码,0210030043加盟店不支持预售定金商品开单
              var str = data.respMsg,btnText = '知道了';
              if(data.respCode == 'D0210150013') {
                str += '，请进入“用券”界面，删除店长券后开单';
                btnText = '确定';
              }
              
              this.$confirm(str, '提示', {
                confirmButtonText: btnText,
                type: 'warning',
                showCancelButton: false,
              }).then(() => {
                if(data.respCode == 'D0210030034') {
                  this.initOrder(this);
                }else if(data.respCode == '0210030043') {
                  this.$router.push('/service/pushedList');
                }
              }).catch(() => {
              });

            }else {
              this.$message({
                showClose: true,
                message: data.respMsg + '（' + data.linkId + '）',
                type: 'warning'
              });
              this.initOrder(this);
            }
          }
        })
      },

      

      goBillingErrorDeal() {
        this.$confirm('部分促销数量不足，是否继续开单', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          customClass: 'deal-billing-message-box'
        }).then(() => {
          this.bindGoBilling();
        }).catch(() => {
          this.initOrder(this);  
        });
      },

      //绑定新增地址确认事件
      bindConfirmAddAddress(data) {
        this.addAddressDialog = false;
      },
      
      //绑定新增地址取消事件
      bindCancelAddAddress() {
        this.addAddressDialog = false;
      },
      //绑定选择地址确认事件
      bindConfirmSelectAddress() {
        this.selectAddressDialog = false;
      },
      //绑定选择地址取消事件
      bindCancelSelectAddress() {
        this.selectAddressDialog = false;
      },
      //绑定选择地址里的新增事件
      bindAddNewAddress() {
        this.selectAddressDialog = false;
        setTimeout(()=> {this.addAddressDialog = true;}, 200)
      },
      //绑定用券自定义事件
      bindUsedTicket(data) {
        //大load 接口
         this.initOrder(this);
      },

      //运营商商品绑卡手机号
      bindProtocoPhone() {
        this.protocoPhoneDialog = false;
      },

      //选择选项后，弹窗确认提示框
      dealSelectedConfirm(tip) {
        tip = tip || '更改会员，配送方式，开单数量、地址、建档、商品信息、价格、用券、促销需重新选择与确认。'
        return this.$confirm(tip, '提示', {
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          type: 'warning',
          customClass: 'deal-billing-message-box'
        })
      },
      //是否无货false：表示有货；true：表示无货
      isNoneGoods() {
        var arr = [];
        if(this.billingInitData.skuInfoList && this.billingInitData.skuInfoList.length>0) {
          //预售不锁库存一直有货，所以直接返回false
          if(this.billingInitData.sellerBillType == 1 && this.billingInitData.skuInfoList[0].presellInfo && this.billingInitData.skuInfoList[0].presellInfo.lockStorageFlag === 0) {
            return false;
          }
          //初始化进来如果没有默认地址的时候，dragonInfo为null
          if(!this.billingInitData.skuInfoList[0].dragonInfo) {
            return true;
          }
          //找到无库存的商品，套装有多件
          arr = this.billingInitData.skuInfoList.filter(item => {
            if(item.dragonInfo) {
              return item.dragonInfo.status == 'N';
            }
          });
          if(arr.length>0) {
            return true;
          }else {
            return false;
          }

        }
        return true;
      },

      //接口错误提示
      ajaxMessageTip(str) {
        this.$message({
          showClose: true,
          message: str,
          type: 'warning'
        });
      }
      
    },
    watch:{
      billingInitData: {
        handler: function () {
          let isAllowanceInfoTip = false,isAllowance = false;
          let allowanceInfoData = this.billingInitData.skuInfoList[0].allowanceInfo;
          this.curDeliverWay = this.billingInitData.deliverWay || 0;
          //预售与套装商品不支持节能补贴
          isAllowance = false;//energySubsidiesType 1-北京，2-国美  
          if( allowanceInfoData && (allowanceInfoData.energySubsidiesType == 1  || (allowanceInfoData.energySubsidiesType == 2 && allowanceInfoData.canBuy && allowanceInfoData.userType == 'Normal'))) {
            isAllowance = true;
          }
					
          this.isAllowance = isAllowance;
          
          if( this.isAllowance) {
            //有延保也不支持节能补贴
            if(this.billingInitData.skuInfoList[0].loadIncrementInfo && this.billingInitData.skuInfoList[0].loadIncrementInfo.checkedIncrementInfo && this.billingInitData.skuInfoList[0].loadIncrementInfo.checkedIncrementInfo.length>0) {
              isAllowanceInfoTip = true;
            }

            //支持节能补贴的商品在点击开单按钮时候，判断当前商品是否有选择赠品或买即赠，若有则提示
            //如果有买即赠，则提示
            if(this.billingInitData.buyPresent && this.billingInitData.buyPresent.gift && this.billingInitData.buyPresent.gift.baseSkuInfoList) {
              let baseSkuInfoList = this.billingInitData.buyPresent.gift.baseSkuInfoList;
              for(let i=0; i<baseSkuInfoList.length; i++) {
                if(baseSkuInfoList[i].dragonInfo && baseSkuInfoList[i].dragonInfo.status == 'Y') {
                  isAllowanceInfoTip = true;
                }
              }
            }
            
            //如果有赠品，则提示
            if(this.billingInitData.promotionInfo && this.billingInitData.promotionInfo.checkedPromotion &&  this.billingInitData.promotionInfo.checkedPromotion.gift && this.billingInitData.promotionInfo.checkedPromotion.gift.baseSkuInfoList) {
              let baseSkuInfoList = this.billingInitData.promotionInfo.checkedPromotion.gift.baseSkuInfoList;
              for(let i=0; i<baseSkuInfoList.length; i++) {
                if(baseSkuInfoList[i].dragonInfo && baseSkuInfoList[i].dragonInfo.status == 'Y') {
                  isAllowanceInfoTip = true;
                }
              }
            }
          }else {
            isAllowanceInfoTip = false;
          }

          this.isAllowanceInfoTip = isAllowanceInfoTip;
        },
        deep: true
      }
    }
  };
</script>
<style lang="stylus"  >
  .billing-container {
    .billing-info {
      .el-input, .el-radio {
        margin-bottom: 10px;
      }
    }
    .el-radio {
      color: #303133;
    }
  }
  
</style>

<style lang="stylus"  scoped>
  $b-c-g = #ccc;
  $a-c = #409EFF;
  
  .tooltip-wraper {
    position: absolute;
    right: -30px;
    top: -10px;
    z-index: 10;
    background: #fff;
    border: 1px solid #303133;
    padding: 6px;
    border-radius: 4px;
    font-size: 12px;
    line-height: 1;
    i {padding: 0;}
     .arrow, .arrow::after {
        position: absolute;
        display: block;
        width: 0;
        height: 0;
        border-color: transparent;
        border-style: solid;
     }
    .arrow {
        border-width: 6px;
        bottom: -6px;
        border-top-color: #303133;
        border-bottom-width: 0;
        right: 50px;
        &:after {
            content: " ";
            border-width: 5px;
            bottom: 1px;
            margin-left: -5px;
            border-top-color: #303133;
            border-bottom-width: 0;
            border-top-color: #fff;
        }
    }
}
  .billing-info-box {
    .selected-member {
      padding-bottom: 20px;
      border-bottom: 1px solid $b-c-g;
      font-size: 14px;

      em {
        font-style: normal;
        display: inline-block;
        color: $a-c;
        cursor: pointer;
        margin-left: 20px;
      }
    }
  }
  .billing-info {
    margin-top: 20px;
    padding: 0 10px;
  }
  .suit-title-tip-box {
    line-height: 1;
    padding-bottom: 10px;
    span {
      padding-right: 10px;
    }
     em {
        font-style: normal;
      }
  }
  .main-billing-content {
   
  }
  .main-billing-suit-content {
    border: 1px solid $b-c-g;
    min-height: 300px;
    padding: 10px;
    padding-top: 0;
    margin-bottom: 10px;
  }
  
  .main-address {
    cursor: pointer;
    position: relative;
    span {
      position: absolute;
      left: 0;
      top: 0;
      line-height: 28px;
      padding-left: 15px;
      color: $a-c;
    }
  }
  .main-phone {
    position: relative;
    line-height: 18px;
    margin-bottom: 10px;
    box-sizing: border-box;
    background-color: #fff;
    background-image: none;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    padding: 4px 15px;
    min-height: 28px;
    span {
      color: #f60;
    }
  }
  .billing-info-content {
    position: relative;
    padding-top: 10px;
  }
  .server-info {
    float: left;
    width: 40%;
    padding-right: 20px;
    box-sizing: border-box;
    border-right: 1px solid $b-c-g;
    min-height: 100px;
  }
  .deal-goods-info {
    position: relative;
    float: left;
    width: 60%;
    left: -1px;
    border-left: 1px solid $b-c-g;
    padding-left: 20px;
    box-sizing: border-box;
  }
 
  .belling-btn-box {
    line-height: 32px;
    height: 32px;
    text-align: right;
    border-top: 1px dashed $b-c-g;
    margin-top: 20px;
    padding-top: 20px;
    position: relative;
    span {
      padding-right: 20px;
    }
    .total-price {
      span {
        padding-right: 0;
        color: #f00; 
      }
    }
    .no-price-tip {
      color: #f00; 
    }
  }
   .none-goods {
    padding: 60px 0;
    text-align: center;
    p {
      padding-top: 10px;
    }
  }
</style>

