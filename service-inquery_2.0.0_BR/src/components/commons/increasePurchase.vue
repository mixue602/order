<template>
<div class="billingpurchase" >
    <el-row v-if="billingpurchase.manyPromoInfo && billingpurchase.manyPromoInfo.jjhgMaxNum>0 && billingpurchase.checkedPriceAdjust || (billingpurchase.manyPromoInfo && billingpurchase.manyPromoInfo.checkedPromotion)">
        <span>加价换购：</span>
        <span class="mutex">加价换购与多品促销、满折满减不可同享</span>   
    </el-row>
    <el-row v-else-if="billingpurchase.manyPromoInfo && billingpurchase.manyPromoInfo.jjhgMaxNum>0 && ( billingpurchase.checkedPriceAdjust && billingpurchase.checkedPriceAdjust.length<=0 || (billingpurchase.manyPromoInfo && billingpurchase.manyPromoInfo.unCheckedPromotion && billingpurchase.manyPromoInfo.unCheckedPromotion.jjhgPromotionGiftList.length>0))">
    <!-- 加价换购按钮 -->
    <el-row :span="24" >
        <span>加价换购：</span>
        <span class="cursor" @click="initList()" v-if="billingpurchase.jjhgSellerBillList && billingpurchase.jjhgSellerBillList.length>0 && billingpurchase.manyPromoInfo">已选{{billingpurchase.jjhgSellerBillList.length}}种，共{{billingpurchase.manyPromoInfo.jjhgMaxNum}}种换购品</span>
        <i class="el-icon-circle-plus cursor mr10" @click="initList()" v-if="!billingpurchase.checkedPriceAdjust && !billingpurchase.manyPromoInfo.checkedPromotion"></i>
        <span @click="initList()" v-if="billingpurchase.manyPromoInfo && billingpurchase.jjhgSellerBillList.length<= 0 && !billingpurchase.checkedPriceAdjust && !billingpurchase.manyPromoInfo.checkedPromotion">
            <span class="changedGoods cursor">可享受低价换购{{billingpurchase.manyPromoInfo.jjhgMaxNum}}种商品</span>
        </span> 
    </el-row>
    <!-- 加价换购完的商品信息 -->
    <el-row class="goodsContent" v-if="billingpurchase.jjhgSellerBillList && billingpurchase.jjhgSellerBillList.length>0">
        <el-row class="mt20 goodsItem"
             v-for="(list, index) in billingpurchase.jjhgSellerBillList" 
             :key="index" 
             :class="(index==(billingpurchase.jjhgSellerBillList.length-1))?'boderBottomeNone':''"
             >
                <!-- 换购商品信息 -->
                <el-row v-for="item in list.skuInfoList" :key="item.id" >
                    <el-col :span="6">
                        <el-row>{{list.deliverWayName}}</el-row>
                        <el-row class="address" v-if="list.address">
                            {{list.address.receiveName}}&nbsp;&nbsp;{{list.address.receiveMobile}}&nbsp;&nbsp;{{list.address.addressInfo}}
                        </el-row>
                    </el-col>
                    <el-col :span="16" :offset="2">
                        <el-row class="product_img"><img class="borderleftline" :src="item.skuImage" :onerror="onImg"></el-row>
                        <el-row class="product_info">
                            <div class="mt20">
                                <span>商品编码：{{item.skuNo}}</span>
                                <div class="product_price">
                                    <span style="margin-right:20px">x{{item.quantity}}</span>
                                    <div style="float:right;">
                                        <div class="font_f red" >¥{{item.newPrice}}</div>
                                        <div class="font_f oldPrice">¥{{item.basePrice}}</div>
                                    </div>
                                </div>
                            </div>
                            <div class="product_name"><el-tag>换购</el-tag>&nbsp;&nbsp;{{item.skuName}}</div>
                            <!-- 判断是否是不支持开发票的商品 根据secStoreCategory变量进行判断 -->
                            <div class="product_tip"  v-if="item.secStoreCategory">
                                <span>{{ item.secStoreCategoryName }}类商品不支持开具发票</span>
                            </div>
                            <div>失效时间：{{list.expirationDate | formatDate}}</div>
                            <div style="float:right">
                                <router-link 
                                    style="margin-right:20px" 
                                    :to="{ 
                                        path:'/service/billing/edit',
                                        query:{ 
                                            memberId: billingUsedParam.memberId,
                                            memberCard: billingUsedParam.memberCard,
                                            temporaryCardFlag: billingUsedParam.temporaryCardFlag,
                                            sellerBillId: list.sellerBillId,
                                            sellerCartId: billingpurchase.sellerCartId,
                                            siteType: 1
                                        }
                                    }" 
                                    v-if=" list.isCanEdit"
                                >
                                 <!-- v-if=" list.isCanEdit && LOGINDATA.service_billingpurchase_edit" -->
                                    <el-button  type="text" size="medium">编辑</el-button>
                                </router-link>
                                <el-button  
                                    type="text"  
                                    size="medium" 
                                    v-if="list.isCanDel"
                                    @click="delate(list.sellerBillId, true)"
                                >删除</el-button>
                                <!-- v-if="list.isCanDel && LOGINDATA.service_billingpurchase_delate" -->
                            </div>
                        </el-row>
                    </el-col>
                </el-row>
                <!-- sellerBillType等于0是普通导购单， 1 是预售导购单， 2 是套装导购单-->
                <div  v-for="item in list.skuInfoList" :key="item.id" >
                    <el-row v-if="item.incrementInfoList">
                        <el-col :span="24">
                        <div style="float:left" >&nbsp;&nbsp;&nbsp;延保：</div>
                        <div class="mb10"  v-if="item.incrementInfoList && item.incrementInfoList.length>0" v-for="(v,index) in item.incrementInfoList" :key="v.id">
                            <div :style="index>0?'margin-left:54px':''">{{v.displaySkuName}}{{v.years}}年&nbsp;&nbsp;&nbsp;￥{{v.incrementPrice}}&nbsp;&nbsp;&nbsp;X{{v.quantity}}</div>
                        </div>
                        </el-col>
                    </el-row>
                </div>
              <el-row class="mb10" v-if="list.managerCouponAmount || list.useCouponDesc">
                <el-col :span="24">
                  <div style="float:left" >&nbsp;&nbsp;&nbsp;用券：</div>
                  <div v-if="list.managerCouponAmount"><span class="font_f">-￥{{list.managerCouponAmount}} </span>* {{list.skuInfoList[0].quantity}}<span class="red">(店长券折减)</span></div>
                  <div v-if="list.useCouponDesc"><span class="font_f">-￥{{list.useCouponDesc}}</span></div>
                </el-col>
              </el-row>
              <el-row class="mb10" v-if="list.promoInfo">
                <el-col :span="24">
                  <div style="float:left" >&nbsp;&nbsp;&nbsp;促销：</div>
                  <div v-if="(list.promoInfo && list.promoInfo.gomedoDescription) || (list.promoInfo && list.promoInfo.couponDescription)" class="mb10">
                    <div>{{list.promoInfo.gomedoDescription}}&nbsp;&nbsp;&nbsp;{{list.promoInfo.couponDescription}}</div>
                  </div>
                  <div style="float:left" v-if="list.promoInfo && list.promoInfo.giftList && list.promoInfo.giftList.length>0">
                    <el-row v-for="gift in list.promoInfo.giftList" :key="gift.id">
                      <span class="font_f cuxiao" :style="(list.promoInfo.gomedoDescription || list.promoInfo.couponDescription)?'':'margin-left:0'">{{gift.skuName}}</span><span style="display:block;float:left">X{{gift.quantity}}</span>
                    </el-row>
                  </div>
                 </el-col>
              </el-row>
              <el-row class="mb10" v-if="list.buyPresentList">
                 <el-col :span="24">
                  <div style="float:left" >买即赠：</div>
                  <div v-if="(list.buyPresentList && list.buyPresentList.gomedoDescription) || (list.buyPresentList && list.buyPresentList.couponDescription)" class="mb10">
                    <div>{{list.buyPresentList.gomedoDescription}}&nbsp;&nbsp;&nbsp;{{list.buyPresentList.couponDescription}}</div>
                  </div>
                  <div style="float:left" class="mb10" v-if="list.buyPresentList && list.buyPresentList.giftList && list.buyPresentList.giftList.length>0">
                    <div v-for="gift in list.buyPresentList.giftList" :key="gift.id">
                      <span class="font_f cuxiao" :style="(list.buyPresentList.gomedoDescription || list.buyPresentList.couponDescription)?'':'margin-left:0'">{{gift.skuName}}</span><span style="display:block;float:left">X{{gift.quantity}}</span>
                    </div>
                  </div>
                 </el-col>
                </el-row>
                <el-row class="mb10" v-if="list.remark">
                    <el-col :span="24"><div :style="list.sellerBillType==1?'float:left;margin-left:43px':'float:left'">&nbsp;&nbsp;&nbsp;备注：</div><span class="font_f remark">{{list.remark.ticketCode}}{{list.remark.content}}</span></el-col>
                </el-row>
            </el-row>
    </el-row>
    <el-row>
        <el-dialog class="manzhemanjian"
              title="换购商品"
              :visible.sync="isShow"
              width="790px"
              align="left"
              top="20px"
              
              >
              <el-row class="giftWrapper" id="scrollDiv">
                <el-row class="giftItem" v-for="(list,index) in increasePurchase" :key="index" >
                    <el-row>
                        <el-col :span="24">
                            <el-row class="mainProductContent">
                                <el-row>
                                    <el-row class="exclusionWarning" v-if="!list.usable"><p>同一主品仅可参与一种换购方案（以下方案互斥）</p></el-row>
                                    <el-row>
                                        <p class="mainProduct_title">
                                            <a>购买下方商品可换购{{list.hgLimitNum}}种商品</a>
                                            <b>（已换购{{list.havedHgNum}}种）</b>
                                        </p>
                                    </el-row>
                                </el-row>
                                <el-row class="title" style="position:absolute;top:0;left:0;width:731px;z-index:5">
                                    <el-row class="exclusionWarning" v-if="!list.usable"><p>同一主品仅可参与一种换购方案（以下方案互斥）</p></el-row>
                                    <el-row>
                                        <p class="mainProduct_title">
                                            <a>购买下方商品可换购{{list.hgLimitNum}}种商品</a>
                                            <b>（已换购{{list.havedHgNum}}种）</b>
                                        </p>
                                    </el-row>
                                </el-row>
                                <!-- 主品列表 -->
                                <el-row class="mainProduct">
                                    
                                    <template>
                                        <el-carousel  
                                            height="60px" 
                                            :autoplay="false" 
                                            :initial-index="0" 
                                            indicator-position="none" 
                                            :arrow="list.mainSellerBillInfoVOList.length>1?'hover':'never'">
                                            <el-carousel-item 
                                                v-for="(lists,listsIndex) in list.mainSellerBillInfoVOList" 
                                                :key="listsIndex" 
                                                style="background:#fff" >
                                                <ul class="mainProduct_images">
                                                    <li  v-for="items in lists" :key="items.id"><img :src="items" :onerror="onImg"></li>
                                                </ul>
                                            </el-carousel-item>
                                        </el-carousel>
                                    </template>
                                </el-row>
                            </el-row>
                        </el-col>
                        <el-col :span="24">
                            <div v-for="(group,groupIndex) in list.promLineContentList" :key="groupIndex">
                                <el-row 
                                    class="giftContent" 
                                    v-for="(item,itemIndex) 
                                    in group.giftGoodsList" 
                                    :key="itemIndex">
                                    <el-col :span="3">
                                        <div class="giftImages">
                                            <img :src="item.giftImage" :onerror="onImg"/>
                                            <p v-if="item.budgetState!=4">已售罄</p>
                                        </div>
                                    </el-col>
                                    <el-col :span="21" :class="(groupIndex==(list.promLineContentList.length-1))?'':'addBorderBottom'">
                                        <el-row class="giftId"><p>商品编码：{{item.skuNo}}</p></el-row>
                                        <el-row class="giftName"><p>{{item.giftName}}</p></el-row>
                                        <el-row class="giftDetail">
                                            <span class="price">¥ {{item.singleGiftPrice}}</span>
                                            <span class="pricePrice" v-if="item.tagPrice">价签价： ¥{{item.tagPrice}}</span>
                                            <span class="num">限{{item.giftNum}}件</span>
                                                <el-button 
                                                    class="button" 
                                                    size="mini" 
                                                    :type="item.isSelected != 1? 'primary': ''"
                                                    :disabled="(item.budgetState!=4 || !list.usable || (item.isSelected!='0' && item.isSelected!='1'))? true : false " 
                                                    @click="repurchase(
                                                        item.isSelected, 
                                                        index, 
                                                        groupIndex, 
                                                        itemIndex, 
                                                        item.skuNo, 
                                                        item.giftNum, 
                                                        item.giftPrice, 
                                                        item.mainSellerBillIdSet, 
                                                        item.sellerBillId, 
                                                        group.groupNo, 
                                                        list.promotionId, 
                                                        list.hgLimitNum, 
                                                        list.havedHgNum
                                                    )"
                                                >
                                                    <span v-if="item.isSelected != 1">换购</span> 
                                                    <span v-if="item.isSelected == 1">取消换购</span> 
                                                </el-button>
                                        </el-row>
                                    </el-col>
                                </el-row>
                            </div>
                        </el-col>
                    </el-row>
                </el-row>
              </el-row>
        </el-dialog>
      </el-row>
    </el-row>
</div>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex';
import API from '@/api/billingPurchase/billingPurchase';
import { formatDate } from "@/common/time";
export default {
    data(){
        return {
            onImg: 'this.src="' + require('../../assets/images/noImg.png') + '"',
            isShow: false,
            increasePurchase: []
        }
    },
    computed:{
        ...mapState([
            'billingpurchase', //大接口数据
            'billingUsedParam' //会员信息
        ]),
    },
    watch:{
        billingpurchase:{
            handler:function(){
                this.showJihgList();
            },
            deep: true
        }
    },
   methods: {
        ...mapActions([
          'billingpurchaseInit'
      ]),
    initList (type) {
        if(this.billingpurchase.checkedPriceAdjust || (this.billingpurchase.manyPromoInfo && this.billingpurchase.manyPromoInfo.checkedPromotion)){
            this.isShow = false;
        }else{
            this.isShow = true;
        }
        this.billingpurchaseInit(this);
        this.showJihgList () 
    },
    //换购接口
    showJihgList () {
        var that = this;
        if(that.billingpurchase.manyPromoInfo && that.billingpurchase.manyPromoInfo.unCheckedPromotion){
            var validPromotionList = that.billingpurchase.manyPromoInfo.unCheckedPromotion.jjhgPromotionGiftList;
        }
        
        let params = {
            memberId: that.billingUsedParam.memberId,  //会员ID
            memberCard: that.billingUsedParam.memberCard, //会员卡号
            temporaryCardFlag: that.billingUsedParam.temporaryCardFlag, //是否是临时卡
            sellerNum: that.billingUsedParam.sellerNum,  //会员编号
            storeCode: that.billingUsedParam.storeCode,  //门店编号
            validPromotionList: validPromotionList || null, //赠品信息列表
            promotionType: "JJHG_Promotion", //0单品赠，1多品赠 JJHG_Promotion加价换购
            siteType: that.billingUsedParam.siteType //站点类型 1普通 2预售
        }

        API.queryShowGift(params).then((data) => {
            if (data.response) {
                var queryShowGift = data.response;
                this.checkJjhgPromotion (queryShowGift)
            }else {
                this.$message({
                    message: data.respMsg,
                    type: 'warning'
                });
            }
        })
        
    },
    //加价互斥接口
    checkJjhgPromotion (queryShowGift){
        //去除无用数据传参  把showgift接口数据 改成以下结果传给接入层
        // {
        //     "jjhgPromotionList":[
        //         {
        //             "promotionId":"11",  方案的promotionId
        //             "selected":true,     当方案内一旦有换购过商品的  就传true，否则false
        //             "skuNoList":[        主品的skuNoList
        //                 "23423"
        //             ]
        //         },
        //            {
        //             "promotionId":"11",
        //             "selected":true,
        //             "skuNoList":[
        //                 "23423"
        //             ]
        //         }
        //     ]
        // }
        var that= this;
        var jjhgPromotionList=[];
        if(queryShowGift){
            var len = queryShowGift.length;
        
            for(var i=0;i<len; i++){
                var obj = {};
                jjhgPromotionList.push(obj);
                jjhgPromotionList[i].promotionId = queryShowGift[i].promotionId;
                jjhgPromotionList[i].selected = false;

                var skuNoList = [];
                for(var b=0; b< queryShowGift[i].mainSellerBillInfoVOList.length;b++){
                    var mainSellerBillInfoVOList= queryShowGift[i].mainSellerBillInfoVOList;
                        skuNoList.push(mainSellerBillInfoVOList[b].skuNo);

                }
                jjhgPromotionList[i].skuNoList = skuNoList;

                for(var j=0; j<queryShowGift[i].promLineContentList.length;j++){
                    for(var k=0; k<queryShowGift[i].promLineContentList[j].giftGoodsList.length;k++){
                        var giftGoodsList = queryShowGift[i].promLineContentList[j].giftGoodsList;
                        if(giftGoodsList[k].isSelected == '1'){
                            jjhgPromotionList[i].selected = true;
                        }
                    }
                }
                
            }
            //请求方案互斥接口
            API.checkJjhgPromotion({jjhgPromotionList:jjhgPromotionList}).then((data) => {
                if (data.response) {
                    var jjhgPromotionList = data.response.jjhgPromotionList;
                    var jjhgPromotionList2 = [];
                    for (var n = 0;n<jjhgPromotionList.length; n++){
                        jjhgPromotionList2.push(Object.assign(jjhgPromotionList[n],queryShowGift[n]))
                    }
                    that.increasePurchase = jjhgPromotionList2;
                    //主品列表分组 10个为一组
                    that.increasePurchase.forEach((list, index) => {
                        var pages = [];
                        list.mainSellerBillInfoVOList.forEach((item, index) => {
                            var page = Math.floor(index / 12)
                            if (!pages[page]) {
                             pages[page] = []
                            }
                            if(item.mainItemImageUrl){
                                pages[page].push(item.mainItemImageUrl)
                            }else{
                                pages[page].push(that.onImg)
                            }
                        })
                        list.mainSellerBillInfoVOList = pages
                        //console.log( list.mainSellerBillInfoVOList)
                    })
                    
                    this.onScroll();
                }else {
                    this.$message({
                        message: data.respMsg,
                        type: 'warning'
                    });
                }
            })
        }
    },
    
    //点击换购按钮跳转开单页
    repurchase (isSelected, index, groupIndex, itemIndex,  skuNo, quantity, price, mainSellerBillIdSet, sellerBillId, groupNo, promotionId, hgLimitNum, havedHgNum) {
        let that = this;
        if(isSelected != 1){
            // 方案内判断 一换购数量是否大于最大换购数量
            if(havedHgNum>= hgLimitNum){
                this.$message({
                    message: '无法换购，当前换购方案最大可换购'+hgLimitNum+'种',
                    type: 'warning'
                });
            }else{
                // 判断是否是临时卡 地址否存在 临时卡需要传地址 会员不传地址
                if (that.billingpurchase.sellerBillList[0].address && that.billingUsedParam.temporaryCardFlag=='1'){
                    var address = {
                        receiveName: that.billingpurchase.sellerBillList[0].address.receiveName,
                        receiveMobile: that.billingpurchase.sellerBillList[0].address.receiveMobileShow || '',
                        addressId: that.billingpurchase.sellerBillList[0].address.addressId,
                        townCode: that.billingpurchase.sellerBillList[0].address.townCode,
                        detailAddress: that.billingpurchase.sellerBillList[0].address.detailAddress
                    }
                }
                let data = {
                    memberId: that.billingUsedParam.memberId,  //会员ID
                    memberCard: that.billingUsedParam.memberCard, //会员卡号
                    temporaryCardFlag: that.billingUsedParam.temporaryCardFlag, //是否是临时卡
                    skuInfo:[
                        {
                            skuNo: skuNo,
                            quantity: quantity,
                            priceInfo: {
                                price: price
                            }
                        }
                    ],
                    address: address ? address : null,  
                    jjhgGiftPDTO: {
                        mainSellerBillIdSet: mainSellerBillIdSet,
                        groupNo: groupNo,
                        promotionId: promotionId
                    }
                }
                //由于参数太多，所以通过localStorage传参
                localStorage.setItem('redemptionParam',encodeURIComponent(JSON.stringify(data)))
                this.$router.push({ path:"/service/billing/redemption"}) //跳转到开单页
            }
        }else{
            
            this.$confirm('取消换购后将会同步删除该换购商品的导购单', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                customClass: 'deal-billing-message-box',
                type: 'warning'
            }).then(() => {
                
                //点击取消换购按钮，按钮状态改变成换购按钮
                that.increasePurchase[index].promLineContentList[groupIndex].giftGoodsList[itemIndex].isSelected = 0,
                that.delate(sellerBillId,false);
                
            }).catch(() => {
                this.$message({
                type: 'info',
                message: '已取消'
                });
            });
        }
    },
    //删除导购单
    delate(sellerBillId,flag) { //val 导购单Id  flag 判断主品是否可以有换购品
      var that=this;
      var data={
          memberId:that.billingUsedParam.memberId,  //会员卡ID
          memberCard:that.billingUsedParam.memberCard, //会员卡号
          temporaryCardFlag:that.billingUsedParam.temporaryCardFlag, //是否是临时卡
          sellerNum:that.billingUsedParam.sellerNum,   //导购员编号
          storeCode:that.billingUsedParam.storeCode,   //门店编码
          sellerBillId:sellerBillId,  //导购单ID
          sellerCartId:that.billingpurchase.sellerCartId,   //导购车ID
          siteType:that.billingUsedParam.siteType,     //站点类型
        }


        if(flag){
            this.$confirm('商品删除后无法恢复', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                customClass: 'deal-billing-message-box',
                type: 'warning'
            }).then(() => {
                API.deleteSellerBill(data).then((data) => {
                    if (data.success) {
                    this.$message({
                        type: 'success',
                        message: '删除成功'
                    });
                    this.billingpurchaseInit(this);
                    // this.init();
                    }else {
                    this.$message({
                        message: data.respMsg,
                        type: 'error'
                    });
                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        }else{
            API.deleteSellerBill(data).then((data) => {
                if (data.success) {
                this.$message({
                    type: 'success',
                    message: '删除成功'
                });
                //调用互斥接口
                this.billingpurchaseInit(this);
                this.checkJjhgPromotion (that.queryShowGift)
                }else {
                this.$message({
                    message: data.respMsg,
                    type: 'error'
                });
                }
            })
        }
        
       
    },
    // //标题置顶
    onScroll () {
        var scrollDiv =  document.getElementById('scrollDiv');   
            if(scrollDiv){
                var items = document.getElementsByClassName('giftItem');
                var objOffsetTop = scrollDiv.offsetTop;
                var objClientTop = scrollDiv.clientTop;
                scrollDiv.onscroll = function () {
                    var objScrollTop = scrollDiv.scrollTop;
                    for(var i=0; i<items.length; i++){
                        var titles = items[i].getElementsByClassName("title")[0];
                        var titlesHeight = titles.clientHeight;
                        var itemOffsetTop = items[i].offsetTop;
                        var itemClientHeight = items[i].clientHeight;
                        //console.log(objOffsetTop,itemOffsetTop,titlesHeight,objScrollTop)
                        if(objScrollTop > itemOffsetTop && objScrollTop <= (itemOffsetTop + itemClientHeight - titlesHeight)){
                            titles.style.top = (objScrollTop-itemOffsetTop-1)+'px'
                        }else{
                            titles.style.top = 0;
                        }
                    }
                }
            }
    },
    close(){
        this.billingpurchaseInit(this);
    }
},
filters: {
      //时间格式转换
      formatDate(time) {
          if(time!=null){
              let date = new Date(time);
              return formatDate(date, "yyyy-MM-dd hh:mm:ss");
          }

      },
      formatDate2(time) {
          if(time!=null){
              let date = new Date(time);
              return formatDate(date, "yyyy-MM-dd");
          }

      }
  }
}
</script>
<style scoped>
.mt{
  margin-top: 20px
}
.mr{
  margin-right: 20px;
}
.mt20{
  margin-top: 20px;
}
.mr10{
   margin-right: 10px;
}
.mt15{
    margin-top: 15px;
}
.mb10{
  margin-bottom: 10px;
}
.font_f{
  font-family:'微软雅黑';
}
.red{
  color: #F56C6C
}
.fl{
  float: left;
}
.cursor {
    cursor: pointer;
}
.giftWrapper{
    height: 500px;
    overflow-y: auto;
}
/* 加价换购 */
.goodsContent {
    padding: 10px;
    margin: 10px 70px;
    border: 1px solid #DCDFE6;
}
.goodsItem {
    border-bottom: 1px solid #DCDFE6;
    
}

.goodsContent .goodsItem .address {
    margin:5px 0 10px 0 
}

.boderBottomeNone {
    border-bottom: none
}

/* 弹层样式 */
.giftItem {
    border: 1px solid #DCDFE6;
    margin-bottom: 15px;
    position: relative;
}
.exclusionWarning {
    background: #E6A23C;
    color: #fff;
    padding-left: 10px;
}
.mainProduct{
    background: #FFF2ED
}
.mainProduct_title {
    padding: 10px 0 10px 10px;
    background: #FFF2ED;
}
.increasePurchase .mainProduct {
    border-bottom: 1px solid #E4E7ED;
    height: 81px;
    margin-bottom: 10px;
}
.mainProduct_images {
    padding-left: 28px;
    background: #FFF2ED;
    height: 60px;
}
.mainProduct_images li {
    float: left;
    width: 50px;
    height: 50px;
    overflow: hidden;
    margin-right: 7px;
}

.mainProduct_images img{
    display: inline-block;
    width: 50px;
    height: 50px;
}

.giftContent {
    height: 100px;
    /* margin-top: 10px; */
    padding-right: 10px;
    /* border-top: 1px solid #E4E7ED; */
    /* border-bottom: 1px solid #E4E7ED; */
}

.addBorderBottom {
    border-bottom: 1px solid #E4E7ED;
    padding-bottom: 10px;
}
.giftImages{
    width: 75px;
    height: 75px;
    margin: 10px 0 0 6px;
    position: relative;
}

.giftImages img{
    display: inline-block;
    width: 75px;
    height: 75px;
}
.giftImages p {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 75px;
    height: 24px;
    line-height: 24px;
    background-color:rgba(51,51,51,0.8);
    text-align: center;
    color: #fff;
    z-index: 1;
}
.giftId {
    color: #606266;
    font-size: 12px;
    margin-top: 9px;
}
.giftName {
    color: #303133;
    font-size: 13px;
    line-height: 16px;
    margin-top: 4px;
    height: 32px;
    overflow: hidden;
}

.giftDetail {
    margin-top:6px;

}

.giftDetail .price {
    font-size: 16px;
    color: #F56C6C;
    margin-right: 20px;
}

.giftDetail .pricePrice {
    text-decoration: line-through;
    margin-right: 50px;
}

.giftDetail .num {
    color: #333;
}

.giftDetail .button{
    float: right;
    padding: 4px 0;
    width: 60px;
}
.oldPrice{
    text-decoration: line-through;
    color: #909399
}
.title {
    top: 0px;
    left: 0px;
    width: 731px;
    position: relative;
    z-index: 5;
}

.mt{
  margin-top: 20px
}
.mr{
  margin-right: 20px;
}
.mt20{
  margin-top: 20px;
}
.mr10{
   margin-right: 10px;
}
.mt15{
    margin-top: 15px;
}
.mb10{
  margin-bottom: 10px;
}
.font_f{
  font-family:'微软雅黑';
}
.red{
  color: #F56C6C
}
.fl{
  float: left;
}
.line{
  background: #409EFF;
  width: 100%;
  height: 2px;
  margin-top: 10px;
}
.line2{
  background: #DCDFE6;
  width: 100%;
  height: 1px;
  margin: 10px 0 20px 0 ;
}
.border{
  border: 1px solid #DCDFE6;
  padding:40px 20px 20px 20px;
}
.border2{
  border:1px solid #EBEEF5;
  padding: 15px;
  margin-left: 25px;
  margin-top: 3px;
}
.borderleftline{
  padding-top: 20px;
  display: inline-block;
  width: 100px;
  height: 100px;
}
.product_img{
  float: left;
  border-left: 1px solid #E4E7ED;
  width: 140px;
  height: 140px;
  padding: 0 30px;
}
.product_price{
  position: absolute;
  top:20px;
  right: 10px;
}
.product_info{
  position: relative;
  top:0;
  right: 0;
}
.product_name{
  height:40px;
  margin:10px 115px 15px 0;
  overflow: hidden;
  word-break: break-all;
  word-wrap:break-word;
}
[class*=" el-icon-"], [class^=el-icon-]{
  font-size: 18px;
  vertical-align: middle;
}
.gift_img{
  float: left;
}
.gift_name{
  float: left;
  width: 580px;
}
.gift_box{
  max-height: 500px;
  overflow-y: auto;
}
.disabledBackground{
  background: #EBEEF5;
  cursor: not-allowed;  

}
.disabledBackground .el-checkbox__input{
  cursor: not-allowed;
}

.cuxiao{
   margin:0 20px 10px 55px;
   max-width:300px;
   display: block;
   float: left;
   white-space:nowrap;          /* 不换行 */
   overflow:hidden;               /* 内容超出宽度时隐藏超出部分的内容 */
   text-overflow:ellipsis;         /* 当对象内文本溢出时显示省略标记(...) ；需与overflow:hidden;一起使用。*/

}
.remark{
   width:400px;
   display: block;
   float: left;
   white-space:nowrap;          /* 不换行 */
   overflow:hidden;               /* 内容超出宽度时隐藏超出部分的内容 */
   text-overflow:ellipsis;         /* 当对象内文本溢出时显示省略标记(...) ；需与overflow:hidden;一起使用。*/
}
/* 覆盖头部样式 */
.el-header{
  padding: 0;
}

/* 满折满减 */
.billingpurchase .el-icon-circle-plus{
  padding-left:20px;
  font-size: 16px
}
.products{
  width: 100px;
  height: 160px;
  margin-right: 15px;
  float: left;
}
.name{
  height: 28px;
  font-size: 12px;
  line-height: 14px;
  margin: 5px 0 5px 0;
  overflow: hidden;
}
.products .price{
 color: #F56C6C
}
.products .el-carousel__arrow--left{
  left: 0;
}
.products .el-carousel__arrow--right{
  right: 0;
}
.el-carousel__item{
  background: #fff;
}

.manzhemanjian .el-dialog__body {
    padding: 30px 20px;
    color: #606266;
    font-size: 14px;
    height: 500px;
}
.hoverBorder:hover{
  border:1px solid #ccc
}
.hoverBorder{
  display: inline-block;
  border:1px solid #fff;
  padding: 8px;
  cursor: pointer;
  margin-left: 19px;
}
.billingpurchase  .mutex {
  color: #e6a23c
}
.product_tip {
  font-size: 15px;
  color: #ff9900;
  margin: 10px;
}
.set-gray {
    color: #ccc;
}
</style>