import { Logger } from "../../logger";
import { Transaction } from "../../transaction";

/**
 * mysql 事务类
 * @since 0.2.2
 */
class MysqlTransaction extends Transaction{
    /**
     * 开始事务
     */
    public async begin(){
        await new Promise((resolve,reject)=>{
            this.conn.beginTransaction((err,conn)=>{
                if(err){
                    reject(err);
                    return;
                }
                super.begin();
                resolve(null);
            });
        });
    }

    /**
     * 事务提交
     */
    public async commit(){
        await new Promise((resolve,reject)=>{
            this.conn.commit(async (err)=>{
                if(err){
                    await this.rollback();
                    reject(err);
                    return;
                }
                super.commit();
                resolve(null);
            });
        });
    }

    /**
     * 事务回滚
     */
    public async rollback(){
        await new Promise((resolve,reject)=>{
            this.conn.rollback((err)=>{
                if(err){
                    reject(err);
                    return;
                }
                super.rollback();
                resolve(null);
            });
        });
    }
}


export{MysqlTransaction}