import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class CustomerService {


  private addCustomerUrl = environment.url + "/api/v1/customer/add_customer";
  private getCustomerListingUrl = environment.url + "/api/v1/customer/get_customer";
  private updateCustomerUrl = environment.url + "/api/v1/customer/update_customer/";
  // private getAllFaqsUrl = environment.url + "/api/v1/faqs/get_all_faqs";
   private deleteCustomerUrl = environment.url + "/api/v1/customer/delete_customer/";
   private getSingleCustomerUrl = environment.url + "/api/v1/customer/get_single_customer/";




  constructor(private http: HttpClient) { }
  getHeader(): HttpHeaders {
    let headers = new HttpHeaders({ 'x-auth-token': (localStorage.getItem('token') || "") });
    headers = headers.append('x-auth-api-key', environment.key);
    return headers;
  }
  addCustomer(data) {
    return this.http.post(this.addCustomerUrl, data, { 'headers': this.getHeader() });
  }
  getCustomerListing(data) {
    return this.http.post(this.getCustomerListingUrl, data, { 'headers': this.getHeader() });
  }

  updateCustomer(id, data) {
    return this.http.put(this.updateCustomerUrl + id, data, { 'headers': this.getHeader() });
  }
  // getAllFaqs(data) {
  //   return this.http.post(this.getAllFaqsUrl, data, { 'headers': this.getHeader() });
  // }
  deleteCustomer(id) {
    return this.http.delete(this.deleteCustomerUrl + id, { 'headers': this.getHeader() })
  }
  getSingleCustomer(id) {
    return this.http.get(this.getSingleCustomerUrl + id, { 'headers': this.getHeader() })
  }


}
