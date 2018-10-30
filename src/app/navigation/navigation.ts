import { FuseNavigation } from '@fuse/types';

export const navigation: FuseNavigation[] = [
    {
        id       : 'applications',
        title    : 'Applications',
        translate: 'NAV.APPLICATIONS',
        type     : 'group',
        icon     : 'apps',
        children : [
            
            
   {
                id       : 'dashboard',
                title    : 'Dashboard',
                translate: 'NAV.DASHBOARD',
                type     : 'item',
                icon     : 'dashboard',
                url      : '/apps/dashboard/'
            },  

            {
                id       : 'contacts',
                title    : 'Admin',
                translate: 'NAV.CONTACTS',
                type     : 'item',
                icon     : 'account_box',
                url      : '/apps/contacts'
            },
            {
                id       : 'external',
                title    : 'External Resource Manager',
                translate: 'NAV.FILE_MANAGER',
                type     : 'item',
                icon     : 'folder',
                url      : '/apps/resources/external/',
            },
             {
                id       : 'dynamic',
                title    : 'Dynamic Resources',
                translate: 'NAV.FILE_MANAGER',
                type     : 'item',
                icon     : 'folder_special',
                url      : '/apps/resources/dynamic/'
            },
             {
                id       : 'native',
                title    : 'Native Resources',
                translate: 'NAV.FILE_MANAGER',
                type     : 'item',
                icon     : 'folder_special',
                url      : '/apps/resources/native/'
            },

             {
                id       : 'roles',
                title    : 'User Roles',
                translate: 'NAV.ROLES',
                type     : 'item',
                icon     : 'person',
                url      : '/apps/roles/'
            },

             {
                id       : 'type',
                title    : 'Type',
                translate: 'NAV.TYPE',
                type     : 'item',
                icon     : 'style',
                url      : '/apps/type/'
            },


             {
                id       : 'topics',
                title    : 'Topic',
                translate: 'NAV.TOPIC',
                type     : 'item',
                icon     : 'border_color',
                url      : '/apps/topic/'
            },
          

             {
                id       : 'audience',
                title    : 'Audience',
                translate: 'NAV.AUDIENCE',
                type     : 'item',
                icon     : 'group',
                url      : '/apps/audience/'
            },    


             {
                id       : 'featured',
                title    : 'Featured',
                translate: 'NAV.FEATURED',
                type     : 'item',
                icon     : 'import_contacts',
                url      : '/apps/featured/'
            },  


             {
                id       : 'redirectmanagement',
                title    : 'Redirect Management',
                translate: 'NAV.REDIRECTMANAGMENT',
                type     : 'item',
                icon     : 'build',
                url      : '/apps/redirectmanagement/'
            },  


           {
              id       : 'loginlgs',
              title    : 'Login Logs',
              translate: 'NAV.LOGINLOGS',
              type     : 'item',
              icon     : 'toc',
              url      : '/apps/loginlog/'
          },  

          
          ]
    }

];