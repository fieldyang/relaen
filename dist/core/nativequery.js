"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NativeQuery = void 0;
const sqlexecutor_1 = require("./sqlexecutor");
const types_1 = require("./types");
const entityfactory_1 = require("./entityfactory");
const query_1 = require("./query");
const entitymanagerfactory_1 = require("./entitymanagerfactory");
/**
 * 原生查询
 */
class NativeQuery extends query_1.Query {
    /**
     * 构造query对象
     * @param rql               relean ql
     * @param em                entity manager
     * @param entityClassName   实体类名
     */
    constructor(sql, em, entityClassName) {
        super(em, entityClassName);
        this.execSql = sql;
    }
    /**
     * 获取单个实体或单个属性值
     */
    async getResult() {
        let results = await this.getResultList(0, 1);
        if (results && results.length > 0) {
            let props = Object.getOwnPropertyNames(results[0]);
            //如果只有一个属性，则只返回属性值
            if (props.length === 1) {
                return results[0][props[0]];
            }
            return results[0];
        }
        return null;
    }
    /**
     * 获取结果列表
     * @param start     开始索引
     * @param limit     记录数
     */
    async getResultList(start, limit) {
        if (start >= 0) {
            this.start = start;
        }
        if (limit > 0) {
            this.limit = limit;
        }
        let results = await sqlexecutor_1.SqlExecutor.exec(this.entityManager, this.execSql, this.paramArr, this.start, this.limit);
        if (results && Array.isArray(results)) {
            let arr = [];
            for (let r of results) {
                arr.push(this.genOne(r));
            }
            return arr;
        }
        return results;
    }
    /**
     * 根据查询结果生成单个数据对象
     * @param r
     */
    genOne(r) {
        if (this.entityClassName) {
            let ecfg = entityfactory_1.EntityFactory.getClass(this.entityClassName);
            if (ecfg) { //具备该实体类，则处理为实体
                //外键map
                let entity = new ecfg.entity();
                for (let col of ecfg.columns) {
                    let c = col[1];
                    //该字段无值或是外键
                    if (r[c.name] === null || r[c.name] === undefined || c.refName) {
                        continue;
                    }
                    entity[col[0]] = r[c.name];
                }
                //设置状态
                entitymanagerfactory_1.EntityManagerFactory.setEntityStatus(entity, types_1.EEntityState.PERSIST);
                return entity;
            }
        }
        let obj = {};
        Object.getOwnPropertyNames(r).forEach(item => {
            obj[item] = r[item];
        });
        return obj;
    }
}
exports.NativeQuery = NativeQuery;
//# sourceMappingURL=nativequery.js.map