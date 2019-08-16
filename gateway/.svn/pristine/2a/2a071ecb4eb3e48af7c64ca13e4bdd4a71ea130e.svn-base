package org.gome.search.filter;

import org.gome.search.handler.BaseHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Created by doujintong on 16-10-28.
 */
@Service("apiFromInterceptor")
public class ApiRequestInterceptor implements HandlerInterceptor   {

    @Autowired
    private BaseHandler baseHandler;

	@Override
	public boolean preHandle(HttpServletRequest req,HttpServletResponse response, Object handler) throws Exception {
        return baseHandler.filter301(req,response);
    }

	@Override
	public void postHandle(HttpServletRequest request,HttpServletResponse response, Object handler,ModelAndView modelAndView) throws Exception {
    }

	@Override
	public void afterCompletion(HttpServletRequest request,HttpServletResponse response, Object handler, Exception ex)throws Exception {
    }
}