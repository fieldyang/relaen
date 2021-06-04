import {BaseEntity,Entity,Column,Id,JoinColumn,OneToOne,OneToMany,EntityProxy} from '../..';
import {User} from './user';
import {Shop} from './shop';

@Entity("t_user_info")
export class UserInfo extends BaseEntity{
	@Id()
	@Column({
		name:'user_id',
		type:'number',
		nullable:false
	})
	public userId:number;

	@OneToOne({entity:'User'})
	@JoinColumn({
		name:'user_id',
		refName:'user_id',
		nullable:true
	})
	public user:User;

	@Column({
		name:'real_name',
		type:'string',
		nullable:true,
		length:64
	})
	public realName:string;

	@Column({
		name:'age',
		type:'number',
		nullable:true
	})
	public age:number;

	@Column({
		name:'sexy',
		type:'string',
		nullable:true,
		length:1
	})
	public sexy:string;

	@Column({
		name:'remarks',
		type:'string',
		nullable:true,
		length:256
	})
	public remarks:string;

	@OneToMany({
		entity:'Shop',
		mappedBy:'userInfoForManagerId'
	})
	public shopForManagerIds:Array<Shop>;

	@OneToMany({
		entity:'Shop',
		mappedBy:'userInfoForOwnerId'
	})
	public shopForOwnerIds:Array<Shop>;

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

	public async getShopForManagerIds():Promise<Array<Shop>>{
		return this['shopForManagerIds']?this['shopForManagerIds']:await EntityProxy.get(this,'shopForManagerIds');
	}
	public setShopForManagerIds(value:Array<Shop>){
		this.shopForManagerIds = value;
	}

	public async getShopForOwnerIds():Promise<Array<Shop>>{
		return this['shopForOwnerIds']?this['shopForOwnerIds']:await EntityProxy.get(this,'shopForOwnerIds');
	}
	public setShopForOwnerIds(value:Array<Shop>){
		this.shopForOwnerIds = value;
	}

}