const state = {
  LOGINDATA: '', // 登陆
  billingEdit: false, //处理是否是从导购单点击编辑后的开单页,默认不是
  billingInitData: {}, //开单初始化数据
  skuNoSearchKeyWord: "", //搜索 商品名称/编码 关键词
  billingUsedParam: { //开单页传递ajax参数
    sellerNum: '', //员工编号
    storeCode: '', //门店编码
    memberId: '', //会员id
    memberCard: '', //会员卡号
    temporaryCardFlag: 0, //是否临时卡,0否1是
    siteType: 1 //站点 1-普通 2-预售 3-延保,5-运营商开票
    //在编辑导购单的时候这个对象里会有以下2这个字段
  },
  storeName: "", //存储门店name
  eidtNeedParam: { //编辑导购单的时候需要的参数
    sellerBillId: '',
    sellerCartId: ''
  },
  billingpurchase: {}, //导购车初始化数据
  isAllUnSupportInvoice: false, // 是否全部是不支持开发票的商品
  isShowAllSelect: true, //导购单页面是否显示全选按钮
  isOperateBillingPage: false, //是否操作过开单界面,只要点了弹窗的确定按钮就认为是操作过界面，每次切换配送方式的时候重置
  billingInitNum: 0, //开单初始化调用接口时第一次加载loading，之后不加载
  depositObjData: {}, // 账户订金对象
  poolFlag: -1,//1:联营门店，2：加盟店，0：线下门店
  fullDeposit: {//全额定金
    price: '',//全额定金价格
    supplier: ''//供应商code
  },
}
export default state
