package org.gome.search.router;

import akka.routing.ConsistentHash;
import io.totem.invoker.DefaultInvoker;
import io.totem.plugin.TotemManager;
import org.apache.commons.lang3.StringUtils;
import org.gome.search.domain.StoreConfiguration;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.t3.service.eye.invoker.EyeBusinessServiceInvoker;
import org.t3.service.help.invoker.HelperApiInvoker;
import org.t3.service.search.invoker.PageApiInvoker;
import org.t6.service.search.invoker.SearchApiInvoker;

import javax.annotation.PostConstruct;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * Created by doujintong on 17-10-25.
 */
@Configuration
public class RpcInvokerFactory{

    private Logger logger= LoggerFactory.getLogger(RpcInvokerFactory.class);

    private String regionPrefix="";

    private ConsistentHash<REGION> consistentHash=ConsistentHash.create(Stream.of(REGION.values()).collect(Collectors.toList()),20);

    public enum REGION{
        GC1,GC3;
    }

    private Map<String,PageApiInvoker> pageApiInvokers=new HashMap<>();

    private Map<String,SearchApiInvoker> searchApiInvokers=new HashMap<>();

    @Autowired
    private StoreConfiguration storeConfiguration;

    @Autowired
    private TotemManager totemManager;

    private DefaultInvoker instance;


    public PageApiInvoker pageApi(String key){
        return pageApiInvokers.get(hash(key).name());
    }

    public SearchApiInvoker searchApi(String key){
        return searchApiInvokers.get(hash(key).name());
    }

    private REGION hash(String key){
        if(!storeConfiguration.isRegionHash() || StringUtils.isBlank(key))
            return REGION.valueOf(storeConfiguration.getRegion());
        return consistentHash.nodeFor(key);
    }

    @Bean
    public TotemManager totemManager(){
        TotemManager totemManager=new TotemManager();
        totemManager.startup();
        return totemManager;
    }

    @PostConstruct
    public void initInvoker(){
        instance= totemManager.getInstance(DefaultInvoker.class);

        PageApiInvoker pageApiInvoker=new PageApiInvoker(instance);
        pageApiInvoker.setDataCenter(regionPrefix+REGION.GC1.name());
        pageApiInvokers.put(REGION.GC1.name(),pageApiInvoker);


        PageApiInvoker pageApiInvoker3=new PageApiInvoker(instance);
        pageApiInvoker3.setDataCenter(regionPrefix+REGION.GC3.name());
        pageApiInvokers.put(REGION.GC3.name(),pageApiInvoker3);


        SearchApiInvoker searchApiInvoker=new SearchApiInvoker(instance);
        searchApiInvoker.setDataCenter(regionPrefix+REGION.GC1.name());
        searchApiInvokers.put(REGION.GC1.name(),searchApiInvoker);


        SearchApiInvoker searchApiInvoker3=new SearchApiInvoker(instance);
        searchApiInvoker3.setDataCenter(regionPrefix+REGION.GC3.name());
        searchApiInvokers.put(REGION.GC3.name(),searchApiInvoker3);
    }


    @Bean
    public EyeBusinessServiceInvoker getEyeBusinessServiceInvoker(){
        return new EyeBusinessServiceInvoker(instance);
    }

    @Bean
    public HelperApiInvoker getHelperApiInvoker(){
        return new HelperApiInvoker(instance);
    }

    public static void main(String[] args) {
        ConsistentHash consistentHash1=ConsistentHash.create(Stream.of(REGION.values()).collect(Collectors.toList()),20);
        System.out.println(consistentHash1.nodeFor("doujintong"));
    }
}
