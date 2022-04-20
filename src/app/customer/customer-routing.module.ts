import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerManagementComponent } from './customer-management/customer-management.component';
import { AddCustomerComponent } from 'src/app/customer/add-customer/add-customer.component';



const routes: Routes = [
  {path: '', component: CustomerManagementComponent},
  {path:'edit-customer/:id', component:AddCustomerComponent},
  {path:'add-customer', component:AddCustomerComponent},
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomerRoutingModule {}
