"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MysqlTransaction = void 0;
const transaction_1 = require("../../transaction");
/**
 * mysql 事务类
 * @since 0.2.3
 */
class MysqlTransaction extends transaction_1.Transaction {
    /**
     * 开始事务
     */
    async begin() {
        await new Promise((resolve, reject) => {
            this.conn.beginTransaction((err, conn) => {
                if (err) {
                    reject(err);
                    return;
                }
                super.begin();
                resolve(null);
            });
        });
    }
    /**
     * 事务提交
     */
    async commit() {
        await new Promise((resolve, reject) => {
            this.conn.commit(async (err) => {
                if (err) {
                    await this.rollback();
                    reject(err);
                    return;
                }
                super.commit();
                resolve(null);
            });
        });
    }
    /**
     * 事务回滚
     */
    async rollback() {
        await new Promise((resolve, reject) => {
            this.conn.rollback((err) => {
                if (err) {
                    reject(err);
                    return;
                }
                super.rollback();
                resolve(null);
            });
        });
    }
}
exports.MysqlTransaction = MysqlTransaction;
//# sourceMappingURL=mysqltransaction.js.map