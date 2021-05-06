import { RelaenManager } from "./relaenmanager";
import { Connection } from "./connection";
import { Logger } from "./logger";
import { EntityManager } from "./entitymanager";
import { ErrorFactory } from "./errorfactory";
import { ConnectionManager } from "./connectionmanager";
import { stat } from "node:fs";

/**
 * sql执行器
 */
class SqlExecutor {
    /**
     * 执行mysql sql语句
     * @param connection    db connection
     * @param sql           待执行sql
     * @param params        参数数组
     * @param start         开始记录行
     * @param limit         最大记录行
     * @returns             执行结果或undefined
     */
    public static async exec(em: EntityManager, sql: string, params?: any[], start?: number, limit?: number): Promise<any> {
        sql = sql.trim();

        //sql类型：0:查询 1:增删改
        let sqlType: number = ['insert', 'update', 'delete'].includes(sql.substr(0, 6).toLowerCase()) ? 1 : 0;

        //缓存key，构建方式：sql_paramsvaluestring
        let key: string;
        //结果
        let result: any;
        if (sqlType === 0) {  //查询可从缓存中获取
            sql = this.handleStartAndLimit(sql, start, limit);
            key = sql;
            //构造缓存key
            if (params) {
                key += '_' + JSON.stringify(params);
            }
            //从缓存获取
            result = em.getFromCache(key);
            //缓存中存在，则直接返回
            if (result) {
                return result;
            }
        }
        //打印sql
        Logger.console("[Relaen execute sql]:\"" + sql + "\"");
        //打印参数
        if (params) {
            Logger.console("Parameters is " + JSON.stringify(params));
        }
        try {
            switch (RelaenManager.dialect) {
                case 'mysql':
                    result = await this.execMysql(em.connection, sql, params);
                    break;
                case 'oracle':
                    result = await this.execOracle(em.connection, sql, params);
                    break;
                case 'mssql':
                    result = await this.execMssql(em.connection, sql, params);
                    break;
                case 'postgres':
                    result = await this.execPostgres(em.connection, sql, params);
                    break;
            }
            //执行增删改，则清空cache
            if (sqlType === 1) {
                em.clearCache();
            } else {  //添加到缓存
                em.addToCache(key, result);
            }
        } catch (e) {
            throw ("[Relaen execute sql] Error:\"" + e.message + "\"");
        }
        Logger.console("[Relaen execute sql]:\"OK\"");
        return result;
    }

    /**
     * 执行mysql sql语句
     * @param connection    db connection
     * @param sql           待执行sql
     * @param params        参数数组
     * @param start         开始记录行
     * @param limit         最大记录行
     */
    private static async execMysql(connection: Connection, sql: string, params?: any[]) {
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
     * 执行oracle sql语句
     * @param sql       待执行sql
     * @param params    参数数组
     */
    private static async execOracle(connection: Connection, sql: string, params?: any[]) {
        let r = await connection.conn.execute(sql, params, { autoCommit: connection.autoCommit, outFormat: 4002 });
        // 为查询时返回查询rows，与mysql一致
        if (r.rows) {
            return r.rows;
        }
        if (r.lastRowid) {
            // let idSql = "select " + 主键 + " from " + 表名 + ' rowid = ' + r.lastRowid;
            // r = await connection.conn.execute()
            return r.lastRowid;
        }
        return r;
    }

    /**
     * 执行mssql sql语句
     * @param connection
     * @param sql 
     * @param params 
     */
    private static async execMssql(connection: Connection, sql: string, params?: any[]) {
        // let request = connection.conn;
        let request;
        if (connection['mssqlTransaction']) {
            request = connection['mssqlTransaction'].request();
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
     * 执行postgres sql语句
     * @param connection 
     * @param sql 
     * @param params 
     */
    private static async execPostgres(connection: Connection, sql: string, params?: any[]) {
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
    private static handleStartAndLimit(sql: string, start?: number, limit?: number) {
        if (!Number.isInteger(start) || start < 0 || !Number.isInteger(limit) || limit <= 0) {
            return sql;
        }
        switch (RelaenManager.dialect) {
            case 'mysql':
                return sql + ' limit ' + start + ',' + limit;
            case 'oracle':
                return sql + ' OFFSET ' + start + ' ROWS FETCH NEXT ' + limit + ' ROWS ONLY';
            case 'mssql':
                return sql + ' OFFSET ' + start + ' ROWS FETCH NEXT ' + limit + ' ROWS ONLY';
            case 'postgres':
                return sql + ' LIMIT ' + limit + ' OFFSET ' + start;
        }
    }
}

export { SqlExecutor }