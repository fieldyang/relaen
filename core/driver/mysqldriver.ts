import { Connection } from "../connection";
import { ErrorFactory } from "../errorfactory";
import { IConnectionCfg } from "../types";
import { BaseDriver } from "./basedriver";

export class MysqlDriver implements BaseDriver {
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
        this.dbMdl = require('mysql');
        this.options = {
            host: cfg.host,
            port: cfg.port,
            user: cfg.username,
            password: cfg.password,
            database: cfg.database
        };
        //连接池
        if (cfg.pool && cfg.pool.max) {
            this.options.connectionLimit = cfg.pool.max;
            this.pool = this.dbMdl.createPool(this.options);
        }
    }

    /**
     * 获取连接
     */
    getConnection() {
        return new Promise((resolve, reject) => {
            if (this.pool) {
                this.pool.getConnection((err, conn) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(conn);
                })
            } else {
                let conn = this.dbMdl.createConnection(this.options).connect(err => {
                    if (err) {
                        reject(err);
                    }
                });
                resolve(conn);
            }
        });
    }

    /**
     * 关闭连接
     * @param connection    数据库连接对象 
     */
    async closeConnection(connection: Connection) {
        if (this.pool) {
            connection.conn.release();
            return null;
        } else {
            return new Promise((res, rej) => {
                connection.conn.end(err => {
                    if (err) {
                        rej(ErrorFactory.getError('0202', [err]));
                    }
                    res(null);
                });
            });
        }
    }
}