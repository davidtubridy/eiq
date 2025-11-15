import {
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SurveyService } from '@eiq/data-access';
import { Survey } from '@eiq/models';
import { SurveyCard } from '../survey-card/survey-card';
import { SurveyToolbar } from '../survey-toolbar/survey-toolbar';
import { catchError, throwError } from 'rxjs';

@Component({
  selector: 'eiq-survey-list',
  imports: [SurveyCard, SurveyToolbar],
  templateUrl: './survey-list.html',
  styleUrl: './survey-list.scss',
})
export class SurveyList implements OnInit {
  private surveyService = inject(SurveyService);
  private destroyRef = inject(DestroyRef);
  private allSurveys = signal<Survey[]>([]);
  private filterText = signal<string>('');

  protected loading = signal<boolean>(true);
  protected error = signal<string | null>(null);
  protected surveys = computed(() => {
    const filter = this.filterText().toLowerCase().trim();
    const all = this.allSurveys();

    if (!filter) {
      return this.allSurveys();
    }

    return this.allSurveys().filter((survey) => {
      const titleMatch = survey.title?.toLowerCase().includes(filter) ?? false;
      const descriptionMatch =
        survey.description?.toLowerCase().includes(filter) ?? false;
      return titleMatch || descriptionMatch;
    });
  });

  ngOnInit() {
    this.loadSurveys();
  }

  private loadSurveys() {
    this.surveyService
      .getSurveys()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError((err) => {
          this.error.set(err.message);
          this.loading.set(false);
          return throwError(() => err);
        })
      )
      .subscribe((data) => {
        this.allSurveys.set(data);
        this.loading.set(false);
      });
  }

  public filterSurveys(filter: string) {
    this.filterText.set(filter);
  }
}
