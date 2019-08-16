package org.gome.search.handler;

import org.apache.commons.lang3.StringUtils;
import org.gome.search.domain.*;
import org.gome.search.utils.CommonUtils;

import javax.servlet.http.HttpServletRequest;

import static org.gome.search.module.KeyModule.MARKETPAGE;
import static org.gome.search.utils.CommonUtils.requireOnlyOne;
/**
 * Created by doujintong on 16-9-5.
 */
public class SearchRequestBuilder {

    public static SearchRequest build(HttpServletRequest request,SearchRequest searchRequest){
        if(!searchRequest.isMobile()){
            if(searchRequest.isXSearch()){
                searchRequest.setOriginModule(OriginModule.SEARCH);
                if(!(searchRequest instanceof ShopRequest))requireOnlyOne(searchRequest.getQuestion(),searchRequest.getBrandId(),"catId or question or facets");
            }else{
                searchRequest.setOriginModule(OriginModule.CATEGORY);
                requireOnlyOne(searchRequest.getCatId(),"catId or question or facets");
            }
        } else if(searchRequest.getOriginModule() == null){
            String shopId = searchRequest.getString("shopId","");
            String catId = searchRequest.getCatId();
            if(StringUtils.isNotBlank(shopId) && !StringUtils.equals("0", shopId)){
                searchRequest.setOriginModule(OriginModule.SHOP);
            }else if(StringUtils.isNotBlank(catId)){
                searchRequest.setOriginModule(OriginModule.CATEGORY);
                requireOnlyOne(searchRequest.getCatId(),"catId or question or facets");
            }else{
                searchRequest.setOriginModule(OriginModule.SEARCH);
                requireOnlyOne(searchRequest.getQuestion(),"catId or question or facets");
            }
        }
        if(request==null)
            return searchRequest;
        setCookies(request,searchRequest);
        build0(request,searchRequest);
        return searchRequest;
    }

    public static void from(HttpServletRequest request,BaseRequest searchRequest){
        searchRequest.setKvObj("from", request.getAttribute("from"));
        searchRequest.setIp(CommonUtils.getRemoteIP(request));
    }

    private static void setCookies(HttpServletRequest request,SearchRequest searchRequest){
        searchRequest.setRegionId(CommonUtils.getRegionId(request));
        searchRequest.setUserId(CommonUtils.getUserId(request));
        searchRequest.setCookieId(CommonUtils.getCookieId(request));
    }


    public static CartRequest build(HttpServletRequest request,CartRequest cartRequest){
        cartRequest.setOriginModule(OriginModule.COUDAN);
        setCookies(request,cartRequest);
        requireOnlyOne(cartRequest.getShoppingCartActivityId(),  "params is at least one!");
        build0(request,cartRequest);
        return cartRequest;
    }

    public static BlueRequest build(HttpServletRequest request,BlueRequest blueRequest){
        blueRequest.setOriginModule(OriginModule.BLUE);
        setCookies(request,blueRequest);
        requireOnlyOne(blueRequest.getBlueActivityId(),  "params is at least one!");
        build0(request,blueRequest);
        return blueRequest;
    }

    private static void build0(HttpServletRequest request,SearchRequest searchRequest){
        String aCnt = request.getParameter("aCnt");
        if(StringUtils.isNotBlank(aCnt)){
            searchRequest.setKvObj("aCnt", Integer.parseInt(aCnt));
        }
        String deliv = request.getParameter("deliv");
        if(StringUtils.isNotBlank(deliv))
        {
            searchRequest.setProductTag(Integer.parseInt(deliv));
        }
        if(searchRequest.getMarket() == 0){
            if(searchRequest.isMobile()){
                searchRequest.setMarket(20);
            }else{
                searchRequest.setMarket(10);
            }
        }
        from(request, searchRequest);
        Object id=request.getAttribute("reqId");
        searchRequest.setKvObj("reqId",id==null? "apject null":id.toString());
        searchRequest.setKvObj(MARKETPAGE.toString(), StringUtils.defaultString(request.getParameter(MARKETPAGE.toString()),"0"));
        searchRequest.setKvObj("dsl",Integer.parseInt(StringUtils.defaultString(request.getParameter("dsl"),"0")));
        searchRequest.setKvObj("rank",Integer.parseInt(StringUtils.defaultString(request.getParameter("rank"),"2")));
        searchRequest.setKvObj("source","PC");
    }

}
