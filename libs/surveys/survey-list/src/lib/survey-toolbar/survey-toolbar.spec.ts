import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SurveyToolbar } from './survey-toolbar';

describe('SurveyToolbar', () => {
  let component: SurveyToolbar;
  let fixture: ComponentFixture<SurveyToolbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SurveyToolbar],
    }).compileComponents();

    fixture = TestBed.createComponent(SurveyToolbar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
