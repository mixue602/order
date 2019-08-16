package org.gome.search.hotload.autoconfigure;

import org.gome.search.hotload.classpath.ClassPathChangedEvent;
import org.gome.search.hotload.classpath.ClassPathFileSystemWatcher;
import org.gome.search.hotload.classpath.ClassPathRestartStrategy;
import org.gome.search.hotload.classpath.PatternClassPathRestartStrategy;
import org.gome.search.hotload.filewatch.FileSystemWatcher;
import org.gome.search.hotload.filewatch.FileSystemWatcherFactory;
import org.gome.search.hotload.restart.Restarter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.event.EventListener;
import org.springframework.util.StringUtils;

import java.io.File;
import java.net.URL;
import java.util.List;

@ConfigurationProperties(prefix = "spring.gateway.endpoint")
public class RestartConfiguration {


    private boolean hotload;

    @Autowired
    private RestartProperties properties;

    @EventListener
    public void onClassPathChanged(ClassPathChangedEvent event) {
        if (hotload && event.isRestartRequired()) {
            Restarter.getInstance().restart(
                    new FileWatchingFailureHandler(fileSystemWatcherFactory()));
        }
    }

    @Bean
    @ConditionalOnMissingBean
    public ClassPathFileSystemWatcher classPathFileSystemWatcher() {
        URL[] urls = Restarter.getInstance().getInitialUrls();
        ClassPathFileSystemWatcher watcher = new ClassPathFileSystemWatcher(
                fileSystemWatcherFactory(), classPathRestartStrategy(), urls);
        watcher.setStopWatcherOnRestart(true);
        return watcher;
    }

    @Bean
    public HateoasObjenesisCacheDisabler hateoasObjenesisCacheDisabler() {
        return new HateoasObjenesisCacheDisabler();
    }


    @Bean
    @ConditionalOnMissingBean
    public ClassPathRestartStrategy classPathRestartStrategy() {
        return new PatternClassPathRestartStrategy(
                this.properties.getRestart().getAllExclude());
    }

    @Bean
    public FileSystemWatcherFactory fileSystemWatcherFactory() {
        return () -> newFileSystemWatcher();
    }

    private FileSystemWatcher newFileSystemWatcher() {
        RestartProperties.Restart restartProperties = this.properties.getRestart();
        FileSystemWatcher watcher = new FileSystemWatcher(true,
                restartProperties.getPollInterval(),
                restartProperties.getQuietPeriod());
        String triggerFile = restartProperties.getTriggerFile();
        if (StringUtils.hasLength(triggerFile)) {
            watcher.setTriggerFilter(new TriggerFileFilter(triggerFile));
        }
        List<File> additionalPaths = restartProperties.getAdditionalPaths();
        for (File path : additionalPaths) {
            watcher.addSourceFolder(path.getAbsoluteFile());
        }
        return watcher;
    }

    public boolean isHotload() {
        return hotload;
    }

    public void setHotload(boolean hotload) {
        this.hotload = hotload;
    }
}