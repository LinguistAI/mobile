import { Picker } from '@react-native-picker/picker';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import useNotifications from '../../hooks/useNotifications';
import { useEffect, useState } from 'react';
import { useAddWordMutation, useGetWordListsQuery } from './api';
import { generateErrorResponseMessage } from '../../utils/httpUtils';
import { TWordList } from './word-list/types';
import ActionIcon from '../common/ActionIcon';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../theme/colors';
import FetchError from '../common/FetchError';
import CenteredFeedback from '../common/CenteredFeedback';

interface WordAddContainerProps {
  selectedWord: string;
  onDismiss: () => void;
}

const WordAddContainer = ({ selectedWord, onDismiss }: WordAddContainerProps) => {
  const { add: addNotification } = useNotifications();
  const [selectedWordList, setSelectedWordList] = useState<TWordList | null>(null);
  const [addNewWord, { isError: addWordError, isLoading: isAddingWord }] = useAddWordMutation();

  const { data: wordLists, isFetching } = useGetWordListsQuery();
  useEffect(() => {
    if (wordLists) {
      setSelectedWordList(wordLists.lists[0]);
    }
  }, [wordLists]);

  if (isFetching) {
    return <ActivityIndicator />;
  }

  if (!wordLists) return <FetchError />;
  if (wordLists.lists.length === 0) {
    return <CenteredFeedback message="You don't have any word lists yet. Create one to add this word." />;
  }
  const handleAddNewWord = async () => {
    onDismiss();
    if (!selectedWordList) return;

    await addNewWord({ listId: selectedWordList.listId, word: selectedWord });
    if (addWordError) {
      addNotification({
        body: generateErrorResponseMessage(addWordError),
        type: 'error',
        time: 3000,
      });
    } else {
      addNotification({
        body: 'The word has been successfully added to your list.',
        type: 'success',
        time: 3000,
      });
    }
  };

  return (
    <>
      <View style={styles.picker}>
      <Picker
        itemStyle={styles.pickerItem}
        selectedValue={selectedWordList ? selectedWordList.listId : null}
        onValueChange={(itemValue) => {
          const selectedList = wordLists.lists.find((list) => list.listId === itemValue);
          if (selectedList) {
            setSelectedWordList(selectedList);
          }
        }}
        mode="dropdown"
      >
        {wordLists.lists.map((wordList) => (
          <Picker.Item key={wordList.listId} value={wordList.listId} label={wordList.title} />
        ))}
      </Picker>
      </View>
      <View style={styles.addIconContainer}>
        <ActionIcon
          icon={<Ionicons name="add-circle" size={36} color={Colors.gray[0]} />}
          onPress={handleAddNewWord}
          disabled={isAddingWord || !selectedWordList}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  pickerItem: {
    height: 60,
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
  },
  picker: {
    flex: 5,
    height: 60,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: Colors.gray[700],
    borderRadius: 4,
    marginBottom: 20,
    textAlign: 'center',
  },
  addIconContainer: {
    flex: 1,
    alignSelf: 'center',
  },
});

export default WordAddContainer;
