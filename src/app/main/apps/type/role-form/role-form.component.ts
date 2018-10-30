import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup,Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { Role } from 'app/main/apps/roles/role.model';
import {Router} from '@angular/router';

import { RolesService } from 'app/main/apps/type/roles.service';
@Component({
    selector     : 'roles-role-form-dialog',
    templateUrl  : './role-form.component.html',
    styleUrls    : ['./role-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class RolesRoleFormDialogComponent
{    
    exactSize:string;
    uploadFile:File=null;
    title:string="Type"
    action: string | 'edit';
    role: Role;
    roleForm: FormGroup;
    dialogTitle: string;
    register: string;
    default_image:string='';
    /**
     * Constructor
     *
     * @param {MatDialogRef<RolesRoleFormDialogComponent>} matDialogRef
     * @param _data
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        public matDialogRef: MatDialogRef<RolesRoleFormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _formBuilder: FormBuilder,
        private rolesService:RolesService,
        private router:Router,
    )
    {
        // Set the defaults
        this.action = _data.action;

        if ( this.action === 'edit' )
        {
            this.dialogTitle = 'Edit Type';
            this.role = _data.role;
            this.default_image =this.role["default_image"]; 
        }
        else
        {
            this.dialogTitle = 'New Type';
            this.role = new Role({});
        }

        this.roleForm = this.createRoleForm();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create role form
     *
     * @returns {FormGroup}
     */
    createRoleForm(): FormGroup
    {
       return this._formBuilder.group({
           id : [this.role.id],
           name : [this.role.name,[Validators.required]]
           
                 });
   
    }
    fileChanged(e)
    {
    console.log(e);
    this.uploadFile=e.target.files[0];
     var _size = this.uploadFile.size;
        var fSExt = new Array('Bytes', 'KB', 'MB', 'GB'),
        i=0;
        while(_size>900){_size/=1024;i++;}
         this.exactSize = (Math.round(_size*100)/100)+' '+fSExt[i];

    }

    deleteFile()
    {
        this.uploadFile=null;
    
    }
 

  
    addRole(roleForm)
    { 
       let  fd= new FormData();
     var response : any;
     if(this.uploadFile!=null)
     fd.append("file",this.uploadFile,this.uploadFile.name);
     fd.append("name",roleForm.value.name)
     this.rolesService.addRole(fd).
            subscribe(
	    	data => {this.matDialogRef.close();
                        this.rolesService.getRoles();}, 
	         err => {
	             this.register = err.error.message;
	         }, 
	         () => console.log('yay')); 
                   
     }    


     updateRole(roleForm)
    { 
     let  fd= new FormData();
     if(this.uploadFile!=null)
     fd.append("file",this.uploadFile,this.uploadFile.name);
     fd.append("name",roleForm.value.name);
     
     var response : any;
     this.rolesService.editRole(fd,roleForm.value).
            subscribe(
	    	data => {this.matDialogRef.close();
                        this.rolesService.getRoles();}, 
	         err => {
	             this.register = err.error.message;
	         });      
     }     
             

}