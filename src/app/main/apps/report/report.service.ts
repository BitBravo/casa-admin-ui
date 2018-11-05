import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable()
export class ReportService {

    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    };

    constructor(
        private _httpClient: HttpClient
    ) { }

    public exportAsExcelFile(data: Object, excelFileName: string): void {
        const sheets = {};
        const sheetNames = [];
        // tslint:disable-next-line:forin
        for (const sheet in data) {
            const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data[sheet]);
            sheets[sheet] = worksheet;
            sheetNames.push(sheet);
        }
        const workbook: XLSX.WorkBook = { Sheets: sheets, SheetNames: sheetNames };
        const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array', cellStyles: true });
        // const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
        this.saveAsExcelFile(excelBuffer, excelFileName);
    }

    private saveAsExcelFile(buffer: any, fileName: string): void {
        const data: Blob = new Blob([buffer], {
            type: EXCEL_TYPE
        });
        FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
    }

    // tslint:disable-next-line:typedef
    getReports(filters, start, end) {
        this.httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
        console.log(start, end);
        return this._httpClient.get(`${environment.apiUrl}/histories?eventType=${filters}&start=${start}&end=${end}`, this.httpOptions);
    }

    // tslint:disable-next-line:typedef
    getReportsAggregated(filters, start, end) {
        this.httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
        return this._httpClient.get(`${environment.apiUrl}/histories/aggregated?eventType=${filters}&start=${start}&end=${end}`, this.httpOptions);
    }
}
