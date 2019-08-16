package org.gome.search.hotload.autoconfigure;

import org.springframework.objenesis.ObjenesisStd;
import org.springframework.util.ClassUtils;
import org.springframework.util.ReflectionUtils;

import javax.annotation.PostConstruct;
import java.lang.reflect.Field;

class HateoasObjenesisCacheDisabler {

	private static boolean cacheDisabled;

	@PostConstruct
    void disableCaching() {
		if (!cacheDisabled) {
			cacheDisabled = true;
			doDisableCaching();
		}
	}

	private void doDisableCaching() {
		try {
			Class<?> type = ClassUtils.forName(
                    "org.springframework.hateoas.core.DummyInvocationUtils",
                    getClass().getClassLoader());
			Field objenesis = ReflectionUtils.findField(type, "OBJENESIS");
			if (objenesis != null) {
				ReflectionUtils.makeAccessible(objenesis);
				ReflectionUtils.setField(objenesis, null, new ObjenesisStd(false));
			}
		}
		catch (Exception ex) {
			// Assume that Spring HATEOAS is not on the classpath and continue
		}
	}

}