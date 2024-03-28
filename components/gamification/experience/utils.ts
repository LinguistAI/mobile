export const getProgressRatio = (currentExperience: number, totalExperienceToNextLevel: number) => {
  return currentExperience / getCurrentLevelTotalExperience(totalExperienceToNextLevel);
};

export const getCurrentLevelTotalExperience = (totalExperienceToNextLevel: number) => {
  return totalExperienceToNextLevel;
};
