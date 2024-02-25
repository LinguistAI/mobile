import { FlatList, StyleSheet, Text, View } from 'react-native';
import { TWordList } from '../../components/word-bank/word-list/types';
import FloatingButton from '../../components/common/FloatingButton';
import WordDetails from '../../components/word-bank/word-list/words/WordDetailsCollapse';
import { useState } from 'react';
import ModalWrapper from '../../components/common/ModalWrapper';
import Button from '../../components/common/form/Button';
import PrimaryTextInput from '../../components/common/form/PrimaryTextInput';
import { FormProvider, useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addWord, getList } from './WordList.service';
import useNotifications from '../../hooks/useNotifications';
import { generateErrorResponseMessage } from '../../utils/httpUtils';
import { isEmptyObj } from '../../components/utils';

interface WordListDetailsScreenProps {
  route: any;
}

const WordListDetailsScreen = ({ route }: WordListDetailsScreenProps) => {
  const listId = route.params.listId as string;
  const [isAddWordModalVisible, setIsAddWordModalVisible] = useState(false);
  const { add: addNotification } = useNotifications();
  const queryClient = useQueryClient()

  const methods = useForm({
    defaultValues: {
      newWord: '',
    },
    mode: 'onChange',
  });
  const { data: selectedList } = useQuery({
    queryKey: ['getListDetails'],
    queryFn: () => getList(listId),
  });
  const { mutate: addNewWord, isPending: isAddingWord } = useMutation({
    mutationKey: ['addNewWord'],
    mutationFn: (word: string) =>
      addWord({
        listId,
        word,
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({queryKey: ["getListDetails"]})
      methods.reset();
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

  if (!selectedList || !selectedList?.data) {
    return null;
  }

  const onSubmit = (data: any) => {
    if (!isEmptyObj(methods.formState.errors)) {
      return;
    }

    addNewWord(data.newWord);
  };

  const onError = (error: any) => {
    addNotification({
      body: generateErrorResponseMessage(
        error,
        'Something went wrong while adding the word to the word list.'
      ),
      type: 'error',
    });
  };

  return (
    <View style={styles.container}>
      {selectedList.data.words.length === 0 && (
        <Text style={{textAlign: "center", marginTop: 10}}>
          It looks like there are no words in this list. Use the add
          button on the bottom right part of the page to add your first word.
        </Text>
      )}
      <FlatList
        data={selectedList.data.words}
        renderItem={({ item }) => <WordDetails word={item} />}
        contentContainerStyle={{
          justifyContent: 'center',
        }}
      />
      <FloatingButton
        handlePress={() => {
          setIsAddWordModalVisible(true);
        }}
      />
      <ModalWrapper
        onRequestClose={() => setIsAddWordModalVisible(false)}
        visible={isAddWordModalVisible}
        title="Add new word"
      >
        <View style={styles.modalContents}>
          <FormProvider {...methods}>
            <PrimaryTextInput
              label="New word"
              name="newWord"
              defaultValue=""
              rules={{ required: true }}
              placeholder="Apple"
            />
            <Button
              type="primary"
              loading={isAddingWord}
              onPress={methods.handleSubmit(onSubmit, onError)}
            >
              ADD
            </Button>
          </FormProvider>
        </View>
      </ModalWrapper>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modalContents: {
    rowGap: 20,
  },
});

export default WordListDetailsScreen;
