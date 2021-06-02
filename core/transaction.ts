import { Connection } from "./connection";
/**
 * 事务基类
 */
export abstract class Transaction{
    /**
     * 实际连接对象，与dialect对应
     */
    conn:any;
    /**
     * 构造器
     * @param conn  真实连接对象
     */
    constructor(conn:any){
        this.conn = conn;
    }
    /**
     * 事务开始
     */
    public async begin(){}
    /**
     * 事务提交,继承类需要重载
     */
    public async commit(){}

    /**
     * 事务回滚,继承类需要重载
     */
    public async rollback(){}
}