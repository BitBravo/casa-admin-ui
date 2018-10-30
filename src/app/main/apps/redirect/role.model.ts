import { FuseUtils } from '@fuse/utils';

export class Role
{
    id:string;
    url:string;
    redirect_url:string;
    hits:number;
    updatedAt:string;
        /**
     * Constructor
     *
     * @param role
     */
    constructor(role)
    {
            this.id =role._id;
            this.url = role.url||'';
            this.redirect_url = role.redirect_url || '';
            this.hits = role.hits;
            this.updatedAt = role.updatedAt;
    }
    
}
