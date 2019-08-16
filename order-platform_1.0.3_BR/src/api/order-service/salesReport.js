import * as API from '../'

import Env from '../env';
export default {
    //1.17 查询用户十大品类列表接口（http）
    getUserMainCategoryList: () => {
        return API.POST(Env.pcorderview + '/queryUserMainCategoryList')
    },
    //13.1 查询销售明细
    querySalesItemList: (params) => {
        //return API.POST(Env.pcorderview + '/querySalesItemList', params)
        //return API.POST(Env.pcorderview + '/querySalesItemListNew', params)
        return API.POST(Env.pcorderview + '/querySalesItemListRebuild', params)
    },
    //13.1 查询销售明细--由大数据提供的新接口，后期会替换原来的querySalesItemListNew接口
    querySalesItemListNew: (params) => {
        return API.POST(Env.pcorderview + '/querySalesItemListRebuild', params)
    },
  //导出销售明细
  downSalesItemList: (params) => {//Env.pcorderview + '/exportSalesItemListExcel', params
    return API.Axios({
      method:'post',
      //url:Env.pcorderview + '/exportSalesItemListExcel',
      //url:Env.pcorderview + '/exportSalesItemListExcelNew',
      url:Env.pcorderview + '/exportSalesItemListExcelRebuild',
      // responseType:'blob',
      data:params
    })
  },
  //导出销售明细--由大数据提供的新接口，后期会替换原来的downSalesItemList接口
  downSalesItemListNew: (params) => {//Env.pcorderview + '/exportSalesItemListExcelNew', params
    return API.Axios({
      method:'post',
      url:Env.pcorderview + '/exportSalesItemListExcelRebuild',
      // responseType:'blob',
      data:params
    })
  },
  //下载销售明细
  saleFileExit: (params) => {
    return API.POST(Env.pcorderview + '/saleFileExit', params)
  },
  //导出促销费明细
  downPromotionFeeList: (params) => {//Env.pcorderview + '/exportSalesItemList', params
    return API.Axios({
      method:'post',
      url:Env.pcorderview + '/exportPromotionFeeList',
      responseType:'blob',
      data:params
    })
  },
  queryBrandList: (params) => {
    return API.POST(Env.pcatpview + '/queryBrandList', params)
  },
  querySupplierList: (params) => {
    return API.POST(Env.pcatpview + '/querySupplierList', params)
  },
  //销售部门级联接口
  queryHierarchy: params => {
    return API.POST(Env.pcorderview + '/queryHierarchy', params)
  },
  queryHierarchyNew: params => {//销售部门级联新接口
    return API.POST(Env.pcorderview + '/queryHierarchyNew', params)
  },
  //促销费报表
  queryPromotionFeeList: params => {
    //return API.POST(Env.pcorderview + '/queryPromotionFeeList', params)
    return API.POST(Env.pcorderview + '/queryPromotionFeeListRebuild', params)
  },
  //促销费报表接口重构
  queryPromotionFeeListNew: params => {
    return API.POST(Env.pcorderview + '/queryPromotionFeeListRebuild', params)
  },
  //品类
  queryUserMultiCateList: params => {
    return API.POST(Env.pcorderview + '/queryUserMultiCateList', params)
  },
  //报表汇总-销售额、销售数量、各大区柱状图
  querySalesTotalRegion: params => {
    return API.POST(Env.pcorderview + '/querySalesTotalRegion', params)
  },
  //报表汇总-表格
  querySalesTotalList: params => {
    return API.POST(Env.pcorderview + '/querySalesTotalList', params)
  },
  //报表汇总-查看明细
  querySalesTotalDetail:params => {
    return API.POST(Env.pcorderview + '/querySalesTotalDetail', params)
  },
  //报表汇总-导出
  exportSalesCollectExcel:params => {
    return API.POST(Env.pcorderview + '/exportSalesCollectExcel', params)
  },
  //报表汇总-下载
  saleFileExit:params => {
    return API.POST(Env.pcorderview + '/saleFileExit', params)
  },
  //app推广列表
  getApplist:params => {
    return API.GET(Env.pcorderview + '/queryOfflineAPPList', params)
  },
  //app推广列表--导出/exportOfflineAPPList
  exportOfflineAPPList:(params) => {//Env.pcorderview + '/exportOfflineAPPList', params
    return API.Axios({
      method:'post',
      url:Env.pcorderview + '/exportOfflineAPPList',
      responseType:'blob',
      data:params
    })
  }
}
