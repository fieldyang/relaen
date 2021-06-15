"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MssqlTransaction = void 0;
const transaction_1 = require("../../transaction");
/**
 * mssql 事务类
 * @since 0.2.3
 */
class MssqlTransaction extends transaction_1.Transaction {
    /**
     * 开始事务
     */
    async begin() {
        this.tr = await this.conn.transaction().begin();
        this.conn['mssqlTransaction'] = this.tr;
        super.begin();
    }
    /**
     * 提交事务
     */
    async commit() {
        if (this.tr) {
            await this.tr.commit();
            super.commit();
        }
    }
    /**
     * 事务回滚
     */
    async rollback() {
        if (this.tr) {
            await this.tr.rollback();
            super.rollback();
        }
    }
}
exports.MssqlTransaction = MssqlTransaction;
//# sourceMappingURL=mssqltransaction.js.map