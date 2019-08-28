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
if(process.env.NODE_ENV=="production"){
  url=".ds.gome.com.cn";
  domianurl="gome.com.cn";
}else if(process.env.NODE_ENV=="uatdevelopment"){
  url=".atguat.com.cn"
  domianurl="atguat.com.cn";
}else{
  url=".atguat.com.cn"
  domianurl="atguat.com.cn";
}
document.domain=domianurl;



export default {
 baseURL:'/midesk/members',
 cookieDomain:url,
 pcatpview:"/pcatpview",
 pcorderview:"/pcorderview",
 pcpayview:"/pcpayview",
 selectfileURL:"/order/creatfileselect" ,//建档页面url
 derviewURL: '/pcorderview',
 gomedoURL:'/midesk/members',
 videoGuideUrl:'/laigoaccess' //视频导购
 // baseURL: '自己模拟地址 或者uat测试地址',
}
