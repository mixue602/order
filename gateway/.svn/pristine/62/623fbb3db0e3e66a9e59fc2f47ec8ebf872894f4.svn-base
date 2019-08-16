package org.gome.search;

import com.alibaba.fastjson.support.config.FastJsonConfig;
import com.alibaba.fastjson.support.spring.FastJsonpHttpMessageConverter4;
import org.gome.search.filter.ApiRequestInterceptor;
import org.gome.search.filter.PageJsonInterceptor;
import org.gome.search.utils.SerializerUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

import java.util.List;

/**
 * Created by doujintong on 16-10-28.
 */
@Configuration
public class WebMvcConfig extends WebMvcConfigurerAdapter
{

    @Autowired
    private ApiRequestInterceptor apiRequestInterceptor;

    @Autowired
    private PageJsonInterceptor pageJsonInterceptor;

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {

    }

    @Override
    public void extendMessageConverters(List<HttpMessageConverter<?>> converters) {

        FastJsonpHttpMessageConverter4 fastJsonHttpMessageConverter=new FastJsonpHttpMessageConverter4();
        FastJsonConfig fastJsonConfig=new FastJsonConfig();
        fastJsonConfig.setSerializeFilters(SerializerUtils.propertyFilter());
        fastJsonHttpMessageConverter.setFastJsonConfig(fastJsonConfig);
        converters.add(0, fastJsonHttpMessageConverter);
        super.extendMessageConverters(converters);
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        String[] includeUrl=new String[]{"/**"};
        registry.addInterceptor(apiRequestInterceptor).addPathPatterns(includeUrl);
        registry.addInterceptor(pageJsonInterceptor).addPathPatterns(includeUrl);
    }



}

