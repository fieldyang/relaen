import { Transaction } from "../../transaction";

/**
 * mssql 事务类
 * @since 0.2.3
 */
export class MssqlTransaction extends Transaction {
    /**
     * 实际的transaction
     */
    private tr:any;
    /**
     * 开始事务
     */
    async begin() {
        this.tr = await this.conn.transaction().begin();
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