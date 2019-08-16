package org.gome.search.service;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.gome.mobile.common.business.imgsizeadapt2.service.impl.ImgeSizeAdaptServiceImpl2;
import com.mongodb.BasicDBList;
import com.mongodb.BasicDBObject;
import org.apache.commons.lang3.StringUtils;
import org.gome.search.cache.MemoryCacheBean;
import org.gome.search.domain.*;
import org.gome.search.handler.*;
import org.gome.search.router.RpcApiInvoker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.t6.service.entity.BaseRequest;
import org.t6.service.entity.*;

import javax.servlet.http.HttpServletRequest;
import java.util.stream.Stream;

/**
 * Created by doujintong on 16-9-8.
 */
@Service("searchService")
public class SearchServiceImpl implements SearchService {

    @Autowired
    private SmartBuyHandler smartBuyHandler;

    @Autowired
    private TopKeyHandler topKeyHandler;

    @Autowired
    private InvokerHandler invokerHandler;

    @Autowired
    private RebateHandler rebateHandler;

    @Autowired
    private MobileAdapter mobileAdapter;

    @Autowired
    private MemoryCacheBean memoryCacheBean;

    @Autowired
    private ContrastHandler contrastHandler;

    @Autowired
    private RpcApiInvoker apiInvoker;

    @Autowired
    private  SearchDetailHandler searchDetailHandler;

    public static ImgeSizeAdaptServiceImpl2 imgeSizeAdaptService2 =ImgeSizeAdaptServiceImpl2.getInstance();

    @Override
    public SearchResponse categoryHandle(SearchRequest searchRequest) {
        searchRequest.setXSearch(false);
        searchRequest.setPageSize(48);
        SortModule sort = searchRequest.getSort();
        if((sort==null || StringUtils.equals("00", sort.getOrigin())) && searchRequest.getInstock()!=0){
            searchRequest.setKvObj("catDefStock",true);
            searchRequest.setInstock(1);
        }
        SearchResponse searchResponse=(SearchResponse)invokerHandler.response(apiInvoker.categoryPage(searchRequest), searchRequest, 3);
        JSONObject seoData=((ResultContent)searchResponse.getContent()).getSeoData();
        Object sortNo=seoData.get("sortNo");
        if(sortNo instanceof String)
            seoData.put("sortNo",Integer.parseInt(sortNo.toString()));
        return searchResponse;
    }

    @Override
    //@Transaction(TranType.LOCAL_SERVICE)
    public SearchResponse searchHandle(SearchRequest searchRequest) {
        searchRequest.setXSearch(true);
        searchRequest.setPageSize(48);
        SortModule sort = searchRequest.getSort();
        if(sort!=null && !StringUtils.equals("00", sort.getOrigin())){
            searchRequest.setKvObj("catDefStock",true);
            searchRequest.setInstock(1);
        }
        String[] noResultWord = memoryCacheBean.getKeyFilterMap().getOrDefault("noResult", "-1").split(",");
        if(noResultWord!=null && Stream.of(noResultWord).filter(p->searchRequest.getQuestion().contains(p)).findFirst().isPresent()){
            SearchResponse searchResponse=SearchResponse.build();
            JSONObject pageBar=new JSONObject();
            pageBar.put("totalCount",0);
            pageBar.put("totalPage",0);
            JSONObject selectData=new JSONObject();
            selectData.put("keywords",searchRequest.getQuestion());
            selectData.put("isSearch", true);
            ((ResultContent) searchResponse.getContent()).setPageBar(pageBar);
            ((ResultContent) searchResponse.getContent()).setSelectData(selectData);
            ((ResultContent) searchResponse.getContent()).setSeoData(new JSONObject());
            JSONObject level=new JSONObject();
            level.put("searchLevel",5);
            ((ResultContent) searchResponse.getContent()).setCommonInfo(level);
            return searchResponse;
        }
        return (SearchResponse)invokerHandler.response(apiInvoker.searchPage(searchRequest), searchRequest, 3);
    }

    @Override
    public SearchResponse appHandle(SearchRequest searchRequest) {

        return (SearchResponse)invokerHandler.response(apiInvoker.appClientPage(searchRequest), searchRequest, 3);
    }

    @Override
    public SearchResponse testHandle(SearchRequest searchRequest){
        SearchResponse response = (SearchResponse)invokerHandler.response(apiInvoker.defaultMethod(searchRequest), searchRequest, 3);
        return response;
    }

    @Override
    public SearchResponse shopHandle(ShopRequest searchRequest) {
        searchRequest.setOriginModule(OriginModule.SHOP);
        return (SearchResponse)invokerHandler.response(apiInvoker.shopPage(searchRequest), searchRequest, 3);
    }

    @Override
    public SearchResponse brandHandle(SearchRequest searchRequest) {
        searchRequest.setPageSize(48);
        if ("0".equals(searchRequest.getCatId())){
            searchRequest.setCatId(null);
        }
        return (SearchResponse)invokerHandler.response(apiInvoker.searchPage(searchRequest), searchRequest, 3);
    }

    @Override
    public SearchResponse suggestHandle(SuggestRequest suggestRequest) {
        return (SearchResponse)invokerHandler.response(apiInvoker.suggest(suggestRequest), null, 3);
    }
    @Override
    public SearchResponse relevanceHandle(String question) {
        return (SearchResponse)invokerHandler.response(apiInvoker.relationSearch(question), null, 3);

    }
    @Override
    public SearchResponse smartBuyHandle(SmartBuyRequest smartBuyRequest) {
        return SearchResponse.build().setContent(smartBuyHandler.handler(smartBuyRequest));
    }

    @Override
    public SearchResponse categoryDataHandle(JSONObject req){
        return (SearchResponse)invokerHandler.response(apiInvoker.getCategory(req), null, 3);
    }

    @Override
    public SearchResponse recommendHandle(JSONObject req){
        return (SearchResponse)invokerHandler.response(apiInvoker.recommendProduct(req), null, 3);
    }

    @Override
    public SearchResponse hotRecommendHandle(String catId,String regionId){
        return (SearchResponse)invokerHandler.response(apiInvoker.getHotRecommend(catId, regionId), null, 3);
    }

    @Override
    public SearchResponse tuanSearchHandle(TuanSearch tuanSearch){
        return (SearchResponse)invokerHandler.response(apiInvoker.tuanSearch(tuanSearch), null, 3);
    }


    @Override
    public SearchResponse mallHandle(JSONObject req){
      SearchResponse searchResponse=(SearchResponse)invokerHandler.response(apiInvoker.mallHandle(req), null, 3);
      JSONObject shopTemp=(JSONObject)searchResponse.getContent();
        if (shopTemp != null) {
            BasicDBList shopList = (BasicDBList) shopTemp.get("shopList");
            if (shopList != null) {
                for (Object shop : shopList) {
                    String icon = imgeSizeAdaptService2.refitImageProtocolByUserAgent(req.getString("userAgent"), ((BasicDBObject) shop).get("icon").toString());
                    ((BasicDBObject) shop).append("icon", icon);
                }
            }

        }
        return searchResponse;
    }

    @Override
    public SearchResponse callBackCommentHandle(String productId,int pls){
        return (SearchResponse)invokerHandler.response(apiInvoker.callBackComment(productId, pls), null, 3);
    }

    @Override
    public SearchResponse callFacetsHandle(FacetsRequest facetsRequest){
        return (SearchResponse)invokerHandler.response(apiInvoker.callFacetsValue(facetsRequest), null, 3);
    }

    @Override
    public SearchResponse infSiteMapHandle(FacetsRequest facetsRequest){
        facetsRequest.setType(1);
        return (SearchResponse)invokerHandler.response(apiInvoker.callFacetsValue(facetsRequest), null, 3);
    }

    @Override
    public SearchResponse dealUserActionHandle(JSONObject req){
      return (SearchResponse)invokerHandler.response(apiInvoker.dealUserAction(req), null, 3);
}
    @Override
    public SearchResponse compareProductHandle(int type, String id, String regionId)
    {
        return (SearchResponse)invokerHandler.response(apiInvoker.getCompareProduct(type, id, regionId), null, 3);
    }

    @Override
    public SearchResponse productHandle(SearchRequest searchRequest)
    {
        if(searchRequest.getMarket()==12){
            searchRequest.setKvObj("wxf",1);
        }
        return (SearchResponse)invokerHandler.response(apiInvoker.getAsynProduct(searchRequest), searchRequest, 3);
    }

    @Override
    public SearchResponse cartHandle(CartRequest searchRequest)
    {
        searchRequest.setKvObj("isCartOrBule",true);
        return (SearchResponse)invokerHandler.response(apiInvoker.getCartProduct(searchRequest), searchRequest, 3);
    }

    @Override
    public SearchResponse blueHandle(BlueRequest searchRequest)
    {
        searchRequest.setKvObj("isCartOrBule",true);
        return (SearchResponse)invokerHandler.response(apiInvoker.getBlueProduct(searchRequest), searchRequest, 3);
    }

    @Override
    public SearchResponse topKeyHandle(HttpServletRequest req, String catId, String userId){
        return SearchResponse.build();//.setContent(topKeyHandler.handler(req, catId, userId));
    }

    @Override
    public JSONObject rebateSearchHandle(RebateRequest rebateRequest){
        rebateRequest.setOriginModule(OriginModule.REBATE);
        rebateRequest.setRegionId("11011400");
        SearchResponse response = (SearchResponse)invokerHandler.response(apiInvoker.rebatePage(rebateRequest), null, 3);
        return rebateHandler.handler(response);
    }


    @Override
    public SearchResponse taoGouHandle(JSONObject req){
        SearchResponse response = (SearchResponse)invokerHandler.response(apiInvoker.taogouPage(req), null, 3);
        return response;
    }

    @Override
    public SearchResult searchItemInMShop(MShopRequest mShopRequest)
    {
        return (SearchResult) invokerHandler.response(apiInvoker.searchItemInMShop(mShopRequest), null, 6);
    }

    @Override
    public SearchResult searchDistributionItem(DistributionRequest distributionRequest)
    {
        return (SearchResult) invokerHandler.response(apiInvoker.searchDistributionItem(distributionRequest), null, 6);
    }

    @Override
    public ProductResult searchDistributionAll(BaseRequest distributionBaseRequest)
    {
        return (ProductResult) invokerHandler.response(apiInvoker.searchDistributionAll(distributionBaseRequest), null, 6);
    }

    @Override
    public MultiSearchResult homeViewMshop(MShopRequest mShopRequest)
    {
        return (MultiSearchResult) invokerHandler.response(apiInvoker.searchDefaultInMShop(mShopRequest), null, 6);
    }

    @Override
    public JSONObject contrast(int pageNumber, int pageSize, String time) {
        return contrastHandler.handler(pageNumber, pageSize, time);
    }

    @Override
    public SearchResponse enterpriseHandle(SearchRequest searchRequest)
    {
        if(searchRequest.getMarket()==12){
            searchRequest.setKvObj("wxf",1);
        }
        SearchResponse searchResponse = (SearchResponse)invokerHandler.response(apiInvoker.enterprisePage(searchRequest), searchRequest, 3);
        return searchResponse;
    }

    @Override
    public SearchResponse taoSearchHandle(TaoSearchRequest taoSearch) {
        SearchResponse searchResponse = (SearchResponse)invokerHandler.response(apiInvoker.taoSearch(taoSearch), taoSearch, 3);
        return searchResponse;
    }

    @Override
    public JSONObject searchDetailHandle(JSONArray skuId) {
        return  searchDetailHandler.handler(skuId);
    }
}
