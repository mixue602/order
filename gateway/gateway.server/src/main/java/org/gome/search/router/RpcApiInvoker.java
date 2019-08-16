package org.gome.search.router;

import com.alibaba.fastjson.JSONObject;
import io.totem.invoker.Invocation;
import org.gome.search.domain.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.t3.service.search.invoker.PageApiInvoker;
import org.t6.service.entity.*;
import org.t6.service.search.invoker.SearchApiInvoker;

/**
 * Created by doujintong on 17-10-25.
 */
@Service
public class RpcApiInvoker {


    @Autowired
    private RpcInvokerFactory invokerFactory;


    private PageApiInvoker pageApi(SearchRequest request){
        String key="";
        if(request!=null){
            int rank=request.getInt("rank",2);
            key=rank!=2?String.valueOf(rank):request.getCookieId();
        }
        return invokerFactory.pageApi(key);
    }

    private SearchApiInvoker searchApi(String key){
        return invokerFactory.searchApi(key);
    }

    public final Invocation<SearchResponse> categoryPage(SearchRequest req) {
        return pageApi(req).categoryPage(req);
    }

    public final Invocation<SearchResponse> searchPage(SearchRequest req) {
        return pageApi(req).searchPage(req);
    }

    public final Invocation<SearchResponse> shopPage(ShopRequest req) {
        return pageApi(req).shopPage(req);
    }

    public final Invocation<SearchResponse> appClientPage(SearchRequest req) {
        return pageApi(req).appClientPage(req);
    }

    public final Invocation<SearchResponse> getAsynProduct(SearchRequest req) {
        return pageApi(req).getAsynProduct(req);
    }

    public final Invocation<SearchResponse> getBlueProduct(BlueRequest req) {
        return pageApi(req).getBlueProduct(req);
    }

    public final Invocation<SearchResponse> getCartProduct(CartRequest req) {
        return pageApi(req).getCartProduct(req);
    }

    public final Invocation<SearchResponse> dealUserAction(JSONObject req) {
        return pageApi(null).dealUserAction(req);
    }

    public final Invocation<SearchResponse> getCompareProduct(int type, String id, String regionId) {
        return pageApi(null).getCompareProduct(type, id, regionId);
    }

    public final Invocation<SearchResponse> callBackComment(String productId, int pls) {
        return pageApi(null).callBackComment(productId, pls);
    }

    public final Invocation<SearchResponse> tuanSearch(TuanSearch req) {
        return pageApi(null).tuanSearch(req);
    }

    public final Invocation<SearchResponse> mallHandle(JSONObject req) {
        return pageApi(null).mallHandle(req);
    }

    public final Invocation<SearchResponse> recommendProduct(JSONObject req) {
        return pageApi(null).recommendProduct(req);
    }

    public final Invocation<SearchResponse> getHotRecommend(String catId, String regionId) {
        return pageApi(null).getHotRecommend(catId, regionId);
    }

    public final Invocation<SearchResponse> getCategory(JSONObject req) {
        return pageApi(null).getCategory(req);
    }

    public final Invocation<SearchResponse> suggest(SuggestRequest req) {
        return pageApi(null).suggest(req);
    }

    public final Invocation<SearchResponse> relationSearch(String question) {
        return pageApi(null).relationSearch(question);
    }

    public final Invocation<SearchResponse> defaultMethod(SearchRequest req) {
        return pageApi(req).defaultMethod(req);
    }

    public final Invocation<SearchResponse> callFacetsValue(FacetsRequest facetsRequest) {
        return pageApi(null).callFacetsValue(facetsRequest);
    }

    public final Invocation<SearchResponse> rebatePage(RebateRequest req) {
        return pageApi(req).rebatePage(req);
    }

    public final Invocation<SearchResponse> taogouPage(JSONObject req) {
        return pageApi(null).taogouPage(req);
    }

    public final Invocation<SearchResponse> enterprisePage(SearchRequest req) {
        return pageApi(req).enterprisePage(req);
    }

    public final Invocation<SearchResult> searchDistributionItem(DistributionRequest req) {
        return searchApi(String.valueOf(req.getShopId())).searchDistributionItem(req);
    }

    public final Invocation<SearchResult> searchItemInMShop(MShopRequest req) {
        return searchApi(String.valueOf(req.getShopId())).searchItemInMShop(req);
    }


    public final Invocation<MultiSearchResult> searchDefaultInMShop(MShopRequest req) {
        return searchApi(String.valueOf(req.getShopId())).searchDefaultInMShop(req);
    }

    public final Invocation<ProductResult> searchDistributionAll(org.t6.service.entity.BaseRequest req) {
        return searchApi(null).searchDistributionAll(req);
    }

    public final Invocation<SearchResponse> taoSearch(TaoSearchRequest req) {
        return pageApi(req).taoSearch(req);
    }

}
