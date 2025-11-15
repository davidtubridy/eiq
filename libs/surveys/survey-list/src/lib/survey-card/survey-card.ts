import { Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Survey } from '@eiq/models';
import { Router } from '@angular/router';

@Component({
  selector: 'eiq-survey-card',
  imports: [CommonModule],
  templateUrl: './survey-card.html',
  styleUrl: './survey-card.scss',
})
export class SurveyCard {
  private router = inject(Router);
  protected readonly survey = input.required<Survey>();

  protected navigateToSurvey(surveyId: string) {
    this.router.navigate(['/surveys', surveyId]);
  }
}
