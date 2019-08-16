package org.gome.search.filter;

import com.netflix.hystrix.*;
import org.gome.search.domain.SearchRequest;
import org.gome.search.service.InvokerHandler;
import org.t3.service.search.invoker.PageApiInvoker;

/**
* Created by doujintong on 17-4-12.
*/
public class DubboHysrixCommand<T> extends HystrixCommand<T>{

    private static final int DEFAULT_THREADPOOL_CORE_SIZE = 30;

    private InvokerHandler invokerHandler;
    private PageApiInvoker searchServiceApiInvoker;
    private SearchRequest searchRequest;

    public DubboHysrixCommand(InvokerHandler invokerHandler,PageApiInvoker searchServiceApiInvoker,SearchRequest searchRequest){
        super(Setter.withGroupKey(HystrixCommandGroupKey.Factory.asKey(DubboHysrixCommand.class.getClass().getSimpleName()))
                .andCommandKey(HystrixCommandKey.Factory.asKey("DubboService"))
                .andThreadPoolKey(HystrixThreadPoolKey.Factory.asKey("AppService"))
                .andCommandPropertiesDefaults(
                        HystrixCommandProperties.Setter()
                                .withCircuitBreakerRequestVolumeThreshold(10)
                                .withCircuitBreakerSleepWindowInMilliseconds(30000)
                                .withExecutionTimeoutEnabled(false))
                .andThreadPoolPropertiesDefaults(HystrixThreadPoolProperties.Setter().withCoreSize(DEFAULT_THREADPOOL_CORE_SIZE)));//线程池为30
        this.invokerHandler=invokerHandler;
        this.searchServiceApiInvoker=searchServiceApiInvoker;
        this.searchRequest=searchRequest;

    }

    @Override
    protected T run() throws Exception {
        return (T)invokerHandler.response(searchServiceApiInvoker.appClientPage(searchRequest), searchRequest, 3);
    }

    @Override
    protected T getFallback() {
        return null;
    }
//使用
//    if(storeConfiguration.isAbleHystrix()){
//        resultR=new DubboHysrixCommand<SearchResponse>(invokerHandler,searchServiceApiInvoker,searchRequest).execute();
//    }else{
//        resultR=(SearchResponse)invokerHandler.response(searchServiceApiInvoker.appClientPage(searchRequest), searchRequest,3);
//    }
}


