import { Component, computed, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'eiq-header',
  imports: [RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  readonly title = 'Empathy IQ';
}
