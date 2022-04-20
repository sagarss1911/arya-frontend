import { Component, OnInit, ViewChild } from '@angular/core';
import { CustomerService } from 'src/app/services/customer.service';
import { CommonHelper } from 'src/app/helpers/common.helper';
import { ToastMessageService } from 'src/app/services/toast-message.service';
import { remove } from 'lodash-es';
import { Subscription, Subject } from 'rxjs';
import { environment } from "src/environments/environment";
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { ConfirmationModalComponent } from 'src/app/modals/confirmation-modal/confirmation-modal.component';
@Component({
  selector: 'customer-management',
  templateUrl: './customer-management.component.html',
  styleUrls: ['./customer-management.component.css']
})
export class CustomerManagementComponent implements OnInit {
  public loading: boolean = false;

  public filters:any = {};
  public slider_obj: any = {}

  base_url = environment.url;
  public dialogType: string = "add";


  public paginationValues: Subject<any> = new Subject();
  public table_data: any[] = [];

  public recordLimit: number = 10;
  public modalRef: BsModalRef;
  constructor(private customerService: CustomerService, private commonHelper: CommonHelper,
    private _toastMessageService: ToastMessageService, private modalService: BsModalService,private router : Router) {
  }

  ngOnInit(): void {
    this.getSlidersWithFilters({ page: 1 });

  }

  getSlidersWithFilters(event) {
    this.loading = true;
    return new Promise((resolve, reject) => {
      let params = {
        page: event.page,
        limit: event.limit ? event.limit : this.recordLimit
      };
      this.recordLimit = params.limit;
      if(this.filters.searchtext) {
        params["searchtext"] = this.filters.searchtext;
      }
      this.customerService.getCustomerListing(params).subscribe((res: any) => {

        if (res.status == 200 && res.data.slides) {
          this.table_data = [];

          this.table_data = JSON.parse(JSON.stringify(res.data.slides));
          // this.table_data.forEach(element => {
          //   element.collections = element.collections.map((a) => { return a.name })
          //   element.category = element.category.map((a) => { return a.name })

          // });
          this.paginationValues.next({ type: 'page-init', page: params.page, totalTableRecords: res.data.total_count });
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


  onClickAddCustomer() {
    this.router.navigate(['/customer/add-customer']);
  }
  onClickEditSlider(slider) {

    this.router.navigate(['/customer/edit-customer/'+slider.id]);
  }
  onClickDeleteSlider(slider) {
    this.modalRef = this.modalService.show(ConfirmationModalComponent, { class: 'confirmation-modal', backdrop: 'static', keyboard: false });
    this.modalRef.content.decision = '';
    this.modalRef.content.confirmation_text = "Are you sure to delete this?"
    var tempSubObj: Subscription = this.modalService.onHide.subscribe(() => {
      if (this.modalRef.content.decision == "done") {
        this.loading = true;
        this.customerService.deleteCustomer(slider.id).subscribe((res: any) => {
          this.loading = false;
          if (res.status == 200) {
            remove(this.table_data, (ub: any) => ub.id == slider.id);
            this._toastMessageService.alert("success", "Customer deleted successfully.");
          }
        }, (error) => {
          this.loading = false;
          this.commonHelper.showError(error);
        });
      }
      tempSubObj.unsubscribe();
    });
  }

}
