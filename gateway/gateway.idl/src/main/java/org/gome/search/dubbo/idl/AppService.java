package org.gome.search.dubbo.idl;

import com.alibaba.fastjson.JSONObject;
import org.gome.search.dubbo.domain.AppRequest;
import org.gome.search.dubbo.domain.AppResponse;

/**
 * Created by doujintong on 17-3-13.
 */
public interface AppService {

    public AppResponse mainSearch(AppRequest searchObject);

    public AppResponse rebateSearch(AppRequest rebateRequest);

    public AppResponse distributeSearch(AppRequest appRequest);

    public AppResponse myShopSearch(AppRequest appRequest);

    public AppResponse shopHomeSearch(AppRequest appRequest);

    public AppResponse distributeAllSearch(AppRequest appRequest);

    public String test(String data);

    public AppResponse enterpriseSearch(AppRequest appRequest);

}
