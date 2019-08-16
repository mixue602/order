package org.gome.search.service;

import com.alibaba.fastjson.JSONObject;
import io.dubbo.springboot.DubboProvider;
import org.apache.commons.lang.StringUtils;
import org.gome.search.domain.*;
import org.gome.search.dubbo.domain.AppContent;
import org.gome.search.dubbo.domain.AppRequest;
import org.gome.search.dubbo.domain.AppResponse;
import org.gome.search.dubbo.idl.DubboService;
import org.gome.search.handler.SearchRequestBuilder;
import org.gome.search.utils.GUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import static org.gome.search.utils.CommonUtils.requireOnlyOne;

/**
 * Created by doujintong on 17-3-13.
 */
@DubboProvider(version = "1.0.0",timeout = 5000,retries = 3 ,monitor = "monitorConfig")
public class DubboServiceImpl implements DubboService {

    private Logger logger = LoggerFactory.getLogger(DubboServiceImpl.class);

    @Autowired
    private SearchService searchService;

    @Autowired
    private GUID guid;

    @Override
    public JSONObject rebateSearch(JSONObject rebateRequest) {
        return searchService.rebateSearchHandle(JSONObject.toJavaObject(rebateRequest,RebateRequest.class));
    }

    @Override
    public JSONObject productSearch(JSONObject productRequest) {
        SearchRequest request=JSONObject.toJavaObject(productRequest, SearchRequest.class);
        request.setOriginModule(OriginModule.SEARCH);
        request.setKvObj("pzin", "v3");
        request.setMarket(10);
        request.setKvObj("rebatePrice",productRequest.get("rebatePrice"));
        return (JSONObject)JSONObject.toJSON(searchService.productHandle(SearchRequestBuilder.build(null,request)));
    }

    public JSONObject taoSearch(JSONObject taoSearchParam){

        requireOnlyOne(taoSearchParam.getString("catId"), taoSearchParam.getString("question"), "params is at least one!");

        TaoSearchRequest taoSearchRequest = new TaoSearchRequest();
        taoSearchRequest.setCatId(taoSearchParam.getString("catId"));
        taoSearchRequest.setQuestion(taoSearchParam.getString("question"));
        taoSearchRequest.setPageSize(taoSearchParam.getInteger("pageSize"));
        taoSearchRequest.setPageNumber(taoSearchParam.getInteger("pageNumber"));
        taoSearchRequest.setFacets(taoSearchParam.getString("facets"));

        String regionId = taoSearchParam.getString("regionId");
        if(StringUtils.isBlank(regionId)){
            regionId = "11010000";
        }
        taoSearchRequest.setRegionId(regionId);

        SearchResponse searchResponse = searchService.taoSearchHandle(taoSearchRequest);
        JSONObject result = new JSONObject();
        result.put("content",searchResponse.getContent());
        result.put("status",searchResponse.getHeader().getIntValue("status"));
        return result;
    }

    @Override
    public AppResponse groupSearch(AppRequest appRequest) {

        requireOnlyOne(appRequest.getQuestion(), appRequest.getTuanCatId(), "params is at least one!");

        //参数适配　11个
        TuanSearch tuanSearch = new TuanSearch();
        tuanSearch.setQuestion(appRequest.getQuestion());
        tuanSearch.setBeginTime(appRequest.getBeginTime());
        tuanSearch.setTuanCatId(appRequest.getTuanCatId());
        tuanSearch.setProductTag(appRequest.getProductTag());
        tuanSearch.setSale(appRequest.getSale());//只搜团只搜抢
        tuanSearch.setPageNumber(appRequest.getPageNumber());
        tuanSearch.setPageSize(appRequest.getPageSize());
        tuanSearch.setUserId(appRequest.getUserId());
        tuanSearch.setCookieId(appRequest.getCookieId());
        String regionId = appRequest.getRegionId();
        if(StringUtils.isBlank(regionId)){
            regionId = "11010000";
        }
        tuanSearch.setRegionId(regionId);
        tuanSearch.setSort(appRequest.getSort());
        tuanSearch.setOriginModule(OriginModule.TUAN);

        //结果适配
        SearchResponse resultR = searchService.tuanSearchHandle(tuanSearch);
        AppResponse appResponse = new AppResponse();
        ResultContent resultContent=(ResultContent)resultR.getContent();
        AppContent content = appResponse.getContent();
        content.setProdInfo(resultContent.getProdInfo().getJSONArray("products"));
        JSONObject pageBar = resultContent.getPageBar();
        pageBar.remove("totalPage");
        pageBar.remove("pageSize");
        pageBar.remove("pageNumber");
        content.setPageBar(resultContent.getPageBar());
        appResponse.setStatus(resultR.getHeader().getIntValue("status"));
        return appResponse;
    }

    @Override
    public String test(String data) {
        return data;
    }


}
