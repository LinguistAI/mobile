import React from "react";
import { TWordList } from "../../../screens/word-list/types";
import { IFilterCriteria, TMenuOption } from "./types";
import { search } from "./utils";
import { Ionicons } from "@expo/vector-icons";

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
