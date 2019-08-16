package org.gome.search.handler;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.mongodb.BasicDBList;
import com.mongodb.BasicDBObject;
import org.apache.commons.lang3.StringUtils;
import org.gome.search.cache.MemoryCacheBean;
import org.gome.search.domain.*;
import org.gome.search.handler.seo.FilterFacet;
import org.gome.search.utils.CommonUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.lang.reflect.Field;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.util.Map;
import java.util.Objects;
import java.util.regex.Pattern;
import java.util.stream.Stream;

/**
 * Created by doujintong on 16-12-14.
 */
@Component
public class BaseHandler
{
    @Autowired
    private MemoryCacheBean memoryCacheBean;

    @Autowired
    private StoreConfiguration storeConfiguration;

    protected Logger logger = LoggerFactory.getLogger(BaseHandler.class);


    public void dealHeader(HttpServletRequest request, SearchResponse response,SearchRequest searchRequest){
        if(response!=null){
            if(storeConfiguration.getmSearchSite().equals("//"+request.getHeader("host"))
                    || storeConfiguration.getMlistSite().equals("//"+request.getHeader("host"))){
                response.getHeader().put("isHwg", 1);
                response.getHeader().put("marketPage",1);
            }
            String param = request.getQueryString();
            boolean isNotContains = true;
            if(StringUtils.isNotEmpty(param) && (param.contains("pzpq") || param.contains("pzin"))){
                isNotContains = false;
            }
            JSONObject header = response.getHeader();
            header.put("isRobot", CommonUtils.isRobotRequest(request.getHeader("user-agent")));
            header.put("refPage", request.getRequestURL().toString().replace("**", ""));
            header.put("isNotContains", isNotContains);
            String url=request.getRequestURI().toString().replace("**","").replaceAll("category/","").replaceAll("pinpai/","");
            Map<String, String[]> params=request.getParameterMap();
            if(params!=null && !params.isEmpty()){
                if(searchRequest.getOriginModule().equals(OriginModule.CATEGORY) || (searchRequest.getOriginModule().equals(OriginModule.SEARCH) && !searchRequest.isMobile() && url.contains("/search"))){
                    String queryStr="";
                    JSONObject brand=(JSONObject)((ResultContent)response.getContent()).getSeoData().get("brandFacet");
                    String facets=StringUtils.join(params.get("facets"),"");
                    for (String key : params.keySet()) {
                        if("intcmp".equals(key))continue;
                        if("facets".equals(key))continue;
                        String value = StringUtils.join(params.get(key),"");
                        String rawquestion=header.getString("rawquestion");
                        if("question".equals(key) && StringUtils.isNotBlank(rawquestion))value=rawquestion;
                        queryStr += key + "=" + value + "&";
                    }
                    url+="?"+queryStr;
                    if(searchRequest.isXSearch()){
                        if(brand!=null){
                            String brandId=brand.getString("id");
                            if(StringUtils.isNotBlank(brandId)){
                                if(facets==null){
                                    facets=brandId;
                                }else{
                                    facets+=brandId;
                                }
                            }
                        }
                        if(facets!=null)url+="facets="+facets;
                    }
                }
            }
            header.put("url",url);
            String intCmp=request.getParameter("intcmp");
            String priceTag=StringUtils.defaultString(request.getParameter("priceTag"), "0");
            String et=request.getParameter("et");
            if( "1".equals(priceTag) || et!=null){
                header.put("cl",10);
                return;
            }
            if(intCmp==null)return;
            String[] strs=intCmp.split("-");
            if(strs.length!=3)return;
            if((strs[2].matches("\\d{2}") && Integer.parseInt(strs[2])>=10)){
                header.put("cl",10);
            }
        }
    }

    public void dealFlowQuilk(HttpServletRequest request, SearchResponse response){
        if(response!=null){
            ResultContent content = (ResultContent)response.getContent();
            String question = request.getParameter("question");
            if(StringUtils.isBlank(question))return;
            boolean isContainsFlow = false;
            String flowValue =memoryCacheBean.getKeyFilterMap().getOrDefault("flow", "");
            JSONObject commonInfo =content.getCommonInfo();
            if(StringUtils.isNotBlank(flowValue) && commonInfo.getIntValue("searchLevel") == 1) {
                isContainsFlow=Stream.of(flowValue.split(",")).filter(item->item.equals(question)).findFirst().isPresent();
            }
            response.getHeader().put("isContainsFlow", isContainsFlow);
        }
    }

    public void dealBanner(HttpServletRequest request, SearchResponse response){
        if(response!=null){
            String question = request.getParameter("question");
            if(StringUtils.isBlank(question))return;
            ResultContent content = (ResultContent) response.getContent();
            BasicDBObject bannerInfo = memoryCacheBean.getBannerInfoMap().get(question);
            if(bannerInfo != null) {
                content.setBanner(new JSONObject(bannerInfo.toMap()));//０：店铺入口　１：图片跳转
            }else{
                if(content.getBanner()!= null){
                    content.getBanner().put("bannerType",2);//品牌banner
                }
            }
        }
    }

    public boolean interceptor(HttpServletRequest req,HttpServletResponse response) throws Exception{
        String from = dealFrom(req);
        String question = req.getParameter("question");
        BasicDBList fromRequest = memoryCacheBean.getFromFilterMap().getOrDefault("fromRequest", new BasicDBList());
        if(StringUtils.isBlank(from)
                || !fromRequest.stream().filter((Object data) ->((BasicDBObject) data).getString("fromWord", "-1").equals(from)&&((BasicDBObject) data).getString("status", "-1").equals("1")).findFirst().isPresent()){
            if(!StringUtils.equals("ip", from)){
                logger.warn("from is null,please verify your request' params ...{}",req.getRequestURL().toString());
                Object result = new BasicDBObject("error","function can't find,please verify your request' params.");
                response.getWriter().write(result.toString());
                return false;
            }
        }
        req.setAttribute("from", from);
        String ip = CommonUtils.getRemoteIP(req);
        BasicDBList ipRequest = memoryCacheBean.getIpFilterMap().get("ipRequest");
        if(ipRequest != null && ipRequest.stream().filter((Object data)->((BasicDBObject)data).getString("ip","-1").equals(ip)).findFirst().isPresent()){
            Object result = new BasicDBObject("error","ip can't find,please verify your request' params.");
            logger.warn("ip:{} is limited ...",ip);
            response.getWriter().write(result.toString());
            return false;
        }
        if (question != null) {
            long count = memoryCacheBean.getIllegalFilterMap().stream().filter(word->Pattern.matches(word, question)).count();
//            if (filterRequest != null && Pattern.matches(filterRequest, question)) {
            if (count>0) {
                Object result = new BasicDBObject("error","request can't find,please verify your request' params.");
                logger.warn("request:{} is limited ... cause:{}", req.getRequestURL().toString(),result);
                response.sendRedirect("/cloud/error");
                return false;
            }
            String returnUrl = memoryCacheBean.getKeyFilterMap().get(question);
            if (returnUrl != null) {
                req.setAttribute("logPosi", "setRdt");
                response.sendRedirect(returnUrl);
                return false;
            }
        }
        return true;
    }

    private String dealFrom(HttpServletRequest req){
        String hostName = req.getHeader("host");
        String from = req.getParameter("from");
        hostName = hostName.toLowerCase();
        if(StringUtils.isBlank(from)){   //正常搜索页面请求
            if(hostName.startsWith("list") || hostName.startsWith("higolist")) from = "category";
            if(hostName.startsWith("search") || hostName.startsWith("higosearch")) from = "search";
            if(hostName.startsWith("brand")) from = "brand";
            if(hostName.startsWith("10") || hostName.startsWith("local")) from = "ip";
            if(CommonUtils.isRobotRequest(req.getHeader("user-agent"))) from = "robot";
        }
        return from;
    }

    public boolean filter301(HttpServletRequest req, HttpServletResponse resp) throws Exception {
        String url=req.getRequestURL().toString().replace("**","");
        String host = req.getHeader("host");
        String query=req.getQueryString();
        if(!url.contains("/category/") && StringUtils.isNotEmpty(query) && query.contains("cmpid=cps") && CommonUtils.isRobotRequest(req.getHeader("user-agent"))){
            String newUrl = "/search?question=" + URLEncoder.encode(req.getParameter("question"), "UTF-8");
            resp.setStatus(301);
            resp.setHeader("Location", newUrl);
            resp.setHeader("Connection", "close");
            logger.info(" -------search cmpid 301 redirectUrl:" + "[" + newUrl + "]"+",origil url["+url+"?"+ URLDecoder.decode(query, "UTF-8")+"]");
            return false;
        }
        String newUrl = "";
        String facetParam = req.getParameter("facets");
        if (host.startsWith("search") && StringUtils.isNotEmpty(facetParam)) {
            if (FilterFacet.isIncludeDelFacet(facetParam)) {
                String queryString = (req.getQueryString() == null ? "" : "?" + req.getQueryString());
                logger.info(" -------search 301 orginalUrl:" + "[" + queryString + "]");
                String nQuery = "";
                String[] qs = queryString.split("&");
                for (int i = 0; i < qs.length; i++) {
                    if (!qs[i].startsWith("sCode") && !qs[i].startsWith("facets")) {
                        nQuery += qs[i] + "&";
                    }
                }
                newUrl = "/search" + nQuery.substring(0, nQuery.length() - 1);
                resp.setStatus(301);
                resp.setHeader("Location", newUrl);
                resp.setHeader("Connection", "close");
                logger.info(" -------search 301 redirectUrl:" + "[" + newUrl + "]");
                return false;
            }

        } else if (host.startsWith("list") && url.contains("-")) {//list
            boolean status = false;
            String paramStr = url.substring(url.lastIndexOf("/") + 1);
            if (StringUtils.isNotEmpty(paramStr)) {
                String[] prams = paramStr.split("-");
                if (prams.length==18) {
                    String key = prams[9];
                    if (StringUtils.isNotEmpty(key)) {
                        if (key.length() > 3 && key.length() % 4 == 0) {
                            for (int m = 0; m < key.length() / 4; m++) {
                                String ki = key.substring(m * 4, m * 4 + 4);
                                if (FilterFacet.isIncludeDelFacet(ki)) {
                                    status = true;
                                }
                            }
                        }
                    }
                }else{
                    logger.warn(" -------list 301 is not correct:" + "[" + url + "]");
                    return false;
                }
            }
            if (status) {
                newUrl = "/" + url.substring(url.lastIndexOf("/") + 1, url.indexOf("-")) + ".html";
                resp.setStatus(301);
                resp.setHeader("Location", newUrl);
                resp.setHeader("Connection", "close");
                logger.info(" -------list 301 redirectUrl:" + "[" + newUrl + "]");
                return false;
            }
        }
        return interceptor(req,resp);
    }

    public void dealDataNodes(SearchResponse response) {
        ResultContent content = (ResultContent) response.getContent();
        JSONObject jsonObject = new JSONObject();
        for (Field field : content.getClass().getDeclaredFields()) {
            try {
                field.setAccessible(true);
                Object data = field.get(content);
                if (data == null) continue;
                if (data instanceof JSONObject && !((JSONObject) data).isEmpty()) {
                    jsonObject.put(field.getName(), data);
                }
                if (data instanceof JSONArray && !((JSONArray) data).isEmpty()) {
                    jsonObject.put(field.getName(), data);
                }
            } catch (IllegalAccessException e) {
                e.printStackTrace();
            }
        }
        response.setContent(jsonObject);
    }
}
