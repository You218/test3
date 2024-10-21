import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ScheduleReportModalComponent } from './schedule-report-modal/schedule-report-modal.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  constructor(private dialog: MatDialog) {}

  openScheduleReportModal(): void {
    const dialogRef = this.dialog.open(ScheduleReportModalComponent, {
      // width: '500px',
      height: '500px',
      data: {}
    });
  }
}
