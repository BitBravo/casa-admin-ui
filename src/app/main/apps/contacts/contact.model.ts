import { FuseUtils } from '@fuse/utils';

export class Contact
{
    id: string;
    first_name: string;
    last_name: string; 
    email: string;
    address: string;
    password: string;
    role:string;
    last_login: string;
    customer_role:any;

    /**
     * Constructor
     *
     * @param contact
     */
    constructor(contact)
    {
        {
            this.role = contact.role|| 'admin';
            this.id = contact._id || '';
            this.first_name = contact.first_name || '';
            this.last_name = contact.last_name || ''; 
            this.email = contact.email || '';
            this.address = contact.address || '';
            this.password = contact.password || ''; 
            this.last_login = contact.last_login || ''; 
            this.customer_role = contact.customer_role || ''; 
        }
    }
}
