package org.gome.search.handler;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import org.gome.search.domain.ResultContent;
import org.gome.search.domain.SearchResponse;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

/**
 * Created by Luoqiong on 17-2-15.
 * 处理返利数据结构
 */
@Service
public class RebateHandler
{
    public JSONObject handler(SearchResponse response) {
        JSONObject oResult = new JSONObject();
        oResult.put("message", "");
        ResultContent result = (ResultContent)response.getContent();

        if(result != null){
            JSONObject pageBar = result.getPageBar();
            oResult.put("pageBar", pageBar);
            JSONArray products =  (JSONArray)result.getProdInfo().get("products");
            JSONArray items = new JSONArray();
            if(products != null && products.size() > 0){
                products.stream().map(proItem -> {
                    JSONObject product = (JSONObject) proItem;
                    JSONObject item = new JSONObject();

                    item.put("pId", product.get("pId"));
                    item.put("skuId", product.get("skuId"));
                    item.put("salesVolume", product.getIntValue("salesVolume"));
                    item.put("name", product.get("name"));
                    item.put("sImg", product.get("sImg"));
                    items.add(item);
                    return items;
                }).collect(Collectors.toList());

            }
            JSONObject data = new JSONObject();
            data.put("items", items);
            oResult.put("data", data);
            oResult.put("appTime",response.getHeader().getIntValue("appTime"));
        }
        return oResult;
    }
}
