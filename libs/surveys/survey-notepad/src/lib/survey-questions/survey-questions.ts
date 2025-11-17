import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Question, QuestionType, Survey } from '@eiq/models';
import { DropdownMenu, DropdownOption, TextField, ToggleSwitch } from '@eiq/ui';

interface QuestionEditState {
  type: 'question' | 'option' | null;
  questionIndex?: number;
  optionIndex?: number;
}

@Component({
  selector: 'eiq-survey-questions',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TextField,
    DropdownMenu,
    ToggleSwitch,
    MatIconModule,
  ],
  templateUrl: './survey-questions.html',
  styleUrl: './survey-questions.scss',
})
export class SurveyQuestions {
  private fb = inject(FormBuilder);

  MIN_OPTIONS_PER_QUESTION = 1;
  MIN_QUESTIONS_PER_SURVEY = 1;
  DEFAULT_OPTION_PREFIX = 'Option';
  MAX_QUESTION_TEXT_LENGTH = 500;

  surveyForm = input.required<FormGroup>();
  surveyData = input.required<Survey>();
  editState = signal<QuestionEditState>({ type: null });

  questionsArray = computed(() => {
    const form = this.surveyForm();
    return form?.get('questions') as FormArray | undefined;
  });

  canDeleteQuestion = computed(() => {
    const questions = this.questionsArray();
    return (questions?.length ?? 0) > this.MIN_QUESTIONS_PER_SURVEY;
  });

  questionTypeOptions: DropdownOption<QuestionType>[] = [
    {
      value: QuestionType.SingleChoice,
      label: 'Single choice',
      icon: 'check_circle',
    },
    {
      value: QuestionType.MultipleChoice,
      label: 'Multiple choice',
      icon: 'check_box',
    },
    {
      value: QuestionType.Text,
      label: 'Single-Line input',
      icon: 'short_text',
    },
    {
      value: QuestionType.List,
      label: 'Dropdown list',
      icon: 'arrow_drop_down_circle',
    },
  ];

  constructor() {
    effect(() => {
      const surveyData = this.surveyData();
      const questionsArray = this.questionsArray();

      if (!questionsArray || !surveyData) return;

      if (questionsArray.length === 0 && surveyData.questions.length > 0) {
        surveyData.questions.forEach((question) => {
          questionsArray.push(this.createQuestionFormGroup(question));
        });
      }
    });
  }

  private createQuestionFormGroup(question: Question): FormGroup {
    return this.fb.group({
      questionId: [question.questionId],
      questionText: [
        question.questionText,
        [
          Validators.required,
          Validators.maxLength(this.MAX_QUESTION_TEXT_LENGTH),
        ],
      ],
      mandatoryInd: [question.mandatoryInd],
      questionType: [question.questionType, Validators.required],
      options: this.fb.array(
        question.options.map((opt) =>
          this.fb.control(opt, [Validators.required, Validators.maxLength(200)])
        )
      ),
      randomizeOptionsInd: [question.randomizeOptionsInd],
      cards: [question.cards || []],
      programmerNotes: [question.programmerNotes || ''],
      instructions: [question.instructions || ''],
    });
  }

  getQuestionOptions(questionIndex: number): FormArray | undefined {
    const questions = this.questionsArray();
    return questions?.at(questionIndex).get('options') as FormArray | undefined;
  }

  trackByQuestionId(index: number, control: AbstractControl): number {
    return control.get('questionId')?.value ?? index;
  }

  trackByOptionIndex(index: number): number {
    return index;
  }

  isEditingQuestionText(questionIndex: number): boolean {
    const state = this.editState();
    return state.type === 'question' && state.questionIndex === questionIndex;
  }

  startEditingQuestionText(questionIndex: number) {
    this.editState.set({ type: 'question', questionIndex });
  }

  saveQuestionText(questionIndex: number, newText: string) {
    const questions = this.questionsArray();
    if (!questions) return;

    if (newText.trim().length === 0) {
      return;
    }

    const questionGroup = questions.at(questionIndex);
    questionGroup.get('questionText')?.setValue(newText.trim());
    this.cancelEditing();
  }

  cancelEditingQuestionText() {
    this.cancelEditing();
  }

  getEditingOptionIndex(questionIndex: number): number | null {
    const state = this.editState();
    return state.type === 'option' && state.questionIndex === questionIndex
      ? state.optionIndex ?? null
      : null;
  }

  startEditingOption(questionIndex: number, optionIndex: number) {
    this.editState.set({ type: 'option', questionIndex, optionIndex });
  }

  saveOption(questionIndex: number, optionIndex: number, newText: string) {
    const optionsArray = this.getQuestionOptions(questionIndex);
    if (!optionsArray) return;

    if (newText.trim().length === 0) {
      return;
    }

    optionsArray.at(optionIndex).setValue(newText.trim());
    this.cancelEditing();
  }

  cancelEditing() {
    this.editState.set({ type: null });
  }

  addQuestion() {
    const questions = this.questionsArray();
    if (!questions) return;

    const maxId =
      questions.length > 0
        ? Math.max(
            ...questions.controls.map((c) => c.get('questionId')?.value || 0)
          )
        : 0;

    const newQuestion: Question = {
      questionId: maxId + 1,
      questionText: 'New question',
      mandatoryInd: false,
      questionType: QuestionType.SingleChoice,
      options: [
        `${this.DEFAULT_OPTION_PREFIX} 1`,
        `${this.DEFAULT_OPTION_PREFIX} 2`,
      ],
      randomizeOptionsInd: false,
      cards: [],
      programmerNotes: '',
      instructions: '',
    };

    const newQuestionGroup = this.createQuestionFormGroup(newQuestion);
    questions.push(newQuestionGroup);

    setTimeout(() => {
      this.startEditingQuestionText(questions.length - 1);
    }, 0);
  }

  deleteQuestion(questionIndex: number) {
    const questions = this.questionsArray();
    if (!questions) return;

    if (questions.length <= this.MIN_QUESTIONS_PER_SURVEY) {
      return;
    }

    questions.removeAt(questionIndex);

    const state = this.editState();
    if (state.questionIndex === questionIndex) {
      this.cancelEditing();
    }
  }

  changeQuestionType(questionIndex: number, newType: QuestionType) {
    const questions = this.questionsArray();
    if (!questions) return;

    const questionGroup = questions.at(questionIndex);
    const currentType = questionGroup.get('questionType')?.value;

    if (currentType === newType) return;

    questionGroup.get('questionType')?.setValue(newType);

    if (newType === QuestionType.Text) {
      const optionsArray = questionGroup.get('options') as FormArray;
      optionsArray.clear();
    } else if (currentType === QuestionType.Text) {
      const optionsArray = questionGroup.get('options') as FormArray;
      optionsArray.push(this.fb.control(`${this.DEFAULT_OPTION_PREFIX} 1`));
      optionsArray.push(this.fb.control(`${this.DEFAULT_OPTION_PREFIX} 2`));
    }
  }

  addChoice(questionIndex: number) {
    const optionsArray = this.getQuestionOptions(questionIndex);
    if (!optionsArray) return;

    const newOptionNumber = optionsArray.length + 1;
    const newOption = `${this.DEFAULT_OPTION_PREFIX} ${newOptionNumber}`;
    optionsArray.push(this.fb.control(newOption, [Validators.required]));

    setTimeout(() => {
      this.startEditingOption(questionIndex, optionsArray.length - 1);
    }, 0);
  }

  deleteOption(questionIndex: number, optionIndex: number) {
    const optionsArray = this.getQuestionOptions(questionIndex);
    if (!optionsArray) {
      return;
    }

    optionsArray.removeAt(optionIndex);

    const state = this.editState();
    if (
      state.type === 'option' &&
      state.questionIndex === questionIndex &&
      state.optionIndex === optionIndex
    ) {
      this.cancelEditing();
    }
  }

  toggleRandomizeOptions(questionIndex: number) {
    const questions = this.questionsArray();
    if (!questions) return;

    const questionGroup = questions.at(questionIndex);
    const currentValue = questionGroup.get('randomizeOptionsInd')?.value;
    questionGroup.get('randomizeOptionsInd')?.setValue(!currentValue);
  }

  toggleRequired(questionIndex: number) {
    const questions = this.questionsArray();
    if (!questions) return;

    const questionGroup = questions.at(questionIndex);
    const currentValue = questionGroup.get('mandatoryInd')?.value;
    questionGroup.get('mandatoryInd')?.setValue(!currentValue);
  }

  canDeleteOptions(questionIndex: number): boolean {
    const optionsArray = this.getQuestionOptions(questionIndex);
    return (optionsArray?.length ?? 0) > this.MIN_OPTIONS_PER_QUESTION;
  }

  getQuestionNumber(questionIndex: number): number {
    return questionIndex + 1;
  }

  showQuestionOptions(questionIndex: number): boolean {
    const questions = this.questionsArray();
    if (!questions) return false;

    const questionType = questions.at(questionIndex).get('questionType')?.value;
    return questionType !== QuestionType.Text;
  }
}
