package org.gome.search.utils;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import org.apache.commons.lang3.ArrayUtils;
import org.apache.commons.lang3.StringUtils;
import org.gome.search.domain.SearchRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import java.io.UnsupportedEncodingException;
import java.lang.reflect.Field;
import java.net.URLDecoder;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;

/**
 * Created by liulina on 16-9-22.
 */
public class CommonUtils {
    protected static Logger logger = LoggerFactory.getLogger(CommonUtils.class);
    /**
     * smart data sort
     * @param name
     * @param items
     */
    public static void quickSortByDouble(final String name, JSONArray items) {
        Collections.sort(items, new Comparator<Object>() {
            public int compare(Object o1, Object o2) {
                String p1Str = ((JSONObject) o1).getString(name);
                String p2Str = ((JSONObject) o2).getString(name);
                if (StringUtils.isBlank(p1Str) || StringUtils.isBlank(p2Str) || StringUtils.equals("-1", p1Str) || StringUtils.equals("-1", p2Str)) {
                    return -1;
                }
                p1Str = CommonUtils.formatPrice(p1Str).replaceAll("已下架", "0");
                p2Str = CommonUtils.formatPrice(p2Str).replaceAll("已下架","0");
                double p1 = Double.parseDouble(p1Str);
                double p2 = Double.parseDouble(p2Str);
                if (p1 < p2) {
                    return -1;
                } else if (p1 > p2) {
                    return 1;
                } else {
                    return 0;
                }
            }
        });
    }

    public static String formatPrice(String price){
        return price.replace("￥", "").replace("¥","");

    }

    /**
     * 获取区域
     * @param request
     * @return
     */
    public static String getRegionId(HttpServletRequest request){
        String atgregion= getCookieValue("atgregion", request);
        if (StringUtils.isEmpty(atgregion)) {
            atgregion = "11011400|北京北京市东城区|11010000|11000000";
        }
        try {
            atgregion=URLDecoder.decode(atgregion,"UTF-8");
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        String regionId = atgregion.split("\\|")[0];
        if(StringUtils.isBlank(regionId) || regionId.length()<8){
            throw new NullPointerException("regionId is error:"+regionId);
        }
        return regionId;
    }

    /**
     * 获取区域
     * @param request
     * @return
     */
    public static String getCookieId(HttpServletRequest request){
        return getCookieValue("__c_visitor", request);
    }


    public static HttpServletRequest getRequest(){
        ServletRequestAttributes attributes=(ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if(attributes!=null){
            HttpServletRequest req=attributes.getRequest();
            return req;
        }
        return null;
    }

    /**
     * 获取区域
     * @param request
     * @return
     */
    public static String getUserId(HttpServletRequest request){
        return getCookieValue("sid", request);
    }

    /**
     * 获取请求地址
     * @param request
     * @return
     */
    public static String getRemoteIP(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("Proxy-Client-IP");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("WL-Proxy-Client-IP");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("HTTP_CLIENT_IP");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("HTTP_X_FORWARDED_FOR");
        }
        if (ip != null) {

            if (ip.indexOf(",") != -1) {
                String[] values = ip.split("\\,");
                ip = values[0].trim();
            } else if (ip.indexOf(":") != -1) {
                ip = "127.0.0.1";
            }
        }
        if(ip==null || "".equals(ip) || "unknown".equalsIgnoreCase(ip)){
            logger.warn("ip is null--ip:{},url:{}",new Object[]{ip,request.getRequestURL()+request.getQueryString()});
        }
        return ip;
    }
    /**
     * 获取请求cookie
     * @param key
     * @param request
     * @return
     */
    private static String getCookieValue(String key,HttpServletRequest request){
        Cookie[] cookies=request.getCookies();
        if( cookies != null && cookies.length>0){
            for(Cookie cookie :cookies){
                if(cookie!=null && StringUtils.equals(cookie.getName(), key))
                    return cookie.getValue();
            }
        }
        return "";
    }

    public static <T> void requireNonNullOrStr(T ... data){
        for (int i = 0; i < (data.length-1); i++) {
            T obj=data[i];
            if (obj == null)
                throw new NullPointerException(data[data.length-1].toString());
            if(obj instanceof String && StringUtils.isBlank(obj.toString())){
                throw new NullPointerException(data[data.length-1].toString());
            }
        }
    }

    public static <T> void requireOnlyOne( T ... obj){
        boolean isSuccces=false;
        for (int i = 0; i < (obj.length-1); i++) {
            if(obj[i] instanceof String && !StringUtils.isBlank(obj[i].toString().trim())){
                isSuccces=true;
                break;
            }
        }
        if(!isSuccces)throw new NullPointerException("requireOnlyOne");
    }

    /**
     * 判断是否为爬虫请求
     * @return
     */
    public static boolean isRobotRequest(String userAgent) {
        if (userAgent == null)
            return false;
        userAgent = userAgent.toLowerCase();
        if (userAgent.contains("spider")) {
            return true;
        } else if (userAgent.contains("bot")) {
            return true;
        } else if (userAgent.contains("nutch")) {
            return true;
        } else if (userAgent.contains("yahoo")) {
            return true;
        } else if (userAgent.contains("gougou")) {
            return true;
        } else if (userAgent.contains("scooter")) {
            return true;
        } else if (userAgent.contains("lilina")) {
            return true;
        }
        return false;
    }

    public static String escapeCharacter(String input){
        if(input==null)return null;
        while(true){
            if(!input.contains("\\u")){
                break;
            }
            input=input.replace("\\u","");
        }
        if(StringUtils.isNotEmpty(input)) {
            input = input.replaceAll("\\(", "").replaceAll("\\)", "");
            input = input.replaceAll("<", "").replaceAll(">", "");
            input = input.replaceAll(";", "").replaceAll("`", "");
            input = input.replaceAll("alert", "").replaceAll("script", "");
            return input;
        }

        return input;
    }

    public static String escapeQuestion(String input){
        if(input==null)return null;
        while(true){
            if(!input.contains("\\u")){
                break;
            }
            input=input.replace("\\u","");
        }
        if(StringUtils.isNotEmpty(input)) {
            input = input.replaceAll("<", "").replaceAll(">", "");
            input = input.replaceAll(";", "").replaceAll("`", "").replaceAll("\'", "").replaceAll("\"", "");
            input = input.replaceAll("alert", "").replaceAll("script", "").replaceAll(",","");
            return input;
        }

        return input;
    }

    public static String objToString(Object obj){
        StringBuilder data = new StringBuilder();
        Field[] fields = getBeanFields(obj.getClass(), null);
        for (int i = 0; i < fields.length; ++i) {
            Field field = fields[i];
            try {
                field.setAccessible(true);
                Object e = field.get(obj);
                if (data.length() > 0) {
                    data.append("-");
                }
                String fieldName = field.getName();
                if(!"other".equals(fieldName)
                        && !"userId".equals(fieldName)
                        && !"cookieId".equals(fieldName)
                        && !"ip".equals(fieldName)
                        && !"regionId".equals(fieldName))
                    data.append(String.valueOf(e).replace(",", ""));
                if("other".equals(fieldName)){
                    JSONObject jsonObject=(JSONObject)field.get(obj);
                    data.append(String.valueOf(jsonObject.get("rank")).replace(",", ""));
                    data.append(String.valueOf(jsonObject.get("dsl")).replace(",", ""));
                    data.append(String.valueOf(jsonObject.get("pzin")).replace(",", ""));
                    data.append(String.valueOf(jsonObject.get("rebatePrice")).replace(",", ""));
                    data.append(String.valueOf(jsonObject.get("firstCatIds")).replace(",", ""));
                    data.append(String.valueOf(jsonObject.get("isPriceSort")).replace(",", ""));
                }
                if(fieldName.equals("regionId")){
                    data.append(((String)field.get(obj)).substring(0,4));
                }
            } catch (IllegalAccessException var6) {
                var6.printStackTrace();
            }
        }
        return data.toString();
    }

    public static Field[] getBeanFields(Class cls,Field[] fs){
        fs = ArrayUtils.addAll(fs, cls.getDeclaredFields());
        if(cls.getSuperclass()!=null){
            Class clsSup = cls.getSuperclass();
            fs = getBeanFields(clsSup,fs);
        }
        return fs;
    }

    public static void checkRefer(String refer) {
        if(StringUtils.isBlank(refer) || (!refer.contains("localhost") && !refer.contains("10") && !refer.contains("//higo") && !refer.contains("//search") && !refer.contains("//list") && !refer.contains("//brand")))
            throw new NullPointerException("refer is null");
    }

    public static void isPriceSortHander(HttpServletRequest request,SearchRequest searchRequest){
        String isPriceSort = StringUtils.defaultString(request.getParameter("isPriceSort"),"1");
        searchRequest.setKvObj("isPriceSort",Integer.parseInt(isPriceSort));
        String sort = request.getParameter("sort");
        if(!"20".equals(sort) && !"21".equals(sort) && "1".equals(isPriceSort)){
            searchRequest.setKvObj("isPriceSort",0);
        }
    }

    public static String getNextDay(Date date, int dayNum) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.add(Calendar.DAY_OF_MONTH, -dayNum);
        date = calendar.getTime();
        SimpleDateFormat _formatDate = new SimpleDateFormat("yyyy-MM-dd");
        return _formatDate.format(date);
    }
}
