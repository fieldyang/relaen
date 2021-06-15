"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseEntity = void 0;
const entityfactory_1 = require("./entityfactory");
const types_1 = require("./types");
const entitymanagerfactory_1 = require("./entitymanagerfactory");
const relaenutil_1 = require("./relaenutil");
/**
 * 实体基类
 */
class BaseEntity extends Object {
    /**
     * 构造函数
     */
    constructor() {
        super();
        //设置新建状态
        entitymanagerfactory_1.EntityManagerFactory.setEntityStatus(this, types_1.EEntityState.NEW);
    }
    /**
     * 保存实体
     * @param em                    entity manager
     * @param ignoreUndefinedValue  忽略undefined值，针对update时有效
     * @returns                     保存后的实体
     */
    async save(ignoreUndefinedValue) {
        let em = await entitymanagerfactory_1.getEntityManager();
        await em.save(this, ignoreUndefinedValue);
        await em.close();
        return this;
    }
    /**
     * 删除实体
     * @param em    entity manager
     */
    async delete() {
        let em = await entitymanagerfactory_1.getEntityManager();
        await em.delete(this);
        await em.close();
        return this;
    }
    static async find(id) {
        let em = await entitymanagerfactory_1.getEntityManager();
        let entity = await em.find(this.name, id);
        await em.close();
        return entity;
    }
    /**
     * 根据条件查询单个实体
     * @param params            参数对象，参考EntityManager.findOne方法说明
     * @since 0.2.0
     */
    static async findOne(params) {
        let em = await entitymanagerfactory_1.getEntityManager();
        let entity = await em.findOne(this.name, params);
        await em.close();
        return entity;
    }
    /**
     * 根据条件查找多个对象
     * @param params            参数对象，参考EntityManager.findOne方法说明
     * @param start             开始记录行
     * @param limit             获取记录数
     * @param order             排序规则 {paramName1:'desc',paramName2:'asc',...} paramName1:参数名,desc:降序 asc:升序
     * @since 0.2.0
     */
    static async findMany(params, start, limit, order) {
        let em = await entitymanagerfactory_1.getEntityManager();
        let list = await em.findMany(this.name, params, start, limit, order);
        await em.close();
        return list;
    }
    /**
     * 获取记录数
     * @param params    参数对象，参考EntityManager.findOne
     * @since 0.2.0
     */
    static async getCount(params) {
        let em = await entitymanagerfactory_1.getEntityManager();
        let count = await em.getCount(this.name, params);
        await em.close();
        return count;
    }
    /**
     * 删除对象
     * @param id    实体id值
     * @returns     删除的实体
     * @since       0.2.0
     */
    static async delete(id) {
        let em = await entitymanagerfactory_1.getEntityManager();
        await em.delete(id, this.name);
        await em.close();
        return true;
    }
    /**
     * 删除对象
     * @param params    参数对象，参考EntityManager.findOne
     * @returns         true/false
     */
    static async deleteMany(params) {
        let em = await entitymanagerfactory_1.getEntityManager();
        await em.deleteMany(this.name, params);
        await em.close();
        return true;
    }
    /**
     * 对比
     * @param obj   简化后的实体值对象
     * @returns     如果相同，则返回true，否则返回false
     */
    compare(obj) {
        let ecfg = entityfactory_1.EntityFactory.getClass(this.constructor.name);
        for (let col of ecfg.columns) {
            //字段对象
            let fo = col[1];
            //字段名
            let fn = col[0];
            if (!fo.refName && obj[fn] !== this[fn] ||
                obj[fn] !== relaenutil_1.RelaenUtil.getIdValue(this)) {
                return false;
            }
        }
        return true;
    }
    /**
     * 浅拷贝，外键对象只拷贝主键值
     */
    clone() {
        let obj = new Object();
        let ecfg = entityfactory_1.EntityFactory.getClass(this.constructor.name);
        for (let col of ecfg.columns) {
            if (this[col[0]] === undefined) {
                continue;
            }
            //字段对象
            let fo = col[1];
            if (fo.refName) { //外键只取id
                if (this[col[0]] !== null) {
                    obj[col[0]] = relaenutil_1.RelaenUtil.getIdValue(this[col[0]]);
                }
            }
            else {
                //null也需要保留
                obj[col[0]] = this[col[0]];
            }
        }
        //保留className
        obj['__entityClassName'] = this.constructor.name;
        return obj;
    }
}
exports.BaseEntity = BaseEntity;
//# sourceMappingURL=baseentity.js.map