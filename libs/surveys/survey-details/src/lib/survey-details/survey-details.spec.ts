import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SurveyDetails } from './survey-details';

describe('SurveyDetails', () => {
  let component: SurveyDetails;
  let fixture: ComponentFixture<SurveyDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SurveyDetails],
    }).compileComponents();

    fixture = TestBed.createComponent(SurveyDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
