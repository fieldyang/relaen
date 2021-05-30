import { IBaseDriver } from "./ibasedriver";

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
     * @param name      driver名 
     * @returns         driver类 或 undefined
     */
    public static get(name:string):any{
        let ts = this.translators.get(name);
        return Reflect.construct(ts,[]);
    }
}
