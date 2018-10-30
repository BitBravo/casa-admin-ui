import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FileManagerService } from 'app/main/apps/file-manager/file-manager.service';
@Component({
    selector   : 'file-manager-main-sidebar',
    templateUrl: './main.component.html',
    styleUrls  : ['./main.component.scss']
})
export class FileManagerMainSidebarComponent implements OnInit, OnDestroy
{
    file: any;
    filterBy:string;

    // Private
    private _unsubscribeAll: Subject<any>;
    /**
     * Constructor
     *
     */
    constructor(
        private _fileManagerService: FileManagerService
    )
    {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }
    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------
    /**
     * On init
     */
    ngOnInit(): void
    {
        this._fileManagerService.onFilesDataChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(file => {
                this.file = file;
            })
            ;
    }
    /**
     * On destroy
     */
    ngOnDestroy()
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------
    /**
     * Change the filter
     *
     * @param filter
     */
    changeFilter(filter): void
    {
        this.filterBy = filter;
        this._fileManagerService.onFilterChanged.next(this.filterBy);
    }
}
