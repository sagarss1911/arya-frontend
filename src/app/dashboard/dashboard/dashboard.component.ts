import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonHelper } from 'src/app/helpers/common.helper';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AuthService } from 'src/app/services/auth.service';
import { DashboardService } from 'src/app/services/dashboard.service';
import * as moment from 'moment';
import { Chart,registerables } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {

  overallAnaLoading: boolean = false;
 

  public modalRef: BsModalRef;
  constructor(private authservice: AuthService,private dashboardService : DashboardService) {
    Chart.register(...registerables);
   }

  ngOnInit(): void {
 
  }


}
