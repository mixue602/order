package org.gome.search.controller;

import org.gome.search.domain.StoreConfiguration;
import org.gome.search.handler.Loghandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.web.ErrorController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Controller
public class ErrorXController implements ErrorController {

	private static final String ERROR_PATH = "/error";
    private Logger logger = LoggerFactory.getLogger(ErrorXController.class);

    @Autowired
    private StoreConfiguration storeConfiguration;

	@RequestMapping(value = ERROR_PATH)
    public ModelAndView handleError(HttpServletRequest request,HttpServletResponse response){
        Loghandler.handleAccLog(response.getStatus(),request);
        ModelAndView error=new ModelAndView();
        error.setViewName("error");
        error.getModel().put("storeConfiguration",storeConfiguration);
        if(response.getStatus()!=401){
            response.setStatus(200);
        }
        return error;
		
	}

	@Override
	public String getErrorPath() {
		return ERROR_PATH;
	}

}