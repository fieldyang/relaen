import { IEntityCfg, IEntity } from "./types";
import { EntityFactory } from "./entityfactory";
import { BaseEntity } from "./baseentity";
import { RelaenManager } from "./relaenmanager";

class RelaenUtil {
    /**
     * 对象id计数器
     */
    private static idGenerator = 0;

    /**
     * 生成对象id，提供 entitymanager 和connection使用
     */
    public static genId() {
        return ++this.idGenerator;
    }
    /**
     * 获取id名 
     * @param entity 实体对象或实体类名
     * @returns      实体id名
     */
    public static getIdName(entity: any): string {
        let en: string;
        if (entity instanceof BaseEntity) {
            en = entity.constructor.name;
        } else if (typeof entity === 'string') {
            en = entity;
        }
        let cfg: IEntityCfg = EntityFactory.getClass(en);
        if (cfg.id) {
            return cfg.id.name;
        }
    }

    /**
     * 设置属性值
     * @param entity    实体对象
     * @param value     实体值
     */
    public static setIdValue(entity: IEntity, value: any) {
        let cfg: IEntityCfg = EntityFactory.getClass(entity.constructor.name);
        if (cfg && cfg.id && cfg.id.name) {
            entity[cfg.id.name] = value;
        }
    }

    /**
     * 获取id值
     * @param entity    实体对象
     */
    public static getIdValue(entity: IEntity): any {
        let cfg: IEntityCfg = EntityFactory.getClass(entity.constructor.name);
        if (cfg && cfg.id) {
            return entity[cfg.id.name];
        }
    }

    /**
     * 处理字段字符串值
     * @param value     待处理值
     * @returns         处理后的字符串
     */
    public static valueToString(value: any): string {
        if (typeof value !== 'string') {
            value = value + '';
        }
        //替换 ' 为 \'
        value = value.replace(/'/g, "\'");
        //两端添加 '
        return "'" + value + "'";
    }

    /**
     * 获取当前数据库的占位符
     * @param length        获取占位符个数
     * @param param         占位符字符
     * @returns             返回字符串拼接占位符 
     */
    static getPlaceholder(length?: number, param?: number | string): string {
        length = length || 1;
        let arr = new Array(length);
        switch (RelaenManager.dialect) {
            case 'mysql':
                arr.fill('?');
                break;
            case 'oracle':
                for (let i = 0; i < length; i++) {
                    arr[i] = ':' + (param || i);
                }
                break;
            case 'mssql':
                for (let i = 0; i < length; i++) {
                    arr[i] = '@' + (param || i);
                }
                break;
            case 'postgres':
                for (let i = 0; i < length; i++) {
                    if (typeof param == 'number') {
                        param = param + 1;
                    }
                    arr[i] = '$' + (param || i + 1);
                }
                break;
        }
        return arr.join();
    }
}

export { RelaenUtil }