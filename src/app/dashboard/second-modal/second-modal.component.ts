import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-second-modal',
  templateUrl: './second-modal.component.html',
  styleUrls: ['./second-modal.component.css']
})
export class SecondModalComponent implements OnInit {
  scheduleForm: FormGroup;
  today: Date = new Date();
  timeIntervals = ['Weekly', 'Every 2 weeks', 'Monthly', 'Quarterly', 'Yearly'];
  weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  monthDays = Array.from({ length: 28 }, (_, i) => i + 1);
  quarterlyOptions = ['Last day of the completed quarter', 'First day of the next quarter', 'Custom'];
  yearlyOptions = ['Last day of the year', 'First day of the next year', 'Custom'];
  minDate: Date;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<SecondModalComponent>
  ) {
    const currentDate = new Date();
    this.minDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());

    this.scheduleForm = this.fb.group({
      reportTypes: ['', Validators.required],
      vehicles: ['', Validators.required],
      mailedTo: ['', [Validators.required, Validators.email]],
      setTime: ['09:30', Validators.required],
      timeFormat: ['AM', Validators.required],
      skipWeekends: [true],
      timeInterval: ['Weekly', Validators.required],
      weeklyDay: ['Monday'],
      monthlyDay: [1],
      quarterlyOption: ['Last day of the completed quarter'],
      yearlyOption: ['Last day of the year'],
      customDate: ['']
    });
  }

  ngOnInit(): void {}

  selectDay(day: string) {
    this.scheduleForm.patchValue({ weeklyDay: day });
  }

  // Increment time by 1 minute
  incrementTime(): void {
    let [hours, minutes] = this.scheduleForm.get('setTime')?.value.split(':').map(Number);
    minutes++;
    if (minutes === 60) {
      minutes = 0;
      hours++;
    }

    if (hours === 12 && this.scheduleForm.get('timeFormat')?.value === 'AM') {
      this.scheduleForm.patchValue({ timeFormat: 'PM' });
    } else if (hours === 12 && this.scheduleForm.get('timeFormat')?.value === 'PM') {
      this.scheduleForm.patchValue({ timeFormat: 'AM' });
    }

    if (hours > 12) {
      hours = 1; // Reset to 1 after 12
    }

    this.updateTime(hours, minutes);
  }

  // Decrement time by 1 minute
  decrementTime(): void {
    let [hours, minutes] = this.scheduleForm.get('setTime')?.value.split(':').map(Number);
    minutes--;
    if (minutes === -1) {
      minutes = 59;
      hours--;
    }

    if (hours === 0) {
      hours = 12;
      this.scheduleForm.patchValue({
        timeFormat: this.scheduleForm.get('timeFormat')?.value === 'AM' ? 'PM' : 'AM'
      });
    }

    if (hours < 1) {
      hours = 12;
    }

    this.updateTime(hours, minutes);
  }

  // Helper to update time in form with proper format
  updateTime(hours: number, minutes: number): void {
    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    this.scheduleForm.patchValue({ setTime: formattedTime });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onDone(): void {
    if (this.scheduleForm.valid) {
      this.dialogRef.close(this.scheduleForm.value);
    }
  }
}
