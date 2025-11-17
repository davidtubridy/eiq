import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SurveyService } from '@eiq/data-access';
import { Survey } from '@eiq/models';
import { TextField } from '@eiq/ui';
import {
  catchError,
  debounceTime,
  finalize,
  Subscription,
  tap,
  throwError,
} from 'rxjs';
import { SurveyQuestions } from '../survey-questions/survey-questions';

interface EditState {
  type: 'title' | 'description' | null;
}

@Component({
  selector: 'eiq-survey-notepad',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, TextField, SurveyQuestions],
  templateUrl: './survey-notepad.html',
  styleUrl: './survey-notepad.scss',
})
export class SurveyNotepad implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private surveyService = inject(SurveyService);
  private fb = inject(FormBuilder);

  AUTO_SAVE_DEBOUNCE_MS = 500;
  MAX_TITLE_LENGTH = 200;
  MAX_DESCRIPTION_LENGTH = 500;

  private autoSaveSubscription?: Subscription;

  surveyForm = signal<FormGroup | undefined>(undefined);
  surveyData = signal<Survey | undefined>(undefined);
  loading = signal(true);
  saving = signal(false);
  saveError = signal<string | null>(null);
  editState = signal<EditState>({ type: null });

  questionsArray = computed(() => {
    const form = this.surveyForm();
    return form?.get('questions') as FormArray | undefined;
  });

  constructor() {
    effect(() => {
      const form = this.surveyForm();

      this.autoSaveSubscription?.unsubscribe();

      if (!form) return;

      this.autoSaveSubscription = form.valueChanges
        .pipe(debounceTime(this.AUTO_SAVE_DEBOUNCE_MS))
        .subscribe(() => {
          this.saveSurvey();
        });
    });
  }

  ngOnInit() {
    const surveyId = this.route.snapshot.paramMap.get('id');

    if (surveyId) {
      this.loadSurvey(surveyId);
    } else {
      this.loading.set(false);
    }
  }

  private loadSurvey(surveyId: string) {
    this.loading.set(true);

    this.surveyService
      .getSurveyById(surveyId)
      .pipe(
        tap((data) => {
          this.initializeForm(data);
          this.loading.set(false);
        }),
        catchError((err) => {
          this.loading.set(false);
          return throwError(() => new Error(err));
        })
      )
      .subscribe();
  }

  private initializeForm(survey: Survey) {
    this.surveyData.set(survey);

    const form = this.fb.group({
      id: [survey.id],
      title: [
        survey.title,
        [Validators.required, Validators.maxLength(this.MAX_TITLE_LENGTH)],
      ],
      description: [
        survey.description,
        [Validators.maxLength(this.MAX_DESCRIPTION_LENGTH)],
      ],
      questions: this.fb.array([]),
    });

    this.surveyForm.set(form);
  }

  private saveSurvey() {
    const form = this.surveyForm();
    if (!form || !form.valid) {
      if (form && !form.valid) {
        this.saveError.set('Please fix validation errors before saving');
      }
      return;
    }

    this.saving.set(true);

    const survey: Survey = form.value;

    this.surveyService
      .updateSurvey(survey.id, survey)
      .pipe(
        catchError((err) => {
          return throwError(() => new Error(err));
        }),
        finalize(() => {
          this.saving.set(false);
        })
      )
      .subscribe();
  }

  navigateToSurveys() {
    this.router.navigate(['/surveys']);
  }

  isEditingTitle(): boolean {
    return this.editState().type === 'title';
  }

  startEditingTitle() {
    this.editState.set({ type: 'title' });
  }

  saveTitle(newTitle: string) {
    const form = this.surveyForm();
    if (!form) return;

    if (newTitle.trim().length === 0) {
      this.saveError.set('Title cannot be empty');
      return;
    }

    form.get('title')?.setValue(newTitle.trim());
    this.cancelEditing();
  }

  cancelEditingTitle() {
    this.cancelEditing();
  }

  isEditingDescription(): boolean {
    return this.editState().type === 'description';
  }

  startEditingDescription() {
    this.editState.set({ type: 'description' });
  }

  saveDescription(newDescription: string) {
    const form = this.surveyForm();
    if (!form) return;

    form.get('description')?.setValue(newDescription.trim());
    this.cancelEditing();
  }

  cancelEditingDescription() {
    this.cancelEditing();
  }

  private cancelEditing() {
    this.editState.set({ type: null });
  }
}
