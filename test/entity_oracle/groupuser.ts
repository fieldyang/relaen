import {BaseEntity,Entity,Column,Id,JoinColumn,ManyToOne,EntityProxy} from '../..';
import {User} from './user';
import {Group} from './group';

@Entity("T_GROUP_USER",'XE')
export class GroupUser extends BaseEntity{
	@Id()
	@Column({
		name:'GROUP_USER_ID',
		type:'number',
		nullable:false
	})
	public groupUserId:number;

	@ManyToOne({entity:'User'})
	@JoinColumn({
		name:'USER_ID',
		refName:'USER_ID',
		nullable:true
	})
	public user:User;

	@ManyToOne({entity:'Group'})
	@JoinColumn({
		name:'GROUP_ID',
		refName:'GROUP_ID',
		nullable:true
	})
	public group:Group;

	constructor(idValue?:number){
		super();
		this.groupUserId = idValue;
	}
	public getGroupUserId():number{
		return this.groupUserId;
	}
	public setGroupUserId(value:number){
		this.groupUserId = value;
	}

	public async getUser():Promise<User>{
		return this['user']?this['user']:await EntityProxy.get(this,'user');
	}
	public setUser(value:User){
		this.user = value;
	}

	public async getGroup():Promise<Group>{
		return this['group']?this['group']:await EntityProxy.get(this,'group');
	}
	public setGroup(value:Group){
		this.group = value;
	}

}