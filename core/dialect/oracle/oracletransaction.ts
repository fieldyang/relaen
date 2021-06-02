import { Transaction } from "../../transaction";

/**
 * oracle 事务类
 * @since 0.2.2
 */
export class OracleTransaction extends Transaction {

    /**
     * 开始事务
     */
    async begin() {
        this.conn.autoCommit = false;
    }

    /**
     * 事务提交
     */
    async commit() {
        try {
            await this.conn.commit();
            this.conn.autoCommit = true;
        } catch (err) {
            throw err;
        }
    }

    /**
     * 事务回滚
     */
    async rollback() {
        try {
            await this.conn.rollback();
            this.conn.autoCommit = true;
            return null;
        } catch (err) {
            throw err;
        }
    }
}