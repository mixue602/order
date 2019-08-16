package org.gome.search.ssdb.protocol;

/**
 * 表示这个请求包含写入操作，在主从架构中，这样的请求只应该发送给主服务器
 *
 */
public class WriteRequest extends Request {

    public WriteRequest(String command) {
        super(command);
    }

    public WriteRequest(Object... tokens) {
        super(tokens);
    }
}
