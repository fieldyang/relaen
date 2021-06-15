"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EQueryType = exports.EEntityState = exports.ERelationType = exports.EFkConstraint = void 0;
/**
 * 外键约束
 */
var EFkConstraint;
(function (EFkConstraint) {
    /**
     * 无操作
     */
    EFkConstraint["NONE"] = "none";
    /**
     * 限制修改和删除
     */
    EFkConstraint["RESTRICT"] = "restrict";
    /**
     * 级联操作
     */
    EFkConstraint["CASCADE"] = "cascade";
    /**
     * 外键置空
     */
    EFkConstraint["SETNULL"] = "set null";
})(EFkConstraint || (EFkConstraint = {}));
exports.EFkConstraint = EFkConstraint;
/**
 * 关系类型
 */
var ERelationType;
(function (ERelationType) {
    /**
     * 一对一关系
     */
    ERelationType[ERelationType["OneToOne"] = 1] = "OneToOne";
    /**
     * 一对多关系
     */
    ERelationType[ERelationType["OneToMany"] = 2] = "OneToMany";
    /**
     * 多对一关系
     */
    ERelationType[ERelationType["ManyToOne"] = 3] = "ManyToOne";
    /**
     * 多对多关系
     */
    ERelationType[ERelationType["ManyToMany"] = 4] = "ManyToMany";
})(ERelationType || (ERelationType = {}));
exports.ERelationType = ERelationType;
/**
 * 实体状态
 */
var EEntityState;
(function (EEntityState) {
    /**
     * 新建状态
     */
    EEntityState[EEntityState["NEW"] = 1] = "NEW";
    /**
     * 持久化状态
     */
    EEntityState[EEntityState["PERSIST"] = 2] = "PERSIST";
})(EEntityState || (EEntityState = {}));
exports.EEntityState = EEntityState;
/**
 * query类型
 */
var EQueryType;
(function (EQueryType) {
    /**
     * select
     */
    EQueryType[EQueryType["SELECT"] = 0] = "SELECT";
    /**
     * insert
     */
    EQueryType[EQueryType["INSERT"] = 1] = "INSERT";
    /**
     * update
     */
    EQueryType[EQueryType["UPDATE"] = 2] = "UPDATE";
    /**
     * delete
     */
    EQueryType[EQueryType["DELETE"] = 3] = "DELETE";
})(EQueryType || (EQueryType = {}));
exports.EQueryType = EQueryType;
//# sourceMappingURL=types.js.map