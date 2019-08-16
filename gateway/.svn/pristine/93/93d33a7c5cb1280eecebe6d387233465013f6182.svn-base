package org.gome.search.trace;

import io.totem.settings.NetUtil;
import okhttp3.OkHttpClient;
import org.apache.catalina.connector.Connector;
import org.apache.coyote.ProtocolHandler;
import org.apache.tomcat.util.threads.ThreadPoolExecutor;
import org.gome.search.domain.StoreConfiguration;
import org.gome.search.ssdb.conf.Cluster;
import org.gome.search.ssdb.conf.Server;
import org.gome.search.ssdb.sharding.ConsistentHashSharding;
import org.influxdb.InfluxDB;
import org.influxdb.InfluxDBFactory;
import org.influxdb.dto.BatchPoints;
import org.influxdb.dto.Point;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeansException;
import org.springframework.boot.actuate.endpoint.PublicMetrics;
import org.springframework.boot.actuate.metrics.Metric;
import org.springframework.boot.context.embedded.EmbeddedServletContainer;
import org.springframework.boot.context.embedded.EmbeddedWebApplicationContext;
import org.springframework.boot.context.embedded.tomcat.TomcatEmbeddedServletContainer;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

public class AdvancedMetrics implements PublicMetrics,ApplicationContextAware {

    private ApplicationContext applicationContext;

    private Map<String,InfluxDB> influxDB;

    private ConsistentHashSharding serversShading;

    private BatchPoints batchPoints;

    private StoreConfiguration storeConfiguration;

    private static Map<String,Object> metrics=new ConcurrentHashMap<>();

    private Logger logger = LoggerFactory.getLogger(AdvancedMetrics.class);


    @Override
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        this.applicationContext = applicationContext;
    }

    @Override
    public Collection<Metric<?>> metrics() {
        if (this.applicationContext instanceof EmbeddedWebApplicationContext) {
            EmbeddedServletContainer embeddedServletContainer = ((EmbeddedWebApplicationContext)applicationContext)
                    .getEmbeddedServletContainer();
            if (embeddedServletContainer instanceof TomcatEmbeddedServletContainer) {
                Connector connector = ((TomcatEmbeddedServletContainer) embeddedServletContainer).getTomcat().getConnector();
                ProtocolHandler handler = connector.getProtocolHandler();
                org.apache.tomcat.util.threads.ThreadPoolExecutor executor = (ThreadPoolExecutor) handler.getExecutor();
                //register tomcat thread pool stat
                List<Metric<?>> metrics = new ArrayList<Metric<?>>();
                metrics.add(new Metric<Integer>("tomcat.threads.active_count",executor.getActiveCount()));
                metrics.add(new Metric<Integer>("tomcat.threads.largest_pool_size",executor.getLargestPoolSize()));
                metrics.add(new Metric<Long>("tomcat.threads.task_count",executor.getTaskCount()));
                metrics.add(new Metric<Long>("tomcat.threads.completed_task_count",executor.getCompletedTaskCount()));
                metrics.add(new Metric<Integer>("tomcat.threads.submitted_count",executor.getSubmittedCount()));
                metrics.add(new Metric<Integer>("tomcat.threads.pool_size",executor.getPoolSize()));
                metrics.add(new Metric<Integer>("tomcat.threads.core_pool_size",executor.getCorePoolSize()));
                metrics.add(new Metric<Integer>("tomcat.threads.max_pool_size",executor.getMaximumPoolSize()));
                return metrics;
            }
            //https://my.oschina.net/mkh/blog/312911
        }
        return Collections.emptySet();
    }



    public  void init(){
        if(storeConfiguration.isAbleMetrics()){
            if(influxDB==null){
                influxDB=new ConcurrentHashMap<>();
                List<Cluster> clusters=new ArrayList<>();
                String[] serviceIp=storeConfiguration.getMetricsUrl().split(",");
                synchronized (InfluxDB.class){
                    OkHttpClient.Builder okHttpClient=new OkHttpClient.Builder()
                            .connectTimeout(3000, TimeUnit.MILLISECONDS)
                            .writeTimeout(3000, TimeUnit.MILLISECONDS);
                    for (int i = 0; i < serviceIp.length; i++) {
                        influxDB.put(serviceIp[i].split(":")[0],InfluxDBFactory.connect("http://"+serviceIp[i], "root", "root", okHttpClient));
                        clusters.add(new Cluster(new Server(serviceIp[i].split(":")[0], Integer.parseInt(serviceIp[i].split(":")[1]))));
                    }
                    serversShading=new ConsistentHashSharding(clusters);
                    serversShading.initClusters();
                    batchPoints=BatchPoints.database("gateway")
                            .retentionPolicy("5_h")
                            .tag("host", NetUtil.networkIP().toString())
                            .consistency(InfluxDB.ConsistencyLevel.ONE)
                            .build();
                }
            }
        }
    }


    public void writeMetrics(Map<String,Object> metricsMap){
        if(storeConfiguration.isAbleMetrics()){
            Map<String,Object> result=new HashMap<>();
            metricsMap.forEach((key, value) -> {
                if (!key.startsWith("gauge.hystrix")) {
                    Object newValue = value;
                    if (key.startsWith("counter.status")) {
                        Object oldValue = metrics.get(key);
                        switch (value.getClass().getSimpleName()) {
                            case "Integer":
                                newValue = oldValue == null ? value : ((int) value - (int) oldValue);
                                break;
                            case "Double":
                                newValue = oldValue == null ? value : ((double) value - (double) oldValue);
                                break;
                            case "Float":
                                newValue = oldValue == null ? value : ((float) value - (float) oldValue);
                                break;
                            case "Long":
                                newValue = oldValue == null ? value : ((long) value - (long) oldValue);
                                break;
                            default:
                                newValue = value;
                                break;
                        }
                    }
                    metrics.put(key, value);
                    result.put(key, newValue);
                }
            });
            Point point=Point.measurement("gateway_metrics")
                    .time(System.currentTimeMillis(), TimeUnit.MILLISECONDS)
                    .tag("host", NetUtil.networkIP().toString())
                    .fields(result)
                    .build();
            //batchPoints.point(point);
            String port=applicationContext.getEnvironment().getProperty("local.server.port");
            hashServer(NetUtil.networkIP().toString()+port).write(9080,point);
        }
    }


    public InfluxDB hashServer(String key) {
        if(serversShading==null || influxDB==null || influxDB.isEmpty())
            return null;
        Server server=serversShading.getClusterByKey(key).getServers().get(0);
        return influxDB.get(server.getHost());

    }

    public void setStoreConfiguration(StoreConfiguration storeConfiguration) {
        this.storeConfiguration = storeConfiguration;
    }

    public static void main(String[] args) {
        String[] serviceIp=new String[]{"1","2","3"};
        for (int i = 0; i < 1000; i++) {
            System.out.println(serviceIp[new Random().nextInt(serviceIp.length)]);
        }
    }
}