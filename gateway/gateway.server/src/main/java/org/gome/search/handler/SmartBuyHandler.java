package org.gome.search.handler;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.mongodb.BasicDBList;
import com.mongodb.BasicDBObject;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.squareup.moshi.Json;
import org.apache.commons.lang3.StringUtils;
import org.gome.search.cache.LocalCache;
import org.gome.search.domain.SmartBuyRequest;
import org.gome.search.domain.StoreConfiguration;
import org.gome.search.mongo.IOMongoClient;
import org.gome.search.redis.IORedisClient;
import org.gome.search.utils.CommonUtils;
import org.gome.search.utils.DateUtil;
import org.gome.search.utils.MongoUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.DecimalFormat;
import java.util.Arrays;
import java.util.Comparator;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;


/**
 * Created by doujintong on 16-9-20.
 */
@Service("smartBuyHandler")
public class SmartBuyHandler {

    private  Logger logger = LoggerFactory.getLogger(SmartBuyHandler.class);
    private  DecimalFormat df = new DecimalFormat("0.00");

    @Autowired
    private IORedisClient ioRedisClient;

    @Autowired
    private IOMongoClient mongoClient;

    @Autowired
    private StoreConfiguration storeConfiguration;

    private LocalCache<String, JSONObject> smartCache=new LocalCache<>(100000,5, TimeUnit.MINUTES);

    public Object handler(SmartBuyRequest smartBuyRequest){
        int smartFlag=smartBuyRequest.getSmartFlag();
        int isShop = smartBuyRequest.getIsShop();
        String skuId = smartBuyRequest.getSkuId();
        String regionId = smartBuyRequest.getRegionId();
        Object result = null;
        switch (smartFlag) {
            case 0:
                result = getSkuIdList(false,smartBuyRequest);
                break;
            case 1:
                result = getRedisData(skuId, isShop,regionId);
                break;
            case 2:
                result = JSONObject.parseArray(skuId, String.class).parallelStream().map(sku -> getRedisData(sku, isShop,regionId)).collect(Collectors.toList());
                break;
            case 3:
                result = getSkuIdList(true, smartBuyRequest);
                break;
            case 4:
                double gomePrice = smartBuyRequest.getPrice();
                result = dealClever(getRedisData(skuId, isShop,regionId), gomePrice);
                break;
            default:
                logger.warn("no match smart flag [{}]", smartFlag);
                break;
        }
        return result;
    }

    private Object getSkuIdList(Boolean isSkipPage,SmartBuyRequest smartBuyRequest) {

        DBCollection mongoCollection=MongoUtils.getMongoCollection(mongoClient, storeConfiguration.getSmartDbName(),storeConfiguration.getSmartCollName());
        BasicDBObject keys = new BasicDBObject("skuid", 1).append("_id", 0);
        JSONObject result=new JSONObject();
        DBCursor cursor;
        if(isSkipPage){
            long count = mongoCollection.count();
            int pageNum =smartBuyRequest.getPageNum();
            int pageSize = smartBuyRequest.getPageSize();
            cursor=mongoCollection.find(new BasicDBObject(), keys).skip((pageNum - 1) * pageSize).limit(pageSize);
            result.put("totalPage", count % pageSize > 0 ? (count / pageSize + 1) : count / pageSize);
            result.put("totalCount", count);
        }else{
            cursor = mongoCollection.find(new BasicDBObject(), keys);
        }
        if (cursor == null)return new JSONObject();
        result.put("IdentifyProducts", cursor.toArray());
        return result;
    }

    private JSONObject getRedisData(String skuId, int isShop, String regionId) {

        JSONObject cacheData= smartCache.getIfPresent(skuId+"@"+isShop+"@"+regionId);
        if(cacheData!=null){
            return cacheData;
        }
        String result = ioRedisClient.get("comparePrice@" + skuId);
        if(StringUtils.isBlank(result))
            return new JSONObject();

        JSONObject temp =JSONObject.parseObject(result);
        String dt = temp.getString("lastModifiedTime");
        JSONArray jds =  temp.getJSONArray("jd");
        JSONArray sunings = temp.getJSONArray("suning");
        if(sunings == null && jds == null){
            return new JSONObject();
        }

        //过滤外层已下架比价信息
        jds = jds.stream().filter(item -> StringUtils.isNotBlank(((JSONObject)item).getString("price")) && !CommonUtils.formatPrice(((JSONObject)item).getString("price")).equals("已下架")).collect(Collectors.toCollection(JSONArray::new));
        sunings = sunings.stream().filter(item -> StringUtils.isNotBlank(((JSONObject)item).getString("promotion_price")) && !CommonUtils.formatPrice(((JSONObject)item).getString("promotion_price")).equals("已下架")).collect(Collectors.toCollection(JSONArray::new));

        //按照价格排序
        CommonUtils.quickSortByDouble("price", jds);
        CommonUtils.quickSortByDouble("promotion_price", sunings);

        //区域处理
        if(StringUtils.isNotBlank(regionId)){
            //京东获取区域价格
            getRegionPriceInfo(jds, "price", regionId);
            getRegionPriceInfo(sunings, "promotion_price", regionId);
            jds = jds.stream().filter(jdItem -> {
                JSONObject region = ((JSONObject) jdItem).getJSONObject("region");
                return region != null && region.size() > 0;
            }).collect(Collectors.toCollection(JSONArray::new));

            sunings = sunings.stream().filter(snItem -> {
                JSONObject region = ((JSONObject) snItem).getJSONObject("region");
                return region != null && region.size() > 0;
            }).collect(Collectors.toCollection(JSONArray::new));

        }
        //删除区域价节点，避免暴露
        removeRegionInfo(jds);
        removeRegionInfo(sunings);

        temp.put("jd",jds);
        temp.put("suning",sunings);

//      //友商中找出最低价
//      temp.put("jd", getLowPriceObj(jds, "price").fluentRemove("region"));
//      temp.put("suning",getLowPriceObj(sunings,"promotion_price").fluentRemove("region"));

        int jdStatus=temp.getIntValue("jdStatus");
        int snStatus=temp.getIntValue("snStatus");
        //京东和苏宁有一个是机器匹配的就返回空
        if((isShop!=1) && !((jdStatus==1 && snStatus==1) || (jdStatus==1 && snStatus==-1) || (jdStatus==-1 && snStatus==1))) {
            smartCache.put(skuId + "@" + isShop + "@" + regionId, new JSONObject());
            return new JSONObject();
        }

        if (!DateUtil.isToday(dt)) {
            temp = new JSONObject();
        } else {
            smartCache.put(skuId+"@"+isShop + "@" + regionId, temp);
        }
        return temp;
    }

// //当isShop=1时添加isShop标签
//    private  void  getShopData(JSONArray smartInfos,String skuId,String type){
//        smartInfos
//        .parallelStream()
//        .filter((Object smartInfo) -> StringUtils.isNotBlank(((JSONObject) smartInfo).getString("id")))
//        .map((Object smartInfo) -> {
//            String id = ((JSONObject) smartInfo).getString("id");
//            BasicDBObject isExist = (BasicDBObject) MongoUtils.getMongoCollection(mongoClient, storeConfiguration.getSmartDbName(),storeConfiguration.getSmartCollName()).findOne(new BasicDBObject(type + ".detail.skuid", id).append("skuid", skuId));
//            if (isExist != null) {
//                BasicDBObject tempJd = (BasicDBObject) isExist.get(type);
//                BasicDBList detail = (BasicDBList) (tempJd.get("detail"));
//                detail.parallelStream()
//                      .filter((Object data) -> detail != null && detail.size() > 0 && StringUtils.equals(id, ((BasicDBObject)data).getString("skuid", "")))
//                      .map((Object data)->((JSONObject) smartInfo).put("isShop", ((BasicDBObject)data).getBoolean("isShop", false)))
//                      .count();
//            } else {
//                ((JSONObject) smartInfo).put("isShop", false);
//            }
//            return smartInfo;
//        }).collect(Collectors.toList());
//    }

    /**
     * 删除京东和苏宁的区域价节点
     * @param priceInfo
     */
    private void removeRegionInfo(JSONArray priceInfo){
        priceInfo.forEach(item -> {
            JSONObject itemObj = (JSONObject) item;
            itemObj.remove("region");
        });
    }

    /**
     * 获取京东或苏宁的区域价信息
     * @param priceInfo
     * @param priceTag
     * @param regionId
     * @return
     */
    private JSONArray getRegionPriceInfo(JSONArray priceInfo,String priceTag,String regionId){
        //苏宁获取区域价
       priceInfo.forEach(snItem -> {
           JSONObject snItemObj = (JSONObject) snItem;
           JSONObject regionInfo = snItemObj.getJSONObject("region");
           if(regionInfo != null){
               JSONObject newRegion = new JSONObject();
               regionInfo.forEach((k, v) -> {
                   String regionPrice = CommonUtils.formatPrice(((JSONObject) v).getString("price"));
                   if (!StringUtils.equals("已下架", regionPrice)) {
                       newRegion.put(k, v);
                   }
               });
               JSONObject regionPriceObj = newRegion.getJSONObject(regionId);
               if (regionPriceObj != null) {
                   String regionPrice = CommonUtils.formatPrice(regionPriceObj.getString("price"));
                   String regionUpdateTime = regionPriceObj.getString("updateTime");
                   if (StringUtils.isNotBlank(regionPrice)) {
                       snItemObj.put(priceTag, regionPrice);
                       snItemObj.put("updateTime", regionUpdateTime);
                   }
               }
           }
       });
        return priceInfo;
    }

    private Object dealClever(JSONObject data,  double gomePrice) {
        if(data==null) return new JSONObject();
        String dt=data.getString("lastModifiedTime");
        if(StringUtils.isBlank(dt) || !DateUtil.isToday(dt))return new JSONObject();
        JSONArray jds=(JSONArray)data.get("jd");
        JSONArray sunings=(JSONArray)data.get("suning");
        if (jds == null && sunings == null)return new JSONObject();
        if (jds.size() < 1 && sunings.size() < 1)return new JSONObject();
        double jdPrice=getPriceInfo(jds,"price");
        double suPrice=getPriceInfo(sunings,"promotion_price");
        JSONObject compareObj=new JSONObject();
        double lowJd=jdPrice-gomePrice,lowSn=suPrice-gomePrice;
        if(lowJd >0 || lowSn>0){
            compareObj.put("time", dt);
        }
        if(lowJd>0)compareObj.put("jd", new BasicDBObject("low", Double.parseDouble(df.format(lowJd))).append("price", jdPrice));
        if(lowSn>0)compareObj.put("sn", new BasicDBObject("low", Double.parseDouble(df.format(lowSn))).append("price", suPrice));
        return  compareObj;
    }

    private double getPriceInfo(JSONArray smartInfo,String priceTag){
        return smartInfo
                .parallelStream()
                .filter((Object data) -> {
                    String jdP = CommonUtils.formatPrice(((JSONObject) data).getString(priceTag));
                    return StringUtils.isNotBlank(jdP) && !StringUtils.equals("-1", jdP) && !jdP.contains("?") && !jdP.equals("已下架");
        })
       .mapToDouble((Object data) -> Double.parseDouble(CommonUtils.formatPrice(((JSONObject) data).getString(priceTag))))
       .min().orElseGet(() -> 0);
    }

//    private JSONObject getLowPriceObj(JSONArray smartInfo,String priceTag){
//        return (JSONObject)smartInfo
//                .parallelStream()
//                .filter((Object data) -> {
//                    String jdP = ((JSONObject) data).getString(priceTag);
//                    return StringUtils.isNotBlank(jdP) && !StringUtils.equals("-1", jdP) && !jdP.contains("?") && !jdP.equals("已下架");
//                })
//                .sorted((obj1,obj2)->{
//                    String obj1Price = ((JSONObject) obj1).getString(priceTag);
//                    String obj2Price = ((JSONObject) obj2).getString(priceTag);
//                    return Double.parseDouble(CommonUtils.formatPrice(obj1Price))<Double.parseDouble(CommonUtils.formatPrice(obj2Price))?-1:1;
//                }).findFirst().orElse(new JSONObject());
//    }

}
