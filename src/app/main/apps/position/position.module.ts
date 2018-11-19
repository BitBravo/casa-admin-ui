import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CdkTableModule } from '@angular/cdk/table';
import { MatButtonModule, MatRadioModule, MatCheckboxModule, MatListModule, MatDatepickerModule, MatFormFieldModule, MatIconModule, MatInputModule, MatMenuModule, MatRippleModule, MatTableModule, MatToolbarModule, MatAutocompleteModule, MatGridListModule } from '@angular/material';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';
import { PositionComponent } from 'app/main/apps/position/position.component';
import { PositionService } from 'app/main/apps/position/position.service';
import { UcWidgetModule } from 'ngx-uploadcare-widget';
import { MatSortModule } from '@angular/material';
const routes: Routes = [
    {
        path: '**',
        component: PositionComponent,
    }
];

@NgModule({
    declarations: [
        PositionComponent,
    ],
    imports: [
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
        MatListModule,
        MatAutocompleteModule,
        MatGridListModule
    ],
    providers: [
        PositionService
    ],
    entryComponents: [
    ]
})
export class PositionModule {}
