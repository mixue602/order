package org.gome.search.filter;

import org.apache.commons.lang3.StringUtils;
import org.gome.search.utils.CommonUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletRequestWrapper;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Stream;

/**
 * Created by luoqiong on 17-6-13.
 */
public class XssFilter implements Filter{

    protected Logger logger = LoggerFactory.getLogger(XssFilter.class);

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        logger.debug("xssFilter init..........");
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain filterChain) throws IOException, ServletException {
        XssHttpServletRequestWrapper xssHttpServletRequestWrapper = new XssHttpServletRequestWrapper((HttpServletRequest)request);
        filterChain.doFilter(xssHttpServletRequestWrapper, response);
    }

    @Override
    public void destroy() {
        logger.debug("xssFilter destory..........");
    }


    class XssHttpServletRequestWrapper extends HttpServletRequestWrapper {

        public XssHttpServletRequestWrapper(HttpServletRequest request){
            super(request);
        }

        @Override
        public String[] getParameterValues(String name) {

            String[] params = super.getParameterValues(name);

            if(params != null){
                String[] newParams = Stream.of(params).map(item -> {
                    if (!StringUtils.equals("question", name)) {
                        item=CommonUtils.escapeCharacter(item);
                    }else{
                        item=CommonUtils.escapeQuestion(item);
                    }
                    return item;
                }).toArray(String[]::new);
                return newParams;
            }

            return super.getParameterValues(name);
        }

        @Override
        public String getParameter(String name) {

            String value = super.getParameter(name);
            if(!StringUtils.equals("question", name)){
                value=CommonUtils.escapeCharacter(value);
            }else{
                value=CommonUtils.escapeQuestion(value);
            }
            return value;
        }

        @Override
        public String getHeader(String name) {

            String value = super.getHeader(name);

            return CommonUtils.escapeCharacter(value);
        }

        @Override
        public Map<String, String[]> getParameterMap() {

            Map<String, String[]> params = super.getParameterMap();
            Map<String, String[]> newParams = new HashMap<>();
            if(params != null && params.size() > 0){
                params.forEach((key,value) ->{
                    if(value != null && value.length > 0){
                        String[] newValues = Stream.of(value)
                        .map(item -> {
                            if (!StringUtils.equals("question", key)) {
                                item=CommonUtils.escapeCharacter(item);
                            }else{
                                item=CommonUtils.escapeQuestion(item);
                            }
                            return item;
                        }).toArray(String[]::new);
                        newParams.put(key, newValues);
                    }
                });
                return newParams;
            }

            return super.getParameterMap();
        }

    }
}
