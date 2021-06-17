import { Connection } from "../../connection";
import { IConnectionCfg, IEntityCfg } from "../../types";
import { BaseProvider } from "../../baseprovider";
import { EntityFactory } from "../../entityfactory";
import { EntityManager } from "../../entitymanager";
import { NativeQuery } from "../../nativequery";

/**
 * mssql provider
 * @since 0.2.3
 */
export class MssqlProvider extends BaseProvider {
    /**
     * 构造器
     * @param cfg   连接配置
     */
    constructor(cfg: IConnectionCfg) {
        super(cfg);
        this.dbMdl = require('mssql');
        this.options = {
            user: cfg.username,
            password: cfg.password,
            server: cfg.host ,
            port: cfg.port,
            database: cfg.database,
            options: {
                encrypt: false, // for azure
                trustServerCertificate: false // change to true for local dev / self-signed certs
            }
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
     * @returns     数据库连接
     */
    public async getConnection():Promise<any> {
        if (this.pool) {
            return await this.pool.connect(); // 创建connectionPool，执行完毕自动释放
        }
        return await this.dbMdl.connect(this.options);
    }

    /**
     * 关闭连接
     * @param connection    数据库连接对象
     */
    public async closeConnection(connection: Connection) {
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
    public async exec(connection: Connection, sql: string, params?: any[]):Promise<any> {
        let request;
        if (connection.conn.mssqlTransaction) {
            request = connection.conn.mssqlTransaction.request();
        } else {
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
    public handleStartAndLimit(sql: string, start?: number, limit?: number):string{
        if (!Number.isInteger(start) || start < 0 || !Number.isInteger(limit) || limit <= 0) {
            return sql;
        }
        //无order by 则需要添加
        if(!/order\s+by/i.test(sql)){
            let r = /from\s+\w+/.exec(sql);
            if(!r){
                return sql;
            }
            let tbl = r[0].replace(/from\s+/,'');
            let cfg:IEntityCfg = EntityFactory.getEntityCfgByTblName(tbl);
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
    public async getSequenceValue(em:EntityManager,seqName:string,schema:string):Promise<number>{
        // TODO schema
        let query: NativeQuery = em.createNativeQuery("select next value for " + seqName);
        let r = await query.getResult();
        if (r) {
            //转换为整数
            return parseInt(r);
        }
        return 0;
    }
}
