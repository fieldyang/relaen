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
        this.conn['mssqlTransaction'] = this.tr;
        super.begin();
    }

    /**
     * 提交事务
     */
    async commit() {
        if (this.tr) {
            await this.tr.commit();
            delete this.conn['mssqlTransaction'];
            super.commit();
        }
    }

    /**
     * 事务回滚
     */
    async rollback() {
        if (this.tr) {
            await this.tr.rollback();
            delete this.conn['mssqlTransaction'];
            super.rollback();
        }
    }
}