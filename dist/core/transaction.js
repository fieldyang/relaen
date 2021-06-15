"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = void 0;
const logger_1 = require("./logger");
/**
 * 事务基类
 */
class Transaction {
    /**
     * 构造器
     * @param conn  真实连接对象
     */
    constructor(conn) {
        this.conn = conn;
    }
    /**
     * 事务开始
     */
    async begin() {
        logger_1.Logger.console('Transaction is began.');
    }
    /**
     * 事务提交,继承类需要重载
     */
    async commit() {
        logger_1.Logger.console('Transaction is commited.');
    }
    /**
     * 事务回滚,继承类需要重载
     */
    rollback() {
        logger_1.Logger.console('Transaction is rolled back.');
    }
}
exports.Transaction = Transaction;
//# sourceMappingURL=transaction.js.map