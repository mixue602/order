package org.gome.search.dubbo.domain;

import com.alibaba.fastjson.JSONObject;

import java.io.Serializable;
import java.util.List;
import java.util.Map;

/**
 * Created by doujintong on 16-9-5.
 */
public class AppRequest implements Serializable {
    private String catId;//分类Id
    private String question;//搜索词
    private String shopId;//店铺Id
    private String blueActivityId;//蓝券Id
    private String shoppingCartActivityId;//凑单Id
    private int crossShop=-1;//是否跨店铺  0或1
    private int market=20;//海外购  20，21，22
    private String regionId="11010200";  //区域Id 三级
    private String et;        //结果中搜索
    private int pageNumber=1;
    private int pageSize=1;
    private int instock=0;   //有无货
    private int productTag=0;//国美自联营
    private String sort="00";//排序
    private String facets; //facets  11strts5
    private String userId;
    private String cookieId;
    private String sale="0";
    private String price;//自定义价格
    private int priceTag;
    private String activityId;
    private String from;
    private boolean limitCat;
    private List<String> firstCatIds;
    private String rebatePrice;
    /****************************/
    private String mShopId;//美店id
    private String trId;//门店id
    private String orgId;//组织id
    private List<String> categories;

    private String reqId;

    private Map<String,Object> headers;

    private String tuanCatId;//团购分类id
    private int beginTime;
    private int couponType;//红蓝券类型　０：非全场　１：全场

    public Map<String, Object> getHeaders() {
        return headers;
    }

    public void setHeaders(Map<String, Object> headers) {
        this.headers = headers;
    }


    public String getFrom() {return from;}

    public void setFrom(String from) {
        this.from = from;
    }

    private JSONObject other=new JSONObject();

    public void setKvObj(String key,Object value){
        this.other.put(key,value);
    }

    public String getActivityId() {return activityId;}

    public void setActivityId(String activityId) {
        this.activityId = activityId;
    }

    public String getCatId() { return catId;}

    public void setCatId(String catId) {
        this.catId = catId;
    }

    public String getQuestion() {return question;}

    public void setQuestion(String question) {
        this.question = question;
    }

    public String getShopId() {return shopId;}

    public void setShopId(String shopId) {
        this.shopId = shopId;
    }

    public String getBlueActivityId() {return blueActivityId;}

    public void setBlueActivityId(String blueActivityId) {
        this.blueActivityId = blueActivityId;
    }

    public String getShoppingCartActivityId() {return shoppingCartActivityId;}

    public void setShoppingCartActivityId(String shoppingCartActivityId) {
        this.shoppingCartActivityId = shoppingCartActivityId;
    }

    public int getCrossShop() {return crossShop;}

    public void setCrossShop(int crossShop) {
        this.crossShop = crossShop;
    }

    public int getMarket() {return market;}

    public void setMarket(int market) {
        this.market = market;
    }

    public String getRegionId() {return regionId;}

    public void setRegionId(String regionId) {
        this.regionId = regionId;
    }

    public String getEt() {return et;}

    public void setEt(String et) {
        this.et = et;
    }

    public int getPageNumber() {return pageNumber;}

    public void setPageNumber(int pageNumber) {
        this.pageNumber = pageNumber;
    }

    public int getPageSize() {return pageSize;}

    public void setPageSize(int pageSize) {
        this.pageSize = pageSize;
    }

    public int getInstock() {return instock;}

    public void setInstock(int instock) {
        this.instock = instock;
    }

    public int getProductTag() { return productTag;}

    public void setProductTag(int productTag) {
        this.productTag = productTag;
    }

    public String getSort() {return sort;}

    public void setSort(String sort) {
        this.sort = sort;
    }

    public String getFacets() { return facets;}

    public void setFacets(String facets) {
        this.facets = facets;
    }

    public String getUserId() {return userId; }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getCookieId() { return cookieId; }

    public void setCookieId(String cookieId) {
        this.cookieId = cookieId;
    }

    public String getSale() {return sale;}

    public void setSale(String sale) {
        this.sale = sale;
    }

    public String getPrice() {return price;}

    public void setPrice(String price) {
        this.price = price;
    }

    public int getPriceTag() {
        return priceTag;
    }

    public void setPriceTag(int priceTag) {
        this.priceTag = priceTag;
    }

    public boolean equalToZero(String key){
        return "0".equals(key);
    }

    public Object getKvObj(String imgParam) {return this.other.get(imgParam);}

    public boolean isLimitCat(){return limitCat; }

    public void setLimitCat(boolean limitCat)
    {
        this.limitCat = limitCat;
    }

    public List<String> getFirstCatIds(){return firstCatIds;}

    public void setFirstCatIds(List<String> firstCatIds)
    {
        this.firstCatIds = firstCatIds;
    }

    public String getRebatePrice(){return rebatePrice;}

    public void setRebatePrice(String rebatePrice){this.rebatePrice = rebatePrice;}

    public String getmShopId() {return mShopId;}

    public void setmShopId(String mShopId) {
        this.mShopId = mShopId;
    }

    public String getTrId() { return trId; }

    public void setTrId(String trId) {
        this.trId = trId;
    }

    public String getOrgId() { return orgId;}

    public void setOrgId(String orgId) {
        this.orgId = orgId;
    }

    public List<String> getCategories() {return categories;}

    public void setCategories(List<String> categories) {
        this.categories = categories;
    }

    public String getReqId() {
        return reqId;
    }

    public void setReqId(String reqId) {
        this.reqId = reqId;
    }

    public String getTuanCatId() {
        return tuanCatId;
    }

    public void setTuanCatId(String tuanCatId) {
        this.tuanCatId = tuanCatId;
    }

    public int getBeginTime() {
        return beginTime;
    }

    public void setBeginTime(int beginTime) {
        this.beginTime = beginTime;
    }

    public int getCouponType() {
        return couponType;
    }

    public void setCouponType(int couponType) {
        this.couponType = couponType;
    }
}
