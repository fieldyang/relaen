import { Connection } from "../../connection";
import { IConnectionCfg } from "../../types";
import { BaseDriver } from "../../basedriver";
import { EntityManager } from "../../entitymanager";
import { NativeQuery } from "../../nativequery";

/**
 * oracle driver
 * @since 0.2.3
 */
export class OracleDriver extends BaseDriver {
    /**
     * 构造器
     * @param cfg   连接配置
     */
    constructor(cfg: IConnectionCfg) {
        super(cfg);
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
     * @returns     connection
     */
    public async getConnection(): Promise<any> {
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
     * @returns             结果(集)
     */
    public async exec(connection: Connection, sql: string, params?: any[]) {
        // 默认自动提交
        let autoCommit = connection.conn.autoCommit === undefined ? true : connection.conn.autoCommit;
        let r = await connection.conn.execute(sql, params, { autoCommit: autoCommit, outFormat: 4002 });
        // 为查询时返回查询rows，与mysql一致
        if (r.rows) {
            return r.rows;
        }
        // 未使用oracle Rowid
        // if (r.lastRowid) {
        //     return r.lastRowid;
        // }
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
    public async getSequenceValue(em: EntityManager, seqName: string): Promise<number> {
        let query: NativeQuery = em.createNativeQuery('select "' + seqName + '".nextval from dual');
        // select "SEQ_SHOP".nextval from dual OFFSET 0 ROWS FETCH NEXT 1 ROWS ONLY 查询不能加分页
        let r = await query.getResultList(-1, -1);
        if (r[0].NEXTVAL) {
            //转换为整数
            return parseInt(r[0].NEXTVAL);
        }
        return 0;
    }
}