import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardImage } from '@angular/material/card';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-home',
  imports: [MatButton, RouterLink, MatCardImage],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {}
