import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { map } from 'rxjs/operators';
import { FuseUtils } from '@fuse/utils';

import { Contact } from 'app/main/apps/contacts/contact.model';

@Injectable()
export class ContactsService implements Resolve<any>
{
    onContactsChanged: BehaviorSubject<any>;
    onSelectedContactsChanged: BehaviorSubject<any>;
    onUserDataChanged: BehaviorSubject<any>;
    onSearchTextChanged: Subject<any>;
    onFilterChanged: Subject<any>;
    contacts: Contact[];
    user: any;
    selectedContacts: string[] = [];
      
    searchText: string;
    filterBy: string;
    ldata : any = JSON.parse(localStorage.getItem('currentUser'));
    httpOptions = {
       headers: new HttpHeaders({
                  'Content-Type':  'application/json',
                  'Authorization': "Bearer "+this.ldata.token,
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
        this.onContactsChanged = new BehaviorSubject([]);
        this.onSelectedContactsChanged = new BehaviorSubject([]);
        this.onUserDataChanged = new BehaviorSubject([]);
        this.onSearchTextChanged = new Subject();
        this.onFilterChanged = new Subject();
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
                this.getContacts(),
            ]).then(
                ([files]) => {
                    if (this.onSearchTextChanged.observers.length == 0)
                    this.onSearchTextChanged.subscribe(searchText => {
                        this.searchText = searchText;
                        this.getContacts();
                    });

                    this.onFilterChanged.subscribe(filter => {
                        this.filterBy = filter;
                        this.getContacts();
                    });

                    resolve();

                },
                reject
            );
        });
    }

    /**
     * Get contacts
     *
     * @returns {Promise<any>}
     */
    getContacts(): Promise<any>
    {
       this.ldata = JSON.parse(localStorage.getItem('currentUser'));
            this.httpOptions = {
       headers: new HttpHeaders({
                  'Content-Type':  'application/json',
                  'Authorization': "Bearer "+this.ldata.token
         })
       };
    

        return new Promise((resolve, reject) => {
            
                this._httpClient.get(`${environment.apiUrl}/admins`,this.httpOptions)
                    .subscribe((response: any) => {

                        this.contacts = response.data;

                        if ( this.filterBy === 'starred' )
                        {
                            this.contacts = this.contacts.filter(_contact => {
                                return this.user.starred.includes(_contact.id);
                            });
                        }

                        if ( this.filterBy === 'frequent' )
                        {
                            this.contacts = this.contacts.filter(_contact => {
                                return this.user.frequentContacts.includes(_contact.id);
                            });
                        }

                        if ( this.searchText && this.searchText !== '' )
                        {
                            this.contacts = FuseUtils.filterArrayByString(this.contacts, this.searchText);
                        }
                        if (this.contacts)
                            this.contacts = this.contacts.map(contact => {
                                return new Contact(contact);
                            });

                        this.onContactsChanged.next(this.contacts);
                        resolve(this.contacts);
                    }, reject);
            }
        );
    }

    /**
     * Toggle selected contact by id
     *
     * @param id
     */
    toggleSelectedContact(id): void
    {
        // First, check if we already have that contact as selected...
        if ( this.selectedContacts.length > 0 )
        {
            const index = this.selectedContacts.indexOf(id);

            if ( index !== -1 )
            {
                this.selectedContacts.splice(index, 1);

                // Trigger the next event
                this.onSelectedContactsChanged.next(this.selectedContacts);

                // Return
                return;
            }
        }

        // If we don't have it, push as selected
        this.selectedContacts.push(id);

        // Trigger the next event
        this.onSelectedContactsChanged.next(this.selectedContacts);
    }

    /**
     * Toggle select all
     */
    toggleSelectAll(): void
    {
        if ( this.selectedContacts.length > 0 )
        {
            this.deselectContacts();
        }
        else
        {
            this.selectContacts();
        }
    }

    /**
     * Select contacts
     *
     * @param filterParameter
     * @param filterValue
     */
    selectContacts(filterParameter?, filterValue?): void
    {
        this.selectedContacts = [];

        // If there is no filter, select all contacts
        if ( filterParameter === undefined || filterValue === undefined )
        {
            this.selectedContacts = [];
            this.contacts.map(contact => {
                this.selectedContacts.push(contact.id);
            });
        }

        // Trigger the next event
        this.onSelectedContactsChanged.next(this.selectedContacts);
    }


    /**
     * Deselect contacts
     */
    deselectContacts(): void
    {
        this.selectedContacts = [];

        // Trigger the next event
        this.onSelectedContactsChanged.next(this.selectedContacts);
    }

    /**
     * Delete contact
     *
     * @param contact
     */
    deleteContact(contact){
        const contactIndex = this.contacts.indexOf(contact);
        this.contacts.splice(contactIndex, 1);
        this.onContactsChanged.next(this.contacts);
          
       return this._httpClient.delete<any>(`${environment.apiUrl}/admins/`+contact.id,this.httpOptions).
       subscribe(data => console.log('successfully deleted'), 
           error => console.log(error.error['error'].message));
    }

    /**
     * Delete selected contacts
     */
    deleteSelectedContacts(): void
    {
        for ( const contactId of this.selectedContacts )
        {
            const contact = this.contacts.find(_contact => {
                return _contact.id === contactId;
            });
           
            const contactIndex = this.contacts.indexOf(contact);
            this.contacts.splice(contactIndex, 1);
        }
        this.onContactsChanged.next(this.contacts);
        
        this._httpClient.post<any>(`${environment.apiUrl}/admins/delete/`,
                        {'arr':this.selectedContacts}, this.httpOptions)
                        .subscribe(response => {this.deselectContacts(); });
    
    }



   addAdmin(contacts)
   { 
        this.ldata = JSON.parse(localStorage.getItem('currentUser'));
        this.httpOptions = {
           headers: new HttpHeaders({
                  'Content-Type':  'application/json',
                  'Authorization': "Bearer "+this.ldata.token
            })
        };
        return this._httpClient.post<any>(`${environment.apiUrl}/admins`,contacts ,this.httpOptions);
   }

     editAdmin(contacts)
   { 

        this.ldata = JSON.parse(localStorage.getItem('currentUser'));
        this.httpOptions = {
           headers: new HttpHeaders({
                  'Content-Type':  'application/json',
                  'Authorization': "Bearer "+this.ldata.token
            })
        };

        return this._httpClient.put<any>(`${environment.apiUrl}/admins/`+contacts.id,contacts ,this.httpOptions);
   }

       getRoles(){
            this.ldata= JSON.parse(localStorage.getItem('currentUser'));
            this.httpOptions = {
                           headers: new HttpHeaders({
                              'Authorization': "Bearer "+this.ldata.token,})};
                return this._httpClient.get<any>(`${environment.apiUrl}/role/`,this.httpOptions);
            }
     


}
