import * as types from './mutation-types';
import API from '@/api/billing/billing';
import billingPurchaseApi from '@/api/billingPurchase/billingPurchase';
import {
  Loading
} from "element-ui";


export const setLogin = function ({
  commit
}, LOGINDATA) {
  commit(types.SET_LOGINDATA, LOGINDATA)
}

//开单所以信息接口
export const initOrder = function ({
  commit,
  state
}, $this) {
  var params = JSON.parse(JSON.stringify(state.billingUsedParam));
  var loadingInstance, loading;
  if (!state.billingInitNum) {
    loadingInstance = Loading.service({
      text: '加载中',
      target: document.querySelector(".billing-container")
    })
  } else {
    loading = $this.$loading({
      text: 'Loading',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0)'
    });
  }
  //开单所有信息接口
  API.loadSellOrder(params).then((data) => {
    loadingInstance && loadingInstance.close();
    loading && loading.close();
    if (data.success) {
      commit(types.BILLING_INIT_NUM, 1);
      if (data.response != null) {
        commit(types.SET_BILLING_INIT_DATA, data.response);
        commit(types.SET_POOLFLAG, data.response.poolFlag);
        if (data.response.removeIncrementFalg) {
          $this.$confirm('商品金额发生变动，请重新选择延保', '提示', {
            confirmButtonText: '好的',
            type: 'warning',
            showCancelButton: false,
          }).then(() => {}).catch(() => {});
        }
      } else {
        commit(types.SET_BILLING_INIT_DATA, {});
        commit(types.SET_POOLFLAG, -1);
      }
    } else {
      commit(types.BILLING_INIT_NUM, 1);
      $this.$message({
        showClose: true,
        message: data.respMsg + '（' + data.linkId + '）',
        type: 'warning'
      });
      commit(types.SET_BILLING_INIT_DATA, {});
      commit(types.SET_POOLFLAG, -1);
    }
  })
};
//导购单所有信息接口
export const billingpurchaseInit = function ({
  commit,
  state
}, $this) {
  var params = JSON.parse(JSON.stringify(state.billingUsedParam));
  //var params={"sellerNum":"00069496","storeCode":"A00W","memberId":"100044460133","memberCard":"0015444080534","temporaryCardFlag":0,"siteType":2}
  //开单所有信息接口
  billingPurchaseApi.querySellerCart(params).then((data) => {
    if (data.success) {
      let result = true
      if (data.response && data.response.sellerBillList && data.response.sellerBillList.length > 0) {

        data.response.sellerBillList.forEach((element) => {
          if ((element.allowanceDTO && !(element.allowanceDTO.sae)) || element.isFullDeposit) {
            result = false
            return false
          }
        })
      }

      if( data.response && data.response.isScreenIncrement) {
        result = false;
      }

      // 排序延保顺序
      if (data.response && data.response.sellerBillList && data.response.sellerBillList.length > 0 && data.response.sellerBillList[0].buyIncrement && data.response.sellerBillList[0].buyIncrement.incrementInfoList && data.response.sellerBillList[0].buyIncrement.incrementInfoList.length > 0) {
        let arrComp = data.response.sellerBillList[0].buyIncrement.incrementInfoList
        data.response.sellerBillList[0].buyIncrement.incrementInfoList.sort((a, b) => {
          return a['sortIndex'] - b['sortIndex']
        })
      }
      // 计算账户内订金金额 扫码订金金额  款台订金金额
      let depositObjData = {
        depositTypeData: '', //// 01 代表选择的扫码 02代表选择的款台 
        preAmount: 0, // 前置金额
        deductibleAmount: 0, // 抵扣金额
        depositTypeVal: 0, // 1代表未使用 2 代表 已使用-有翻倍 3 代表 已使用-无翻倍
        sweepCodeDposit: 0, // 扫码订金金额
        checkoutDeposit: 0, // 款台订金金额
      }
      if (data.response && data.response.deposits && data.response.deposits) {
        let depositsData = data.response.deposits
        if (depositsData && depositsData.length > 0) {
          depositsData.forEach((item, index) => {
            let data = Math.floor(item.amount * 100) / 100
            if (item.depositType == '01') {
              depositObjData.sweepCodeDposit += data
            } else if (item.depositType == '02') {
              depositObjData.checkoutDeposit += data
            }
            if (item.amountDirectlyUsed > 0) {
              depositObjData.depositTypeVal = 2
              depositObjData.depositTypeData = depositsData[index].depositType
              depositObjData.preAmount = item.amountDirectlyUsed
              return false
            }
            if (item.promotions && item.promotions.length > 0) {
              item.promotions.forEach((list) => {
                if (list.ruleDetails && list.ruleDetails.length > 0) {
                  list.ruleDetails.forEach((element) => {
                    if (element.selected) {
                      let preVal = Math.floor(element.preDeposit * 100) / 100
                      let preDepositDiscount = Math.floor(element.preDepositDiscount * 100) / 100
                      depositObjData.preAmount += preVal
                      depositObjData.deductibleAmount += preDepositDiscount
                      depositObjData.depositTypeData = depositsData[index].depositType
                      depositObjData.depositTypeVal = 1
                    }
                  })
                }
              })
            }
          })
        }
      }
      commit(types.SET_DEPOSIT_DATA, depositObjData) // 款台订金
      commit(types.SET_SELECT_DATA, result)
      commit(types.SET_INVOICE_DATA, data.response && !data.response.supportInvoice)
      commit(types.SET_BILLINGPURCHASE_INIT_DATA, data.response);
      // 订金与促销出现冲突时提示信息
      if (data.response && data.response.addedInfo) {
        for (var key in data.response.addedInfo) {
          $this.$message({
            showClose: true,
            message: data.response.addedInfo[key],
            type: 'warning'
          });
        }

      }
    } else {
      $this.$message({
        showClose: true,
        message: data.respMsg + '（' + data.linkId + '）',
        type: 'warning'
      });
    }
  })
};

//编辑导购单所有信息接口
export const initLloadEditSellerBill = function ({
  commit,
  state
}, $this) {
  var params = JSON.parse(JSON.stringify(state.billingUsedParam));
  params.sellerBillId = state.eidtNeedParam.sellerBillId;
  params.sellerCartId = state.eidtNeedParam.sellerCartId;

  var loadingInstance;
  if (!state.billingInitNum) {
    loadingInstance = Loading.service({
      text: '加载中',
      target: document.querySelector(".billing-container")
    })
  }
  //开单所有信息接口
  API.loadEditSellerBill(params).then((data) => {
    loadingInstance && loadingInstance.close();
    if (data.success) {
      commit(types.BILLING_INIT_NUM, 1);
      if (data.response != null) {
        commit(types.SET_BILLING_INIT_DATA, data.response);
      } else {
        commit(types.SET_BILLING_INIT_DATA, {});
      }
    } else {
      commit(types.BILLING_INIT_NUM, 1);
      $this.$message({
        showClose: true,
        message: data.respMsg + '（' + data.linkId + '）',
        type: 'warning'
      });
    }
  })
};
