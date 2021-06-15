"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityManager = void 0;
const types_1 = require("./types");
const sqlexecutor_1 = require("./sqlexecutor");
const entityfactory_1 = require("./entityfactory");
const query_1 = require("./query");
const errorfactory_1 = require("./errorfactory");
const nativequery_1 = require("./nativequery");
const entitymanagerfactory_1 = require("./entitymanagerfactory");
const relaenutil_1 = require("./relaenutil");
const baseentity_1 = require("./baseentity");
const translatorfactory_1 = require("./translatorfactory");
const connectionmanager_1 = require("./connectionmanager");
/**
 * 实体管理器
 */
class EntityManager {
    /**
     * 构造函数
     * @param conn  连接对象
     * @param id    entity manager id
     */
    constructor(conn, id) {
        /**
         * 查询结果集缓存
         *     key:sql语句和参数值组合成的字符串，value:查询结果集
         */
        this.cache = new Map();
        this.id = id;
        this.connection = conn;
        this.cache = new Map();
    }
    /**
     * 保存新对象
     * 如果状态为new，则执行insert，同时改变为persist，如果为persist，则执行update
     * @param entity                实体
     * @param ignoreUndefinedValue  忽略undefined值，针对update时有效
     * @returns                     保存后的实体
     */
    async save(entity, ignoreUndefinedValue) {
        //先进行预处理
        if (!this.preHandleEntity(entity, ignoreUndefinedValue)) {
            return null;
        }
        let status = entitymanagerfactory_1.EntityManagerFactory.getEntityStatus(entity);
        let translator = translatorfactory_1.TranslatorFactory.get(entity.constructor.name);
        //无主键或状态为new
        if (status === types_1.EEntityState.NEW) {
            //检查并生成主键
            let idValue = relaenutil_1.RelaenUtil.getIdValue(entity);
            let sqlAndValue;
            if (idValue) { //存在主键
                //如果有主键，则查询是否存在对应实体
                let en = await this.find(entity.constructor.name, idValue);
                if (en) { //如果该实体已存在，则执行update
                    sqlAndValue = translator.entityToUpdate(entity, ignoreUndefinedValue);
                }
                else { //实体不存在，则执行insert
                    sqlAndValue = translator.entityToInsert(entity);
                }
            }
            else { //无主键
                //根据策略生成主键
                await this.genKey(entity);
                sqlAndValue = translator.entityToInsert(entity);
            }
            let r = await sqlexecutor_1.SqlExecutor.exec(this, sqlAndValue[0], sqlAndValue[1]);
            if (r === null) {
                return;
            }
            //修改状态
            entitymanagerfactory_1.EntityManagerFactory.setEntityStatus(entity, types_1.EEntityState.PERSIST);
            //设置主键值
            if (!relaenutil_1.RelaenUtil.getIdValue(entity)) {
                relaenutil_1.RelaenUtil.setIdValue(entity, r);
            }
        }
        else { //update
            //更新到数据库
            let sqlAndValue = translator.entityToUpdate(entity, ignoreUndefinedValue);
            let r = await sqlexecutor_1.SqlExecutor.exec(this, sqlAndValue[0], sqlAndValue[1]);
            if (r === null) {
                return null;
            }
        }
        return entity;
    }
    /**
     * 删除实体
     * @param entity        待删除实体或id
     * @param className     实体类名
     * @returns             被删除实体
     */
    async delete(entity, className) {
        let translator = translatorfactory_1.TranslatorFactory.get(entity.constructor.name);
        let sqlAndValue = translator.toDelete(entity, className);
        if (sqlAndValue) {
            await sqlexecutor_1.SqlExecutor.exec(this, sqlAndValue[0], [sqlAndValue[1]]);
        }
        return true;
    }
    /**
     * 通过id查找实体
     * @param entityClass   entity class 名
     * @param id            entity id 值
     * @returns             entity
     */
    async find(entityClassName, id) {
        let orm = entityfactory_1.EntityFactory.getClass(entityClassName);
        if (!orm) {
            throw errorfactory_1.ErrorFactory.getError("0020", [entityClassName]);
        }
        let idName = relaenutil_1.RelaenUtil.getIdName(entityClassName);
        if (!idName) {
            throw errorfactory_1.ErrorFactory.getError("0103");
        }
        let sql = "select * from " + relaenutil_1.RelaenUtil.getTableName(orm) + " where " + orm.columns.get(idName).name + ' = ?';
        let query = this.createNativeQuery(sql, entityClassName);
        query.setParameter(0, id);
        return await query.getResult();
    }
    /**
     * 根据条件查找一个对象
     * @param entityClassName   实体类名
     * @param params            参数对象{propName1:propValue1,propName2:{value:propValue2,rel:'>',before:'(',after:')',logic:'OR'}...}
     *                          参数值有两种方式，一种是值，一种是值对象，值对象参考ICondValueObj接口说明
     * @param order             排序对象 {propName1:asc,propName2:desc,...}
     * @since 0.1.3
     */
    async findOne(entityClassName, params, order) {
        let lst = await this.findMany(entityClassName, params, 0, 1, order);
        if (lst && lst.length > 0) {
            return lst[0];
        }
        return null;
    }
    /**
     * 根据条件查找多个对象
     * @param entityClassName   实体类名
     * @param params            参数对象，参考findOne
     * @param start             开始记录行
     * @param limit             获取记录数
     * @param order             排序对象，参考findOne
     * @since 0.1.3
     */
    async findMany(entityClassName, params, start, limit, order) {
        let query = this.createQuery(entityClassName);
        return await query.select('*')
            .where(params)
            .orderBy(order)
            .getResultList(start, limit);
    }
    /**
     * 获取记录数
     * @param entityClassName   实体类名
     * @param params            参数对象，参考findOne
     */
    async getCount(entityClassName, params) {
        let query = this.createQuery(entityClassName);
        return await query.select('count(*)')
            .where(params)
            .getResult(true);
    }
    /**
     * 删除多个
     * @param entityClassName   实体类名
     * @param params            条件参数，参考findOne
     * @returns                 成功:true，失败:false
     * @since 0.1.3
     */
    async deleteMany(entityClassName, params) {
        return await this.createQuery(entityClassName).delete().where(params).getResult();
    }
    /**
     * 创建查询对象
     * @param rql               relean ql
     * @param entityClassName   实体类名
     */
    createQuery(entityClassName) {
        return new query_1.Query(this, entityClassName);
    }
    /**
     * 原生sql查询
     * @param sql
     */
    createNativeQuery(sql, entityClassName) {
        return new nativequery_1.NativeQuery(sql, this, entityClassName);
    }
    /**
     * 关闭entity manager
     * @param force     是否强制关闭
     */
    async close(force) {
        entitymanagerfactory_1.EntityManagerFactory.closeEntityManager(this, force);
    }
    /**
     * 加入cache
     * @param key       key
     * @param value     结果集
     * @since           0.2.0
     */
    addToCache(key, value) {
        this.cache.set(key, value);
    }
    /**
     * 从cache中获取
     * @param key   缓存key
     * @since       0.2.0
     */
    getFromCache(key) {
        return this.cache.get(key);
    }
    /**
     * 清除缓存
     */
    clearCache() {
        this.cache.clear();
    }
    /**
     * 生成主键
     * @param entity
     */
    async genKey(entity) {
        //如果generator为table，则从指定主键生成表中获取主键，并赋予entity
        let orm = entityfactory_1.EntityFactory.getClass(entity.constructor.name);
        if (orm && orm.id) {
            let value;
            switch (orm.id.generator) {
                case 'sequence':
                    let sn = orm.id.seqName;
                    value = await connectionmanager_1.ConnectionManager.provider.getSequenceValue(this, sn);
                    break;
                case 'table': //0.2.3
                    let fn = orm.id.keyName;
                    //需要加锁
                    let query = this.createNativeQuery("select " + orm.id.valueName + " from " +
                        relaenutil_1.RelaenUtil.getTableName(orm.id.table, orm.schema) + " where " + orm.id.columnName + " ='" + fn + "'");
                    let r = await query.getResult();
                    if (r) {
                        //转换为整数
                        value = parseInt(r);
                        query = this.createNativeQuery("update " + relaenutil_1.RelaenUtil.getTableName(orm.id.table, orm.schema) +
                            " set " + orm.id.valueName + "=" + (++value) +
                            " where " + orm.id.columnName + " ='" + fn + "'");
                        await query.getResult();
                    }
                    //释放锁
                    //todo
                    break;
                case 'uuid':
                    value = require('uuid').v1();
                    break;
            }
            //设置主键值
            if (value) {
                relaenutil_1.RelaenUtil.setIdValue(entity, value);
            }
        }
    }
    /**
     * 从对象生成实体
     * @param obj   对象
     * @returns     实体对象
     */
    genEntityFromObject(obj) {
        if (!obj.__entityClassName) {
            return null;
        }
        let ecfg = entityfactory_1.EntityFactory.getClass(obj.__entityClassName);
        if (!ecfg) {
            throw errorfactory_1.ErrorFactory.getError("0020", [obj.__entityClassName]);
        }
        let en = new ecfg.entity;
        for (let col of ecfg.columns) {
            //字段属性名
            let fn = col[0];
            //字段对象
            let fo = col[1];
            if (!fo.refName) { //非外键
                en[fn] = obj[fn];
            }
            else if (obj[fn] && ecfg.relations.has(fn)) { //外键
                let rel = ecfg.relations.get(fn);
                en[fn] = this.find(rel.entity, obj[fn]);
            }
        }
    }
    /**
     * 预处理实体对象
     * @param entity                实体对象
     * @param ignoreUndefinedValue  忽略undefined值
     */
    preHandleEntity(entity, ignoreUndefinedValue) {
        let className = entity.constructor.name;
        let orm = entityfactory_1.EntityFactory.getClass(className);
        if (!orm) {
            throw errorfactory_1.ErrorFactory.getError("0010", [className]);
        }
        for (let key of orm.columns) {
            let fo = key[1];
            let v;
            if (fo.refName) { //外键，只取主键
                if (entity[key[0]] instanceof baseentity_1.BaseEntity) {
                    v = relaenutil_1.RelaenUtil.getIdValue(entity[key[0]]);
                }
            }
            else {
                v = entity[key[0]];
            }
            if ((v === null || v === undefined)) {
                if (!ignoreUndefinedValue && !fo.nullable) { //null 判断
                    if (key[0] !== orm.id.name) { //如果与主键不同且不能为空，则抛出异常 
                        throw errorfactory_1.ErrorFactory.getError('0021', [key[0]]);
                    }
                }
                entity[key[0]] = null;
            }
            else if (key[1].length && v.length > key[1].length) { //长度检测
                throw errorfactory_1.ErrorFactory.getError('0024', [className, key[0], key[1].length]);
            }
        }
        return true;
    }
}
exports.EntityManager = EntityManager;
//# sourceMappingURL=entitymanager.js.map