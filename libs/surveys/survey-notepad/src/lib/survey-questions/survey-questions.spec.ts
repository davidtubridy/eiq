import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SurveyQuestions } from './survey-questions';

describe('SurveyQuestions', () => {
  let component: SurveyQuestions;
  let fixture: ComponentFixture<SurveyQuestions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SurveyQuestions],
    }).compileComponents();

    fixture = TestBed.createComponent(SurveyQuestions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
