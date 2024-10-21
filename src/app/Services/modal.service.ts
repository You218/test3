import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private step = new BehaviorSubject<number>(1);
  currentStep$ = this.step.asObservable();

  goToNextStep() {
    const nextStep = this.step.value + 1;
    this.step.next(nextStep);
  }

  resetSteps() {
    this.step.next(1);
  }
}
