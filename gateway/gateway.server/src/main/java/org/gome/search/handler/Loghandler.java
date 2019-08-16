package org.gome.search.handler;

import com.alibaba.fastjson.JSONObject;
import com.mongodb.BasicDBObject;
import de.codecentric.boot.admin.client.registration.NetUtils;
import org.gome.search.cache.LocalCache;
import org.gome.search.dubbo.domain.AppRequest;
import org.gome.search.utils.CommonUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.http.HttpServletRequest;
import java.lang.reflect.Field;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static org.gome.search.utils.CommonUtils.getBeanFields;

/**
 * Created by doujintong on 17-1-5.
 */
public class Loghandler {

    private static Logger logger = LoggerFactory.getLogger(Loghandler.class);

    private static LocalCache<String,String> localCache=new LocalCache(50000,1,TimeUnit.MINUTES);

    /**
     * 解析request，记录处理访问日志
     */
    public static void handleAccLog(int level,HttpServletRequest req) {
        String userAgent = req.getHeader("user-agent");
        if (userAgent == null) {
            userAgent = "";
        }
        String ip = CommonUtils.getRemoteIP(req);
        String cookie = CommonUtils.getCookieId(req);
        String regionId=CommonUtils.getRegionId(req);
        String hostName = req.getHeader("host").toLowerCase();;
        String from = req.getAttribute("from").toString();
        String browser = browserType(userAgent);
        String osVersion = getOsVersion(userAgent);
        String refer = req.getHeader("Referer");
        boolean isRobot = CommonUtils.isRobotRequest(userAgent);
        String robot = getRobotName(userAgent, isRobot);
        if (isRobot) browser = "robot";
        if (refer == null) refer = "None";
        Object atime=req.getAttribute("appTime");
        Object id=req.getAttribute("reqId");
        if(atime!=null && atime.equals(-1))
            level=888;
        BasicDBObject logObj = new BasicDBObject();
        logObj.append("id",id==null?"":id.toString());
        logObj.append("server", NetUtils.getLocalAddress().getHostAddress());
        logObj.append("time",req.getAttribute("costTime"));
        logObj.append("atime",atime);
        logObj.append("status",level);
        logObj.append("region",regionId);
        logObj.append("ip", ip);
        logObj.append("cookieId", cookie);
        logObj.append("h", hostName);
        logObj.append("frm", from);
        logObj.append("brw", browser);
        logObj.append("ref", refer);
        logObj.append("osv", osVersion);
        logObj.append("isRtb", isRobot);
        logObj.append("rbt", robot);
        logObj.append("userId", CommonUtils.getUserId(req));
        Map<String, String[]> params = req.getParameterMap();
        String queryString = "";
        for (String key : params.keySet()) {
            String[] values = params.get(key);
            for (int i = 0; i < values.length; i++) {
                String value = values[i];
                queryString += key + "=" + value + "&";
            }
        }
        String url = req.getRequestURL() + "?" + queryString;
        logObj.append("url", url);
        if(localCache.getIfPresent(id==null?"m":id.toString())!=null)return;
        localCache.put(id==null?"m":id.toString(),"v");
        if(level!=200){
            logger.error("httpAcc - {}",JSONObject.toJSONString(logObj));
        }else{
            logger.info("httpAcc - {}",JSONObject.toJSONString(logObj));

        }
    }

    public static void handleAccLog(int level,AppRequest req) {
        String ip = (String)req.getKvObj("ip");
        String cookie = req.getCookieId();
        String regionId=req.getRegionId();
        String from = req.getFrom();
        BasicDBObject logObj = new BasicDBObject();
        logObj.append("id", req.getReqId());
        logObj.append("server",NetUtils.getLocalAddress().getHostAddress());
        logObj.append("time",req.getKvObj("costTime"));
        logObj.append("atime",req.getKvObj("appTime"));
        logObj.append("method",req.getKvObj("methodName"));
        logObj.append("status",level);
        logObj.append("region",regionId);
        logObj.append("ip", ip);
        logObj.append("cookieId", cookie);
        logObj.append("h", "");
        logObj.append("frm", from);
        logObj.append("brw", "dubbo");
        logObj.append("ref", "dubbo");
        logObj.append("osv", "dubbo");
        logObj.append("isRtb", false);
        logObj.append("rbt", "");
        logObj.append("userId", req.getUserId());
        Map headers=req.getHeaders();
        if(headers!=null){
            logObj.append("pageId", headers.get("pid"));
        }
        String url = "";
        Field[] fields = getBeanFields(req.getClass(), null);
        for (int i = 0; i < fields.length; ++i) {
            Field field = fields[i];
            try {
                field.setAccessible(true);
                Object e = field.get(req);
                if(!"headers".equals(field.getName()) && !"other".equals(field.getName()) && e!=null){
                    url += field.getName() + "=" + e + "&";
                }

            }catch(Exception e){}
        }
        logObj.append("url", url);
        if(level!=200){
            logger.error("httpAcc - {}",JSONObject.toJSONString(logObj));
        }else{
            logger.info("httpAcc - {}",JSONObject.toJSONString(logObj));

        }
    }
    /**
     * 获取浏览器类型
     * @return
     */
    public static String browserType(String userAgent){
        if(checkSample(userAgent, "MSIE 10.0")) return "IE10";
        if(checkSample(userAgent, "MSIE 9.0")) return "IE9";
        if(checkSample(userAgent, "MSIE 8.0")) return "IE8";
        if(checkSample(userAgent, "MSIE 7.0")) return "IE7";
        if(checkSample(userAgent, "MSIE 6.0")) return "IE6";
        if(checkSample(userAgent, "Maxthon")) return "MAXTHON";
        if(checkSample(userAgent, "GreenBrowser")) return "GREEN";
        if(checkSample(userAgent, "QQBrowser")) return "QQ";
        if(checkSample(userAgent, "360SE")) return "360SE";
        if(checkSample(userAgent, "Firefox")) return "Firefox";
        if(checkSample(userAgent, "Opera")) return "Opera";
        if(checkSample(userAgent, "Chrome")) return "Chrome";
        if(checkSample(userAgent, "Safari")) return "Safari";
        if(checkSample(userAgent, "HttpClient")) return "HttpClient";

        return "other_" + userAgent;
    }

    /**
     * 操作系统版本
     * @return
     */
    public static String getOsVersion(String userAgent) {
        String osVersion = "";
        if(checkSample(userAgent,"Windows NT 6.1"))return "Win7/Server2008R2";
        if(checkSample(userAgent,"Windows NT 6.0"))return "Vista/Server2008";
        if(checkSample(userAgent,"Windows NT 5.2"))return "Server2003";
        if(checkSample(userAgent,"Windows NT 5.1"))return "WinXP";
        if(checkSample(userAgent,"Windows NT 5.0"))return "Win2003";
        if(checkSample(userAgent,"Windows NT 4.0"))return "Win9X";
        if(checkSample(userAgent,"Windows XP"))return "WinXP";
        if(checkSample(userAgent,"WAP"))return "WAP";
        if(checkSample(userAgent,"Linux"))return "Linux";
        if(checkSample(userAgent,"Macintosh"))return "Mac";
        if(checkSample(userAgent,"Mac OSX"))return "MacOSX";
        return osVersion;
    }

    /**
     * 获取已知爬虫的
     * @param userAgent
     * @return
     */
    public static String getRobotName(String userAgent,boolean isRobot){
        userAgent = userAgent.toLowerCase();
        if (userAgent.contains("baidu")) {
            return "baidu";
        } else if (userAgent.contains("google")) {
            return "google";
        } else if (userAgent.contains("sogou")) {
            return "sogou";
        } else if (userAgent.contains("360")) {
            return "360";
        } else if (userAgent.contains("gougou")) {
            return "gougou";
        } else if (userAgent.contains("yahoo")) {
            return "yahoo";
        } else if (userAgent.contains("jike")) {
            return "jike";
        } else if (userAgent.contains("youdao")){
            return "youdao";
        } else if (userAgent.contains("etao")){
            return "etao";
        } else if(userAgent.contains("bing")){
            return "bing";
        }
        if(isRobot){
            return "unknown_"+userAgent;
        }else{
            return "No";
        }
    }

    /**
     * 信息匹配
     * @param userAgent
     * @param sample
     * @return
     */
    public static boolean checkSample(String userAgent, String sample) {
        Pattern p = Pattern.compile(sample,Pattern.MULTILINE);
        Matcher m = p.matcher(userAgent);
        return m.find();
    }

}
