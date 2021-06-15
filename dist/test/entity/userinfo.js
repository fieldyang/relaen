"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserInfo = void 0;
const __1 = require("../..");
const user_1 = require("./user");
let UserInfo = class UserInfo extends __1.BaseEntity {
    constructor(idValue) {
        super();
        this.userId = idValue;
    }
    getUserId() {
        return this.userId;
    }
    setUserId(value) {
        this.userId = value;
    }
    async getUser() {
        return this['user'] ? this['user'] : await __1.EntityProxy.get(this, 'user');
    }
    setUser(value) {
        this.user = value;
    }
    getRealName() {
        return this.realName;
    }
    setRealName(value) {
        this.realName = value;
    }
    getAge() {
        return this.age;
    }
    setAge(value) {
        this.age = value;
    }
    getSexy() {
        return this.sexy;
    }
    setSexy(value) {
        this.sexy = value;
    }
    getRemarks() {
        return this.remarks;
    }
    setRemarks(value) {
        this.remarks = value;
    }
    async getShopForManagerIds() {
        return this['shopForManagerIds'] ? this['shopForManagerIds'] : await __1.EntityProxy.get(this, 'shopForManagerIds');
    }
    setShopForManagerIds(value) {
        this.shopForManagerIds = value;
    }
    async getShopForOwnerIds() {
        return this['shopForOwnerIds'] ? this['shopForOwnerIds'] : await __1.EntityProxy.get(this, 'shopForOwnerIds');
    }
    setShopForOwnerIds(value) {
        this.shopForOwnerIds = value;
    }
};
__decorate([
    __1.Id(),
    __1.Column({
        name: 'user_id',
        type: 'number',
        nullable: false
    }),
    __metadata("design:type", Number)
], UserInfo.prototype, "userId", void 0);
__decorate([
    __1.OneToOne({ entity: 'User' }),
    __1.JoinColumn({
        name: 'user_id',
        refName: 'user_id',
        nullable: true
    }),
    __metadata("design:type", user_1.User)
], UserInfo.prototype, "user", void 0);
__decorate([
    __1.Column({
        name: 'real_name',
        type: 'string',
        nullable: true,
        length: 64
    }),
    __metadata("design:type", String)
], UserInfo.prototype, "realName", void 0);
__decorate([
    __1.Column({
        name: 'age',
        type: 'number',
        nullable: true
    }),
    __metadata("design:type", Number)
], UserInfo.prototype, "age", void 0);
__decorate([
    __1.Column({
        name: 'sexy',
        type: 'string',
        nullable: true,
        length: 1
    }),
    __metadata("design:type", String)
], UserInfo.prototype, "sexy", void 0);
__decorate([
    __1.Column({
        name: 'remarks',
        type: 'string',
        nullable: true,
        length: 256
    }),
    __metadata("design:type", String)
], UserInfo.prototype, "remarks", void 0);
__decorate([
    __1.OneToMany({
        entity: 'Shop',
        mappedBy: 'userInfoForManagerId'
    }),
    __metadata("design:type", Array)
], UserInfo.prototype, "shopForManagerIds", void 0);
__decorate([
    __1.OneToMany({
        entity: 'Shop',
        mappedBy: 'userInfoForOwnerId'
    }),
    __metadata("design:type", Array)
], UserInfo.prototype, "shopForOwnerIds", void 0);
UserInfo = __decorate([
    __1.Entity("t_user_info"),
    __metadata("design:paramtypes", [Number])
], UserInfo);
exports.UserInfo = UserInfo;
//# sourceMappingURL=userinfo.js.map