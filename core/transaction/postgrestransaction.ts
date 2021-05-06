import { Connection } from "../connection";
import { BaseTransaction } from "./basetransaction";

export class PostgresTransaction extends BaseTransaction {
    async begin(connection: Connection) {
        await connection.conn.query('begin');
        return null;
    }

    async commit(connection: Connection) {
        await connection.conn.query('commit');
        return null;
    }

    async rollback(connection: Connection) {
        await connection.conn.query('rollback');
        return null;
    }
}