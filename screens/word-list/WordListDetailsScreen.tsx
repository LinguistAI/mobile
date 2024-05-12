import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { FlatList, Image, StyleSheet, Text, View } from 'react-native';
import Card from '../../components/common/Card';
import FloatingButton from '../../components/common/FloatingButton';
import ModalWrapper from '../../components/common/ModalWrapper';
import CenteredFeedback from '../../components/common/feedback/CenteredFeedback';
import FetchError from '../../components/common/feedback/FetchError';
import LoadingIndicator from '../../components/common/feedback/LoadingIndicator';
import Button from '../../components/common/form/Button';
import PrimaryTextInput from '../../components/common/form/PrimaryTextInput';
import { objectIsNotEmpty } from '../../components/utils';
import { useAddWordMutation, useGetWordListByIdQuery } from '../../components/word-bank/api';
import WordDetailsCollapse from '../../components/word-bank/word-list/words/WordDetailsCollapse';
import useNotifications from '../../hooks/useNotifications';
import Colors from '../../theme/colors';
import { generateErrorResponseMessage } from '../../utils/httpUtils';

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
  const { data: selectedList, isLoading: isLoadingList } = useGetWordListByIdQuery(listId);
  const [addNewWord, { isLoading: isAddingWord, isError: isAddWordError, error: addWordError }] =
    useAddWordMutation();

  if (isLoadingList) {
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
        <CenteredFeedback message="It looks like there are no words in this list. Use the add button on the bottom right part of the page to add your first word." />
      )}
      <FlatList
        data={selectedList.words}
        renderItem={({ item }) => <WordDetailsCollapse word={item} />}
        contentContainerStyle={{
          justifyContent: 'center',
          gap: 15,
          marginVertical: 8,
          marginHorizontal: 8,
        }}
        ListHeaderComponent={
          <Card style={styles.listInfo}>
            <Image source={{ uri: 'https://picsum.photos/200' }} style={styles.image} />
            <Text style={styles.titleText}>{selectedList.unknownWordList.title}</Text>
            <Text style={styles.descriptionText}>{selectedList.unknownWordList.description}</Text>
          </Card>
        }
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
  },
  modalContents: {
    rowGap: 20,
  },
  listInfo: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  titleText: {
    position: 'absolute',
    top: '10%',
    width: '100%',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.gray[0],
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    padding: 10,
  },
  descriptionText: {
    position: 'absolute',
    bottom: '10%',
    width: '100%',
    textAlign: 'center',
    color: Colors.gray[0],
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    padding: 10,
  },
});

export default WordListDetailsScreen;
