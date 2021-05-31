import { Connection } from "../../connection";
import { ErrorFactory } from "../../errorfactory";
import { IConnectionCfg } from "../../types";
import { IBaseDriver } from "../../ibasedriver";
import { EntityManager } from "../../entitymanager";
import { NativeQuery } from "../../nativequery";

/**
 * mysql driver
 * @since 0.2.2
 */
export class MysqlDriver implements IBaseDriver {
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

    /**
     * 执行sql语句
     * @param connection    db connection
     * @param sql           待执行sql
     * @param params        参数数组
     */
     public async exec(connection: Connection, sql: string, params?: any[]) {
        if (sql.length < 6) {
            throw ErrorFactory.getError("0002", [sql]);
        }
        let r: any = await new Promise((resolve, reject) => {
            connection.conn.query(sql, params, (error, results, fields) => {
                if (error) {
                    reject(error);
                }
                resolve(results);
            });
        });
        if (r.insertId) {
            return r.insertId;
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
        return sql + ' limit ' + start + ',' + limit;
    }

    /**
     * 获取实体sequence，针对主键生成策略为sequence时有效
     * @param em        entity manager
     * @param seqName   sequence name
     * @returns         sequence 值
     */
     public async getSequenceValue(em:EntityManager,seqName:string):Promise<number>{
        return 0;
    }
}