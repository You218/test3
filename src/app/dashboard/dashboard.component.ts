import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ScheduleReportModalComponent } from './schedule-report-modal/schedule-report-modal.component';
import { SecondModalComponent } from './second-modal/second-modal.component';
import { ModalService } from '../Services/modal.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  currentStep: number = 1;

  constructor(private dialog: MatDialog, private modalService: ModalService) {}

  ngOnInit() {
    this.modalService.currentStep$.subscribe(step => {
      this.currentStep = step;
      this.openModal(step);
    });
  }

  openModal(step: number) {
    if (step === 1) {
      this.dialog.open(ScheduleReportModalComponent,{
        height: '600px',
        width: '670px',
      });
    } else if (step === 2) {
      this.dialog.open(SecondModalComponent);
    }
  }
}
