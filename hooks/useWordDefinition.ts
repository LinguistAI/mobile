import { useQuery } from "@tanstack/react-query";
import { getWordMeanings } from "../screens/word-list/WordList.service";
import { WordWithConfidence } from "../components/word-bank/word-list/types";

interface UseWordDefinitionProps {
    word: WordWithConfidence
}

const useWordDefinition = ({word}: UseWordDefinitionProps) => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ['wordMeaning', word],
        queryFn: () => getWordMeanings([word.word]),
        staleTime: 1000000
      });
}
 
export default useWordDefinition;