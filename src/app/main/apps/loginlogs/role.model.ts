import { FuseUtils } from '@fuse/utils';

export class Role
{
    id:string;
    email:string;
    name:string;
    role:string;
    updatedAt:string;
    /**
     * Constructor
     *
     * @param role
     */
    constructor(role)
    {
            this.id =role._id;
            this.name = role.name||'';
            this.email = role.email || '';
            this.updatedAt = role.updatedAt || '';
            this.role = role.role||'';
    }
    
}
