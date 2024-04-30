export type RUserGems = {
  userId: string;
  user: RUser;
  gems: number;
}

export type RUser = {
  id: string;
  username: string;
  email: string;
};
