import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable()
export class PositionService {
    ldata: any = JSON.parse(localStorage.getItem('currentUser'));
    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    };

    constructor(
        private _httpClient: HttpClient
    ) { }

    // tslint:disable-next-line:typedef
    getResources() {
        this.ldata = JSON.parse(localStorage.getItem('currentUser'));
        this.httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.ldata.token
            })
        };
        return this._httpClient.get(`${environment.apiUrl}/resource?count=1000`, this.httpOptions);
    }

    // tslint:disable-next-line:typedef
    getResourcePositions() {
        this.ldata = JSON.parse(localStorage.getItem('currentUser'));
        this.httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.ldata.token
            })
        };
        return this._httpClient.get(`${environment.apiUrl}/resource/position`, this.httpOptions);
    }

    // tslint:disable-next-line:typedef
    updateResourcePositions(positions) {
        this.ldata = JSON.parse(localStorage.getItem('currentUser'));
        this.httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.ldata.token
            })
        };
        return this._httpClient.post(`${environment.apiUrl}/resource/position`, positions, this.httpOptions);
    }
}
