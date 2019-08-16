package org.gome.search.ssdb;

import org.gome.search.ssdb.conf.Cluster;
import org.gome.search.ssdb.conf.Server;
import org.gome.search.ssdb.conf.Sharding;
import org.gome.search.ssdb.sharding.ConsistentHashSharding;

import java.util.Arrays;

/**
 * (description)
 * created at 15-12-4
 *
 * @author Yiding
 */
public class MultiClustersTest {

    public static void main(String[] args) {
        Sharding sharding = new ConsistentHashSharding(Arrays.asList(
                new Cluster(new Server("192.168.1.180", 8888), 100),
                new Cluster(new Server("192.168.1.180", 8889), 100)
        ));

        SsdbClient ssdbClient = new SsdbClient(sharding);
        for (int i = 100; i < 200; i++) {
            String key = "key" + i;
            String value = "value" + i;
            ssdbClient.set(key, value);
            assert ssdbClient.get(key).equals(value);
        }

        ssdbClient.close();
    }
}
