<template>
  <div class="goods-info">
    <div class="img-box">
      <img 
      :src="goodsData.skuImage||''" 
      :onerror="onImg" 
      :title="GoodsDetailsTitle"  
      :class="{cursor: isShowGoodsDetails}"
      @click="isShowGoodsDetails && bindShowGoodsDetails({skuId: goodsData.skuId,state: goodsData.state,productId: goodsData.productId})"
      >
      <div class="labels" v-if="goodsData.presellFlag ==1 || goodsData.suitFalg == 1">
          <span v-if="goodsData.presellFlag ==1">预售</span>
          <span v-if="goodsData.suitFalg ==1">套装</span>
      </div>
    </div>
    <div class="goods-des-box">
      <p 
        v-if="goodsData.skuNo" 
      >
        <span
          :title="GoodsDetailsTitle"  
          :class="{cursor: isShowGoodsDetails}"
          @click="isShowGoodsDetails && bindShowGoodsDetails({skuId: goodsData.skuId,state: goodsData.state,productId: goodsData.productId})"
        >商品编码：{{goodsData.skuNo}}</span>
      </p>
      <p class="gray" style="font-size: 12px"  v-if="isFullDeposit">转销售日期：{{goodsData.priceDate | dealTimestamp}}</p>
      <p 
        class="title"  
        
      >
        <em class="tag" v-if="isFullDeposit">全额订金</em>
        <span
          :title="GoodsDetailsTitle"  
          :class="{cursor: isShowGoodsDetails}"
          @click="isShowGoodsDetails && bindShowGoodsDetails({skuId: goodsData.skuId,state: goodsData.state,productId: goodsData.productId})"
        >{{goodsData.skuName}}</span>
        <em  :title="diJiangTip" v-if="protocolId" class="tj" :class="{'none-tj': !Number(goodsData.commission)}">TJ</em>
      </p>

      <!-- 只有运营商商品才有 -->
      <template v-if="protocolId && goodsData.netOperatorInfo">
        <p>财务事物类型：{{goodsData.netOperatorInfo.financeTypeName}}</p>
        <p>供应商：{{goodsData.netOperatorInfo.operatorCode}} {{goodsData.netOperatorInfo.operatorName}}</p>
      </template>

      <p class="gray" v-if="billingInitData.sellerBillType == 2">
        {{goodsData.priceInfo && Number(goodsData.priceInfo.price) ? '¥'+ goodsData.priceInfo.newPrice : '无定价'}}
        <span style="padding-left: 20px;" v-if="goodsData.quantity">X{{goodsData.quantity}}</span>
      </p>

      <!-- 仓库信息 -->
      <div class="goods-desc" v-if="goodsData.dragonInfo || goodsData.presellInfo">
        <!-- 如果套装有一个无货则不能选择参库，无点击事件 -->
        <p class="masloc" @click="suitIsSelectMaslocMark && bindGoodsInfoDialog()" v-if="goodsData.dragonInfo && showMaslocsDesc && showMaslocsDesc.type !=0">
          <i>商品信息：</i>
          <span v-if="showMaslocsDesc.type !=1" class="red">{{showMaslocsDesc.value}}
            <em v-if="suitIsSelectMaslocMark">></em>
          </span>

          <span v-else>
            <em class="tj" :class="{'none-tj': !Number(goodsData.commission)}">TJ</em> {{showMaslocsDesc.value}}<em v-if="suitIsSelectMaslocMark">></em></span>
        </p>

        <template v-if="billingInitData.sellerBillType == 1 && goodsData.presellInfo && goodsData.presellInfo.lockStorageFlag == 1">
          <p class="presell" :class="{'red': goodsData.presellInfo.totalLeft <=0 }" v-if="showMaslocsDesc && showMaslocsDesc.type ==1">可预售数{{goodsData.presellInfo.totalLeft}}</p>
        </template>

        <p v-if="billingInitData.sellerBillType == 1 && goodsData.presellInfo && goodsData.presellInfo.lockStorageFlag === 0"  @click="bindGoodsInfoDialog">商品信息：<span :class="{'red': goodsData.presellInfo.totalLeft <=0 }">可预售数 {{goodsData.presellInfo.totalLeft}} <em>></em></span></p>
        
      </div>
      <p class="allowanceInfo" v-if="goodsData.allowanceInfo">节能补贴：<i>补贴比例是{{ goodsData.allowanceInfo.energyStandard * 100 | twoDecimal}}%，{{allowanceInfoTip}}</i></p>
      
      <!-- 
        1.isShowNumPrice：套装只有第一个品展示，其余的不展示，会员选择页只有全额订金展示，其它的暂不展示
        2.如果没有priceInfo字段未null则不显示价格和数量 。
        3.如果 Number(goodsData.priceInfo.price) <=0 则展示无定价 数量不能被修改
        -->
      <template v-if="isShowNumPrice">
        <div class="edit-price-num">
          <!-- 价格 -->
          <!-- 单品开单 -->
          <template v-if="billingInitData.sellerBillType === 0 || billingInitData.sellerBillType == 5  || billingInitData.sellerBillType == 6">
            <template v-if="goodsData.priceInfo">
              <div class="price edit-price" v-if="Number(goodsData.priceInfo.price) > 0">
                <span class="price-symbol"> ¥</span>
                <el-input 
                  v-model="goodsData.priceInfo.newPrice" 
                  size="small" 
                  :disabled="billingEdit"
                  @keyup.native="bindDealPrice(goodsData.priceInfo,$event)"
                  @blur="bindBlurDealPrice(goodsData.priceInfo)"
                  >
                </el-input>
                <el-tooltip 
                  popper-class="billing-tip"
                  placement="top"
                  effect="light"
                  v-model="priceTip" :hide-after="10" :manual="true"
                >
                  <div slot="content">{{priceWordTip}}</div>
                  <div class="to-tip"></div>
                </el-tooltip>
              </div>

              <div class="price none-price" v-else>
                <el-input 
                  size="small" 
                  disabled
                  value="无定价"
                  >
                </el-input>
              </div>
            </template>
          </template>
          <!-- 套装和预售不改价 -->
          <template v-else>
            <div v-if="billingInitData.sellerBillType == 2 && billingInitData.suitInfo"  class="price showPrice">
              <template v-if="Number(billingInitData.suitInfo.suitPrice)">¥{{billingInitData.suitInfo.suitPrice}} </template>
              <template v-else><span>无定价</span> </template>
            </div>
            <div v-if="(billingInitData.sellerBillType == 1 || billingInitData.sellerBillType == 4) && goodsData.priceInfo" class="price showPrice">
              <template v-if="Number(goodsData.priceInfo.price)">¥{{goodsData.priceInfo.price}} </template>
              <template v-else><span>无定价</span> </template>
            </div>
            <div v-if="billingInitData.sellerBillType == 4 && goodsData.priceInfo && goodsData.priceInfo.basePrice " class="redemption">¥<span>{{goodsData.priceInfo.basePrice}}</span></div>
          </template>

          <div v-if="isFullDeposit && (Number(goodsData.priceTagPrice))" class="tag-price-box"><span>价签价：¥{{goodsData.priceTagPrice | twoDecimal}}</span></div>

          <div class="num-box" v-if="billingInitData.sellerBillType != 5">
            <div class="self-input-number-box">
              <el-button 
                size="mini" class="minus"
                :disabled="billingInitData.maxBugQuantity<=0 || billingQuantity <=1 || billingEdit || billingInitData.sellerBillType == 4"
                @click="bindChangeGoodsNum(-1)"
              >-</el-button>
              <el-input 
                type="tel" 
                size="mini"
                v-model="billingQuantity"  
                @keyup.native="bindDealGoodsNum($event)"
                @blur="bindBlurGoodsNum()"
                :disabled="billingInitData.maxBugQuantity<=0 || billingEdit  || billingInitData.sellerBillType == 4"
              ></el-input>
              <el-button 
                size="mini" class="plus"
                :disabled="billingInitData.maxBugQuantity<=0  || billingQuantity == billingInitData.maxBugQuantity || billingEdit  || billingInitData.sellerBillType == 4"
                @click="bindChangeGoodsNum(1)"
              >+</el-button>
            </div>
            <span class="measure">件</span>
            <el-tooltip 
              popper-class="billing-tip"
              placement="top"
              effect="light"
              v-model="isShowNumTip" :hide-after="10" :manual="true"
            >
              <div slot="content">{{numTip}}</div>
              <div class="to-tip"></div>
            </el-tooltip>
          </div>

        </div>
      </template> 

      <template v-else>
        <div class="edit-price-num">
          <div v-if="isFullDeposit" class="not-modify-price-box price showPrice"><span>¥{{goodsData.activityPrice || 0.00}}</span></div>
          <div v-if="isFullDeposit && (Number(goodsData.priceTagPrice))" class="tag-price-box"><span>价签价：¥{{goodsData.priceTagPrice}}</span></div>
        </div>
      </template>

      <!-- 套装选择 -->
      <div class="suits-box" v-if="goodsData.unCheckedSuit && goodsData.unCheckedSuit.length>0" v-clickoutside="bindSuitsBoxClose">
        <span class="tip">套装选择：</span>
        <div class="suits clearfloat">
          <span :class="{active: index === suitIndex}" v-for="(item,index) of filterSuits" :key="item.id" @click.prevent="bindSelectedSuit(index, $event)">{{item.suitName}}</span>
          </div>
        <span class="more" v-if="goodsData.unCheckedSuit && goodsData.unCheckedSuit.length > 2" @click="bindMore()">{{this.limitSuitNum == 2 ? '展开' : '收起'}}</span>

        <!-- 轮播图 -->
        <div class="select-suits-box" :style="selectSuitsBoxPos" v-if="dealSuitListData.length>0">
            <i class="suit-close el-icon-close" @click="bindSuitsBoxClose"></i>
            <el-carousel class="carousel-box" arrow="hover" indicator-position="none" :autoplay="false">
              <el-carousel-item style="background: #f2f2f2;" v-for="suitData in dealSuitListData" :key="suitData.id">
                <div class="suit-list" v-for="suit in suitData" :key="suit.id">
                  <i class="icon-plus el-icon-plus"></i>
                  <img class="img-suit-thumb" :src="suit.skuImage||''" :onerror="onImg">
                  <p class="txt-suit">{{suit.skuName}}</p>
                </div>
              </el-carousel-item>
            </el-carousel>

            <div class="suits-toolbar">                                
              <span class="suits-price">套装价：<em>¥{{suitPrice}}</em></span>                                
              <span class="btn-suits-buy" @click="bindBuySuit">购买套装</span>                            
            </div>
        </div>
      </div>
    </div>

    <!-- 选择商品信息弹窗 -->
    <el-dialog 
      v-if="goodsInfoDialog"
      :visible.sync="goodsInfoDialog" 
      title="商品信息"
      :append-to-body="true"
      class="billing-dialog goods-info-dialog"
      >
      <SelectGoodsInfo 
        @bind-confirm-goods-info="bindConfirmGoodsInfo"
        @bind-cancel-goods-info="bindCancelGoodsInfo"
        :presellInfo="goodsData.presellInfo"
        :goodsData="goodsData"
      ></SelectGoodsInfo>
    </el-dialog>

    
  </div>
</template>

<script>
  import { mapActions, mapState, mapMutations } from 'vuex';
  import API from '@/api/billing/billing';
  import ENV from '@/api/env';
  import SelectGoodsInfo from '@/components/billing/selectGoodsInfo';
  import "@/common/tofixed";
 
  export default {
    props: {
      pGoodsData: {
        type: Object,
        default: function () {
          return {}
        }
      },
      isShowNumPrice: {//套装只有第一个品展示，其余的不展示，会员选择页也是不展示价格和数量
        type: Boolean,
        default: true
      },
      isAllowance: {//是否是节能补贴
        type: Boolean,
        default: false
      },
      isShowGoodsDetails: {//是否展示商品详情
        type: Boolean,
        default: true
      },
      protocolId: {//运营商商品
        type: String,
        default: ''
      },
      isFullDeposit: {//是否是全额定金
        type: Boolean,
        default: false
      }
    },
    components: {
      SelectGoodsInfo,
    },
    created: function() {
      this.init();
    },
    data() {
      return {
        suitIndex: -1,//套装选择的当前索引值
        limitSuitNum: 2, //限定展示套装的数量
        goodsInfoDialog: false,//选择商品信息弹窗显示隐藏变量
        priceTip: false,//价格错误提示
        priceWordTip: '',//价格错误提示语
        isShowNumTip: false,//数量提示
        numTip: '',//数量提示
        billingQuantity: 0,//开单数量
        oldQuantity: 0,//保留上次修改的数量
        goodsData: JSON.parse(JSON.stringify(this.pGoodsData)),
        
        selectSuitsBoxPos: {//套装数据定位
          top: '-10000px',
          display: 'none'
        },
        suitsData: [],//套装数据
        suitPrice: '0',//套装价格
        onImg: 'this.src="' + require('../../assets/images/noImg.png') + '"',
        modifyNumOne: true,//商品支持节能补贴时，修改开单数量大于1时，只需要提示一次
      }
    },
    computed:{
      ...mapState([
        'billingInitData',
        'billingUsedParam',
        'billingEdit'
      ]),
      //****展示更多和收起来的思路
      filterSuits:function () {  // 过滤器 过滤数组
          if(!this.goodsData.unCheckedSuit ) {return []};

          return this.goodsData.unCheckedSuit.slice(0,this.limitSuitNum);// 使页面默认只显示 3条数据
      },
      dealSuitListData: function() {
        var arr = [],
            data = this.suitsData,
            len = data.length,
            limit = 3,
            n = 0,
            max = Math.ceil(len/limit);


        for(var i = 0; i<max; i++) {
          arr.push(data.slice(limit*n, limit*(n+1)));
          n++;
        }
        return arr;
      },
      //仓库信息描述
      showMaslocsDesc() {
        if(!this.goodsData || !this.goodsData.dragonInfo) {
          return {
            type: this.isFullDeposit ? 4 : 0,//0表示不展示仓库信息,4表示全额订金相关的仓库异常提示
            value: this.isFullDeposit ? '所选供应商当前无销售策略':''
          };
        }
        if(this.goodsData.dragonInfo.status == 'N') {//表示无货
          return {
            type: 2,
            value: '无可卖数'
          };
        }
        if(this.goodsData.dragonInfo.manySupply == '1') {//表示是多仓库，初始化进来时没有默认仓库
          return {
            type: 3,
            value: '请选择机型、仓库、供应商'
          };
        }

        if(!this.goodsData.dragonInfo.masloc) {
          return {
            type: this.isFullDeposit ? 4 : 0,//0表示不展示仓库信息,4表示全额订金相关的仓库异常提示
            value: this.isFullDeposit ? '所选供应商当前无销售策略':''
          };
        }

        var masloc = this.goodsData.dragonInfo.masloc;
        if(this.isFullDeposit && masloc.qty<=0 &&  masloc.abQty>0) {//4表示全额订金相关的仓库异常提示
          return {
            type: 4,
            value: '仅有在途库存全额订金不可卖'
          };
        }

        
        
        var num = '';
        var pool = '';
        if(masloc.qty>0 || masloc.abQty>0) {
          num  += '(' + (masloc.qty ? ('在库 ' + masloc.qty) : '')+ (masloc.qty>0 && masloc.abQty>0 ? '，': '') + (masloc.abQty ? ('在途 ' + masloc.abQty) : '') + ')';
        }
        pool = masloc.poolFlag == 'Y' ? ' 联营' : ' 非联营';
        return {
          type: 1,//仓库信息完整
          value: `${masloc.itemTypeName}${num}${pool}/${masloc.logicMasLocDesc}/${masloc.supplierName}`
        }
        
      },
      // 如果套装中有一个无货则都不能选择仓库
      suitIsSelectMaslocMark() {
        if(this.billingInitData.sellerBillType == 2) {
          for(var i= 0; i<this.billingInitData.skuInfoList.length; i++) {
            var item = this.billingInitData.skuInfoList[i];
            if(!item.dragonInfo || item.dragonInfo.status == 'N' || !item.dragonInfo.masloc) {
              return false;
            }
          }
        }
        return true;
      },
      allowanceInfoTip() {
        if(this.goodsData.allowanceInfo) {
            if(this.goodsData.allowanceInfo.energySubsidiesType == 1 || (this.goodsData.allowanceInfo.energySubsidiesType == 2 && this.goodsData.allowanceInfo.canBuy && this.goodsData.allowanceInfo.userType == 'Normal')) {
              return '最高立减¥' + (this.goodsData.allowanceInfo.energyMoney || 0);
            }else {
              return this.allowanceInfoTip = (this.goodsData.allowanceInfo.energySubsidiesType == 2 && this.goodsData.allowanceInfo.userType == 'Temporary' ? '临时卡不支持':'资格已用');
            }
          }
          return '';

      },
      GoodsDetailsTitle() {//商品详情鼠标移入时title提示
        
        if(this.isShowGoodsDetails) {
          return '查看商品详情';
        }
        return '';
      },
      //提奖提示
      diJiangTip() {
        let limitPrice = this.pGoodsData.commissionLimit ? "提奖限价：¥" + this.pGoodsData.commissionLimit : ""
          let reward = "提奖金额（参考）：¥" + (this.pGoodsData.commission ? this.pGoodsData.commission : '0.00')
        
        return limitPrice + "  " + reward
      }
    },
    methods: {
      ...mapMutations([
        'SET_BILLING_USED_PARAM',
        'IS_OPERATE_BILLING_PAGE'
      ]),
      ...mapActions([
        'initOrder', 
      ]),

      //绑定加或减数量事件
      bindChangeGoodsNum(type) {
        this.billingQuantity += type;
        this.dealNumLimit();
      },

      //绑定商品数量事件
      bindDealGoodsNum(ev) {
        if(ev.keyCode == 13) {//回车事件
          this.bindBlurGoodsNum();
          return false;
        }
        var re = /[^\d]/g;
        var str = this.billingQuantity + '';
        
        if(re.test(str)) {
          str = str.replace(re,'');
        }
        this.billingQuantity = Number(str) || '';
      },

      //绑定商品数量失去焦点事情
      bindBlurGoodsNum() {
        var isNum = !isNaN( Number(this.billingQuantity) )
        if(!isNum) {
          this.billingQuantity = this.oldQuantity;
          return false;
        }
        this.dealNumLimit();
      },

      dealNumLimit() {
        var maxBugQuantity = this.billingInitData.maxBugQuantity || 0,
            quantity = this.billingQuantity;

          if(quantity == this.oldQuantity) {
            return  false;
          }
          if(quantity> maxBugQuantity) {
            this.billingQuantity = this.oldQuantity;

            this.isShowNumTip = true;
            
            this.numTip = '最多只能购买'+ maxBugQuantity +'件';
            setTimeout(()=> {
              this.isShowNumTip = false;
            },3000)
            this.updateQuantity();
            return false;
          }

          if(quantity == 0) {
            this.billingQuantity = this.oldQuantity;
          }
          
          if(this.isAllowance && this.modifyNumOne && this.billingQuantity > 1) {
            this.modifyNumOne = false;
            this.$confirm('商品数量不为1将无法申请节能补贴，是否继续修改？ 确认则可修改数量，取消则回到当前页面。', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
              customClass: 'deal-billing-message-box',
            }).then(() => {
              this.updateQuantity();
            }).catch(() => {
              this.billingQuantity = this.oldQuantity;
            });
            return false;
          }

          this.updateQuantity();
      },

      updateQuantity() {
        var param = JSON.parse(JSON.stringify(this.billingUsedParam));
        param.quantity = Number(this.billingQuantity);
        const loading = this.$loading({
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0)'
        });
        API.updateQuantity(param).then((data) => {
          this.IS_OPERATE_BILLING_PAGE(true);
          loading.close();
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

      //处理修改价格事件
      bindDealPrice(priceInfo, ev) {
        
        if(ev.keyCode == 13) {//回车事件
          this.bindBlurDealPrice(priceInfo);
          return false;
        }
        priceInfo.newPrice += '';
        var re = /[^\d\.]/g;
        //限制不能输入数字和.以外的字符
        if(re.test(priceInfo.newPrice)) {
          priceInfo.newPrice = priceInfo.newPrice.replace(re,'');
        }
        //此处控制的是如果没有小数点，首位不能为类似于 01、02的金额 
        if(priceInfo.newPrice.indexOf(".")< 0 && priceInfo.newPrice !=""){
            priceInfo.newPrice = parseFloat(priceInfo.newPrice) + ''; 
        } 

        //首位不能输入小数点
        if(priceInfo.newPrice.indexOf(".") == 0){ 
            priceInfo.newPrice = priceInfo.newPrice.replace(/^\./,''); 
        } 

         //限制只能输入一个小数点  
        if(priceInfo.newPrice.indexOf(".") != -1){  
            var subPrice = priceInfo.newPrice.substr(priceInfo.newPrice.indexOf(".")+1);  
            priceInfo.newPrice = priceInfo.newPrice.substr(0,priceInfo.newPrice.indexOf(".") + 1) + subPrice.replace(/\./g,'');
        } 
      },
      bindBlurDealPrice(priceInfo) {
        priceInfo.newPrice += '';
        priceInfo.price += '';
        var originalPrice = priceInfo.price,
            oldPrice = priceInfo.oldPrice || 0;
        
        var isNum = !isNaN( Number(priceInfo.newPrice) )
        if(!isNum) {
          priceInfo.newPrice = oldPrice;
          return false;
        }
        if(Number(priceInfo.newPrice) == Number(oldPrice)) {
          return false;
        }
        this.IS_OPERATE_BILLING_PAGE(true);
        if(Number(priceInfo.newPrice) < Number(originalPrice)) {
          priceInfo.newPrice = oldPrice;

          this.priceTip = true;
          this.priceWordTip = '不能低于限价￥'+ originalPrice;
          setTimeout(()=> {
            this.priceTip = false;
          },3000)
          return false;
        }

        if(Number(priceInfo.newPrice) > 1000000) {
          priceInfo.newPrice = oldPrice;

          this.priceTip = true;
          this.priceWordTip = '不能高于1000000';
          setTimeout(()=> {
            this.priceTip = false;
          },3000)
          return false;
        }
        priceInfo.newPrice =  Number(priceInfo.newPrice).toFixed(2) + '';
        var param = JSON.parse(JSON.stringify(this.billingUsedParam));
        param.newPrice = priceInfo.newPrice;
        const loading = this.$loading({
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0)'
        });
        API.updatePrice(param).then((data) => {
          
          loading.close();
          if(data.success) {
            this.initOrder(this);
          }else {
            
            this.initOrder(this);
            this.$message({
              showClose: true,
              message: data.respMsg + '（' + data.linkId + '）',
              type: 'warning'
            });
          }
        })
      },

      //选择套装事件event
      bindSelectedSuit(index,ev) {
        if(this.billingEdit) {
          return false;
        }
        this.suitIndex = index;
        this.selectSuitsBoxPos.top = (ev.target.offsetTop + 24) + 'px'; 
        this.selectSuitsBoxPos.display = 'block';

        this.suitsData = this.goodsData.unCheckedSuit[index].suitInfos;
        this.suitPrice = this.goodsData.unCheckedSuit[index].suitPrice;
      },

      //购买套装事件
      bindBuySuit() {
        var billingInitData = this.billingInitData;
        var param = JSON.parse(JSON.stringify(this.billingUsedParam));
        var address = billingInitData.address;
        var skuInfo = [];
        param.addToBillNormalPDTO = {
          operatorType: 'add',
          deliverWay: billingInitData.deliverWay,//初始化的时候配送方式，默认是国美配送，其它添加导购单从大load中获取
          productType: 2,//套装是2
          promotionId: this.goodsData.unCheckedSuit[this.suitIndex].promotionId//有就传，初始化的时候不用传
        };

        for(var i=0; i<this.suitsData.length; i++) {
          skuInfo.push({skuNo: this.suitsData[i].skuNo});
        }
        param.addToBillNormalPDTO.skuInfo = skuInfo;

        //初始化如果有从会员卡信息中取的，没有不用传，其它从大load中获取
        if(address) {
          param.addToBillNormalPDTO.address = {
            receiveName: address.receiveName,
            receiveMobile: address.receiveMobile,
            addressId: address.addressId,
            townCode: address.townCode,
            detailAddress: address.detailAddress
          };
        }
        param.siteType = 1;//修改站点
        const loading = this.$loading({
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0)'
        });
        //套装加入导购车接口
        API.addToBill(param).then((data) => {
          this.bindSuitsBoxClose();
          loading.close();
          if(data.success) {
            this.SET_BILLING_USED_PARAM({
              attr: 'siteType',
              value: data.response.siteType || 1
            });
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

      //展示更多事件
      bindMore() {
        if(this.billingEdit) {
          return false;
        }
        this.limitSuitNum = (this.limitSuitNum == 2 ? this.goodsData.unCheckedSuit.length : 2);
        this.bindSuitsBoxClose();
      },
      bindSuitsBoxClose() {
        this.selectSuitsBoxPos.display = 'none';
        this.suitIndex = -1;
      },
      bindGoodsInfoDialog() {
        if(this.billingEdit) {
          return false;
        }
        this.goodsInfoDialog = true;
      },
      bindConfirmGoodsInfo(data) {
        this.goodsInfoDialog = false;
      },
      bindCancelGoodsInfo() {
        this.goodsInfoDialog = false;
      },
      bindShowGoodsDetails(data) {
        if(data.productId && data.skuId && data.state != 1) {
          let url = "//item." + ENV.domain + '/' + data.skuId + '.html';
          window.open(url);
        }else {
          this.$message({
            message: '该商品还没有图文详情，可联系商品业务部门反馈',
            type: 'warning'
          });
        }
      },
      init() {
        this.suitIndex = -1;
        this.limitSuitNum = 2;
        
        if(this.billingInitData.suitInfo) {
          this.billingQuantity = this.billingInitData.suitInfo.suitQuantity || 0;
        }else {
          this.billingQuantity = this.goodsData.quantity || 0;
        }
        if(this.goodsData.priceInfo) {
          this.$set(this.goodsData.priceInfo,'oldPrice',this.goodsData.priceInfo.newPrice);
        }
        this.oldQuantity = this.billingQuantity || 0;
      },

      
    },
    watch: {
      pGoodsData: {
        handler: function () {
          this.goodsData = JSON.parse(JSON.stringify(this.pGoodsData));
          this.init();
        },
        deep: true
      },


    },
    directives:{
      clickoutside:{
        // 点击空白下拉列表消失事件
        bind(el, binding, vnode) {
          function documentHandler(e) {
            // 这里判断点击的元素是否是本身，是本身，则返回
            if (el.contains(e.target)) {
                return false;
            }
            // 判断指令中是否绑定了函数
            if (binding.expression) {
                // 如果绑定了函数 则调用那个函数，此处binding.value就是handleClose方法
                binding.value(e);
            }
          }
          // 给当前元素绑定个私有变量，方便在unbind中可以解除事件监听
          el.__vueClickOutside__ = documentHandler;
          document.addEventListener('click', documentHandler);
        },
        update() {},
        unbind(el, binding) {
          // 解除事件监听
          document.removeEventListener('click', el.__vueClickOutside__);
          delete el.__vueClickOutside__;
        }
      },
      onfocus:{
        inserted:function(el){
          el.focus()
        }
      }
    },
    filters: {
      //两位小数
      twoDecimal(value) {
        return value ? Number(value).toFixed(2) : 0.00;
      },
      //将时间戳处理成对应的日期展示
      dealTimestamp(value) {
        if(!value) {return '';}
        let oDate = new Date(Number(value)),
            oY = oDate.getFullYear(),
            oM = toTwo(oDate.getMonth() + 1),
            oD = toTwo(oDate.getDate());

            function toTwo ( n ) {
              return n < 10 ?  '0' + n : '' + n;
            }
        
        return oY + '-' + oM + '-' + oD;
        
      }
    }
     
  };
</script>

<style lang="stylus">
.self-input-number-box {
  width: 75%;
  position: relative;
  height: 28px;
 
  .el-button {
    position: absolute;
    top: 1px;
    z-index: 1;
    height: 26px;
    line-height: 28px;
    padding: 0px;
    font-size: 16px;
    width: 20px;
    text-align: center;
    
    line-height: 28px;
    box-sizing: border-box;
    border-top: 0;
    border-bottom: 0;

    
  }
  .el-button:active {
    border-color: #dcdfe6;
  }
  .el-button.minus {
    border-left: 0;
    left: 1px;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    
  }
  .el-button.plus {
    border-right: 0;
    right: 1px;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
  .el-input {
    box-sizing: border-box;
    height: 28px;
    width: 100%;
  }
  .el-input__inner {
    text-align: center;
    padding: 0 20px;
    font-size: 13px;
  }
}
.billing-container {

  .edit-price-num {
    .price .el-input__inner {
      text-align: center;
      padding: 0 5px;
      padding-left: 18px;
    } 
    .none-price .el-input__inner {
      padding: 0 5px;
    }
    .none-price .el-input.is-disabled .el-input__inner {
      color: #f00;
    }

    
  }

  .edit-price {
    .el-input__inner {
      color: #f00;
    }
  }

  .select-suits-box {
    .el-carousel__container {
      height: 150px;
    }
  }
  .goods-info {
    .el-dialog--center .el-dialog__body {
      padding-top: 0;
    } 
  }
  .deal-member-box .goods-info-box {
    .goods-des-box {
      .title {
        width: 100%;
        
      }
    }
  }
  
}
  
</style>


<style lang="stylus"  scoped>
  $b-c-g = #ccc;
  $a-c = #409EFF;
  em {
    font-style: normal;
  }
  .gray {
    color: #909399;;
  }
  .cursor {
    cursor: pointer;
  }
  .tj {
    font-style: normal;
    position: relative;
    display: inline-block;
    border: 1px solid #f00;
    color: #f00;
    border-radius: 3px;
    vertical-align: middle;
    line-height: 20px;
    padding: 0 3px;
    vertical-align: center;
  }
  .tj.none-tj {
    border-color: #999;
    color: #999;
  }
  .tj.none-tj::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    width:100%;
    height: 1px;
    background: #999;
  }
  .tag {
    color: #fff;
    padding:  2px 3px 4px;
    font-size: 12px;
    display: inline-block;
    line-height: 12px;
    border-radius: 3px;
    background: rgba(255, 102, 0, 1);
    margin-right: 5px;
  }
  .goods-info {
    position: relative;
    .img-box {
      position: absolute;
      left: 0; 
      top: 0;
      font-size: 0;
      z-index: 1;
      img {
        width: 100px;
        height: 100px;
      }
    }
    .goods-des-box {
      position: relative;
      padding-left: 120px;
      line-height: 22px;
      min-height: 130px;
      .title {
        width: 70%;
        white-space: nowrap;
        overflow: hidden;
        vertical-align: middle;
        text-overflow: ellipsis;
      }
      
      .goods-desc {
        position: relative;
        padding-top: 10px;
        box-sizing: border-box;
        .red {
          color: red;
        }
        i {
          font-style: normal;
          position: absolute;
          left: 0;
          top: 10px;

        }
        .masloc {
          position: relative;
          padding-left: 70px;
          span {
          }
          i {
            position: absolute;
            left: 0;
            top: 0;
            font-style: normal;
          }
          
        }
        p {
          display: inline-block;
          cursor: pointer;
        }
        .presell {
          display: block;
        }
        em {
          font-style: normal;
        }
      }

      .allowanceInfo {
        i {
          color: #999;
          font-style: normal;
        }
      }
    }

    .edit-price-num {
      position: absolute;
      top: -8px;
      right: 0;
      z-index: 2;
      width: 200px;
      .self-input-number-box {
        float: left;
      }
      .measure {
        padding-left: 5px;
        line-height: 28px;
        float: left;
        color: #909399;
      }
      .tag-price-box {
        width: 100%;
        position: absolute
        top: 30px;
        left: 0;
        color: #909399;
        text-align: right;
        font-size: 12px;

      }
      .num-box {
        float: right;
        width: 100px;
        position: relative;
        top: 1px;
      }
      .price {
        color: #f00;
        float: right;
        width: 90px;
        margin-left: 10px;
        position: relative;
        line-height: 28px;
      }
      .redemption {
        position: absolute;
        width: 100%;
        top: 24px;
        right: 0;
        line-height: 28px;
        color: #909399;
        text-align: right;
        font-size: 13px;
      }
      .redemption span {
        text-decoration:line-through;
      }
      
      .price-symbol {
        position: absolute;
        left: 10px; 
        top: 1px;
        line-height: 28px;
        z-index: 10;
        color: #f00;
        font-size: 13px;
      }
      .showPrice {
        width: auto;
        font-size: 13px;
        
      }
      .to-tip {
        width: 100%;
        position: absolute;
        left: 0; 
        top: 8px;
      }
      
    }

    
    .labels {
      width: 120px;
      margin-top: 10px;
      span {
        display: inline-block;
        border: 1px solid $b-c-g;
        font-size: 12px;
        line-height: 18px;
        padding: 0 6px;
        margin-right: 6px;

      }
    }
    .presell {
      padding-left: 70px;
    }
    .suits-box {
      margin-top: 10px;
      position: relative;
      min-width: 335px;
      max-width: 380px;
    }
    .tip {
      position: absolute;
      left: 0;
      top: 0;
    }
    .suits {
      padding-left: 70px;
      padding-right: 25px;
      position: relative;
      box-sizing: border-box;
      
      span {
        float: left;
        line-height: 20px;
        font-size: 12px;
        padding: 0 5px;
        border: 1px solid $b-c-g;
        margin-right: 10px;
        margin-bottom: 10px;
        cursor: pointer;
        max-width: 260px;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
        &.active {
          color: #409EFF;
          border-color: #409EFF;
        }
      }
      
    }
    .more {
      position: absolute;
      top: 0;
      right: 0;
      line-height: 20px;
      font-size: 12px;
      cursor: pointer;
      color: $a-c;
    }
    .select-suits-box {
      width: 550px;
      height: 242px;
      position: absolute;
      left: -195px;
      top: 0;
      border: 1px solid $b-c-g;
      background: #f2f2f2;
      display: none;
      overflow-x: auto;
      z-index: 10;
    }
    .suit-close {
      position: absolute;
      right: 10px;
      top: 10px;
      font-size: 24px;
      cursor: pointer;
    }
    .carousel-box {
      margin-top: 30px;
    }
    .suit-list {
      float: left;
      width: 149px;
      height: 142px;
      padding-left: 22px;
      position: relative;
      &:first-of-type .icon-plus {
        display: none;
      }

      .icon-plus {
        position: absolute;
        left: -1px;
        width: 22px;
        height: 142px;
        line-height: 142px;
        font-size: 24px;
      }
      .img-suit-thumb {
        width: 100px;
        height: 100px;
        text-align: center;
        display: block;
        margin-left: 24px;
        margin-bottom: 6px;
      }
      .txt-suit {
        width: 130px;
        height: 35px;
        overflow: hidden;
        word-wrap: break-word;
        word-break: break-all;
        white-space: normal;
        padding: 0 4px;
        margin: 0 4px;
        font-size: 12px;
        line-height: 18px;
        color: #555;
      }
    }

    .suits-toolbar {
      border-top: 1px solid $b-c-g;
      padding-top: 10px;
      margin: 10px 30px 0;
      overflow: hidden;
    }
    .suits-price {
      float: left;
      font: 12px/32px 'Microsoft YaHei';
      color: #555;
      em {
        font: 20px/32px Arial normal;
        color: #e3010e;
      }
    }
    .btn-suits-buy {
      float: right;
      width: 90px;
      text-align: center;
      font-size: 14px;
      line-height: 32px;
      color: #fff;
      background-color: #409EFF;
      cursor: pointer;
    }
  }
</style>

