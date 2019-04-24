import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { map } from 'rxjs/operators';
import { FuseUtils } from '@fuse/utils';
import { Role } from 'app/main/apps/topic/role.model';

@Injectable()
export class RolesService implements Resolve<any>
{
    onRolesChanged: BehaviorSubject<any>;
    onSelectedRolesChanged: BehaviorSubject<any>;
    onRolesDataChanged: BehaviorSubject<any>;
    onSearchTextChanged: Subject<any>;
    onFilterChanged: Subject<any>;
    roles: Role[];
    role: any;
    selectedRoles: string[] = [];

    searchText: string;
    ldata : any = JSON.parse(localStorage.getItem('currentUser'));
    httpOptions = {
       headers: new HttpHeaders({
                  'Content-Type':  'application/json',
                  'Authorization': "Bearer "+this.ldata.token
         })
       };
    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient
    )
    {
        // Set the defaults
        this.onRolesChanged = new BehaviorSubject([]);
        this.onSelectedRolesChanged = new BehaviorSubject([]);
        this.onSearchTextChanged = new Subject();
        this.onRolesDataChanged = new BehaviorSubject([]);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any
    {
        
        return new Promise((resolve, reject) => {

        Promise.all([
                this.getRoles(),
            ]).then(
                ([files]) => {

                    this.onSearchTextChanged.subscribe(searchText => {
                        this.searchText = searchText;
                        this.getRoles();
                    });

                    resolve();

                },
                reject
            );
        });
    }

    /**
     * Get roles
     *
     * @returns {Promise<any>}
     */
    getRoles(): Promise<any>
    {

        this.ldata  = JSON.parse(localStorage.getItem('currentUser'));
        this.httpOptions = {
            headers: new HttpHeaders({
                       'Content-Type':  'application/json',
                       'Authorization': "Bearer "+this.ldata.token
              })
            };

        return new Promise((resolve, reject) => {
            
                this._httpClient.get(`${environment.apiUrl}/topic?count=1000`,this.httpOptions)
                    .subscribe((response: any) => {
                  
                        this.roles = response.data;

                        if ( this.searchText && this.searchText !== '' )
                        {
                            this.roles = FuseUtils.filterArrayByString(this.roles, this.searchText);
                        }
            			if (this.roles)
	                        this.roles = this.roles.map(role => {
	                            return new Role(role);
	                        });

                        this.onRolesChanged.next(this.roles);
                        resolve(this.roles);
                    }, reject);
            }
        );
    }

    /**
     * Toggle selected role by id
     *
     * @param id
     */
    toggleSelectedRole(id): void
    {
        // First, check if we already have that role as selected...
        if ( this.selectedRoles.length > 0 )
        {
            const index = this.selectedRoles.indexOf(id);

            if ( index !== -1 )
            {
                this.selectedRoles.splice(index, 1);

                // Trigger the next event
                this.onSelectedRolesChanged.next(this.selectedRoles);

                // Return
                return;
            }
        }

        // If we don't have it, push as selected
        this.selectedRoles.push(id);

        // Trigger the next event
        this.onSelectedRolesChanged.next(this.selectedRoles);
    }

    /**
     * Toggle select all
     */
    toggleSelectAll(): void
    {
        if ( this.selectedRoles.length > 0 )
        {
            this.deselectRoles();
        }
        else
        {
            this.selectRoles();
        }
    }

    /**
     * Select roles
     *
     * @param filterParameter
     * @param filterValue
     */
    selectRoles(filterParameter?, filterValue?): void
    {
        this.selectedRoles = [];

        // If there is no filter, select all roles
        if ( filterParameter === undefined || filterValue === undefined )
        {
            this.selectedRoles = [];
            this.roles.map(role => {
                this.selectedRoles.push(role.id);
            });
        }

        // Trigger the next event
        this.onSelectedRolesChanged.next(this.selectedRoles);
    }
   
    /**
     * Deselect roles
     */
    deselectRoles(): void
    {
        this.selectedRoles = [];

        // Trigger the next event
        this.onSelectedRolesChanged.next(this.selectedRoles);
    }

    /**
     * Delete role
     *
     * @param role
     */
     deleteRole(role)
     {  
     	this.ldata= JSON.parse(localStorage.getItem('currentUser'));
     	this.httpOptions = {
    	   headers: new HttpHeaders({
              'Content-Type':  'application/json',
              'Authorization': "Bearer "+this.ldata.token
     	 })};
        const roleIndex = this.roles.indexOf(role);
        this.roles.splice(roleIndex, 1);
        this.onRolesChanged.next(this.roles);
        return this._httpClient.delete<any>(`${environment.apiUrl}/topic/`+role.id,this.httpOptions);
      
    }

     /**
     * get category
     *
     * @param role
     */
    getCategory ()
    {  
        this.httpOptions = {
            headers: new HttpHeaders({
                'Content-Type':  'application/json',
                'Authorization': 'Bearer ' + this.ldata.token
            })
        };
       return this._httpClient.get<any>(`${environment.apiUrl}/categories/`, this.httpOptions);
   }

    /**
     * Delete selected roles
     */
    deleteSelectedRoles()
    {
        this.ldata = JSON.parse(localStorage.getItem('currentUser'));
        this.httpOptions = {
            headers: new HttpHeaders({
                       'Content-Type':  'application/json',
                       'Authorization': "Bearer "+this.ldata.token
              })
            };
        for ( const roleId of this.selectedRoles )
        {
            const role = this.roles.find(_role => {
                return _role.id === roleId;
            });
            const roleIndex = this.roles.indexOf(role);
            this.roles.splice(roleIndex, 1);
        }
        this.onRolesChanged.next(this.roles);

        return  this._httpClient.post<any>(`${environment.apiUrl}/topic/delete`,
                {'arr':this.selectedRoles},this.httpOptions).
                    subscribe(response => {this.deselectRoles(); });
    ;
        

    }


   addRole(role)
   { 
        this.ldata = JSON.parse(localStorage.getItem('currentUser'));
        this.httpOptions = {
           headers: new HttpHeaders({
                  'Content-Type':  'application/json',
                  'Authorization': "Bearer "+this.ldata.token
            })
        };
        return this._httpClient.post<any>(`${environment.apiUrl}/topic`,role ,this.httpOptions);
   }

   
   editRole(role)
   { 
        this.ldata = JSON.parse(localStorage.getItem('currentUser'));
        this.httpOptions = {
           headers: new HttpHeaders({
                  'Content-Type':  'application/json',
                  'Authorization': "Bearer "+this.ldata.token
            })
        };
        return this._httpClient.put<any>(`${environment.apiUrl}/topic/`+role.id,role ,this.httpOptions);
   }

}