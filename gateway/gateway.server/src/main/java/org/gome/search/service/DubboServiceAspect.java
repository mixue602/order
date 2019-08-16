package org.gome.search.service;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.gome.search.dubbo.domain.AppRequest;
import org.gome.search.dubbo.domain.AppResponse;
import org.gome.search.handler.Loghandler;
import org.gome.search.utils.GUID;
import org.gome.search.utils.NetUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.actuate.metrics.CounterService;
import org.springframework.boot.actuate.metrics.GaugeService;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

/**
 * Created by luoqiong on 18-3-14.
 */
@Aspect
@Component
@Order(1)
public class DubboServiceAspect {

    private Logger logger = LoggerFactory.getLogger(AppServiceAspect.class);

    private String server= NetUtils.getLocalAddress().getHostAddress();

    @Autowired
    private CounterService counterService;

    @Autowired
    private GaugeService gaugeService;

    @Autowired
    private GUID guid;

    @Pointcut("execution(public * org.gome.search.service.DubboServiceImpl.*(..))")
    public void dubboService(){}

    @Around("dubboService()")
    public Object dubboSearch(ProceedingJoinPoint point){
        String reqId = guid.nextId62Str();
        long starttime=System.currentTimeMillis();
        AppResponse result = new AppResponse();
        Object[] args = point.getArgs();
        String methodName = point.getSignature().getName();
        AppRequest appRequest = null;
        Object firstParam = args[0];
        if(firstParam instanceof JSONObject){
            appRequest = JSONObject.toJavaObject((JSONObject)firstParam, AppRequest.class);
        }else{
            appRequest = (AppRequest)firstParam;
        }
        if(appRequest == null){return result;}
        appRequest.setReqId(reqId);
        try{
            result =  (AppResponse)point.proceed();//执行方法体
            result.setStatus(200);
        }catch (Exception e){
            logger.error("server error {}", e);
        } catch (Throwable e) {
            logger.error("server error {}", e);
        } finally {
            result.getServerInfo().setServer(server);
            result.getServerInfo().setReqId(reqId);
            counterService.increment("counter.status." + result.getStatus() + ".p.dubbo" + "." + methodName);
            gaugeService.submit("gauge.response.p.dubbo", System.currentTimeMillis() - starttime);
            appRequest.setKvObj("appTime", result.getServerInfo().getAppTime());
            appRequest.setKvObj("costTime", System.currentTimeMillis() - starttime);
            appRequest.setKvObj("methodName", methodName);
            Loghandler.handleAccLog(result.getStatus(), appRequest);
        }
        return result;
    }

}
