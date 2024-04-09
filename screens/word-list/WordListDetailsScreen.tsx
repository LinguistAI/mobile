import { FlatList, StyleSheet, Text, View } from 'react-native';
import FloatingButton from '../../components/common/FloatingButton';
import WordDetails from '../../components/word-bank/word-list/words/WordDetailsCollapse';
import { useState } from 'react';
import ModalWrapper from '../../components/common/ModalWrapper';
import Button from '../../components/common/form/Button';
import PrimaryTextInput from '../../components/common/form/PrimaryTextInput';
import { FormProvider, useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useNotifications from '../../hooks/useNotifications';
import { generateErrorResponseMessage } from '../../utils/httpUtils';
import { objectIsNotEmpty } from '../../components/utils';
import { useAddWordMutation, useGetWordListByIdQuery } from '../../components/word-bank/api';
import LoadingIndicator from '../../components/common/feedback/LoadingIndicator';
import FetchError from '../../components/common/feedback/FetchError';

interface WordListDetailsScreenProps {
  route: any;
}

const WordListDetailsScreen = ({ route }: WordListDetailsScreenProps) => {
  const listId = route.params.listId as string;
  const [isAddWordModalVisible, setIsAddWordModalVisible] = useState(false);
  const { add: addNotification } = useNotifications();

  const methods = useForm({
    defaultValues: {
      newWord: '',
    },
    mode: 'onChange',
  });
  const { data: selectedList, isFetching: isFetchingList } = useGetWordListByIdQuery(listId);
  const [addNewWord, { isLoading: isAddingWord, isError: isAddWordError, error: addWordError }] =
    useAddWordMutation();

  if (isFetchingList) {
    return <LoadingIndicator subtext="Loading your word list..." />;
  }

  if (!selectedList) {
    return <FetchError />;
  }

  const onSubmit = async (data: any) => {
    if (objectIsNotEmpty(methods.formState.errors)) {
      return;
    }

    await addNewWord({
      listId,
      word: data.newWord,
    });
    setIsAddWordModalVisible(false);
    methods.reset();
    if (isAddWordError) {
      addNotification({
        body: generateErrorResponseMessage(
          addWordError,
          'Something went wrong while adding the word to the word list.'
        ),
        type: 'error',
      });
    }
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
      {selectedList.words.length === 0 && (
        <Text style={{ textAlign: 'center', marginTop: 10 }}>
          It looks like there are no words in this list. Use the add button on the bottom right part of the
          page to add your first word.
        </Text>
      )}
      <FlatList
        data={selectedList.words}
        renderItem={({ item }) => <WordDetails word={item} />}
        contentContainerStyle={{
          justifyContent: 'center',
          gap: 15,
          marginHorizontal: 10,
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
            <Button type="primary" loading={isAddingWord} onPress={methods.handleSubmit(onSubmit, onError)}>
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
    marginTop: 10,
  },
  modalContents: {
    rowGap: 20,
  },
});

export default WordListDetailsScreen;
