package com.gome.search.test;

import org.gome.search.redis.IOClientFactory;
import org.gome.search.redis.IORedisClient;
import redis.clients.jedis.Jedis;
import redis.clients.jedis.ScanParams;
import redis.clients.jedis.ScanResult;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Created by doujintong on 17-11-27.
 */
public class RedisBack {

    public static void main(String[] args) {
        IORedisClient jedis= IOClientFactory.redisClient("10.58.69.34:8000");
        jedis.getMajor().getClusterNodes().values()
                .forEach(jedisPool -> {
                    String scanCursor = "0";
                    do {
                        Jedis resource= jedisPool.getResource();//(p@|np@|ent_p@)*
                        ScanResult<String> scan=resource.scan(scanCursor, new ScanParams().match("ent_p@*"));
                        scanCursor = scan.getStringCursor();
                        List<String> scanResult = scan.getResult();
                        for (String key : scanResult) {
                            System.out.println("scanCursor:"+scanCursor+"  keys:------------"+key);
                            //hashKeys.add(key);
                            jedis.del(key);
                        }
                        resource.close();
                    } while (!scanCursor.equals("0"));
                });
//        hashKeys.forEach(hashKey->{
//            int cursor = 0;
//            ScanParams scanParams = new ScanParams();
//            scanParams.match("*");
//            ScanResult<Map.Entry<String, String>> scanResult;
//            List<Map.Entry<String, String>> list = new ArrayList<Map.Entry<String, String>>();
//            do {
//                scanResult = jedis.hscan(hashKey, String.valueOf(cursor), scanParams);
//                list.addAll(scanResult.getResult());
//                cursor = Integer.parseInt(scanResult.getStringCursor());
//                System.out.println(list);
//            } while (cursor > 0);
//        });
    }
}
