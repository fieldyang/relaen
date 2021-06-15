"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MssqlProvider = void 0;
const baseprovider_1 = require("../../baseprovider");
const entityfactory_1 = require("../../entityfactory");
/**
 * mssql provider
 * @since 0.2.3
 */
class MssqlProvider extends baseprovider_1.BaseProvider {
    /**
     * 构造器
     * @param cfg   连接配置
     */
    constructor(cfg) {
        super(cfg);
        this.dbMdl = require('mssql');
        this.options = {
            user: cfg.username,
            password: cfg.password,
            server: cfg.host,
            port: cfg.port,
            database: cfg.database,
            options: {
                encrypt: false,
                trustServerCertificate: false // change to true for local dev / self-signed certs
            }
        };
        if (cfg.pool && cfg.pool.max) {
            this.options['pool'] = {
                max: cfg.pool.max || 10,
                min: cfg.pool.min || 0,
                idleTimeoutMillis: 30000
            };
            this.pool = new this.dbMdl.ConnectionPool(this.options);
        }
    }
    /**
     * 获取连接
     * @returns     数据库连接
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
    async closeConnection(connection) {
        if (!this.pool) {
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
    async exec(connection, sql, params) {
        let request;
        if (connection.conn.mssqlTransaction) {
            request = connection.conn.mssqlTransaction.request();
        }
        else {
            request = connection.conn.request();
        }
        params = params || [];
        params.forEach((value, index) => {
            request.input(index.toString(), value);
        });
        let r = await request.query(sql);
        if (r.recordset) {
            if (r.recordset[0] && r.recordset[0].insertId && r.recordset.length == 1 && Object.keys(r.recordset[0]).length == 1) {
                return r.recordset[0].insertId;
            }
            return r.recordset;
        }
        return r;
    }
    /**
     * 处理记录起始记录索引和记录数
     * @param sql       sql
     * @param start     开始索引
     * @param limit     记录数
     * @returns         处理后的sql
     */
    handleStartAndLimit(sql, start, limit) {
        if (!Number.isInteger(start) || start < 0 || !Number.isInteger(limit) || limit <= 0) {
            return sql;
        }
        //无order by 则需要添加
        if (!/order\s+by/i.test(sql)) {
            let r = /from\s+\w+/.exec(sql);
            if (!r) {
                return sql;
            }
            let tbl = r[0].replace(/from\s+/, '');
            let cfg = entityfactory_1.EntityFactory.getEntityCfgByTblName(tbl);
            sql += ' order by ' + cfg.columns.get(cfg.id.name).name + ' asc ';
        }
        return sql + ' OFFSET ' + start + ' ROWS FETCH NEXT ' + limit + ' ROWS ONLY';
    }
    /**
     * 获取实体sequence，针对主键生成策略为sequence时有效
     * @param em        entity manager
     * @param seqName   sequence name
     * @returns         sequence 值
     */
    async getSequenceValue(em, seqName) {
        let query = em.createNativeQuery("select next value for " + seqName);
        let r = await query.getResult();
        if (r) {
            //转换为整数
            return parseInt(r);
        }
        return 0;
    }
}
exports.MssqlProvider = MssqlProvider;
//# sourceMappingURL=mssqlprovider.js.map