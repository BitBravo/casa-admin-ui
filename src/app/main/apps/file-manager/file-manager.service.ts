import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot, Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { map } from 'rxjs/operators';
import { FuseUtils } from '@fuse/utils';
import { FileData } from 'app/main/apps/file-manager/file-manager.model';



@Injectable()
export class FileManagerService implements Resolve<any>
{
    onFilesChanged: BehaviorSubject<any>;
    onSelectedFilesChanged: BehaviorSubject<any>;
    onFilesDataChanged: BehaviorSubject<any>;
    onSearchTextChanged: Subject<any>;
    onFilterChanged: Subject<any>;
    files: FileData[];
    file: FileData;
    selectedFiles: string[] = [];
    origin: string;

    searchText: string;
    ldata: any = JSON.parse(localStorage.getItem('currentUser'));
    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.ldata.token
        })
    };

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient,
        private router: Router
    ) {
        // Set the defaults
        this.onFilesChanged = new BehaviorSubject({});
        this.onSelectedFilesChanged = new BehaviorSubject([]);
        this.onSearchTextChanged = new Subject();
        this.onFilesDataChanged = new BehaviorSubject([]);
        this.origin = 'external' /*window.location.href.split("/")[5] || 'external'*/;
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {

        return new Promise((resolve, reject) => {
            Promise.all([
                this.getFiles()
            ]).then(
                ([files]) => {

                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get files
     *
     * @returns {Promise<any>}
     */
    getFiles(): Promise<any> {
        this.ldata = JSON.parse(localStorage.getItem('currentUser'));
        this.httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.ldata.token
            })
        };


        return new Promise((resolve, reject) => {

            this._httpClient.get(`${environment.apiUrl}/resource/` + this.origin, this.httpOptions)
                .subscribe((response: any) => {
                    this.files = response.data;
                    // tocheck todo          this.onFilesChanged.next(response);
                    if (this.searchText && this.searchText !== '') {
                        this.files = FuseUtils.filterArrayByString(this.files, this.searchText);
                    }
                    
                    if (this.files) {
                        this.files = this.files.map(file => {
                            return new FileData(file);
                        });
                    }

                    this.onFilesChanged.next(this.files);
                    resolve(this.files);
                }, reject);
        }
        );
    }
    /**
     * Toggle selected file by id
     *
     * @param id
     */
    toggleSelectedFile(id): void {
        // First, check if we already have that files as selected...
        if (this.selectedFiles.length > 0) {
            const index = this.selectedFiles.indexOf(id);
            if (index !== -1) {
                this.selectedFiles.splice(index, 1);
                // Trigger the next event
                this.onSelectedFilesChanged.next(this.selectedFiles);
                // Return
                return;
            }
        }
        // If we don't have it, push as selected
        this.selectedFiles.push(id);
        // Trigger the next event
        this.onSelectedFilesChanged.next(this.selectedFiles);
    }
    /**
     * Toggle select all
     */
    toggleSelectAll(): void {
        if (this.selectedFiles.length > 0) {
            this.deselectFiles();
        }
        else {
            this.selectFiles();
        }
    }
    /**
     * Select files
     *
     * @param filterParameter
     * @param filterValue
     */
    selectFiles(filterParameter?, filterValue?): void {
        this.selectedFiles = [];
        // If there is no filter, select all roles
        if (filterParameter === undefined || filterValue === undefined) {
            this.selectedFiles = [];
            this.files.map(file => {
                this.selectedFiles.push(file._id);
            });
        }

        // Trigger the next event
        this.onSelectedFilesChanged.next(this.selectedFiles);
    }
    /**
     * Deselect 
     */
    deselectFiles(): void {
        this.selectedFiles = [];

        // Trigger the next event
        this.onSelectedFilesChanged.next(this.selectedFiles);
    }

    /**
     * Delete role
     *
     * @param role
     */
    deleteFile(file) {
        this.ldata = JSON.parse(localStorage.getItem('currentUser'));
        this.httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.ldata.token
            })
        };
        const fileIndex = this.files.indexOf(file);
        this.files.splice(fileIndex, 1);
        this.onFilesChanged.next(this.files);
        return this._httpClient.delete<any>(`${environment.apiUrl}/resource/` + file._id, this.httpOptions);
    }



    /**
        * Delete selected roles
        */
    deleteSelectedFiles() {
        this.ldata = JSON.parse(localStorage.getItem('currentUser'));
        this.httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.ldata.token
            })
        };
        for (const fileId of this.selectedFiles) {
            const file = this.files.find(_file => {
                return _file._id === fileId;
            });
            const fileIndex = this.files.indexOf(file);
            this.files.splice(fileIndex, 1);
        }
        this.onFilesChanged.next(this.files);

        return this._httpClient.post<any>(`${environment.apiUrl}/resource/delete`,
            { 'arr': this.selectedFiles }, this.httpOptions).
            subscribe(response => { this.deselectFiles(); });
    }

    addFile(data) {
        this.ldata = JSON.parse(localStorage.getItem('currentUser'));
        this.httpOptions = {
            headers: new HttpHeaders({
                'Authorization': 'Bearer ' + this.ldata.token
            })
        };

        return this._httpClient.post<any>(`${environment.apiUrl}/resource`, data, this.httpOptions);
    }



    editFile(data, id) {
        this.ldata = JSON.parse(localStorage.getItem('currentUser'));
        this.httpOptions = {
            headers: new HttpHeaders({
                'Authorization': 'Bearer ' + this.ldata.token,
            })
        };
        return this._httpClient.put<any>(`${environment.apiUrl}/resource/` + id, data, this.httpOptions);
    }


    getAudience() {
        this.ldata = JSON.parse(localStorage.getItem('currentUser'));
        this.httpOptions = {
            headers: new HttpHeaders({
                'Authorization': 'Bearer ' + this.ldata.token,
            })
        };
        return this._httpClient.get<any>(`${environment.apiUrl}/audience/`, this.httpOptions);
    }

    getTopics() {
        this.ldata = JSON.parse(localStorage.getItem('currentUser'));
        this.httpOptions = {
            headers: new HttpHeaders({
                'Authorization': 'Bearer ' + this.ldata.token,
            })
        };
        return this._httpClient.get<any>(`${environment.apiUrl}/topic/`, this.httpOptions);
    }

    getType() {
        this.ldata = JSON.parse(localStorage.getItem('currentUser'));
        this.httpOptions = {
            headers: new HttpHeaders({
                'Authorization': 'Bearer ' + this.ldata.token,
            })
        };
        return this._httpClient.get<any>(`${environment.apiUrl}/type/`, this.httpOptions);
    }


    addNewResourceFlag(flag) {
        return flag ? true : false;
    }

    getDeleteEditFile(url) {
        this.ldata = JSON.parse(localStorage.getItem('currentUser'));
        this.httpOptions = {
            headers: new HttpHeaders({
                'Accept': 'application/vnd.uploadcare-v0.5+json',
                'Authorization': 'Uploadcare.Simple 09ade3ff30785bdbeb04:c389646cdbfd85db498f'

            })
        };
        return this._httpClient.delete<any>(
            `https://api.uploadcare.com/files/${url}/`,
            this.httpOptions);


    }


}
