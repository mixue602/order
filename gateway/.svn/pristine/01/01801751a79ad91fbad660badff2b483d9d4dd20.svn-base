package org.gome.search.service;

import com.alibaba.fastjson.JSONObject;
import io.dubbo.springboot.DubboProvider;
import org.apache.commons.lang.StringUtils;
import org.gome.search.domain.OriginModule;
import org.gome.search.domain.RebateRequest;
import org.gome.search.domain.SearchRequest;
import org.gome.search.domain.SearchResponse;
import org.gome.search.dubbo.domain.AppRequest;
import org.gome.search.dubbo.domain.AppResponse;
import org.gome.search.dubbo.idl.AppService;
import org.gome.search.handler.MobileAdapter;
import org.springframework.beans.factory.annotation.Autowired;
import org.t6.service.entity.*;

import java.util.ArrayList;
import java.util.List;

import static org.gome.search.utils.CommonUtils.requireNonNullOrStr;
import static org.gome.search.utils.CommonUtils.requireOnlyOne;

/**
 * Created by doujintong on 17-3-13.
 */
@DubboProvider(version = "1.0.0",timeout = 5000,retries = 3)
public class AppServiceImpl implements AppService {

    @Autowired
    private MobileAdapter mobileAdapter;

    @Autowired
    private SearchService searchService;


    @Override
    public AppResponse mainSearch(AppRequest appRequest) {
        AppResponse appResponse = new AppResponse();
        requireOnlyOne(appRequest.getCatId(), appRequest.getQuestion(),appRequest.getBlueActivityId(),appRequest.getShopId(),appRequest.getShoppingCartActivityId(),  "params is at least one!");
        JSONObject searchObject=(JSONObject)JSONObject.toJSON(appRequest);
        SearchRequest searchRequest=mobileAdapter.adapterNew(searchObject);
        searchRequest.setMobile(true);
        if(appRequest.getHeaders()!=null && !appRequest.getHeaders().isEmpty()){
            searchRequest.setKvObj("source","APP");
            String pageid = StringUtils.defaultString((String) appRequest.getHeaders().get("pid"), "");
            searchRequest.setKvObj("pageId",pageid);
            searchRequest.setCookieId(searchRequest.getUserId());
            if(appRequest.getHeaders().get("rank")!=null){
                searchRequest.setKvObj("rank",appRequest.getHeaders().get("rank"));
            }
        }else{
            searchRequest.setKvObj("source","WAP");
        }

        SearchResponse resultR=searchService.appHandle(searchRequest);
        mobileAdapter.dealResult(resultR, appResponse,1);
        return appResponse;
    }

    @Override
    public AppResponse enterpriseSearch(AppRequest appRequest){
        AppResponse appResponse = new AppResponse();
        //question和catid　至少传一个
        requireOnlyOne(appRequest.getCatId(), appRequest.getQuestion(),  "params is at least one!");

        JSONObject searchObject=(JSONObject)JSONObject.toJSON(appRequest);
        SearchRequest searchRequest=mobileAdapter.adapterNew(searchObject);
        searchRequest.setKvObj("logS", false);
        searchRequest.setMobile(true);
        String question = appRequest.getQuestion();
        String catId = appRequest.getCatId();
        if(org.apache.commons.lang.StringUtils.isNotBlank(question)){
            searchRequest.setOriginModule(OriginModule.ENSearch);
        }else if(org.apache.commons.lang.StringUtils.isNotBlank(catId)){
            searchRequest.setOriginModule(OriginModule.ENCATEGORY);
        }

        SearchResponse searchResponse = searchService.enterpriseHandle(searchRequest);
        mobileAdapter.dealResult(searchResponse, appResponse,1);
        return appResponse;
    }

    @Override
    public AppResponse rebateSearch(AppRequest rebateRequest) {
        AppResponse response = new AppResponse();
        RebateRequest searchRequest=new RebateRequest();
        searchRequest.setPageNumber(rebateRequest.getPageNumber());
        searchRequest.setPageSize(rebateRequest.getPageSize());
        searchRequest.setSort(rebateRequest.getSort());
        JSONObject result = searchService.rebateSearchHandle(searchRequest);
        mobileAdapter.dealResult(result, response, 2);
        return response;
    }

    @Override
    public AppResponse distributeSearch(AppRequest appRequest) {
        requireNonNullOrStr(appRequest.getmShopId(),"param is not null!");
        requireOnlyOne(appRequest.getCatId(), appRequest.getQuestion(),appRequest.getShopId(),  "params is at least one!");

        AppResponse appResponse=new AppResponse();

        DistributionRequest distributionRequest = new DistributionRequest();
        distributionRequest.setReqId(appRequest.getReqId());

        String xpopShopId = appRequest.getShopId();//xpopShopId

        if(StringUtils.isNotBlank(xpopShopId)){
            distributionRequest.setXpopShopId(Long.parseLong(xpopShopId));
        }
        String mShopId = appRequest.getmShopId();
        if(StringUtils.isNotBlank(mShopId)){
            distributionRequest.setShopId(Long.parseLong(appRequest.getmShopId()));//美店id
        }

        String sort = appRequest.getSort();
        JSONObject sortInfo = getSortInfo(sort);
        distributionRequest.setOrder(Integer.parseInt(sortInfo.getString("order")));
        distributionRequest.setOrderType(Integer.parseInt(sortInfo.getString("type")));

        distributionRequest.setSearchWord(appRequest.getQuestion());
        distributionRequest.setCategoryId(appRequest.getCatId());
        distributionRequest.setPageNum(appRequest.getPageNumber());
        distributionRequest.setPageSize(appRequest.getPageSize());
        distributionRequest.setAddressId(appRequest.getRegionId());
        distributionRequest.setFacetIds(appRequest.getFacets());

        int stock = appRequest.getInstock();
        //0代表只搜索无货、1只搜索有货、3搜所有的
        switch (stock){
            case 0:
                distributionRequest.setInstock(3);
                break;
            case 1:distributionRequest.setInstock(1);
                break;
        }

        //价格区间筛选
        String price = appRequest.getPrice();
        if(appRequest.getPriceTag()==1 && StringUtils.isNotBlank(price)){
            String[] priceArr = price.split("x");
            if(priceArr.length > 0){
                distributionRequest.setMinPrice(Integer.parseInt(priceArr[0])*100);
                if(!StringUtils.equals("*", priceArr[1])){
                    distributionRequest.setMaxPrice(Integer.parseInt(priceArr[1])*100);
                }
            }
        }
        int market = appRequest.getMarket();
        switch (market){
            case 20:
                distributionRequest.setMarket(13);
                break;
            case 21:
                distributionRequest.setMarket(11);
                break;
        }

        distributionRequest.setRebate(appRequest.getSale().equals("100") ? true : false);
        distributionRequest.setTrId(appRequest.getTrId());
        distributionRequest.setOrgId(appRequest.getOrgId());
        distributionRequest.setProductTag(appRequest.getProductTag());
        SearchResult searchResult=searchService.searchDistributionItem(distributionRequest);
        mobileAdapter.dealResult(searchResult, appResponse, 3);
        if(appRequest != null){
            JSONObject pageBar =  appResponse.getContent().getPageBar();
            pageBar.put("pageNumber",appRequest.getPageNumber());
            pageBar.put("pageSize",appRequest.getPageSize());
        }
        return appResponse;
    }

    @Override
    public AppResponse myShopSearch(AppRequest appRequest) {
        AppResponse response = new AppResponse();
        requireNonNullOrStr(appRequest.getmShopId()+"", "shopId is not null!");
        MShopRequest mShopRequest = new MShopRequest();
        mShopRequest.setReqId(appRequest.getReqId());
        String question = appRequest.getQuestion();
        mShopRequest.setKeyword(question);
        String sort = appRequest.getSort();
        if(StringUtils.isNotBlank(sort)){
            JSONObject sortInfo = getSortInfo(sort);
            mShopRequest.setSort(sortInfo.getString("order").equals("33") ? "3" : sortInfo.getString("order"));
            mShopRequest.setOrder(sortInfo.getString("type"));
        }
        mShopRequest.setFacetIds(appRequest.getFacets());
        mShopRequest.setPageNum(appRequest.getPageNumber());
        mShopRequest.setPageSize(appRequest.getPageSize());
        mShopRequest.setShopId(Integer.parseInt(appRequest.getmShopId()));//分销店铺id
        mShopRequest.setTrId(appRequest.getTrId());
        mShopRequest.setOrgId(appRequest.getOrgId());
        List<String> catIds = new ArrayList<>();
        if(StringUtils.isNotBlank(appRequest.getCatId())){
            catIds.add(appRequest.getCatId());
            mShopRequest.setCategories(catIds);
        }
        mShopRequest.setAddressId(appRequest.getRegionId());
        SearchResult searchResult = searchService.searchItemInMShop(mShopRequest);
        mobileAdapter.dealResult(searchResult,response, 3);
        return response;
    }

    @Override
    public AppResponse shopHomeSearch(AppRequest appRequest) {
        AppResponse response = new AppResponse();
        requireNonNullOrStr(appRequest.getmShopId(), appRequest.getCategories(), appRequest.getPageSize(), "shopId and catId and pageSize must exist all!");
        MShopRequest mShopRequest = new MShopRequest();
        mShopRequest.setReqId(appRequest.getReqId());
        String mShopId = appRequest.getmShopId();
        mShopRequest.setShopId(Integer.parseInt(mShopId));
        List<String> categories = appRequest.getCategories();
        mShopRequest.setCategories(categories);
        String orgId = appRequest.getOrgId();
        mShopRequest.setOrgId(orgId);
        mShopRequest.setPageSize(appRequest.getPageSize());
        MultiSearchResult searchResult =searchService.homeViewMshop(mShopRequest);
        mobileAdapter.dealResult(searchResult,response,5);
        return response;
    }

    @Override
    public AppResponse distributeAllSearch(AppRequest appRequest) {
        AppResponse response = new AppResponse();
        BaseRequest baseRequest = new BaseRequest();
        baseRequest.setReqId(appRequest.getReqId());
        baseRequest.setSearchWord(appRequest.getQuestion());
        baseRequest.setPageSize(appRequest.getPageSize());
        baseRequest.setPageNum(appRequest.getPageNumber());
        ProductResult productResult =searchService.searchDistributionAll(baseRequest);
        mobileAdapter.dealResult(productResult,response, 4);
        return response;
    }

    /**
     * 排序
     * @param sort
     * @return
     */
    private JSONObject getSortInfo(String sort){

        JSONObject sortObj = new JSONObject();

        switch (sort){
            case "00":
                sortObj.put("order","0");
                sortObj.put("type","1");
                break;
            case "10":
                sortObj.put("order","1");//销量
                sortObj.put("type","1");//desc
                break;
            case "11":
                sortObj.put("order","1");//销量
                sortObj.put("type","0");//asc
                break;
            case "20":
                sortObj.put("order","2");//价格
                sortObj.put("type","1");//desc
                break;
            case "21":
                sortObj.put("order","2");//价格
                sortObj.put("type","0");//asc
                break;
            case "30"://分销开始时间 desc
                sortObj.put("order","33");//价格
                sortObj.put("type","1");//asc
                break;
            case "80":
                sortObj.put("order","4");//总销量（已下单）
                sortObj.put("type","1");//desc
                break;
            case "81":
                sortObj.put("order","4");//总销量（已下单）
                sortObj.put("type","0");//asc
                break;
            case "40":
                sortObj.put("order","3");////佣金
                sortObj.put("type","1");//desc
                break;
            case "82":
                sortObj.put("order","3");////佣金
                sortObj.put("type","0");//asc
                break;
            case "83"://分销开始时间　asc
                sortObj.put("order", "33");
                sortObj.put("type", "0");
                break;
        }

        return sortObj;
    }

    @Override
    public String test(String data) {
        return data;
    }


}
