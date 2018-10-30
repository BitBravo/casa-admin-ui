import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { RolesService } from 'app/main/apps/topic/roles.service';

@Component({
    selector   : 'roles-main-sidebar', 
    templateUrl: './main.component.html',
    styleUrls  : ['./main.component.scss']
})
export class RolesMainSidebarComponent implements OnInit, OnDestroy
{
    role: any;
    filterBy: string;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {RolesService} _rolesService
     */
    constructor(
        private _rolesService: RolesService
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

        this._rolesService.onRolesDataChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(role => {
                this.role = role;
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
        this._rolesService.onFilterChanged.next(this.filterBy);
    }
}
