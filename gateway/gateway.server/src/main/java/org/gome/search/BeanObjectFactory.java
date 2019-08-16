package org.gome.search;

import com.alibaba.dubbo.config.MonitorConfig;
import com.alibaba.dubbo.config.ProtocolConfig;
import com.alibaba.dubbo.registry.support.AbstractRegistryFactory;
import com.alibaba.fastjson.support.spring.FastJsonpResponseBodyAdvice;
import com.google.common.collect.Sets;
import com.netflix.hystrix.contrib.metrics.eventstream.HystrixMetricsStreamServlet;
import de.codecentric.boot.admin.client.registration.ApplicationRegistrator;
import io.dubbo.springboot.DubboProperties;
import org.apache.catalina.startup.Tomcat;
import org.apache.commons.lang3.StringUtils;
import org.gome.search.cache.MemoryCacheBean;
import org.gome.search.domain.StoreConfiguration;
import org.gome.search.filter.XssFilter;
import org.gome.search.mongo.IOMongoClient;
import org.gome.search.redis.IOClientFactory;
import org.gome.search.redis.IORedisClient;
import org.gome.search.trace.AdvancedMetrics;
import org.gome.search.utils.GUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.actuate.endpoint.MetricsEndpoint;
import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnWebApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.boot.web.servlet.ServletRegistrationBean;
import org.springframework.context.ApplicationListener;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.event.ContextClosedEvent;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.servlet.mvc.method.annotation.ExceptionHandlerExceptionResolver;

import javax.servlet.Servlet;
import java.net.URI;

/**
 * Created by doujintong on 16-9-19.
 */

@Configuration
public class BeanObjectFactory{

    @Autowired
    private StoreConfiguration storeConfiguration;

    @Autowired
    private MemoryCacheBean memoryCacheBean;

    @Autowired
    private ApplicationRegistrator applicationRegistrator;

    @Autowired
    private MetricsEndpoint metricsEndpoint;

    @Autowired
    private IORedisClient ioRedisClient;

    private AdvancedMetrics advancedMetrics;

    @Bean
    public IORedisClient getIORedisClient(){
        String redis = storeConfiguration.getRedisCluster();
        URI uri=URI.create(redis);
        String major=uri.getAuthority();
        String minor=uri.getQuery();
        boolean back= StringUtils.isNotBlank(minor);
        return IOClientFactory.redisClient(major, back ? minor.replace("backup=", "") : "", back);
    }

    @Bean
    public IOMongoClient getIOMongoClient(){
        storeConfiguration.println();
        String mongo = storeConfiguration.getMongoCluster();
        URI uri=URI.create(mongo);
        String major=uri.getAuthority();
        String minor=uri.getQuery();
        boolean back= StringUtils.isNotBlank(minor);
        return org.gome.search.mongo.IOClientFactory.mongoClient(major, back ? minor.replace("backup=", "") : "", back);
    }

    @Bean
    public ExceptionHandlerExceptionResolver exceptionHandlerExceptionResolver(){
        return new ExceptionHandlerExceptionResolver();
    }

    @Bean
    public FastJsonpResponseBodyAdvice fastJsonpResponseBodyAdvice() {
        return new FastJsonpResponseBodyAdvice("callback", "jsonp");
    }

    @Bean
    public FilterRegistrationBean xssFilterBean() {
        FilterRegistrationBean xssFilterBean =  new FilterRegistrationBean();
        xssFilterBean.setFilter(new XssFilter());
        xssFilterBean.setUrlPatterns(Sets.newHashSet("/*"));
        xssFilterBean.setAsyncSupported(true);
        return xssFilterBean;
    }

    @Bean
    public MonitorConfig monitorConfig(){
        MonitorConfig monitorConfig = new MonitorConfig();
        monitorConfig.setProtocol("registry");
        return monitorConfig;
    }

    @Bean
    public ApplicationListener applicationListener(ApplicationRegistrator applicationRegistrator,DubboProperties dubboProperties){
        return (event)->{
            if(event instanceof ApplicationReadyEvent){
                applicationRegistrator.register();
            }
            if(event instanceof ContextClosedEvent){
                applicationRegistrator.deregister();
                AbstractRegistryFactory.destroyAll();
                ProtocolConfig.destroyAll();
                dubboProperties.getProtocol().destory();
            }
        };
    }


    @Bean
    @ConditionalOnMissingBean
    @ConditionalOnClass({ Servlet.class, Tomcat.class })
    @ConditionalOnWebApplication
    public AdvancedMetrics advancedMetrics(){
        AdvancedMetrics advancedMetrics=new AdvancedMetrics();
        advancedMetrics.setStoreConfiguration(storeConfiguration);
        advancedMetrics.init();
        this.advancedMetrics=advancedMetrics;
        return advancedMetrics;
    }

    @Scheduled(fixedRate = 10000)
    public void fixMetrics(){
        advancedMetrics.writeMetrics(metricsEndpoint.invoke());
    }


    @Bean
    public GUID guid(){
//        String ip= NetUtils.getLocalAddress().getHostAddress();
//        int wordId=Integer.parseInt(ip.split("\\.")[3]);
        long id=ioRedisClient.incr("gateway@workid");
        if(id==255){
            id=ioRedisClient.decrBy("gateway@workid",254L);
        }
        return new GUID(id,1);
    }

    @Bean
    public ServletRegistrationBean hystrixMetricEndpoint() {
        ServletRegistrationBean servletRegistrationBean=new ServletRegistrationBean();
        servletRegistrationBean.setServlet(new HystrixMetricsStreamServlet());
        servletRegistrationBean.addUrlMappings("/pageApi.hystrix");
        return servletRegistrationBean;
    }
}
