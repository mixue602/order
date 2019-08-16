package org.gome.search.endpoint;

import com.alibaba.dubbo.registry.support.AbstractRegistryFactory;
import org.gome.search.hotload.restart.Restarter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.stream.Stream;

/**
 * Created by doujintong on 17-5-23.
 */
@RestController
@ConfigurationProperties("spring.gateway.endpoint")
public class HotLoadController {

    private String[] path;

    public void setPath(String[] path) {
        this.path = path;
    }


    @RequestMapping(value = {"/p/s/{type}"},method = RequestMethod.GET)
    @ResponseBody
    public Object hotLoad(@PathVariable String type) {
        if (!isEnabled(type)) {
            return new ResponseEntity<>(Collections.singletonMap("message", "This endpoint is disabled"), HttpStatus.NOT_FOUND);
        }
        Thread thread = new Thread(()->execute(type));
        thread.setDaemon(false);
        thread.start();
        return Collections.singletonMap("message", type);
    }

    private boolean isEnabled(String path) {
        return Stream.of(this.path).filter(item->item.equalsIgnoreCase(path)).findFirst().isPresent();
    }

    private synchronized void execute(String type){
        switch (type){
            case "pause":System.exit(0);break;
            case "restart":
                AbstractRegistryFactory.destroyAll();
                Restarter.getInstance().restart();
                break;
            default:break;
        }
    }
}
