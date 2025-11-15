import {
  Component,
  ChangeDetectionStrategy,
  signal,
  output,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'eiq-survey-toolbar',
  imports: [MatIconModule],
  templateUrl: './survey-toolbar.html',
  styleUrl: './survey-toolbar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SurveyToolbar {
  public search = output<string>();
  public filter = output<void>();
  public createSurvey = output<void>();

  protected searchQuery = '';

  protected onSearch(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchQuery = target.value;
    this.search.emit(this.searchQuery);
  }
}
