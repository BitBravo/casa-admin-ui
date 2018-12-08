import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { ReportService } from 'app/main/apps/report/report.service';

@Component({
    selector: 'report',
    templateUrl: './report.component.html',
    styleUrls: ['./report.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class ReportComponent implements OnInit, OnDestroy {
    dialogRef: any;
    hasSelectedReport: boolean;
    searchInput: FormControl;
    selectedOptions: any = [];
    startDate: any;
    endDate: any;

    // Private
    private _unsubscribeAll: Subject<any>;
    options: string[] = ['Click', 'Download', 'Search', 'View'];

    constructor(
        private _reportService: ReportService
    ) {

        // Set the defaults
        this.searchInput = new FormControl('');

        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void { }


    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    generate(): void {
        let startDateString = '', endDateString = '';
        if (this.startDate) {
            startDateString = `${this.startDate['_i']['year']}-${(this.startDate['_i']['month'] + 1)}-${this.startDate['_i']['date']}`;
        }

        if (this.endDate) {
            endDateString = `${this.endDate['_i']['year']}-${(this.endDate['_i']['month'] + 1)}-${this.endDate['_i']['date']}`;
        }
        if (this.selectedOptions.length > 0) {
            this._reportService.getReports(this.selectedOptions.join(','), startDateString, endDateString).subscribe(selectedReport => {
                this._reportService.getReportsAggregated(this.selectedOptions.join(','), startDateString, endDateString).subscribe(searchedAggregated => {
                    console.log(searchedAggregated);
                    this.exportPdf(selectedReport['data'], searchedAggregated['data']);
                });
            });
        }
    }

    exportPdf(data, searchedAggregated): void {
        const excelData = {};
        this.selectedOptions.forEach(option => {
            const tempData = data.filter(f => f['eventType'] === option);
            excelData[`Resource ${option} by user`] = [];
            tempData.forEach(d => {
                excelData[`Resource ${option} by user`].push({
                    'Usernames': d['user'],
                    'Resource name': d['content'],
                    'Time': new Date(d['createdAt']).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }),
                    'Date': new Date(d['createdAt']).toLocaleString('en-US', { year: 'numeric', month: 'numeric', day: 'numeric' })
                });
            });
            const tempAggregated = searchedAggregated.filter(f => f['_id'] === option);
            if (tempAggregated.length > 0) {
                console.log(tempAggregated);
                excelData[`Resource ${option} aggregated`] = tempAggregated[0]['items'];
            } else {
                excelData[`Resource ${option} aggregated`] = [];
            }
            // excelData[`Resource ${option} aggregated`] = searchedAggregated.filter(f => f['_id'] === option)[0]['items'];
        });
        
        this._reportService.exportAsExcelFile(excelData, 'report');
    }
}
