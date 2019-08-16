package org.gome.search.cache;

import org.apache.commons.pool2.impl.GenericObjectPoolConfig;
import org.gome.search.domain.SearchResponse;
import org.gome.search.domain.StoreConfiguration;
import org.gome.search.kafka.KafkaProvideTask;
import org.gome.search.ssdb.SsdbClient;
import org.gome.search.ssdb.conf.Cluster;
import org.gome.search.ssdb.conf.Server;
import org.gome.search.ssdb.sharding.ConsistentHashSharding;
import org.gome.search.ssdb.util.KeyValue;
import org.gome.search.ssdb.util.Processor;
import org.gome.search.utils.CommonUtils;
import org.gome.search.utils.KryoUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;
import org.xerial.snappy.Snappy;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Properties;
import java.util.concurrent.CompletableFuture;


@Component
public class NetLevelDB<T> {

    private Logger logger = LoggerFactory.getLogger(NetLevelDB.class);


    @Autowired
    private SsdbClient ssdbClient;

    @Autowired
    private StoreConfiguration storeConfiguration;

    @Autowired
    private KafkaProvideTask kafkaProvideTask;

    @Bean
    public SsdbClient ssdbClient(StoreConfiguration storeConfiguration){
        if (storeConfiguration.isAbleCache()) {
            String[] servers=storeConfiguration.getSdbServer().split(",");
            List<Cluster> sdbServer=new ArrayList<>();
            for (String server : servers) {
                String[] ipPort=server.split(":");
                Server server1=new Server(ipPort[0],Integer.parseInt(ipPort[1]));
                server1.setPoolConfig(createPoolConfig());
                sdbServer.add(new Cluster(server1));
            }
            return new SsdbClient(new ConsistentHashSharding(sdbServer));
        }
        return null;
    }


    @Bean
    public KafkaProvideTask kafkaProvideTask(){
        if (storeConfiguration.isAbleCache()) {
            Properties props = new Properties();
            props.put("bootstrap.servers", storeConfiguration.getKafka());
            props.put("value.serializer", "org.apache.kafka.common.serialization.ByteArraySerializer");
            props.put("key.serializer", "org.apache.kafka.common.serialization.StringSerializer");
            props.put("acks", "0");
            props.put("retries",1);
            return new KafkaProvideTask(props,"");
        }
        return null;
    }

    private GenericObjectPoolConfig createPoolConfig(){
        GenericObjectPoolConfig config=new GenericObjectPoolConfig();
        config.setMaxIdle(50);
        config.setMinIdle(3);
        config.setMaxTotal(100);
        config.setMaxWaitMillis(3000);
        config.setMinEvictableIdleTimeMillis(60000L);
        config.setTimeBetweenEvictionRunsMillis(30000L);
        config.setNumTestsPerEvictionRun(-1);
        return config;
    }

    /**
     * 返回一个对象
     * @param key
     * @return
     * @throws java.io.IOException
     */
    public Object get(String key) {
        //反解压缩
        Object object = null;
        try {
            byte[] bytes = ssdbClient.getBytes(key);
            if (bytes == null || bytes.length < 5) {
                return null;
            }
            byte[] json = Snappy.uncompress(bytes);
            object = KryoUtil.byteToObject(json);
        } catch (Exception e) {
            logger.error("get", e);
        }
        return object;
    }

    public Object getResult(String prefix, Object req, int env) {
        String key = append(storeConfiguration.getRegion()+"@",prefix,"@", CommonUtils.objToString(req).hashCode(),"@",env);
        Object o=get(key);
        return o instanceof SearchResponse ? o:null;
    }

    public void putResult(String prefix, Object req, int env, T value,long ttl){
        String key = append(storeConfiguration.getRegion()+"@",prefix,"@", CommonUtils.objToString(req).hashCode(),"@",env);
        put(key, value, ttl);
    }


    public void put(String prefix, String key, T value,long ttl){
        byte[] data=null;
        try {
            data=Snappy.compress(KryoUtil.objectToBytes(value));
        } catch (Exception e) {
            e.printStackTrace();
        }
        if(data==null)
            return;
        put(append(prefix, "@", key), (T)data,ttl);
    }

    public void put(String key, T value,long ttl){
        CompletableFuture.runAsync(()->{
            try {
                if(ssdbClient.exists(key)){
                    return;
                }
                byte[] data=Snappy.compress(KryoUtil.objectToBytes(value));;
                if(ttl>0)
                    ssdbClient.setx(key, data,(int)ttl);
                else
                    ssdbClient.set(key, data);
            }catch (Exception e) {
                logger.error("put", e);
            }
        });

    }

    public void putString(String key,String value,long ttl){
        try {
            if(ssdbClient.exists(key)){
                return;
            }
            if(ttl>0)
                ssdbClient.setx(key, value,(int)ttl);
            else
                ssdbClient.set(key, value);
        }catch (Exception e) {
            logger.error("put", e);
        }
    }

    public String getString(String key){
        return ssdbClient.get(key);
    }

	public void delete(String key) {
        ssdbClient.del(key);
	}

    public void setSsdbClient(SsdbClient ssdbClient) {
        this.ssdbClient = ssdbClient;
    }

    public void close() {
		this.ssdbClient.close();
	}


    public static String append(Object ... params){
        String result = "";
        for (Object param : params){
            result += param;
        }
        return result;
    }

    public void send(String newId, String oldId) {
        CompletableFuture.runAsync(()->{
            kafkaProvideTask.send("tbl_search_cache_id",newId+"-"+oldId);
        });
    }


    /**
	 * @param args
	 */
	public static void main(String[] args) {
       SsdbClient db= new SsdbClient(new ConsistentHashSharding(Arrays.asList(new Cluster(new Server("10.58.72.34", 19752)), new Cluster(new Server("10.58.72.35", 19752)))));
       db.scan("cacheReqId", 1000, new Processor<KeyValue>() {
           @Override
           public void process(KeyValue keyValue) {
               try {

                   System.out.println(keyValue.getKey()+"---"+keyValue.getValue());
               } catch (Exception e) {
                   db.del(keyValue.getKey());
                   System.out.println("error-:"+keyValue.getKey());
               }
           }
       });
//        NetLevelDB netLevelDB=new NetLevelDB();
//        netLevelDB.setSsdbClient(db);
//        System.out.println(JSON.toJSONString(netLevelDB.get("GC1@cacheReqId@16k23ycW0eI")));
    }

}
