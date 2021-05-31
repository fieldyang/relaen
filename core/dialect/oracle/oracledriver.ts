import { Connection } from "../../connection";
import { IConnectionCfg } from "../../types";
import { IBaseDriver } from "../../ibasedriver";
import { EntityManager } from "../../entitymanager";
import { NativeQuery } from "../../nativequery";

/**
 * oracle driver
 * @since 0.2.2
 */
export class OracleDriver implements IBaseDriver {
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
     * 构造器
     * @param cfg   连接配置
     */
    constructor(cfg: IConnectionCfg) {
        this.dbMdl = require('oracledb');
        this.dbMdl.autoCommit = true;
        this.options = {
            user: cfg.username,
            password: cfg.password,
            connectString: cfg.host + ":" + cfg.port + "/" + cfg.database,
        }
        if (cfg.pool && cfg.pool.max) {
            this.options['poolMax'] = cfg.pool.max || 4;
            this.options['poolMin'] = cfg.pool.min || 4;
        }
    }

    /**
     * 获取连接
     */
    public async getConnection() {
        // 使用池连接
        if (this.options['poolMax']) {
            if (!this.pool) {
                this.pool = await this.dbMdl.createPool(this.options);
            }
            return await this.pool.getConnection();
        }
        return await this.dbMdl.getConnection(this.options);
    }

    /**
     * 关闭连接
     * @param connection    数据库连接对象
     */
     public async closeConnection(connection: Connection) {
        if (this.pool) {
            await connection.conn.release();
        } else {
            await connection.conn.close();
        }
        return null;
    }

    /**
     * 执行sql语句
     * @param connection    db connection
     * @param sql           待执行sql
     * @param params        参数数组
     */
    public async exec(connection: Connection, sql: string, params?: any[]) {
        let r = await connection.conn.execute(sql, params, { autoCommit: connection.autoCommit, outFormat: 4002 });
        // 为查询时返回查询rows，与mysql一致
        if (r.rows) {
            return r.rows;
        }
        if (r.lastRowid) {
            return r.lastRowid;
        }
        return r;
    }

    /**
     * 处理记录起始记录索引和记录数
     * @param sql       sql
     * @param start     开始索引
     * @param limit     记录数
     * @returns         处理后的sql
     * @since           0.2.0
     */
    public handleStartAndLimit(sql: string, start?: number, limit?: number) {
        if (!Number.isInteger(start) || start < 0 || !Number.isInteger(limit) || limit <= 0) {
            return sql;
        }
        return sql + ' OFFSET ' + start + ' ROWS FETCH NEXT ' + limit + ' ROWS ONLY';
    }

    /**
     * 获取实体sequence，针对主键生成策略为sequence时有效
     * @param em        entity manager
     * @param seqName   sequence name
     * @returns         sequence 值
     */
    public async getSequenceValue(em:EntityManager,seqName:string):Promise<number>{
        let query: NativeQuery = em.createNativeQuery('select "' + seqName + '".nextval from dual');
        let r = await query.getResult();
        if (r) {
            //转换为整数
            return parseInt(r);
        }
        return 0;
    }
}