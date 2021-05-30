import { Transaction } from "../../transaction";

/**
 * mssql 事务类
 * @since 0.2.2
 */
class MssqlTransaction extends Transaction {
    /**
     * 实际的transaction
     */
    private tr:any;
    /**
     * 开始事务
     * 新建事务，替换当前实体管理中连接对象
     */
    async begin() {
        this.tr = await this.conn.transaction().begin();
    }

    /**
     * 提交事务
     */
    async commit() {
        if (this.tr) {
            await this.tr.commit();
        }
    }

    /**
     * 事务回滚
     */
    async rollback() {
        if (this.tr) {
            await this.tr.rollback();
        }
    }
}

export { MssqlTransaction }