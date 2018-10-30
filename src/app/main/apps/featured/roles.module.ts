import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CdkTableModule } from '@angular/cdk/table';
import { MatButtonModule, MatRadioModule,MatCheckboxModule, MatDatepickerModule, MatFormFieldModule, MatIconModule, MatInputModule, MatMenuModule, MatRippleModule, MatTableModule, MatToolbarModule } from '@angular/material';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';
import { RolesComponent } from 'app/main/apps/featured/roles.component';
import { RolesService } from 'app/main/apps/featured/roles.service';
import { RolesRoleListComponent } from 'app/main/apps/featured/role-list/role-list.component';
import { RolesSelectedBarComponent } from 'app/main/apps/featured/selected-bar/selected-bar.component';
import { RolesMainSidebarComponent } from 'app/main/apps/featured/sidebars/main/main.component';
import { UcWidgetModule } from 'ngx-uploadcare-widget';
import { MatSortModule,MatPaginatorModule} from '@angular/material';
const routes: Routes = [
    {
        path     : '**',
        component: RolesComponent,
        resolve  : {
            roles: RolesService
        }
    }
];

@NgModule({
    declarations   : [
        RolesComponent,
        RolesRoleListComponent,
        RolesSelectedBarComponent,
	    RolesMainSidebarComponent,
    ],
    imports        : [
        RouterModule.forChild(routes),
        CdkTableModule,
        MatButtonModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatMenuModule,
        MatRippleModule,
        MatTableModule,
        MatToolbarModule,
	    MatRadioModule,
        FuseSharedModule,
        FuseSidebarModule,
        FuseConfirmDialogModule,
        UcWidgetModule,
        MatSortModule,
        MatPaginatorModule
    ],
    providers      : [
        RolesService
    ],
    entryComponents: [
    ]
})
export class RolesModule
{
}