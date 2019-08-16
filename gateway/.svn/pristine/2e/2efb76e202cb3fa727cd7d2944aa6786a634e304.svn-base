package org.gome.search.handler;

import org.springframework.stereotype.Service;


/**
 * Created by doujintong on 16-9-20.
 */
@Service()
public class TopKeyHandler
{
//    @Autowired
//    private SearchService searchService;
//    @Autowired
//    private IOMongoClient mongoClient;
//
//    public  LocalCache<String,Object> cache= new LocalCache<>(100,12, TimeUnit.HOURS);
//    private String keys="keys@";
//    private String categorys="categorys";
//
//    public BasicDBObject handler(HttpServletRequest req, String catId, String userId){
//        DB  dataDb = mongoClient.getDB("eye_job");
//        BasicDBObject result=new BasicDBObject();
//        result.append("isSuccess", "N");
//        if(StringUtils.equals(catId, "all")){
//            List category=(List)cache.getIfPresent(categorys+catId);
//            if(category==null){
//                category=TopKeyHandler.category(dataDb);
//                if(category!=null && !category.isEmpty())
//                    cache.put(categorys+catId,category);
//            }
//            if(category!=null && StringUtils.isNotBlank(userId)){
//                //category=TopKeyHandler.sort(redis,category,userId);
//            }
//            result.append("category", category);
//
//        }
//        List keyAndProducts=(List)cache.getIfPresent(keys+catId);
//        if(keyAndProducts==null){
//            keyAndProducts = keyAndProduct(dataDb, catId, req);
//            if(keyAndProducts!=null && !keyAndProducts.isEmpty())
//                cache.put(keys+catId,keyAndProducts);
//        }
//        result.append("keys",keyAndProducts);
//        result.append("isSuccess", "Y");
//       return result;
//    }
//
//    public static List<DBObject> category(DB dataDb){
//        Map<String,Long> mergeData=((List<DBObject>)(
//                dataDb.getCollection("tbl_category_ctr")
//                        .findOne(new BasicDBObject("time", DateUtil.formatDate(new Date())))
//                        .get("data")))
//                .stream()
//                .map(item->{
//                    BasicDBObject tmpItem=new BasicDBObject();
//                    tmpItem.append("catId",item.get("c2id").toString()+"|"+item.get("c2name").toString());
//                    tmpItem.append("cnt",item.get("cnt"));
//                    return tmpItem;
//                })
//                .collect(Collectors.groupingBy(item -> (item.getString("catId", "")), Collectors.summingLong(item -> (item.getLong("cnt", 0)))));
//        List result=new ArrayList(mergeData.entrySet());
//        result=(List)result.stream()
//                .map(item -> {
//                    BasicDBObject tmpItem = new BasicDBObject();
//                    String cat = ((Map.Entry<String, Long>) item).getKey();
//                    tmpItem.append("catId", cat.split("\\|")[0]);
//                    tmpItem.append("catName", cat.split("\\|")[1]);
//                    tmpItem.append("cnt", ((Map.Entry<String, Long>) item).getValue());
//                    return tmpItem;
//                })
//                .sorted((item1, item2) -> ((int) (((BasicDBObject) item2).getLong("cnt", 0) - ((BasicDBObject) item1).getLong("cnt", 0))))
//                .collect(Collectors.toList());
//        List data=result.subList(0,20);
//        return data;
//    }
//
//
//    public List<DBObject> keyAndProduct(DB dataDb, String catId, HttpServletRequest req){
//        List<DBObject> result = null;
//        if(StringUtils.equals("all",catId)){
//            result=keyAndProductAll(dataDb);
//        }else{
//            result=keyAndProductCat(dataDb,catId);
//        }
//        if(result==null || result.size()<1)return null;
//        BasicDBList resultList=new BasicDBList();
//        result.forEach((item) -> {
//            List data = (List) item.get("data");
//            if (data != null) resultList.addAll(data);
//        });
//        Map<String,Long> mergeData=resultList
//                .stream()
//                .collect(Collectors.groupingBy(item -> (((BasicDBObject) item).getString("question", "")), Collectors.summingLong(item -> (((BasicDBObject) item).getLong("cnt", 0)))));
//        List<DBObject> first=(List<DBObject>)(result.get(0)).get("data");
//        first=first.stream()
//                .map(item -> {
//                    return dealNodeData(item, mergeData, catId, req);
//                }).filter(item -> item.getInt("state", 0) == 1)
//                .sorted((item2, item3) -> {
//                    return (int) ((item3).getLong("cnt", 0) - (item2).getLong("cnt", 0));
//                })
//                .collect(Collectors.toList());
//        return first.size()>30?first.subList(0,30):first;
//    }
//    private static BasicDBObject buider(){
//        String sDate= DateUtil.formatDate(new Date());
//        return new BasicDBObject("$gt", DateUtil.formatDate(DateUtil.addDay(sDate, -5))).append("$lte", sDate);
//    }
//
//    private  BasicDBObject dealNodeData(Object item, Map<String,Long> mergeData,String catId, HttpServletRequest req){
//        BasicDBObject tmp = (BasicDBObject) item;
//        tmp.append("cnt", mergeData.getOrDefault(tmp.getString("question", ""), 0l));
//        mergeData.remove(tmp.getString("question", ""));
//        String id=null;
//        if(StringUtils.equals("all",catId)){
//            id=(tmp.getString("_c2","").replace("-", ":").trim() + "|" + tmp.getString("_c3","").replace("-", ":").trim() + "|" +tmp.getString("_c4","").replace("-", ":").trim() + "|" + tmp.getString("_c5","").replace("\\]", "").replace("-", ":").trim());
//        }else{
//            String[] ids=(tmp.getString("productinfo","")).replace("-", ":").split("\\|");
//            if(ids.length>=4){
//                id=((ids[0].replace("[","")).replace("]","")).trim()+"|"+((ids[1].replace("[","")).replace("]","")).trim()+"|"+((ids[2].replace("[","")).replace("]","")).trim()+"|"+((ids[3].replace("[","")).replace("]","")).trim();
//            }
//            tmp.append("question",tmp.getString("question","").split("\\|")[1]);
//        }
//        String regionId = CommonUtils.getRegionId(req);
//        int i=0;
//        JSONObject appresult =null;
//        while(i<3){
//            i++;
//            appresult=(JSONObject)searchService.compareProductHandle(0, id, regionId).getContent();
//            if(appresult!=null)
//                break;
//        }
//        tmp.append("state", 0);
//        if (appresult != null) {
//                tmp.append("state", 1);
//                  List items=appresult.getJSONArray("items").stream()
//                        .map((item1) -> {
//                            JSONObject tmpItem = (JSONObject) item1;
//                            tmpItem.put("pls", tmpItem.get("pls") == null ? "0" : tmpItem.get("pls"));
//                            tmpItem.remove("pUrl");
//                            tmpItem.remove("price");
//                            tmpItem.remove("stock");
//                            tmpItem.remove("isGomeart");
//                            tmpItem.remove("pName");
//                            return tmpItem;
//                        }).collect(Collectors.toList());
//                tmp.append("items", items);
//                tmp.remove("_c2");tmp.remove("_c3");tmp.remove("_c4");tmp.remove("_c5");tmp.remove("productinfo");
//        }
//        return tmp;
//    }
//
//    private  static List<DBObject> keyAndProductAll(DB dataDb){
//        return dataDb
//                .getCollection("tbl_search_product_ctr")
//                .find(new BasicDBObject("time", buider()))
//                .sort(new BasicDBObject("time", -1))
//                .toArray();
//    }
//
//    private  static List<DBObject> keyAndProductCat(DB dataDb,String catId){
//        List<DBObject> result=dataDb
//                .getCollection("tbl_category_ctr")
//                .find(new BasicDBObject("time", buider()))
//                .sort(new BasicDBObject("time", -1))
//                .toArray();
//        result.forEach(item -> {
//            List data = (List) item.get("data");
//            data = (List) data.stream()
//                    .filter(item1 -> (((BasicDBObject) item1).getString("c2id", "").startsWith(catId)))
//                    .map(item1 -> {
//                        BasicDBObject tmpItem = new BasicDBObject();
//                        tmpItem.append("question", ((BasicDBObject) item1).getString("c2id", "") + "|" + ((BasicDBObject) item1).getString("question", ""));
//                        tmpItem.append("cnt", ((BasicDBObject) item1).getLong("cnt", 0));
//                        tmpItem.append("productinfo", ((BasicDBObject) item1).getString("productinfo", ""));
//                        return tmpItem;
//                    })
//                    .sorted((item2, item3) -> {
//                        return (int) (((BasicDBObject) item3).getLong("cnt", 0) - ((BasicDBObject) item2).getLong("cnt", 0));
//                    })
//                    .collect(Collectors.toList());
//            item.put("data", data.size()>50?data.subList(0, 50):data);
//        });
//        return result;
//    }
//
///*    public static List sort(JedisCluster jedisCluster,List category,String userId) {
//        String data=jedisCluster.get("3F:" + userId);
//        String redisOutData  = gunzip(data);
//        JSONObject jsonObj2 = JSON.parseObject(redisOutData);
//        if(jsonObj2==null)return category;
//        Map<String,Double> userCats=new HashMap<>();
//        jsonObj2.getJSONArray("cat2_3m")//cat2_7d_search
//                .forEach(item -> {
//                    userCats.put(((JSONObject) item).getString("tagname"), Double.parseDouble(((JSONObject) item).getString("weight")) * 10000);
//                });
//        category.sort((first, second) -> {
//            BasicDBObject item1 = (BasicDBObject) first;
//            BasicDBObject item2 = (BasicDBObject) second;
//            Double addValue1 = userCats.get((item1.getString("catId", "")));
//            Double addValue2 = userCats.get((item2.getString("catId", "")));
//            long v1=item1.getLong("cnt", 0);
//            long v2=item2.getLong("cnt", 0);
//            if (addValue1 != null)
//                v1+=addValue1.longValue();
//            if (addValue2 != null)
//                v2+=addValue2.longValue();
//            return (int) (v2 - v1);
//        });
//        return category;
//    }*/
//
//    private  static String gunzip(String compressedStr){
//        if(compressedStr==null){
//            return null;
//        }
//        ByteArrayOutputStream out= new ByteArrayOutputStream();
//        ByteArrayInputStream in=null;
//        GZIPInputStream ginzip=null;
//        byte[] compressed=null;
//        String decompressed = null;
//        try {
//            compressed = new sun.misc.BASE64Decoder().decodeBuffer(compressedStr);
//            in=new ByteArrayInputStream(compressed);
//            ginzip=new GZIPInputStream(in);
//
//            byte[] buffer = new byte[1024];
//            int offset = -1;
//            while ((offset = ginzip.read(buffer)) != -1) {
//                out.write(buffer, 0, offset);
//            }
//            decompressed=out.toString();
//        } catch (IOException e) {
//            e.printStackTrace();
//        } finally {
//            if (ginzip != null) {
//                try {
//                    ginzip.close();
//                } catch (IOException e) {
//                }
//            }
//            if (in != null) {
//                try {
//                    in.close();
//                } catch (IOException e) {
//                }
//            }
//            if (out != null) {
//                try {
//                    out.close();
//                } catch (IOException e) {
//                }
//            }
//        }
//
//        return decompressed;
//    }

}
