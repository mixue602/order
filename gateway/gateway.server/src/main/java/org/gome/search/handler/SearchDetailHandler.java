package org.gome.search.handler;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.mongodb.BasicDBObject;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import org.gome.search.mongo.IOMongoClient;
import org.gome.search.utils.MongoUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Created by lln on 17-11-21.
 */
@Service("searchDetailHandler")
public class SearchDetailHandler {

    @Autowired
    private IOMongoClient MongoClient;

    public JSONObject handler(JSONArray skuId){
            JSONObject result=new JSONObject();
            DBCollection collection=MongoUtils.getMongoCollection(MongoClient,"dict","weight");
            DBCursor cursor= collection.find(new BasicDBObject("s", new BasicDBObject("$in",skuId)),new BasicDBObject("_id",0));
           if (cursor.count()!=0){
               while (cursor.hasNext()){
                   BasicDBObject obj= (BasicDBObject)cursor.next();
                   result.put(obj.getString("s"),obj);
               }
           }
        return  result;
    }
}
