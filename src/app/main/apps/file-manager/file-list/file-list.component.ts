import { ViewChild,Component, OnDestroy, OnInit,OnChanges,Input, Output,EventEmitter} from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { Observable, Subject,merge,BehaviorSubject } from 'rxjs';
import { takeUntil,map,debounceTime,distinctUntilChanged } from 'rxjs/operators';
import { MatDialog, MatDialogRef } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { FormGroup } from '@angular/forms';
import { Router,NavigationEnd} from '@angular/router';
import { FuseUtils } from '@fuse/utils';
import { FileManagerService } from 'app/main/apps/file-manager/file-manager.service';
import { ContactsContactFormDialogComponent } from 'app/main/apps/file-manager/contact-form/contact-form.component';
import {MatSort,MatPaginator} from '@angular/material';
@Component({
    selector   : 'file-list',
    templateUrl: './file-list.component.html',
    styleUrls  : ['./file-list.component.scss'],
    animations : fuseAnimations
})
export class FileManagerFileListComponent implements OnInit, OnDestroy
{
    @Output() listEditEvent = new EventEmitter<string>();
    @ViewChild(MatSort) sort:MatSort;
    @ViewChild(MatPaginator) paginator:MatPaginator;
    navigationSubscription;
    files: any;
    dataSource: FilesDataSource | null;
    displayedColumns = ['checkbox', 'title', 'type', 'is_gated', 'is_published', 'duration', 'buttons'];
    selectedFiles: any;
    checkboxes: {};
    dialogRef: any;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    // Private
    private _unsubscribeAll: Subject<any>;
    public device: any = [];
    list:boolean =true;
    selectedFile:any;
    /**
     * Constructor
     *
     * @param {FileManagerService} _fileManagerService
     * @param {FuseSidebarService} _fuseSidebarService
     */
     constructor(
        private _fileManagerService: FileManagerService,
        private _fuseSidebarService: FuseSidebarService,
        public _matDialog: MatDialog,
        private router: Router,
        )
     {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
        this.navigationSubscription = this.router.events.subscribe((e: any) => {
         // If it is a NavigationEnd event re-initalise the component
         if (e instanceof NavigationEnd) {
             this.initialiseInvites();
             }
         });
        
    }

    // handling reclick of same menu reloading
    initialiseInvites() {
        this.list = true;
     }


     // event handler from child to show list or not.
    nameEventHander($event: any) {
        this.list = $event;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
     ngOnInit(): void
     {
         
        this.dataSource = new FilesDataSource(this._fileManagerService,this.paginator,this.sort);
        this._fileManagerService.onFilesChanged
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(files => {
            if (files.length>0) {
              this.files = files;
              this.checkboxes = {};
              files.map(file => {
                this.checkboxes[file._id] = false;
            });
          }
      });

        this._fileManagerService.onSelectedFilesChanged
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(selectedFiles => {
            for ( const id in this.checkboxes )
            {
                if ( !this.checkboxes.hasOwnProperty(id) )
                {
                    continue;
                }

                this.checkboxes[id] = selectedFiles.includes(id);
            }
            this.selectedFiles = selectedFiles;
        });

    }



    onChangetoggle(event , id ) {
      event.stopPropagation();
      this._fileManagerService.editFile({publish :'true'} , id).subscribe((resolve)=>{
        this._fileManagerService.getFiles();
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


    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * On select
     *
     * @param selected
     */
     onSelect(selectedFile): void
     {
        this.listEditEvent.emit('false');
       
        this.selectedFile=selectedFile;
        this.list =false;
    }
        
        

    /**
     * Delete File
     */
     deleteFile(file): void
     {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });
        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';
        this.confirmDialogRef.afterClosed().subscribe(result => {
            if ( result )
            {
                this._fileManagerService.deleteFile(file).subscribe((resolve)=>{
                });
            }
            this.confirmDialogRef = null;
        });
        
    }
    
   /**
     * On selected change
     *
     * @param roleId
     */
     onSelectedChange(fileId): void
     {
        this._fileManagerService.toggleSelectedFile(fileId);
    }
    
    ToggleSidebar(name): void
    {
        this._fuseSidebarService.getSidebar(name).toggleOpen();
    }

}

export class FilesDataSource extends DataSource<any>
{

    private _filterChange = new BehaviorSubject('');
    private _filteredDataChange = new BehaviorSubject('');
    /**
     * Constructor
     *
     * @param {FileManagerService} _fileManagerService
     */
     constructor(
        private _fileManagerService: FileManagerService,
        private _matPaginator: MatPaginator,
        private sort:MatSort)
     {
        super();
      
        this.filteredData = this._fileManagerService.files;
    }

    /**
     * Connect function called by the table to retrieve one stream containing the data to render.
     *
     * @returns {Observable<any[]>}
     */
     connect(): Observable<any[]>
     {
   
        const displayDataChanges = [
            this._fileManagerService.onFilesChanged,
            this.sort.sortChange,
            this._matPaginator.page,
            this._filterChange,
            
        ];

        return merge(...displayDataChanges)
        .pipe(
            map(()=>{

                   let data = this._fileManagerService.files.slice();
                   data = this.filterData(data);
                   data = this.sortData(data); 
                   this.filteredData = [...data];
                   const startIndex = this._matPaginator.pageIndex * this._matPaginator.pageSize;
                   return data.splice(startIndex, this._matPaginator.pageSize);
                   
            }));
   }

    /**
     * Disconnect
     */


     get filteredData(): any
     {
         return this._filteredDataChange.value;
     }

     set filteredData(value: any)
     {
         this._filteredDataChange.next(value);
     }

     // Filter
     get filter(): string
     {
         return this._filterChange.value;
     }

     set filter(filter: string)
     {
         this._filterChange.next(filter);
     }

     // -----------------------------------------------------------------------------------------------------
     // @ Public methods
     // -----------------------------------------------------------------------------------------------------

     /**
      * Filter data
      *
      * @param data
      * @returns {any}
      */
     filterData(data): any
     {
         if ( !this.filter )
         {
             return data;
         }
         return FuseUtils.filterArrayByString(data, this.filter);
     }

    sortData(data): any[]
    {
        if ( !this.sort.active || this.sort.direction === '' )
        {
            return data;
        }

        return data.sort((a, b) => {
            let propertyA: number | string = '';
            let propertyB: number | string = '';

            switch ( this.sort.active )
            {
                case 'title':
                    [propertyA, propertyB] = [a.title, b.title];
                    break;
                case 'type':
                    [propertyA, propertyB] = [a.type, b.type];
                    break;
                case 'duration':
                    [propertyA, propertyB] = [a.duration, b.duration];
                    break;
                case 'is_gated':
                    [propertyA, propertyB] = [a.isGated, b.isGated];
                    break;
                                

            }

            const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
            const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

            return (valueA < valueB ? -1 : 1) * (this.sort.direction === 'asc' ? 1 : -1);
        });
    }



     disconnect(): void
     {
     }
     ngOnChanges()
     {

     }
 }
