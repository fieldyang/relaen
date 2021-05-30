import { Connection } from "../../connection";
import { IConnectionCfg } from "../../types";
import { IBaseDriver } from "../../ibasedriver";

/**
 * postgres driver
 * @since 0.2.2
 */
export class PostgresDriver implements IBaseDriver{
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
    constructor(cfg:IConnectionCfg) {
        this.dbMdl = require('pg');
        this.options = {
            user: cfg.username,
            password: cfg.password,
            host: cfg.host,
            port: cfg.port,
            database: cfg.database
        };
        if (cfg.pool) {
            this.pool = new this.dbMdl.Pool(this.options);
        }
    }

    /**
     * 获取postgres连接
     */
    async getConnection() {
        if (this.pool) {
            let conn = await this.pool.connect();
            return conn;
        }
        let conn = new this.dbMdl.Client(this.options);
        await conn.connect();
        return conn;
    }

    /**
     * 关闭postgres连接
     * @param connection    数据库连接对象
     */
    async closeConnection(connection: Connection) {
        if (this.pool) {
            await connection.conn.release();
        } else {
            await connection.conn.end();
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
        let r = await connection.conn.query(sql, params);
        if (r.command == 'INSERT') {
            return Object.values(r.rows[0])[0];
        }
        if (r.rows) {
            return r.rows;
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
        return sql + ' LIMIT ' + limit + ' OFFSET ' + start;
    }
}