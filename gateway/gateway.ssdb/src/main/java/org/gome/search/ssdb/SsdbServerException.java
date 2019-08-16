package org.gome.search.ssdb;

/**
 * 表示发生在服务器端的异常，通常指的是服务器返回来的错误信息
 *
 */
public class SsdbServerException extends SsdbException {

    public SsdbServerException() {
    }

    public SsdbServerException(String message) {
        super(message);
    }

    public SsdbServerException(String message, Throwable cause) {
        super(message, cause);
    }

    public SsdbServerException(Throwable cause) {
        super(cause);
    }
}
