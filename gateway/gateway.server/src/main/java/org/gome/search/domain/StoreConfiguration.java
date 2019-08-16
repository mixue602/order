package org.gome.search.domain;

import com.alibaba.fastjson.JSONObject;
import org.gome.search.ssdb.util.KeyValue;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.lang.reflect.Method;
import java.util.stream.Stream;

/**
 * Created by doujintong on 16-9-9.
 */
@Component
@ConfigurationProperties(
        prefix = "spring.gateway"
)
public class StoreConfiguration {

    private Logger logger = LoggerFactory.getLogger(StoreConfiguration.class);

    private boolean ableTrace;
    private boolean ableCache;
    private boolean ableHystrix;
    private String kafka;
    private String redisCluster;
    private String mongoCluster;
    private String smartCollName;
    private String smartDbName;
    private String contextNameT3;
    private String contextNameT6;
    private String stageCssServer;
    private String stageJsServer;
    private String stageImageServer;
    private String staSite;
    private String dynSite;
    private String productSite;
    private String searchSite;
    private String listSite;
    private String mSearchSite;
    private String mlistSite;
    private String brandSite;
    private String apiSite;
    private String pictureserver;
    private String cookieDomain;
    private String ssoLoginURL;
    private String ssoRegisterURL;
    private String secureURL;
    private String sdbServer;
    private int sdbTll=60;
    private int sdbTllD=3600;
    private boolean ableMetrics;
    private String metricsUrl="";
    private String contrastCollName;
    private String flightDomain="";
    private String region;
    private boolean regionHash;

    public String getMetricsUrl() {
        return metricsUrl;
    }

    public void setMetricsUrl(String metricsUrl) {
        this.metricsUrl = metricsUrl;
    }

    public boolean isAbleMetrics() {
        return ableMetrics;
    }

    public void setAbleMetrics(boolean ableMetrics) {
        this.ableMetrics = ableMetrics;
    }

    public int getSdbTll() {
        return sdbTll;
    }

    public void setSdbTll(int sdbTll) {
        this.sdbTll = sdbTll;
    }

    public int getSdbTllD() {
        return sdbTllD;
    }

    public void setSdbTllD(int sdbTllD) {
        this.sdbTllD = sdbTllD;
    }

    public String getSdbServer() {
        return sdbServer;
    }

    public void setSdbServer(String sdbServer) {
        this.sdbServer = sdbServer;
    }

    public boolean isAbleHystrix() {
        return ableHystrix;
    }

    public void setAbleHystrix(boolean ableHystrix) {
        this.ableHystrix = ableHystrix;
    }
    public boolean isAbleTrace() {
        return ableTrace;
    }

    public boolean isAbleCache() {
        return ableCache;
    }

    public void setAbleCache(boolean ableCache) {
        this.ableCache = ableCache;
    }

    public void setAbleTrace(boolean ableTrace) {
        this.ableTrace = ableTrace;
    }

    public String getContextNameT3() {
        return contextNameT3;
    }

    public void setContextNameT3(String contextNameT3) {
        this.contextNameT3 = contextNameT3;
    }

    public String getContextNameT6() {
        return contextNameT6;
    }

    public void setContextNameT6(String contextNameT6) {
        this.contextNameT6 = contextNameT6;
    }

    public String getKafka() {
        return kafka;
    }

    public void setKafka(String kafka) {
        this.kafka = kafka;
    }


    public String getStageCssServer()
    {
        return stageCssServer;
    }

    public void setStageCssServer(String stageCssServer)
    {
        this.stageCssServer = stageCssServer;
    }

    public String getStageJsServer()
    {
        return stageJsServer;
    }

    public void setStageJsServer(String stageJsServer)
    {
        this.stageJsServer = stageJsServer;
    }

    public String getStageImageServer()
    {
        return stageImageServer;
    }

    public void setStageImageServer(String stageImageServer)
    {
        this.stageImageServer = stageImageServer;
    }

    public String getStaSite()
    {
        return staSite;
    }

    public void setStaSite(String staSite)
    {
        this.staSite = staSite;
    }

    public String getDynSite()
    {
        return dynSite;
    }

    public void setDynSite(String dynSite)
    {
        this.dynSite = dynSite;
    }

    public String getProductSite()
    {
        return productSite;
    }

    public void setProductSite(String productSite)
    {
        this.productSite = productSite;
    }

    public String getSearchSite()
    {
        return searchSite;
    }

    public void setSearchSite(String searchSite)
    {
        this.searchSite = searchSite;
    }

    public String getListSite()
    {
        return listSite;
    }

    public void setListSite(String listSite)
    {
        this.listSite = listSite;
    }

    public String getmSearchSite()
    {
        return mSearchSite;
    }

    public void setmSearchSite(String mSearchSite)
    {
        this.mSearchSite = mSearchSite;
    }

    public String getMlistSite()
    {
        return mlistSite;
    }

    public void setMlistSite(String mlistSite)
    {
        this.mlistSite = mlistSite;
    }

    public String getBrandSite()
    {
        return brandSite;
    }

    public void setBrandSite(String brandSite)
    {
        this.brandSite = brandSite;
    }

    public String getApiSite()
    {
        return apiSite;
    }

    public void setApiSite(String apiSite)
    {
        this.apiSite = apiSite;
    }

    public String getPictureserver()
    {
        return pictureserver;
    }

    public void setPictureserver(String pictureserver)
    {
        this.pictureserver = pictureserver;
    }

    public String getCookieDomain()
    {
        return cookieDomain;
    }

    public void setCookieDomain(String cookieDomain)
    {
        this.cookieDomain = cookieDomain;
    }

    public String getSsoLoginURL()
    {
        return ssoLoginURL;
    }

    public void setSsoLoginURL(String ssoLoginURL)
    {
        this.ssoLoginURL = ssoLoginURL;
    }

    public String getSsoRegisterURL()
    {
        return ssoRegisterURL;
    }

    public void setSsoRegisterURL(String ssoRegisterURL)
    {
        this.ssoRegisterURL = ssoRegisterURL;
    }

    public String getSecureURL()
    {
        return secureURL;
    }

    public void setSecureURL(String secureURL)
    {
        this.secureURL = secureURL;
    }

    public void setRedisCluster(String redisCluster) {
        this.redisCluster = redisCluster;
    }

    public void setMongoCluster(String mongoCluster) {
        this.mongoCluster = mongoCluster;
    }

    public void setSmartCollName(String smartCollName) {
        this.smartCollName = smartCollName;
    }

    public void setSmartDbName(String smartDbName) {
        this.smartDbName = smartDbName;
    }

    public void setContrastCollName(String contrastCollName) {
        this.contrastCollName = contrastCollName;
    }

    public String getRedisCluster() {
        return redisCluster;
    }
    public String getMongoCluster() {
        return mongoCluster;
    }
    public String getSmartCollName() {
        return smartCollName;
    }
    public String getFlightDomain() {
        return flightDomain;
    }

    public void setFlightDomain(String flightDomain) {
        this.flightDomain = flightDomain;
    }
    public String getSmartDbName() {return smartDbName;}
    public String getContrastCollName() {return contrastCollName;}

    public String getRegion() {
        return region;
    }

    public void setRegion(String region) {
        this.region = region;
    }

    public boolean isRegionHash() {
        return regionHash;
    }

    public void setRegionHash(boolean regionHash) {
        this.regionHash = regionHash;
    }

    public void setFiled(KeyValue keyValue) {
        String key=keyValue.getKey();
        String value=keyValue.getValue();
        Object chValue=null;
        try {
            Class<?> claszz=this.getClass().getDeclaredField(key).getType();
            switch (claszz.getSimpleName()){
                case "int":chValue=Integer.parseInt(value);break;
                case "boolean":chValue=Boolean.parseBoolean(value);break;
                case "String":chValue=value;break;
                default:break;
            }
            if(chValue==null)return;
            String setter="set"+key.substring(0,1).toUpperCase()+key.substring(1);
            Method iv = this.getClass().getDeclaredMethod(setter, claszz);
            iv.invoke(this, new Object[]{chValue});
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void println(){
        JSONObject data=new JSONObject();
        Stream.of(this.getClass().getDeclaredFields())
                .forEach(item->{
                    item.setAccessible(true);
                    try {
                        data.put(item.getName(),item.get(this));
                    } catch (IllegalAccessException e) {
                        e.printStackTrace();
                    }
                });
        logger.info("storeConfig :{}"+data);
    }
}
