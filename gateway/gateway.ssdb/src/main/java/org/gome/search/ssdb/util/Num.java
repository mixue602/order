package org.gome.search.ssdb.util;

/**
 * (description)
 *
 */
public class Num {

    public static String ifNull(Long l, String value) {
        return l == null ? value : String.valueOf(l);
    }
}
