package org.gome.search.cache;

import com.mongodb.*;
import org.apache.commons.lang3.StringUtils;
import org.gome.search.mongo.IOMongoClient;
import org.gome.search.utils.CommonUtils;
import org.gome.search.utils.DateUtil;
import org.gome.search.utils.MongoUtils;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Created by doujintong on 16-12-21.
 */
@Service
public class MemoryCacheBean implements InitializingBean
{
    private  ConcurrentHashMap<String, String> keyFilterMap = new ConcurrentHashMap<>();
    private  ConcurrentHashMap<String, BasicDBList> fromFilterMap = new ConcurrentHashMap<>();
    private  List<String> illegalFilterMap = new ArrayList<>();
    private  ConcurrentHashMap<String, BasicDBList> ipFilterMap = new ConcurrentHashMap<>();
    private  ConcurrentHashMap<String,List<String>> catHotWordMap = new ConcurrentHashMap<>();
    private  ConcurrentHashMap<String,BasicDBObject> bannerInfoMap = new ConcurrentHashMap<>();
    private String collName="t_dict_data";
    private String cat_collName = "tbl_search_cat_top200_v1";
    private String banner_collName= "prdt_serbanner";
    @Autowired
    private IOMongoClient mongoClient;

    public void init(){
        BasicDBObject qObject=new BasicDBObject("data.keywordsFilter",new BasicDBObject("$exists",true));
        DBCollection mongoCollection= MongoUtils.getMongoCollection(mongoClient, "dict", collName);
        DBCursor cursor=mongoCollection.find(qObject);
        while(cursor.hasNext()){
            BasicDBObject bo=(BasicDBObject)cursor.next();
            BasicDBObject keyWord=(BasicDBObject)bo.get("data");
            BasicDBObject keyWord1=(BasicDBObject)keyWord.get("keywordsFilter");
            if(StringUtils.isNotBlank(keyWord1.getString("filterWord"))){
                String key = keyWord1.getString("filterWord");
                if(StringUtils.equals(key, "ipRequest")){
                    ipFilterMap.put(key, (BasicDBList) keyWord1.get("url"));
                }else if(StringUtils.equals(key, "fromRequest")){
                    fromFilterMap.put(key, (BasicDBList) keyWord1.get("url"));
                }else if(StringUtils.equals(key, "filterRequest")){
                    illegalFilterMap.add(keyWord1.getString("word"));
                }else{
                    keyFilterMap.put(key, keyWord1.getString("url"));
                }
            }

        }

        //读取热门分类信息
        DBCollection conn = MongoUtils.getMongoCollection(mongoClient, "eye_job", cat_collName);
        List<BasicDBObject> pipeline = new ArrayList<>();
        BasicDBObject group=new BasicDBObject("$group", new BasicDBObject("_id", "$catid").append("data", new BasicDBObject("$push", "$question")));
        BasicDBObject sort=new BasicDBObject("$sort",new BasicDBObject("time",-1));
        BasicDBObject query=new BasicDBObject("$match",new BasicDBObject("time",CommonUtils.getNextDay(new Date(), 30)));
        pipeline.add(query);
        pipeline.add(sort);
        pipeline.add(group);
        Iterator<DBObject> results = conn.aggregate(pipeline).results().iterator();
        results.forEachRemaining(obj -> {
            String key= obj.get("_id").toString();
            List<String> value = (List<String>)obj.get("data");
            catHotWordMap.put(key,value.size() >= 10 ? value.subList(0,10):value);
        });

        //获取服务banner信息
       loadBannerInfoToCache();
    }

    /**
     * 加载已配置的banner信息
     */
    public void loadBannerInfoToCache(){
        bannerInfoMap.clear();
        DBCollection bannerConn =  MongoUtils.getMongoCollection(mongoClient, "dict", banner_collName);
        BasicDBObject queryParam = new BasicDBObject();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        BasicDBList params = new BasicDBList();
        params.add(new BasicDBObject("validate",new BasicDBObject("$gte",sdf.format(System.currentTimeMillis()))));
        params.add(new BasicDBObject("validate",""));
        queryParam.append("$or",params);
        DBCursor bannerCur =  bannerConn.find(queryParam,new BasicDBObject("_id",0));
        while(bannerCur.hasNext()){
            BasicDBObject banner=(BasicDBObject)bannerCur.next();
            String question = banner.getString("question");
            BasicDBObject info = (BasicDBObject)banner.get("info");
            int bannerType = info.getInt("bannerType");
            String[] qs = question.split(",");
            if(qs.length>0){
                for(int i=0; i<qs.length;i++){
                    BasicDBObject oldInfo = bannerInfoMap.get(qs[i]);
                    if(oldInfo == null){
                        bannerInfoMap.put(qs[i],info);
                    }else{//然后时间最后优先级越高
                        int oldBannerType = oldInfo.getInt("bannerType");
                        if(oldBannerType == 0 && bannerType == 1){
                            bannerInfoMap.put(qs[i],info);//跳转优先级高　
                        }else if(oldBannerType == bannerType){
                               bannerInfoMap.put(qs[i],info);//时间最新优先
                        }
                    }
                }
            }
        }
    }

    public ConcurrentHashMap<String, String> getKeyFilterMap()
    {
        return keyFilterMap;
    }

    public ConcurrentHashMap<String, BasicDBList> getFromFilterMap()
    {
        return fromFilterMap;
    }

    public ConcurrentHashMap<String, BasicDBList> getIpFilterMap()
    {
        return ipFilterMap;
    }

    public ConcurrentHashMap<String, List<String>> getCatHotWordMap() {return catHotWordMap;}

    public List<String> getIllegalFilterMap() {
        return illegalFilterMap;
    }

    public ConcurrentHashMap<String, BasicDBObject> getBannerInfoMap() {
        return bannerInfoMap;
    }

    @Override
    public void afterPropertiesSet() throws Exception {
        init();
    }
}
