"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TranslatorFactory = void 0;
const relaenmanager_1 = require("./relaenmanager");
/**
 * driver工厂
 */
class TranslatorFactory {
    /**
     * 添加driver
     * @param name      driver 名
     * @param driver    driver 类
     */
    static add(name, tl) {
        this.translators.set(name, tl);
    }
    /**
     * 获取driver
     * @param args      解释器初始化参数，通常为实体类名
     * @returns         driver类 或 undefined
     */
    static get(args) {
        let ts = this.translators.get(relaenmanager_1.RelaenManager.dialect);
        return Reflect.construct(ts, [args]);
    }
}
exports.TranslatorFactory = TranslatorFactory;
/**
 * driver集合
 */
TranslatorFactory.translators = new Map();
//# sourceMappingURL=translatorfactory.js.map