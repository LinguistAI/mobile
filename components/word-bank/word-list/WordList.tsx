import { LinearGradient } from 'expo-linear-gradient';
import { FlatList, StyleSheet, View } from 'react-native';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import WordListCard from './WordListCard';
import FloatingButton from '../../common/FloatingButton';
import ModalWrapper from '../../common/ModalWrapper';
import { FormProvider, useForm } from 'react-hook-form';
import PrimaryTextInput from '../../common/form/PrimaryTextInput';
import PrimarySwitch from '../../common/form/PrimarySwitch';
import ModalControlButtons from '../../common/modal/ModalControlButtons';
import WordListFilter from './WordListFilter';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createList, getLists } from '../../../screens/word-list/WordList.service';
import { ICreateWordList, TWordList } from '../../../screens/word-list/types';
import { APIResponse } from '../../../screens/common';
import { generateErrorResponseMessage } from '../../../utils/httpUtils';
import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import useNotifications from '../../../hooks/useNotifications';
import { isEmptyObj } from '../../utils';

const WordList = () => {
  const queryClient = useQueryClient();
  const { data: wordListsServer } = useQuery({
    queryFn: () => getLists(),
    queryKey: ['getWordLists'],
  });
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
  const wordLists = wordListsServer?.data?.lists || [];
  const [filteredWordLists, setFilteredWordLists] = useState<TWordList[]>([]);
  const [addListModalVisible, setAddListModalVisible] = useState(false);
  const navigation = useNavigation();
  const { add: addNotification } = useNotifications();
  const methods = useForm({
    defaultValues: {
      listName: '',
      listDescription: '',
      pinned: false,
      favorite: false,
      isActive: true,
    },
    mode: 'onChange',
  });

  useEffect(() => {
    if (wordListsServer?.data) {
      setFilteredWordLists(wordListsServer?.data?.lists);
    }
  }, [wordListsServer]);

  if (!wordListsServer) {
    return renderSkeleton();
  }

  const validateSubmit = (data: any) => {
    wordListsServer?.data?.lists?.forEach((list) => {
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
    navigation.navigate('WordListDetails', { list: selectedList });
  };

  const updateList = (updatedList: TWordList) => {
    const listIndex = wordLists.findIndex((list) => list.listId === updatedList.listId);
    setFilteredWordLists([
      ...wordLists.slice(0, listIndex),
      updatedList,
      ...wordLists.slice(listIndex + 1),
    ]);
  };

  const deleteList = (listId: string) => {
    setFilteredWordLists(wordLists.filter((list) => list.listId !== listId));
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

  const renderSkeleton = () => {
    return (
      <View style={styles.skeletonContainer}>
        {Array.from({ length: 4 }).map((_, index) => (
          <View key={index} style={styles.skeletonRow}>
            <ShimmerPlaceholder LinearGradient={LinearGradient} style={styles.skeletonRectangle} />
            <ShimmerPlaceholder LinearGradient={LinearGradient} style={styles.skeletonRectangle} />
          </View>
        ))}
      </View>
    );
  };

  const renderLists = () => {
    if (isPending) {
      return renderSkeleton();
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
    <View>
      <View style={styles.filterContainer}>
        <WordListFilter
          wordLists={wordListsServer?.data?.lists || []}
          setFilteredWordLists={setFilteredWordLists}
        />
      </View>
      <View style={styles.wordListContainer}>{renderLists()}</View>
      <FloatingButton handlePress={handleOpenAddListModal} />
      {renderAddListModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    flex: 1,
  },
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
  skeletonContainer: {
    flex: 8,
    paddingHorizontal: 20,
    gap: 10,
  },
  skeletonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  skeletonRectangle: {
    width: '48%',
    borderRadius: 4,
    height: 140,
  },
});

export default WordList;
