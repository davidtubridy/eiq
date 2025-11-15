import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  {
    path: 'surveys',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('@eiq/survey-list').then((m) => m.SurveyList),
        title: 'Surveys',
      },
      {
        path: ':id',
        loadComponent: () =>
          import('@eiq/survey-details').then((m) => m.SurveyDetails),
        title: 'Survey Details',
      },
    ],
  },
  {
    path: '',
    redirectTo: 'surveys',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'surveys',
  },
];
