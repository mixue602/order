package org.gome.search.domain;

import com.alibaba.fastjson.JSONObject;

import java.io.Serializable;

/**
 * Created by doujintong on 16-9-5.
 */
public class MobileRequest implements Serializable {
    private String catId;
    private String question;
    private String shopId;
    private String blueActivityId;
    private String shoppingCartActivityId;
    private int crossShop=-1;
    private int market;
    private String regionId;
    private String et;
    private int pageNumber=1;
    private int pageSize=1;
    private int instock=0;
    private int productTag=0;
    private String sort="00";
    private String facets;
    private String userId;
    private String cookieId;
    private String sale="0";
    private String price;
    private boolean priceTag;
    private String activityId;

    private JSONObject other=new JSONObject();

    public void setKvObj(String key,Object value){
        this.other.put(key,value);
    }

    public String getActivityId() {
        return activityId;
    }

    public void setActivityId(String activityId) {
        this.activityId = activityId;
    }

    public String getCatId() {
        return catId;
    }

    public void setCatId(String catId) {
        this.catId = catId;
    }

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public String getShopId() {
        return shopId;
    }

    public void setShopId(String shopId) {
        this.shopId = shopId;
    }

    public String getBlueActivityId() {
        return blueActivityId;
    }

    public void setBlueActivityId(String blueActivityId) {
        this.blueActivityId = blueActivityId;
    }

    public String getShoppingCartActivityId() {
        return shoppingCartActivityId;
    }

    public void setShoppingCartActivityId(String shoppingCartActivityId) {
        this.shoppingCartActivityId = shoppingCartActivityId;
    }

    public int getCrossShop() {
        return crossShop;
    }

    public void setCrossShop(int crossShop) {
        this.crossShop = crossShop;
    }

    public int getMarket() {
        return market;
    }

    public void setMarket(int market) {
        this.market = market;
    }

    public String getRegionId() {
        return regionId;
    }

    public void setRegionId(String regionId) {
        this.regionId = regionId;
    }

    public String getEt() {
        return et;
    }

    public void setEt(String et) {
        this.et = et;
    }

    public int getPageNumber() {
        return pageNumber;
    }

    public void setPageNumber(int pageNumber) {
        this.pageNumber = pageNumber;
    }

    public int getPageSize() {
        return pageSize;
    }

    public void setPageSize(int pageSize) {
        this.pageSize = pageSize;
    }

    public int getInstock() {
        return instock;
    }

    public void setInstock(int instock) {
        this.instock = instock;
    }

    public int getProductTag() {
        return productTag;
    }

    public void setProductTag(int productTag) {
        this.productTag = productTag;
    }

    public String getSort() {
        return sort;
    }

    public void setSort(String sort) {
        this.sort = sort;
    }

    public String getFacets() {
        return facets;
    }

    public void setFacets(String facets) {
        this.facets = facets;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getCookieId() {
        return cookieId;
    }

    public void setCookieId(String cookieId) {
        this.cookieId = cookieId;
    }

    public String getSale() {
        return sale;
    }

    public void setSale(String sale) {
        this.sale = sale;
    }

    public String getPrice() {
        return price;
    }

    public void setPrice(String price) {
        this.price = price;
    }

    public boolean isPriceTag() {
        return priceTag;
    }

    public void setPriceTag(boolean priceTag) {
        this.priceTag = priceTag;
    }

    public boolean equalToZero(String key){
        return "0".equals(key);
    }

    public Object getKvObj(String imgParam) {
        return this.other.get(imgParam);
    }
}
