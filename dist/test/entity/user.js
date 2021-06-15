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
exports.User = void 0;
const __1 = require("../..");
let User = class User extends __1.BaseEntity {
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
    getUserName() {
        return this.userName;
    }
    setUserName(value) {
        this.userName = value;
    }
    getUserPwd() {
        return this.userPwd;
    }
    setUserPwd(value) {
        this.userPwd = value;
    }
    async getGroupUsers() {
        return this['groupUsers'] ? this['groupUsers'] : await __1.EntityProxy.get(this, 'groupUsers');
    }
    setGroupUsers(value) {
        this.groupUsers = value;
    }
    async getUserInfos() {
        return this['userInfos'] ? this['userInfos'] : await __1.EntityProxy.get(this, 'userInfos');
    }
    setUserInfos(value) {
        this.userInfos = value;
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
], User.prototype, "userId", void 0);
__decorate([
    __1.Column({
        name: 'user_name',
        type: 'string',
        nullable: true,
        length: 32
    }),
    __metadata("design:type", String)
], User.prototype, "userName", void 0);
__decorate([
    __1.Column({
        name: 'user_pwd',
        type: 'string',
        nullable: true,
        length: 32
    }),
    __metadata("design:type", String)
], User.prototype, "userPwd", void 0);
__decorate([
    __1.OneToMany({
        entity: 'GroupUser',
        mappedBy: 'user'
    }),
    __metadata("design:type", Array)
], User.prototype, "groupUsers", void 0);
__decorate([
    __1.OneToMany({
        entity: 'UserInfo',
        mappedBy: 'user'
    }),
    __metadata("design:type", Array)
], User.prototype, "userInfos", void 0);
User = __decorate([
    __1.Entity("t_user"),
    __metadata("design:paramtypes", [Number])
], User);
exports.User = User;
//# sourceMappingURL=user.js.map