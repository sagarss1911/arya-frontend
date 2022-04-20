import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from "src/environments/environment";
import { DomSanitizer } from '@angular/platform-browser';
import { CustomerService } from 'src/app/services/customer.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CommonHelper } from 'src/app/helpers/common.helper';
import { ToastMessageService } from 'src/app/services/toast-message.service';
import { ActivatedRoute, Router } from '@angular/router';
import { findIndex } from 'lodash-es';

@Component({
  selector: 'edit-customer',
  templateUrl: './edit-customer.template.html',
  styleUrls: ['./edit-customer.component.css']
})

export class EditCustomerComponent implements OnInit {
  product: any = { colors: [] };
  customer:any = [];
  disableButton = false;
  base_url = environment.url;
  loading: boolean = false;
  collection_data = [];
  marital_status_option = ['married', 'unmarried', 'divorced', 'widowed'];
  urls = [];
  already_uploadedurls = [];
  remaining_url = []
  uploaded_files = [];
  category_data = []
  color_data = []
  thickness_data = []
  length_data = []
  files = []
  material_data = []
  type = "add";
  imgclr = false;
  err=false;
  maxDate: Date;
  config = {
    placeholder: '',
    tabsize: 2,
    height: '200px',
    uploadImagePath: '/api/upload',
    toolbar: [
      ['misc', ['codeview', 'undo', 'redo']],
      ['style', ['bold', 'italic', 'underline', 'clear']],
      ['font', ['bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript', 'clear']],
      ['fontsize', ['fontsize']],
      ['para', ['style', 'ul', 'ol', 'paragraph', 'height']],
      ['insert', ['table', 'hr']]
    ],
    fontNames: ['Helvetica', 'Arial', 'Arial Black', 'Comic Sans MS', 'Courier New', 'Roboto', 'Times']
  }
  @ViewChild('customerImageFile') customerImageFile: any;
  @ViewChild('pancardImageFile') pancardImageFile: any;
  @ViewChild('aadharcardImageFile') aadharcardImageFile: any;
  @ViewChild('residentialLatestBillImageFile') residentialLatestBillImageFile: any;
  @ViewChild('propertyTaxReceiptImageFile') propertyTaxReceiptImageFile: any;
  public modalRef: BsModalRef;
  constructor(private router: Router, private activatedRoute: ActivatedRoute, private customerService: CustomerService, private _toastMessageService: ToastMessageService, private modalService: BsModalService, private sanitizer: DomSanitizer, private commonHelper: CommonHelper) {
  }

  ngOnInit() {
    this.maxDate = new Date();
    this.product.id = this.activatedRoute.snapshot.paramMap.get('id') ? this.activatedRoute.snapshot.paramMap.get('id') : "";

    if (this.product.id) {
      this.type = 'edit';
    }
    if(this.product.id){
      this.getEditedData()
    }
  }

  getEditedData() {
    this.loading = true;
    return new Promise((resolve, reject) => {
      this.customerService.getSingleCustomer(this.product.id).subscribe((res: any) => {
        if (res.status == 200 && res.data) {
          this.customer = res.data
          this.customer.customerImageUrlExisting = this.customer.passport_photo
          this.customer.propertyTaxtReceptImageUrlExisting = this.customer.property_tax_receipt
          this.customer.residentialImageUrlExisting = this.customer.residential_latest_bill
          this.customer.aadharImageUrlExisting = this.customer.aadhar_card
          this.customer.pancardImageUrlExisting = this.customer.pan_card
          this.customer.birthdate = new Date(this.customer.birthdate)

        }else if(res.status == 400){
          this._toastMessageService.alert("error",res.data.msg);
        }
        this.loading = false;
        return resolve(true);
      }, (error) => {
        this.loading = false;
        this.commonHelper.showError(error);
        return resolve(false);
      })
    });
  }
  onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        this.files.push({ file: event.target.files[i], type: "optional" })
        var reader = new FileReader();
        reader.onload = (event: any) => {
          this.urls.push({ url: event.target.result });
        }
        reader.readAsDataURL(event.target.files[i]);
      }
      this.err=false;
    }
  }
  clearOptionalFile(i) {
    this.files[i].isdelete = 1
    this.urls[i].isdelete = 1
    let a= this.urls.filter(fl => { return !fl.isdelete })
    if(a.length > 0){
      this.err=true;
    }
  }

  clearAlreadyUploadedFile(image) {
    let findI = findIndex(this.already_uploadedurls, v => { return v.baseimage == image })
    if (findI != -1) {
      this.already_uploadedurls[findI].isdelete = 1;
    }
    this.remaining_url = this.already_uploadedurls.filter(fl => { return !fl.isdelete }).map((a) => { return a.baseimage })
  }

  generateSlug(event) {
    this.product.slug = event.target.value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
  }
  onCLUpload(event) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      this.customer.customerImageUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(event.target.files[0]));
      this.customer.customerImageFile = event.target.files[0]
      this.customer.newImageUploaded = true;
    }
  }
  clearCLFile() {
    this.customerImageFile.nativeElement.value = '';
    this.customer.customerImageUrl = '';
    this.customer.customerImageFile = null;
    this.customer.newImageUploaded = false;
  }
  onPanCLUpload(event) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      this.customer.pancardImageUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(event.target.files[0]));
      this.customer.pancardImageFile = event.target.files[0]
      this.customer.newImageUploaded = true;
    }
  }
  panClearCLFile() {
    this.pancardImageFile.nativeElement.value = '';
    this.customer.pancardImageUrl = '';
    this.customer.pancardImageFile = null;
    this.customer.newImageUploaded = false;
  }

  onAadharCLUpload(event) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      this.customer.aadharImageUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(event.target.files[0]));
      this.customer.aadharcardImageFile = event.target.files[0]
      this.customer.newImageUploaded = true;
    }
  }
  aadharClearCLFile() {
    this.aadharcardImageFile.nativeElement.value = '';
    this.customer.aadharImageUrl = '';
    this.customer.aadharcardImageFile = null;
    this.customer.newImageUploaded = false;
  }

  onResidentialBillCLUpload(event) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      this.customer.residentialImageUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(event.target.files[0]));
      this.customer.residentialLatestBillImageFile = event.target.files[0]
      this.customer.newImageUploaded = true;
    }
  }
  residentialBillClearCLFile() {
    this.residentialLatestBillImageFile.nativeElement.value = '';
    this.customer.residentialImageUrl = '';
    this.customer.residentialLatestBillImageFile = null;
    this.customer.newImageUploaded = false;
  }

  onPropertyTaxCLUpload(event) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      this.customer.propertyTaxtReceptImageUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(event.target.files[0]));
      this.customer.propertyTaxReceiptImageFile = event.target.files[0]
      this.customer.newImageUploaded = true;
    }
  }
  propertyTaxClearCLFile() {
    this.propertyTaxReceiptImageFile.nativeElement.value = '';
    this.customer.propertyTaxtReceptImageUrl = '';
    this.customer.propertyTaxReceiptImageFile = null;
    this.customer.newImageUploaded = false;
  }
  onClickCancel() {
    this.router.navigate(['/customer']);
  }
  onClickSave() {
    this.disableButton = true
    this.loading = true;
    const data = new FormData();
    if (this.customer.customerImageFile) {
      data.append('passport_photo', this.customer.customerImageFile);
    }
    if (this.customer.pancardImageFile) {
      data.append('pan_card', this.customer.pancardImageFile);
    }
    if (this.customer.aadharcardImageFile) {
      data.append('aadhar_card', this.customer.aadharcardImageFile);
    }
    if (this.customer.residentialLatestBillImageFile) {
      data.append('residential_latest_bill', this.customer.residentialLatestBillImageFile);
    }
    if (this.customer.propertyTaxReceiptImageFile) {
      data.append('property_tax_receipt', this.customer.propertyTaxReceiptImageFile);
    }
    let params = {
      name: this.customer.name,
      address: this.customer.address,
      office_address: this.customer.office_address,
      birthdate: this.customer.birthdate,
      mobile_no: this.customer.mobile_no,
      email: this.customer.email,
      education: this.customer.education,
      experience: this.customer.experience,
      marital_status: this.customer.marital_status,
      spouse_name: this.customer.spouse_name,
      mother_name: this.customer.mother_name,
      notes: this.customer.notes,
      uploaded_files: this.uploaded_files,
      remaining_url: this.remaining_url
    }
    data.append("body", JSON.stringify(params));

    this.customerService.updateCustomer(this.product.id,data).subscribe((res: any) => {
      if (res.status == 200 && res.data) {
        this._toastMessageService.alert("success", "Customer Updated successfully.");
        this.router.navigate(['/customer']);
      }
      this.loading = false;
      this.disableButton = false
    }, (error) => {
      this.loading = false;
      this.commonHelper.showError(error);
      this.disableButton = false
    })

    this.loading = false;
  }
}
