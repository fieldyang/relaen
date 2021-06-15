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
exports.Group = void 0;
const __1 = require("../..");
let Group = class Group extends __1.BaseEntity {
    constructor(idValue) {
        super();
        this.groupId = idValue;
    }
    getGroupId() {
        return this.groupId;
    }
    setGroupId(value) {
        this.groupId = value;
    }
    getGroupName() {
        return this.groupName;
    }
    setGroupName(value) {
        this.groupName = value;
    }
    async getGroupUsers() {
        return this['groupUsers'] ? this['groupUsers'] : await __1.EntityProxy.get(this, 'groupUsers');
    }
    setGroupUsers(value) {
        this.groupUsers = value;
    }
};
__decorate([
    __1.Id(),
    __1.Column({
        name: 'group_id',
        type: 'number',
        nullable: false
    }),
    __metadata("design:type", Number)
], Group.prototype, "groupId", void 0);
__decorate([
    __1.Column({
        name: 'group_name',
        type: 'string',
        nullable: true,
        length: 32
    }),
    __metadata("design:type", String)
], Group.prototype, "groupName", void 0);
__decorate([
    __1.OneToMany({
        entity: 'GroupUser',
        mappedBy: 'group'
    }),
    __metadata("design:type", Array)
], Group.prototype, "groupUsers", void 0);
Group = __decorate([
    __1.Entity("t_group"),
    __metadata("design:paramtypes", [Number])
], Group);
exports.Group = Group;
//# sourceMappingURL=group.js.map