import { Connection } from "../connection";
import { IConnectionCfg } from "../types";
import { BaseDriver } from "./basedriver";

export class MssqlDriver implements BaseDriver {
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

    constructor(cfg: IConnectionCfg) {
        this.dbMdl = require('mssql');
        this.options = {
            user: cfg.username,
            password: cfg.password,
            server: cfg.host,
            port: cfg.port,
            database: cfg.database
        };
        if (cfg.pool && cfg.pool.max) {
            this.options['pool'] = {
                max: cfg.pool.max || 10,
                min: cfg.pool.min || 0,
                idleTimeoutMillis: 30000
            }
            this.pool = new this.dbMdl.ConnectionPool(this.options);
        }
    }

    /**
     * 获取连接
     */
    async getConnection() {
        if (this.pool) {
            return await this.pool.connect(); // 创建connectionPool，执行完毕自动释放
        }
        return await this.dbMdl.connect(this.options);
    }


    /** 
     * 关闭连接
     * @param connection    数据库连接对象
     */
    async closeConnection(connection: Connection) {
        if (this.pool) {
            // await this.pool.close();    自动释放
        } else {
            await connection.conn.close();
        }
        return null;
    }

}