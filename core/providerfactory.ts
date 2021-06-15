import { RelaenManager } from "./relaenmanager";

/**
 * driver工厂
 */
export class ProviderFactory{
    /**
     * driver集合
     */
    private static providers:Map<string,any> = new Map();

    /**
     * 添加driver
     * @param name      driver 名
     * @param driver    driver 类
     */
    public static add(name:string,provider:any){
        this.providers.set(name,provider);
    }

    /**
     * 获取driver
     * @param name      driver名 
     * @returns         driver类 或 undefined
     */
    public static get(name?:string):any{
        return this.providers.get(name||RelaenManager.dialect);
    }
}
