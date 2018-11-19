import { Component, OnDestroy, ChangeDetectorRef, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject, Observable } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { PositionService } from 'app/main/apps/position/position.service';
import { map, startWith } from 'rxjs/operators';


@Component({
    selector: 'position',
    templateUrl: './position.component.html',
    styleUrls: ['./position.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class PositionComponent implements OnInit, OnDestroy {
    dialogRef: any;
    // hasSelectedPosition: boolean;
    // searchInput: FormControl;
    // selectedOptions: any = [];
    // startDate: any;
    // endDate: any;

    positionSelects = [new FormControl(), new FormControl(), new FormControl(), new FormControl(), new FormControl(), new FormControl(), new FormControl()];
    resources: object[] = [];
    filteredOptions: Array<Observable<object[]>> = [];
    // Private
    private _unsubscribeAll: Subject<any>;

    constructor(
        private _positionService: PositionService,
        private _cdr: ChangeDetectorRef
    ) {
        this._unsubscribeAll = new Subject();
    }


    ngOnInit() {
        this._positionService.getResources().subscribe(resources => {
            resources['data'].forEach(resource => {
                this.resources.push({ id: resource._id, title: resource.title });
            });
            this._positionService.getResourcePositions().subscribe((positions: Array<object>) => {
                positions.forEach(p => {
                    if (p['resource_id']) {
                        this.positionSelects[p['position']].setValue(this.resources.filter(option => option['id'] === p['resource_id'])[0]['title']);
                    }
                });
            });
            this._cdr.detectChanges();
        });

        for (let i = 0; i < this.positionSelects.length; i++) {
            this.filteredOptions[i] = this.positionSelects[i].valueChanges
                .pipe(
                    startWith(''),
                    map(value => this._filter(value))
                );
        }
    }

    private _filter(value: string): object[] {
        const filterValue = value.toLowerCase();
        return this.resources.filter(option => option['title'].toLowerCase().includes(filterValue));
    }

    public update() {
        const positions = [];
        this.positionSelects.forEach((p, index) => {
            const listCopy = Object.assign([], this.resources);
            const resource = listCopy.filter(option => option['title'] === p.value)[0];
            positions[index] = { position: index, resource_id: resource ? resource['id'] : null };
        });
        this._positionService.updateResourcePositions(positions).subscribe(result => {
            console.log(result);
        });
    }


    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}
