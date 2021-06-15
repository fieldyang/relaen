"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostgresProvider = void 0;
const baseprovider_1 = require("../../baseprovider");
/**
 * postgres provider
 * @since 0.2.3
 */
class PostgresProvider extends baseprovider_1.BaseProvider {
    /**
     * 构造器
     * @param cfg   连接配置
     */
    constructor(cfg) {
        super(cfg);
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
     * @returns     数据库连接
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
    async closeConnection(connection) {
        if (this.pool) {
            await connection.conn.release();
        }
        else {
            await connection.conn.end();
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
    async exec(connection, sql, params) {
        let r = await connection.conn.query(sql, params);
        if (r && r.command == 'INSERT') {
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
    handleStartAndLimit(sql, start, limit) {
        if (!Number.isInteger(start) || start < 0 || !Number.isInteger(limit) || limit <= 0) {
            return sql;
        }
        return sql + ' LIMIT ' + limit + ' OFFSET ' + start;
    }
    /**
     * 获取实体sequence，针对主键生成策略为sequence时有效
     * @param em        entity manager
     * @param seqName   sequence name
     * @returns         sequence 值
     */
    async getSequenceValue(em, seqName) {
        let query = em.createNativeQuery("select nextval('" + seqName + "')");
        let r = await query.getResult();
        if (r) {
            //转换为整数
            return parseInt(r);
        }
        return 0;
    }
}
exports.PostgresProvider = PostgresProvider;
//# sourceMappingURL=postgresprovider.js.map