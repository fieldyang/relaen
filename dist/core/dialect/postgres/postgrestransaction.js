"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostgresTransaction = void 0;
const transaction_1 = require("../../transaction");
/**
 * postgres 事务类
 * @since 0.2.3
 */
class PostgresTransaction extends transaction_1.Transaction {
    /**
     * 事务开始
     */
    async begin() {
        await this.conn.query('begin');
        super.begin();
    }
    /**
     * 事务提交
     */
    async commit() {
        await this.conn.query('commit');
        super.commit();
    }
    /**
     * 事务回滚
     */
    async rollback() {
        await this.conn.query('rollback');
        super.rollback();
    }
}
exports.PostgresTransaction = PostgresTransaction;
//# sourceMappingURL=postgrestransaction.js.map