import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SurveyList } from './survey-list';
import { SurveyService } from '@eiq/data-access';
import { of } from 'rxjs';
import { Survey } from '@eiq/models';

describe('SurveyList', () => {
  let component: SurveyList;
  let fixture: ComponentFixture<SurveyList>;
  let mockSurveyService: jest.Mocked<SurveyService>;

  const mockSurveys: Survey[] = [
    {
      id: '1',
      title: 'Customer Satisfaction Survey',
      description: 'Survey about customer satisfaction',
      questions: [],
    },
    {
      id: '2',
      title: 'Employee Feedback',
      description: 'Annual employee feedback survey',
      questions: [],
    },
  ];

  beforeEach(async () => {
    mockSurveyService = {
      getSurveys: jest.fn().mockReturnValue(of(mockSurveys)),
    } as never;

    await TestBed.configureTestingModule({
      imports: [SurveyList],
      providers: [{ provide: SurveyService, useValue: mockSurveyService }],
    }).compileComponents();

    fixture = TestBed.createComponent(SurveyList);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load surveys on init', () => {
    fixture.detectChanges();

    expect(mockSurveyService.getSurveys).toHaveBeenCalled();
    expect(component['loading']()).toBe(false);
    expect(component['allSurveys']().length).toBe(2);
  });

  it('should show empty state when no surveys exist', () => {
    mockSurveyService.getSurveys.mockReturnValue(of([]));
    fixture.detectChanges();

    const emptyState = fixture.nativeElement.querySelector('.empty-state');
    expect(emptyState).toBeTruthy();
    expect(emptyState.textContent).toContain('No surveys available.');
  });

  it('should filter surveys by title', () => {
    fixture.detectChanges();

    component.filterSurveys('Customer');

    const filteredSurveys = component['surveys']();
    expect(filteredSurveys.length).toBe(1);
    expect(filteredSurveys[0].title).toBe('Customer Satisfaction Survey');
  });

  it('should filter surveys by description', () => {
    fixture.detectChanges();

    component.filterSurveys('employee');

    const filteredSurveys = component['surveys']();
    expect(filteredSurveys.length).toBe(1);
    expect(filteredSurveys[0].title).toBe('Employee Feedback');
  });
});
