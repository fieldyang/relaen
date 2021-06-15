"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MssqlTranslator = void 0;
const baseentity_1 = require("../../baseentity");
const entityfactory_1 = require("../../entityfactory");
const errorfactory_1 = require("../../errorfactory");
const relaenutil_1 = require("../../relaenutil");
const translator_1 = require("../../translator");
/**
 * mssql 翻译器
 * @since 0.2.3
 */
class MssqlTranslator extends translator_1.Translator {
    /**
     * entity转insert sql
     * @param entity
     */
    entityToInsert(entity) {
        return super.entityToInsert(entity, 'SELECT @@IDENTITY AS insertId');
    }
    /**
     * entity转update sql
     * @param entity                待更新entity
     * @param ignoreUndefinedValue  忽略undefined值
     */
    entityToUpdate(entity, ignoreUndefinedValue) {
        let orm = entityfactory_1.EntityFactory.getClass(entity.constructor.name);
        if (!orm) {
            throw errorfactory_1.ErrorFactory.getError("0010", [entity.constructor.name]);
        }
        let arr = [];
        arr.push('update');
        arr.push(relaenutil_1.RelaenUtil.getTableName(orm));
        arr.push('set');
        let fv = [];
        //id值
        let idValue;
        //id名
        let idName;
        if (!orm.id) {
            throw errorfactory_1.ErrorFactory.getError('0103');
        }
        let fields = [];
        let values = [];
        for (let key of orm.columns) {
            let fo = key[1];
            //如果绑定字段名不存在，则用属性名
            let fn = fo.name ? fo.name : key[0];
            //保存已添加字段，不重复添加
            if (fields.includes(fn)) {
                continue;
            }
            //字段值
            let v;
            if (fo.refName) { //外键，只取主键
                let refEn = entity[key[0]];
                v = refEn && refEn instanceof baseentity_1.BaseEntity ? relaenutil_1.RelaenUtil.getIdValue(refEn) : null;
            }
            else {
                v = entity[key[0]];
            }
            if (key[0] === orm.id.name) {
                idValue = v;
                idName = key[1].name;
            }
            //值为空且不忽略空值或字段已添加，设置主键自增时，不修改主键
            if (v === null && ignoreUndefinedValue || fields.includes(fn) || fo.identity === true) {
                continue;
            }
            fv.push(fn + '=?');
            fields.push(fn);
            values.push(v);
        }
        if (!idValue) {
            throw errorfactory_1.ErrorFactory.getError('0021', [orm.id.name]);
        }
        fv.forEach((v, i) => {
            fv[i] = v.slice(0, -1) + i;
        });
        arr.push(fv.join(','));
        //where
        arr.push('where');
        arr.push(idName + '=' + idValue);
        let sql = arr.join(' ');
        return [sql, values];
    }
}
exports.MssqlTranslator = MssqlTranslator;
//# sourceMappingURL=mssqltranslator.js.map