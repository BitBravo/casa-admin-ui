import { Component, Inject, ViewEncapsulation, Input, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validator, Validators, FormArray } from '@angular/forms';
import { FileData } from 'app/main/apps/file-manager/file-manager.model';
import { FileManagerService } from 'app/main/apps/file-manager/file-manager.service';
import { RolesService } from 'app/main/apps/roles/roles.service';
import { MatButtonModule, MatDividerModule, MatFormFieldModule, MatIconModule, MatOptionModule, MatSelectModule, MatSlideToggleModule } from '@angular/material';
import { MatSnackBar } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { FuseUtils } from '@fuse/utils';
import { Router } from '@angular/router';

declare var jQuery: any;
@Component({
  selector: 'contacts-contact-form-dialog',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class ContactsContactFormDialogComponent implements OnInit {
  @ViewChild("cardImageSource") cardImageSource;
  @Input("content") content;
  @Output() nameEvent = new EventEmitter<string>();
  config = {
    allowedContent: true,
    extraPlugins: 'sourcedialog',
    toolbar: [
      { name: 'document', groups: ['mode', 'document', 'doctools'], items: ['Source'] },
      { name: 'clipboard', groups: ['clipboard', 'undo'], items: ['Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo'] },
      '/',
      { name: 'basicstyles', groups: ['basicstyles', 'cleanup'], items: ['Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'RemoveFormat'] },
      { name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align', 'bidi'], items: ['NumberedList', 'BulletedList', '-', '-', 'Blockquote', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-'] },
      { name: 'links', items: ['Link', 'Unlink', 'Anchor'] },
      { name: 'insert', items: ['Image', 'Table', 'HorizontalRule', 'PageBreak', 'Iframe'] },
      { name: 'styles', items: ['Styles', 'Format'] },
      { name: 'colors', items: ['', ''] },
      { name: 'tools', items: ['Maximize', ''] },
      { name: 'others', items: ['-'] },
      { name: 'about', items: [''] }
    ]
  };
  value: string = '';
  attachmentUrl: any = [];
  register: string;
  checking: boolean = false;
  exactSize: any = "";
  html: any = "";
  action: string | 'edit';
  fileManagerData: FileData;
  fileDataGroup: FormGroup;
  contactForm: FormGroup;
  origin: string | 'external';
  dialogTitle: string;
  uploadFile: File = null;
  disabled = true;
  selectedValue: string;
  chooseOption: string;
  hasDetails: boolean = true;
  isGated: any;
  publish: any;
  userRoles: any;
  dynamicTopics: any;
  dynamicAudience: any;
  dynamicType: any;
  multipleFile: any;
  uploaded_files: any[];
  errorMessage: any = "";
  progressBoolean: boolean = false;
  cardImage: string = "";
  edit: boolean = false;
  isMultiple: boolean = false;
  removeFlag = true;
  newcardimage: string;
  default_image: boolean;
  add_default_image: boolean = true;
  cta: any[] = [{
    cta_order: '0',
    cta_display: 'Casa',
    cta_url: 'www.casa.com',
    is_cta_url: false,
    is_cta_button: false
  }];
  selected = new FormControl(0);
  selectAfterAdding: boolean = false;
  /**
   * Constructor
   *
   * @param {MatDialogRef<ContactsContactFormDialogComponent>} matDialogRef
   * @param _data
   * @param {FormBuilder} _formBuilder
   */
  constructor(
    private _formBuilder: FormBuilder,
    private fileManagerService: FileManagerService,
    private rolesService: RolesService,
    private router: Router) {

    // Set the defaults
    // this.action = _data.action;
    this.multipleFile = [];
    if (this.action === 'edit') {
      this.dialogTitle = 'Edit Resource';
      // this.fileManagerData = _data.fileManagerData;
      this.hasDetails = false;
      this.checking = true;

    }
    else {
      this.dialogTitle = 'New Resource';
      this.fileManagerData = new FileData({});
      this.hasDetails = false;

    }
    this.origin = fileManagerService.origin;

    if (!this.userRoles) {
      rolesService.getRoles().then((data) => {
        this.userRoles = data;
      },
        () => console.log('failed to get roles'));
    }

    if (!this.dynamicAudience) {
      fileManagerService.getAudience().subscribe((response) => {
        this.dynamicAudience = response["data"];
      });
    }

    if (!this.dynamicType) {
      fileManagerService.getType().subscribe((response) => {
        this.dynamicType = response["data"];
      });
    }


    if (!this.dynamicTopics) {
      fileManagerService.getTopics().subscribe((response) => {
        this.dynamicTopics = response["data"];
      });
    }



    this.fileDataGroup = this.createFileForm();


  }


  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Create contact form
   *
   * @returns {FormGroup}
   */
  createFileForm(): FormGroup {
    return this._formBuilder.group({
      id: [this.fileManagerData._id],
      origin: [this.fileManagerData.origin, Validators.required],
      title: [this.fileManagerData.title, Validators.required],
      topics: [this.fileManagerData.topics],
      type: [this.fileManagerData.type],
      url: [this.fileManagerData.url],
      publish: [this.fileManagerData.publish],
      duration: [this.fileManagerData.duration],
      dateTime: [this.fileManagerData.dateTime],
      extraFiles: [this.fileManagerData.extraFiles],
      audience: [this.fileManagerData.audience],
      role: [this.fileManagerData.role],
      myFile: [this.fileManagerData.myFile],
      isGated: [this.fileManagerData.isGated],
      hasDetails: [this.fileManagerData.hasDetails],
      cardImage: [this.fileManagerData.cardImage],
      html: [this.fileManagerData.html],
      cardColumn: [this.fileManagerData.cardColumn],
      update_files: [this.fileManagerData.uploaded_files],
      cta: new FormArray(this.fileManagerData.cta.map((cta) => this.createCtaFormGroup(cta)))
    });
  }

  createCtaFormGroup(singleCta: any): FormGroup {
      return (new FormGroup({
        cta_url: new FormControl(singleCta.cta_url),
        is_cta_url: new FormControl(singleCta.is_cta_url),
        cta_display: new FormControl(singleCta.cta_display),
        cta_order: new FormControl(singleCta.cta_order),
        is_cta_button: new FormControl(singleCta.is_cta_button)
      }));
  }

  initCTA(): FormGroup {
    const controlArray = <FormArray> this.fileDataGroup.get('cta');
    const newCTA = {
      cta_order: controlArray.controls.length,
      cta_display: 'Casa',
      cta_url: 'www.casa.com',
      is_cta_url: false,
      is_cta_button: false,
    };
    return this.createCtaFormGroup(newCTA);
  }

  getCTAs(form) {
    return form.controls.cta.controls;
  }

  addTab(selectAfterAdding: boolean) {
    const control = <FormArray>this.fileDataGroup.get('cta');
    control.push(this.initCTA());

    if (selectAfterAdding) {
      this.selected.setValue(control.length - 1);
    }
  }

  removeTab(index: number) {
    const control = <FormArray>this.fileDataGroup.get('cta');
    control.removeAt(index);
  }

  onUploadCardImage(event) {
    if (this.cardImageSource != undefined) {
      let url = this.cardImageSource["nativeElement"]["src"];
      this.fileManagerService.getDeleteEditFile(url.split("/")[3]).subscribe((response) => {
        console.log("Data removed Successfully");
      });
    }
    this.cardImage = event["cdnUrl"];
    this.newcardimage = event["cdnUrl"];
    this.default_image = false;
    this.add_default_image = false;
    this.edit = true;
  }


  progressCardImage(event) {

  }

  onUpload(info) {
    this.isMultiple = true;
    let url = info["cdnUrl"].split("~");
    let total = url[1];
    for (let i = 0; i < parseInt(total.charAt(0)); i++) {
      this.attachmentUrl.push(info["cdnUrl"] + `nth/${i}/`);
    }
    this.progressBoolean = false;
  }

  onProgress(progress) {
    this.progressBoolean = true;
  }

  fileChanged(e) {
    this.uploadFile = e.target.files[0];
    var _size = this.uploadFile.size;
    var fSExt = new Array('Bytes', 'KB', 'MB', 'GB'),
      i = 0;
    while (_size > 900) { _size /= 1024; i++; }
    this.exactSize = (Math.round(_size * 100) / 100) + ' ' + fSExt[i];
  }

  multipleFileChanged(e) {
    for (let i = 0; i < e.target.files.length; i++) {
      this.multipleFile.push(e.target.files[i]);
    }
  }

  deleteMultipleFile(filename) {
    this.multipleFile.splice(this.multipleFile.indexOf(filename), 1);
  }

  removeChip(chip) { return true; }
  
  // for submittig into services of the fileUploads
  save(d) {

    let fd = new FormData();


    fd.append('title', d.value.title);
    fd.append("type", d.value.type);
    fd.append('origin', this.fileManagerService.origin);
    for (var i = 0; i < this.attachmentUrl.length; i++) {
      fd.append("uploaded_files[]", this.attachmentUrl[i]);
    }

    for (var i = 0; i < d.value.audience.length; i++) {
      fd.append("audience[]", d.value.audience[i]);
    }
    for (var i = 0; i < d.value.topics.length; i++) {
      fd.append('topics[]', d.value.topics[i]);
    }
    for (var i = 0; i < d.value.role.length; i++) {
      fd.append("role[]", d.value.role[i]);
    }

    fd.append('cta', JSON.stringify(d.value.cta));

    fd.append('isGated', d.value.isGated);
    fd.append('hasDetails', d.value.hasDetails);
    fd.append('html', d.value.html);
    fd.append('publish', d.value.publish);
    fd.append('url', d.value.url);
    fd.append('duration', d.value.duration);
    fd.append('cardImage', this.cardImage);
    fd.append('cardColumn', d.value.cardColumn);
    fd.append('default_image', `${this.add_default_image}`);
    this.fileManagerService.addFile(fd)
      .subscribe(
        value => {
          this.fileManagerService.getFiles().then(
            (data) => {
              this.nameEvent.emit('true');
              this.router.navigate(['/apps/resources/' + this.fileManagerService.origin]);
            }
          )
        },
        err => {

          this.errorMessage = err.message;
        }
      );
  }


  removeImage(cardImage) {

    this.edit = true;
    this.removeFlag = false;
    this.default_image = true;
    this.newcardimage = undefined;
    this.add_default_image = true;
    //this.removeCardImage(cardImage);

  }



  //for submittig into services of the fileUploads
  update(d, id) {

    if (!this.isMultiple && d.value.update_files.length > 0)
      this.attachmentUrl.push(d.value.update_files[0]['url']);
    if (!this.edit)
      this.cardImage = this.cardImageSource["nativeElement"]["src"];

    let fd = new FormData();
    fd.append("uploaded_files[]", this.attachmentUrl);
    fd.append('title', d.value.title);
    fd.append('default_image', `${this.default_image}`);
    fd.append("type", d.value.type);
    fd.append('origin', d.value.origin);
    for (var i = 0; i < d.value.audience.length; i++) {
      fd.append("audience[]", d.value.audience[i]);
    }
    for (var i = 0; i < d.value.topics.length; i++) {
      fd.append("topics[]", d.value.topics[i]);
    }
    for (var i = 0; i < d.value.role.length; i++) {
      fd.append("role[]", d.value.role[i]);
    }

    fd.append('cta', JSON.stringify(d.value.cta));

    fd.append('isGated', d.value.isGated);
    fd.append('hasDetails', d.value.hasDetails);
    fd.append('html', d.value.html);
    fd.append('publish', d.value.publish);
    fd.append('url', d.value.url);
    fd.append('duration', d.value.duration);
    fd.append('cardImage', this.cardImage);
    fd.append('cardColumn', d.value.cardColumn);
    /*
    if (this.uploadFile )
      fd.append('file',this.uploadFile,this.uploadFile.name);
*/
    this.fileManagerService.editFile(fd, id)
      .subscribe(value => {
        this.fileManagerService.getFiles().then(
          (data) => {
            this.nameEvent.emit('true');
            this.router.navigate(['/apps/resources/' + this.fileManagerService.origin]);
          }
        )
      },
        err => {


          var notify = jQuery.notify({
            title: "<strong>Success</strong><br>",
            message: "Account successfully created ",
          },
            {
              type: "info",
              delay: 6000
            }
          );
          console.log(err);
          this.errorMessage = err.message;
        }
      );
  }

  deleteFile() {
    this.uploadFile = null;

  }

  radioChanged(id) {
    this.hasDetails = id.checked;
  }


  resourceTypeChanged(event, id) {
    const controlArray = <FormArray> this.fileDataGroup.get('cta');
    controlArray.controls[id].get('is_cta_url').setValue(event.value);
  }

  ngOnInit() {
    if (this.content) {
      this.fileManagerData = this.content;
      this.uploaded_files = this.content.uploaded_files;
      this.checking = true;
      this.hasDetails = true;
    } else {
      this.hasDetails = false;
      this.fileManagerData = new FileData({});
    }
    this.fileDataGroup = this.createFileForm();

  }



}
