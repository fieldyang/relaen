import {BaseEntity,Entity,Column,Id,OneToMany,EntityProxy} from '../..';
import {GroupUser} from './groupuser';
import {UserInfo} from './userinfo';

@Entity("t_user",'test')
export class User extends BaseEntity{
	@Id()
	@Column({
		name:'user_id',
		type:'number',
		nullable:false,
		identity:true
	})
	public userId:number;

	@Column({
		name:'user_name',
		type:'string',
		nullable:true,
		length:32
	})
	public userName:string;

	@Column({
		name:'user_password',
		type:'string',
		nullable:true,
		length:32
	})
	public userPassword:string;

	@OneToMany({
		entity:'GroupUser',
		mappedBy:'user'
	})
	public groupUsers:Array<GroupUser>;

	@OneToMany({
		entity:'UserInfo',
		mappedBy:'user'
	})
	public userInfos:Array<UserInfo>;

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

	public getUserName():string{
		return this.userName;
	}
	public setUserName(value:string){
		this.userName = value;
	}

	public getUserPassword():string{
		return this.userPassword;
	}
	public setUserPassword(value:string){
		this.userPassword = value;
	}

	public async getGroupUsers():Promise<Array<GroupUser>>{
		return this['groupUsers']?this['groupUsers']:await EntityProxy.get(this,'groupUsers');
	}
	public setGroupUsers(value:Array<GroupUser>){
		this.groupUsers = value;
	}

	public async getUserInfos():Promise<Array<UserInfo>>{
		return this['userInfos']?this['userInfos']:await EntityProxy.get(this,'userInfos');
	}
	public setUserInfos(value:Array<UserInfo>){
		this.userInfos = value;
	}

}