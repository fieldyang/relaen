import {BaseEntity,Entity,Column,Id,OneToMany,EntityProxy} from '../..';
import {GroupUser} from './groupuser';
import {UserInfo} from './userinfo';

@Entity("T_USER",'XE')
export class User extends BaseEntity{
	@Id()
	@Column({
		name:'USER_ID',
		type:'number',
		nullable:false
	})
	public userId:number;

	@Column({
		name:'USER_NAME',
		type:'string',
		nullable:true,
		length:32
	})
	public userName:string;

	@Column({
		name:'USER_PWD',
		type:'string',
		nullable:true,
		length:32
	})
	public userPwd:string;

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

	public getUserPwd():string{
		return this.userPwd;
	}
	public setUserPwd(value:string){
		this.userPwd = value;
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