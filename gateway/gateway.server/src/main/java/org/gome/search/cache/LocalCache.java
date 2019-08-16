package org.gome.search.cache;

import com.google.common.cache.Cache;
import com.google.common.cache.CacheBuilder;

import java.util.Objects;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.ReadWriteLock;
import java.util.concurrent.locks.ReentrantReadWriteLock;

/**
 * Created by liulina on 16-9-22.
 */

public class LocalCache<K,V> {


    private Cache<K, V> cache = null;

    private ReadWriteLock rwl = null;

    public LocalCache(int cacheSize,long duration,TimeUnit timeUnit){
        cache = CacheBuilder.newBuilder().expireAfterWrite(duration, timeUnit)
                .maximumSize(cacheSize)
                .build();
        rwl=new ReentrantReadWriteLock();
    }


    public void put(K u,V v){
        Objects.requireNonNull(u,"key is null");
        Objects.requireNonNull(v, "value is null");
        try {
            rwl.writeLock().lock();
            cache.put(u, v);
        } finally {
            rwl.writeLock().unlock();
        }
    }

    public V getIfPresent(K u){
        Objects.requireNonNull(u,"key is null");
        try{
            rwl.readLock().lock();
            return cache.getIfPresent(u);
        }finally {
            rwl.readLock().unlock();
        }
    }

}
