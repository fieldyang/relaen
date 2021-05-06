import { Connection } from "../connection";

export interface BaseDriver {
    /**
     * 配置
     */
    options: any;

    /**
     * 连接池
     */
    pool: any;

    /**
     * 数据库 npm 模块
     */
    dbMdl: any;


    /**
     * 获取连接
     */
    getConnection();


    /** 
     * 关闭连接
     * @param connection    数据库连接对象
     */
    closeConnection(connection: Connection);

}