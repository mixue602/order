package org.gome.search.controller;

import com.alibaba.fastjson.JSONObject;
import com.google.common.collect.Maps;
import io.totem.json.Json;
import org.gome.search.domain.RebateRequest;
import org.gome.search.dubbo.domain.AppContent;
import org.gome.search.dubbo.domain.AppRequest;
import org.gome.search.dubbo.domain.AppResponse;
import org.gome.search.dubbo.idl.AppService;
import org.gome.search.dubbo.idl.DubboService;
import org.gome.search.service.SearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.t6.service.entity.*;

import javax.servlet.http.HttpServletRequest;

import java.util.HashMap;
import java.util.Map;

import static org.gome.search.utils.CommonUtils.requireNonNullOrStr;

/**
 * Created by wzm on 17-1-16.
 */

@org.springframework.web.bind.annotation.RestController
public class MxController {

    @Autowired
    private SearchService searchService;

    @Autowired(required = false)
    private AppService  appService;

    @Autowired(required = false)
    private DubboService dubboService;

    /**
     * 分销列表搜索
     * @param distributionRequest
     * @return
     */
    @RequestMapping(value = {"/p/searchDistributionItems"},method = { RequestMethod.GET })
    @ResponseBody
    public SearchResult searchDistributionItem(DistributionRequest distributionRequest,HttpServletRequest request){
        distributionRequest.setReqId(request.getAttribute("reqId").toString());
        return searchService.searchDistributionItem(distributionRequest);
    }

    /**
     * 美店商品搜索
     * @param mShopRequest
     * @return
     */
    @RequestMapping(value = {"/p/searchItemsInMshop"},method = { RequestMethod.GET })
    @ResponseBody
    public SearchResult searchItemInMShop(MShopRequest mShopRequest,HttpServletRequest request){
        mShopRequest.setReqId(request.getAttribute("reqId").toString());
        requireNonNullOrStr(mShopRequest.getShopId()+"", "shopId is not null!");
        return searchService.searchItemInMShop(mShopRequest);
    }

    /**
     * 美店首页展示已选分类商品
     * @param mShopRequest
     * @return
     */
    @RequestMapping(value = {"/p/mShopHomePage"},method = { RequestMethod.GET })
    @ResponseBody
    public MultiSearchResult homeViewMshop(MShopRequest mShopRequest, HttpServletRequest request){
        mShopRequest.setReqId(request.getAttribute("reqId").toString());
        requireNonNullOrStr(mShopRequest.getShopId(), mShopRequest.getCategories(), mShopRequest.getPageSize(), "shopId and catId and pageSize must exist all!");
        return searchService.homeViewMshop(mShopRequest);
    }


    @RequestMapping(value={"/p/rebate/{pageSize:[1-4][0-8]|[1-9]}/{pageNumber:100|[0-9]{2}|[1-9]}/{sort:[1-2|5|4][0|1]|0}"},method = { RequestMethod.GET })
    @ResponseBody
    public Object rebateSearch(RebateRequest rebateRequest){
        return  searchService.rebateSearchHandle(rebateRequest);
    }


    @RequestMapping(value = {"/p/searchDistributionAll"},method = { RequestMethod.GET })
    @ResponseBody
    public ProductResult searchDistributionAll(BaseRequest distributionBaseRequest,HttpServletRequest request){
        distributionBaseRequest.setReqId(request.getAttribute("reqId").toString());
        return searchService.searchDistributionAll(distributionBaseRequest);
    }


    @RequestMapping(value = {"/p/mobile/{type}/{rank}"},method = { RequestMethod.GET })
    @ResponseBody
    public Object mobile(AppRequest appRequest,@PathVariable int type,@PathVariable int rank){
        Map header = Maps.newHashMap();
        header.putIfAbsent("rank",rank);
        appRequest.setHeaders(header);
        switch (type){
            case 1:return appService.mainSearch(appRequest);
            case 2:return appService.distributeSearch(appRequest);
            case 3:return appService.myShopSearch(appRequest);
            case 4:return appService.shopHomeSearch(appRequest);
            case 5:return appService.enterpriseSearch(appRequest);
            case 6:return dubboService.taoSearch((JSONObject)Json.toJson(appRequest));
            case 7: return dubboService.groupSearch(appRequest);

        }
        return new AppResponse();
    }


}

