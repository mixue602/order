/**
 *   做了反向代理
 *  mpf.atguat.com.cn/pcatpview      =>        打到pcatpview.atguat.com.cn
    mpf.atguat.com.cn/pcorderview    =>         pcorderview.atguat.com.cn
    mpf.atguat.com.cn/pcpayview      =>        pcpayview.atguat.com.cn
 *
 *
 *
 */
var url="";
var domianurl="";
var mobileDomianUrl = '';
if(process.env.NODE_ENV=="production"){
  url=".ds.gome.com.cn";
  mobileDomianUrl="lgapi.mobile.gome.com.cn";
  domianurl="gome.com.cn";
}else if(process.env.NODE_ENV=="uatdevelopment"){
  url=".atguat.com.cn"
  mobileDomianUrl="laigou.mobile.uat.com.cn"
  domianurl="atguat.com.cn";
}else{
  url=".atguat.com.cn"
  mobileDomianUrl="laigou.mobile.uat.com.cn"
  domianurl="atguat.com.cn";
}
document.domain=domianurl;






export default {
 baseURL:"https://easy-mock.com/mock/5ad05b7ea253692101b88ae3",
 baseURL1: 'http://10.144.202.102:8091',
 baseURL2: 'http://10.144.50.123:8094',
 baseURL3: 'http://10.115.88.94:8000',
 cookieDomain:url,
 domain: domianurl,
 pcatpview:"/pcatpview",//可卖数
 pcorderview:"/pcorderview",//pc端订单
 pcpayview:"/pcpayview",//pc端支付
 selectfileURL:"//mpf"+url+"/order/creatfileselect", //建档页面url
 pcBilling: "/pccartview",//开单页
 pcsgpview: '/pcsgpview',//用于搜索和查询会员近期导购单
 laigoaccess: '/laigoaccess',//可买数接口
 visualorder:  '/visualorder',//定金翻倍
 staffpc: '//'+ mobileDomianUrl + '/staffpc',//全品类
 mobile: '//'+ mobileDomianUrl, //用app端域名
}
