import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VehicleDataService } from 'src/app/vehicle.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-schedule-report-modal',
  templateUrl: './schedule-report-modal.component.html',
  styleUrls: ['./schedule-report-modal.component.css']
})
export class ScheduleReportModalComponent implements OnInit {

  emails: string[] = [];
  vehicles: any[] = [];
  selectedVehicles: string[] = [];
  showVehicleList = false;
  isButtonVisible = false;
  buttonValue = '+Add';
  reportForm: FormGroup;

  constructor(private fb: FormBuilder, private vehicleService: VehicleDataService, @Inject(MatDialogRef) private dialogRef: MatDialogRef<ScheduleReportModalComponent>) {
    this.reportForm = this.fb.group({
      fleet: [false],
      vehicle: [false],
      trip: [false],
      driving: [false],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    this.vehicleService.getData().subscribe(data => {
      this.vehicles = data.vehicles;
      console.log('Vehicle data:', this.vehicles);
    });

    this.reportForm.get('vehicle')?.valueChanges.subscribe(value => {
      this.showVehicleList = value;
      console.log('Vehicle checkbox value:', value);
    });
  }

  onCancel(): void {
    this.reportForm.reset();
     this.dialogRef.close();
  }

  onButtonClickVisible(): void {
    this.isButtonVisible = !this.isButtonVisible;
    this.buttonValue = this.isButtonVisible ? 'Cancel' : '+Add';
  }

  addEmail(): void {
    const emailControl = this.reportForm.get('email');
    if (emailControl?.valid && this.emails.length < 5) {
      this.emails.push(emailControl.value);
      emailControl.reset();
    }
  }

  removeEmail(index: number): void {
    if (index > -1 && index < this.emails.length) {
      this.emails.splice(index, 1);
    }
  }

  isNextButtonEnabled(): boolean {
    return this.reportForm.valid && this.emails.length > 0;
  }

  onNext(): void {
    if (this.isNextButtonEnabled()) {
      console.log('Proceeding to the next step with form data:', this.reportForm.value);
      console.log('Selected emails:', this.emails);
    }
  }

}
