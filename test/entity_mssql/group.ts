import {BaseEntity,Entity,Column,Id,OneToMany,EntityProxy} from '../..';
import {GroupUser} from './groupuser';

@Entity("t_group",'test')
export class Group extends BaseEntity{
	@Id()
	@Column({
		name:'group_id',
		type:'number',
		nullable:false,
		identity:true
	})
	public groupId:number;

	@Column({
		name:'group_name',
		type:'string',
		nullable:true,
		length:32
	})
	public groupName:string;

	@OneToMany({
		entity:'GroupUser',
		mappedBy:'group'
	})
	public groupUsers:Array<GroupUser>;

	constructor(idValue?:number){
		super();
		this.groupId = idValue;
	}
	public getGroupId():number{
		return this.groupId;
	}
	public setGroupId(value:number){
		this.groupId = value;
	}

	public getGroupName():string{
		return this.groupName;
	}
	public setGroupName(value:string){
		this.groupName = value;
	}

	public async getGroupUsers():Promise<Array<GroupUser>>{
		return this['groupUsers']?this['groupUsers']:await EntityProxy.get(this,'groupUsers');
	}
	public setGroupUsers(value:Array<GroupUser>){
		this.groupUsers = value;
	}

}