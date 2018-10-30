import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

import { RolesService } from 'app/main/apps/audience/roles.service';

@Component({
    selector   : 'selected-bar',
    templateUrl: './selected-bar.component.html',
    styleUrls  : ['./selected-bar.component.scss']
})
export class RolesSelectedBarComponent implements OnInit, OnDestroy
{
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    hasSelectedRoles: boolean;
    isIndeterminate: boolean;
    selectedRoles: string[];

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {RolesService} _rolesService
     * @param {MatDialog} _matDialog
     */
    constructor(
        private _rolesService: RolesService,
        public _matDialog: MatDialog
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
        this._rolesService.onSelectedRolesChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selectedRoles => {
                this.selectedRoles = selectedRoles;
                setTimeout(() => {
                    this.hasSelectedRoles = selectedRoles.length > 0;
                    this.isIndeterminate = (selectedRoles.length !== this._rolesService.roles.length && selectedRoles.length > 0);
                }, 0);
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
        this._rolesService.selectRoles();
    }

    /**
     * Deselect all
     */
    deselectAll(): void
    {
        this._rolesService.deselectRoles();
    }

    /**
     * Delete selected roles
     */
    deleteSelectedRoles(): void
    {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete all selected roles?';

        this.confirmDialogRef.afterClosed()
            .subscribe(result => {
                if ( result )
                {
                    this._rolesService.deleteSelectedRoles();
                }
                this.confirmDialogRef = null;
            });
    }
}
