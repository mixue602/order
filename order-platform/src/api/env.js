/**
 *   做了反向代理
 *  mpf.atguat.com.cn/pcatpview      =>        打到pcatpview.atguat.com.cn
    mpf.atguat.com.cn/pcorderview    =>         pcorderview.atguat.com.cn
    mpf.atguat.com.cn/pcpayview      =>        pcpayview.atguat.com.cn
 * 
 * 
 * 
 */
var url=""
if(process.env.NODE_ENV=="production"){
  url=".ds.gome.com.cn";
}else if(process.env.NODE_ENV=="uatdevelopment"){
  url=".atguat.com.cn"
}else{
  url=".atguat.com.cn"
}



export default {
 baseURL:"https://easy-mock.com/mock",
 cookieDomain:url,
 pcatpview:"//mpf"+url+"/pcatpview",
 pcorderview:"//mpf"+url+"/pcorderview",
 pcpayview:"//mpf"+url+"/pcpayview",
 selectfileURL:"//mpf"+url+"/order/creatfileselect" //建档页面url
 // baseURL: '自己模拟地址 或者uat测试地址',
 
}
