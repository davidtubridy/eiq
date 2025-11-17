import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SurveyToolbar } from './survey-toolbar';
import { SurveyService } from '@eiq/data-access';

describe('SurveyToolbar', () => {
  let component: SurveyToolbar;
  let fixture: ComponentFixture<SurveyToolbar>;
  let mockSurveyService: jest.Mocked<SurveyService>;

  beforeEach(async () => {
    mockSurveyService = {
      createSurvey: jest.fn().mockReturnValue(true),
    } as never;

    await TestBed.configureTestingModule({
      imports: [SurveyToolbar],
      providers: [{ provide: SurveyService, useValue: mockSurveyService }],
    }).compileComponents();

    fixture = TestBed.createComponent(SurveyToolbar);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render search input', () => {
    const searchInput =
      fixture.nativeElement.querySelector('.search-box-input');
    expect(searchInput).toBeTruthy();
    expect(searchInput.placeholder).toBe('Search surveys...');
  });

  it('should render create survey button', () => {
    const createButton = fixture.nativeElement.querySelector(
      '.create-survey-button'
    );
    expect(createButton).toBeTruthy();
    expect(createButton.textContent.trim()).toContain('Create Survey');
  });

  it('should emit surveyFilter when search input changes', () => {
    const spy = jest.fn();
    component.surveyFilter.subscribe(spy);

    const searchInput =
      fixture.nativeElement.querySelector('.search-box-input');
    searchInput.value = 'test query';
    searchInput.dispatchEvent(new Event('input'));

    expect(spy).toHaveBeenCalledWith('test query');
  });

  it('should update searchQuery when typing in search input', () => {
    const searchInput =
      fixture.nativeElement.querySelector('.search-box-input');
    searchInput.value = 'my search';
    searchInput.dispatchEvent(new Event('input'));

    expect(component['searchQuery']).toBe('my search');
  });
});
