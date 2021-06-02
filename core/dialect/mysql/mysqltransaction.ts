import { Transaction } from "../../transaction";

/**
 * mysql 事务类
 * @since 0.2.2
 */
export class MysqlTransaction extends Transaction{
    /**
     * 开始事务
     */
    async begin(){
        super.begin();
        await new Promise((resolve,reject)=>{
            this.conn.beginTransaction((err,conn)=>{
                if(err){
                    reject(err);
                    return;
                }
                resolve(null);
            });
        });
    }

    /**
     * 事务提交
     */
    async commit(){
        await new Promise((resolve,reject)=>{
            this.conn.commit(async (err)=>{
                if(err){
                    await this.rollback();
                    reject(err);
                    return;
                }
                resolve(null);
                super.commit();
            });
        });
    }

    /**
     * 事务回滚
     */
    async rollback(){
        await new Promise((resolve,reject)=>{
            this.conn.rollback((err)=>{
                if(err){
                    reject(err);
                    return;
                }
                resolve(null);
                super.rollback();
            });
        });
    }
}