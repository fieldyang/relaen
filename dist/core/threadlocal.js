"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RelaenThreadLocal = void 0;
const { AsyncLocalStorage } = require("async_hooks");
/**
 * 线程存储
 */
class RelaenThreadLocal {
    /**
     * 新建thread id
     * @returns     新threadId
     */
    static newThreadId() {
        let sid = this.threadId++;
        this.localStorage.enterWith(sid);
        return sid;
    }
    /**
     * 获取当前thread id
     * @returns     当前threadId
     */
    static getThreadId() {
        return this.localStorage.getStore();
    }
}
exports.RelaenThreadLocal = RelaenThreadLocal;
/**
 * 线程id
 */
RelaenThreadLocal.threadId = 1;
/**
 * 异步线程存储器
 */
RelaenThreadLocal.localStorage = new AsyncLocalStorage();
//# sourceMappingURL=threadlocal.js.map