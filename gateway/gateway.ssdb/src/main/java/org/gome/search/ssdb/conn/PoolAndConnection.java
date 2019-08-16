package org.gome.search.ssdb.conn;

/**
 * 包含 Connection 和 ConnectionPool 的类，两者作为方法的返回值同时返回
 * 这是为了方便 Connection 用完后，由调用者将其返回给 ConnectionPool
 *
 */
public class PoolAndConnection {

    private Connection connection;

    private ConnectionPool connectionPool;

    public PoolAndConnection(ConnectionPool connectionPool, Connection connection) {
        this.connectionPool = connectionPool;
        this.connection = connection;
    }

    public Connection getConnection() {
        return connection;
    }

    public ConnectionPool getConnectionPool() {
        return connectionPool;
    }
}
