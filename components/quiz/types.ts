export interface TQuestion {
  id: string;
  word: string;
  question: string;
  options: string[];
}

// TODO: Instead of answered make correct-answer || wrong-answer
export type QuizPhase = 'waiting-answer' | 'answered' | 'end' | 'checking-answer' | 'waiting-results';

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

export type Question = {
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

export interface ResultQuestion extends Question {
  answer: string;
  userAnswer: string;
  isUserCorrect: boolean;
}

export interface RFinishMCQ {
  isCompleted: boolean;
  correctPercentage: number;
  questions: ResultQuestion[];
}
