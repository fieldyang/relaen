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
exports.GroupUser = void 0;
const __1 = require("../..");
const user_1 = require("./user");
const group_1 = require("./group");
let GroupUser = class GroupUser extends __1.BaseEntity {
    constructor(idValue) {
        super();
        this.groupUserId = idValue;
    }
    getGroupUserId() {
        return this.groupUserId;
    }
    setGroupUserId(value) {
        this.groupUserId = value;
    }
    async getUser() {
        return this['user'] ? this['user'] : await __1.EntityProxy.get(this, 'user');
    }
    setUser(value) {
        this.user = value;
    }
    async getGroup() {
        return this['group'] ? this['group'] : await __1.EntityProxy.get(this, 'group');
    }
    setGroup(value) {
        this.group = value;
    }
};
__decorate([
    __1.Id(),
    __1.Column({
        name: 'group_user_id',
        type: 'number',
        nullable: false
    }),
    __metadata("design:type", Number)
], GroupUser.prototype, "groupUserId", void 0);
__decorate([
    __1.ManyToOne({ entity: 'User' }),
    __1.JoinColumn({
        name: 'user_id',
        refName: 'user_id',
        nullable: true
    }),
    __metadata("design:type", user_1.User)
], GroupUser.prototype, "user", void 0);
__decorate([
    __1.ManyToOne({ entity: 'Group' }),
    __1.JoinColumn({
        name: 'group_id',
        refName: 'group_id',
        nullable: true
    }),
    __metadata("design:type", group_1.Group)
], GroupUser.prototype, "group", void 0);
GroupUser = __decorate([
    __1.Entity("t_group_user"),
    __metadata("design:paramtypes", [Number])
], GroupUser);
exports.GroupUser = GroupUser;
//# sourceMappingURL=groupuser.js.map