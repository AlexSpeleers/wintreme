import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-test-error',
  imports: [MatButton],
  templateUrl: './test-error.component.html',
  styleUrl: './test-error.component.scss',
})
export class TestErrorComponent {
  baseUrl = 'https://localhost:5001/api/';
  private http = inject(HttpClient);
  validationErrors?: string[];

  Get404Error() {
    this.http.get(this.baseUrl + 'bug/notfound').subscribe({
      next: (response) => console.log(response),
      error: (error) => console.log(error),
    });
  }

  Get400Error() {
    this.http.get(this.baseUrl + 'bug/badrequest').subscribe({
      next: (response) => console.log(response),
      error: (error) => console.log(error),
    });
  }

  Get401Error() {
    this.http.get(this.baseUrl + 'bug/unauthorized').subscribe({
      next: (response) => console.log(response),
      error: (error) => console.log(error),
    });
  }

  Get500Error() {
    this.http.get(this.baseUrl + 'bug/internalerror').subscribe({
      next: (response) => console.log(response),
      error: (error) => console.log(error),
    });
  }

  Get400ValidationError() {
    this.http.post(this.baseUrl + 'bug/validationerror', {}).subscribe({
      next: (response) => console.log(response),
      error: (error) => (this.validationErrors = error),
    });
  }
}
