package org.gome.search.utils;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.alibaba.fastjson.serializer.PropertyFilter;
import com.alibaba.fastjson.serializer.SerializeFilter;
import org.gome.search.domain.ResultContent;

import java.lang.reflect.Field;

/**
 * Created by doujintong on 16-12-26.
 */
public class SerializerUtils {

    /**
     * 不容许空map
     * @return
     */
    public static SerializeFilter propertyFilter(){
        return (PropertyFilter) (o, s, o1) -> {
            if(o instanceof ResultContent){
                ResultContent resultObj=(ResultContent)o;
                try {
                    Field filed= resultObj.getClass().getDeclaredField(s);
                    filed.setAccessible(true);
                    Object nodeData=filed.get(resultObj);
                    if(nodeData==null)return false;
                    if(nodeData instanceof JSONObject){
                        JSONObject jsonObject=(JSONObject)nodeData;
                        if(jsonObject.isEmpty()){
                            return false;
                        }
                    }
                    if(nodeData instanceof JSONArray){
                        JSONArray jsonObject=(JSONArray)nodeData;
                        if(jsonObject.isEmpty()){
                            return false;
                        }
                    }

                } catch (IllegalAccessException e) {
                    e.printStackTrace();
                } catch (NoSuchFieldException e) {
                    e.printStackTrace();
                }
            }
            return true;
        };
    }
}
