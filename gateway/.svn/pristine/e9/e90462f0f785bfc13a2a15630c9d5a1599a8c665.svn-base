package org.gome.search.filter;

import com.alibaba.fastjson.JSONObject;
import com.alibaba.fastjson.serializer.SerializerFeature;
import org.apache.commons.lang3.StringUtils;
import org.gome.search.domain.SearchRequest;
import org.gome.search.domain.SearchResponse;
import org.gome.search.domain.StoreConfiguration;
import org.gome.search.handler.BaseHandler;
import org.gome.search.handler.Loghandler;
import org.gome.search.utils.GUID;
import org.gome.search.utils.SerializerUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.actuate.metrics.CounterService;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.UnsupportedEncodingException;

/**
 * Created by doujintong on 16-12-6.
 */
@Service
public class PageJsonInterceptor  implements HandlerInterceptor {
    @Autowired
    private StoreConfiguration storeConfiguration;

    @Autowired
    private BaseHandler baseHandler;

    private ThreadLocal<Long> startTime=new ThreadLocal<>();

    @Autowired
    private GUID guid;

    @Autowired
    private CounterService counterService;

    @Override
    public boolean preHandle(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Object o){
        httpServletRequest.setAttribute("reqId", guid.nextId62Str());
        startTime.set(System.currentTimeMillis());
        return true;
    }

    @Override
    public void postHandle(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Object o, ModelAndView modelAndView)throws UnsupportedEncodingException {
        SearchRequest searchRequest;
        SearchResponse response=null;
        if(modelAndView!=null){
            modelAndView.getModel().put("storeConfiguration", storeConfiguration);
            response= ((SearchResponse) modelAndView.getModel().get("searchObj"));
            searchRequest=(SearchRequest)modelAndView.getModel().get("searchReq");
            if(response!=null && !searchRequest.isMobile()){
                baseHandler.dealHeader(httpServletRequest, response,searchRequest);
                baseHandler.dealFlowQuilk(httpServletRequest, response);
                baseHandler.dealBanner(httpServletRequest,response);
                baseHandler.dealDataNodes(response);
            }
        }

        if(StringUtils.equals(httpServletRequest.getParameter("pageType"),"bjson") && modelAndView!=null && !modelAndView.getViewName().startsWith("forward")){
            String jsonObj = JSONObject.toJSONString(modelAndView.getModel().get("searchObj"),SerializerUtils.propertyFilter(),SerializerFeature.WriteMapNullValue);
            if(StringUtils.isNotBlank(httpServletRequest.getParameter("shop"))){
                jsonObj = JSONObject.toJSONString(modelAndView.getModel().get("shopObj"), SerializerUtils.propertyFilter(), SerializerFeature.WriteMapNullValue);
            }
            modelAndView.getModel().put("searchObj", jsonObj);
            modelAndView.setViewName("blank");
        }else if(response!=null && modelAndView!=null && response.getHeader().getIntValue("isHwg")==1){
            modelAndView.setViewName("m"+modelAndView.getViewName());
        }
    }

    @Override
    public void afterCompletion(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Object o, Exception e) {
        httpServletRequest.setAttribute("costTime",System.currentTimeMillis()-startTime.get());
        if(!httpServletRequest.getRequestURI().startsWith("/error") && !httpServletRequest.getRequestURI().contains("\\/p\\/s")){
            Loghandler.handleAccLog(httpServletResponse.getStatus(), httpServletRequest);
            counterService.increment("counter.status." + httpServletResponse.getStatus() + ".total_search");
        }

    }
}
