interface TQuestion {
  question: string;
  answers: string[];
  correctAnswer: string;
}

type QuizPhase = 'waiting-answer' | 'answered' | 'end';

type ChoiceStatus = 'default' | 'selected';
