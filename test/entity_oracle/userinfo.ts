import {BaseEntity,Entity,Column,Id,JoinColumn,OneToOne,OneToMany,EntityProxy} from '../..';
import {User} from './user';
import {Shop} from './shop';

@Entity("T_USER_INFO",'XE')
export class UserInfo extends BaseEntity{
	@Id()
	@Column({
		name:'USER_ID',
		type:'number',
		nullable:false
	})
	public userId:number;

	@OneToOne({entity:'User'})
	@JoinColumn({
		name:'USER_ID',
		refName:'USER_ID',
		nullable:true
	})
	public user:User;

	@Column({
		name:'REAL_NAME',
		type:'string',
		nullable:true,
		length:64
	})
	public realName:string;

	@Column({
		name:'AGE',
		type:'number',
		nullable:true
	})
	public age:number;

	@Column({
		name:'SEXY',
		type:'string',
		nullable:true,
		length:1
	})
	public sexy:string;

	@Column({
		name:'REMARKS',
		type:'string',
		nullable:true,
		length:256
	})
	public remarks:string;

	@OneToMany({
		entity:'Shop',
		mappedBy:'userInfoForOwnerId'
	})
	public shopForOwnerIds:Array<Shop>;

	@OneToMany({
		entity:'Shop',
		mappedBy:'userInfoForManagerId'
	})
	public shopForManagerIds:Array<Shop>;

	constructor(idValue?:number){
		super();
		this.userId = idValue;
	}
	public getUserId():number{
		return this.userId;
	}
	public setUserId(value:number){
		this.userId = value;
	}

	public async getUser():Promise<User>{
		return this['user']?this['user']:await EntityProxy.get(this,'user');
	}
	public setUser(value:User){
		this.user = value;
	}

	public getRealName():string{
		return this.realName;
	}
	public setRealName(value:string){
		this.realName = value;
	}

	public getAge():number{
		return this.age;
	}
	public setAge(value:number){
		this.age = value;
	}

	public getSexy():string{
		return this.sexy;
	}
	public setSexy(value:string){
		this.sexy = value;
	}

	public getRemarks():string{
		return this.remarks;
	}
	public setRemarks(value:string){
		this.remarks = value;
	}

	public async getShopForOwnerIds():Promise<Array<Shop>>{
		return this['shopForOwnerIds']?this['shopForOwnerIds']:await EntityProxy.get(this,'shopForOwnerIds');
	}
	public setShopForOwnerIds(value:Array<Shop>){
		this.shopForOwnerIds = value;
	}

	public async getShopForManagerIds():Promise<Array<Shop>>{
		return this['shopForManagerIds']?this['shopForManagerIds']:await EntityProxy.get(this,'shopForManagerIds');
	}
	public setShopForManagerIds(value:Array<Shop>){
		this.shopForManagerIds = value;
	}

}