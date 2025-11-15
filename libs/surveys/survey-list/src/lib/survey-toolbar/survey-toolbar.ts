import { Component, ChangeDetectionStrategy, output } from '@angular/core';

@Component({
  selector: 'eiq-survey-toolbar',
  imports: [],
  templateUrl: './survey-toolbar.html',
  styleUrl: './survey-toolbar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SurveyToolbar {
  public surveyFilter = output<string>();
  public filter = output<void>();
  public createSurvey = output<void>();

  protected searchQuery = '';

  protected onSearch(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchQuery = target.value;
    this.surveyFilter.emit(this.searchQuery);
  }
}
