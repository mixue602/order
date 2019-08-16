package org.gome.search.dubbo.domain;

import java.io.Serializable;

/**
 * Created by doujintong on 17-9-13.
 */
public class ServerInfo implements Serializable {
    private int appTime;
    private String reqId;
    private String server;

    public int getAppTime() {
        return appTime;
    }

    public void setAppTime(int appTime) {
        this.appTime = appTime;
    }

    public String getReqId() {
        return reqId;
    }

    public void setReqId(String reqId) {
        this.reqId = reqId;
    }

    public String getServer() {
        return server;
    }

    public void setServer(String server) {
        this.server = server;
    }
}
