import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FuseAuthService } from '@fuse/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import {Router} from '@angular/router';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Response } from "@angular/http";
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

@Component({
    selector   : 'login',
    templateUrl: './login.component.html',
    styleUrls  : ['./login.component.scss'],
    animations : fuseAnimations
})

 
export class LoginComponent implements OnInit, OnDestroy
{
    loginForm: FormGroup;
    loginFormErrors: any;
    isLoginError : boolean = false;
    loginError:any;
    isLoggedIn:boolean = false;
    ;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private router:Router,
        private Service:FuseAuthService,
        private http: HttpClient
    )
    {
        let ldata = JSON.parse(localStorage.getItem('currentUser')); 
       
        

        // Set the defaults
        this.loginFormErrors = {
            email   : {},
            password: {}
        };

        // Set the private defaults
        this._unsubscribeAll = new Subject(); 

        if (ldata) {
            if(ldata.token!= ""){
                this.isLoggedIn = true;
                this.getRoute(ldata.userInfo    );
            } else {
                this.router.navigate(['/']);  
            }
        } else {
             this.router.navigate(['/']);  
        }
         
       
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {


        let ldata = JSON.parse(localStorage.getItem('currentUser')); 
       if(!ldata){
        this._fuseConfigService.config = {
            layout: {
                navbar : {
                    hidden: true
                },
                toolbar: {
                    hidden: true
                },
                footer : {
                    hidden: true
                }
            }
        };
    }
        this.loginForm = this._formBuilder.group({
            email   : ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });

        this.loginForm.valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.onLoginFormValuesChanged();

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

    getRoute(userInfo) {
        if (userInfo && userInfo.role =='super_admin'){
            this.router.navigate(['apps/dashboard']);
        } else if (userInfo && userInfo.role == 'admin'){
             let path = (this.router.url).split("/")[2];
             if (!path) path = 'external'
            this.router.navigate(['apps/'+path+ '/'+'file-manager']);
        } else {
          return false;
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * On form values changed
     */

     onSubmit(value)
     { 
        localStorage.removeItem('currentUser');

        this.Service.login(value.email,value.password) 
        .subscribe(
            data => { 
                let ldata = localStorage.getItem('currentUser');
                let resultData : any ={};
                
                resultData = data;

                if (resultData.status == 200 ) {
                    this.isLoggedIn = true;
                    this.getRoute(resultData.userInfo); }
                else    
                    this.loginError = "Invalid username or password";
            },
            error => { 
                this.loginError = "Invalid username or password";                   
            }
        );
           
     }


     logout() { // this is not in use
        localStorage.removeItem('currentUser');
        this.router.navigate(['login']);
     }




    onLoginFormValuesChanged(): void
    {
        for ( const field in this.loginFormErrors )
        {
            if ( !this.loginFormErrors.hasOwnProperty(field) )
            {
                continue;
            }

            // Clear previous errors
            this.loginFormErrors[field] = {};

            // Get the control
            const control = this.loginForm.get(field);

            if ( control && control.dirty && !control.valid )
            {
                this.loginFormErrors[field] = control.errors;
            }
        }
    }



    
}
