import { NgModule } from '@angular/core';
import { CustomerManagementComponent } from './customer-management/customer-management.component';
import { AddCustomerComponent } from './add-customer/add-customer.component';
import { SharedModule } from '../shared/shared.module';
import { SharedPaginationModule } from 'src/app/shared-components/shared-pagination/shared-pagination.module';
import { CustomerRoutingModule } from './customer-routing.module';
import { NgxLoadingModule } from 'ngx-loading';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { DropdownModule } from 'primeng/dropdown';
import { NgxSummernoteModule } from 'ngx-summernote';

@NgModule({
  declarations: [
    CustomerManagementComponent,
    AddCustomerComponent
  ],
  imports: [
    SharedModule,
    CustomerRoutingModule,
    SharedPaginationModule,
    NgxLoadingModule,
    FormsModule,
    NgSelectModule,
    DropdownModule,
    NgxSummernoteModule
  ],
  providers: [
    AddCustomerComponent
  ],
})
export class CustomerModule {}
