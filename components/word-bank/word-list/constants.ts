import { TWordList } from "../../../screens/word-list/types";
import { IFilterCriteria } from "./types";
import { search } from "./utils";

export const defaultFilter: IFilterCriteria<TWordList> = {
  search: {
    searchText: "",
    searchFn: (searchText: string, wordLists: TWordList[]) =>
      search(searchText, wordLists),
  },
  sort: {
    accessor: "title",
    order: "desc",
  },
};
