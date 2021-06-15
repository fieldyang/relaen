"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const relaenmanager_1 = require("./relaenmanager");
/**
 * 日志类
 */
class Logger {
    /**
     * 写日志到控制台
     * @param msg   待写消息
     */
    static console(msg) {
        if (relaenmanager_1.RelaenManager.debug) {
            console.log(msg);
        }
    }
    /**
     * 写错误消息
     * @param msg
     */
    static error(msg) {
        console.error(msg);
    }
}
exports.Logger = Logger;
//# sourceMappingURL=logger.js.map