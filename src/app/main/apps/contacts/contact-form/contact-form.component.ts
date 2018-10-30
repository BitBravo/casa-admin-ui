import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup,Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { Contact } from 'app/main/apps/contacts/contact.model';
import {Router} from '@angular/router';

import { ContactsService } from '../contacts.service';
@Component({
    selector     : 'contacts-contact-form-dialog',
    templateUrl  : './contact-form.component.html',
    styleUrls    : ['./contact-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class ContactsContactFormDialogComponent
{
    action: string | 'edit';
    contact: Contact;
    contactForm: FormGroup;
    dialogTitle: string;
    register: string;
    userRoles:any;
    
      roles = [
                'admin',
                'super_admin'
              ];


    /**
     * Constructor
     *
     * @param {MatDialogRef<ContactsContactFormDialogComponent>} matDialogRef
     * @param _data
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        public matDialogRef: MatDialogRef<ContactsContactFormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _formBuilder: FormBuilder,
        private contactsService:ContactsService,
        private router:Router,
    )
    {
        // Set the defaults
        this.action = _data.action;

        if ( this.action === 'edit' )
        {
            this.dialogTitle = 'Edit Admin';
            this.contact = _data.contact;
        }
        else
        {
            this.dialogTitle = 'New Admin';
            this.contact = new Contact({});
        }

         if(!this.userRoles){
            contactsService.getRoles().subscribe((response)=>{
              this.userRoles =response["data"];});}



        this.contactForm = this.createContactForm();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create contact form
     *
     * @returns {FormGroup}
     */
    createContactForm(): FormGroup
    {
       return this._formBuilder.group({
           id : [this.contact.id],
           first_name    : [this.contact.first_name,[Validators.required]],
           last_name: [this.contact.last_name,[Validators.required]],
           email   : [this.contact.email,[Validators.required,Validators.email]],
           password :[this.contact.password,[Validators.required,Validators.minLength(6)]],
           customer_role:[this.contact.customer_role],
           role:[this.contact.role]
       });
   
    }

    addAdmin(contactForm)
    { 
     var response : any;
     this.contactsService.addAdmin(contactForm.value).
     subscribe(data => {this.matDialogRef.close();
                        this.contactsService.getContacts();}, 
         err => {
             this.register = err.error.message;
         }, 
         () => console.log('yay'));             
    }    


     updateAdmin(contactForm)
    {

     var response : any;
     this.contactsService.editAdmin(contactForm.value).
     subscribe(data => {this.matDialogRef.close();
                        this.contactsService.getContacts();}, 
         err => {
             this.register = err.error.message;
         }, 
         () => console.log('yay'));             
    }
}
