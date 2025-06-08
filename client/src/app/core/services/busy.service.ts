import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BusyService {
  busyRequestCount: number = 0;
  loading: boolean = false;

  Busy() {
    this.busyRequestCount++;
    this.loading = true;
  }
  Idle() {
    this.busyRequestCount--;
    if (this.busyRequestCount <= 0) {
      this.busyRequestCount = 0;
      this.loading = false;
    }
  }
}
