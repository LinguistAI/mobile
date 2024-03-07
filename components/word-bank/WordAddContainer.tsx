import { Picker } from '@react-native-picker/picker';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import useNotifications from '../../hooks/useNotifications';
import { useEffect, useState } from 'react';
import { useAddWordMutation, useGetWordListsQuery } from './wordBankApi';
import { generateErrorResponseMessage } from '../../utils/httpUtils';
import { TWordList } from './word-list/types';
import ActionIcon from '../common/ActionIcon';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../theme/colors';

interface WordAddContainerProps {
  selectedWord: string;
  wordLists: { listId: string; title: string }[];
  onDismiss: () => void;
}

const WordAddContainer = ({ selectedWord, onDismiss }: WordAddContainerProps) => {
  const { add: addNotification } = useNotifications();
  const [selectedWordList, setSelectedWordList] = useState<TWordList | null>(null);
  const [addNewWord, { isError: addWordError, isLoading: isAddingWord }] = useAddWordMutation();

  const { data: wordLists, isFetching } = useGetWordListsQuery();
  if (isFetching) {
    return <ActivityIndicator />;
  }

  useEffect(() => {
    if (wordLists) {
      setSelectedWordList(wordLists.lists[0]);
    }
  }, [wordLists]);

  if (!wordLists) return null;

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
          selectedValue={selectedWordList}
          onValueChange={(itemValue) => setSelectedWordList(itemValue)}
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
