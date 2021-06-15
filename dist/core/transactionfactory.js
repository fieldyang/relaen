"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionFactory = void 0;
const relaenmanager_1 = require("./relaenmanager");
/**
 * driver工厂
 */
class TransactionFactory {
    /**
     * 添加driver
     * @param name      dialect 名
     * @param value     transaction 类
     */
    static add(name, value) {
        this.transactions.set(name, value);
    }
    /**
     * 获取driver
     * @param name      dialect名
     * @returns         transaction类 或 undefined
     */
    static get(name) {
        return this.transactions.get(name || relaenmanager_1.RelaenManager.dialect);
    }
}
exports.TransactionFactory = TransactionFactory;
/**
 * driver集合
 */
TransactionFactory.transactions = new Map();
//# sourceMappingURL=transactionfactory.js.map