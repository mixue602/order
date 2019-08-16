package org.gome.search.controller;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.mongodb.BasicDBObject;
import org.apache.commons.lang3.StringUtils;
import org.gome.search.cache.MemoryCacheBean;
import org.gome.search.domain.*;
import org.gome.search.handler.SearchRequestBuilder;
import org.gome.search.service.SearchService;
import org.gome.search.trace.TranType;
import org.gome.search.trace.Transaction;
import org.gome.search.utils.CommonUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;

import static org.gome.search.utils.CommonUtils.isPriceSortHander;

/**
 * @author Jacky
 * @date 2015年10月18日
 */
@Controller
public class WebController {

    @Autowired
    private SearchService searchService;

    @Autowired
    private MemoryCacheBean memoryCacheBean;

    @Autowired
    private StoreConfiguration storeConfiguration;


    @RequestMapping("/cloud/config.html")
    public String config(Map<String, Object> model) {
        JSONArray jsonArray=new JSONArray();
        ((JSONObject)JSONObject.toJSON(storeConfiguration))
                .forEach((key,value)->{
                    JSONObject item=new JSONObject();
                    item.put("key",key);
                    item.put("value",value);
                    jsonArray.add(item);
                });
        model.put("data",jsonArray);
        return "index";
    }

    /**
     * 列表页
     * @param catId
     * @return
     */
    @RequestMapping(value ="/category/{catId:cat[0-9]{8}}.html**")
    public String categoryPage(@PathVariable("catId") String catId,@RequestParam(defaultValue = "1") int page){
        return "forward:/category/"+catId+"-00-0-48-1-0-0-0-"+page+"-0-0-0-0-0-0-0-0-0.html**";
    }

    @RequestMapping(value = {"/category/{catId:cat[0-9]{8}}-{sort:[0-9]{2}}-{sale:[0-1]{3}|0}-48-{instock:[0|1]}-0-{price:0|[0-9]+x[0-9|*]+}-{priceTag:[0|1]}-{pageNumber:[1-9]{1}[0-9]{0,1}}-{facets:0|[0-9a-zA-Z]{4,32}}-{promoFlag:[0|1]}-{productTag:[0|1|2]}-{market:0|[0-1]{2}}-0-0-0-0-0.html**"})
    public String categoryPage1(HttpServletRequest request,Map<String, Object> model,SearchRequest searchRequest,@RequestParam(defaultValue = "1") int page){
        if(isAsynSearch(request)){
            return forwardUrl(request,1,page);
        }
        searchRequest.setPageNumber(page);
        String catId = searchRequest.getCatId();
        List<String> catHot= memoryCacheBean.getCatHotWordMap().get(catId);
        SearchResponse searchResponse=searchService.categoryHandle(SearchRequestBuilder.build(request,searchRequest));
        setModule(model,new Tuple2("searchObj",searchResponse),new Tuple2("searchReq", searchRequest),new Tuple2("catHotWord",catHot));
        return "category";
    }

    @RequestMapping(value = {"/lpage/{catId:cat[0-9]{8}}-{sort:[0-9]{2}}-{sale:[0-1]{3}|0}-48-{instock:[0|1]}-0-{price:0|[0-9]+x[0-9|*]+}-{priceTag:[0|1]}-{pageNumber:[1-9]{1}[0-9]{0,1}}-{facets:0|[0-9a-zA-Z]{4,32}}-{promoFlag:[0|1]}-{productTag:[0|1|2]}-{market:0|[0-1]{2}}-0-0-0-0-0.html**"})
    @ResponseBody
    public SearchResponse categoryPageRow(@RequestHeader("Referer") String refer,HttpServletRequest request,SearchRequest searchRequest){
        CommonUtils.checkRefer(refer);
        return searchService.categoryHandle(SearchRequestBuilder.build(request,searchRequest));
    }
    /**
     * 搜索页
     * @param request
     * @param model
     * @param searchRequest
     * @return
     */
    @RequestMapping(value="/search")
    @Transaction(TranType.URL)
    public String searchPage(HttpServletRequest request,Map<String, Object> model,SearchRequest searchRequest,@RequestParam(defaultValue = "1") int page){
        String shopName = request.getParameter("shop");
        if(StringUtils.isNotBlank(shopName)){
            return forwardUrl(request,4,page);
        }
        String pzin=StringUtils.defaultString(request.getParameter("pzin"),"v4");
        searchRequest.setKvObj("pzin", pzin);
        if(isAsynSearch(request)){
            return forwardUrl(request,2,page);
        }
        isPriceSortHander(request,searchRequest);
        searchRequest.setPageNumber(page);
        SearchResponse searchResponse=searchService.searchHandle(SearchRequestBuilder.build(request, searchRequest));
        setModule(model, new Tuple2("searchObj", searchResponse), new Tuple2("searchReq", searchRequest));
        return "search";
    }

    @RequestMapping(value="/spage")
    @ResponseBody
    public SearchResponse searchPageRow(@RequestHeader("Referer") String refer, HttpServletRequest request,SearchRequest searchRequest,@RequestParam(defaultValue = "1") int page){
        CommonUtils.checkRefer(refer);
        String pzin=StringUtils.defaultString(request.getParameter("pzin"),"v4");
        searchRequest.setKvObj("pzin", pzin);
        searchRequest.setPageNumber(page);
        isPriceSortHander(request,searchRequest);
        return searchService.searchHandle(SearchRequestBuilder.build(request, searchRequest));
    }

    @RequestMapping(value="/shop")
    public String shopPage(HttpServletRequest request, Map<String, Object> model){
        String shopName = request.getParameter("shop");
        JSONObject req = new JSONObject();
        req.put("question", shopName);
        req.put("pageSize",10);
        req.put("pageNum",1);
        JSONObject content =  (JSONObject)searchService.mallHandle(req).getContent();
        setModule(model, new Tuple2("shopObj", content));
        return "shop";
    }

    /**
     * 品牌页
     * @param request
     * @param model
     * @param searchRequest
     * @return
     */
    @RequestMapping(value="/pinpai/{brandId:[0-9a-zA-Z]{4}}-{catId:0|cat[0-9]{8}}.html**")
    public String brandPage(HttpServletRequest request,Map<String, Object> model,SearchRequest searchRequest,@RequestParam(defaultValue = "1") int page){

        if (searchRequest.getCatId() != null && !"0".equals(searchRequest.getCatId())){
            request.setAttribute("isCatId", "Y");
        }else{
            request.setAttribute("isCatId", "N");
        }
        if(isAsynSearch(request)){
            return forwardUrl(request,3,page);
        }
        searchRequest.setPageNumber(page);
        searchRequest.setXSearch(true);
        SearchResponse searchResponse=searchService.brandHandle(SearchRequestBuilder.build(request, searchRequest));
        setModule(model, new Tuple2("searchObj", searchResponse), new Tuple2("searchReq", searchRequest));
        return "brand";
    }

    @RequestMapping(value="/wpinpai/{brandId:[0-9a-zA-Z]{4}}-{catId:0|cat[0-9]{8}}.html**")
    @ResponseBody
    public SearchResponse brandPageRow(@RequestHeader("Referer") String refer,HttpServletRequest request,SearchRequest searchRequest,@RequestParam(defaultValue = "1") int page){
        CommonUtils.checkRefer(refer);
        searchRequest.setPageNumber(page);
        searchRequest.setXSearch(true);
        return searchService.brandHandle(SearchRequestBuilder.build(request, searchRequest));
    }

    private boolean isAsynSearch(HttpServletRequest request){
        return StringUtils.equals(request.getParameter("type"),"json") && !StringUtils.equals(request.getParameter("pageType"),"bjson");
    }

    private String forwardUrl(HttpServletRequest request ,int type,int page){
        String forwardUrl="";
        if(type==1){
            String[] url= StringUtils.split(request.getRequestURI().toString(),"-");url[8]=String.valueOf(page);
            forwardUrl="forward:"+(StringUtils.join(url,"-")).replace("category","lpage");
        }else if(type==2){
            forwardUrl = "forward:/spage";
        }else if(type==3){
            forwardUrl="forward:"+(request.getRequestURI().toString()).replace("pinpai","wpinpai");
        }else if(type==4){
            forwardUrl = "forward:/shop";
        }
        return forwardUrl;
    }

    @RequestMapping("/cloud/test.jsp")
    public String testPage(Map<String, Object> model) {
        return "test1";
    }

    @RequestMapping("/cloud/blank")
    public String blankPage(Map<String, Object> model) {
        return "blank";
    }

    private void setModule(Map<String, Object> model,Tuple2 ... tuple){
        for (Tuple2 tuple2 : tuple) {
            model.put(tuple2.getV1().toString(),tuple2.getV2());
        }
    }

    @RequestMapping("/cloud/error")
    public String errorPage(Map<String, Object> model) {
        return "error";
    }



}
