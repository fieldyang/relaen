"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaceholderFactory = void 0;
const relaenmanager_1 = require("./relaenmanager");
/**
 * 占位符工厂
 */
class PlaceholderFactory {
    /**
     * 添加placeholder
     * @param dialect           数据库产品
     * @param placeholder       占位符
     * @param startIndex        开始索引号
     */
    static add(dialect, placeholder, startIndex) {
        this.map.set(dialect, {
            ch: placeholder,
            start: startIndex
        });
    }
    /**
     * 获取占位符
     * @param index     占位符索引，从0开始
     * @returns         占位符+索引号
     */
    static get(index) {
        let obj = this.map.get(relaenmanager_1.RelaenManager.dialect);
        if (obj) {
            return obj['ch'] + (obj['start'] + index);
        }
    }
}
exports.PlaceholderFactory = PlaceholderFactory;
/**
 * 占位符map
 * key: 数据库dialect
 * value:{ch:占位符,start:开始索引号(有的开始于0，有的开始于1)}
 */
PlaceholderFactory.map = new Map();
//# sourceMappingURL=placeholderfactory.js.map