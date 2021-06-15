"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseProvider = void 0;
/**
 * 数据库驱动器接口
 * 提供与dialect相关的操作，不同dialect需要实现此接口
 * @since 0.2.3
 */
class BaseProvider {
    constructor(cfg) {
    }
    /**
     * 获取连接
     */
    async getConnection() {
        return null;
    }
    /**
     * 关闭连接
     * @param connection    数据库连接对象
     */
    async closeConnection(connection) {
    }
    /**
     * 执行postgres sql语句
     * @param connection    数据库连接
     * @param sql           sql语句
     * @param params        参数
     */
    async exec(connection, sql, params) {
        return null;
    }
    /**
     * 处理记录起始记录索引和记录数
     * @param sql       sql
     * @param start     开始索引
     * @param limit     记录数
     * @returns         处理后的sql
     */
    handleStartAndLimit(sql, start, limit) {
        return null;
    }
    /**
     * 获取实体sequence，针对主键生成策略为sequence时有效
     * @param em        entity manager
     * @param seqName   sequence name
     * @returns         sequence 值
     */
    getSequenceValue(em, seqName) {
        return null;
    }
}
exports.BaseProvider = BaseProvider;
//# sourceMappingURL=baseprovider.js.map