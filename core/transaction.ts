import { Connection } from "./connection";
/**
 * 事务基类
 */
export class Transaction{
    conn:any;
    constructor(conn){
        this.conn = conn;
    }
    /**
     * 事务开始
     */
    async begin(){}
    /**
     * 事务提交,继承类需要重载
     */
    async commit(){}

    /**
     * 事务回滚,继承类需要重载
     */
    async rollback(){}
}