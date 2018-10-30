import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CdkTableModule } from '@angular/cdk/table';
import { MatButtonModule, MatRadioModule,MatCheckboxModule, MatDatepickerModule, MatFormFieldModule, MatIconModule, MatInputModule, MatMenuModule, MatRippleModule, MatTableModule, MatToolbarModule } from '@angular/material';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';
import { RolesComponent } from 'app/main/apps/roles/roles.component';
import { RolesService } from 'app/main/apps/roles/roles.service';
import { RolesRoleListComponent } from 'app/main/apps/roles/role-list/role-list.component';
import { RolesSelectedBarComponent } from 'app/main/apps/roles/selected-bar/selected-bar.component';
import { RolesRoleFormDialogComponent } from 'app/main/apps/roles/role-form/role-form.component';
import { RolesMainSidebarComponent } from 'app/main/apps/roles/sidebars/main/main.component';
import {MatSortModule} from '@angular/material';
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
        RolesRoleFormDialogComponent
    ],
    imports        : [
        RouterModule.forChild(routes),
        CdkTableModule,
        MatSortModule,
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
    
    ],
    providers      : [
        RolesService
    ],
    entryComponents: [
        RolesRoleFormDialogComponent
    ]
})
export class RolesModule
{
}