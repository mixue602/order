package com.gome.search.test;

import com.alibaba.dubbo.config.ApplicationConfig;
import com.alibaba.dubbo.config.ReferenceConfig;
import com.alibaba.dubbo.config.RegistryConfig;
import com.alibaba.fastjson.JSONObject;
import com.alibaba.fastjson.serializer.SerializerFeature;
import org.apache.commons.lang.StringUtils;
import org.gome.search.domain.OriginModule;
import org.gome.search.domain.SearchResponse;
import org.gome.search.domain.TaoSearchRequest;
import org.gome.search.dubbo.domain.AppRequest;
import org.gome.search.dubbo.domain.AppResponse;
import org.gome.search.dubbo.idl.AppService;
import org.gome.search.dubbo.idl.AppService;
import org.gome.search.dubbo.idl.DubboService;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.Arrays;
import java.util.Scanner;

/**
 * Created by doujintong on 17-3-13.
 */
@SpringBootApplication
public class ClientApplication {

    public static void main(String[] args) {
        ApplicationConfig application=new ApplicationConfig();
        application.setName("dev-search-consumer");
        RegistryConfig registryConfig=new RegistryConfig();
        registryConfig.setProtocol("zookeeper");
        registryConfig.setAddress("10.112.179.146:2181");
        registryConfig.setTimeout(5000);

        ReferenceConfig<DubboService> reference=new ReferenceConfig<>();
        reference.setApplication(application);
        reference.setRegistry(registryConfig);
        reference.setInterface(DubboService.class);
        reference.setVersion("1.0.0");
        reference.setRetries(3);
//        AppService appService = reference.get();
          DubboService dubboService  = reference.get();

//        System.out.println("-----------myShop");
//        searchItemInMShop(appService);

//          productSearch(dubboService);

//        System.out.println("-----------DistributionItem");
//        searchDistributionItem(appService);

//        System.out.println("-----------homeShop");
//        homeViewMshop(appService);
//
//        System.out.println("-----------DistributionAll");
//        searchDistributionAll(appService);
//
//        System.out.println("-----------rebate");
//        rebateDubbo(appService);
//
//        System.out.println("-----------mainSearch");
//        appSearch(appService);

//        System.out.println("-----------enterpriseSearch");
//        enterpriseSearch(appService);

        System.out.println("------------taoSearch");
        taoSearch(dubboService);

    }

    public static void taoSearch(DubboService dubboService){

        JSONObject taoParam = new JSONObject();
        taoParam.put("question","奥克斯");
        taoParam.put("pageNumber",1);
        taoParam.put("pageSize",10);

        System.out.println(dubboService.taoSearch(taoParam));
    }

    public  static void productSearch(DubboService dubboService){
        JSONObject object = new JSONObject();
        object.put("question","冰箱");
        object.put("facets","0");
        object.put("catId","0");
        object.put("from","rebate_pc");
        object.put("pageSize",48);
        object.put("pageNumber",1);
        object.put("regionId","11010200");
        object.put("priceTag","0");
        object.put("productTag","0");
        object.put("sort","0");
        object.put("market","10");
        object.put("instock","0");
        object.put("sale","100");
//        object.put("rebatePrice","1x4");
        System.out.println(dubboService.productSearch(object));
    }

    public static void appSearch(AppService appService){//11Kr
        Scanner scanner = new Scanner(System.in);
        String word = "";
        do {
            System.out.println("请输入word");
            word = scanner.next();

            if(StringUtils.isNotBlank(word)){
                AppRequest appRequest = new AppRequest();
                appRequest.setQuestion(word);
                appRequest.setPageNumber(3);
                appRequest.setPageSize(10);
//                appRequest.setSale("100");
//                appRequest.setPriceTag(1);
//                appRequest.setPrice("1x1000");
//                appRequest.setSort("0");
//                appRequest.setCrossShop(-1);
//                appRequest.setMarket(21);
//                appRequest.setSale("100");
                appRequest.setLimitCat(false);
//        req.setFirstCatIds(Arrays.asList("cat10000000","cat10000001"));
                AppResponse response = appService.mainSearch(appRequest);
                System.out.println(JSONObject.toJSONString(response.getContent()));
            }


        }while (!"end".equals(word));

        System.out.println("您输入了end终止了执行!");
        System.exit(0);
        scanner.close();
    }

    //企业搜索接口测试方法
    public static void enterpriseSearch(AppService appService){

        AppRequest appRequest = new AppRequest();
        appRequest.setQuestion("冰箱");
        appRequest.setPageNumber(1);
        appRequest.setPageSize(15);

        System.out.println(JSONObject.toJSONString(appService.enterpriseSearch(appRequest)));
    }


    private static void searchItemInMShop(AppService appService){
//        {"question":"cc","shopId":"","shoppingCartActivityId":"","crossShop":0,"market":20,"regionId":"11010200","pageNumber":1,"pageSize":5,
// "instock":0,"productTag":0,"sort":"00","facets":"","userId":"49bcb1c4-6236-4506-b34f-8e4db5923af5#49bcb1c4-6236-4506-b34f-8e4db5923af5#49bcb1c4-6236-4506-b34f-8e4db5923af5",
// "cookieId":"m","sale":"000","priceTag":false,"from":"app_plus","limitCat":false,"mShopId":"596","explain":false,"rebate":false,"facet":false}
        AppRequest appRequest = new AppRequest();
        appRequest.setFrom("app_plus");
        appRequest.setmShopId("582");
        appRequest.setQuestion("冰箱");
        appRequest.setPageSize(5);
        appRequest.setSale("000");
        appRequest.setPageNumber(1);

        System.out.println(JSONObject.toJSONString(appService.myShopSearch(appRequest)));
    }

    private static void searchDistributionItem(AppService appService){
//        question=%E5%86%B0%E7%AE%B1&mShopId=582&sort=00&sale=111&pageSize=20&facets=101F&from=app_rebate

        AppRequest appRequest = new AppRequest();
        appRequest.setmShopId("582");
        appRequest.setFrom("app_rebate");
        appRequest.setSort("00");
        appRequest.setQuestion("冰箱");
        appRequest.setSale("111");
        appRequest.setPageNumber(1);
        appRequest.setPageSize(20);
        appRequest.setOrgId("1001");
//        appRequest.setFacets("101F");
        System.out.println(JSONObject.toJSONString(appService.distributeSearch(appRequest), SerializerFeature.WriteMapNullValue));
    }

    private static void homeViewMshop(AppService appService){
        AppRequest appRequest = new AppRequest();
        appRequest.setmShopId("1921");
        appRequest.setCategories(Arrays.asList("2"));
        appRequest.setPageSize(2);

        System.out.println(JSONObject.toJSONString(appService.shopHomeSearch(appRequest)));
    }

    private static void searchDistributionAll(AppService appService){
        AppRequest appRequest = new AppRequest();
        appRequest.setQuestion("电脑");
//        appRequest.setCatId("cat10000007");
        appRequest.setPageSize(15);
        appRequest.setPageNumber(1);
        System.out.println(JSONObject.toJSONString(appService.distributeAllSearch(appRequest)));
    }

    private static void rebateDubbo(AppService appService){
        AppRequest appRequest = new AppRequest();
        appRequest.setPageNumber(1);
        appRequest.setPageSize(15);
        appRequest.setSort("00");
        System.out.println(JSONObject.toJSONString(appService.rebateSearch(appRequest)));
    }
}

