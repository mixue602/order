package org.gome.search.controller;


import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.mongodb.BasicDBObject;
import org.apache.commons.lang.StringUtils;
import org.gome.search.cache.MemoryCacheBean;
import org.gome.search.domain.*;
import org.gome.search.handler.MobileAdapter;
import org.gome.search.handler.SearchRequestBuilder;
import org.gome.search.router.EbusMessage;
import org.gome.search.service.SearchService;
import org.gome.search.ssdb.util.KeyValue;
import org.gome.search.utils.CommonUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.t3.service.help.invoker.HelperApiInvoker;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import static org.gome.search.utils.CommonUtils.requireNonNullOrStr;

/**
 * Created by doujintong on 16-9-5.
 */
@org.springframework.web.bind.annotation.RestController
public class RestController {

    @Autowired
    private SearchService searchService;

    @Autowired
    private MobileAdapter mobileAdapter;

    @Autowired
    private MemoryCacheBean memoryCacheBean ;

    @Autowired
    private HelperApiInvoker helperApiInvoker;


    @RequestMapping(value = {"/p/test"})
    @ResponseBody
    public String test(String data){
        return data;
    }

    @RequestMapping(value = {
        "/p/product/{pageSize:[1-4][0-8]|[1-9]}/{pageNumber:100|[0-9]{2}|[1-9]}/{sort:[0-3|5][0|1]|0}/{question}/{catId:0|cat[0-9]{8}}/{facets:0|[0-9a-zA-Z]{4,60}}/{productTag:[0|1|2]}/{market:0|[0-2]{2}}/{priceTag:[0|1]}/{price:0|[0-9]+x[0-9|*]+}**",
        "/p/product/{pageSize:[1-4][0-8]|[1-9]}/{pageNumber:100|[0-9]{2}|[1-9]}/{sort:[0-3|5][0|1]|0}/{question}/{catId:0|cat[0-9]{8}}/{facets:0|[0-9a-zA-Z]{4,60}}/{productTag:[0|1|2]}/{market:0|[0-2]{2}}/{priceTag:[0|1]}/{price:0|[0-9]+x[0-9|*]+}/{instock:[0|1]}**"
    })
    @ResponseBody
    public SearchResponse asynSearch(HttpServletRequest request, SearchRequest req) {
        req.setOriginModule(OriginModule.SEARCH);
        String pzin=request.getParameter("pzin");
        if(pzin==null){
            req.setKvObj("pzin", "v3");
        }
        req.setKvObj("logS",false);
        return searchService.productHandle(SearchRequestBuilder.build(request, req));
    }

    @RequestMapping(value = {
            "/p/cart/{pageSize:[1-4][0-8]|[1-9]}/{pageNumber:100|[0-9]{2}|[1-9]}/{sort:[0-3|5][0|1]|0}/{shoppingCartActivityId}/{isGome:[1|2]}/{crossShop:[0|1]}/{catId:0|cat[0-9]{8}}/{facets:0|[0-9a-zA-Z]{4,60}}/{priceTag:[0|1]}/{price:0|[0-9]+x[0-9|*]+}**",
            "/p/cart/{pageSize:[1-4][0-8]|[1-9]}/{pageNumber:100|[0-9]{2}|[1-9]}/{sort:[0-3|5][0|1]|0}/{shoppingCartActivityId}/{isGome:[1|2]}/{crossShop:[0|1]}/{catId:0|cat[0-9]{8}}/{facets:0|[0-9a-zA-Z]{4,60}}/{priceTag:[0|1]}/{price:0|[0-9]+x[0-9|*]+}/{instock:[0|1]}**",
            "/p/cart/{pageSize:[1-4][0-8]|[1-9]}/{pageNumber:100|[0-9]{2}|[1-9]}/{sort:[0-3|5][0|1]|0}/{shoppingCartActivityId}/{isGome:[1|2]}/{crossShop:[0|1]}/{catId:0|cat[0-9]{8}}/{facets:0|[0-9a-zA-Z]{4,320}}/{priceTag:[0|1]}/{price:0|[0-9]+x[0-9|*]+}/{instock:[0|1]}/{question}/{promoFlag:[0|1]}/{couDanType:[0|1]}/{couDanPrice:0|[0-9]+x[0-9|*]+}**"
    })
    @ResponseBody
    public SearchResponse cartSearch(HttpServletRequest request, CartRequest req, @PathVariable int isGome) {
        if(isGome == 1){req.setCrossShop(-1);}//自营
        return searchService.cartHandle(SearchRequestBuilder.build(request, req));
    }

    @RequestMapping(value = {"/p/blue/{pageSize:[1-4][0-8]|[1-9]}/{pageNumber:100|[0-9]{2}|[1-9]}/{sort:[0-3|5][0|1]|0}/{blueActivityId:[a-zA-Z0-9]{0,15}}/{catId:0|cat[0-9]{8}}/{facets:0|[0-9a-zA-Z]{4,60}}**",
                             "/p/blue/{pageSize:[1-4][0-8]|[1-9]}/{pageNumber:100|[0-9]{2}|[1-9]}/{sort:[0-3|5][0|1]|0}/{blueActivityId:[a-zA-Z0-9]{0,15}}/{catId:0|cat[0-9]{8}}/{facets:0|[0-9a-zA-Z]{4,60}}/{priceTag:[0|1]}/{price}**",
                             "/p/blue/{pageSize:[1-4][0-8]|[1-9]}/{pageNumber:100|[0-9]{2}|[1-9]}/{sort:[0-3|5][0|1]|0}/{blueActivityId:[a-zA-Z0-9]{0,15}}/{catId:0|cat[0-9]{8}}/{facets:0|[0-9a-zA-Z]{4,60}}/{priceTag:[0|1]}/{price:0|[0-9]+x[0-9|*]+}/{question}/{productTag:[0|1]}/{instock:[0|1]}/{promoFlag:[0|1]}/{couponType:[0|1]}**"
                            })
    @ResponseBody
    public SearchResponse blueSearch(HttpServletRequest request, BlueRequest req) {
        return searchService.blueHandle(SearchRequestBuilder.build(request, req));
    }


    @RequestMapping(value={"/p/lshop/{pageSize:[1-4][0-8]|[1-9]}/{pageNumber:100|[0-9]{2}|[1-9]}/{sort:[1-3|5][0|1]|0}/{question}/{catId:0|B[0-9]{8}|G[0-9]{1,}}/{shopId:0|[0-9a-zA-Z]{1,}}/{priceTag:[0|1]}/{price:0|[0-9]+x[0-9|*]+}/**"})
    @ResponseBody
    public SearchResponse shopSearch(HttpServletRequest request, ShopRequest shopRequest){
        requireNonNullOrStr(shopRequest.getShopId(), "shopId is null!");
        return searchService.shopHandle((ShopRequest)SearchRequestBuilder.build(request, shopRequest));
    }

    @RequestMapping(value={"/p/asynSearch"})
    @ResponseBody
    public Object mallSearch1(HttpServletRequest request, HttpServletResponse response){
        String module = request.getParameter("module");
        if("shopSearch".equals(module)){
            String body =  request.getParameter("body");
            JSONObject req = (JSONObject)JSONObject.parse(body);
            String question = req.getString("question");
            int pageSize = req.getInteger("pageSize");
            int pageNum = req.getInteger("pageNum");
            CommonUtils.requireNonNullOrStr(question,pageNum,pageSize,"param is not null!");
            String userAgent = request.getHeader("User-Agent");
            req.put("userAgent",userAgent);
            return searchService.mallHandle(req).getContent();
        }else{
            response.setStatus(404);
            return null;
        }
    }

    @RequestMapping(value={"/p/mall/{pageSize:[1-4][0-8]|[1-9]}/{pageNum:100|[0-9]{2}|[1-9]}/{question}/**"})
    @ResponseBody
    public Object mallSearch(@RequestHeader(value = "User-Agent", required = false) String userAgent,@PathVariable Integer pageSize,
                             @PathVariable Integer pageNum,
                             @PathVariable String question){
        JSONObject req = new JSONObject();
        req.put("question",question);
        req.put("pageSize",pageSize);
        req.put("pageNum",pageNum);
        req.put("userAgent",userAgent);
        return searchService.mallHandle(req).getContent();
    }

    @RequestMapping(value={"/p/taoGou/{pId}/{skuId}/**"})
    @ResponseBody
    public Object taoGouSearch(HttpServletRequest request, @PathVariable String pId,
                             @PathVariable String skuId){

        String regionId = CommonUtils.getRegionId(request);
        requireNonNullOrStr(pId, skuId, "pid && skuId is null!");

        JSONObject req = new JSONObject();
        req.put("pId",pId);
        req.put("skuId",skuId);
        req.put("regionId",regionId);
        return searchService.taoGouHandle(req).getContent();
    }

    @RequestMapping(value={"/p/facet"},method = { RequestMethod.POST, RequestMethod.GET })
    @ResponseBody
    public Object callFacetsValue(FacetsRequest facetsRequest){
        requireNonNullOrStr(facetsRequest.getCatId(), facetsRequest.getId(), "catId && id is null!");
        return searchService.callFacetsHandle(facetsRequest).getContent();
    }

    @RequestMapping(value={"/p/map"},method = { RequestMethod.POST, RequestMethod.GET })
    @ResponseBody
    public Object infSiteMap(FacetsRequest facetsRequest ){
        requireNonNullOrStr(facetsRequest.getCatId(), "catId is null!");
        return searchService.infSiteMapHandle(facetsRequest).getContent();
    }

    @RequestMapping(value={"/p/suggest"},method = { RequestMethod.POST, RequestMethod.GET })
    @ResponseBody
    public Object suggestQuery(SuggestRequest suggestRequest){
        return searchService.suggestHandle(suggestRequest).getContent();
    }

    @RequestMapping(value = {"/p/smartBuy"},method = { RequestMethod.POST, RequestMethod.GET })
    @ResponseBody
    public Object smartBuy(SmartBuyRequest smartBuyRequest){
        return searchService.smartBuyHandle(smartBuyRequest).getContent();
    }

    @RequestMapping(value={"/p/contrast/{pageNumber}/{pageSize}/{time}"})
    @ResponseBody
    public Object contrast(@PathVariable int pageNumber ,@PathVariable int pageSize, @PathVariable String time){
        return searchService.contrast(pageNumber,pageSize,time);
    }


    @RequestMapping(value={"/p/pls"},method = { RequestMethod.POST, RequestMethod.GET })
    @ResponseBody
    public Object callBackComment(HttpServletRequest request, @RequestParam String productId ,@RequestParam int pls){
        if(CommonUtils.isRobotRequest(request.getHeader("user-agent")))return null;
        requireNonNullOrStr(productId, "productId is null!");
        return searchService.callBackCommentHandle(productId, pls).getContent();
    }


    @RequestMapping(value={"/p/releQuery","/cloud/releQuery"},method = { RequestMethod.POST, RequestMethod.GET })
    @ResponseBody
    public Object releQuery(@RequestParam String  question){
        JSONObject result=new JSONObject();
        JSONObject data=new JSONObject();
        data.put("rList",searchService.relevanceHandle(question).getContent());
        result.put("releData",data);
        return result;
    }

    @RequestMapping(value={"/p/category","/cloud/category"},method = { RequestMethod.POST, RequestMethod.GET })
    @ResponseBody
    public Object getCateReqData(@RequestParam String catId,
                                 @RequestParam(required = false) String parentId,
                                 @RequestParam(required = false) String brother){

        requireNonNullOrStr(catId, "catId is null!");
        JSONObject req = new JSONObject();
        req.put("catId", catId);
        req.put("parentId", parentId);
        req.put("brother", brother);
        return searchService.categoryDataHandle(req).getContent();
    }


    @RequestMapping(value={"/p/compare","/cloud/compare"},method = { RequestMethod.POST, RequestMethod.GET })
    @ResponseBody
    public Object compareProduct(HttpServletRequest request,@RequestParam(defaultValue = "1") int type, @RequestParam String id){
        String regionId = CommonUtils.getRegionId(request);
        CommonUtils.requireNonNullOrStr(id,"id is null");
        return searchService.compareProductHandle(type, id, regionId).getContent();
    }


    @RequestMapping(value={"/cloud/hotRecommend","/p/hotRecommend"},method = { RequestMethod.POST, RequestMethod.GET })
    @ResponseBody
    public Object hotRecommend(@RequestParam String catId,  HttpServletRequest request){
        requireNonNullOrStr(catId, "param is no valid!");
        String regionId = CommonUtils.getRegionId(request);
        return searchService.hotRecommendHandle(catId, regionId).getContent();
    }


    @RequestMapping(value={"/cloud/recomend"},method = { RequestMethod.POST, RequestMethod.GET })
    @ResponseBody
    public Object recomendQuery(HttpServletRequest request,
                                @RequestParam String recoProductId,
                                @RequestParam(defaultValue = "4", required = false) int pageSize){

        requireNonNullOrStr(recoProductId, "recoProductId is null!");
        JSONObject req = new JSONObject();
        req.put("recoProductId", recoProductId);
        String cookieId = CommonUtils.getCookieId(request);
        req.put("cookieId", cookieId);
        req.put("regionId", CommonUtils.getRegionId(request));
        req.put("pageSize", pageSize);
        return searchService.recommendHandle(req).getContent();
    }


    @RequestMapping(value = {"/cloud/test","/cloud/price","/p/price"},method = { RequestMethod.POST, RequestMethod.GET })
    @ResponseBody
    public SearchResponse testSearch(SearchRequest searchRequest,@RequestParam(required = false) String productId,
                                     @RequestParam(required = false) String skuId,@RequestParam int rank,
                                     @RequestParam(required = false) String shopId){
        searchRequest.setKvObj("productId",productId);
        searchRequest.setRegionId("1101110");
        searchRequest.setKvObj("skuId",skuId);
        searchRequest.setKvObj("debug",true);
        searchRequest.setKvObj("rank",rank);
        searchRequest.setKvObj("shopId",shopId);
        return searchService.testHandle(searchRequest);
    }


    @RequestMapping(value={"/cloud/log"},method = { RequestMethod.POST, RequestMethod.GET })
    @ResponseBody
    public Object dealUserAction(UserLoggerRequest userLoggerRequest, HttpServletRequest request){
        JSONObject req = new JSONObject();
        userLoggerRequest.setClientIp(CommonUtils.getRemoteIP(request));
        userLoggerRequest.setRegionId(CommonUtils.getRegionId(request));
        userLoggerRequest.setCookieId(CommonUtils.getCookieId(request));
        userLoggerRequest.setUserId(CommonUtils.getUserId(request));
        userLoggerRequest.setAddr(request.getLocalAddr());
        userLoggerRequest.setDate(System.currentTimeMillis());
        req.put("paramJson", userLoggerRequest.toString());
        req.put("logVersion", "v1");
        return searchService.dealUserActionHandle(req).getContent();
    }

    @RequestMapping(value = {"/cloud/top", "/p/top"},method = { RequestMethod.POST, RequestMethod.GET })
    @ResponseBody
    public Object topKey(HttpServletRequest req, @RequestParam String catId){
        requireNonNullOrStr(catId, "request catid is null ...");
        String userId = CommonUtils.getUserId(req);
        return searchService.topKeyHandle(req, catId, userId).getContent();
    }

    @RequestMapping(value = {"/p/rpc"},method = { RequestMethod.POST, RequestMethod.GET })
    @ResponseBody
    public Object helpCenter(@RequestParam(name = "json") String json){
        JSONObject params=(JSONObject)((JSONArray)(JSONObject.parseObject(json,BasicDBObject.class)).get("args")).get(0);
        return helperApiInvoker.search(new BasicDBObject(params)).get();
    }

    @Autowired
    private EbusMessage ebusMessage;

    @Autowired
    private StoreConfiguration storeConfiguration;

    @RequestMapping(value = "/cloud/init",method = { RequestMethod.POST, RequestMethod.GET })
    @ResponseBody
    public JSONObject initData(HttpServletRequest request){
        JSONObject result=new JSONObject();
        String opt=request.getParameter("opt");
        if("init".equals(opt)){
            memoryCacheBean.getKeyFilterMap().clear();

            memoryCacheBean.getIpFilterMap().clear();
            memoryCacheBean.getIllegalFilterMap().clear();
            memoryCacheBean.getFromFilterMap().clear();
            memoryCacheBean.init();
            result.put("result", "success");
        }
        return result;
    }

    @RequestMapping(value = "/cloud/config",method = { RequestMethod.POST, RequestMethod.GET })
    @ResponseBody
    public JSONObject config(HttpServletRequest request){
        JSONObject result=new JSONObject();
        String key=request.getParameter("key");
        if(StringUtils.isBlank(key)){
            result.put("result", storeConfiguration);
            return result;
        }
        String value=request.getParameter("value");
        if("flow".equals(key)){
            switch (value){
                case "HASH":ebusMessage.getChannels().forEach((k,v)->{ebusMessage.send(v,new KeyValue("regionHash","true"));ebusMessage.send(v,new KeyValue("region",k));});break;
                case "GC1":ebusMessage.getChannels().forEach((k,v)->{ebusMessage.send(v,new KeyValue("regionHash","false"));ebusMessage.send(v,new KeyValue("region",value));});break;
                case "GC3":ebusMessage.getChannels().forEach((k,v)->{ebusMessage.send(v,new KeyValue("regionHash","false"));ebusMessage.send(v,new KeyValue("region",value));});break;
            }
        }else{
            ebusMessage.getChannels().forEach((k,v)->{ebusMessage.send(v,new KeyValue(key,value));});
        }
        result.put("result", storeConfiguration);
        return result;
    }

    @RequestMapping(value = {"/p/enterpriseSearch/{pageSize:[1-4][0-8]|[1-9]}/{pageNumber:100|[0-9]{2}|[1-9]}/{sort:[0-3|5][0|1]|0}/{question}/{catId:0|cat[0-9]{8}}/{facets:0|[0-9a-zA-Z]{4,60}}/{productTag:[0|1|2]}/{market:0|[0-2]{2}}/{priceTag:[0|1]}/{price:0|[0-9]+x[0-9|*]+}/{instock:[0|1]}**"})
    @ResponseBody
    public SearchResponse enterpriseSearch(HttpServletRequest request, SearchRequest req) {
        req.setKvObj("logS",false);
        SearchRequest sq =  SearchRequestBuilder.build(request, req);
        String question = req.getQuestion();
        if(StringUtils.isNotBlank(question)){
            req.setXSearch(true);
        }
        String catId = req.getCatId();
        if(org.apache.commons.lang.StringUtils.isNotBlank(question)){
            sq.setOriginModule(OriginModule.ENSearch);
        }else if(org.apache.commons.lang.StringUtils.isNotBlank(catId)){
            sq.setOriginModule(OriginModule.ENCATEGORY);
        }
        return searchService.enterpriseHandle(sq);
    }

    @RequestMapping(value = {"/p/searchDetail/{skuId}"}) //restfur
    @ResponseBody
    public Object searchDetail(@PathVariable JSONArray skuId){
        return searchService.searchDetailHandle(skuId);
    }

}
