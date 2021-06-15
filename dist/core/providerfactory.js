"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProviderFactory = void 0;
const relaenmanager_1 = require("./relaenmanager");
/**
 * driver工厂
 */
class ProviderFactory {
    /**
     * 添加driver
     * @param name      driver 名
     * @param driver    driver 类
     */
    static add(name, provider) {
        this.providers.set(name, provider);
    }
    /**
     * 获取driver
     * @param name      driver名
     * @returns         driver类 或 undefined
     */
    static get(name) {
        return this.providers.get(name || relaenmanager_1.RelaenManager.dialect);
    }
}
exports.ProviderFactory = ProviderFactory;
/**
 * driver集合
 */
ProviderFactory.providers = new Map();
//# sourceMappingURL=providerfactory.js.map