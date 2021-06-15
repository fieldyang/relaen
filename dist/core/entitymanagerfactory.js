"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEntityManager = exports.EntityManagerFactory = void 0;
const entitymanager_1 = require("./entitymanager");
const connectionmanager_1 = require("./connectionmanager");
const relaenutil_1 = require("./relaenutil");
const threadlocal_1 = require("./threadlocal");
/**
 * entity manager 工厂
 */
class EntityManagerFactory {
    /**
     * 创建 entity manager，使用后需要释放
     * @param conn  数据库连接对象
     * @returns     entitymanager
     */
    static async createEntityManager() {
        let id = relaenutil_1.RelaenUtil.genId();
        let conn = await connectionmanager_1.getConnection(id);
        let sid = conn.threadId;
        let em;
        if (!this.entityManagerMap.has(sid)) {
            em = new entitymanager_1.EntityManager(conn, id);
            this.entityManagerMap.set(sid, {
                num: 1,
                em: em
            });
        }
        else {
            let o = this.entityManagerMap.get(sid);
            o.num++;
            em = o.em;
        }
        return em;
    }
    /**
     * 关闭entitymanager
     * @param em        entitymanager
     * @param force     是否强制关闭
     */
    static async closeEntityManager(em, force) {
        //获取threadId
        let sid = em.connection.threadId;
        if (!force) {
            if (!sid || !this.entityManagerMap.has(sid)) {
                return;
            }
            let o = this.entityManagerMap.get(sid);
            if (--o.num <= 0) {
                force = true;
            }
        }
        if (force) {
            //清除缓存
            em.clearCache();
            //从map移除
            this.entityManagerMap.delete(sid);
            //如果connection的创建者id与该entitymanager一致，则也需要释放该connection
            if (em.id && em.id === em.connection.fromId) {
                await em.connection.close(true);
            }
            else {
                await em.connection.close();
            }
        }
    }
    /**
     * 获取当前entitymanager，使用后不用释放
     */
    static getCurrentEntityManager() {
        let sid = threadlocal_1.RelaenThreadLocal.getThreadId();
        if (!sid || !this.entityManagerMap.has(sid)) {
            return null;
        }
        return this.entityManagerMap.get(sid).em;
    }
    /**
     * 设置实体状态
     * @param entity    实体
     * @param state     状态
     */
    static setEntityStatus(entity, state) {
        this.entityStatusMap.set(entity, state);
    }
    /**
     * 获取实体状态
     * @param entity    实体对象
     * @returns         实体状态或undefined
     */
    static getEntityStatus(entity) {
        return this.entityStatusMap.get(entity);
    }
}
exports.EntityManagerFactory = EntityManagerFactory;
/**
 * 连接map {threadId:{num:em创建次数,em:entity manager}}
 * 保证一个异步方法中只能有一个entitymanager
 */
EntityManagerFactory.entityManagerMap = new Map();
/**
 * 实体状态map
 */
EntityManagerFactory.entityStatusMap = new WeakMap();
/**
 * 返回entity manager
 */
async function getEntityManager() {
    return await EntityManagerFactory.createEntityManager();
}
exports.getEntityManager = getEntityManager;
//# sourceMappingURL=entitymanagerfactory.js.map