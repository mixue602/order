package org.gome.search.exception;

import org.gome.search.domain.StoreConfiguration;
import org.gome.search.handler.Loghandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerExceptionResolver;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Component
public class ExceptionHandler implements HandlerExceptionResolver {

    private Logger logger = LoggerFactory.getLogger(ExceptionHandler.class);


    @Autowired
    private StoreConfiguration storeConfiguration;

	@Override
	public ModelAndView resolveException(HttpServletRequest request,HttpServletResponse response, Object o, Exception e) {
        Loghandler.handleAccLog(777,request);
        logger.error("server error:{}", e);
        ModelAndView error=new ModelAndView();
        error.setViewName("error");
        error.getModel().put("storeConfiguration",storeConfiguration);
        response.setStatus(200);
		return error;
	}

}