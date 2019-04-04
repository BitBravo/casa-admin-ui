import { Component, OnDestroy, OnInit, ViewEncapsulation,Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Router, NavigationEnd, ActivatedRoute} from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { FileManagerService } from 'app/main/apps/file-manager/file-manager.service';
import { ContactsContactFormDialogComponent } from 'app/main/apps/file-manager/contact-form/contact-form.component';
import { RolesService } from 'app/main/apps/roles/roles.service';
import { Location} from '@angular/common';


@Component({
    selector     : 'file-manager',
    templateUrl  : './file-manager.component.html',
    styleUrls    : ['./file-manager.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations,
    providers: [Location],
})

export class FileManagerComponent implements OnInit, OnDestroy
{
    navigationSubscription;
    list: boolean = true;
    showMenu:boolean = true;
    dialogRef:any;
    hasSelectedFiles: boolean | false;
    showAdd: boolean = true;
    add: boolean = false;
    searchInput: FormControl;
    location: Location;
    
    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     */
    constructor(
        private _fileManagerService: FileManagerService,
        private _fuseSidebarService: FuseSidebarService,
        private _matDialog: MatDialog,
        location: Location,
        private router:Router,
        private route:ActivatedRoute, 
    )

    {
       this.navigationSubscription = this.router.events.subscribe((e: any) => {
         // If it is a NavigationEnd event re-initalise the component
         if (e instanceof NavigationEnd) {
             this._fileManagerService.searchText = '';
             this._fileManagerService.origin = e.url.split("/")[3] ;
             this.showAdd = this._fileManagerService.origin != 'dynamic';

            Promise.all([
                this._fileManagerService.getFiles()
            ]).then(
                ([files]) => {

            if (this._fileManagerService.onSearchTextChanged.observers.length === 0) {      
               this._fileManagerService.onSearchTextChanged.subscribe(searchText => {
                        this._fileManagerService.searchText = searchText;
                        this._fileManagerService.getFiles();
                    });
            }
                    // resolve();
                },
                // reject
            ).catch((e) => console.log(e));

             this.initialiseInvites();
             }
         });


        // Set the defaults
        this.searchInput = new FormControl('');
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }



     initialiseInvites() {
        this.list = true;
        this.add = false;
        this.showMenu = true;
        this.showAdd = this._fileManagerService.origin !== 'dynamic';
        // Set default values and re-fetch any data you need.
     }


    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {        

        this._fileManagerService.onSelectedFilesChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selectedFiles => {
                this.hasSelectedFiles = selectedFiles.length > 0;
            });
        this.searchInput.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(300),
                distinctUntilChanged()
            )
            .subscribe(searchText => {
                this._fileManagerService.onSearchTextChanged.next(searchText);
            });
        this.list = true;
        this.add = false;
        this.showMenu = true;
        this.showAdd = this._fileManagerService.origin !== 'dynamic';
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
  
        if (this.navigationSubscription) {  
           this.navigationSubscription.unsubscribe();
       }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------
    newUpload() {
        this.list = false;
        this.add = true;
    }

    back() {
        this.list = true;
        this.router.navigate(['/apps/resources/' + this._fileManagerService.origin]);
    }

    listEditEventHander($event: any) {
        this.showAdd = false;
        this.showMenu = false;
    }

    /**
     * Toggle the sidebar
     *
     * @param name
     */
    toggleSidebar(name): void
    {
       // this._fuseSidebarService.getSidebar(name).toggleOpen();
    }
}
