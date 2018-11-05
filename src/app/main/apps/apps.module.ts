import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {MatSortModule} from '@angular/material';
import { FuseSharedModule } from '@fuse/shared.module';

const routes = [
{
    path        : 'resources/dynamic',
    loadChildren: './file-manager/file-manager.module#FileManagerModule'
},
{
    path        : 'resources/external',
    loadChildren: './file-manager/file-manager.module#FileManagerModule'
    
},
{
    path        : 'resources/native',
    loadChildren: './file-manager/file-manager.module#FileManagerModule'

},
{
    path        : 'contacts',
    loadChildren: './contacts/contacts.module#ContactsModule'
},
{
    path        : 'roles',
    loadChildren: './roles/roles.module#RolesModule'
},

{
    path        : 'type',
    loadChildren: './type/roles.module#RolesModule'
},
{
    path        : 'topic',
    loadChildren: './topic/roles.module#RolesModule'
},

{
    path        : 'redirectmanagement',
    loadChildren: './redirect/roles.module#RolesModule'
},

{
    path        : 'audience',
    loadChildren: './audience/roles.module#RolesModule'
},


{
    path        : 'featured',
    loadChildren: './featured/roles.module#RolesModule'
},


{
    path        : 'loginlog',
    loadChildren: './loginlogs/roles.module#RolesModule'
},


{
    path        : 'report',
    loadChildren: './report/report.module#ReportModule'
},

{
    path        : 'dashboard',
    loadChildren: './dashboard/analytics/analytics.module#AnalyticsDashboardModule'
},
];

@NgModule({
    imports     : [
    RouterModule.forChild(routes),
    FuseSharedModule,
    MatSortModule
    ],
    declarations: []
})
export class AppsModule
{
}
