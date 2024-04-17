export type RUserQuests = {
  questId: number;
  user: RUser;
  title: string;
  description: string;
  type: string;
  image: string;
  reward: number;
  assignedDate: string;
  completionCriteria: QuestCompletionCriteria;
  progress: QuestProgress;
  completed: boolean;
}

export type RUser = {
  id: string;
  username: string;
  email: string;
};

export type QuestCompletionCriteria = {
  times: number;
  word?: string;
}

export type QuestProgress = {
  times: number;
}
