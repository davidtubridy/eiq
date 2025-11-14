
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