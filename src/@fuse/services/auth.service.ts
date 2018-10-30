import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Response } from "@angular/http";
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment';

@Injectable()
export class FuseAuthService {

    constructor(private http: HttpClient) { }
    
    login(email: string, password: string) {  
          const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'my-auth-token'
      })
    };
    return this.http.post<any>(`${environment.apiUrl}/login`, { "email": email, "password": password },httpOptions)
            .pipe(map(user => {
                // login successful if there's a jwt token in the response 
                if (user) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user));
                }
 
                return user;
            }));
    }

     logout() {  
      return  this.http.get<any>(`${environment.apiUrl}/logout`);
    }

 
 
  
}