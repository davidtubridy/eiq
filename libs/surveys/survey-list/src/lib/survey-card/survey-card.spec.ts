import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SurveyCard } from './survey-card';
import { Router } from '@angular/router';
import { Survey } from '@eiq/models';

describe('SurveyCard', () => {
  let component: SurveyCard;
  let fixture: ComponentFixture<SurveyCard>;
  let mockRouter: jest.Mocked<Router>;

  const mockSurvey: Survey = {
    id: '123',
    title: 'Customer Satisfaction Survey',
    description: 'Survey to measure customer satisfaction',
    questions: [
      { questionId: 1, questionText: 'Question 1' } as never,
      { questionId: 2, questionText: 'Question 2' } as never,
    ],
  };

  beforeEach(async () => {
    mockRouter = {
      navigate: jest.fn(),
    } as never;

    await TestBed.configureTestingModule({
      imports: [SurveyCard],
      providers: [{ provide: Router, useValue: mockRouter }],
    }).compileComponents();

    fixture = TestBed.createComponent(SurveyCard);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.componentRef.setInput('survey', mockSurvey);
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should display survey title', () => {
    fixture.componentRef.setInput('survey', mockSurvey);
    fixture.detectChanges();

    const title = fixture.nativeElement.querySelector('.card-title');
    expect(title).toBeTruthy();
    expect(title.textContent).toBe('Customer Satisfaction Survey');
  });

  it('should display survey description', () => {
    fixture.componentRef.setInput('survey', mockSurvey);
    fixture.detectChanges();

    const description =
      fixture.nativeElement.querySelector('.card-description');
    expect(description).toBeTruthy();
    expect(description.textContent).toBe(
      'Survey to measure customer satisfaction'
    );
  });

  it('should display question count', () => {
    fixture.componentRef.setInput('survey', mockSurvey);
    fixture.detectChanges();

    const questionCount =
      fixture.nativeElement.querySelector('.question-count');
    expect(questionCount).toBeTruthy();
    expect(questionCount.textContent).toBe('2');
  });

  it('should navigate to survey on click', () => {
    fixture.componentRef.setInput('survey', mockSurvey);
    fixture.detectChanges();

    const card = fixture.nativeElement.querySelector('.survey-card');
    card.click();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/surveys', '123']);
  });
});
