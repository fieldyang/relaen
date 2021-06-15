"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
const shop_1 = require("./entity/shop");
const userinfo_1 = require("./entity/userinfo");
/**
 * 与数据库相关的方法都采用async，使用时请使用await 关键字
 * 所用实体需要test数据库的支持，请参考readme
 * entitymanager：实体管理器，用于进行实体操作，通过getEntityManager()方法获取
 * 关于显式和隐式：
 *      getConnection 显式获取数据库连接；
 *      getEntityManager 显示获取entitymanager并隐式创建数据库连接，关闭该entitymanager时，会隐式关闭connection；
 *      基于实体类或实体对象的数据操作，隐式创建entitymanager，也会隐式关闭entitymanager；
 *      凡是显式创建的connection或entitymanager，都需要显式关闭；
 *      当一个方法中存在多个操作时（每次调用save、delete、find属于一个操作），建议显式创建entitymanager，
 *      这样会减少entitymanager和connection的创建次数，同时可使用一级缓存;
 * 何为一级缓存：
 *      一次异步方法(async)内（从最外层首次创建entitymanager开始）的缓存，也称为会话级缓存，用于缓存查询结果，
 *      在该会话内，第二次进行相同查询，不会访问数据库，而是从缓存中获取，参考下列代码中的cache函数；
 *      当执行增删改时，会清空一级缓存
 */
/********************* Relaen 使用例子 *****************/
/**
 * 新增数据
 * 通过实体对象的save方法保存
 */
async function addShop() {
    let shop = new shop_1.Shop();
    shop.setShopName('yang的店铺');
    shop.setAddress('四川绵阳');
    //设置外键
    shop.setUserInfoForOwnerId(new userinfo_1.UserInfo(1));
    await shop.save();
}
/**
 * 新增数据
 * 通过entitymanager保存
 */
async function addShop1() {
    let shop = new shop_1.Shop();
    shop.setShopName('field的店铺');
    shop.setAddress('四川绵阳');
    //设置外键
    shop.setUserInfoForOwnerId(new userinfo_1.UserInfo(1));
    //显式创建entity manager
    let em = await __1.getEntityManager();
    await em.save(shop);
    //显式创建的entitymanager，必须手动关闭
    await em.close();
}
/**
 * 修改数据
 */
async function updShop() {
    // 此为显式获取entitymanager，在该方法中将使用该entitymanager；
    // 如果去掉这一行，将隐式创建entitymanager，此例子中，将创建两个entitymanager(同时创建两个数据库连接)
    // let em: EntityManager = await getEntityManager();
    //采用Shop类find的方法查询
    let shop = await shop_1.Shop.find(1);
    // 通过entitymanager操作
    // let shop:Shop = <Shop> await em.find(Shop.name,1);  
    shop.setAddress('四川成都');
    //参数为true，表示仅对地址进行修改，其他项不变，否则，除了shopId和address，其它项都会置为null
    await shop.save(true);
    // 通过entitymanager操作
    // await em.save(shop,true);
    // await em.close();
}
/**
 * 删除数据（通过id）
 */
async function delShop(id) {
    //采用Shop类find的方法查询
    await shop_1.Shop.delete(id);
    //第二种方法
    // shop = <Shop> await Shop.find(id);
    // shop.delete();
    //第三种方法
    // let em:EntityManager = await getEntityManager();
    // shop = <Shop> await Shop.find(id);
    // em.delete(shop);
    // await em.close();
}
/**
 * 删除数据 （通过条件）
 */
async function delShops() {
    //条件对象参考find方法
    let params = {
        shopName: {
            value: 'yang',
            rel: 'like'
        }
    };
    return await shop_1.Shop.deleteMany(params);
    //第二种方法
    // let em:EntityManager = await getEntityManager();
    // await em.deleteMany(Shop.name,params);
    // await em.close();
}
/**
 * 查询单个实体(通过id)
 * @param id
 */
async function find(id) {
    let r = await shop_1.Shop.find(id);
    console.log(r);
    return r;
    // 第二种方法
    // let em:EntityManager = await getEntityManager();
    // let shop = await em.find(Shop.name,id);
    // await em.close();
    // return shop;
}
/**
 * 缓存测试
 */
async function cache(id) {
    let em = await __1.getEntityManager();
    //控制台会输出sql语句
    let shop = await em.find(shop_1.Shop.name, id);
    shop.setAddress('北京');
    //控制台不会输出sql语句，从缓存获取
    //shop为之前缓存的内容，address尚未修改
    shop = await em.find(shop_1.Shop.name, id);
    await em.close();
    return shop;
}
/**
 * 懒加载获取关联对象
 * @param id    外键id
 */
async function lazyLoad(id) {
    let em = await __1.getEntityManager();
    //获取用户信息
    let ui = await userinfo_1.UserInfo.find(id);
    //懒加载获取用户，OneToOne对象
    let r = await ui.getUser();
    console.log(r);
    //懒加载获取拥有的店铺，OneToMany对象
    await ui.getShopForOwnerIds();
    console.log(ui);
    await em.close();
}
/**
 * 查询单个实体（通过条件）
 */
async function findOne() {
    //条件使用方式请参考API中EntityManager.findOne的条件参数说明
    //该条件最后结果为 "(owner.realName like '%relaen%' OR owner.age >= 20) AND address='四川绵阳'"
    let params = {
        "userInfoForOwnerId.realName": {
            value: 'RELAEN',
            rel: 'like',
            before: '('
        },
        "userInfoForOwnerId.age": {
            value: 20,
            rel: '>=',
            logic: 'OR',
            after: ')'
        },
        "address": '四川成都'
    };
    let r = await shop_1.Shop.findOne(params);
    console.log(r);
    return r;
    //第二种方法
    // let em:EntityManager = await getEntityManager();
    // let shop:Shop = <Shop> await em.findOne(Shop.name,params);
    // await em.close();
    // return shop;
}
/**
 * 查询单个实体（通过条件）
 */
async function findMany() {
    //条件使用方式请参考API中EntityManager.findOne的条件参数说明
    //该条件最后结果为 "(owner.realName like '%relaen%' OR owner.age >= 20) AND address='四川绵阳'"
    let params = {
        "userInfoForOwnerId.realName": {
            value: 'RELAEN',
            rel: 'like',
            before: '('
        },
        "userInfoForOwnerId.age": {
            value: 20,
            rel: '>=',
            logic: 'OR',
            after: ')'
        },
        "address": '四川绵阳'
    };
    let r = await shop_1.Shop.findMany(params);
    console.log(r);
    return r;
    //第二种方法
    // let em:EntityManager = await getEntityManager();
    // let lst = await em.findMany(Shop.name,params);
    // await em.close();
    // return lst;
}
/**
 * 获取记录数
 */
async function getCount() {
    //参考查询的条件对象
    let params = {
        "userInfoForOwnerId.realName": {
            value: 'E',
            rel: 'like'
        }
    };
    let count = await shop_1.Shop.getCount(params);
    console.log(count);
    //第二种方法
    // let em:EntityManager = await getEntityManager();
    // let count = await em.getCount(Shop.name,params);
    // await em.close();
    // return count;
}
/**
 * 链式查询
 * 通过链式操作拼接查询语句
 */
async function linkQuery() {
    let em = await __1.getEntityManager();
    let query = em.createQuery(shop_1.Shop.name);
    let r = await query
        // 查询字段，可以获取关联对象属性
        // 查询关联对象，可以直接写关联对象名,如:o1(等价于o1.*);也可以写关联对象相关字段,如:o1.fieldName1
        // 关联对象必须以主表实体开始，且能获取的只能是ManyToOne的One一侧，或OneToOne的带mappedBy属性的一侧
        .select(["*", "userInfoForManagerId.realName", "userInfoForOwnerId.realName", "userInfoForOwnerId.userId", "userInfoForOwnerId.user.userId", "userInfoForOwnerId.user.userName"])
        // 直接获取关联对象
        // .select(["*","manager","owner.*"]) 
        // 支持实体对象作为查询条件，会自动转换为实体主键
        // 如: manager:1，则会转换成 别名.user_id=1
        // 同理，如果条件值为实体对象，则会直接取实体对象的主键值
        // manager:managerObj,则会转换成 别名.user_id=managerObj.userId
        // 下例中，则会转换为 (manager.user.userName='A' OR manager.userId>1) AND owner.sexy='M'
        .where({
        "userInfoForManagerId.user.userName": {
            value: "A",
            before: '('
        },
        "userInfoForManagerId": {
            logic: 'OR',
            rel: '>',
            value: new userinfo_1.UserInfo(1),
            after: ')'
        },
        "userInfoForOwnerId.sexy": 'F'
    })
        .orderBy({
        'userInfoForOwnerId.userId': 'asc',
        "userInfoForOwnerId.realName": 'desc'
    })
        //增加distinct修饰符
        .distinct()
        .getResultList();
    console.log(r);
    await em.close();
    return r;
}
/**
 * 原生查询
 */
async function native() {
    let em = await __1.getEntityManager();
    let sql = "select t1.*,t2.* from t_shop t1,t_user t2 where t1.manager_id = t2.user_id";
    //创建原生查询对象，第二个参数，会导致查询结果转实体类Shop，如果为空，则不转换,转换时不
    let query = em.createNativeQuery(sql);
    // 此操作则不转换为实体对象
    // let query:NativeQuery = em.createNativeQuery(sql);
    //前五条数据，因为传入了实体类名，将会转换成实体对象
    let r = await query.getResultList(0, 5);
    console.log(r);
    await em.close();
}
/**
 * 事务
 * 事务由connection创建，在前面的例子中，connection都是由getEntityManager()隐式创建的，此处需要显式创建
 */
async function doTransaction() {
    //显式获取connection
    let conn = await __1.getConnection();
    await addShop();
    let tx = conn.createTransaction();
    await tx.begin();
    //调用删除shop操作
    await delShops();
    //提交操作
    // await tx.commit();
    //回滚，不会删除数据
    await tx.rollback();
    //显式创建的connection，一定要显示关闭
    await conn.close();
}
/**
 * 初始化relaen,请根据自己的数据库进行修改
 */
__1.RelaenManager.init({
    //数据库产品名
    dialect: "mysql",
    //数据库服务器地址
    host: "localhost",
    //端口
    port: 3306,
    //用户名
    username: "root",
    //密码
    password: "root",
    //数据库名
    database: "test",
    //连接池，可选
    pool: {
        min: 0,
        max: 10
    },
    //实体文件配置，为编译后js地址
    entities: [
        "/dist/test/entity/**/*.js"
    ],
    //开启以及缓存
    cache: true,
    //是否调试模式
    debug: true
});
/************* 执行测试方法 ***************/
// addShop();
// addShop1();
// updShop();
// delShop(12);
// delShops();
// find(1);
// cache(1);
// lazyLoad(1);
// findOne();
// findMany();
// getCount();
// linkQuery();
// native();
doTransaction();
//# sourceMappingURL=test.js.map