"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OracleTranslator = void 0;
const translator_1 = require("../../translator");
const types_1 = require("../../types");
/**
 * mssql 翻译器
 */
class OracleTranslator extends translator_1.Translator {
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
}
exports.OracleTranslator = OracleTranslator;
//# sourceMappingURL=oracletranslator.js.map