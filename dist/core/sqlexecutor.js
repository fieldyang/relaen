"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SqlExecutor = void 0;
const logger_1 = require("./logger");
const relaenutil_1 = require("./relaenutil");
const connectionmanager_1 = require("./connectionmanager");
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
    static async exec(em, sql, params, start, limit) {
        sql = sql.trim();
        //sql类型：0:查询 1:增删改
        let sqlType = ['insert', 'update', 'delete'].includes(sql.substr(0, 6).toLowerCase()) ? 1 : 0;
        //缓存key，构建方式：sql_paramsvaluestring
        let key;
        //结果
        let result;
        if (sqlType === 0) { //查询可从缓存中获取
            sql = connectionmanager_1.ConnectionManager.provider.handleStartAndLimit(sql, start, limit);
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
        //处理占位符
        sql = relaenutil_1.RelaenUtil.handlePlaceholder(sql);
        //打印sql
        logger_1.Logger.console("[Relaen execute sql]:\"" + sql + "\"");
        //打印参数
        if (params) {
            logger_1.Logger.console("Parameters is " + JSON.stringify(params));
        }
        try {
            result = await connectionmanager_1.ConnectionManager.provider.exec(em.connection, sql, params);
            //执行增删改，则清空cache
            if (sqlType === 1) {
                em.clearCache();
            }
            else { //添加到缓存
                em.addToCache(key, result);
            }
        }
        catch (e) {
            throw ("[Relaen execute sql] Error:\"" + e.message + "\"");
        }
        logger_1.Logger.console("[Relaen execute sql]:\"OK\"");
        return result;
    }
}
exports.SqlExecutor = SqlExecutor;
//# sourceMappingURL=sqlexecutor.js.map