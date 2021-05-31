import { Connection } from "./connection";
import { EntityManager } from "./entitymanager";
import { IEntity } from "./types";

/**
 * 数据库驱动器接口
 * 提供与dialect相关的操作，不同dialect需要实现此接口
 * @since 0.2.2
 */
export interface IBaseDriver {
    /**
     * 配置
     */
    options: any;

    /**
     * 连接池
     */
    pool: any;

    /**
     * 数据库 npm 模块
     */
    dbMdl: any;


    /**
     * 获取连接
     */
    getConnection();


    /** 
     * 关闭连接
     * @param connection    数据库连接对象
     */
    closeConnection(connection: Connection);

    /**
     * 执行postgres sql语句
     * @param connection    数据库连接
     * @param sql           sql语句
     * @param params        参数
     */
    exec(connection: Connection, sql: string, params?: any[]):any;

    /**
     * 处理记录起始记录索引和记录数
     * @param sql       sql
     * @param start     开始索引
     * @param limit     记录数
     * @returns         处理后的sql
     */
    handleStartAndLimit(sql: string, start?: number, limit?: number);

    /**
     * 获取实体sequence，针对主键生成策略为sequence时有效
     * @param em        entity manager
     * @param seqName   sequence name
     * @returns         sequence 值
     */
    getSequenceValue(em:EntityManager,seqName:string):Promise<number>;
}