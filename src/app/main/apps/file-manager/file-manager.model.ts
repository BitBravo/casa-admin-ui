import { MatChipInputEvent } from '@angular/material';

import { FuseUtils } from '@fuse/utils';

export class FileData {
    _id: string;
    origin: string;
    title: string;
    topics: string[];
    myFile: string;
    dateTime: string;
    url: string;
    type: string;
    audience: string[];
    role: string[];
    file: File;
    duration: string;
    slug: string;
    extraFiles: File[];
    publish: boolean;
    hasDetails: boolean;
    isGated: boolean;
    isProtected: boolean;
    password: string;
    confirmPassword: string;
    cardImage: string;
    html: any;
    uploaded_files: any;
    is_cta_button: boolean;
    cta_display: string;
    is_cta_url: boolean;
    cta_url: string;
    cardColumn: boolean;
    cta: [Object];
    ogDescription: string;
    constructor(fileData) {

        this._id = fileData._id || '';
        this.origin = fileData.origin || 'external';
        this.title = fileData.title || '';
        this.topics = fileData.topics || [];
        this.dateTime = fileData.dateTime || '';
        this.url = fileData.url || '';
        this.type = fileData.type;
        this.audience = fileData.audience || [];
        this.role = fileData.role || [];
        this.duration = fileData.duration;
        this.extraFiles = fileData.extraFiles || [];
        this.publish = fileData.publish || false;
        this.isGated = fileData.isGated || false;
        this.isProtected = fileData.isProtected || false;
        this.password = fileData.password || '';
        this.confirmPassword = fileData.confirmPassword || '';
        this.hasDetails = fileData.hasDetails || false;
        this.cardImage = fileData.cardImage || 'image';
        this.html = fileData.html;
        this.uploaded_files = fileData.uploaded_files || [];
        this.cardColumn = fileData.cardColumn || false;
        this.cta = fileData.cta ? fileData.cta : [{
            cta_order: '0',
            cta_display: 'Casa',
            cta_url: 'www.casa.com',
            is_cta_url: false,
            is_cta_button: false,
          }];
        this.ogDescription = fileData.ogDescription || '';
}

    addTag(event: MatChipInputEvent): void {
        const input = event.input;
        const value = event.value;

        // Add tag
        if (value) {
            this.audience.push(value);
        }

        // Reset the input value
        if (input) {
            input.value = '';
        }
    }

    removeTag(aud): void {
        const index = this.audience.indexOf(aud);

        if (index >= 0) {
            this.audience.splice(index, 1);
        }
    }


    //topics

    addTopic(event: MatChipInputEvent): void {
        const input = event.input;
        const value = event.value;

        // Add topic
        if (value) {
            this.topics.push(value);
        }

        // Reset the input value
        if (input) {
            input.value = '';
        }
    }

    removeTopic(top): void {
        const index = this.topics.indexOf(top);

        if (index >= 0) {
            this.topics.splice(index, 1);
        }
    }

    // role 
    addRole(event: MatChipInputEvent): void {
        const input = event.input;
        const value = event.value;

        // Add topic
        if (value) {
            this.role.push(value);
        }

        // Reset the input value
        if (input) {
            input.value = '';
        }
    }

    removeRole(rol): void {
        const index = this.role.indexOf(rol);

        if (index >= 0) {
            this.topics.splice(index, 1);
        }
    }



}

