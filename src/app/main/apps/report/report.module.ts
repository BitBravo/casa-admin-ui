import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CdkTableModule } from '@angular/cdk/table';
import { MatButtonModule, MatRadioModule, MatCheckboxModule, MatListModule, MatDatepickerModule, MatFormFieldModule, MatIconModule, MatInputModule, MatMenuModule, MatRippleModule, MatTableModule, MatToolbarModule } from '@angular/material';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';
import { ReportComponent } from 'app/main/apps/report/report.component';
import { ReportService } from 'app/main/apps/report/report.service';
import { UcWidgetModule } from 'ngx-uploadcare-widget';
import { MatSortModule } from '@angular/material';
const routes: Routes = [
    {
        path: '**',
        component: ReportComponent,
    }
];

@NgModule({
    declarations: [
        ReportComponent,
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
        MatListModule
    ],
    providers: [
        ReportService
    ],
    entryComponents: [
    ]
})
export class ReportModule {}
