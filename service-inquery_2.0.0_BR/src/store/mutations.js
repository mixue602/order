import * as types from './mutation-types'

const mutations = {
  [types.SET_LOGINDATA](state, LOGINDATA) {
    state.LOGINDATA = LOGINDATA
  },
  //处理是否是从导购单点击编辑后的开单页
  [types.BILLING_EDIT](state, boole) {
    state.billingEdit = boole;
  },
  //设置开单初始化数据
  [types.SET_BILLING_INIT_DATA](state, data) {
    state.billingInitData = data;
  },
  //开单页请求接口的公用参数集,需要传属性名attr和属性值value放在一个对象里传过来
  [types.SET_BILLING_USED_PARAM](state, obj) {
    state.billingUsedParam[obj.attr] = obj.value;
  },
  //编辑导购单的部分参数,需要传属性名attr和属性值value放在一个对象里传过来
  [types.SET_EDIT_NEED_PARAM](state, obj) {
    state.eidtNeedParam[obj.attr] = obj.value;
  },
  //设置导购车初始化数据
  [types.SET_BILLINGPURCHASE_INIT_DATA](state, data) {
    state.billingpurchase = data;
  },
  [types.SET_INVOICE_DATA](state, data) {
    state.isAllUnSupportInvoice = data;
  },
  // 设置是否显示全选按钮
  [types.SET_SELECT_DATA](state, data) {
    state.isShowAllSelect = data;
  },
  //是否操作过开单界面
  [types.IS_OPERATE_BILLING_PAGE](state, boole) {
    state.isOperateBillingPage = boole;
  },

  //开单初始化调用接口时第一次加载loading，之后不加载
  [types.BILLING_INIT_NUM](state, num) {
    state.billingInitNum = num;
  },

  //可卖数存储门店name
  [types.SET_STORE_NAME](state, name) {
    state.storeName = name;
  },
  // 账户中订金对象
  [types.SET_DEPOSIT_DATA](state, data) {
    state.depositObjData = Object.assign(data)
  },
  // 账户中订金对象
  [types.SET_POOLFLAG](state, data) {
    state.poolFlag = data;
  },

  //全额定金
  [types.SET_FULLDEPOSIT](state, data) {
    state.fullDeposit.price = data.price;
    state.fullDeposit.supplier = data.supplier;
  },
  
}

export default mutations
