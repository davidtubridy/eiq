import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Header } from '@eiq/ui';
@Component({
  imports: [RouterModule, Header],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'eiq';
}
