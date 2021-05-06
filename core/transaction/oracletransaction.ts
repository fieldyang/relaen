import { Connection } from "../connection";
import { BaseTransaction } from "./basetransaction";

class OracleTransaction extends BaseTransaction {

    /**
     * 开始事务
     */
    async begin(connection: Connection) {
        connection.autoCommit = false;
        return null;
    }

    /**
     * 事务提交
     */
    async commit(connection: Connection) {
        try {
            await connection.conn.commit();
            connection.autoCommit = true;
            return null;
        } catch (err) {
            throw err;
        }
    }

    /**
     * 事务回滚
     */
    async rollback(connection: Connection) {
        try {
            await connection.conn.rollback();
            connection.autoCommit = true;
            return null;
        } catch (err) {
            throw err;
        }
    }
}

export { OracleTransaction }