package org.gome.search.handler;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.mongodb.BasicDBList;
import com.mongodb.BasicDBObject;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import org.apache.commons.lang.StringUtils;
import org.gome.search.domain.StoreConfiguration;
import org.gome.search.mongo.IOMongoClient;
import org.gome.search.utils.DateUtil;
import org.gome.search.utils.MongoUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * Created by Luoqiong on 17-07-04.
 * 处理全网商品对比数据
 */
@Service
public class ContrastHandler
{
    @Autowired
    private IOMongoClient mongoClient;

    @Autowired
    private StoreConfiguration storeConfiguration;

    private static SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd HHmmss");
    private static SimpleDateFormat sdf1 = new SimpleDateFormat("yyyyMMdd");

    public JSONObject handler(int pageNumber, int pageSize, String time) {

        JSONObject result=new JSONObject();
        BasicDBObject param = new BasicDBObject();
        String stime = "";
        String etime = "";
        if(!StringUtils.equals("0",time)){
            stime = time + " 000000";
            etime = time + " 235959";
        }else{
            String todayTime =  sdf1.format(DateUtil.addDay(new Date(),-1));
            stime = todayTime + " 000000";
            etime = todayTime + " 235959";
        }

        if(StringUtils.isNotBlank(stime) && StringUtils.isNotBlank(etime)){
            try{
                param = new BasicDBObject("runtime", new BasicDBObject("$gte",
                        sdf.parse(stime).getTime()).append("$lte",
                        sdf.parse(etime).getTime()));

            }catch (Exception e){e.printStackTrace();}
        }

        DBCollection mongoCollection= MongoUtils.getMongoCollection(mongoClient, storeConfiguration.getSmartDbName(), storeConfiguration.getContrastCollName());
        JSONArray oResult = new JSONArray();
        long count = mongoCollection.count(param);
        DBCursor cursor = mongoCollection.find(param).skip((pageNumber - 1) * pageSize).limit(pageSize);
        result.put("totalPage", count % pageSize > 0 ? (count / pageSize + 1) : count / pageSize);
        result.put("totalCount", count);
        if (cursor == null)return result;
        while(cursor.hasNext()){
            JSONObject tempObj = new JSONObject();
            BasicDBObject data = (BasicDBObject)cursor.next();

            String skuId = data.getString("skuid","");//skuid
            String cat = data.getString("jdcatNameInfo","");//京东分类名
            String pos = data.getString("position","");//京东排名
            String proName = data.getString("productName","");//京东商品名
            String shopName = data.getString("shopName","");//京东商品店铺名
            String brand = data.getString("brand","");//京东商品品牌
            long proTime = data.getLong("runtime",-1l);//商品采集时间
            long priceTime = data.getLong("priceTime",-1l);//采集价格时间
            String url = data.getString("url");//商品链接地址
            String price = data.getString("price");//商品价格

            JSONArray gome = new JSONArray();
            BasicDBObject gomeData = (BasicDBObject)data.get("gome");//国美商品
            int status = gomeData.getInt("status");
            if(status == 1){
                BasicDBList detail = (BasicDBList)gomeData.get("detail");
                if(detail != null && detail.size() > 0){
                    for(int i=0; i<detail.size(); i++){
                        JSONObject temp = new JSONObject();
                        BasicDBObject oldObj =  (BasicDBObject)detail.get(i);
                        temp.put("pid", oldObj.getString("pid"));
                        temp.put("skuid", oldObj.getString("skuid"));
                        gome.add(temp);
                    }
                }
            }

            tempObj.put("skuId", skuId);
            tempObj.put("cat", cat);
            tempObj.put("pos", pos);
            tempObj.put("protName", proName);
            tempObj.put("proTime", proTime);
            tempObj.put("priceTime", priceTime);
            tempObj.put("url", url);
            tempObj.put("shopName", shopName);
            tempObj.put("price", price);
            tempObj.put("brand", brand);
            tempObj.put("gome", gome == null ? new BasicDBList() : gome);

            oResult.add(tempObj);
        }

        result.put("data", oResult);
        return result;
    }
}
