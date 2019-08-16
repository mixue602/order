package org.gome.search.domain;

/**
 * Created by doujintong on 16-12-19.
 */
public class Tuple2 {
    private Object v1;
    private Object v2;

    public static Tuple2 build(Object v1,Object v2){
        return new Tuple2(v1,v2);
    }

    public Tuple2(Object v1,Object v2){
        this.v1=v1;
        this.v2=v2;
    }

    public Object getV1() {
        return v1;
    }

    public void setV1(Object v1) {
        this.v1 = v1;
    }

    public Object getV2() {
        return v2;
    }

    public void setV2(Object v2) {
        this.v2 = v2;
    }
}
