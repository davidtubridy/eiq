export interface Question {
  questionId: number;
  questionText: string;
  mandatoryInd: boolean;
  questionType: number;
  options: string[];
  randomizeOptionsInd: boolean;
  cards: string[];
  programmerNotes: string;
  instructions: string;
}

export interface Survey {
  id: string;
  title: string;
  description: string;
  questions: Question[];
}

export type SurveyList = Survey[];

export enum QuestionType {
  SingleChoice = 0,
  MultipleChoice = 1,
  Text = 2,
  List = 3,
}

export const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  [QuestionType.SingleChoice]: 'Single Choice',
  [QuestionType.MultipleChoice]: 'Multiple Choice',
  [QuestionType.Text]: 'Text',
  [QuestionType.List]: 'List',
};
