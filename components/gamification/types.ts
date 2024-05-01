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

export interface IStoreItem {
  id: string;
  type: string;
  description: string;
  price: number;
};

export interface RStoreItemsPage {
  storeItems: { storeItem: IStoreItem }[]; 
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface IUserItem {
  userItem: {
    storeItem: IStoreItem;
    quantity: number;
  };
}

export interface RUserItemsPage {
  userItems: IUserItem[];
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface IStoreItemWithQuantity extends IStoreItem {
  quantityOwned: number;
}

export interface QPurchaseItem {
  itemId: string;
}

export type RUserGems = {
  gems: number;
}