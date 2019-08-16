package org.gome.search.router;

import org.gome.search.cache.MemoryCacheBean;
import org.gome.search.domain.StoreConfiguration;
import org.gome.search.redis.IORedisClient;
import org.gome.search.ssdb.util.KeyValue;
import org.gome.search.utils.KryoUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import redis.clients.jedis.BinaryJedisPubSub;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by doujintong on 17-10-26.
 */
@Component
public class EbusMessage {

    private Logger logger = LoggerFactory.getLogger(EbusMessage.class);

    @Autowired
    private IORedisClient redisClient;
    @Autowired
    private StoreConfiguration storeConfiguration;

    @Autowired
    private MemoryCacheBean memoryCacheBean;

    private Map<String,String> channels=new HashMap<>();

    private String channel=System.getProperty("region")+"@GATEWAY-MSG-EBUS";

    private String cacheChannel = "GC1-T3@GATEWAY-CACHE-RELOAD";

    private Thread subcribeThread;

    private Thread subcribeCacheReload;

    public Map<String, String> getChannels() {
        return channels;
    }

    public String getChannel() {
        return channel;
    }

    @PostConstruct
    public void init(){
        channels.put("GC1","GC1@GATEWAY-MSG-EBUS");
        channels.put("GC3","GC3@GATEWAY-MSG-EBUS");
    }

    @PreDestroy
    public void destory(){
        subcribeThread.interrupt();
    }


    @PostConstruct
    public void subcribe(){
        subcribeThread=new Thread(()->{
            redisClient.subscribe(new MsgSubcriber(),channel.getBytes());
        });
        subcribeThread.start();

        subcribeCacheReload = new Thread(()->{
            redisClient.subscribe(new CacheReloadMessage(),cacheChannel.getBytes());
        });
        subcribeCacheReload.start();

    }

    public long send(String channel,KeyValue keyValue) {
        try {
            return redisClient.publish(channel.getBytes(),(keyValue.getKey()+"-"+keyValue.getValue()).getBytes());//KryoUtil.objectToBytes(keyValue)
        } catch (Exception e) {
            e.printStackTrace();
        }
        return -1;
    }

    private class MsgSubcriber extends BinaryJedisPubSub{

        @Override
        public void onMessage(byte[] channel, byte[] message) {
            try {
                String[] mes=new String(message).split("-");
                KeyValue keyValue=new KeyValue(mes[0],mes[1]); //KryoUtil.byteToObject(message);
                storeConfiguration.setFiled(keyValue);
                //storeConfiguration.println();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    private class CacheReloadMessage extends BinaryJedisPubSub{

        @Override
        public void onMessage(byte[] channel, byte[] message) {
            try {
                memoryCacheBean.loadBannerInfoToCache();
                logger.info("receive message from redis,channel {}",new String(channel));
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

}
