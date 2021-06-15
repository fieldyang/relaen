"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManyToMany = exports.ManyToOne = exports.OneToOne = exports.OneToMany = exports.JoinColumn = exports.Column = exports.Id = exports.Entity = void 0;
const types_1 = require("../types");
const entityfactory_1 = require("../entityfactory");
/**
 * 装饰器（注解类）
 */
/**
 * @exclude
 * Entity装饰器，装饰实体(表)，装饰类
 * @param tblName   表名
 * @param schema    数据库名
 */
function Entity(tblName, schema) {
    return (target) => {
        entityfactory_1.EntityFactory.addClass(target, tblName, schema);
    };
}
exports.Entity = Entity;
/**
 * @exclude
 * 主键装饰器，装饰属性
 * @param cfg       配置项
 */
function Id(cfg) {
    return (target, propertyName) => {
        entityfactory_1.EntityFactory.addPKey(target.constructor.name, propertyName, cfg);
    };
}
exports.Id = Id;
/**
 * @exclude
 * 字段装饰器，装饰属性
 * @param cfg 配置项
 */
function Column(cfg) {
    return (target, propertyName) => {
        if (!cfg || !cfg.type) {
            throw "@Column配置参数错误";
        }
        entityfactory_1.EntityFactory.addColumn(target.constructor.name, propertyName, cfg);
    };
}
exports.Column = Column;
/**
 * @exclude
 * 字段装饰器，装饰属性
 * @param cfg 配置项
 */
function JoinColumn(cfg) {
    return (target, propertyName) => {
        //引用外键字段名默认与字段名一致
        if (!cfg.refName) {
            cfg.refName = cfg.name;
        }
        entityfactory_1.EntityFactory.addColumn(target.constructor.name, propertyName, cfg);
    };
}
exports.JoinColumn = JoinColumn;
/**
 * @exclude
 * 一对多关系，装饰属性
 * @param cfg   实体关系配置
 */
function OneToMany(cfg) {
    return (target, propertyName) => {
        cfg.type = types_1.ERelationType.OneToMany;
        entityfactory_1.EntityFactory.addRelation(target.constructor.name, propertyName, cfg);
    };
}
exports.OneToMany = OneToMany;
/**
 * @exclude
 * 一对一关系，装饰属性
 * @param cfg   实体关系配置
 */
function OneToOne(cfg) {
    return (target, propertyName) => {
        cfg.type = types_1.ERelationType.OneToOne;
        entityfactory_1.EntityFactory.addRelation(target.constructor.name, propertyName, cfg);
    };
}
exports.OneToOne = OneToOne;
/**
 * @exclude
 * 多对一关系，装饰属性
 * @param cfg   实体关系配置
 */
function ManyToOne(cfg) {
    return (target, propertyName) => {
        cfg.type = types_1.ERelationType.ManyToOne;
        entityfactory_1.EntityFactory.addRelation(target.constructor.name, propertyName, cfg);
    };
}
exports.ManyToOne = ManyToOne;
/**
 * @exclude
 * 多对多关系，装饰属性
 * @param cfg   实体关系配置
 */
function ManyToMany(cfg) {
    return (target, propertyName) => {
        cfg.type = types_1.ERelationType.ManyToMany;
        entityfactory_1.EntityFactory.addRelation(target.constructor.name, propertyName, cfg);
    };
}
exports.ManyToMany = ManyToMany;
//# sourceMappingURL=decorator.js.map