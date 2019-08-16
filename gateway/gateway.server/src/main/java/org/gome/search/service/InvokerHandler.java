package org.gome.search.service;

import com.alibaba.fastjson.JSONObject;
import com.netflix.hystrix.contrib.javanica.annotation.HystrixCommand;
import com.netflix.hystrix.contrib.javanica.annotation.HystrixProperty;
import io.totem.invoker.Invocation;
import org.apache.commons.lang3.StringUtils;
import org.gome.search.cache.LevelCache;
import org.gome.search.domain.*;
import org.gome.search.trace.ATimeMetric;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


/**
 * Created by doujintong on 17-1-19.
 */
@Service
public class InvokerHandler<T> {
    
    @Autowired
    private StoreConfiguration storeConfiguration;

    private Logger logger = LoggerFactory.getLogger(InvokerHandler.class);



    @ATimeMetric
    //@Transaction(TranType.REMOTE_SERIVCE)
    @HystrixCommand(
            fallbackMethod = "fallback",
            commandKey = "WebService" ,
            threadPoolKey = "AppService",
            commandProperties = {
                @HystrixProperty(name = "execution.isolation.thread.timeoutInMilliseconds", value = "9000"),
                @HystrixProperty(name = "circuitBreaker.requestVolumeThreshold", value = "10"),
                @HystrixProperty(name = "circuitBreaker.sleepWindowInMilliseconds", value = "10000")
            },
            threadPoolProperties = {
                @HystrixProperty(name = "coreSize", value = "100")
            })
    @LevelCache(prefix = "cachePage")
    public <T> T response(Invocation<T> sInv,SearchRequest searchRequest,int env) {
//        if (env == 3) {
//            sInv.contextName(storeConfiguration.getContextNameT3());
//        } else if (env == 6) {
//            sInv.contextName(storeConfiguration.getContextNameT6());
//        }
        if (searchRequest != null){
            if (searchRequest.getOriginModule() != null && searchRequest.getOriginModule().equals(OriginModule.SEARCH) && StringUtils.isNotBlank(searchRequest.getCookieId())){
                sInv.hash(StringUtils.defaultString(searchRequest.getCookieId(),"cookieisnull"));
            }
            if (StringUtils.isNotBlank(searchRequest.getServer())) {
                String[] hostPort = searchRequest.getServer().split(":");
                sInv.fixed(hostPort[0], Integer.parseInt(hostPort[1]));
            }
        }
        return getAppResponse(searchRequest,sInv);
    }

    private <T> T getAppResponse(SearchRequest request, Invocation<T> sInv) {
        if(request!=null && StringUtils.isNotBlank(request.getRegionId()) && request.getRegionId().startsWith("84") && request.getInstock()==1){
            SearchResponse searchResponse=SearchResponse.build();
            JSONObject pageBar=new JSONObject();
            pageBar.put("totalCount",0);
            pageBar.put("totalPage",0);
            JSONObject selectData=new JSONObject();
            selectData.put("keywords",request.getQuestion());
            selectData.put("isSearch", true);
            ((ResultContent) searchResponse.getContent()).setPageBar(pageBar);
            ((ResultContent) searchResponse.getContent()).setSelectData(selectData);
            ((ResultContent) searchResponse.getContent()).setSeoData(new JSONObject());
            JSONObject level=new JSONObject();
            level.put("searchLevel",5);
            ((ResultContent) searchResponse.getContent()).setCommonInfo(level);
            return (T)searchResponse;
        }
        return sInv.get();
    }

    public <T> T fallback(Invocation<T> sInv,SearchRequest searchRequest,int env){
        JSONObject data=(JSONObject)JSONObject.toJSON(searchRequest);
        data.put("circuitBreaker",true);
        logger.warn("httpAcc - {}",data.toJSONString());
        return null;
    }

}
