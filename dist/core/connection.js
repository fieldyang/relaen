"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Connection = void 0;
const connectionmanager_1 = require("./connectionmanager");
const transactionfactory_1 = require("./transactionfactory");
/**
 * 数据库连接类
 */
class Connection {
    /**
     * 是否自动提交
     */
    // oracle 中不使用
    // autoCommit: boolean = true;
    constructor(conn) {
        this.conn = conn;
    }
    /**
     * 关闭连接
     * @param force     是否强制关闭
     */
    async close(force) {
        await connectionmanager_1.ConnectionManager.closeConnection(this, force);
    }
    /**
     * 创建事务对象
     */
    createTransaction() {
        let trClass = transactionfactory_1.TransactionFactory.get();
        let con = this.conn;
        return trClass ? Reflect.construct(trClass, [con]) : null;
    }
}
exports.Connection = Connection;
//# sourceMappingURL=connection.js.map