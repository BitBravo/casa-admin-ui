import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';

@Injectable()
export class AnalyticsDashboardService implements Resolve<any>
{
    widgets: any[];
    logins:any[];
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
    }

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
                this.getWidgets(),
                this.loginLogs()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get widgets
     *
     * @returns {Promise<any>}
     */
    getWidgets(): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.get('api/analytics-dashboard-widgets')
                .subscribe((response: any) => {
                    this.widgets = response;
                    resolve(response);
                }, reject);
        });
    }


    loginLogs()
    {

   }


    

   sendemail()
   { 
        this.ldata = JSON.parse(localStorage.getItem('currentUser'));
        this.httpOptions = {
           headers: new HttpHeaders({
                  'Content-Type':  'application/json',
                  'Authorization': "Bearer "+this.ldata.token
            })
        };
        return this._httpClient.get<any>(`${environment.apiUrl}/sendemail`,this.httpOptions);
   }

}
