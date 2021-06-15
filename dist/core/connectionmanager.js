"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConnection = exports.ConnectionManager = void 0;
const relaenmanager_1 = require("./relaenmanager");
const connection_1 = require("./connection");
const threadlocal_1 = require("./threadlocal");
const providerfactory_1 = require("./providerfactory");
const errorfactory_1 = require("./errorfactory");
/**
 * 连接管理器
 */
class ConnectionManager {
    /**
     * 初始化连接管理器
     * @param cfg relaen配置文件的数据库配置对象
     */
    static init(cfg) {
        let providerClass = providerfactory_1.ProviderFactory.get();
        if (!providerClass) {
            throw errorfactory_1.ErrorFactory.getError("0300", [relaenmanager_1.RelaenManager.dialect]);
        }
        this.provider = Reflect.construct(providerClass, [cfg]);
    }
    /**
     * 获取连接对象
     * @param id   创建者id，直接使用时，不需要设置该值
     * @returns    connection对象
     */
    static async createConnection(id) {
        let conn;
        //把conn加入connectionMap
        let sid = threadlocal_1.RelaenThreadLocal.getThreadId();
        if (!sid) { //新建conn
            sid = threadlocal_1.RelaenThreadLocal.newThreadId();
        }
        if (!this.connectionMap.has(sid)) { //线程id对应对象不存在
            conn = new connection_1.Connection(await this.provider.getConnection());
            if (id) {
                conn.fromId = id;
            }
            conn.connected = true;
            conn.threadId = sid;
            this.connectionMap.set(sid, {
                num: 1,
                conn: conn
            });
        }
        else { //已存在，则只修改conn的创建数，不新建conn
            let o = this.connectionMap.get(sid);
            o.num++;
            conn = o.conn;
        }
        return conn;
    }
    /**
     * 关闭连接
     * @param connection    数据库连接对象
     * @param force         是否强制释放
     */
    static async closeConnection(connection, force) {
        //获取threadId
        let sid = connection.threadId;
        //非强制释放，检查计数器
        if (!force) {
            if (sid && this.connectionMap.has(sid)) {
                let o = this.connectionMap.get(sid);
                if (--o.num <= 0) { //最后一个close，需要从map删除
                    force = true;
                }
            }
        }
        //需要释放
        if (force) {
            //清理 connection map
            this.connectionMap.delete(sid);
            return await this.provider.closeConnection(connection);
        }
    }
}
exports.ConnectionManager = ConnectionManager;
/**
 * 连接map {threadId:{num:conn创建次数,conn:连接}}
 * 保证一个异步方法中只能有一个connection
 */
ConnectionManager.connectionMap = new Map();
/**
 * 获取连接对象
 * @param id   创建者id，直接使用时，不需要设置该值
 * @returns    connection对象
 */
async function getConnection(id) {
    return await ConnectionManager.createConnection(id);
}
exports.getConnection = getConnection;
//# sourceMappingURL=connectionmanager.js.map