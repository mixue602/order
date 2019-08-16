package org.gome.search.cache;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.gome.search.domain.SearchRequest;
import org.gome.search.domain.SearchResponse;
import org.gome.search.domain.StoreConfiguration;
import org.gome.search.utils.CommonUtils;
import org.gome.search.utils.KryoUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.t6.service.entity.BaseRequest;
import org.t6.service.entity.SearchResult;

import java.util.stream.Stream;

/**
 * Created by doujintong on 17-3-30.
 */
@Aspect
@Component
@Order(2)
public class LevelCacheAspect {

    @Autowired
    private NetLevelDB levelDB;

    @Autowired
    private StoreConfiguration storeConfiguration;

    @Around("@annotation(levelCache)")
    public Object cache(ProceedingJoinPoint pjp, LevelCache levelCache) throws Throwable {
        Object[] args=pjp.getArgs();
        Integer env=(Integer) Stream.of(args).filter(item->item instanceof Integer).findFirst().orElse(null);
        Object keyObj=Stream.of(args).filter(item->item instanceof SearchRequest).findFirst().orElse(null);
        if(keyObj==null)
            return pjp.proceed();
        boolean debug=((SearchRequest)keyObj).getBoolean("debug",false);
        if(debug)
            return pjp.proceed();
        Object result=null;
        if(storeConfiguration.isAbleCache()){
            result=cacheGet(keyObj, levelCache.prefix(), env);
            if(CommonUtils.getRequest()!=null)CommonUtils.getRequest().setAttribute("appTime", -2);
        }
        if(result==null){
            result=pjp.proceed();
            if(result==null){
                if(CommonUtils.getRequest()!=null)CommonUtils.getRequest().setAttribute("appTime", -1);
                if (storeConfiguration.isAbleCache())result=cacheGet(keyObj, levelCache.prefix()+"$1", env);
            }else{
                if (storeConfiguration.isAbleCache() && result instanceof SearchResponse)cachePut(keyObj,levelCache.prefix(),env,result);
            }
        }
        if(result==null){
            result=defaultObj(env);
        }

        return result;
    }

    private Object defaultObj(int env){
        Object result=null;
        if (env == 3) {
            result= SearchResponse.build();
            ((SearchResponse)result).getHeader().put("status",888);
        } else if (env == 6) {
            SearchResult searchResult=new SearchResult();
            searchResult.setMessage("error");
            result=searchResult;
        }
        return result;
    }

    private Object cacheGet(Object searchRequest,String prefix,int env){
        if(searchRequest==null || (env==3 && ((SearchRequest)searchRequest).getPageNumber()>3) || (env==6 && ((BaseRequest)searchRequest).getPageNum()>3))return null;
        Object result = levelDB.getResult(prefix,searchRequest,env);
       if(result instanceof SearchResponse) {
           ((SearchResponse) result).getHeader().put("appTime",-2);
           String oldId=((SearchResponse) result).getHeader().getString("rid");
           String newId=((SearchRequest)searchRequest).getString("reqId", "");
           ((SearchResponse) result).getHeader().put("rid",newId);
           levelDB.send(newId, oldId);
        }
        return result;
    }

    private void cachePut(Object searchRequest,String prefix,int env,Object result){
        Object data= KryoUtil.copy(result);
        if(searchRequest==null || (env==3 && ((SearchRequest)searchRequest).getPageNumber()>3) || (env==6 && ((BaseRequest)searchRequest).getPageNum()>3))return;
        if(env==3 && ((SearchRequest)searchRequest).getQuestion()!=null && ((SearchRequest)searchRequest).getQuestion().length()>10)return;
        levelDB.putResult(prefix,searchRequest,env,data,storeConfiguration.getSdbTll());
        levelDB.putResult(prefix+"$1",searchRequest,env,data,storeConfiguration.getSdbTllD());
    }
}