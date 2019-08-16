package org.gome.search.ssdb.util;

/**
 * id - score 对
 *
 */
public class IdScore {

    private String id;

    private long score;

    public IdScore() {
    }

    public IdScore(String id, long score) {
        this.id = id;
        this.score = score;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public long getScore() {
        return score;
    }

    public void setScore(long score) {
        this.score = score;
    }

    @Override
    public String toString() {
        return "IdScore{" +
                "id='" + id + '\'' +
                ", score=" + score +
                '}';
    }
}
