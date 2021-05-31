import { IBaseDriver } from "./ibasedriver";
import { RelaenManager } from "./relaenmanager";

/**
 * driver工厂
 */
export class TranslatorFactory{
    /**
     * driver集合
     */
    private static translators:Map<string,any> = new Map();

    /**
     * 添加driver
     * @param name      driver 名
     * @param driver    driver 类
     */
    public static add(name:string,tl:any){
        this.translators.set(name,tl);
    }

    /**
     * 获取driver
     * @param args      解释器初始化参数，通常为实体类名
     * @returns         driver类 或 undefined
     */
    public static get(args?:any):any{
        let ts = this.translators.get(RelaenManager.dialect);
        return Reflect.construct(ts,[args]);
    }
}
