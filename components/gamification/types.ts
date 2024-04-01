export interface IUserStreak {
  userId: string;
  user: User;
  currentStreak: number;
  highestStreak: number;
  lastLogin: Date;
}

export interface IUserExperience {
  currentExperience: number;
  level: number;
  totalExperienceToNextLevel: number;
  username: string;
}
