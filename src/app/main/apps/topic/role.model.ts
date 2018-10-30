import { FuseUtils } from '@fuse/utils';

export class Role
{
    id:string;
    name:string;
    admin_email:string;

    /**
     * Constructor
     *
     * @param role
     */
    constructor(role)
    {
            this.id =role._id;
            this.name = role.name||'';
            this.admin_email = role.admin_email || '';
            
    }
    
}
