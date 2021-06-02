import { Transaction } from "../../transaction";

/**
 * postgres 事务类
 * @since 0.2.2
 */
export class PostgresTransaction extends Transaction {
    async begin() {
        await this.conn.conn.query('begin');
    }

    async commit() {
        await this.conn.conn.query('commit');
    }

    async rollback() {
        await this.conn.conn.query('rollback');
    }
}