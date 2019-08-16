package org.gome.search.service;

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

import java.util.stream.Stream;

/**
 * Created by luoqiong on 17-7-12.
 */
@Aspect
@Component
@Order(1)
public class AppServiceAspect {

    private Logger logger = LoggerFactory.getLogger(AppServiceAspect.class);

    private String server= NetUtils.getLocalAddress().getHostAddress();

    @Autowired
    private GUID guid;

    @Autowired
    private CounterService counterService;

    @Autowired
    private GaugeService gaugeService;

    /**
     * 定义一个切入点.
     * 解释下：
     *
     * ~ 第一个 * 代表任意修饰符及任意返回值.
     * ~ 第二个 * 任意包名
     * ~ 第三个 * 代表任意方法.
     * ~ 第四个 * 定义在web包或者子包
     * ~ 第五个 * 任意方法
     * ~ .. 匹配任意数量的参数.
     */
    @Pointcut("execution(public * org.gome.search.service.AppServiceImpl.*(..))")
    public void appService(){}

    @Around("appService()")
    public Object appSearch(ProceedingJoinPoint pjp){
        String reqId= guid.nextId62Str();
        long starttime=System.currentTimeMillis();
        AppResponse result = new AppResponse();
        Object[] args=pjp.getArgs();
        String methodName = pjp.getSignature().getName();
        AppRequest appRequest = (AppRequest) Stream.of(args).filter(item->item instanceof AppRequest).findFirst().orElse(null);
        if(appRequest == null){return result;}
        appRequest.setReqId(reqId);
        try{
            result =  (AppResponse)pjp.proceed();//执行方法体
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
            appRequest.setKvObj("methodName",methodName);
            Loghandler.handleAccLog(result.getStatus(), appRequest);
        }
        return result;
    }
}
