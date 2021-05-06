import {BaseEntity,Entity,Column,Id,JoinColumn,ManyToOne,EntityProxy} from '../..';
import {UserInfo} from './userinfo';

@Entity("T_SHOP",'XE')
export class Shop extends BaseEntity{
	@Id()
	@Column({
		name:'SHOP_ID',
		type:'number',
		nullable:false
	})
	public shopId:number;

	@ManyToOne({entity:'UserInfo'})
	@JoinColumn({
		name:'OWNER_ID',
		refName:'USER_ID',
		nullable:true
	})
	public userInfoForOwnerId:UserInfo;

	@ManyToOne({entity:'UserInfo'})
	@JoinColumn({
		name:'MANAGER_ID',
		refName:'USER_ID',
		nullable:true
	})
	public userInfoForManagerId:UserInfo;

	@Column({
		name:'SHOP_NAME',
		type:'string',
		nullable:true,
		length:32
	})
	public shopName:string;

	@Column({
		name:'ADDRESS',
		type:'string',
		nullable:true,
		length:128
	})
	public address:string;

	constructor(idValue?:number){
		super();
		this.shopId = idValue;
	}
	public getShopId():number{
		return this.shopId;
	}
	public setShopId(value:number){
		this.shopId = value;
	}

	public async getUserInfoForOwnerId():Promise<UserInfo>{
		return this['userInfoForOwnerId']?this['userInfoForOwnerId']:await EntityProxy.get(this,'userInfoForOwnerId');
	}
	public setUserInfoForOwnerId(value:UserInfo){
		this.userInfoForOwnerId = value;
	}

	public async getUserInfoForManagerId():Promise<UserInfo>{
		return this['userInfoForManagerId']?this['userInfoForManagerId']:await EntityProxy.get(this,'userInfoForManagerId');
	}
	public setUserInfoForManagerId(value:UserInfo){
		this.userInfoForManagerId = value;
	}

	public getShopName():string{
		return this.shopName;
	}
	public setShopName(value:string){
		this.shopName = value;
	}

	public getAddress():string{
		return this.address;
	}
	public setAddress(value:string){
		this.address = value;
	}

}