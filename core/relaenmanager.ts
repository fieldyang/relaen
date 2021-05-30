import { ConnectionManager } from "./connectionmanager";
import { EntityFactory } from "./entityfactory";
import { ErrorFactory } from "./errorfactory";
import { Translator } from "./translator";
import { TranslatorFactory } from "./translatorfactory";
import { DriverFactory, MssqlDriver, MysqlDriver, OracleDriver, PostgresDriver } from "..";
import { MssqlTranslator } from "./dialect/mssql/mssqltranslator";
import { MysqlTranslator } from "./dialect/mysql/mysqltranslator";
import { OracleTranslator } from "./dialect/oracle/oracletranslator";
import { PostgresTranslator } from "./dialect/postgres/postgrestranslator";

/**
 * relaen 框架管理器
 */
class RelaenManager {
    /**
     * 数据库类型
     * mysql oracle mssql
     */
    public static dialect: string;

    /**
     * 开启一级cache
     */
    public static cache: boolean;

    /**
     * 是否调试模式
     */
    public static debug: boolean;

    /**
     * 解释器
     */
    public static translator:Translator;
    /**
     * 初始化
     * @param cfg   配置文件名或配置对象
     */
    public static async init(cfg: any) {
        if (typeof cfg === 'string') {
            cfg = this.parseFile(cfg);
        }
        if (typeof cfg !== 'object') {
            throw ErrorFactory.getError('0001')
        }

        this.dialect = cfg.dialect || 'mysql';
        this.debug = cfg.debug || false;
        this.cache = cfg.cache === false ? false : true;
        this.initDriver();
        this.initTranslator();
        //初始化translator
        this.translator = TranslatorFactory.get(this.dialect);
        ConnectionManager.init(cfg);
        //加载实体
        for (let path of cfg.entities) {
            EntityFactory.addEntities(path);
        }
    }

    /**
     * 初始化各dialect对应的translator
     */
    private static initTranslator(){
        //添加到driver工厂
        TranslatorFactory.add('mssql',MssqlTranslator);
        TranslatorFactory.add('mysql',MysqlTranslator);
        TranslatorFactory.add('oracle',OracleTranslator);
        TranslatorFactory.add('postgres',PostgresTranslator);
    }

    /**
     * 初始化各dialect对应的driver
     */
    private static initDriver(){
        DriverFactory.add('mssql',MssqlDriver);
        DriverFactory.add('mysql',MysqlDriver);
        DriverFactory.add('oracle',OracleDriver);
        DriverFactory.add('postgres',PostgresDriver);
    }
    /**
     * @exclude
     * 解析实例配置文件
     * @param path      文件路径
     */
    public static parseFile(path: string): any {
        path = path || 'relaen.json';
        //读取文件
        let jsonStr: string = require('fs').readFileSync(path, 'utf-8');
        let json;
        try {
            json = JSON.parse(jsonStr);
        } catch (e) {
            throw "error config file!";
        }
        return json;
    }

}

export { RelaenManager }