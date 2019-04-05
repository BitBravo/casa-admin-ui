import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgxEditorModule } from 'ngx-editor';
import { CdkTableModule } from '@angular/cdk/table';
import {  MatSlideToggleModule, MatButtonModule, MatCheckboxModule, MatDatepickerModule, MatFormFieldModule, MatIconModule, MatInputModule, MatMenuModule, MatRippleModule, MatTableModule, MatToolbarModule, MatChipsModule, MatOptionModule, MatTabsModule } from '@angular/material';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseSidebarModule } from '@fuse/components';
import { FuseConfirmDialogModule } from '@fuse/components';
import { FileManagerService } from 'app/main/apps/file-manager/file-manager.service';
import { FileManagerComponent } from 'app/main/apps/file-manager/file-manager.component';
import { FileManagerFileListComponent } from 'app/main/apps/file-manager/file-list/file-list.component';
import { FileManagerSelectedBarComponent } from 'app/main/apps/file-manager/selected-bar/selected-bar.component';
import { ContactsContactFormDialogComponent } from 'app/main/apps/file-manager/contact-form/contact-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatDividerModule, MatRadioModule, MatSelectModule } from '@angular/material';
import { FuseDirectivesModule } from '@fuse/directives/directives';
import { FuseMaterialColorPickerModule } from '@fuse/components/material-color-picker/material-color-picker.module';
import { FileManagerMainSidebarComponent } from 'app/main/apps/file-manager/sidebars/main/main.component';
import { RolesService } from 'app/main/apps/roles/roles.service';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { CKEditorModule } from 'ngx-ckeditor';
import { UcWidgetModule } from 'ngx-uploadcare-widget';
import { MatSortModule, MatPaginatorModule} from '@angular/material';
const routes: Routes = [
    {
        path     : '**',
        component: FileManagerComponent,
        children : [],
        resolve  : {
            files: FileManagerService
        },
        runGuardsAndResolvers: 'always',
    }
];

@NgModule({
    declarations: [
        FileManagerComponent,
        FileManagerFileListComponent,
        FileManagerMainSidebarComponent,
         FileManagerSelectedBarComponent,
        ContactsContactFormDialogComponent,
    ],
    imports     : [
        NgxEditorModule,
        RouterModule.forChild(routes),
        CdkTableModule,
        MatButtonModule,
        MatSlideToggleModule,
        MatToolbarModule,
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
        MatChipsModule,
        MatOptionModule,
        MatSelectModule,
        FuseSharedModule,
        FuseSidebarModule,
        FuseConfirmDialogModule,
        CKEditorModule,
        MatAutocompleteModule,
        TooltipModule.forRoot(),
        MatSortModule,
        UcWidgetModule,
        MatPaginatorModule,
        MatTabsModule     
    ],
    providers   : [
        FileManagerService,
        RolesService,
        MatSortModule
    ],
    entryComponents: [
        ContactsContactFormDialogComponent
    ]
})
export class FileManagerModule
{
}
