export interface TQuestion {
  id: string;
  word: string;
  question: string;
  options: string[];
}

export type QuizPhase = 'waiting-answer' | 'answered' | 'end';

export type ChoiceStatus = 'default' | 'selected';

export interface QCheckMCQAnswer {
  questionId: string;
  answer: string;
}

export interface RCheckMCQAnswer {
  word: string;
  answer: string;
  options: string[];
  createdAt: string;
  updatedAt: string;
  isUserCorrect: boolean;
  hasUserAnswered: boolean;
}

export interface QCreateMCQ {
  conversationId: string;
}

type Question = {
  id: string;
  word: string;
  question: string;
  options: string[];
};
export interface RCreateMCQ {
  id: string;
  questions: Question[];
}

export interface QFinishMCQ {
  testId: string;
}

export interface RFinishMCQ {
  isCompleted: boolean;
  correctPercentage: number;
}
