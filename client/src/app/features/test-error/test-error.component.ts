import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-test-error',
  imports: [MatButton],
  templateUrl: './test-error.component.html',
  styleUrl: './test-error.component.scss',
})
export class TestErrorComponent {
  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);
  validationErrors?: string[];

  Get404Error() {
    this.validationErrors = undefined;
    this.http.get(this.baseUrl + 'bug/notfound').subscribe({
      next: (response) => console.log(response),
      error: (error) => console.log(error),
    });
  }

  Get400Error() {
    this.validationErrors = undefined;
    this.http.get(this.baseUrl + 'bug/badrequest').subscribe({
      next: (response) => console.log(response),
      error: (error) => console.log(error),
    });
  }

  Get401Error() {
    this.validationErrors = undefined;
    this.http.get(this.baseUrl + 'bug/unauthorized').subscribe({
      next: (response) => console.log(response),
      error: (error) => console.log(error),
    });
  }

  Get500Error() {
    this.validationErrors = undefined;
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
