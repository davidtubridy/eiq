import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SurveyNotepad } from './survey-notepad';

describe('SurveyNotepad', () => {
  let component: SurveyNotepad;
  let fixture: ComponentFixture<SurveyNotepad>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SurveyNotepad],
    }).compileComponents();

    fixture = TestBed.createComponent(SurveyNotepad);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
