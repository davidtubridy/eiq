import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SurveyNotepad } from './survey-notepad';
import { SurveyService } from '@eiq/data-access';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { Survey } from '@eiq/models';

describe('SurveyNotepad', () => {
  let component: SurveyNotepad;
  let fixture: ComponentFixture<SurveyNotepad>;
  let mockSurveyService: jest.Mocked<SurveyService>;
  let mockRouter: jest.Mocked<Router>;
  let mockActivatedRoute: unknown;

  const mockSurvey: Survey = {
    id: '123',
    title: 'Test Survey',
    description: 'Test Description',
    questions: [],
  };

  beforeEach(async () => {
    mockSurveyService = {
      getSurveyById: jest.fn().mockReturnValue(of(mockSurvey)),
      updateSurvey: jest.fn().mockReturnValue(of(mockSurvey)),
    } as never;

    mockRouter = {
      navigate: jest.fn(),
    } as never;

    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: jest.fn().mockReturnValue('123'),
        },
      },
    };

    await TestBed.configureTestingModule({
      imports: [SurveyNotepad],
      providers: [
        { provide: SurveyService, useValue: mockSurveyService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SurveyNotepad);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load survey on init when survey ID is provided', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    expect(mockSurveyService.getSurveyById).toHaveBeenCalledWith('123');
    expect(component.surveyData()).toEqual(mockSurvey);
    expect(component.loading()).toBe(false);
  });

  it('should initialize form with survey data', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    const form = component.surveyForm();
    expect(form).toBeDefined();
    expect(form?.get('title')?.value).toBe('Test Survey');
    expect(form?.get('description')?.value).toBe('Test Description');
    expect(form?.get('id')?.value).toBe('123');
  });

  it('should save title when saveTitle is called', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    component.saveTitle('New Title');

    const form = component.surveyForm();
    expect(form?.get('title')?.value).toBe('New Title');
    expect(component.editState().type).toBe(null);
  });
});
