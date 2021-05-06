import { Connection } from "../connection";
import { IConnectionCfg } from "../types";
import { BaseDriver } from "./basedriver";

export class OracleDriver implements BaseDriver {
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
            // this.pool = await this.dbMdl.createPool(this.options); 延迟创建
        }
    }

    /**
     * 获取连接
     */
    async getConnection() {
        // 使用池连接
        if (this.options['poolMax']) {
            if (!this.pool) {
                this.pool = await this.dbMdl.createPool(this.options);
            }
            // let pool = this.poolAlias ? this.dbMdl.getPool(this.poolAlias) : this.dbMdl.getPool();
            return await this.pool.getConnection();
        }
        return await this.dbMdl.getConnection(this.options);
    }


    /** 
     * 关闭连接
     * @param connection    数据库连接对象
     */
    async closeConnection(connection: Connection) {
        if (this.pool) {
            await connection.conn.release();
        } else {
            await connection.conn.close();
        }
        return null;
    }
}