import { BaseEntity, Entity, Column, Id, JoinColumn, ManyToOne, EntityProxy } from '../..';
import { UserInfo } from './userinfo';

@Entity("t_shop")
export class Shop extends BaseEntity {
	@Id()
	@Column({
		name: 'shop_id',
		type: 'number',
		nullable: false
	})
	public shopId: number;

	@ManyToOne({ entity: 'UserInfo' })
	@JoinColumn({
		name: 'owner_id',
		refName: 'user_id',
		nullable: true
	})
	public userInfoForOwnerId: UserInfo;

	@ManyToOne({ entity: 'UserInfo' })
	@JoinColumn({
		name: 'manager_id',
		refName: 'user_id',
		nullable: true
	})
	public userInfoForManagerId: UserInfo;

	@Column({
		name: 'shop_name',
		type: 'string',
		nullable: true,
		length: 32
	})
	public shopName: string;

	@Column({
		name: 'address',
		type: 'string',
		nullable: true
	})
	public address: string;

	constructor(idValue?: number) {
		super();
		this.shopId = idValue;
	}
	public getShopId(): number {
		return this.shopId;
	}
	public setShopId(value: number) {
		this.shopId = value;
	}

	public async getUserInfoForOwnerId(): Promise<UserInfo> {
		return this['userInfoForOwnerId'] ? this['userInfoForOwnerId'] : await EntityProxy.get(this, 'userInfoForOwnerId');
	}
	public setUserInfoForOwnerId(value: UserInfo) {
		this.userInfoForOwnerId = value;
	}

	public async getUserInfoForManagerId(): Promise<UserInfo> {
		return this['userInfoForManagerId'] ? this['userInfoForManagerId'] : await EntityProxy.get(this, 'userInfoForManagerId');
	}
	public setUserInfoForManagerId(value: UserInfo) {
		this.userInfoForManagerId = value;
	}

	public getShopName(): string {
		return this.shopName;
	}
	public setShopName(value: string) {
		this.shopName = value;
	}

	public getAddress(): string {
		return this.address;
	}
	public setAddress(value: string) {
		this.address = value;
	}

}