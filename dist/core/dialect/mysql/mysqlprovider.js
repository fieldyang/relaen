"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MysqlProvider = void 0;
const errorfactory_1 = require("../../errorfactory");
const baseprovider_1 = require("../../baseprovider");
/**
 * mysql provider
 * @since 0.2.3
 */
class MysqlProvider extends baseprovider_1.BaseProvider {
    /**
     * 构造器
     * @param cfg   连接配置
     */
    constructor(cfg) {
        super(cfg);
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
     * @returns     数据库连接
     */
    async getConnection() {
        return new Promise((resolve, reject) => {
            if (this.pool) {
                this.pool.getConnection((err, conn) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(conn);
                });
            }
            else {
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
    async closeConnection(connection) {
        if (this.pool) {
            connection.conn.release();
            return Promise.resolve(null);
        }
        else {
            return new Promise((res, rej) => {
                connection.conn.end(err => {
                    if (err) {
                        rej(errorfactory_1.ErrorFactory.getError('0202', [err]));
                        return;
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
     * @returns             结果(集)
     */
    async exec(connection, sql, params) {
        if (sql.length < 6) {
            throw errorfactory_1.ErrorFactory.getError("0002", [sql]);
        }
        let r = await new Promise((resolve, reject) => {
            connection.conn.query(sql, params, (error, results, fields) => {
                if (error) {
                    reject(error);
                    return;
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
    handleStartAndLimit(sql, start, limit) {
        if (!Number.isInteger(start) || start < 0 || !Number.isInteger(limit) || limit <= 0) {
            return sql;
        }
        return sql + ' limit ' + start + ',' + limit;
    }
    /**
     * 获取实体sequence，针对主键生成策略为sequence时有效
     * mysql 不支持sequence，返回0
     * @param em        entity manager
     * @param seqName   sequence name
     * @returns         sequence 值
     */
    async getSequenceValue(em, seqName) {
        return 0;
    }
}
exports.MysqlProvider = MysqlProvider;
//# sourceMappingURL=mysqlprovider.js.map