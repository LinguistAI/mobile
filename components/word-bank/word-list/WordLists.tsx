import { FlatList, StyleSheet, Text, View } from 'react-native';
import WordListCard from './WordListCard';
import FloatingButton from '../../common/FloatingButton';
import ModalWrapper from '../../common/ModalWrapper';
import { FormProvider, useForm } from 'react-hook-form';
import PrimaryTextInput from '../../common/form/PrimaryTextInput';
import PrimarySwitch from '../../common/form/PrimarySwitch';
import ModalControlButtons from '../../common/modal/ModalControlButtons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createList } from '../../../screens/word-list/WordList.service';
import { ICreateWordList, TWordList } from './types';
import { APIResponse } from '../../../screens/common';
import { generateErrorResponseMessage } from '../../../utils/httpUtils';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import useNotifications from '../../../hooks/useNotifications';
import { isEmptyObj } from '../../utils';
import WordListsSkeleton from './WordListsSkeleton';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectAreWordListsFetched,
  selectFilteredWordLists,
  selectWordLists,
} from '../../../slices/chatSelectors';
import { wordListDeleted, wordListUpdated } from '../../../slices/chatSlice';

const WordLists = () => {
  const queryClient = useQueryClient();
  const { mutate: addListMutate, isPending } = useMutation({
    mutationFn: (data: ICreateWordList) => createList(data),
    mutationKey: ['createWordList'],
    onSuccess: (data: APIResponse<TWordList>) => {
      if (!data || !data.data) {
        addNotification({
          body: 'Something went wrong while creating the wordlist.',
          type: 'error',
        });
        return;
      }

      queryClient.invalidateQueries({ queryKey: ['getWordLists'] });
      methods.reset();
    },
    onError: (error: any) => {
      const msg = generateErrorResponseMessage(error);
      addNotification({ body: msg, type: 'error' });
    },
  });
  const wordLists = useSelector(selectWordLists);
  const filteredWordLists = useSelector(selectFilteredWordLists);
  const dispatch = useDispatch();
  const [addListModalVisible, setAddListModalVisible] = useState(false);
  const navigation = useNavigation();
  const { add: addNotification } = useNotifications();
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

  const validateSubmit = (data: any) => {
    wordLists.forEach((list) => {
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
    if (!isEmptyObj(methods.formState.errors)) {
      return;
    }

    const createWordList: ICreateWordList = {
      title: data.listName,
      description: data.listDescription,
      isActive: data.isActive,
      isFavorite: data.favorite,
      isPinned: data.pinned,
      imageUrl: "https://picsum.photos/200"
    };
    addListMutate(createWordList);
  };

  const onError = (errors: any, e: any) => {
    if (methods.formState.isValid) {
      console.log('No errors. This should not be called.');
      console.log(errors);
    }
  };

  const handleOpenAddListModal = () => {
    setAddListModalVisible(true);
  };

  const handleCancelAddList = () => {
    setAddListModalVisible(false);
  };

  const handleListSelection = (listId: string) => {
    const selectedList = wordLists.find((list) => list.listId === listId);
    navigation.navigate('WordListDetails', { listId: selectedList?.listId });
  };

  const renderAddListModal = () => {
    return (
      <ModalWrapper
        visible={addListModalVisible}
        onRequestClose={handleCancelAddList}
        title="Add a new list"
      >
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

  const updateList = (updatedList: TWordList) => {
    dispatch(wordListUpdated({ targetList: updatedList }));
  };

  const deleteList = (listId: string) => {
    dispatch(wordListDeleted({ targetListId: listId }));
  };

  const renderSkeleton = () => {
    return <WordListsSkeleton />;
  };

  const renderLists = () => {
    if (isPending) {
      return renderSkeleton();
    }

    if (filteredWordLists.length === 0) {
      <Text>
        It looks like you haven't created any lists.
      </Text>
    }

    return (
      <FlatList
        data={filteredWordLists}
        renderItem={({ item }) => (
          <WordListCard
            key={item.listId}
            list={item}
            handleListSelection={handleListSelection}
            updateList={updateList}
            deleteList={deleteList}
          />
        )}
        numColumns={2}
        keyExtractor={(item) => item.listId}
        contentContainerStyle={styles.wordListContentContainer}
      />
    );
  };

  return (
    <>
      {renderLists()}
      <View>
        <FloatingButton handlePress={handleOpenAddListModal} />
      </View>
      {renderAddListModal()}
    </>
  );
};

const styles = StyleSheet.create({
  wordListContainer: {
    flex: 8,
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
