import { Component, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { MatBadge } from '@angular/material/badge';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { BusyService } from 'app/core/services/busy.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CartService } from 'app/core/services/cart.service';
import { AccountService } from 'app/core/services/account.service';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatDivider } from '@angular/material/divider';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatIcon,
    MatButton,
    MatBadge,
    RouterLink,
    RouterLinkActive,
    MatProgressBarModule,
    MatMenuTrigger,
    MatMenu,
    MatDivider,
    MatMenuItem,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  busyService = inject(BusyService);
  cartService = inject(CartService);
  accoutService = inject(AccountService);
  private router = inject(Router);

  Logout() {
    this.accoutService.Logout().subscribe({
      next: () => {
        this.accoutService.currentUser.set(null);
        this.router.navigateByUrl('/');
      },
    });
  }
}
