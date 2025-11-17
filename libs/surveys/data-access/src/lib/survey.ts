import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Survey, SurveyList } from '@eiq/models';

@Injectable({ providedIn: 'root' })
export class SurveyService {
  private http = inject(HttpClient);
  private apiUrl = process.env['API_URL'] as string;
  private apiKey = process.env['X_API_KEY'] as string;
  private surveyEndpoint = `${this.apiUrl}/survey`;

  private headers = new HttpHeaders({
    'X-API-KEY': this.apiKey,
    'Content-Type': 'application/json',
  });

  public getSurveys(): Observable<SurveyList> {
    const url: string = this.surveyEndpoint;
    return this.http.get<SurveyList>(url, { headers: this.headers });
  }

  public getSurveyById(id: string): Observable<Survey> {
    const url = `${this.surveyEndpoint}/${id}`;
    return this.http.get<Survey>(url, { headers: this.headers });
  }

  public createSurvey(survey: Omit<Survey, 'id'>) {
    return this.http.post<Survey>(this.surveyEndpoint, survey, {
      headers: this.headers,
    });
  }

  public updateSurvey(surveyId: string, survey: Survey): Observable<Survey> {
    const url = `${this.surveyEndpoint}/${surveyId}`;
    return this.http.put<Survey>(url, survey, { headers: this.headers });
  }
}
