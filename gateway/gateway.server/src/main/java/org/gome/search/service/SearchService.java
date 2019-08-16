package org.gome.search.service;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import org.gome.search.domain.*;
import org.t6.service.entity.BaseRequest;
import org.t6.service.entity.*;

import javax.servlet.http.HttpServletRequest;

/**
 * Created by doujintong on 16-9-8.
 */
public interface SearchService {
    public SearchResponse categoryHandle(SearchRequest searchRequest);
    public SearchResponse searchHandle(SearchRequest searchRequest);
    public SearchResponse appHandle(SearchRequest searchRequest);
    public SearchResponse testHandle(SearchRequest searchRequest);
    public SearchResponse brandHandle(SearchRequest searchRequest);
    public SearchResponse shopHandle(ShopRequest searchRequest);
    public SearchResponse blueHandle(BlueRequest searchRequest);
    public SearchResponse cartHandle(CartRequest searchRequest);
    public SearchResponse suggestHandle(SuggestRequest suggestRequest);
    public SearchResponse relevanceHandle(String question);
    public SearchResponse smartBuyHandle(SmartBuyRequest smartBuyRequest);
    public SearchResponse recommendHandle(JSONObject req);
    public SearchResponse hotRecommendHandle(String catId, String regionId);
    public SearchResponse categoryDataHandle(JSONObject req);
    public SearchResponse mallHandle(JSONObject req);
    public SearchResponse tuanSearchHandle(TuanSearch tuanSearch);
    public SearchResponse callBackCommentHandle(String productId, int pls);
    public SearchResponse callFacetsHandle(FacetsRequest facetsRequest);
    public SearchResponse infSiteMapHandle(FacetsRequest facetsRequest);
    public SearchResponse compareProductHandle(int type, String id, String regionId);
    public SearchResponse dealUserActionHandle(JSONObject req);
    public SearchResponse productHandle(SearchRequest req);
    public SearchResponse topKeyHandle(HttpServletRequest req, String catId, String userId);
    public JSONObject rebateSearchHandle(RebateRequest rebateRequest);
    public SearchResult searchItemInMShop(MShopRequest mShopRequest);
    public SearchResult searchDistributionItem(DistributionRequest distributionRequest);
    public ProductResult searchDistributionAll(BaseRequest distributionBaseRequest);
    public MultiSearchResult homeViewMshop(MShopRequest mShopCatRequest);
    public SearchResponse taoGouHandle(JSONObject req);
    public JSONObject contrast(int pageNumber, int pageSize, String time);
    public SearchResponse enterpriseHandle(SearchRequest searchRequest);
    public SearchResponse taoSearchHandle(TaoSearchRequest taoSearch);
    public JSONObject searchDetailHandle (JSONArray skuId);
}
