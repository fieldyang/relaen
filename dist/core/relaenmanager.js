"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RelaenManager = void 0;
const connectionmanager_1 = require("./connectionmanager");
const entityfactory_1 = require("./entityfactory");
const errorfactory_1 = require("./errorfactory");
const translatorfactory_1 = require("./translatorfactory");
const mssqltranslator_1 = require("./dialect/mssql/mssqltranslator");
const mysqltranslator_1 = require("./dialect/mysql/mysqltranslator");
const oracletranslator_1 = require("./dialect/oracle/oracletranslator");
const postgrestranslator_1 = require("./dialect/postgres/postgrestranslator");
const placeholderfactory_1 = require("./placeholderfactory");
const transactionfactory_1 = require("./transactionfactory");
const mysqltransaction_1 = require("./dialect/mysql/mysqltransaction");
const providerfactory_1 = require("./providerfactory");
const mssqlprovider_1 = require("./dialect/mssql/mssqlprovider");
const mysqlprovider_1 = require("./dialect/mysql/mysqlprovider");
const oracleprovider_1 = require("./dialect/oracle/oracleprovider");
const postgresprovider_1 = require("./dialect/postgres/postgresprovider");
const mssqltransaction_1 = require("./dialect/mssql/mssqltransaction");
const oracletransaction_1 = require("./dialect/oracle/oracletransaction");
const postgrestransaction_1 = require("./dialect/postgres/postgrestransaction");
/**
 * relaen 框架管理器
 */
class RelaenManager {
    /**
     * 初始化
     * @param cfg   配置文件名或配置对象
     */
    static async init(cfg) {
        if (typeof cfg === 'string') {
            cfg = this.parseFile(cfg);
        }
        if (typeof cfg !== 'object') {
            throw errorfactory_1.ErrorFactory.getError('0001');
        }
        this.dialect = cfg.dialect || 'mysql';
        this.debug = cfg.debug || false;
        this.cache = cfg.cache === false ? false : true;
        this.initProvider();
        this.initTransaction();
        this.initTranslator();
        this.initPlaceholder();
        connectionmanager_1.ConnectionManager.init(cfg);
        //加载实体
        for (let path of cfg.entities) {
            entityfactory_1.EntityFactory.addEntities(path);
        }
    }
    /**
     * 初始化各dialect对应的translator
     */
    static initTranslator() {
        //添加到driver工厂
        translatorfactory_1.TranslatorFactory.add('mssql', mssqltranslator_1.MssqlTranslator);
        translatorfactory_1.TranslatorFactory.add('mysql', mysqltranslator_1.MysqlTranslator);
        translatorfactory_1.TranslatorFactory.add('oracle', oracletranslator_1.OracleTranslator);
        translatorfactory_1.TranslatorFactory.add('postgres', postgrestranslator_1.PostgresTranslator);
    }
    /**
     * 初始化各dialect对应的driver
     */
    static initProvider() {
        providerfactory_1.ProviderFactory.add('mssql', mssqlprovider_1.MssqlProvider);
        providerfactory_1.ProviderFactory.add('mysql', mysqlprovider_1.MysqlProvider);
        providerfactory_1.ProviderFactory.add('oracle', oracleprovider_1.OracleProvider);
        providerfactory_1.ProviderFactory.add('postgres', postgresprovider_1.PostgresProvider);
    }
    /**
     * 初始化各dialect对应的占位符配置
     */
    static initPlaceholder() {
        //添加到placeholder工厂
        placeholderfactory_1.PlaceholderFactory.add('mssql', '@', 0);
        placeholderfactory_1.PlaceholderFactory.add('mysql', '?');
        placeholderfactory_1.PlaceholderFactory.add('oracle', ':', 0);
        placeholderfactory_1.PlaceholderFactory.add('postgres', '$', 1);
    }
    /**
     * 初始化各dialect对应的transaction
     */
    static initTransaction() {
        //添加到transaction工厂
        transactionfactory_1.TransactionFactory.add('mssql', mssqltransaction_1.MssqlTransaction);
        transactionfactory_1.TransactionFactory.add('mysql', mysqltransaction_1.MysqlTransaction);
        transactionfactory_1.TransactionFactory.add('oracle', oracletransaction_1.OracleTransaction);
        transactionfactory_1.TransactionFactory.add('postgres', postgrestransaction_1.PostgresTransaction);
    }
    /**
     * @exclude
     * 解析实例配置文件
     * @param path      文件路径
     */
    static parseFile(path) {
        path = path || 'relaen.json';
        //读取文件
        let jsonStr = require('fs').readFileSync(path, 'utf-8');
        let json;
        try {
            json = JSON.parse(jsonStr);
        }
        catch (e) {
            throw "error config file!";
        }
        return json;
    }
}
exports.RelaenManager = RelaenManager;
//# sourceMappingURL=relaenmanager.js.map