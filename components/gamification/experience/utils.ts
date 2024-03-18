export const getProgressRatio = (currentExperience: number, totalExperienceToNextLevel: number) => {
  return currentExperience / getCurrentLevelTotalExperience(currentExperience, totalExperienceToNextLevel);
};

export const getCurrentLevelTotalExperience = (currentExperience: number, totalExperienceToNextLevel: number) => {
  return currentExperience + totalExperienceToNextLevel;
};
