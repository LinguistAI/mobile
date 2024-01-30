export interface IFilterCriteria<T> {
  sort: {
    accessor: keyof T | "";
    order: "asc" | "desc";
  };
  search: {
    searchText: string;
    searchFn: (searchText: string, list: T[]) => T[];
  };
}

export enum TMenuOption {
  EDIT = "Edit",
  DELETE = "Delete",
  CANCEL = "Cancel",
  PIN = "Pin",
  FAVORITE = "Favorite",
}

export type TMenuOptionObject = {
  label: string;
  value: TMenuOption;
  icon: React.ReactElement;
};
