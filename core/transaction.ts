import { Connection } from "./connection";
import { Logger } from "./logger";
import { RelaenManager } from "./relaenmanager";
/**
 * 事务基类
 */
export class Transaction{
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
    public async begin(){
        if(RelaenManager.debug){
            Logger.console('Transaction is beginning');
        }
    }
    /**
     * 事务提交,继承类需要重载
     */
    public async commit(){
        if(RelaenManager.debug){
            Logger.console('Transaction is commited');
        }
    }

    /**
     * 事务回滚,继承类需要重载
     */
    public async rollback(){
        if(RelaenManager.debug){
            Logger.console('Transaction is rollback');
        }
    }
}