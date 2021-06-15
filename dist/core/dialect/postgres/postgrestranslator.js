"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostgresTranslator = void 0;
const entityfactory_1 = require("../../entityfactory");
const errorfactory_1 = require("../../errorfactory");
const translator_1 = require("../../translator");
const types_1 = require("../../types");
/**
 * postgres 翻译器
 * @since 0.2.3
 */
class PostgresTranslator extends translator_1.Translator {
    /**
     * 产生查询sql
     * @returns     数组[sql,linkMap,values]
     *              其中：linkMap为该translator的linkNameMap，values为查询参数值
     */
    getQuerySql() {
        switch (this.sqlType) {
            case types_1.EQueryType.SELECT:
                return this.getSelectSql();
            case types_1.EQueryType.DELETE:
                return this.getDeleteSql(true);
        }
    }
    /**
     * entity转insert sql
     * @param entity
     */
    entityToInsert(entity) {
        let orm = entityfactory_1.EntityFactory.getClass(entity.constructor.name);
        if (!orm) {
            throw errorfactory_1.ErrorFactory.getError("0010", [entity.constructor.name]);
        }
        return super.entityToInsert(entity, 'RETURNING ' + orm.columns.get(orm.id.name).name);
    }
}
exports.PostgresTranslator = PostgresTranslator;
//# sourceMappingURL=postgrestranslator.js.map