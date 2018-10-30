import { Component, OnDestroy, OnInit} from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { FileManagerService } from 'app/main/apps/file-manager/file-manager.service';
import { Router } from '@angular/router';
import {Location} from '@angular/common';
@Component({
    selector   : 'selected-bar',
    templateUrl: './selected-bar.component.html',
    styleUrls  : ['./selected-bar.component.scss'],
    providers: [Location]
})
export class FileManagerSelectedBarComponent implements OnInit, OnDestroy
{
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    hasSelectedRoles: boolean;
    isIndeterminate: boolean;
    selectedFiles: string[];
    

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {FileManagerService} _fileManagerService
     * @param {MatDialog} _matDialog
     */
    constructor(
        private _fileManagerService: FileManagerService,
        public _matDialog: MatDialog,
        private router:Router,
        private location:Location
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
        this._fileManagerService.onSelectedFilesChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selectedFiles => {
                if (selectedFiles) {
                    this.selectedFiles = selectedFiles;
                    setTimeout(() => {
                        this.hasSelectedRoles = selectedFiles.length > 0;
                        this.isIndeterminate = (
                                // selectedFiles.length !== 
                                // this._fileManagerService.files.length 
                                // && 
                                selectedFiles.length > 0);
                    }, 0);
                }
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Select all
     */
    selectAll(): void
    {
        this._fileManagerService.selectFiles();
    }

    /**
     * Deselect all
     */
    deselectAll(): void
    {
        this._fileManagerService.deselectFiles();
    }

    /**
     * Delete selected roles
     */
    deleteSelectedFiles(): void
    {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete all selected resources?';

        this.confirmDialogRef.afterClosed()
            .subscribe(result => {
                if ( result )
                {
                    this._fileManagerService.deleteSelectedFiles();
                }
                this.confirmDialogRef = null;
            });
    }

}
