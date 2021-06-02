import { RelaenManager } from "./relaenmanager";

/**
 * driver工厂
 */
export class TransactionFactory{
    /**
     * driver集合
     */
    private static transactions:Map<string,any> = new Map();

    /**
     * 添加driver
     * @param name      dialect 名
     * @param value     transaction 类
     */
    public static add(name:string,value:any){
        this.transactions.set(name,value);
    }

    /**
     * 获取driver
     * @param name      dialect名 
     * @returns         transaction类 或 undefined
     */
    public static get(name?:string):any{
        return this.transactions.get(name||RelaenManager.dialect);
    }
}
