import { FlatList, StyleSheet, Text, View } from 'react-native';
import WordListCard from './WordListCard';
import FloatingButton from '../../common/FloatingButton';
import ModalWrapper from '../../common/ModalWrapper';
import { FormProvider, useForm } from 'react-hook-form';
import PrimaryTextInput from '../../common/form/PrimaryTextInput';
import PrimarySwitch from '../../common/form/PrimarySwitch';
import ModalControlButtons from '../../common/modal/ModalControlButtons';
import { ICreateWordList, TWordList } from './types';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { objectIsNotEmpty } from '../../utils';
import WordListsSkeleton from './WordListsSkeleton';
import { useCreateWordListMutation, useGetWordListsQuery } from '../api';
import WordListFilter from './WordListFilter';
import FetchError from '../../common/feedback/FetchError';
import CenteredFeedback from '../../common/feedback/CenteredFeedback';
import useNotifications from '../../../hooks/useNotifications';

const WordLists = () => {
  const [addListModalVisible, setAddListModalVisible] = useState(false);
  const [filteredWordLists, setFilteredWordLists] = useState<TWordList[]>([]);
  const navigation = useNavigation();
  const methods = useForm({
    defaultValues: {
      listName: '',
      listDescription: '',
      pinned: false,
      favorite: false,
      isActive: false,
    },
    mode: 'onChange',
  });
  const [addListMutate, { error: createWordlistError, isSuccess }] = useCreateWordListMutation();
  const {
    data: wordLists,
    isFetching: isFetchingWordLists,
    isError: wordListFetchError,
    error,
  } = useGetWordListsQuery();
  const { add: addNotification } = useNotifications();

  if (isFetchingWordLists) {
    return <WordListsSkeleton />;
  }

  if (wordListFetchError) {
    return <FetchError />;
  }

  if (!wordLists?.lists || wordLists?.lists?.length === 0) {
    return (
      <CenteredFeedback message="You have no word lists. You can use the add button to create a word list!" />
    );
  }

  const validateSubmit = (data: any) => {
    wordLists?.lists?.forEach((list) => {
      if (list.title === data.listName) {
        methods.setError('listName', {
          type: 'manual',
          message: 'List name already exists',
        });
      }
    });
  };

  const onSubmit = async (data: any) => {
    validateSubmit(data);
    setAddListModalVisible(false);
    if (objectIsNotEmpty(methods.formState.errors)) {
      return;
    }
    const createWordList: ICreateWordList = {
      title: data.listName,
      description: data.listDescription,
      isActive: data.isActive,
      isFavorite: data.favorite,
      isPinned: data.pinned,
      imageUrl: 'https://picsum.photos/200',
    };
    await addListMutate(createWordList);
    if (createWordlistError) {
      addNotification({
        body: 'Failed to create word list',
        type: 'error',
      });
    }
  };

  const onError = (errors: any, e: any) => {
    if (methods.formState.isValid) {
      return;
    }
  };

  const handleOpenAddListModal = () => {
    setAddListModalVisible(true);
  };

  const handleCancelAddList = () => {
    setAddListModalVisible(false);
  };

  const handleListSelection = (listId: string) => {
    const selectedList = wordLists?.lists?.find((list) => list.listId === listId);
    navigation.navigate('WordListDetails', { listId: selectedList?.listId });
  };

  const renderAddListModal = () => {
    return (
      <ModalWrapper visible={addListModalVisible} onRequestClose={handleCancelAddList} title="Add a new list">
        <FormProvider {...methods}>
          <View style={styles.formContent}>
            <PrimaryTextInput
              name="listName"
              label="List Name"
              defaultValue=""
              placeholder="Enter list name"
              rules={{ required: 'List name is required', minLength: 3 }}
            />
            <PrimaryTextInput
              name="listDescription"
              label="List Description"
              defaultValue=""
              placeholder="Enter list description"
              rules={{ required: 'List description is required' }}
            />
            <PrimarySwitch name="pinned" label="Pin this list" defaultValue={false} />
            <PrimarySwitch name="favorite" label="Add to favorites" defaultValue={false} />
            <PrimarySwitch name="isActive" label="Set as active list" defaultValue={true} />
            <View style={styles.formControls}>
              <ModalControlButtons
                onCancel={handleCancelAddList}
                onSubmit={methods.handleSubmit(onSubmit, onError)}
                okText="Add"
              />
            </View>
          </View>
        </FormProvider>
      </ModalWrapper>
    );
  };

  const renderSkeleton = () => {
    return <WordListsSkeleton />;
  };

  const renderLists = () => {
    if (isFetchingWordLists) {
      return renderSkeleton();
    }

    if (filteredWordLists?.length === 0) {
      <Text>It looks like you haven't created any lists.</Text>;
    }

    return (
      <View style={styles.wordListContainer}>
        <FlatList
          data={filteredWordLists.length > 0 ? filteredWordLists : []}
          renderItem={({ item }) => <WordListCard list={item} handleListSelection={handleListSelection} />}
          numColumns={2}
          keyExtractor={(item) => item.listId}
          contentContainerStyle={styles.wordListContentContainer}
        />
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.filterContainer}>
        <WordListFilter wordLists={wordLists?.lists} setFilteredWordLists={setFilteredWordLists} />
      </View>
      {renderLists()}
      <View>
        <FloatingButton handlePress={handleOpenAddListModal} />
      </View>
      {renderAddListModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  wordListContainer: {
    flex: 8,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    flex: 1,
  },
  wordListContentContainer: {
    paddingHorizontal: 10,
    flex: 1,
  },
  formContent: {
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'space-between',
    rowGap: 20,
  },
  formControls: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
    gap: 35,
  },
});

export default WordLists;
