import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import React, { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ActionIcon from "../common/ActionIcon";
import CloseIcon from "../common/CloseIcon";
import Colors from "../../theme/colors";
import WordDetail from "./word-list/words/WordDetail";
import { useSelector } from "react-redux";
import { selectWordLists } from "../../redux/chatSelectors";
import { addWord, getWordMeanings } from "./WordList.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isDictionaryWordGroup } from "./word-list/utils";
import useNotifications from "../../hooks/useNotifications";
import { generateErrorResponseMessage } from "../../utils/httpUtils";
import Title from "../common/Title";
import Divider from "../common/Divider";

interface WordInfoCardProps {
  selectedWord: string;
  onDismiss: () => void;
}

const WordInfoCard = ({
  selectedWord,
  onDismiss,
}: WordInfoCardProps) => {
  const wordLists = useSelector(selectWordLists)
  const [selectedWordList, setSelectedWordList] = useState(wordLists.length !== 0 ? wordLists[0].listId : "")
  const queryClient = useQueryClient()
  const { add: addNotification} = useNotifications()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['wordMeaning', selectedWord],
    queryFn: () => getWordMeanings([selectedWord]),
    staleTime: 1000000
  });

  const { mutate: addNewWord, isPending: isAddingWord } = useMutation({
    mutationKey: ['addNewWord'],
    mutationFn: () =>
      addWord({
        listId: selectedWordList,
        word: selectedWord,
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({queryKey: ["getListDetails"]})
      addNotification({
        body: `${selectedWord} is added to the list.`,
        type: "success"
      })
    },
    onError: (error) => {
      addNotification({
        body: generateErrorResponseMessage(
          error,
          'Something went wrong while adding the word to the word list.'
        ),
        type: 'error',
      });
    },
  });

  const handleAddNewWord = () => {
    onDismiss()
    addNewWord()
    queryClient.invalidateQueries({queryKey: ["getWordLists"]})
  }

  const renderWordDetails = () => {
    let result = null;
    if (isLoading) {
      result = <ActivityIndicator />
    }
    else if (isError) {
      result = (
        <Text>
          We couldn't fetch the details for this word.
        </Text>
      )
    }
    else {
      const dict = data?.data?.dict!
      const wordGroupOrNot = dict[selectedWord]
      if (isDictionaryWordGroup(wordGroupOrNot)) {
        const wordGroupObj = wordGroupOrNot
        result = wordGroupObj.wordGroup.map(group => (
          <WordDetail 
            key={group.id}
            definition={group}
          />
        ))
      } else {
        result = (
          <Text>
            Unfortunately this word does not exist in our dictionary. Sorry...
          </Text>
        )
      }


      return result
    }
  }

  return (
    <View>
      <ScrollView contentContainerStyle={styles.cardContainer}>
        <CloseIcon onPress={onDismiss} />
        <View>
          <Text style={styles.word}>
            {selectedWord}
          </Text>
          {renderWordDetails()}
        </View>
        <Divider />
        <Title fontSize="h4">
          Add to your list
        </Title>
        <View style={styles.actionsContainer}>
          <View style={styles.picker}>
            <Picker
              itemStyle={styles.pickerItem}
              selectedValue={selectedWordList}
              onValueChange={(itemValue) => setSelectedWordList(itemValue)}
              mode="dropdown"
            >
              {wordLists.map((wordList) => (
                <Picker.Item
                  key={wordList.listId}
                  value={wordList.listId}
                  label={wordList.title}
                />
              ))}
            </Picker>
          </View>
          <View style={styles.addIconContainer}>
            <ActionIcon
              icon={
                <Ionicons
                  name="add-circle"
                  size={36}
                  color={Colors.gray[0]}
                />
              }
              onPress={handleAddNewWord}
              disabled={isAddingWord || selectedWordList === ""}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    margin: 20,
    backgroundColor: Colors.primary[500],
    borderRadius: 10,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "90%",
  },
  word: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center"
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    columnGap: 15,
  },
  pickerItem: {
    height: 60,
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
  },
  picker: {
    flex: 5,
    height: 60,
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: Colors.gray[700],
    borderRadius: 4,
    marginBottom: 20,
    textAlign: "center",
  },
  addIconContainer: {
    flex: 1,
    alignSelf: "center",
  },
});

export default WordInfoCard;
