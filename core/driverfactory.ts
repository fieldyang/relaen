import { IBaseDriver } from "./ibasedriver";
import { RelaenManager } from "./relaenmanager";

/**
 * driver工厂
 */
class DriverFactory{
    /**
     * driver集合
     */
    private static drivers:Map<string,any> = new Map();

    /**
     * 添加driver
     * @param name      driver 名
     * @param driver    driver 类
     */
    public static add(name:string,driver:any){
        this.drivers.set(name,driver);
    }

    /**
     * 获取driver
     * @param name      driver名 
     * @returns         driver类 或 undefined
     */
    public static get(name?:string):any{
        return this.drivers.get(name||RelaenManager.dialect);
    }
}

export {DriverFactory}