package org.gome.search.trace;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.gome.search.domain.SearchRequest;
import org.gome.search.domain.StoreConfiguration;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.stream.Stream;

@Aspect
@Component
public class TraceAspect {

    @Autowired
    private BraveTrace braveTrace;

    @Autowired
    private StoreConfiguration storeConfiguration;

    @Around("@annotation(transaction)")
    public Object catTransactionProcess(ProceedingJoinPoint pjp, Transaction transaction) throws Throwable {
        if(!storeConfiguration.isAbleTrace()){
            return pjp.proceed();
        }
        Object[] args=pjp.getArgs();
        SearchRequest searchRequest=(SearchRequest)Stream.of(args).filter(item->item instanceof SearchRequest).findFirst().orElse(null);
        final String transName =transaction.value();
        if(transName.equals(TranType.URL)){
            braveTrace.traceBServer(-1, -1, transName);
        }else{
            braveTrace.traceBClient(-1,transName);
        }
        if(transName.equals(TranType.REMOTE_SERIVCE) && searchRequest!=null){
            searchRequest.setKvObj("tId",BraveTrace.currentSpan.get().traceId);
            searchRequest.setKvObj("pId",BraveTrace.currentSpan.get().spanId);
        }
        try {
            Object result = pjp.proceed();
            return result;
        }finally{
            if(transName.equals(TranType.URL)){
                braveTrace.traceEServer(-1);
            }else{
                braveTrace.traceEClient(-1);
            }
        }
    }

}


//    @Around("@annotation(transaction)")
//    public Object catTransactionProcess(ProceedingJoinPoint pjp, Transaction transaction) throws Throwable {
//        final String transName =transaction.value();
//        final Span span=tracer.createSpan(transName);
//        try {
//            span.logEvent(Span.CLIENT_SEND);
//            Object result = pjp.proceed();
//            return result;
//        }finally{
//            span.logEvent(Span.CLIENT_RECV);
//            tracer.close(span);
//        }
//        return null;
//    }