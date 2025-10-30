import { Component, inject, input, output } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { BusyService } from 'app/core/services/busy.service';

@Component({
  selector: 'app-empty-state',
  imports: [MatIcon, MatButton],
  templateUrl: './empty-state.component.html',
  styleUrl: './empty-state.component.scss',
})
export class EmptyStateComponent {
  busyService = inject(BusyService);
  message = input.required<string>();
  icon = input.required<string>();
  actionText = input.required<string>();
  action = output<void>();

  protected OnAction() {
    this.action.emit();
  }
}
