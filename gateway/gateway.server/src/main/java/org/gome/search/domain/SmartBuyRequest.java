package org.gome.search.domain;

import org.gome.search.utils.CommonUtils;

/**
 * Created by doujintong on 16-9-20.
 */
public class SmartBuyRequest {
    private int smartFlag=-1;
    private String skuId;
    private int isShop;
    private double price=-1;
    private int PageNum=1;
    private int PageSize=10;
    private String regionId;

    public int getSmartFlag() {
        return smartFlag;
    }

    public void setSmartFlag(int smartFlag) {
        this.smartFlag = smartFlag;
    }

    public String getSkuId() {
        if(smartFlag != -1 &&smartFlag != 0 && smartFlag != 3){
            CommonUtils.requireNonNullOrStr(skuId, "skuId is null!");
        }
        return skuId;
    }

    public void setSkuId(String skuId) {
        this.skuId = skuId;
    }

    public int getIsShop() {
        return isShop;
    }

    public void setIsShop(int isShop) {
        this.isShop = isShop;
    }

    public double getPrice() {
        if(price<=0) throw new RuntimeException("price is incorrect...");
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public int getPageNum()
    {
        return PageNum;
    }

    public void setPageNum(int pageNum)
    {
        this.PageNum = pageNum;
    }

    public int getPageSize()
    {
        return PageSize;
    }

    public void setPageSize(int pageSize)
    {
        this.PageSize = pageSize;
    }

    public String getRegionId() {
        return regionId;
    }

    public void setRegionId(String regionId) {
        this.regionId = regionId;
    }
}
