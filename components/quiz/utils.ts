const positiveFeedbackTexts: string[] = [
  'Congratulations! You nailed it!',
  'Excellent job! Keep up the great work!',
  "Well done! You're crushing this quiz!",
  "Fantastic! You're on fire!",
  "Bravo! That's the way to go!",
  "Amazing! You're a quiz master!",
  'Superb! You got it right!',
  "Outstanding! You're acing this quiz!",
  "Terrific! You're unstoppable!",
  "Incredible! You're a genius!",
];

export const getRandomPositiveFeedback = (): string => {
  const randomIndex = Math.floor(Math.random() * positiveFeedbackTexts.length);
  return positiveFeedbackTexts[randomIndex];
};
