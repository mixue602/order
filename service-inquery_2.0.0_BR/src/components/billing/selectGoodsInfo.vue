<template>
  <div class="select-goods-info-box">
    <div class="billing-way-tab">
      开单方式：
        <span class="self-select-box" 
          :class="{active: item.id == curBillingWay}" 
          v-for="item in way" 
          v-if="(item.id === 0 && isShowSpot) || (item.id === 1 && isShowPresell)"
          :key="item.id" 
          @click="bindBillingWay(item.id)">
          {{item.name}}<em class="select-icon"></em>
        </span>
    </div>
    <div class="presell-member-tip clearfloat" v-if="goodsData.presellInfo &&curBillingWay == 1">
      <div class="tip">预售活动规则：</div>
      <div class="presell-tip-content">
        <p v-if="goodsData.presellInfo.presellType === 0">订金：<em class="price">¥{{goodsData.presellInfo.deposit}}</em><span style="padding-left: 20px">订金可抵扣：¥{{goodsData.presellInfo.deductibleDeposit}}</span><span style="padding-left: 20px">尾款：¥{{goodsData.presellInfo.residue}}</span></p>
        <p>预售价：<em class="price">¥{{goodsData.presellInfo.presellPrice}}</em></p>
        <p v-if="goodsData.presellInfo.presellType == 1">该预售活动需要全款支付；预计开始发货时间：{{dealPresellPrice}}</p>
        <p v-else>尾款支付起止时间{{dealResidueStartDate}}-{{dealResidueEndDate}}；预计开始发货时间：{{dealPresellPrice}}</p>
        <p class="gray-tip">此活动，开单{{goodsData.presellInfo.lockStorageFlag === 0 ? '不' : '即'}}锁库存；此活动仅限国美会员，不予其他活动同时参加。</p>
      </div>
      <div class="presell-num" v-if="goodsData.presellInfo.lockStorageFlag == 1">可预售数 {{goodsData.presellInfo.totalLeft || 0}}</div>
    </div>
    
    <div class="select-goods-info-tab" style="min-height: 100px;">
      <template v-if="queryGoodsData && queryGoodsData.status == 'Y' && queryGoodsData.maslocs && queryGoodsData.maslocs.length>0">
        <el-table :data="queryGoodsData.maslocs" class="center">
          <el-table-column property="itemTypeName" label="机型">
            <template slot-scope="scope">
              <div>
                {{ scope.row.itemTypeName ||'' }}
                <span v-if="scope.row.qty>0 || scope.row.abQty>0">
                  （<span v-if="scope.row.qty">在库{{scope.row.qty}}</span>{{scope.row.qty>0 && scope.row.abQty>0 ? '，': ''}}<span v-if="scope.row.abQty">在途{{scope.row.abQty}}</span>）
                </span>
                <p class="gray-tip" v-if="Number(scope.row.commission)">提奖金额：¥{{scope.row.commission}}（参考）</p>
                <p class="gray-tip" v-else>无提奖</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column property="poolFlag" label="" width="60">
            <template slot-scope="scope">{{ scope.row.poolFlag == 'Y' ? '联营' : '非联营'}}</template>
          </el-table-column>
          <el-table-column property="logicMasLocDesc" label="仓库">
            <template slot-scope="scope">
              <div>
                {{ scope.row.logicMasLocDesc ||''}}（编号{{(scope.row.companyCode|| '') + (scope.row.logicMasLoc||'')}}）
                <p class="gray-tip" v-if="Number(scope.row.commission) && Number(scope.row.commissionLimit)">提奖限价：¥{{scope.row.commissionLimit}}</p>
              </div>
              
            </template>
          </el-table-column>
          <el-table-column property="supplierName" label="供应商" >
            <template slot-scope="scope">
              {{ scope.row.supplierName ||''}}（编号{{scope.row.supplier||''}}）
            </template>
          </el-table-column>

          <el-table-column property="price" label="价格"  width="90">
            <template slot-scope="scope">
              <span style="color: #e3010e;">{{Number(scope.row.price) ? ('¥' + scope.row.price) : '无定价'}}</span>
            </template>
          </el-table-column>

          <el-table-column property="price" label="带单提奖金额" >
            <template slot-scope="scope">
              <span>¥{{scope.row.intermediary && scope.row.intermediary.briBillBonus || 0}}</span>
            </template>
          </el-table-column>
          <el-table-column property="price" label="带单提奖金额时间">
            <template slot-scope="scope">
              <span>{{scope.row.intermediary && scope.row.intermediary.intermediaryStart ? (scope.row.intermediary.intermediaryStart + '-' + scope.row.intermediary.intermediaryEnd) : '-'}}</span>
            </template>
          </el-table-column>

          <el-table-column property="" label="" width="50">
            <template slot-scope="scope">
              <el-radio v-model="selctGoods" :label="scope.$index">{{''}}</el-radio>
            </template>
          </el-table-column>
          
        </el-table>
      </template>
      <template v-if="queryGoodsData && queryGoodsData.status == 'N'">
        <div class="none-goods"><img src="../../assets/images/default1.png" alt=""><p>无可卖数</p></div>
      </template>
    </div>
    <div class="dialog-foot">
      <el-button :disabled="isClick" type="primary" @click="bindConfirm()">确 定</el-button>
      <el-button @click="bindCancel()">取 消</el-button>
    </div>
  </div>
</template>

<script>
  import { mapActions, mapState, mapMutations } from 'vuex';
  import API from '@/api/billing/billing';
  import { Loading } from "element-ui";
  export default {
    props: {
      selecGoodsData: Object,
      goodsData: {
        type: Object,
        default: function () {
          return {}
        }
      }
    },
    components: {},
    mounted: function() {
      this.dealQueryGoodsInfo(this.billingInitData.sellerBillType);
    },
    data() {
      return {
        selctGoods: -1,//选择商品信息
        curBillingWay: -1,//开单方式
        queryGoodsData: null,//查询当前商品信息数据
        allQueryGoodsData: [],//查询所有商品信息数据
        way: [
          {
            name: '现货开单',
            id: 0
          },
          {
            name: '预售',
            id: 1
          }
        ]
      }
    },

    computed: {
      ...mapState([
        'billingInitData',
        'billingUsedParam',
        'fullDeposit'
      ]),
      //确定按钮是否可点击,判断条件如果是预售不锁库存是没有仓库信息的，按钮可点击，其它情况则需要选一个仓库才能进行点击
      isClick() {
        //判断预售是不是锁库存
        if(this.curBillingWay == 1 && this.goodsData.presellInfo &&  this.goodsData.presellInfo.lockStorageFlag === 0) {
          return false;
        }
        //是不是选了一个仓库
        var cur = Number(this.selctGoods);
        return this.selctGoods >=0 ? false : true;
      },
      //预计发货时间处理
      dealPresellPrice() {
        if(this.goodsData.presellInfo) {
          return this.dealDate(this.goodsData.presellInfo.shipmentsDate);
        }
        return '';
      },

      //尾款开始时间
      dealResidueStartDate() {
        if(this.goodsData.presellInfo) {
          return this.dealDate(this.goodsData.presellInfo.residueStartDate, 'h');
        }
        return '';
      },

      //尾款结束时间
      dealResidueEndDate() {
        if(this.goodsData.presellInfo) {
          return this.dealDate(this.goodsData.presellInfo.residueEndDate, 'h');
        }
        return '';
      },
      //是否展示现货开单，如果是仅预售不显示现货开单
      isShowSpot() {
        if(this.goodsData.presellInfo) {
          if(this.goodsData.presellInfo.onlyPresellFlag == 1) {
            return false;
          }
        }
        return true;
      },
      //是否展示预售，只需要判断是否有预售标签,如果没有预售标签就没有预售
      isShowPresell() {
        if(this.goodsData.presellFlag == 1) {
          return true;
        }
        return false;
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
      //处理查询商品信息，初始化的时候和切换开单方式的时候调用，切换开单方式的时候需要传cur
      dealQueryGoodsInfo(productType,cur) {
        
        this.selctGoods = -1;//选择的某一参库，每次切换开单方式和初始化的时候需要从数据中判断哪个被选择

        //当前选择的开单方式，现货和套装都是现货，加价换购开单0，预售是1，初始的时候根据导购单类型来判断，哪个选中，切换的时候需要传递参数
        this.curBillingWay = cur !== undefined ? cur : (productType == 1 ? 1 : 0);
        this.queryGoodsData = null;
        //预售定金不锁库存，不用展示库存列表和无可买数
        if(this.curBillingWay == 1 && this.goodsData.presellInfo &&  this.goodsData.presellFlag === 1 && this.goodsData.presellInfo.presellType ===  0 &&  this.goodsData.presellInfo.lockStorageFlag === 0) {

          return false;
        }

        var billingInitData = this.billingInitData,
            countyCode = '',
            townCode = '',
            storeCode = '',
            goodsAtpInfoList = [];
        this.allQueryGoodsData = [];
        if(billingInitData.address) {//非门店自提或者没有地址时不用传
          countyCode = 'DA' + billingInitData.address.countyCode;
          townCode = 'DA' + billingInitData.address.townCode;
        }
        if(billingInitData.seller) {//只需要门店编码
          storeCode = billingInitData.seller.storeCode;
        }
        if(productType == 2 && this.goodsData.sameMasloc == 1) {
          var skuInfoList = billingInitData.skuInfoList;
          for(var i = 0; i<skuInfoList.length; i++ ) {
            goodsAtpInfoList.push(this.jointMasLocInfo(skuInfoList[i], productType));
          }
        }else {
          goodsAtpInfoList.push(this.jointMasLocInfo(this.goodsData, productType));
        }
        
        var param = {
          shippingMethod: billingInitData.deliverWay,//配送方式
          productType: productType,
          countyCode: countyCode,//地址区域代码（三级）
          townCode: townCode,//地址区域代码（四级）
          storeCode: storeCode,//门店编码
          goodsAtpInfoList: goodsAtpInfoList,//商品列表
          isFullDeposit: (productType == 6 ? true: false)//是否是全额订金商品
        };
        let loadingInstance = Loading.service({
            text: '加载中',
            target: document.querySelector(".select-goods-info-tab")
        })
        API.queryGoodsAtpInfo(param).then((data) => {
          loadingInstance.close();
          if(data.success) {
            if(data.response) {
              var response = data.response;
              this.allQueryGoodsData =response;
              var commerceItemId = this.goodsData.commerceItemId;
              for(var i=0; i<response.length; i++) {
                if(response[i].commerceItemId == commerceItemId) {
                  if(response[i].maslocs && response[i].maslocs.length) {
                    this.queryGoodsData = response[i];
                    for(var j=0; j<response[i].maslocs.length; j++) {
                      if(data.response[i].maslocs[j].isSelected == 1) {
                        this.selctGoods = j;
                      }
                    }
                  }
                }
              }
            }
          }else {
            this.$message({
              showClose: true,
              message: data.respMsg + '（' + data.linkId + '）',
              type: 'warning'
            });
          }
          
          if(!this.queryGoodsData) {
            this.queryGoodsData = {
              status: 'N'
            }
          }
        })
      },

      jointMasLocInfo(goodsData,productType) {
        
        var masLoc = '',
            supplier = this.fullDeposit.supplier || '',
            lockStock = -1,
            itemType = '',
            logicMasLoc = '',
            poolFlag = '',
            qty = 0,
            isSelected = 0;
            isSelected =  goodsData.commerceItemId == this.goodsData.commerceItemId ? 1 : 0;
        if(goodsData.dragonInfo && goodsData.dragonInfo.masloc) {
          var dragonInfo = goodsData.dragonInfo;
          masLoc = dragonInfo.masloc.masloc;
          supplier = dragonInfo.masloc.supplier;
          itemType = dragonInfo.masloc.itemType;
          logicMasLoc = dragonInfo.masloc.logicMasLoc;
          poolFlag = dragonInfo.masloc.poolFlag;
        }
        if(productType == 1 && goodsData.presellInfo) {//预售是否锁库存
          lockStock = goodsData.presellInfo.lockStorageFlag;
        }

        qty = ( productType == 2 ? this.billingInitData.suitInfo.suitQuantity : goodsData.quantity);

        var paramList = {
          skuNo: goodsData.skuNo,//商品编码
          commerceItemId: goodsData.commerceItemId,//商品唯一标识
          itemFlag: goodsData.itemFlag,//商品属性
          sameMasloc: goodsData.sameMasloc || 0,//同仓标识
          sameSupplierCode: goodsData.sameSupplierCode || 0,//同供应商标识
          masLoc: masLoc,//物理仓编码
          supplier: supplier,//供应商编码
          itemType: itemType,//业务机型编码
          logicMasLoc: logicMasLoc,//逻辑仓编码
          poolFlag: poolFlag,//是否联营
          qty: qty,//数量
          lockStock: lockStock,//是否锁库存
          isSelected: isSelected//是否是当前商品
        }
        if(productType == 6) {
          paramList.price = goodsData.priceInfo && Number(goodsData.priceInfo.newPrice) ? goodsData.priceInfo.newPrice : this.fullDeposit.price;
        }
        return paramList;
      },

      bindBillingWay(id) {
        if(this.curBillingWay === id) {return false;}//控制不能连续点击，如果能连续点击，会出现问题，会导致productType变化
        var productType = this.billingInitData.sellerBillType;//0普通 2套装 1预售,4加价换购,5表示运营商开票
        this.curBillingWay = id;
        if(id == 1) {//为1时表示现在选的是预售参库，能切换的只有普通和预售，套装和加价换购进不来
          productType = 1;
        }else {
          productType = 0;
        }
        
        //因为套装不存在预售所以直接从billingInitData取就可以
        this.dealQueryGoodsInfo(productType, id);
      },

      //点击确定的时候1.如果切换了开单方式，需要先加入导购车，如果没有切换不需要加入导购车
      //2.如果是预售不锁库存不用调保存业务机型接口
      bindConfirm() {
        var billingInitData = this.billingInitData;
        var sellerBillType = billingInitData.sellerBillType;
        this.IS_OPERATE_BILLING_PAGE(true);
        //防止重复调用添加导购车接口
        if( (this.curBillingWay == 1 && sellerBillType == 1) || (this.curBillingWay === 0 && sellerBillType != 1)) {
          this.isSaveItemType(sellerBillType);
          return false;
        }
        sellerBillType = this.curBillingWay == 1 ? 1 : 0;//只有 预售和现货可以切换

        var param = JSON.parse(JSON.stringify(this.billingUsedParam));
        var address = billingInitData.address;
        var skuInfo = [];
        param.addToBillNormalPDTO = {
          operatorType: 'add',//操作类型
          deliverWay: billingInitData.deliverWay,//配送方式Id
          productType: sellerBillType,//商品类型
          skuInfo: [{skuNo: this.goodsData.skuNo}]//商品信息
        };

        //1套装2预售时 传入预售方案id和套装方案id（促销id）,因为套装和预售不能切换，所以此处只有预售的时候加一下
        if(sellerBillType == 1) {
          param.addToBillNormalPDTO.promotionId = this.goodsData.presellInfo.promotionId;//方案Id
        }

        if(address) {
          param.addToBillNormalPDTO.address = {//address
            receiveName: address.receiveName,
            receiveMobile: address.receiveMobile,
            addressId: address.addressId,
            townCode: address.townCode,
            detailAddress: address.detailAddress
          };
        }
        param.siteType = (sellerBillType == 1 ? 2 : 1);//修改站点
        //套装加入导购车接口
        API.addToBill(param).then((data) => {
          if(data.success) {
            this.SET_BILLING_USED_PARAM({
              attr: 'siteType',
              value: data.response.siteType || 1
            });
            this.isSaveItemType(sellerBillType);
          }else {
            this.$message({
              showClose: true,
              message: data.respMsg + '（' + data.linkId + '）',
              type: 'warning'
            });
          }
        })
      },
      bindCancel() {
        this.$emit('bind-cancel-goods-info');
      },
      //是否保存参库信息，预售不锁库存是不保存仓库信息
      isSaveItemType(sellerBillType) {
        if(sellerBillType == 1 && this.goodsData.presellInfo &&  this.goodsData.presellInfo.lockStorageFlag === 0) {
            this.$emit('bind-confirm-goods-info');
            this.initOrder(this);
            return false;
          }
          this.saveItemType();

      },
      //保存仓库信息
      saveItemType() {
        var cur = Number(this.selctGoods);
        var param = JSON.parse(JSON.stringify(this.billingUsedParam));
        var data = this.queryGoodsData.maslocs[cur];
        var masloc = this.dealMaslocPara(data);
        var maslocMark = data.masloc;
        param.goodsStorageInfo = [];
        if(this.billingInitData.sellerBillType == 2 && this.goodsData.sameMasloc == 1) {//如果是同仓需要传多个
          var skuInfoList = this.billingInitData.skuInfoList;
          for(var i = 0; i<skuInfoList.length; i++) {
            var commerceItemId = skuInfoList[i].commerceItemId;
            var obj = {};
            if(this.goodsData.commerceItemId == commerceItemId) {
              obj = JSON.parse(JSON.stringify(masloc));
            }else {
              obj = JSON.parse(JSON.stringify(this.dealSaveSameMasloc(commerceItemId,maslocMark)));
            }
            obj.commerceItemId = skuInfoList[i].commerceItemId;
            param.goodsStorageInfo.push(obj);
          }
        }else {
          masloc.commerceItemId = this.goodsData.commerceItemId;
          param.goodsStorageInfo.push(masloc);
        }

        API.saveItemType(param).then((data) => {
          this.$emit('bind-confirm-goods-info');
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
      //处理同仓仓库字段
      dealSaveSameMasloc(commerceItemId,maslocMark) {
        for(var i=0; i<this.allQueryGoodsData.length; i++) {
          if(commerceItemId == this.allQueryGoodsData[i].commerceItemId) {
            if(this.allQueryGoodsData[i].status == 'N') {
              return {};
            }
            var maslocs = this.allQueryGoodsData[i].maslocs;
            for(var j=0; j<maslocs.length; j++) {
              if(maslocMark == maslocs[j].masloc) {
                return this.dealMaslocPara(maslocs[j]);
                break;
              }
            }
          }
        }
        return {};
      },
      //处理仓库字段
      dealMaslocPara(data) {
        var masloc = {
          itemType: data.itemType,
          maslocType: data.maslocType,
          masloc: data.masloc || '',
          logicMasLoc: data.logicMasLoc,
          logicMasLocType: data.logicMasLocType,
          companyCode: data.companyCode,
          supplier: data.supplier,
          poolFlag: data.poolFlag
        };
        return masloc;
      },
      dealDate(val,hour) {
        var oDate = new Date(Number(val)),
            iYear = oDate.getFullYear(),
            iMonth = oDate.getMonth() + 1,
            iDate = oDate.getDate(),
            iHours = oDate.getHours(),
            iMin = oDate.getMinutes(),
            iSec = oDate.getSeconds(),
            date = `${iYear}年${iMonth}月${iDate}日`;
        if(hour == 'h') {
          return `${date}${iHours}:${iMin}:${iSec}`;
        }
        return date;
      }
    }
    
  };
</script>

<style>
.select-goods-info-box .el-table td, .select-goods-info-box .el-table th {
  vertical-align: top;
  text-align: center;
}
</style>

<style lang="stylus">
.select-goods-info-box {
  .el-table {
    border: 1px solid #ebeef5;
    border-bottom: 0;
  }

  .el-table__body-wrapper {
    max-height: 350px;
    overflow-y: auto;
  }
  
}
.goods-info-dialog {
  .el-dialog__body {
    padding-top: 10px;
  }
  .el-dialog {
    width: auto;
    min-width: 880px;
    max-width: 1100px;
  }
}
</style>


<style lang="stylus"  scoped>
  $b-c-g = #ccc;
  .billing-way-tab {
    margin-bottom: 10px;
    span {
      width: 100px;
    }
  }
  .gray-tip {
    color: #999;
  }
  .presell-member-tip {
    margin-bottom: 10px;
    position: relative;
    padding-right: 100px;
    line-height: 28px;
    .tip {
      float: left;
    }
    .presell-tip-content {
      float: left;
    }
    
    .presell-num {
      position: absolute;
      right: 0;
      bottom: 0;
    }
    .price {
      color: #e3010e;
      font-style: normal;
    }
  }
  .none-goods {
    border: 1px solid $b-c-g;
    padding: 20px 0;
    text-align: center;
    p {
      padding-top: 10px;
    }
  }
  .pagination {
    margin-top: 20px;
    height: 34px;
    text-align: right;
  }
  .dialog-foot {
    margin-top: 20px;
    text-align: center;
  }
</style>

