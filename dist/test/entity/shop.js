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
exports.Shop = void 0;
const __1 = require("../..");
const userinfo_1 = require("./userinfo");
let Shop = class Shop extends __1.BaseEntity {
    constructor(idValue) {
        super();
        this.shopId = idValue;
    }
    getShopId() {
        return this.shopId;
    }
    setShopId(value) {
        this.shopId = value;
    }
    async getUserInfoForOwnerId() {
        return this['userInfoForOwnerId'] ? this['userInfoForOwnerId'] : await __1.EntityProxy.get(this, 'userInfoForOwnerId');
    }
    setUserInfoForOwnerId(value) {
        this.userInfoForOwnerId = value;
    }
    async getUserInfoForManagerId() {
        return this['userInfoForManagerId'] ? this['userInfoForManagerId'] : await __1.EntityProxy.get(this, 'userInfoForManagerId');
    }
    setUserInfoForManagerId(value) {
        this.userInfoForManagerId = value;
    }
    getShopName() {
        return this.shopName;
    }
    setShopName(value) {
        this.shopName = value;
    }
    getAddress() {
        return this.address;
    }
    setAddress(value) {
        this.address = value;
    }
};
__decorate([
    __1.Id(),
    __1.Column({
        name: 'shop_id',
        type: 'number',
        nullable: false
    }),
    __metadata("design:type", Number)
], Shop.prototype, "shopId", void 0);
__decorate([
    __1.ManyToOne({ entity: 'UserInfo' }),
    __1.JoinColumn({
        name: 'owner_id',
        refName: 'user_id',
        nullable: true
    }),
    __metadata("design:type", userinfo_1.UserInfo)
], Shop.prototype, "userInfoForOwnerId", void 0);
__decorate([
    __1.ManyToOne({ entity: 'UserInfo' }),
    __1.JoinColumn({
        name: 'manager_id',
        refName: 'user_id',
        nullable: true
    }),
    __metadata("design:type", userinfo_1.UserInfo)
], Shop.prototype, "userInfoForManagerId", void 0);
__decorate([
    __1.Column({
        name: 'shop_name',
        type: 'string',
        nullable: true,
        length: 32
    }),
    __metadata("design:type", String)
], Shop.prototype, "shopName", void 0);
__decorate([
    __1.Column({
        name: 'address',
        type: 'string',
        nullable: true
    }),
    __metadata("design:type", String)
], Shop.prototype, "address", void 0);
Shop = __decorate([
    __1.Entity("t_shop"),
    __metadata("design:paramtypes", [Number])
], Shop);
exports.Shop = Shop;
//# sourceMappingURL=shop.js.map