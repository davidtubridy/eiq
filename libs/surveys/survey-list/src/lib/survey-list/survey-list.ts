import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SurveyService } from '@eiq/data-access';
import { Survey, QuestionType } from '@eiq/models';
import { SurveyCard } from '../survey-card/survey-card';
import { SurveyToolbar } from '../survey-toolbar/survey-toolbar';
import { catchError, switchMap, throwError } from 'rxjs';

@Component({
  selector: 'eiq-survey-list',
  imports: [SurveyCard, SurveyToolbar],
  templateUrl: './survey-list.html',
  styleUrl: './survey-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SurveyList {
  private surveyService = inject(SurveyService);
  private destroyRef = inject(DestroyRef);
  private allSurveys = signal<Survey[]>([]);
  private filterText = signal<string>('');

  protected loading = signal<boolean>(true);
  protected error = signal<string | null>(null);
  protected surveys = computed(() => {
    const filter = this.filterText().toLowerCase().trim();

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

  constructor() {
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

  protected handleCreateSurvey() {
    const newSurvey: Omit<Survey, 'id'> = {
      title: 'Untitled Survey',
      description: 'Description',
      questions: [
        {
          questionId: 1,
          questionText: 'Question 1',
          mandatoryInd: false,
          questionType: QuestionType.SingleChoice,
          options: ['Option 1', 'Option 2'],
          randomizeOptionsInd: false,
          cards: [],
          programmerNotes: '',
          instructions: '',
        },
      ],
    };

    this.surveyService
      .createSurvey(newSurvey)
      .pipe(
        switchMap(() => this.surveyService.getSurveys()),
        takeUntilDestroyed(this.destroyRef),
        catchError((err) => {
          this.error.set(err.message);
          return throwError(() => err);
        })
      )
      .subscribe((surveys) => {
        this.allSurveys.set(surveys);
      });
  }
}
