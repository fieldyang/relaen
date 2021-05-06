import { Connection } from "../connection";
import { IConnectionCfg } from "../types";
import { BaseDriver } from "./basedriver";

export class PostgresDriver implements BaseDriver{
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

}