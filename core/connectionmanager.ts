import { RelaenManager } from "./relaenmanager";
import { Connection } from "./connection";
import { RelaenThreadLocal } from "./threadlocal";
import { IConnectionCfg } from "./types";
import { BaseDriver } from "./driver/basedriver";
import { MysqlDriver } from "./driver/mysqldriver";
import { OracleDriver } from "./driver/oracledriver";
import { MssqlDriver } from "./driver/mssqldriver";
import { PostgresDriver } from "./driver/postgresdriver";


/**
 * 连接管理器
 */
class ConnectionManager {
    /**
     * 数据库驱动
     */
    static driver: BaseDriver;

    /**
     * 连接map {threadId:{num:conn创建次数,conn:连接}}
     * 保证一个异步方法中只能有一个connection
     */
    private static connectionMap: Map<number, any> = new Map();

    /**
     * 初始化连接管理器
     * @param cfg relaen配置文件的数据库配置对象
     */
    public static init(cfg: IConnectionCfg) {
        switch (RelaenManager.dialect) {
            case 'mysql':
                this.driver = new MysqlDriver(cfg);
                break;
            case 'oracle':
                this.driver = new OracleDriver(cfg);
                break;
            case 'mssql':
                this.driver = new MssqlDriver(cfg);
                break;
            case 'postgres':
                this.driver = new PostgresDriver(cfg);
                break;
        }
    }

    /**
     * 获取连接对象
     * @param id   创建者id，直接使用时，不需要设置该值
     * @returns    connection对象  
     */
    public static async createConnection(id?: number): Promise<Connection> {
        let conn: Connection;
        //把conn加入connectionMap
        let sid: number = RelaenThreadLocal.getThreadId();

        if (!sid) { //新建conn
            sid = RelaenThreadLocal.newThreadId();
        }
        if (!this.connectionMap.has(sid)) { //线程id对应对象不存在
            conn = new Connection(await this.driver.getConnection());
            if (id) {
                conn.fromId = id;
            }
            conn.connected = true;
            conn.threadId = sid;
            this.connectionMap.set(sid, {
                num: 1,
                conn: conn

            });
        } else { //已存在，则只修改conn的创建数，不新建conn
            let o = this.connectionMap.get(sid);
            o.num++;
            conn = o.conn;
        }
        return conn;
    }

    /**
     * 关闭连接
     * @param connection    数据库连接对象
     * @param force         是否强制释放
     */
    public static async closeConnection(connection: Connection, force?: boolean) {
        //获取threadId
        let sid: number = connection.threadId;
        //非强制释放，检查计数器
        if (!force) {
            if (sid && this.connectionMap.has(sid)) {
                let o = this.connectionMap.get(sid);
                if (--o.num <= 0) { //最后一个close，需要从map删除
                    force = true;
                }
            }
        }

        //需要释放
        if (force) {
            //清理 connection map
            this.connectionMap.delete(sid);
            return await this.driver.closeConnection(connection);
        }
    }
}

/**
 * 获取连接对象
 * @param id   创建者id，直接使用时，不需要设置该值
 * @returns    connection对象  
 */
async function getConnection(id?: number): Promise<Connection> {
    return await ConnectionManager.createConnection(id);
}

export { ConnectionManager, getConnection }