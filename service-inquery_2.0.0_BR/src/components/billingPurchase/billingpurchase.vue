<template>
  <div class="billingpurchase" :style="{'overflowY': 'auto','max-height': screenHeight +'px'}">
    <el-header class="billing-el-header">
      <BillHeader @bind-header="bindHeader"></BillHeader>
    </el-header>
    <div
      v-if="billingpurchase &&  billingpurchase.sellerBillList && billingpurchase.sellerBillList.length>0"
      class="billing-container"
    >
      <div class="border">
        <!-- 会员信息 -->
        <el-row v-if="billingpurchase.member">
          <el-col :span="24" v-if="billingpurchase.member.temporaryCardFlag!='1'">
            <span
              style="margin-right:15px"
              v-if="billingpurchase.member.memberName"
            >{{billingpurchase.member.memberName}}</span>
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
        <el-row class="mt20" v-for="(list,index) in billingpurchase.sellerBillList" :key="list.id">
          <el-checkbox
            class="fl billingpuerchase-wrapper"
            v-model="list.isSelected"
            @change="select(list.isSelected,list.sellerBillId,index,list.mainOfJjhg)"
            :disabled="list.disabled"
          ></el-checkbox>
          <!-- disabled onclick -->
          <div v-if="list.disabled" @click="disableAlert(list)" class="disabled-overflow"/>
          <!-- <label role="checkbox" aria-checked="true" class="el-checkbox fl is-checked"><span aria-checked="mixed" :class="list.isSelected=='0'?'el-checkbox__input':'el-checkbox__input is-checked'"><span class="el-checkbox__inner"></span><input type="checkbox" aria-hidden="true" class="el-checkbox__original" value="" @change="select(list.isSelected,list.sellerBillId,index)"></span></label> -->
          <div style="margin:0 0 10px 25px" v-if="list.sellerBillType==2">
            <span v-if="list.suit">{{list.suit.suitName}}&nbsp;&nbsp;&nbsp;TZ码：{{list.suit.suitNo}}</span>
          </div>
          <div class="border2" float="left">
            <div>
              <el-row v-for="(item,item_index) in list.skuInfoList" :key="item.id">
                <el-col :span="6">
                  <div v-if="item_index==0 && list.sellerBillType != 5">{{list.deliverWayName}}</div>
                  <div
                    style="margin:5px 0 10px 0"
                    v-if="list.address && item_index==0 && list.sellerBillType != 5"
                  >{{list.address.receiveName}}&nbsp;&nbsp;{{list.address.receiveMobile}}&nbsp;&nbsp;{{list.address.addressInfo}}</div>
                  <!-- 运营商商品导购车左侧信息展示 -->
                  <div
                    v-if="list.sellerBillType == 5 && billingpurchase.member.temporaryCardFlag!='1'"
                  >手机号码：{{ list.bindMobile }}</div>
                  <div
                    v-if="list.sellerBillType == 5 && billingpurchase.member.temporaryCardFlag=='1'"
                  >手机号码：{{list.bindMobile.substr(0,3)+"****"+list.bindMobile.substr(7)}}</div>
                  <div
                    style="margin:5px 0 10px 0"
                    v-if="list.sellerBillType == 5 && list.giftOperatorDTO"
                  >
                    赠&nbsp;&nbsp;送&nbsp;卡：{{list.giftOperatorDTO.typeDesc||''}}
                    <span
                      class="giftOperator-amount"
                    >￥{{ list.giftOperatorDTO.priceAmount || '' }}</span>
                  </div>
                </el-col>
                <el-col :span="16" :offset="item_index==0?2:8">
                  <div class="product_img">
                    <img class="borderleftline" :src="item.skuImage" :onerror="onImg">
                  </div>
                  <div class="product_info">
                    <div class="mt20">
                      <span>商品编码：{{item.skuNo}}</span>
                      <div class="product_price">
                        <span style="margin-right:20px">X{{item.quantity}}</span>
                        <span class="font_f red" style="float:right;">¥{{item.newPrice}}</span>
                        <div style="margin-left:60px" v-if="list.sellerBillType==1">预售价</div>
                      </div>
                    </div>
                    <div class="product_name">
                      <span class="all_price" v-if="list.isFullDeposit">全额订金</span>
                      {{item.skuName}}
                    </div>
                    <!-- 判断是否是不支持开发票的商品 根据secStoreCategory变量进行判断 -->
                    <div class="product_tip" v-if="item.secStoreCategory">
                      <span>{{ item.secStoreCategoryName }}类商品不支持开具发票</span>
                    </div>
                    <div
                      class="product_tip"
                      v-if="list.sellerBillType && list.sellerBillType ==  '5'"
                    >
                      <span>运营商类商品不支持开具发票</span>
                    </div>
                    <!-- 节能补贴 -->
                    <p>
                      <span v-if=" list.allowanceDTO && list.allowanceDTO.sae">节能补贴：</span>
                      <template v-if="list.allowanceDTO && list.allowanceDTO.sae">
                        <span
                          class="subsidies-rate"
                        >补贴比例{{(list.allowanceDTO.energyStandard*100).toFixed(2)}}%</span>
                        <span
                          class="subsidies-rate"
                          v-if="list.allowanceDTO.userType == 'Normal' && list.allowanceDTO.energySubsidiesType == 2 && !list.allowanceDTO.canBuy"
                        >资格已用</span>
                        <span
                          v-if="list.allowanceDTO.energySubsidiesType == 2 && list.allowanceDTO.userType == 'Temporary'"
                        >临时卡不支持</span>
                        <a
                          href="javascript:void(0)"
                          v-if="list.allowanceDTO.energySubsidiesType == 1 || (list.allowanceDTO.energySubsidiesType == 2 && list.allowanceDTO.userType == 'Normal' && list.allowanceDTO.canBuy && !billingpurchase.discountSelect)"
                          class="apply-btn"
                          @click="handleApplyDialog(list, 'apply', index)"
                        >申请</a>
                      </template>
                      <template
                        v-if="list.allowanceDTO && !list.allowanceDTO.sae && list.allowanceDTO.commonAllowanceInfo"
                      >
                        <span
                          class="subsidies-rate"
                        >{{list.allowanceDTO.commonAllowanceInfo.allowanceName}} {{list.allowanceDTO.commonAllowanceInfo.allowanceNo | formatIdNumber}}</span>
                        <a
                          href="javascript:void(0)"
                          class="apply-btn"
                          @click="handleApplyDialog(list, 'edit', index)"
                        >修改</a>
                        <a
                          href="javascript:void(0)"
                          class="apply-btn"
                          @click="cancelApplyDialog(list.sellerBillId)"
                        >取消</a>
                      </template>
                    </p>
                    <!-- <div
                      v-if="list.remark && list.remark.intermediaryId"
                    >带单导购员：{{list.remark.intermediaryId}}</div>-->
                    <div>失效时间：{{list.expirationDate | formatDate}}</div>
                  </div>
                </el-col>
                <el-col :span="24">
                  <el-row v-if="item.incrementInfoList && (list.sellerBillType==2 || list.sellerBillType==6)">
                    <el-col :span="24">
                      <div style="float:left">&nbsp;&nbsp;&nbsp;延保：</div>
                      <div
                        class="mb10"
                        style
                        v-if="item.incrementInfoList && item.incrementInfoList.length>0"
                        v-for="(v,index) in item.incrementInfoList"
                        :key="v.id"
                      >
                        <div
                          :style="index>0?'margin-left:54px;':''"
                        >{{v.displaySkuName}}{{v.years}}年&nbsp;&nbsp;&nbsp;￥{{v.incrementPrice}}&nbsp;&nbsp;&nbsp;X{{v.quantity}}</div>
                      </div>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </div>
            <!-- sellerBillType等于0是普通导购单， 1 是预售导购单， 2 是套装导购单-->
            <template v-if="list.sellerBillType==0">
              <div v-for="item in list.skuInfoList" :key="item.id">
                <el-row v-if="item.incrementInfoList && list.sellerBillType==0">
                  <el-col :span="24">
                    <div style="float:left">&nbsp;&nbsp;&nbsp;延保：</div>
                    <div
                      class="mb10"
                      v-if="item.incrementInfoList && item.incrementInfoList.length>0"
                      v-for="(v,index) in item.incrementInfoList"
                      :key="v.id"
                    >
                      <div
                        :style="index>0?'margin-left:54px':''"
                      >{{v.displaySkuName}}{{v.years}}年&nbsp;&nbsp;&nbsp;￥{{v.incrementPrice}}&nbsp;&nbsp;&nbsp;X{{v.quantity}}</div>
                    </div>
                  </el-col>
                </el-row>
              </div>
              <el-row
                class="mb10"
                v-if="list.managerCouponAmount || list.useCouponDesc || (list.operatorAmount && list.operatorAmount.length > 0)"
              >
                <el-col :span="24">
                  <div style="float:left">&nbsp;&nbsp;&nbsp;用券/卡：</div>
                  <div style="float:left">

                    <div v-if="list.managerCouponAmount">
                      <span class="font_f">-￥{{list.managerCouponAmount}}</span> X {{list.skuInfoList[0].quantity}}<span>(店长券折减)</span>
                    </div>
                    <div v-if="list.useCouponDesc2">
                      <span class="font_f">{{list.useCouponDesc2}}</span>
                    </div>
                    <div v-if="list.operatorAmount && list.operatorAmount.length > 0">
                      <template>
                        <span v-for="operatorItem in list.operatorAmount">
                          <span class="font_f">{{operatorItem.priceAmount}}</span>
                          <span>{{ operatorItem.typeDesc }}</span>
                        </span>
                      </template>
                    </div>
                  </div>
                </el-col>
              </el-row>
              <el-row class="mb10" v-if="list.promoInfo">
                <el-col :span="24">
                  <div style="float:left">&nbsp;&nbsp;&nbsp;促销：</div>
                  <div
                    v-if="(list.promoInfo && list.promoInfo.gomedoDescription) || (list.promoInfo && list.promoInfo.couponDescription)"
                    
                  >
                    <div>{{list.promoInfo.gomedoDescription}}&nbsp;&nbsp;&nbsp;{{list.promoInfo.couponDescription}}</div>
                  </div>
                  <div
                    style="float:left"
                    v-if="list.promoInfo && list.promoInfo.giftList && list.promoInfo.giftList.length>0"
                  >
                    <el-row v-for="gift in list.promoInfo.giftList" :key="gift.id">
                      <span
                        class="font_f cuxiao"
                        :style="(list.promoInfo.gomedoDescription || list.promoInfo.couponDescription)?'':'margin-left:0'"
                      >{{gift.skuName}}</span>
                      <span style="display:block;float:left">X{{gift.quantity}}</span>
                    </el-row>
                  </div>
                </el-col>
              </el-row>
              <el-row class="mb10" v-if="list.buyPresentList">
                <el-col :span="24">
                  <div style="float:left">买即赠：</div>
                  <div
                    v-if="(list.buyPresentList && list.buyPresentList.gomedoDescription) || (list.buyPresentList && list.buyPresentList.couponDescription)"
                    class="mb10"
                  >
                    <div>{{list.buyPresentList.gomedoDescription}}&nbsp;&nbsp;&nbsp;{{list.buyPresentList.couponDescription}}</div>
                  </div>
                  <div
                    style="float:left"
                    class="mb10"
                    v-if="list.buyPresentList && list.buyPresentList.giftList && list.buyPresentList.giftList.length>0"
                  >
                    <div v-for="gift in list.buyPresentList.giftList" :key="gift.id">
                      <span
                        class="font_f cuxiao"
                        :style="(list.buyPresentList.gomedoDescription || list.buyPresentList.couponDescription)?'':'margin-left:0'"
                      >{{gift.skuName}}</span>
                      <span style="display:block;float:left">X{{gift.quantity}}</span>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </template>
            <template v-if="list.sellerBillType==1">
              <!-- 定金支付 -->
              <el-row v-if="list.presellInfo">
                <el-col :span="24" class="mb10" style="margin-left:28px">
                  付款方式：
                  <span v-if="list.presellInfo.presellType==0" class="font_f">
                    订金
                    <span class="font_f red">￥{{list.presellInfo.deposit}}</span>
                    <span>
                      （可抵扣金额
                      <span class="font_f red">￥{{list.presellInfo.deductibleDeposit}}</span>)
                    </span>
                  </span>
                  <span v-else>全款</span>
                </el-col>
                <el-col
                  :span="24"
                  class="mb10"
                  style="margin-left:56px"
                  v-if="list.presellInfo.presellType==0"
                >
                  尾款：
                  <span class="font_f red">￥{{list.presellInfo.residue}}</span>
                </el-col>
                <el-col :span="24" class="mb10" v-if="list.presellInfo.presellType==0">
                  尾款支付日期：
                  <span>{{list.presellInfo.residueStartDate | formatDate}} —— {{list.presellInfo.residueEndDate | formatDate}}</span>
                </el-col>
                <el-col :span="24" class="mb10">
                  预计发货日期：
                  <span>{{list.presellInfo.shipmentsDate | formatDate2}}</span>
                </el-col>
                <el-col :span="24" class="mb10" style="margin-left:56px">
                  状态：
                  <span>{{list.presellInfo.lockStorageFlag==0?'未锁库存':'已锁库存'}}</span>
                </el-col>
              </el-row>
            </template>
            <el-row class="mb10" v-if="list.remark">
              <el-col :span="24">
                <div
                  :style="list.sellerBillType==1?'float:left;margin-left:43px':'float:left'"
                >&nbsp;&nbsp;&nbsp;备注：</div>
                <div class="remark-box" v-if="list.remark">
                  <p v-if="list.remark.ticketCode">入场券: {{ list.remark.ticketCode }}</p>
                  <p v-if="list.remark.content">备注: {{ list.remark.content }}</p>
                  <p v-if="list.remark.intermediaryId">带单导购员: {{ list.remark.intermediaryId }}</p>
                </div>
                <!-- <span class="font_f remark">{{list.remark.ticketCode}}{{list.remark.content}}</span> -->
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <div style="float:right">
                  <span v-if="list.sellerBillType==2 && list.suit">
                    套装金额：
                    <span
                      class="font_f red"
                      style="margin-right:100px"
                    >￥{{list.suit.suitPrice}}</span>
                  </span>
                  <router-link
                    style="margin-right:20px"
                    :to="{path:'/service/billing/edit',query:{memberId:billingpurchase.member.memberId,memberCard:billingpurchase.member.memberCard,temporaryCardFlag:billingpurchase.member.temporaryCardFlag, sellerBillId:list.sellerBillId,
          sellerCartId:billingpurchase.sellerCartId,siteType:billingUsedParam.siteType}}"
                    v-if="list.isCanEdit && LOGINDATA.service_billingpurchase_edit"
                  >
                    <el-button type="text" size="medium">编辑</el-button>
                  </router-link>
                  <el-button
                    type="text"
                    @click="delate(list.sellerBillId,list.mainOfJjhg)"
                    size="medium"
                    v-if="list.isCanDel && LOGINDATA.service_billingpurchase_delate
"
                  >删除</el-button>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-row>
        <el-row v-if="billingUsedParam.siteType!='2'">
          <div class="mt20">
            <!-- <label role="checkbox" aria-checked="true" class="el-checkbox fl is-checked mr20" ><span aria-checked="mixed" :class="checkAll?'el-checkbox__input  is-checked':'el-checkbox__input'"><span class="el-checkbox__inner"></span><input type="checkbox" aria-hidden="true" class="el-checkbox__original" value=""  @change="selectAll"></span></label>
            <div style="margin-left:20px">全选</div>-->
            <el-checkbox
              v-model="checkAll"
              @change="selectAll"
              v-if="billingUsedParam.siteType!='2' && isShowAllSelect"
            >全选</el-checkbox>
          </div>
        </el-row>
      </div>
      <div class="border footer mt20">
        <!-- 加价换购 -->
        <el-row
          class="mb10"
          v-if="billingpurchase.manyPromoInfo && billingpurchase.manyPromoInfo.jjhgMaxNum>0 && billingpurchase.manyPromoInfo.unCheckedPromotion.jjhgPromotionGiftList.length>0"
        >
          <el-col>
            <increase-purchase></increase-purchase>
          </el-col>
        </el-row>
        <el-row v-if="billingpurchase">
          <!-- 促销 -->
          <el-col>
            <Promotion
              :pPromotionInfo="billingpurchase.manyPromoInfo || {}"
              :pSellerBillList="{data:billingpurchase.sellerBillList||{}}"
              :pPromotionInfoBak="billingpurchase.manyPromoInfo || {}"
            ></Promotion>
          </el-col>
        </el-row>
        <!-- 满折满减 -->
        <el-row
          class="mb10"
          v-if="billingpurchase.unCheckedPriceAdjust && billingpurchase.jjhgSellerBillList && billingpurchase.jjhgSellerBillList.length>0"
        >
          <span>满减满折：</span>
          <span class="mutex">加价换购与多品促销、满折满减不可同享</span>
        </el-row>
        <el-row
          class="mb10"
          v-if="billingpurchase.unCheckedPriceAdjust && billingpurchase.gomeEnergySubsidiesSelect"
        >
          <span>满减满折：</span>
          <span class="mutex">满减满折与节能补贴不可同享</span>
        </el-row>
        <el-row
          class="mb10"
          v-if="billingpurchase.unCheckedPriceAdjust && billingpurchase.jjhgSellerBillList && billingpurchase.jjhgSellerBillList.length<=0 && !billingpurchase.gomeEnergySubsidiesSelect"
        >
          <el-col>
            <div>
              <span>满减满折：</span>
              <span
                class="cursor"
                @click="billingpurchase.jjhgSellerBillList && billingpurchase.jjhgSellerBillList.length>0?fullFoldDownShow=false:fullFoldDownShow=true"
              >
                <i
                  class="el-icon-circle-plus mr10 cursor"
                  v-if="!billingpurchase.checkedPriceAdjust"
                ></i>
                <span class="cursor" v-if="!billingpurchase.checkedPriceAdjust">可享受满减（满折）优惠</span>
              </span>
              <span
                @click="fullFoldDownShow=true"
                v-if="billingpurchase.checkedPriceAdjust"
                class="hoverBorder"
              >{{billingpurchase.checkedPriceAdjust.promotionDesc}}</span>
              <span
                class="mutex"
                v-if="billingpurchase.jjhgSellerBillList && billingpurchase.jjhgSellerBillList.length>0"
              >加价换购与多品促销、满折满减不可同享</span>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-dialog
            class="manzhemanjian"
            v-if="fullFoldDownShow"
            title
            :visible.sync="fullFoldDownShow"
            width="790px"
            align="left"
            top="20px"
            @close="close()"
          >
            <div style="overflow-y: auto; height:500px;">
              <!-- 满减 -->
              <el-row v-if="fullSubtractions.length>0">
                <el-col>
                  <el-tag class="mr10" type="danger">满减</el-tag>
                  <span>以下商品符合满减条件</span>
                </el-col>
              </el-row>
              <div
                v-for="(list,list_index) in unCheckedPriceAdjust.priceAdjustList"
                v-if="list.priceAdjustType==1"
                :key="list.id"
              >
                <div v-for="(item,item_index) in  fullSubtractions" :key="item.id">
                  <el-row class="mt">
                    <el-col>
                      <el-checkbox
                        :checked="item.isSelected==0?false:true"
                        :disabled="item.isUse==1?false:true"
                        @change="checkProduct(item.isSelected,list_index,item_index,0)"
                      >{{item.promotionDesc}}</el-checkbox>
                    </el-col>
                  </el-row>
                  <el-row>
                    <div class="border2">
                      <template>
                        <el-carousel
                          height="160px"
                          :autoplay="false"
                          :initial-index="0"
                          indicator-position="none"
                          :arrow="item.productInfoList.length>1?'hover':'never'"
                        >
                          <el-carousel-item
                            v-for="lists in item.productInfoList"
                            :key="lists.id"
                            style="background:#fff"
                          >
                            <div
                              class="products"
                              v-for="(items,i) in lists"
                              :key="items.id"
                              :style="i==lists.length-1?'margin-right:0':''"
                            >
                              <img
                                :src="items.proImageUrl"
                                :onerror="onImg"
                                width="100px"
                                height="100px"
                              >
                              <p class="name">{{items.proName}}</p>
                              <p class="price">￥{{items.proPrice}}</p>
                            </div>
                          </el-carousel-item>
                        </el-carousel>
                      </template>
                    </div>
                  </el-row>
                </div>
              </div>
              <el-row v-if="fullFolds.length>0 || wholeFolds.length>0">
                <el-col>
                  <el-tag class="mr10 mt" type="danger">满折</el-tag>
                  <span>以下商品符合满折条件</span>
                </el-col>
              </el-row>
              <!-- 满折 -->
              <div
                v-for="(list,list_index) in unCheckedPriceAdjust.priceAdjustList"
                v-if="list.priceAdjustType==2"
                :key="list.id"
              >
                <div v-for="(item,item_index) in fullFolds" :key="item.id">
                  <el-row class="mt">
                    <el-col>
                      <el-checkbox
                        :checked="item.isSelected==0?false:true"
                        :disabled="item.isUse==1?false:true"
                        @change="checkProduct(item.isSelected,list_index,item_index,1)"
                        v-if="fullSubtractions.length>0"
                      >{{item.promotionDesc}}</el-checkbox>
                      <el-checkbox
                        :checked="item.isSelected==0?false:true"
                        :disabled="item.isUse==1?false:true"
                        @change="checkProduct(item.isSelected,list_index,item_index,0)"
                        v-else
                      >{{item.promotionDesc}}</el-checkbox>
                    </el-col>
                  </el-row>
                  <el-row>
                    <div class="border2">
                      <template>
                        <el-carousel
                          height="160px"
                          :autoplay="false"
                          :initial-index="0"
                          indicator-position="none"
                          :arrow="item.productInfoList.length>1?'hover':'never'"
                        >
                          <el-carousel-item
                            v-for="lists in item.productInfoList"
                            :key="lists.id"
                            style="background:#fff"
                          >
                            <div
                              class="products"
                              v-for="(items,i) in lists"
                              :key="items.id"
                              :style="i==lists.length-1?'margin-right:0':''"
                            >
                              <img
                                :src="items.proImageUrl"
                                :onerror="onImg"
                                width="100px"
                                height="100px"
                              >
                              <p class="name">{{items.proName}}</p>
                              <p class="price">￥{{items.proPrice}}</p>
                            </div>
                          </el-carousel-item>
                        </el-carousel>
                      </template>
                    </div>
                  </el-row>
                </div>
              </div>
              <!-- 整单折 -->
              <div
                v-for="(list,list_index) in unCheckedPriceAdjust.priceAdjustList"
                v-if="list.priceAdjustType==3"
                :key="list.id"
              >
                <div v-for="(item,item_index) in wholeFolds" :key="item.id">
                  <el-row class="mt">
                    <el-col>
                      <!-- 如果满折存在就传2 如果不存在就传1 -->
                      <el-checkbox
                        :checked="item.isSelected==0?false:true"
                        :disabled="item.isUse==1?false:true"
                        @change="checkProduct(item.isSelected,list_index,item_index,2)"
                        v-if="fullSubtractions.length>0 && fullFolds.length>0"
                      >{{item.promotionDesc}}</el-checkbox>
                      <el-checkbox
                        :checked="item.isSelected==0?false:true"
                        :disabled="item.isUse==1?false:true"
                        @change="checkProduct(item.isSelected,list_index,item_index,1)"
                        v-else-if="fullSubtractions.length>0 || fullFolds.length>0"
                      >{{item.promotionDesc}}</el-checkbox>
                      <el-checkbox
                        :checked="item.isSelected==0?false:true"
                        :disabled="item.isUse==1?false:true"
                        @change="checkProduct(item.isSelected,list_index,item_index,0)"
                        v-else
                      >{{item.promotionDesc}}</el-checkbox>
                    </el-col>
                  </el-row>
                  <el-row>
                    <div class="border2">
                      <template>
                        <el-carousel
                          height="160px"
                          :autoplay="false"
                          :initial-index="0"
                          indicator-position="none"
                          :arrow="item.productInfoList.length>1?'hover':'never'"
                        >
                          <el-carousel-item
                            v-for="lists in item.productInfoList"
                            :key="lists.id"
                            style="background:#fff"
                          >
                            <div
                              class="products"
                              v-for="(items,i) in lists"
                              :key="items.id"
                              :style="i==lists.length-1?'margin-right:0':''"
                            >
                              <img
                                :src="items.proImageUrl"
                                :onerror="onImg"
                                width="100px"
                                height="100px"
                              >
                              <p class="name">{{items.proName}}</p>
                              <p class="price">￥{{items.proPrice}}</p>
                            </div>
                          </el-carousel-item>
                        </el-carousel>
                      </template>
                    </div>
                  </el-row>
                </div>
              </div>
            </div>
            <div slot="footer" class="dialog-footer">
              <el-button
                type="primary"
                @click="savePriceAdjustPromotion(true)"
                size="mini"
                style="margin-left:220px"
              >确定</el-button>
            </div>
          </el-dialog>
        </el-row>
        <el-row>
          <!-- 申请节能补贴的弹出框 -->
          <el-dialog
            :visible.sync="showApplyDialog"
            width="980px"
            :show-close="false"
            :close-on-click-modal="false"
            class="enery-dialog"
          >
            <div class="dialog-title">
              <span class="dialog-name">实名认证</span>
              <a
                href="/service/static/1.pdf"
                class="energy-guide"
                target="_blank"
                v-if="currentAllowanceType == 0"
              >节能补贴操作指导</a>
              <a
                href="/service/static/2.pdf"
                class="energy-guide"
                target="_blank"
                v-if="currentAllowanceType == 1"
              >节能补贴操作指导</a>
            </div>
            <div class="dialiog-container">
              <div class="certification-item">
                <label>证件类型：</label>
                <!--   -->
                <el-radio-group class="item-opt" :value="allowanceMessageFrom.allowanceType">
                  <el-radio label="1">
                    {{ currentAllowanceType == 0 ? '北京身份证':'居民身份证' }}
                    <div @click="beforeChange(1)" class="disabled-dialiog-container"/>
                  </el-radio>
                  <el-radio label="2" v-if="currentAllowanceType == 0">
                    驻京军人证明
                    <div @click="beforeChange(2)" class="disabled-dialiog-container"/>
                  </el-radio>
                  <el-radio label="5" v-if="currentAllowanceType == 0">
                    北京居住证
                    <div @click="beforeChange(5)" class="disabled-dialiog-container"/>
                  </el-radio>
                  <el-radio label="3" v-if="currentAllowanceType == 0">
                    工作居住证
                    <div @click="beforeChange(3)" class="disabled-dialiog-container"/>
                  </el-radio>
                  <el-radio label="4" v-if="currentAllowanceType == 0">
                    北京暂住证
                    <div @click="beforeChange(4)" class="disabled-dialiog-container"/>
                  </el-radio>
                  <el-radio label="6" v-if="currentAllowanceType == 0">
                    居住登记卡
                    <div @click="beforeChange(6)" class="disabled-dialiog-container"/>
                  </el-radio>
                </el-radio-group>
              </div>
              <div class="certification-item">
                <div class="item-opt">
                  <label>真实姓名：</label>
                  <el-input
                    v-model="allowanceMessageFrom.allowanceName"
                    placeholder="请输入真实姓名"
                    @blur="valiedateUserNameInput()"
                    maxlength="20"
                  ></el-input>
                  <span class="valiedateTips" v-if="ShowNameTip.isShow">{{ShowNameTip.message}}</span>
                </div>
              </div>
              <div class="certification-item">
                <div class="item-opt">
                  <label>身份证号码：</label>
                  <el-input
                    v-model="allowanceMessageFrom.allowanceNo"
                    placeholder="请输入身份证号码"
                    @blur="valiedateCardInput()"
                    maxlength="18"
                    @keyup.native="handleCardInput()"
                  ></el-input>
                  <span class="valiedateTips" v-if="ShowCardTip.isShow">{{ ShowCardTip.message }}</span>
                </div>
              </div>
              <div class="certification-item" v-if="allowanceMessageFrom.allowanceType != '1'">
                <div class="item-opt">
                  <label>证件编号：</label>
                  <el-input
                    v-model="allowanceMessageFrom.allowanceOtherNo"
                    placeholder="请输入证件编号"
                    @blur="valiedateCardNumberInput()"
                    maxlength="50"
                  ></el-input>
                  <span
                    class="valiedateTips"
                    v-if="ShowCardNumberTip.isShow"
                  >{{ ShowCardNumberTip.message }}</span>
                </div>
              </div>
              <div class="certification-item">
                <div class="item-opt">
                  <label>证件照片：</label>
                  <div class="pic-container">
                    <div class="uploadtype-tip">
                      <img src="../../assets/images/computer.png" class="computer-pic">
                      <span class="tip-message">电脑文件上传</span>
                    </div>
                    <span class="tips">用户的身份信息将予以加密保护，仅用于办理本次节能补贴业务</span>
                    <el-button @click="showExamplePicture">照片示例</el-button>
                    <div class="upload-list">
                      <upload-list
                        ref="uploadList1"
                        upload-desc="身份证正面"
                        allowancePicture="allowanceFrontImg"
                        :imgNum="allowanceMessageFrom.allowanceType"
                        @getImageUrl="getImageUrl"
                      ></upload-list>
                      <upload-list
                        ref="uploadList2"
                        upload-desc="身份证背面"
                        allowancePicture="allowanceReverseImg"
                        :imgNum="allowanceMessageFrom.allowanceType"
                        @getImageUrl="getImageUrl"
                      ></upload-list>
                      <upload-list
                        ref="uploadList3"
                        v-show="allowanceMessageFrom.allowanceType == '2'"
                        upload-desc="军官证里面"
                        allowancePicture="allowanceOtherImg1"
                        :imgNum="allowanceMessageFrom.allowanceType"
                        @getImageUrl="getImageUrl"
                      ></upload-list>
                      <upload-list
                        ref="uploadList4"
                        v-show="allowanceMessageFrom.allowanceType == '3'"
                        upload-desc="居住证里面"
                        allowancePicture="allowanceOtherImg2"
                        :imgNum="allowanceMessageFrom.allowanceType"
                        @getImageUrl="getImageUrl"
                      ></upload-list>
                      <upload-list
                        ref="uploadList5"
                        v-show="allowanceMessageFrom.allowanceType == '4'"
                        upload-desc="暂住证里面"
                        allowancePicture="allowanceOtherImg3"
                        :imgNum="allowanceMessageFrom.allowanceType"
                        @getImageUrl="getImageUrl"
                      ></upload-list>
                      <upload-list
                        ref="uploadList6"
                        v-show="allowanceMessageFrom.allowanceType == '3'"
                        upload-desc="客户信息基础页"
                        allowancePicture="residenceCardUserInfoImg"
                        :imgNum="allowanceMessageFrom.allowanceType"
                        @getImageUrl="getImageUrl"
                      ></upload-list>
                      <upload-list
                        ref="uploadList7"
                        v-show="allowanceMessageFrom.allowanceType == '3'"
                        upload-desc="续签第一页（非必传）"
                        allowancePicture="residenceCardRenewFirstPageImg"
                        :imgNum="allowanceMessageFrom.allowanceType"
                        @getImageUrl="getImageUrl"
                      ></upload-list>
                      <upload-list
                        ref="uploadList8"
                        v-show="allowanceMessageFrom.allowanceType == '3'"
                        upload-desc="续签第二页（非必传）"
                        allowancePicture="residenceCardRenewSecondPageImg"
                        :imgNum="allowanceMessageFrom.allowanceType"
                        @getImageUrl="getImageUrl"
                      ></upload-list>
                      <upload-list
                        ref="uploadList9"
                        v-show="allowanceMessageFrom.allowanceType == '4'"
                        upload-desc="续签第一页（非必传）"
                        allowancePicture="tempResidenceCardRenewFirstPageImg"
                        :imgNum="allowanceMessageFrom.allowanceType"
                        @getImageUrl="getImageUrl"
                      ></upload-list>
                      <upload-list
                        ref="uploadList10"
                        v-show="allowanceMessageFrom.allowanceType == '4'"
                        upload-desc="续签第二页（非必传）"
                        allowancePicture="tempResidenceCardRenewSecondPageImg"
                        :imgNum="allowanceMessageFrom.allowanceType"
                        @getImageUrl="getImageUrl"
                      ></upload-list>
                      <upload-list
                        ref="uploadList11"
                        v-show="allowanceMessageFrom.allowanceType == '5'"
                        upload-desc="居住证里面"
                        allowancePicture="norResidenceUserFrontImg"
                        :imgNum="allowanceMessageFrom.allowanceType"
                        @getImageUrl="getImageUrl"
                      ></upload-list>
                      <upload-list
                        ref="uploadList12"
                        v-show="allowanceMessageFrom.allowanceType == '5'"
                        upload-desc="居住证背面"
                        allowancePicture="norResidenceUserReverseImg"
                        :imgNum="allowanceMessageFrom.allowanceType"
                        @getImageUrl="getImageUrl"
                      ></upload-list>
                      <upload-list
                        ref="uploadList13"
                        v-show="allowanceMessageFrom.allowanceType == '6'"
                        upload-desc="登记卡正面"
                        allowancePicture="residenceCdUserFrontImg"
                        :imgNum="allowanceMessageFrom.allowanceType"
                        @getImageUrl="getImageUrl"
                      ></upload-list>
                      <upload-list
                        ref="uploadList14"
                        v-show="allowanceMessageFrom.allowanceType == '6'"
                        upload-desc="登记卡背面"
                        allowancePicture="residenceCdUserReverseImg"
                        :imgNum="allowanceMessageFrom.allowanceType"
                        @getImageUrl="getImageUrl"
                      ></upload-list>
                    </div>
                  </div>
                </div>
              </div>
              <div class="certification-item">
                <div class="item-opt">
                  <p
                    class="audit-tip"
                  >拍摄时，请保证证件边缘拍摄完整，证件信息清晰可见，避免出现证件变形、模糊、及除证件以外的其他内容入镜，否则证件信息将无法审核通过。</p>
                </div>
              </div>
            </div>
            <span slot="footer" class="dialog-footer">
              <el-button type="primary" @click="saveAllowance()">保 存</el-button>
              <el-button @click="cancelAllowance()">取 消</el-button>
            </span>
            <!-- 上传图片示例 -->
            <el-dialog
              class="example-wrapper"
              width="600px"
              title="上传图片示例"
              :visible.sync="examplePicture"
              append-to-body
              center
            >
              <div class="example-container">
                <p>拍摄时，请保证证件边缘拍摄完整，证件信息清晰可见，避免出现证件变形、模糊、及除证件以外的其他内容入镜，否则证件信息将无法审核通过。</p>
                <div class="picture-item fl">
                  <div class="tal">
                    <span>身份证正面</span>
                  </div>
                  <img src="../../assets/images/certificate_ID_Front.png">
                </div>
                <div class="picture-item fl">
                  <div class="tal">
                    <span>身份证反面</span>
                  </div>
                  <img src="../../assets/images/certificate_ID_back.png">
                </div>
                <div class="picture-item fl" v-if="allowanceMessageFrom.allowanceType == '2'">
                  <div class="tal">
                    <span>军官证里面</span>
                  </div>
                  <img src="../../assets/images/certificate_ID_officers.png">
                </div>
                <div class="picture-item fl" v-if="allowanceMessageFrom.allowanceType == '3'">
                  <div class="tal">
                    <span>居住证里面</span>
                  </div>
                  <img src="../../assets/images/certificate_gzjzz_01.png">
                </div>
                <div class="picture-item fl" v-if="allowanceMessageFrom.allowanceType == '3'">
                  <div class="tal">
                    <span>客户信息基础页</span>
                  </div>
                  <img src="../../assets/images/certificate_gzjzz_02.png">
                </div>
                <div class="picture-item fl" v-if="allowanceMessageFrom.allowanceType == '3'">
                  <div class="tal">
                    <span>续签第一页</span>
                  </div>
                  <img src="../../assets/images/certificate_gzjzz_03.png">
                </div>
                <div class="picture-item fl" v-if="allowanceMessageFrom.allowanceType == '3'">
                  <div class="tal">
                    <span>续签第二页</span>
                  </div>
                  <img src="../../assets/images/certificate_gzjzz_03.png">
                </div>
                <div class="picture-item fl" v-if="allowanceMessageFrom.allowanceType == '4'">
                  <div class="tal">
                    <span>暂住证里面</span>
                  </div>
                  <img src="../../assets/images/certificate_zanzhuzheng_ inside.png">
                </div>
                <div class="picture-item fl" v-if="allowanceMessageFrom.allowanceType == '4'">
                  <div class="tal">
                    <span>续签第一页</span>
                  </div>
                  <img src="../../assets/images/certificate_zanzhuzheng_xuqian01.png">
                </div>
                <div class="picture-item fl" v-if="allowanceMessageFrom.allowanceType == '4'">
                  <div class="tal">
                    <span>续签第二页</span>
                  </div>
                  <img src="../../assets/images/certificate_zanzhuzheng_xuqian02.png">
                </div>
                <div class="picture-item fl" v-if="allowanceMessageFrom.allowanceType == '5'">
                  <div class="tal">
                    <span>居住证里面</span>
                  </div>
                  <img src="../../assets/images/certificate_juzhuzheng_Front.png">
                </div>
                <div class="picture-item fl" v-if="allowanceMessageFrom.allowanceType == '5'">
                  <div class="tal">
                    <span>居住证背面</span>
                  </div>
                  <img src="../../assets/images/certificate_juzhuzheng_back.png">
                </div>
                <div class="picture-item fl" v-if="allowanceMessageFrom.allowanceType == '6'">
                  <div class="tal">
                    <span>登记卡正面</span>
                  </div>
                  <img src="../../assets/images/certificate_dengjika_Front.png">
                </div>
                <div class="picture-item fl" v-if="allowanceMessageFrom.allowanceType == '6'">
                  <div class="tal">
                    <span>登记卡背面</span>
                  </div>
                  <img src="../../assets/images/certificate_dengjika_back.png">
                </div>
              </div>
            </el-dialog>
          </el-dialog>
        </el-row>
        <!-- 发票 -->
        <el-row class="mb10">
          <el-col v-if="selectedNum > 0">
            <Invoice
              :invoiceP="billingpurchase.invoice || {}"
              :isFrontmoney="isFrontmoney || ''"
              :incrementAmount="billingpurchase.totalInfo && billingpurchase.totalInfo.incrementAmount || ''"
              :poolFlag="billingpurchase.seller && billingpurchase.seller.poolFlag || ''"
              :isAllUnSupportInvoice="isAllUnSupportInvoice || ''"
            ></Invoice>
          </el-col>
          <el-dialog title :visible.sync="invoiceDialog" width="30%" center>
            <div class="invoice-tip-message">
              <span v-for="(name, index) in unSupportInvoiceNames">
                <span>{{name}}</span>
                <span
                  v-show="unSupportInvoiceNames.length > 1 && index != (unSupportInvoiceNames.length - 1)"
                >/</span>
              </span>
              <span>类商品不支持开具发票，其他商品可正常开具发票，是否继续提交？</span>
            </div>
            <span slot="footer" class="dialog-footer">
              <el-button @click="invoiceDialog = false">取 消</el-button>
              <el-button type="primary" @click="continueSubmit()">确认</el-button>
            </span>
          </el-dialog>
          <el-dialog
            title
            :visible.sync="fullDepositDialog"
            width="30%"
            center
            class="fulldeposit-dialog"
          >
            <p>注意：</p>
            <p>1. 支付后不支持取消订单;</p>
            <p>2. 转销售后才开具电子发票;</p>
            <p>3. 转销售后才可申请退货退款/拒收退款;</p>
            <p>4. 延保需转销售开发票后才可维保;</p>
            <p class="tip">是否确定提交导购单？</p>
            <div class="invoice-tip-message"></div>
            <span slot="footer" class="dialog-footer">
              <el-button @click="fullDepositDialog = false">取 消</el-button>
              <el-button type="primary" @click="continueSubmit()">确认</el-button>
            </span>
          </el-dialog>
        </el-row>
        <el-row>
          <!-- 美豆正常 -->
          <el-col
            v-if="billingpurchase && billingpurchase.gomedo && billingpurchase.gomedo.canUseGomedos>=100 && billingpurchase.isShowGomedo=='1' && billingpurchase.gomedo.status == '1'"
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
        <!-- 订金翻倍 -->
        <el-row>
          <!-- 针对非联营和加盟店的门店，非临时卡的顾客账户内的订金余额>0元时才展示出该入口 -->
          <el-col
            v-if="billingpurchase.seller.poolFlag != '1' && billingpurchase.seller.poolFlag != '2' && billingpurchase.member.temporaryCardFlag!= '1' && (depositObjData.sweepCodeDposit + depositObjData.checkoutDeposit > 0) && !billingpurchase.isSelectOperator"
          >
            <div class="mt15">
              <span style="margin-right:10px;">使用订金：</span>
              <!-- 未使用 -->
              <span
                class="cursor"
                @click="openDepositDialog()"
                v-if="depositObjData.depositTypeVal == 0"
              >账户内有￥{{ Number(Math.floor(depositObjData.sweepCodeDposit * 100) / 100 + Math.floor(depositObjData.checkoutDeposit * 100) / 100).toFixed(2) }}元订金</span>
              <!-- 已使用-有翻倍 -->
              <div
                class="deposit-tip cursor"
                v-if="depositObjData.depositTypeVal == 1"
                @click="openDepositDialog()"
              >
                <span>使用订金￥{{ Number(depositObjData.preAmount).toFixed(2) }}抵￥{{ Number(depositObjData.deductibleAmount).toFixed(2) }}元</span>
                <span
                  class="tip"
                >(订单尾款需{{ depositObjData.depositTypeData == '01' ? '手机扫码': '去款台' }}支付)</span>
              </div>
              <!-- 已使用-无翻倍 -->
              <div
                class="deposit-tip cursor"
                v-if="depositObjData.depositTypeVal == 2"
                @click="openDepositDialog()"
              >
                <span>使用订金￥{{ Number(depositObjData.preAmount).toFixed(2) }}元</span>
                <span
                  class="tip"
                >(订单尾款需{{ depositObjData.depositTypeData == '01' ? '手机扫码': '去款台' }}支付)</span>
              </div>
              <span>&gt;</span>
            </div>
          </el-col>
        </el-row>
        <!-- 订金翻倍弹出框 -->
        <el-row>
          <double-deposit
            ref="depositDialog"
            :deposit-obj-data="depositObjData"
            :deposit="billingpurchase.deposits"
          ></double-deposit>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div class="line2"></div>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <div style="float:right" v-if="billingpurchase && billingpurchase.totalInfo">
              <span class="mr">
                数量：
                <span class="font_f">{{billingpurchase.totalInfo.quantity}}</span>
              </span>
              <span class="mr">
                金额总计:
                <span class="font_f">￥{{billingpurchase.totalInfo.amount}}</span>
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
              <!-- 订金翻倍 -->
              <span
                class="mr"
                v-if="billingpurchase.totalInfo.discountAmount!='0.00' && billingpurchase.totalInfo.discountAmount!=null"
              >
                折·减:
                <span class="font_f">-￥{{billingpurchase.totalInfo.discountAmount}}</span>
              </span>
              <!-- 运营商卡 -->
              <span
                class="mr"
                v-if="billingpurchase.totalInfo.deductionAmount!='0.00' && billingpurchase.totalInfo.deductionAmount!=null"
              >
                折·减:
                <span class="font_f">-￥{{billingpurchase.totalInfo.deductionAmount}}</span>
              </span>
              <span
                class="mr"
                v-if="billingpurchase.totalInfo.allowanceDiscountAmount && billingpurchase.totalInfo.allowanceDiscountAmount != '0.00'"
              >
                节能补贴扣减金额：
                <span
                  class="font_f red"
                >-¥{{billingpurchase.totalInfo.allowanceDiscountAmount}}</span>
              </span>
              <span
                class="mr"
                v-if="billingpurchase.totalInfo.depositDiscountAmount && billingpurchase.totalInfo.depositDiscountAmount != '0'"
              >
                订金支付：
                <span class="font_f red">¥{{billingpurchase.totalInfo.depositDiscountAmount}}</span>
              </span>
              <span class="mr">
                应收金额：
                <span class="font_f red">¥{{billingpurchase.totalInfo.finalAmount}}</span>
              </span>
              <el-button
                type="primary"
                @click="submit()"
                v-if="LOGINDATA.service_billingpurchase_submit"
              >提交</el-button>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-dialog
            title="使用美豆或订金需验证支付验证码"
            :visible.sync="meidouInformatione"
            width="400px"
            class="meidou"
            @close="closeCode"
          >
            <el-row v-if="billingpurchase && billingpurchase.member">
              <div class="mb10">会员手机号：{{billingpurchase.member.memberMobile}}</div>
              <el-input
                placeholder="请输入验证码"
                style="width:240px;"
                class="mr10"
                v-model="chapchaCode"
              ></el-input>
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
              <el-button @click="closeCode" size="mini">取消</el-button>
            </div>
          </el-dialog>
        </el-row>
      </div>
    </div>
    <div v-if="billingpurchase==null" style="text-align:center;margin-top:150px">
      <img src="../../assets/images/default.png" alt>
    </div>
    <div v-if="billingpurchase==null" style="text-align:center;margin-top:15px">导购单没有商品!</div>
  </div>
</template>
<script>
import { mapActions, mapState, mapMutations } from "vuex";
import Promotion from "@/components/billingPurchase/promotion";
import Invoice from "@/components/commons/invoice";
import IncreasePurchase from "@/components/commons/increasePurchase";
import BillHeader from "@/components/billHeader/billHeader";
import API from "@/api/billingPurchase/billingPurchase";
import { formatDate } from "@/common/time";
import { formatIdNumber } from "@/common/idNumber";
import Env from "@/api/env";
import UploadList from "@/components/commons/uploadList";
import DoubleDeposit from "@/components/commons/doubleDeposit";

export default {
  data() {
    return {
      screenHeight: 600,//屏幕高
      checkAll: false, //全选按钮状态
      gomedo: [], //美豆下拉框list
      gomedoValue: 0, //选中的美豆值
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
      onImg: 'this.src="' + require("../../assets/images/noImg.png") + '"',
      flag: true,
      isFrontmoney: false, //是否显示发货后可生成发票
      fullFoldDownShow: false, //满折满减弹层
      fullSubtractions: [], //满减数组
      fullFolds: [], //满折数组
      wholeFolds: [],
      unCheckedPriceAdjust: {}, //未选中的满折满减的信息
      sellerBillIdList: [], //选中的导购单id集合
      allUnSupportInvoice: true, // 选中的导购单是否为全部不支持开发票的
      invoiceDialog: false,
      continueSubmitBol: false, // 有不支持开发票的商品时是否继续提交
      unSupportInvoiceNames: [],
      selectedNum: 0, // 是否勾选商品
      showApplyDialog: false, // 申请节能补贴的弹出框
      showGomeApplyDialog: false, // 申请国美节能补贴的弹出框
      // allowanceType: '1',// 证件类型：1-京籍身份证、2-驻京军人证、3-北京工作居住证、4-北京暂住证、5-北京居住证、6-居住登记卡(如果AllowanceInfo不为NULL,那么该属性不能为空)
      userName: "",
      idNumber: "",
      dialogImageUrl: "",
      // dialogVisible: false,
      examplePicture: false, // 上传图片弹出框显示
      isApplayEreny: false, //是否已经申请过节能补贴
      ShowNameTip: {
        message: "请填写真实姓名",
        isShow: false
      }, // 用户姓名提示
      ShowCardTip: {
        message: "身份证信息输入有误，请填写18位有效身份证号码！",
        isShow: false
      }, // 身份证号提示
      ShowCardNumberTip: {
        message: "请填写证件编号",
        isShow: false
      }, // 身份证号提示
      otherAllowanceObj: {
        allowanceOtherImg1: "", //其他证件图片
        allowanceOtherImg2: "", //其他证件图片
        allowanceOtherImg3: "" //其他证件图片
      },
      allowanceMessageFrom: {
        allowanceType: "1", //证件类型
        allowanceName: "", // 补贴人姓名
        allowanceNo: "", //身份证号码
        allowanceOtherNo: "", //其他证件编号
        allowanceFrontImg: "", //身份证正面图片
        allowanceReverseImg: "", //身份证背面图片
        allowanceOtherImg: "",
        residenceCardUserInfoImg: "", //	北京工作居住证用户信息页图片
        residenceCardRenewFirstPageImg: "", //北京工作居住证续签第一页图片
        residenceCardRenewSecondPageImg: "", //北京工作居住证续签第二页图片
        tempResidenceCardRenewFirstPageImg: "", //	暂住证 续签第一页图片
        tempResidenceCardRenewSecondPageImg: "", //暂住证 续签第二页图片
        norResidenceUserFrontImg: "", //	北京居住证正面图片
        norResidenceUserReverseImg: "", //	北京居住证背面图片
        residenceCdUserFrontImg: "", //居住登记卡正面图片
        residenceCdUserReverseImg: "" //居住登记卡背面图片
      }, // 节能补贴信息
      userMessage: {}, // 会员信息
      currentAllowanceType: 0, // 0 代表北京节能补贴 1代表国美节能补贴
      fullDepositDialog: false // 全额订金提示框
    };
  },
  components: {
    BillHeader,
    Promotion,
    Invoice,
    IncreasePurchase,
    UploadList,
    DoubleDeposit
  },
  computed: {
    ...mapState([
      "LOGINDATA",
      "billingpurchase", //大接口数据
      "billingUsedParam", //会员信息
      "isAllUnSupportInvoice",
      "isShowAllSelect", // 是否显示全选按钮
      "depositObjData" // 账户中订金的对象
      // 'checkoutData', // 账户中款台订金的金额
    ]),
    allowanceType() {
      // console.log(this.allowanceMessageFrom.allowanceType)
      return this.allowanceMessageFrom.allowanceType;
    }
  },
  created() {
    var that = this;
    this.screenHeight = window.innerHeight - 40;
    this.init();
    // that.checkAll=true;
    // if(that.billingpurchase && that.billingpurchase.sellerBillList){
    //   var sellerBillList=that.billingpurchase.sellerBillList;
    //   for(var i=0;i<sellerBillList.length;i++){
    //       if(sellerBillList[i].isSelected=='0'){
    //         that.checkAll=false;
    //       }
    //   }
    // }
  },
  watch: {
    billingpurchase: {
      handler: function() {
        this.init();
      },
      deep: true
    }
    // 'allowanceMessageFrom.allowanceType': 'toggleAllowanceType',
  },
  methods: {
    openDepositDialog() {
      // this.depositVisible = true
      this.$refs.depositDialog.openDepositDialog();
    },
    beforeChange(val) {
      let result = this.judgeIsNull();
      if (!result) {
        this.$alert("切换后已填写内容会被清空，是否继续？", {
          confirmButtonText: "确定",
          callback: action => {
            if (action === "cancel") {
              return;
            } else {
              this.allowanceMessageFrom.allowanceType = val.toString();
              this.handleRemovePicture();
            }
          }
        });
      } else {
        this.allowanceMessageFrom.allowanceType = val.toString();
        this.handleRemovePicture();
      }
    },
    judgeIsNull() {
      let result = true;
      let formObj = this.allowanceMessageFrom;
      let otherObj = this.otherAllowanceObj;
      if (
        formObj.allowanceName ||
        formObj.allowanceNo ||
        formObj.allowanceOtherNo ||
        formObj.allowanceFrontImg ||
        formObj.allowanceOtherImg ||
        formObj.allowanceReverseImg ||
        formObj.norResidenceUserFrontImg ||
        formObj.norResidenceUserReverseImg ||
        formObj.residenceCardRenewFirstPageImg ||
        formObj.residenceCardRenewSecondPageImg ||
        formObj.residenceCardUserInfoImg ||
        formObj.residenceCdUserFrontImg ||
        formObj.residenceCdUserReverseImg ||
        formObj.tempResidenceCardRenewFirstPageImg ||
        formObj.tempResidenceCardRenewSecondPageImg ||
        otherObj.allowanceOtherImg1 ||
        otherObj.allowanceOtherImg2 ||
        otherObj.allowanceOtherImg3
      ) {
        result = false;
      } else {
        result = true;
      }
      return result;
    },
    disableAlert(listData) {
      // isSelectFullDeposit为true时选中的为全额订金商品
      let alertMessage = "";
      if (this.billingpurchase.isSelectAllowance) {
        if (listData.isFullDeposit) {
          alertMessage =
            "全额订金发货导购单不能与普通导购单一起提交，需取消当前选项才可勾选";
        } else {
          alertMessage =
            "节能补贴导购单不能与普通导购单一起提交，需取消当前选项才可勾选";
        }
      } else if (this.billingpurchase.isSelectFullDeposit) {
        alertMessage =
          "全额订金发货导购单不能与普通导购单一起提交，需取消当前选项才可勾选";
      }else {
        if (listData.isFullDeposit) {
          alertMessage =
          "全额订金发货导购单不能与普通导购单一起提交，需取消当前选项才可勾选";
        }else if (listData.allowanceDTO && !(listData.allowanceDTO.sea)) {
           alertMessage =
          "节能补贴导购单不能与普通导购单一起提交，需取消当前选项才可勾选";
        }else {
          alertMessage ="旧手机碎屏保导购单不能与普通导购单一起提交，需取消当前选项才可勾选";
        }
      }
      this.$alert(alertMessage, {
        confirmButtonText: "确定"
      });
    },
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
        this.gomedo.splice(0);
        this.gomedo.push(maxMeidou);
        this.handleGomedo(maxMeidou);
        // while (maxMeidou > 100) {
        //   maxMeidou = maxMeidou - 100;
        //   gomedo.push(maxMeidou);
        // }
        // that.gomedo = gomedo;
      }
      //判断全选还是不全选
      that.checkAll = true;
      that.isFrontmoney = false;
      if (that.billingpurchase && that.billingpurchase.sellerBillList) {
        var sellerBillList = that.billingpurchase.sellerBillList;
        that.sellerBillIdList = [];
        for (var i = 0; i < sellerBillList.length; i++) {
          if (sellerBillList[i].isSelected == "0") {
            that.checkAll = false;
            sellerBillList[i].isSelected = false;
          } else {
            sellerBillList[i].isSelected = true;
            // that.sellerBillIdList.push(sellerBillList[i].sellerBillId) //导购单id集合
          }
          if (
            that.billingUsedParam.siteType == 2 &&
            that.head != "" &&
            sellerBillList[i].isSelected == "1" &&
            sellerBillList[i].presellInfo &&
            sellerBillList[i].presellInfo.presellType == "0"
          ) {
            //判断是预售商品并且是定金
            that.isFrontmoney = true;
          }
        }
      }
      //  满折满减
      this.fullSubtractions = [];
      this.fullFolds = [];
      this.wholeFolds = [];
      if (
        that.billingpurchase &&
        that.billingpurchase.unCheckedPriceAdjust &&
        that.billingpurchase.unCheckedPriceAdjust.priceAdjustList
      ) {
        that.unCheckedPriceAdjust = that.billingpurchase.unCheckedPriceAdjust;
        that.manzhemanjian(that.unCheckedPriceAdjust);
      }
      // 处理是否勾选商品
      if (this.billingpurchase && this.billingpurchase.sellerBillList) {
        this.selectedNum = 0;
        this.billingpurchase.sellerBillList.forEach(item => {
          if (item.isSelected == "1") {
            this.selectedNum += 1;
          }
        });
      }
    },
    handleGomedo(maxMeidou) {
      if (maxMeidou == 0 || this.gomedo.length == 6) {
        return 1;
      } else {
        maxMeidou = maxMeidou - 100;
        this.gomedo.push(maxMeidou);
        this.handleGomedo(maxMeidou);
      }
    },
    // 点击申请节能补贴，先进行其他导购单的判断
    judgeOtherOrder(index) {
      let len = 0;
      if (this.billingpurchase && this.billingpurchase.sellerBillList) {
        this.billingpurchase.sellerBillList.forEach((item, i) => {
          if (index != i && item.isSelected) {
            len += 1;
          }
        });
      }
      if (len > 0) {
        this.$confirm(
          "如申请节能补贴其他已选内容会被清空，是否继续申请?",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }
        ).then(() => {
          this.showApplyDialog = true;
          this.handleRemovePicture();
        });
      } else {
        this.showApplyDialog = true;
        this.handleRemovePicture();
      }
    },
    // 申请节能补贴的弹出框
    handleApplyDialog(list, type, index) {
      if (list.allowanceDTO.energySubsidiesType == 2) {
        this.currentAllowanceType = 1; // 国美节能补贴
      } else if (list.allowanceDTO.energySubsidiesType == 1) {
        this.currentAllowanceType = 0; // 北京节能补贴
      }
      this.userMessage = {
        memberId: this.billingpurchase.member.memberId, // 会员ID
        sellerNum: this.billingpurchase.seller.sellerNum, //员工编号
        storeCode: this.billingpurchase.seller.storeCode, // 门店编码
        memberCard: this.billingpurchase.member.memberCard, //会员卡号
        temporaryCardFlag: this.billingpurchase.member.temporaryCardFlag, //是否临时卡 0:正常 1:临时卡
        sellerBillId: list.sellerBillId
      };
      // 申请
      if (type == "apply") {
        if (
          this.billingpurchase &&
          this.billingpurchase.jjhgSellerBillList &&
          this.billingpurchase.jjhgSellerBillList.length > 0
        ) {
          this.$confirm(
            "如申请节能补贴其他已选内容会被清空，是否继续申请？",
            "提示",
            {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }
          )
            .then(() => {
              this.showApplyDialog = true;
              this.handleRemovePicture();
            })
            .catch(() => {
              console.log("取消");
            });
        } else {
          // 点击申请，需先判断其他是否已选其他导购单
          this.judgeOtherOrder(index);
          // this.clearAllowance()
          this.allowanceMessageFrom.allowanceType = "1";
        }
      } else {
        this.showApplyDialog = true;
        this.allowanceMessageFrom = list.allowanceDTO.commonAllowanceInfo; // 编辑在弹出框中反显数据
        this.$nextTick(() => {
          this.showPicture(list.allowanceDTO.commonAllowanceInfo);
        });
      }
    },
    // 申请节能补贴示例的弹出框
    showExamplePicture() {
      this.examplePicture = true;
    },
    // 移除图片
    handleRemovePicture() {
      let length = Object.keys(this.$refs).length;
      for (var i = 0; i < length; i++) {
        let $item = this.$refs[`uploadList${i+1}`];
        if($item && $item.handleRemove) {
          $item.handleRemove();
        }
      }
      this.clearAllowance();
    },
    // 展示图片
    showPicture(allowanceObj) {
      let length = Object.keys(this.$refs).length;
      for (var i = 0; i < length; i++) {
        let $item = this.$refs[`uploadList${i+1}`];
        if($item && $item.showPictureList) {
          $item.showPictureList(allowanceObj, i+1);
        }
        
      }
    },

    // 用户姓名失去焦点时对用户姓名进行校验
    valiedateUserNameInput() {
      var userNameVal = this.allowanceMessageFrom.allowanceName.replace(
        /\s/g,
        ""
      );
      let len = this.allowanceMessageFrom.allowanceName.length;
      let firstVal = this.allowanceMessageFrom.allowanceName.substr(0, 1);
      let endVal = this.allowanceMessageFrom.allowanceName.substr(len - 1, 1);
      if (userNameVal.length <= 0) {
        this.ShowNameTip.isShow = true;
        this.ShowNameTip.message = "真实姓名不能为空";
        return false;
      }
      if (!/^([•]|[\u4e00-\u9fa5]|[·])*$/g.test(userNameVal)) {
        this.ShowNameTip.isShow = true;
        this.ShowNameTip.message = "姓名仅支持中文";
        return false;
      }
      if (
        firstVal == "·" ||
        firstVal == "•" ||
        endVal == "•" ||
        endVal == "·"
      ) {
        this.ShowNameTip.isShow = true;
        this.ShowNameTip.message = "姓名输入错误";
        return false;
      }
      if (userNameVal.length < 2) {
        this.ShowNameTip.isShow = true;
        this.ShowNameTip.message = "姓名输入错误";
        return false;
      }
      if (userNameVal.length > 20) {
        this.ShowNameTip.isShow = true;
        this.ShowNameTip.message = "姓名最多20个字符";
        return false;
      } else {
        this.ShowNameTip.isShow = false;
        this.ShowNameTip.message = "";
      }
      return true;
    },
    // 处理输入的身份证号 小写字母自动转大写字母，只允许输入数字和字母
    handleCardInput() {
      this.allowanceMessageFrom.allowanceNo = this.allowanceMessageFrom.allowanceNo.replace(
        /[\W]/g,
        ""
      );
      this.allowanceMessageFrom.allowanceNo = this.allowanceMessageFrom.allowanceNo.toUpperCase();
    },
    // 身份证号验证
    valiedateCardInput() {
      var idCard = this.allowanceMessageFrom.allowanceNo.replace(/\s/g, "");
      //var reg = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X|x)$/;
      //15位和18位身份证号码的正则表达式
      var regIdCard = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;

      if (this.allowanceMessageFrom.allowanceNo.length <= 0) {
        this.ShowCardTip.isShow = true;
        this.ShowCardTip.message = "身份证号码不能为空";
        return false;
      }
      //如果通过该验证，说明身份证格式正确，但准确性还需计算
      if (regIdCard.test(idCard)) {
        if (idCard.length == 18) {
          var idCardWi = new Array(
            7,
            9,
            10,
            5,
            8,
            4,
            2,
            1,
            6,
            3,
            7,
            9,
            10,
            5,
            8,
            4,
            2
          ); //将前17位加权因子保存在数组里
          var idCardY = new Array(1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2); //这是除以11后，可能产生的11位余数、验证码，也保存成数组
          var idCardWiSum = 0; //用来保存前17位各自乖以加权因子后的总和
          for (var i = 0; i < 17; i++) {
            idCardWiSum += idCard.substring(i, i + 1) * idCardWi[i];
          }

          var idCardMod = idCardWiSum % 11; //计算出校验码所在数组的位置
          var idCardLast = idCard.substring(17); //得到最后一位身份证号码

          //如果等于2，则说明校验码是10，身份证号码最后一位应该是X
          if (idCardMod == 2) {
            if (idCardLast == "X" || idCardLast == "x") {
              this.ShowCardTip.isShow = false;
              this.ShowCardTip.message = "";
              return true;
            } else {
              this.ShowCardTip.isShow = true;
              this.ShowCardTip.message =
                "身份证信息输入有误，请填写18位有效身份证号码！";
              return false;
            }
          } else {
            //用计算出的验证码与最后一位身份证号码匹配，如果一致，说明通过，否则是无效的身份证号码
            if (idCardLast == idCardY[idCardMod]) {
              this.ShowCardTip.isShow = false;
              this.ShowCardTip.message = "";
              return true;
            } else {
              this.ShowCardTip.isShow = true;
              this.ShowCardTip.message =
                "身份证信息输入有误，请填写18位有效身份证号码！";
              return false;
            }
          }
        }
      } else {
        this.ShowCardTip.isShow = true;
        this.ShowCardTip.message =
          "身份证信息输入有误，请填写18位有效身份证号码！";
        return false;
      }
    },
    // 证件编号验证
    valiedateCardNumberInput() {
      var cardNumberVal = this.allowanceMessageFrom.allowanceOtherNo.replace(
        /\s/g,
        ""
      );
      if (this.allowanceMessageFrom.allowanceType != "1") {
        if (cardNumberVal.length <= 0) {
          this.ShowCardNumberTip.isShow = true;
          this.ShowCardNumberTip.message = "证件编号不能为空";
          return false;
        }
        if (cardNumberVal.length > 50) {
          this.ShowCardNumberTip.isShow = true;
          this.ShowCardNumberTip.message = "证件编号不能超过50位";
          return false;
        }
        if (!/^[0-9a-zA-Z\u4e00-\u9fa5]*$/g.test(cardNumberVal)) {
          this.ShowCardNumberTip.isShow = true;
          this.ShowCardNumberTip.message =
            "证件编号仅支持数字、大小写字母、汉字";
          return false;
        }
        this.ShowCardNumberTip.isShow = false;
        this.ShowCardNumberTip.message = "";
        return true;
      }
      return true;
    },
    // 图片上传
    getImageUrl(data, type) {
      if (
        type == "allowanceOtherImg1" ||
        type == "allowanceOtherImg2" ||
        type == "allowanceOtherImg3"
      ) {
        this.otherAllowanceObj[`${type}`] = data;
      } else {
        this.allowanceMessageFrom[`${type}`] = data;
      }
    },
    // 取消节能补贴申请，恢复申请入口模式，清空保存的申请信息
    cancelApplyDialog(val) {
      // this.isApplayEreny = false
      let comParams = {
        memberId: this.billingpurchase.member.memberId, // 会员ID
        sellerNum: this.billingpurchase.seller.sellerNum, //员工编号
        storeCode: this.billingpurchase.seller.storeCode, // 门店编码
        memberCard: this.billingpurchase.member.memberCard, //会员卡号
        temporaryCardFlag: this.billingpurchase.member.temporaryCardFlag, //是否临时卡 0:正常 1:临时卡
        sellerBillId: val
      };
      API.removeAllowance(comParams).then(response => {
        this.billingpurchaseInit(this); // 重新刷新页面
      });
    },
    // 申请节能补贴弹框保存
    saveAllowance() {
      let type = this.allowanceMessageFrom.allowanceType;
      let allowanceObj = this.allowanceMessageFrom;
      let otherObj = this.otherAllowanceObj; // 其他证件 2-军官证里面/3-北京工作居住证里面/4-暂住证里面
      // console.log(validateName)
      if (!this.valiedateUserNameInput() || !this.valiedateCardInput()) {
        return false;
      } else {
        if (
          allowanceObj.allowanceFrontImg == "" ||
          allowanceObj.allowanceReverseImg == ""
        ) {
          this.$message("请上传所需证件图片");
          return false;
        } else {
          if (type == 2) {
            if (otherObj.allowanceOtherImg1 == "") {
              this.$message("请上传所需证件图片");
              return false;
            }
          } else if (type == 3) {
            if (
              otherObj.allowanceOtherImg2 == "" ||
              allowanceObj.residenceCardUserInfoImg == ""
            ) {
              this.$message("请上传所需证件图片");
              return false;
            }
          } else if (type == 4) {
            if (otherObj.allowanceOtherImg3 == "") {
              this.$message("请上传所需证件图片");
              return false;
            }
          } else if (type == 5) {
            if (
              allowanceObj.norResidenceUserFrontImg == "" ||
              allowanceObj.norResidenceUserReverseImg == ""
            ) {
              this.$message("请上传所需证件图片");
              return false;
            }
          } else if (type == 6) {
            if (
              allowanceObj.residenceCdUserFrontImg == "" ||
              allowanceObj.residenceCdUserReverseImg == ""
            ) {
              this.$message("请上传所需证件图片");
              return false;
            }
          }
        }
      }
      if (type != 1) {
        if (!this.valiedateCardNumberInput()) {
          return false;
        }
      }
      switch (type) {
        case "2":
          this.allowanceMessageFrom.allowanceOtherImg =
            otherObj.allowanceOtherImg1;
          break;
        case "3":
          this.allowanceMessageFrom.allowanceOtherImg =
            otherObj.allowanceOtherImg2;
          break;
        case "4":
          this.allowanceMessageFrom.allowanceOtherImg =
            otherObj.allowanceOtherImg3;
          break;
        default:
          this.allowanceMessageFrom.allowanceOtherImg = "";
      }

      let comParams = Object.assign(
        this.userMessage,
        this.allowanceMessageFrom
      );
      let that = this;
      API.updateAllowance(comParams).then(data => {
        if (data.success && data.response) {
          this.isApplayEreny = true;
          this.showApplyDialog = false;
          this.billingpurchaseInit(this); // 重新刷新页面
        } else if (data.respCode == "D0220050013") {
          this.$message({
            message: "申请节能补贴的商品不能同时享受满减满折，请修改",
            type: "warning"
          });
          this.billingpurchaseInit(this);
        }
      });
    },
    cancelAllowance() {
      this.billingpurchaseInit(this); // 重新刷新页面
      this.showApplyDialog = false;
    },
    cancelGomeDialog() {
      this.showGomeApplyDialog = false;
    },
    // 清空补贴弹框内容
    clearAllowance() {
      // 补贴人姓名
      this.allowanceMessageFrom.allowanceName = "";
      //身份证号码
      this.allowanceMessageFrom.allowanceNo = "";
      //其他证件编号
      this.allowanceMessageFrom.allowanceOtherNo = "";
      //身份证正面图片
      this.allowanceMessageFrom.allowanceFrontImg = "";
      //身份证背面图片
      this.allowanceMessageFrom.allowanceReverseImg = "";
      //其他证件图片
      this.allowanceMessageFrom.allowanceOtherImg = "";
      //	北京工作居住证用户信息页图片
      this.allowanceMessageFrom.residenceCardUserInfoImg = "";
      //北京工作居住证续签第一页图片
      this.allowanceMessageFrom.residenceCardRenewFirstPageImg = "";
      // 北京工作居住证续签第二页图片
      this.allowanceMessageFrom.residenceCardRenewSecondPageImg = "";
      //	暂住证 续签第一页图片
      this.allowanceMessageFrom.tempResidenceCardRenewFirstPageImg = "";
      //暂住证 续签第二页图片
      this.allowanceMessageFrom.tempResidenceCardRenewSecondPageImg = "";
      //	北京居住证正面图片
      this.allowanceMessageFrom.norResidenceUserFrontImg = "";
      //	北京居住证背面图片
      this.allowanceMessageFrom.norResidenceUserReverseImg = "";
      //居住登记卡正面图片
      this.allowanceMessageFrom.residenceCdUserFrontImg = "";
      //居住登记卡背面图片
      this.allowanceMessageFrom.residenceCdUserReverseImg = "";
      this.otherAllowanceObj.allowanceOtherImg1 = "";
      this.otherAllowanceObj.allowanceOtherImg2 = "";
      this.otherAllowanceObj.allowanceOtherImg3 = "";
      // 清空提示
      this.ShowNameTip.isShow = false;
      this.ShowCardTip.isShow = false;
      this.ShowCardNumberTip.isShow = false;
    },
    manzhemanjian(val) {
      var list = val.priceAdjustList;
      var fullSubtraction = []; //满减数组
      var fullFold = []; //满折数组
      var wholeFold = []; //满折数组

      for (var i = 0; i < list.length; i++) {
        if (list[i].priceAdjustType == 1) {
          //满减
          fullSubtraction.push(list[i]);
        } else if (list[i].priceAdjustType == 2) {
          //满折
          fullFold.push(list[i]);
        } else if (list[i].priceAdjustType == 3) {
          //整单折
          wholeFold.push(list[i]);
        }
      }
      //console.log(fullFold)
      //console.log(fullSubtraction,fullFold)
      //满减数组拆分
      var manjian = [];
      if (fullSubtraction.length > 0) {
        for (var i = 0; i < fullSubtraction.length; i++) {
          if (fullSubtraction[i].priceAdjustPromotionList) {
            for (
              var m = 0;
              m < fullSubtraction[i].priceAdjustPromotionList.length;
              m++
            ) {
              var productInfoList =
                fullSubtraction[i].priceAdjustPromotionList[m].productInfoList;
              var isSelected =
                fullSubtraction[i].priceAdjustPromotionList[m].isSelected;
              var promotionDesc =
                fullSubtraction[i].priceAdjustPromotionList[m].promotionDesc;
              var isUse = "";
              if (fullSubtraction[i].priceAdjustPromotionList[m].isUse) {
                isUse = fullSubtraction[i].priceAdjustPromotionList[m].isUse;
              }
              manjian.push(
                this.split_array(
                  productInfoList,
                  6,
                  isSelected,
                  promotionDesc,
                  isUse
                )
              );
            }
          }
        }
        this.fullSubtractions = manjian;
      }

      //满折数组拆分
      var manzhe = [];
      if (fullFold.length > 0) {
        for (var i = 0; i < fullFold.length; i++) {
          if (fullFold[i].priceAdjustPromotionList) {
            for (
              var m = 0;
              m < fullFold[i].priceAdjustPromotionList.length;
              m++
            ) {
              var productInfoList =
                fullFold[i].priceAdjustPromotionList[m].productInfoList;
              var isSelected =
                fullFold[i].priceAdjustPromotionList[m].isSelected;
              var promotionDesc =
                fullFold[i].priceAdjustPromotionList[m].promotionDesc;
              var isUse = "";
              if (fullFold[i].priceAdjustPromotionList[m].isUse) {
                isUse = fullFold[i].priceAdjustPromotionList[m].isUse;
              }
              manzhe.push(
                this.split_array(
                  productInfoList,
                  6,
                  isSelected,
                  promotionDesc,
                  isUse
                )
              );
            }
          }
        }
        this.fullFolds = manzhe;
      }
      var zhengzhe = [];
      if (wholeFold.length > 0) {
        for (var i = 0; i < wholeFold.length; i++) {
          if (wholeFold[i].priceAdjustPromotionList) {
            for (
              var m = 0;
              m < wholeFold[i].priceAdjustPromotionList.length;
              m++
            ) {
              var productInfoList =
                wholeFold[i].priceAdjustPromotionList[m].productInfoList;
              var isSelected =
                wholeFold[i].priceAdjustPromotionList[m].isSelected;
              var promotionDesc =
                wholeFold[i].priceAdjustPromotionList[m].promotionDesc;
              var isUse = "";
              if (wholeFold[i].priceAdjustPromotionList[m].isUse) {
                isUse = wholeFold[i].priceAdjustPromotionList[m].isUse;
              }
              zhengzhe.push(
                this.split_array(
                  productInfoList,
                  6,
                  isSelected,
                  promotionDesc,
                  isUse
                )
              ); 
            }
          }
        }
        this.wholeFolds = zhengzhe;
      }
    },
    //拆分数组
    split_array(arr, len, isSelected, promotionDesc, isUse) {
      var a_len = arr.length;
      var result = {
        isSelected: isSelected,
        promotionDesc: promotionDesc,
        isUse: isUse,
        productInfoList: []
      };
      for (var i = 0; i < a_len; i += len) {
        result.productInfoList.push(arr.slice(i, i + len));
      }
      return result;
    },
    //选中满折满减商品
    checkProduct(val, list_index, item_index, type) {
      //参数type 判断是满减还是满折或是整单折
      var that = this;
      //  满折满减
      if (val == 0) {
        if (
          that.unCheckedPriceAdjust.priceAdjustList[type]
            .priceAdjustPromotionList[item_index]
        ) {
          that.unCheckedPriceAdjust.priceAdjustList[
            type
          ].priceAdjustPromotionList[item_index].isSelected = 1;
        }
      } else {
        if (
          that.unCheckedPriceAdjust.priceAdjustList[type]
            .priceAdjustPromotionList[item_index]
        ) {
          that.unCheckedPriceAdjust.priceAdjustList[
            type
          ].priceAdjustPromotionList[item_index].isSelected = 0;
        }
      }
      var data = {
        unCheckedPriceAdjust: {}
      };
      data.unCheckedPriceAdjust = that.unCheckedPriceAdjust;
      API.checkPriceAdjust(data).then(data => {
        if (data.response) {
          that.unCheckedPriceAdjust = data.response;
          that.manzhemanjian(that.unCheckedPriceAdjust);
        } else {
          this.$message({
            message: data.respMsg,
            type: "warning"
          });
        }
      });
    },
    //保存满减满折促销信息
    savePriceAdjustPromotion(val, mainSellerBillIdSet, list) {
      var that = this;
      //当满减满折没有选中商品时，点击确定按钮直接关闭弹层
      var promotionInfo = {
        sellerBillIdList: [], //选中的导购单id集合
        pageFrom: 2,
        promToSellerBillList: []
      };
      promotionInfo.promToSellerBillList = [];
      var priceAdjustList = that.unCheckedPriceAdjust.priceAdjustList;
      for (var i = 0; i < priceAdjustList.length; i++) {
        var priceAdjustPromotionList =
          priceAdjustList[i].priceAdjustPromotionList;
        for (var j = 0; j < priceAdjustPromotionList.length; j++) {
          var obj = {};
          obj.promotionId = priceAdjustPromotionList[j].promotionId;
          obj.promotionType = priceAdjustPromotionList[j].promotionType;
          obj.sellerBillIdList =
            priceAdjustPromotionList[j].mainSellerBillIdSet;
          obj.isSelected = priceAdjustPromotionList[j].isSelected;
          promotionInfo.promToSellerBillList.push(obj);
        }
      }
      that.billingUsedParam.promotionInfo = promotionInfo;
      API.savePriceAdjustPromotion(that.billingUsedParam).then(data => {
        if (data.response) {
          if (val) {
            that.fullFoldDownShow = false;
            that.billingpurchaseInit(this);
          }
        } else {
          this.$message({
            message: data.respMsg,
            type: "warning"
          });
        }
      });
    },
    //关闭满折满减
    close() {
      this.fullFoldDownShow = false;
      this.billingpurchaseInit(this);
    },
    continueSubmit() {
      if (this.billingpurchase.isSelectFullDeposit) {
        this.fullDepositDialog = false;
      }
      this.invoiceDialog = false;
      this.continueSubmitBol = true;
      this.submit();
    },
    //点击提交按钮
    submit() {
      var that = this;
      var quantity = that.billingpurchase.totalInfo.quantity;
      var amount = that.billingpurchase.totalInfo.amount;
      // var isShowinvoiceDialog = that.handleStoreCategory()

      //判断是否选中导购单
      if (quantity == "0" || amount == "0.00") {
        this.$message({
          message: "请选择导购单后提交",
          type: "warning"
        });
        return false;
      }
      //判断是否填写发票
      if (
        that.billingpurchase.invoice.headType == "" &&
        that.billingpurchase.invoice.invoiceType == "" &&
        that.billingpurchase.seller.poolFlag != "1" &&
        that.billingpurchase.seller.poolFlag != "2" &&
        that.billingpurchase.supportInvoice
      ) {
        this.$message({
          message: "请输入发票信息后提交",
          type: "warning"
        });
        return false;
      }
      // 判断导购车内是否既选中有普通商品又选中有彩票/实体运营商类商品
      if (
        that.billingpurchase.invoice &&
        that.billingpurchase.invoice.invoiceDialog.length > 0
      ) {
        this.invoiceDialog = true;
        this.unSupportInvoiceNames = that.billingpurchase.invoice.invoiceDialog;
        if (!this.continueSubmitBol) {
          return false;
        } else {
          this.invoiceDialog = false;
        }
      }
      console.log(
        "that.billingpurchase.isSelectFullDeposit",
        that.billingpurchase.isSelectFullDeposit
      );
      if (that.billingpurchase.isSelectFullDeposit) {
        this.fullDepositDialog = true;
        console.log("this.continueSubmitBol", this.continueSubmitBol);
        if (!this.continueSubmitBol) {
          return false;
        } else {
          this.fullDepositDialog = false;
        }
      }
      //判断是否勾选美豆
      if (
        (that.ismeidou && !that.isFrontmoney) ||
        (this.depositObjData && this.depositObjData.depositTypeVal != "0")
      ) {
        that.meidouInformatione = true;
      } else {
        if (
          that.billingpurchase.invoice &&
          that.billingpurchase.invoice.invoiceDialog.length > 0
        ) {
          this.invoiceDialog = true;
          this.unSupportInvoiceNames =
            that.billingpurchase.invoice.invoiceDialog;
          if (!this.continueSubmitBol) {
            return false;
          } else {
            this.invoiceDialog = false;
          }
        }
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
        let conflictData = this.dealMoreBrowserConflict();
        billingUsedParam.sellerBillIds = conflictData.sellerBillIds;
        billingUsedParam.usedPromotionIds = conflictData.usedPromotionIds;

        API.commitOrder(billingUsedParam)
          .then(data => {
            if (data.success && data.response && data.response.orderId) {
              that.meidouInformatione = false;
              this.continueSubmitBol = false;
              this.billingpurchaseInit(this);
              var url =
                "//mpf" +
                Env.cookieDomain +
                "/order/orderdetailsbeforesplit?orderId=" +
                data.response.orderId +
                "&storeCode=" +
                storeCode;
              window.location.href = url;
            } else {
              if (
                data.respCode == "0220040022" ||
                data.respCode == "0219990009" ||
                data.respCode == "0219990010" ||
                data.respCode == "0220040020" ||
                data.respCode == "0210020029" ||
                data.respCode == "0210020030" ||
                data.respCode == "0220090004"
              ) {
                this.billingpurchaseInit(this);
                this.$confirm(data.respMsg, "提示", {
                  confirmButtonText: "继续提交",
                  cancelButtonText: "取消",
                  customClass: "deal-billing-message-box",
                  type: "warning"
                })
                  .then(() => {
                    API.commitOrder(billingUsedParam).then(data => {
                      if (
                        data.success &&
                        data.response &&
                        data.response.orderId
                      ) {
                        this.billingpurchaseInit(this);
                        var url =
                          "//mpf" +
                          Env.cookieDomain +
                          "/order/orderdetailsbeforesplit?orderId=" +
                          data.response.orderId +
                          "&storeCode=" +
                          storeCode;
                        window.location.href = url;
                      } else {
                        this.$message({
                          message: data.respMsg,
                          type: "warning"
                        });
                        setTimeout(function() {
                          that.billingpurchaseInit(that);
                        }, 2000);
                      }
                    });
                  })
                  .catch(() => {
                    this.billingpurchaseInit(this);
                  });
              } else if (data.respCode == "D0220050009") {
                this.$alert(data.respMsg, "提示", {
                  confirmButtonText: "知道了",
                  showClose: false,
                  center: true,
                  callback: action => {
                    this.billingpurchaseInit(this);
                  }
                });
              } else if (
                data.respCode == "D0220050011" ||
                data.respCode == "0220050012" ||
                data.respCode == "D0220050013" ||
                data.respCode == "D0220050015"
              ) {
                //D0220050011=所选中的{0}已过期或失效，请检查并重试(D0220050011)
                //0220050012=导购车已重新加载到最新数据，请检查并重试(0220050012)
                this.$message({
                  message: data.respMsg,
                  type: "warning"
                });
                setTimeout(function() {
                  that.billingpurchaseInit(that);
                }, 2000);
              } else {
                this.billingpurchaseInit(this);
                this.continueSubmitBol = false;
                this.$message({
                  message: data.respMsg,
                  type: "warning"
                });
              }
            }
          })
          .catch(() => {
            this.billingpurchaseInit(this);
          });
      }
    },

    dealMoreBrowserConflict() {
      let that = this,
        sellerBillIds = [],
        usedPromotionIds = [];
      //导购单id
      if (
        that.billingpurchase.sellerBillList &&
        that.billingpurchase.sellerBillList.length > 0
      ) {
        that.billingpurchase.sellerBillList.forEach(val => {
          if (val.isSelected) {
            sellerBillIds.push(val.sellerBillId);
          }
        });
      }
      //加价购id
      if (
        that.billingpurchase.jjhgSellerBillList &&
        that.billingpurchase.jjhgSellerBillList.length > 0
      ) {
        that.billingpurchase.jjhgSellerBillList.forEach(val => {
          if (val.isSelected) {
            sellerBillIds.push(val.sellerBillId);
          }
        });
      }

      //满减满折
      if (
        that.billingpurchase.unCheckedPriceAdjust &&
        that.billingpurchase.unCheckedPriceAdjust.priceAdjustList &&
        that.billingpurchase.unCheckedPriceAdjust.priceAdjustList.length > 0
      ) {
        that.billingpurchase.unCheckedPriceAdjust.priceAdjustList.forEach(
          value => {
            if (
              value.priceAdjustPromotionList &&
              value.priceAdjustPromotionList.length > 0
            ) {
              value.priceAdjustPromotionList.forEach(val => {
                if (val.isSelected) {
                  usedPromotionIds.push(val.promotionId);
                }
              });
            }
          }
        );
      }

      //加价换购
      if (
        that.billingpurchase.manyPromoInfo &&
        that.billingpurchase.manyPromoInfo.unCheckedPromotion &&
        that.billingpurchase.manyPromoInfo.unCheckedPromotion
          .jjhgPromotionGiftList &&
        that.billingpurchase.manyPromoInfo.unCheckedPromotion
          .jjhgPromotionGiftList.length > 0
      ) {
        let jjhgPromotionGiftList =
          that.billingpurchase.manyPromoInfo.unCheckedPromotion
            .jjhgPromotionGiftList;
        jjhgPromotionGiftList.forEach(list => {
          let promLineContentList = list.promLineContentList;
          let mark = false;
          if (promLineContentList && promLineContentList.length > 0) {
            for (let i = 0; i < promLineContentList.length; i++) {
              let giftGoodsList = promLineContentList[i].giftGoodsList;
              if (giftGoodsList && giftGoodsList.length > 0) {
                for (let j = 0; j < giftGoodsList.length; j++) {
                  if (giftGoodsList[j].isSelected) {
                    usedPromotionIds.push(list.promotionId);
                    mark = true;
                    break; //只要有一个为真，则赋值promotionId退出循环
                  }
                }
              }
              if (mark) {
                break;
              }
            }
          }
        });
      }

      //多品促销
      if (
        that.billingpurchase.manyPromoInfo &&
        that.billingpurchase.manyPromoInfo.checkedPromotion
      ) {
        let checkedPromotion =
          that.billingpurchase.manyPromoInfo.checkedPromotion;
        if (checkedPromotion.promotionId) {
          usedPromotionIds.push(checkedPromotion.promotionId);
        }
      }

      return {
        sellerBillIds: sellerBillIds,
        usedPromotionIds: usedPromotionIds
      };
    },

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
      let conflictData = this.dealMoreBrowserConflict();
      billingUsedParam.sellerBillIds = conflictData.sellerBillIds;
      billingUsedParam.usedPromotionIds = conflictData.usedPromotionIds;

      var storeCode = billingUsedParam.storeCode;
      if (that.submitchapchaCode) {
        billingUsedParam.chapchaCode = that.submitchapchaCode;
        API.commitOrder(billingUsedParam)
          .then(data => {
            if (data.success && data.response && data.response.orderId) {
              that.meidouInformatione = false;
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
              that.meidouInformatione = false; //关闭美豆弹框
              if (
                data.respCode == "0220040022" ||
                data.respCode == "0219990009" ||
                data.respCode == "0219990010" ||
                data.respCode == "0220040020" ||
                data.respCode == "0210020029" ||
                data.respCode == "0210020030"
              ) {
                this.billingpurchaseInit(this);
                this.$confirm(data.respMsg, "提示", {
                  confirmButtonText: "继续提交",
                  cancelButtonText: "取消",
                  customClass: "deal-billing-message-box",
                  type: "warning"
                })
                  .then(() => {
                    API.commitOrder(billingUsedParam).then(data => {
                      if (
                        data.success &&
                        data.response &&
                        data.response.orderId
                      ) {
                        this.billingpurchaseInit(this);
                        var url =
                          "//mpf" +
                          Env.cookieDomain +
                          "/order/orderdetailsbeforesplit?orderId=" +
                          data.response.orderId +
                          "&storeCode=" +
                          storeCode;
                        window.location.href = url;
                      } else {
                        this.$message({
                          message: data.respMsg,
                          type: "warning"
                        });
                        setTimeout(function() {
                          that.billingpurchaseInit(that);
                        }, 2000);
                      }
                    });
                  })
                  .catch(() => {
                    this.billingpurchaseInit(this);
                  });
              } else if (data.respCode == "D0220050009") {
                this.$alert(data.respMsg, "提示", {
                  confirmButtonText: "知道了",
                  showClose: false,
                  center: true,
                  callback: action => {
                    this.billingpurchaseInit(this);
                  }
                });
              } else if (
                data.respCode == "D0220050011" ||
                data.respCode == "0220050012"
              ) {
                //D0220050011=所选中的{0}已过期或失效，请检查并重试(D0220050011)
                //0220050012=导购车已重新加载到最新数据，请检查并重试(0220050012)
                this.$message({
                  message: data.respMsg,
                  type: "warning"
                });
                setTimeout(function() {
                  that.billingpurchaseInit(that);
                }, 2000);
              } else {
                this.billingpurchaseInit(this);
                this.$message({
                  message: data.respMsg,
                  type: "warning"
                });
              }
            }
          })
          .catch(() => {
            this.billingpurchaseInit(this);
          });
      } else {
        this.$message({
          message: "请输入验证码",
          type: "warning"
        });
      }
    },
    //取消勾选导购单
    unCheckSellerBill(sellerBillId, index) {
      // sellerBillId 导购单id
      // index  导购单索引
      var that = this;
      var list = this.billingpurchase.sellerBillList;
      var billingUsedParam = JSON.parse(JSON.stringify(this.billingUsedParam));
      billingUsedParam.sellerBillId = sellerBillId;
      if (this.billingUsedParam && this.billingUsedParam.siteType == "2") {
        for (var i = 0; i < list.length; i++) {
          list[i].isSelected = false;
        }
      }
      //取消勾选导购单
      API.unCheckSellerBill(billingUsedParam).then(data => {
        if (data.success) {
          that.billingpurchase.sellerBillList[index].isSelected = false;
          that.checkAll = false;
          that.billingpurchaseInit(this);
        } else {
          this.$message({
            message: data.respMsg,
            type: "warning"
          });
        }
      });
    },
    //勾选导购单
    checkSellerBill(sellerBillId, index) {
      // sellerBillId 导购单id
      // index  导购单索引
      var that = this;
      var that = this;
      var list = this.billingpurchase.sellerBillList;
      var billingUsedParam = JSON.parse(JSON.stringify(this.billingUsedParam));
      billingUsedParam.sellerBillId = sellerBillId;
      if (this.billingUsedParam && this.billingUsedParam.siteType == "2") {
        for (var i = 0; i < list.length; i++) {
          list[i].isSelected = false;
        }
      }
      API.checkSellerBill(billingUsedParam).then(data => {
        if (data.success) {
          this.billingpurchase.sellerBillList[index].isSelected = true;
          that.checkAll = true;
          for (var i = 0; i < list.length; i++) {
            if (list[i].isSelected == false) {
              that.checkAll = false;
            }
          }
          that.billingpurchaseInit(this);
        } else {
          this.$message({
            message: data.respMsg,
            type: "warning"
          });
        }
      });
    },
    //点击单个单选框
    select(isSelected, sellerBillId, index, mainOfJjhg) {
      // isSelected 导购单是否勾选 1勾选 0未勾选
      // sellerBillId 导购单id
      // index  导购单索引
      // mainOfJjhg 已经选的换购单是否和主品有关系
      var that = this;
      if (!isSelected) {
        if (mainOfJjhg) {
          that.billingpurchase.sellerBillList[index].isSelected = true;
          that.checkAll = true;
          this.$confirm("变更该导购单后将可能需要重新选择换购商品", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            customClass: "deal-billing-message-box",
            type: "warning"
          })
            .then(() => {
              //取消勾选
              that.unCheckSellerBill(sellerBillId, index);
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消删除"
              });
            });
        } else {
          //取消勾选
          that.unCheckSellerBill(sellerBillId, index);
        }
      } else {
        //勾选导购单
        that.checkSellerBill(sellerBillId, index);
      }
    },
    //点击全选按钮
    selectAll(val) {
      var that = this;
      var list = this.billingpurchase.sellerBillList;
      if (!that.checkAll) {
        //取消全选
        API.unCheckAllSellerBill(that.billingUsedParam).then(data => {
          if (data.success) {
            for (var i = 0; i < list.length; i++) {
              list[i].isSelected = false;
            }
            that.checkAll = false;
            this.billingpurchaseInit(this);
          } else {
            this.$message({
              message: data.respMsg,
              type: "warning"
            });
          }
        });
      } else {
        //全选
        API.checkAllSellerBill(that.billingUsedParam).then(data => {
          if (data.success) {
            for (var i = 0; i < list.length; i++) {
              list[i].isSelected = true;
            }
            that.checkAll = true;
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
    //获取发票子组件的数据
    getInvoice(value) {
      var that = this;
      if (value) {
        if (value.invoice.headType == "1") {
          that.invoiceUnit = value;
        } else {
          that.invoicePersonel = value;
        }
      }
    },
    //删除导购单
    delate(val, mainOfJjhg) {
      //val 导购单Id  isMainOfJing 判断主品是否可以有换购品
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
      if (mainOfJjhg) {
        this.$confirm("删除该导购单后将可能需要重新选择换购商品", {
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
      } else {
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
      }
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
    },
    formatIdNumber(str) {
      if (str != null) {
        return formatIdNumber(str, 1, 1);
      }
    }
  }
};
</script>
<style>
.disabled-dialiog-container {
  position: absolute;
  width: 112px;
  height: 20px;
  top: 0;
  z-index: 10;
}
.disabled-overflow {
  z-index: 10;
  top: 3px;
  left: 0;
  width: 13px;
  height: 13px;
  position: absolute;
}
.mutex {
  color: #e6a23c;
}
</style>

<style scoped>
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
.tac {
  text-align: center;
}
.tal {
  text-align: left;
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
  border: 1px solid #ebeef5;
  padding: 15px;
  margin-left: 25px;
  margin-top: 3px;
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
  /* height:40px; */
  margin: 10px 115px 15px 0;
  overflow: hidden;
  word-break: break-all;
  word-wrap: break-word;
}
.product_name .all_price {
  display: inline-block;
  background: #ff9900;
  color: #fff;
  padding: 3px 5px;
  border-radius: 8px;
  font-size: 12px;
  border: none;
  margin-right: 5px;
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

.cuxiao {
  margin: 0 20px 10px 55px;
  max-width: 300px;
  display: block;
  float: left;
  white-space: nowrap; /* 不换行 */
  overflow: hidden; /* 内容超出宽度时隐藏超出部分的内容 */
  text-overflow: ellipsis; /* 当对象内文本溢出时显示省略标记(...) ；需与overflow:hidden;一起使用。*/
}
.remark {
  width: 400px;
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

/* 满折满减 */
.billingpurchase .el-icon-circle-plus {
  padding-left: 20px;
  font-size: 16px;
}
.products {
  width: 100px;
  height: 160px;
  margin-right: 15px;
  float: left;
}
.name {
  height: 28px;
  font-size: 12px;
  line-height: 14px;
  margin: 5px 0 5px 0;
  overflow: hidden;
}
.products .price {
  color: #f56c6c;
}
.products .el-carousel__arrow--left {
  left: 0;
}
.products .el-carousel__arrow--right {
  right: 0;
}
.el-carousel__item {
  background: #fff;
}

.manzhemanjian .el-dialog__body {
  padding: 30px 20px;
  color: #606266;
  font-size: 14px;
  height: 500px;
}
.hoverBorder:hover {
  border: 1px solid #ccc;
}
.hoverBorder {
  display: inline-block;
  border: 1px solid #fff;
  padding: 8px 5px;
  cursor: pointer;
  margin-left: 10px;
}
.mutex {
  color: #e6a23c;
}
.cursor {
  cursor: pointer;
}
.product_tip {
  font-size: 15px;
  color: #ff9900;
  margin: 10px;
}
.invoice-tip-message {
  display: block;
  text-align: center;
}
.subsidies-rate {
  color: #bfbbbb;
}
.apply-btn {
  float: right;
  margin-right: 20px;
  text-decoration: none;
}
.upload-list {
  padding: 12px;
}
/* 多选框hover提示 */
.billingpuerchase-wrapper {
  position: relative;
}
.picture-item {
  width: 250px;
  padding: 5px;
  text-align: center;
  margin-top: 15px;
}
.picture-item span {
  display: inline-block;
  font-size: 16px;
  color: #919599;
  margin-bottom: 10px;
}
.picture-item img {
  width: 100%;
}
.deposit-tip {
  display: inline-block;
  /* width: 210px; */
  vertical-align: middle;
  text-align: center;
}
.deposit-tip span {
  display: block;
}
.deposit-tip .tip {
  color: red;
}
.remark-box {
  margin-left: 70px;
  font-size: 14px;
}
.remark-box p {
  padding: 3px 0;
}
/* .example-wrapper .el-dialog--center .el-dialog__body {
  padding: 0 10px;
} */
</style>
<style lang="stylus">
.enery-dialog .el-dialog__body {
  padding-top: 0px;
}

.dialog-title {
  overflow: hidden;
  font-size: 10px;

  .energy-guide {
    float: right;
  }
}

.certification-item {
  margin: 10px;

  label {
    width: 95px;
    display: inline-block;
    text-align: right;
    vertical-align: middle;
  }
}

.item-opt {
  display: inline-block;
  margin-bottom: 10px;

  .audit-tip {
    margin-left: 75px;
  }
}

.item-opt .el-input {
  width: auto;
}

.certificate-tip {
  display: inline-block;
  margin-left: 20px;
  font-size: 14px;
}

.pic-container {
  display: inline-block;

  .uploadtype-tip {
    padding: 10px;
    border: 1px solid #ccc;
    border-bottom: 0;
    display: inline-block;
    border-radius: 3px;

    .tip-message {
      color: red;
      font-size: 14px;
    }

    .computer-pic {
      vertical-align: middle;
    }
  }

  .tips {
    display: inline-block;
    margin: 0 10px;
  }

  .upload-list {
    border: 1px solid #ccc;
    width: 815px;
    padding: 12px;
  }
}

.el-dialog__footer {
  text-align: center;
}

.example-wrapper {
  min-height: 660px;

  .el-dialog {
    display: flex;
    flex-direction: column;

    .el-dialog__body {
      padding: 0 10px;
      overflow: auto;
    }
  }

  .el-dialog--center {
    padding: 20px;
  }
}

.example-container {
  padding: 5px;
  overflow: hidden;
}

.upload-tips {
  display: block;
}

.valiedateTips {
  color: red;
  font-size: 12px;
}

.avatar-uploader .el-upload {
  float: left;
}

.enery-guide-dialog {
  el-dialog {
    height: 700px;
  }
}

.operator_item {
  margin: 0 10px;
}

.giftOperator-amount {
  display: inline-block;
  color: #ff9900;
}

.fulldeposit-dialog p {
  color: #606266;
  font-size: 16px;
  line-height: 2;
}

.fulldeposit-dialog p.tip {
  margin-top: 20px;
}
</style>



