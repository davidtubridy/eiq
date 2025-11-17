import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SurveyQuestions } from './survey-questions';
import { FormBuilder } from '@angular/forms';
import { Survey, QuestionType } from '@eiq/models';

describe('SurveyQuestions', () => {
  let component: SurveyQuestions;
  let fixture: ComponentFixture<SurveyQuestions>;
  let fb: FormBuilder;

  const mockSurvey: Survey = {
    id: '123',
    title: 'Test Survey',
    description: 'Test Description',
    questions: [
      {
        questionId: 1,
        questionText: 'What is your favorite color?',
        mandatoryInd: false,
        questionType: QuestionType.SingleChoice,
        options: ['Red', 'Blue', 'Green'],
        randomizeOptionsInd: false,
        cards: [],
        programmerNotes: '',
        instructions: '',
      },
    ],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SurveyQuestions],
    }).compileComponents();

    fixture = TestBed.createComponent(SurveyQuestions);
    component = fixture.componentInstance;
    fb = TestBed.inject(FormBuilder);

    const surveyForm = fb.group({
      id: ['123'],
      title: ['Test Survey'],
      description: ['Test Description'],
      questions: fb.array([]),
    });

    fixture.componentRef.setInput('surveyForm', surveyForm);
    fixture.componentRef.setInput('surveyData', mockSurvey);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize questions array from survey data', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    const questionsArray = component.questionsArray();
    expect(questionsArray).toBeDefined();
    expect(questionsArray?.length).toBe(1);
    expect(questionsArray?.at(0).get('questionText')?.value).toBe(
      'What is your favorite color?'
    );
    expect(questionsArray?.at(0).get('questionType')?.value).toBe(
      QuestionType.SingleChoice
    );
  });

  it('should add a new question when addQuestion is called', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    const questionsArrayBefore = component.questionsArray();
    const initialLength = questionsArrayBefore?.length ?? 0;

    component.addQuestion();

    const questionsArrayAfter = component.questionsArray();
    expect(questionsArrayAfter?.length).toBe(initialLength + 1);
    expect(
      questionsArrayAfter?.at(initialLength).get('questionText')?.value
    ).toBe('New question');
  });

  it('should add and delete options from a question', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    component.addChoice(0);

    const optionsArray = component.getQuestionOptions(0);
    expect(optionsArray?.length).toBe(4);

    component.deleteOption(0, 0);

    expect(optionsArray?.length).toBe(3);
  });
});
