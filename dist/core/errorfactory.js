"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorFactory = void 0;
const relaentip_1 = require("./relaentip");
/**
 * 异常工厂
 * @remarks
 * 用于异常信息管理和异常信息处理
 */
class ErrorFactory {
    /**
     * 异常提示语言
     */
    /**
     * 获取异常
     * @param errNo     异常码
     * @param param     参数值数组，用于处理消息带参数的情况
     * @returns         {code:异常码,message:异常信息}
     */
    static getError(errNo, param) {
        //默认为未知错误
        if (!relaentip_1.RelaenTip[errNo]) {
            errNo = "0000";
        }
        let msg = relaentip_1.RelaenTip[errNo];
        let reg = /\$\{.+?\}/g;
        let r;
        //处理消息中的参数
        while ((r = reg.exec(msg)) !== null) {
            let index = r[0].substring(2, r[0].length - 1).trim();
            if (index && index !== '') {
                index = parseInt(index);
            }
            msg = msg.replace(r[0], param[index]);
        }
        return new Error("Error:\"" + errNo + "\",message is:\"" + msg + "\"");
    }
}
exports.ErrorFactory = ErrorFactory;
/**
 * 异常信息map，键为异常码，值为异常信息
 */
ErrorFactory.errMap = new Map();
//# sourceMappingURL=errorfactory.js.map