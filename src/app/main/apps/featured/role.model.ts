import { FuseUtils } from '@fuse/utils';

export class Role
{
    id:string;
    name:string;
    admin_email:string;
    title:string;
    cardImage:string;
    isfeatured:boolean;
    origin:any;
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
            this.cardImage=role.cardImage||'';
            this.title =role.title||'';
            this.isfeatured = role.isfeatured||false;
            this.origin =role.origin||'';
    }
    
}
