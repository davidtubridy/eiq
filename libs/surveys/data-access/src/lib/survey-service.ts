import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Survey, SurveyList } from '@eiq/models';

@Injectable({ providedIn: 'root' })
export class SurveyService {
  private http = inject(HttpClient);

  testData = [
    {
      id: '691671a1383f5247a64592de',
      title: 'Customer Feedback Survey',
      description: 'Test description',
      questions: [
        {
          questionId: 1,
          questionText: 'How satisfied were you with your product?',
          mandatoryInd: true,
          questionType: 0,
          options: [
            'Very Satisfied',
            'Satisfied',
            'Neutral',
            'Unsatisfied',
            'Very Unsatisfied',
          ],
          randomizeOptionsInd: false,
          cards: [],
          programmerNotes: 'Satisfaction Question',
          instructions: 'Please select only one option.',
        },
      ],
    },
  ];

  public getSurveys(): Observable<SurveyList> {
    return of(this.testData);
  }

  public getSurveyById(id: string): Observable<Survey> {
    return of(this.testData[0]);
  }
}
