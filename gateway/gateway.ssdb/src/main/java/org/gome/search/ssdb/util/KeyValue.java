package org.gome.search.ssdb.util;

import java.io.Serializable;

/**
 * 键值对
 *
 */
public class KeyValue implements Serializable{

    private String key;

    private String value;

    public KeyValue(String key, String value) {
        this.key = key;
        this.value = value;
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    @Override
    public String toString() {
        return "{" + this.key + "=" + this.value + "}";
    }
}
