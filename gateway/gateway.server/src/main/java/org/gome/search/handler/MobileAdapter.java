package org.gome.search.handler;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import org.apache.commons.lang3.StringUtils;
import org.gome.search.domain.*;
import org.gome.search.dubbo.domain.AppContent;
import org.gome.search.dubbo.domain.AppResponse;
import org.gome.search.utils.CommonUtils;
import org.springframework.stereotype.Service;
import org.t6.service.entity.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Created by doujintong on 16-12-20.
 */
@Service
public class MobileAdapter
{

    private static Map<String,String> kvs = new HashMap(){{
        put("id", "pId");
        put("pshopId", "shopId");
        put("catId", "defCatId");
        put("inStock", "stock");
        put("thirtyDaysVolume", "salesVolume");
        put("commentQuantity", "evaluateCount");
        put("catId", "defCatId");
    }};

    public SearchRequest adapterNew(JSONObject request) {
        String keyWord = request.getString("question");
        String extraWord = request.getString("et");
        String question = getReqQuestion(keyWord, extraWord);
        if(StringUtils.isNotBlank(question)){
            question = question.trim();
        }
        boolean XSearch = getReqXSearch(request.getString("catId"), request.getString("shopId"));
        String shopId = request.getString("shopId");
        String catId = request.getString("catId");
        String activityId =request.getString("activityId");
        String blueActivityId = request.getString("blueActivityId");
        String shoppingCartActivityId=request.getString("shoppingCartActivityId");
        CommonUtils.requireOnlyOne(question,shopId,catId,blueActivityId,shoppingCartActivityId,"params is null");

        Integer crossShopParam = request.getInteger("crossShop");
        SearchRequest searchRequest;
        if(StringUtils.isNotBlank(blueActivityId)){
            searchRequest =request.toJavaObject(BlueRequest.class);
            searchRequest.setOriginModule(OriginModule.BLUE);
            ((BlueRequest)searchRequest).setBlueActivityId(blueActivityId);
        }else if(StringUtils.isNotBlank(shoppingCartActivityId)){
            searchRequest = request.toJavaObject(CartRequest.class);
            searchRequest.setOriginModule(OriginModule.COUDAN);
            int crossShop = crossShopParam == null ? -1 : crossShopParam;
            ((CartRequest)searchRequest).setCrossShop(crossShop);
            ((CartRequest)searchRequest).setShoppingCartActivityId(shoppingCartActivityId);
        }else if(StringUtils.isNotBlank(shopId)){
            searchRequest = request.toJavaObject(ShopRequest.class);
            searchRequest.setOriginModule(OriginModule.SHOP);
            ((ShopRequest)searchRequest).setShopId(shopId);
        }else if(StringUtils.isNotBlank(catId)){
            searchRequest = request.toJavaObject(SearchRequest.class);
            searchRequest.setOriginModule(OriginModule.CATEGORY);
        }else{
            searchRequest = request.toJavaObject(SearchRequest.class);
            searchRequest.setOriginModule(OriginModule.SEARCH);
        }
        searchRequest.setQuestion(question);
        if(StringUtils.isNotBlank(activityId)){
            searchRequest.setPromoFlag(1);
        }
        searchRequest.setXSearch(XSearch);
        searchRequest.setKvObj("from", request.getString("from"));
        searchRequest.setKvObj("reqId", request.getString("reqId"));
        searchRequest.setKvObj("limitCat", request.getBooleanValue("limitCat"));
        searchRequest.setKvObj("firstCatIds", request.getJSONArray("firstCatIds"));
        searchRequest.setKvObj("rebatePrice", request.getString("rebatePrice"));
        searchRequest.setIp(request.getString("ip"));
        return searchRequest;
    }

    public void dealResult(Object resultR, AppResponse appResponse, int type) {
        switch (type){
            case 1:
                dealResult((SearchResponse)resultR, appResponse);
                break;
            case 2:
                dealResult((JSONObject)resultR, appResponse);
                break;
            case 3:
                dealResult((SearchResult)resultR, appResponse);
                break;
            case 4:
                dealResult((ProductResult)resultR, appResponse);
                break;
            case 5:
                dealResult((MultiSearchResult)resultR, appResponse);
                break;
        }
    }

    private void dealResult(SearchResponse resultR, AppResponse appResponse){
        ResultContent resultContent=(ResultContent)resultR.getContent();
        AppContent content = appResponse.getContent();
        content.setCategory(resultContent.getCategory());
        content.setActivities(resultContent.getActivities());
        content.setBanner(resultContent.getBanner());
        content.setFacets(resultContent.getFacets());
        content.setProdInfo(resultContent.getProdInfo().getJSONArray("products"));
        content.setPageBar(resultContent.getPageBar());
        content.setSelectData(resultContent.getSelectData());
        content.setPromoInfo(resultContent.getPromoInfo());
        content.setCommonInfo(resultContent.getCommonInfo());
        appResponse.setStatus(resultR.getHeader().getIntValue("status"));
        appResponse.getServerInfo().setAppTime(resultR.getHeader().getIntValue("appTime"));
        appResponse.getServerInfo().setReqId(resultR.getHeader().getString("rid"));
    }

    private void dealResult(JSONObject resultR, AppResponse appResponse){
        JSONObject data= (JSONObject)resultR.get("data");
        JSONObject pageBar = (JSONObject)resultR.get("pageBar");
        AppContent content = appResponse.getContent();
        content.setProdInfo(data.getJSONArray("items"));
        content.setPageBar(pageBar);
        appResponse.getServerInfo().setAppTime(resultR.getIntValue("appTime"));
    }

    private void dealResult(SearchResult resultR, AppResponse appResponse){
        JSONObject pageBar = new JSONObject();
        pageBar.put("totalCount", resultR.getData().getCount());
        pageBar.put("totalPage", resultR.getData().getPageCount());
        AppContent content = appResponse.getContent();
        JSONArray pros = (JSONArray)JSONArray.toJSON(resultR.getData().getItems());
        dealProductInfo(pros,kvs);
        content.setProdInfo(pros);
        FacetEntity facet = resultR.getData().getFacet();
        if(facet != null && facet.getCategories()!=null){
            List<ResCategory> categories = facet.getResCategories();
            if(categories!=null && categories.size()>0){
                JSONObject categoryTree = new JSONObject();
                categoryTree.put("categoryTree",JSONArray.toJSON(categories));
                content.setCategory(categoryTree);
            }
        }
        List<FacetInfoEntity> infos = resultR.getData().getInfos();
        if(infos != null && infos.size() > 0){
           JSONArray facetInfos = (JSONArray)JSONArray.toJSON(infos);
            facetInfos.stream().forEach(item ->{
                JSONObject facetInfo = (JSONObject)item;
                int type = facetInfo.getIntValue("type");
                JSONArray facets = facetInfo.getJSONArray("facets");
                facets.forEach(facetItem->{
                    JSONObject facetObj = (JSONObject)facetItem;
                    facetObj.put("value",facetObj.get("name"));
                    facetObj.remove("name");
                    if(type != 1){
                        facetObj.remove("prefix");
                    }
                });
                facetInfo.put("items",facets);
                facetInfo.remove("facets");
                if(type == 1){
                    content.getFacets().put("brand",facetInfo);
                }else if(type == 3){
                    JSONArray commonfacets = content.getFacets().getJSONArray("commonfacets");
                    if(commonfacets == null){
                        commonfacets = new JSONArray();
                    }
                    commonfacets.add(facetInfo);
                    content.getFacets().put("commonfacets",commonfacets);
                }
            });
        }
        content.setPageBar(pageBar);
        appResponse.getServerInfo().setAppTime((int) resultR.getAppTime());
    }

    private void dealResult(MultiSearchResult resultR, AppResponse appResponse){
        AppContent content = appResponse.getContent();
        JSONArray pros = (JSONArray)JSONArray.toJSON(resultR.getData());
        pros = pros.stream().map(item -> {
            JSONObject itemObj = (JSONObject)item;
            JSONArray items = itemObj.getJSONArray("items");
            dealProductInfo(items, kvs);
            return item;
        }).collect(Collectors.toCollection(JSONArray::new));
        content.setProdInfo(pros);
        appResponse.getServerInfo().setAppTime((int) resultR.getAppTime());
    }

    private void dealResult(ProductResult resultR, AppResponse appResponse){
        JSONObject pageBar = new JSONObject();
        pageBar.put("pageNumber", resultR.getPageNum());
        pageBar.put("pageSize", resultR.getPageSize());
        pageBar.put("totalCount", resultR.getAllCnt());
        AppContent content = appResponse.getContent();
        content.setProdInfo((JSONArray)JSONArray.toJSON(resultR.getItems()));
        content.setPageBar(pageBar);
        appResponse.getServerInfo().setAppTime(-10);
    }

    private void dealProductInfo(JSONArray t6Pro,Map<String,String> kvs){
        if(t6Pro==null)return;
        Set<String> keys = kvs.keySet();

        t6Pro.stream().forEach(item ->{
            JSONObject itemObj = (JSONObject)item;
            keys.stream().forEach(key -> {
                if(itemObj.containsKey(key)){
                    itemObj.put(kvs.get(key), itemObj.get(key));
                    itemObj.remove(key);
                }
            });
            itemObj.put("rebate",itemObj.getBoolean("rebate") ? 1 : 0);
        });
    }

    private String getReqQuestion(String keyWord, String extraWord) {
        if (StringUtils.isEmpty(extraWord))
            return keyWord;
        return keyWord + " " + extraWord;
    }

    private boolean getReqXSearch(String catId, String shopId) {
        if (StringUtils.isEmpty(catId) || "0".equals(catId)) {
            if (StringUtils.isEmpty(shopId) || "0".equals(shopId)) {
                return true;
            }
        }
        return false;
    }
}
