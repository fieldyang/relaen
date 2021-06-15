"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityProxy = void 0;
const types_1 = require("./types");
const entityfactory_1 = require("./entityfactory");
const entitymanagerfactory_1 = require("./entitymanagerfactory");
const errorfactory_1 = require("./errorfactory");
const relaenutil_1 = require("./relaenutil");
const logger_1 = require("./logger");
/**
 * 实体代理类
 */
class EntityProxy {
    /**
     * 获取实体关联对象
     * @param entity    实体
     * @param propName  关联属性名
     */
    static async get(entity, propName) {
        if (!relaenutil_1.RelaenUtil.getIdValue(entity)) {
            logger_1.Logger.error(errorfactory_1.ErrorFactory.getError("0105").message);
            return null;
        }
        let pv = entity[propName];
        if (pv !== undefined && pv !== null) {
            return pv;
        }
        let eo = entityfactory_1.EntityFactory.getClass(entity.constructor.name);
        //具备关联关系
        if (eo.relations.has(propName)) {
            let em = await entitymanagerfactory_1.getEntityManager();
            let rel = eo.relations.get(propName);
            //关联实体配置
            let eo1 = entityfactory_1.EntityFactory.getClass(rel.entity);
            let column = eo.columns.get(propName);
            //引用外键
            if (rel.type === types_1.ERelationType.ManyToOne || rel.type === types_1.ERelationType.OneToOne && !rel.mappedBy) {
                let sql;
                let query;
                sql = "select m.* from " + relaenutil_1.RelaenUtil.getTableName(eo1) + " m," + relaenutil_1.RelaenUtil.getTableName(eo) + " m1 where m." +
                    column.refName + "= m1." + column.name + " and m1." + eo.columns.get(eo.id.name).name + " = ?";
                query = em.createNativeQuery(sql, rel.entity);
                //设置外键id
                query.setParameter(0, relaenutil_1.RelaenUtil.getIdValue(entity));
                //当state=2时，可能不存在外键，则query不存在
                if (query) {
                    entity[propName] = await query.getResult();
                }
            }
            else if (rel.mappedBy && (rel.type === types_1.ERelationType.OneToMany || rel.type === types_1.ERelationType.OneToOne)) { //被引用
                if (!eo1) {
                    throw errorfactory_1.ErrorFactory.getError('0020', [rel.entity]);
                }
                //通过mappedby找到引用属性
                let column1 = eo1.columns.get(rel.mappedBy);
                if (!column1) {
                    throw errorfactory_1.ErrorFactory.getError('0022', [rel.entity, column1]);
                }
                let rql = "select * from " + relaenutil_1.RelaenUtil.getTableName(eo1) + " where " + column1.name + " = ?";
                //查询外键对象
                let query = em.createNativeQuery(rql, rel.entity);
                //设置查询值
                query.setParameter(0, relaenutil_1.RelaenUtil.getIdValue(entity));
                entity[propName] = rel.type === types_1.ERelationType.OneToOne ? await query.getResult() : await query.getResultList();
            }
            //新建的需要关闭
            await em.close();
            return entity[propName];
        }
    }
}
exports.EntityProxy = EntityProxy;
//# sourceMappingURL=entityproxy.js.map