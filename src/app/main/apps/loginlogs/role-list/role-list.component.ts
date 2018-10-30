import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import { Observable, Subject,merge } from 'rxjs';
import { takeUntil,map,debounceTime} from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { RolesService } from 'app/main/apps/loginlogs/roles.service';
import {MatSort} from '@angular/material';
@Component({
    selector     : 'roles-role-list',
    templateUrl  : './role-list.component.html',
    styleUrls    : ['./role-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class RolesRoleListComponent implements OnInit, OnDestroy
{
    @ViewChild('dialogContent')

    dialogContent: TemplateRef<any>;
    roles: any;
    role: any;
    @ViewChild(MatSort)
    sort:MatSort;
    dataSource: FilesDataSource | null;
    displayedColumns = ['checkbox', 'name', 'email','role','loginlogs',  'buttons'];
    selectedRoles: any[];
    checkboxes: {};
    dialogRef: any;
    id:any;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

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
        this.dataSource = new FilesDataSource(this._rolesService,this.sort);
        this._rolesService.onRolesChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(roles => {
                this.roles = roles;
                this.checkboxes = {};
                roles.map(role => {
                    this.checkboxes[role.id] = false;
                });
            });

        this._rolesService.onSelectedRolesChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selectedRoles => {
                for ( const id in this.checkboxes )
                {
                    if ( !this.checkboxes.hasOwnProperty(id) )
                    {
                        continue;
                    }

                    this.checkboxes[id] = selectedRoles.includes(id);
                }
                this.selectedRoles = selectedRoles;
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
     * Edit role
     *
     * @param role
     */


  onUploadCardImage(event){
    let cardImage = event["cdnUrl"];

    this._rolesService.featured(this.id,cardImage).subscribe(
        (response)=>{},
        (error)=>{console.log(error)});
    

    }

    editRole(role): void{
        this.id = role["id"];}

    

    /**
     * On selected change
     *
     * @param roleId
     */
    onSelectedChange(roleId): void
    {
        this._rolesService.toggleSelectedRole(roleId);
    }

}

export class FilesDataSource extends DataSource<any>
{
    /**
     * Constructor
     *
     * @param {RolesService} _rolesService
     */
    constructor(
        private _rolesService: RolesService,private sort:MatSort
    )
    {
        super();
    }

    /**
     * Connect function called by the table to retrieve one stream containing the data to render.
     * @returns {Observable<any[]>}
     */
    connect(): Observable<any[]>
    {
    
        const displayDataChanges = [
            this._rolesService.onRolesChanged,
            this.sort.sortChange
        ];

        return merge(...displayDataChanges)
        .pipe(
            map(()=>{

                   let data = this._rolesService.roles;
                   data = this.sortData(data); 
                   return data;
            }));
        

    }


 sortData(data): any[]
    {
        if ( !this.sort.active || this.sort.direction === '' )
        {
            return data;
        }

        return data.sort((a, b) => {
            let propertyA: number | string = '';
            let propertyB: number | string = '';

            switch ( this.sort.active )
            {
                case 'name':
                    [propertyA, propertyB] = [a.name, b.name];
                    break;
                case 'role':
                    [propertyA, propertyB] = [a.role, b.role];
                    break;
                case 'email':
                    [propertyA, propertyB] = [a.email, b.email];
                    break;
                case 'loginlogs':
                    [propertyA, propertyB] = [a.loginlogs, b.loginlogs];
                    break;

            }

            const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
            const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

            return (valueA < valueB ? -1 : 1) * (this.sort.direction === 'asc' ? 1 : -1);
        });
    }



    /**
     * Disconnect
     */
    disconnect(): void
    {
    }
}
