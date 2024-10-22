import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VehicleDataService } from 'src/app/vehicle.service';
import { ModalService } from 'src/app/Services/modal.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-schedule-report-modal',
  templateUrl: './schedule-report-modal.component.html',
  styleUrls: ['./schedule-report-modal.component.css']
})
export class ScheduleReportModalComponent implements OnInit {
  emails: string[] = [];
  vehicles: any[] = [];
  filteredVehicles: any[] = [];
  selectedVehicles: string[] = [];

  showVehicleList = false;
  isButtonVisible = false;
  buttonValue = '+Add';
  reportForm: FormGroup;
  selectedBranch: string = 'All Vehicles';

  constructor(
    private fb: FormBuilder,
    private modalService: ModalService,
    private vehicleService: VehicleDataService,
    @Inject(MatDialogRef) private dialogRef: MatDialogRef<ScheduleReportModalComponent>
  ) {
    this.reportForm = this.fb.group({
      fleet: [false],
      vehicle: [false],
      trip: [false],
      driving: [false],
      email: ['', [Validators.required, Validators.email]],
      vehicleSearch: [''],
      branch: [this.selectedBranch]
    });
  }

  ngOnInit(): void {
    this.vehicleService.getData().subscribe(data => {
      this.vehicles = data.vehicles;
      this.filteredVehicles = this.vehicles;
    });

    this.reportForm.get('vehicle')?.valueChanges.subscribe(value => {
      this.showVehicleList = value;
    });

    this.reportForm.get('vehicleSearch')?.valueChanges.subscribe(value => {
      console.log('Search input changed:', value);
      this.filteredVehicleList();
    });

    this.reportForm.get('branch')?.valueChanges.subscribe(value => {
      console.log('Branch selection changed:', value);
      this.filteredVehicleList();
    });

  }

  filteredVehicleList(): void {
    console.log('Vehicles for filtering:', this.vehicles);  // Check vehicle structure

    const vehicleSearch = this.reportForm.get('vehicleSearch')?.value.toLowerCase();
    const branch = this.reportForm.get('branch')?.value;

    this.filteredVehicles = this.vehicles.filter(vehicle => {
      console.log('Vehicle object:', vehicle);  // Check vehicle properties
      const matchesBranch = branch === 'All Vehicles' || vehicle.branch.toLowerCase() === branch.toLowerCase();
      const matchesSearch = !vehicleSearch || vehicle.registration_number.toLowerCase().includes(vehicleSearch);
      return matchesBranch && matchesSearch;
    });
  }


  onVehicleSelect(vehicle: any): void {
    vehicle.selected = !vehicle.selected;
    if (vehicle.selected) {
      this.selectedVehicles.push(vehicle.vin);
      console.log(this.selectedVehicles)
    } else {
      this.selectedVehicles = this.selectedVehicles.filter(vin => vin !== vehicle.vin);
    }
  }

  onCancel(): void {
    this.modalService.goToNextStep();
    this.dialogRef.close();
    this.reportForm.reset();
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
      console.log('Selected vehicles:', this.selectedVehicles);
      this.modalService.goToNextStep();
      this.dialogRef.close();
    }
  }
}
