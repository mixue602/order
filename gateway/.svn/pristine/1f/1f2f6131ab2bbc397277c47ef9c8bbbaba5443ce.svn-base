package org.gome.search.utils;

import com.mongodb.DBCollection;
import com.mongodb.ServerAddress;
import org.gome.search.mongo.IOMongoClient;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by liulina on 16-9-22.
 */
public class MongoUtils {

    public static DBCollection getMongoCollection(IOMongoClient mongoClient,String dbName, String collName) {
        return mongoClient.getCollection(dbName,collName);
    }

    public static List<ServerAddress> generateServerAddress(String hosts) {
        List<ServerAddress> address = new ArrayList<ServerAddress>();

        for(String addr : hosts.split(",")) {
            String[] hp = addr.split(":");
            int port = Integer.parseInt(hp[1]);
            address.add(new ServerAddress(hp[0], port));
        }

        return address;
    }
}
