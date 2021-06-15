"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RelaenUtil = void 0;
const entityfactory_1 = require("./entityfactory");
const baseentity_1 = require("./baseentity");
const relaenmanager_1 = require("./relaenmanager");
const placeholderfactory_1 = require("./placeholderfactory");
class RelaenUtil {
    /**
     * 生成对象id，提供 entitymanager 和connection使用
     */
    static genId() {
        return ++this.idGenerator;
    }
    /**
     * 获取id名
     * @param entity 实体对象或实体类名
     * @returns      实体id名
     */
    static getIdName(entity) {
        let en;
        if (entity instanceof baseentity_1.BaseEntity) {
            en = entity.constructor.name;
        }
        else if (typeof entity === 'string') {
            en = entity;
        }
        let cfg = entityfactory_1.EntityFactory.getClass(en);
        if (cfg.id) {
            return cfg.id.name;
        }
    }
    /**
     * 设置属性值
     * @param entity    实体对象
     * @param value     实体值
     */
    static setIdValue(entity, value) {
        let cfg = entityfactory_1.EntityFactory.getClass(entity.constructor.name);
        if (cfg && cfg.id && cfg.id.name) {
            entity[cfg.id.name] = value;
        }
    }
    /**
     * 获取id值
     * @param entity    实体对象
     */
    static getIdValue(entity) {
        let cfg = entityfactory_1.EntityFactory.getClass(entity.constructor.name);
        if (cfg && cfg.id) {
            return entity[cfg.id.name];
        }
    }
    /**
     * 处理字段字符串值
     * @param value     待处理值
     * @returns         处理后的字符串
     */
    static valueToString(value) {
        if (typeof value !== 'string') {
            value = value + '';
        }
        //替换 ' 为 \'
        value = value.replace(/'/g, "\'");
        //两端添加 '
        return "'" + value + "'";
    }
    /**
     * 处理参数占位符
     * @param sql   sql串
     * @returns     修改后的sql
     */
    static handlePlaceholder(sql) {
        //mysql 默认处理
        if (relaenmanager_1.RelaenManager.dialect === 'mysql') {
            return sql;
        }
        let reg = /(\'.*?\?.*?\')|\?/g;
        let index = 0;
        return sql.replace(reg, (match, p1) => {
            if (match !== '?') {
                return p1;
            }
            return placeholderfactory_1.PlaceholderFactory.get(index++);
        });
    }
    /**
     * 获取table名
     * @param cfg   实体配置或表名
     * @returns     表名串，如果有schema，则需要加上schema
     */
    static getTableName(cfg, schema) {
        if (typeof cfg === 'object') {
            return cfg.schema ? cfg.schema + '.' + cfg.table : cfg.table;
        }
        else {
            return schema ? schema + '.' + cfg : cfg;
        }
    }
}
exports.RelaenUtil = RelaenUtil;
/**
 * 对象id计数器
 */
RelaenUtil.idGenerator = 0;
//# sourceMappingURL=relaenutil.js.map