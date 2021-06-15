"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OracleTransaction = void 0;
const transaction_1 = require("../../transaction");
/**
 * oracle 事务类
 * @since 0.2.3
 */
class OracleTransaction extends transaction_1.Transaction {
    /**
     * 开始事务
     */
    async begin() {
        // transaction 中引用原conn
        this.conn['autoCommit'] = false;
        super.begin();
    }
    /**
     * 事务提交
     */
    async commit() {
        try {
            await this.conn.commit();
            this.conn['autoCommit'] = true;
            super.commit();
        }
        catch (err) {
            throw err;
        }
    }
    /**
     * 事务回滚
     */
    async rollback() {
        try {
            await this.conn.rollback();
            this.conn['autoCommit'] = true;
            super.rollback();
            return null;
        }
        catch (err) {
            throw err;
        }
    }
}
exports.OracleTransaction = OracleTransaction;
//# sourceMappingURL=oracletransaction.js.map