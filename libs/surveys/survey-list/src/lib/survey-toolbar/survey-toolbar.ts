import {
  Component,
  ChangeDetectionStrategy,
  output,
  inject,
  DestroyRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SurveyService } from '@eiq/data-access';
import { Survey, QuestionType } from '@eiq/models';
import { catchError, throwError } from 'rxjs';

@Component({
  selector: 'eiq-survey-toolbar',
  imports: [],
  templateUrl: './survey-toolbar.html',
  styleUrl: './survey-toolbar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SurveyToolbar {
  private readonly surveyService = inject(SurveyService);
  private readonly destroyRef = inject(DestroyRef);

  public surveyFilter = output<string>();
  public filter = output<void>();

  protected searchQuery = '';

  protected onSearch(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchQuery = target.value;
    this.surveyFilter.emit(this.searchQuery);
  }

  protected createSurvey() {
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
        takeUntilDestroyed(this.destroyRef),
        catchError((err) => {
          return throwError(() => err);
        })
      )
      .subscribe(() =>
        //TODO get the latest surveys
        window.location.reload()
      );
  }
}
