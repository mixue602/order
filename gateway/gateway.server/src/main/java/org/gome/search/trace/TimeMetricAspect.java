package org.gome.search.trace;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.gome.search.domain.SearchResponse;
import org.gome.search.utils.CommonUtils;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.t6.service.entity.SearchResult;

import javax.servlet.http.HttpServletRequest;

/**
 * Created by doujintong on 17-3-30.
 */
@Aspect
@Component
@Order(3)
public class TimeMetricAspect {

    @Pointcut("execution(public * org.gome.search.service..*.response(..))")
    public void time(){}

    @AfterReturning(returning = "result",pointcut = "time()")
    public void time(JoinPoint joinPoint,Object result) throws Throwable {
        Object[] args=joinPoint.getArgs();
        if(args.length<3){
            return;
        }
        if((result instanceof SearchResponse || result instanceof SearchResult)){
            int env=(int)args[2];
            HttpServletRequest req= CommonUtils.getRequest();
            if(req!=null){
                if(env==3){
                    req.setAttribute("appTime",((SearchResponse)result).getHeader().getIntValue("appTime"));
                }else if(env==6){
                    req.setAttribute("appTime",((SearchResult)result).getAppTime());
                }
            }
        }
    }
}