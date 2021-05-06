import { Connection } from "../connection";
import { EntityManagerFactory } from "../entitymanagerfactory";
import { BaseTransaction } from "./basetransaction";

class MssqlTransaction extends BaseTransaction {

    /**
     * 开始事务
     * 新建事务，替换当前实体管理中连接对象
     */
    async begin(connection: Connection) {
        connection['mssqlTransaction'] = await connection.conn.transaction().begin();
        return null;
    }

    /**
     * 提交事务
     */
    async commit(connection: Connection) {
        if (connection['mssqlTransaction']) {
            await connection['mssqlTransaction'].commit();
            delete connection['mssqlTransaction'];
        }
        return null;
    }

    /**
     * 事务回滚
     */
    async rollback(connection: Connection) {
        if (connection['mssqlTransaction']) {
            await connection['mssqlTransaction'].rollback();
            delete connection['mssqlTransaction'];
        }
        return null;
    }
}

export { MssqlTransaction }