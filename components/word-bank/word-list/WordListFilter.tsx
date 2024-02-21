import { StyleSheet, Text, TextInput, View } from 'react-native';
import ActionIcon from '../../common/ActionIcon';
import Colors from '../../../theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import ModalWrapper from '../../common/ModalWrapper';
import ModalControlButtons from '../../common/modal/ModalControlButtons';
import { TWordList } from './types';
import { IFilterCriteria } from './types';
import { search } from './utils';
import ActionButton from '../../common/ActionButton';
import { useDispatch, useSelector } from 'react-redux';
import { selectWordLists } from '../../../slices/chatSelectors';
import { wordListsFiltered } from '../../../slices/chatSlice';

export const SORT_BY_OPTIONS = [
  {
    label: 'Title',
    value: 'title',
    icon: <Ionicons name="md-text" size={18} color="black" />,
  },
  {
    label: 'Description',
    value: 'description',
    icon: <Ionicons name="document-text" size={18} color="black" />,
  },
  {
    label: 'Pinned',
    value: 'pinned',
    icon: <Ionicons name="pin" size={18} color="black" />,
  },
  {
    label: 'Active',
    value: 'isActive',
    icon: <Ionicons name="checkmark-circle-outline" size={18} color="black" />,
  },
];

const WordListFilter = () => {
  const [openFilterModal, setOpenFilterModal] = useState(false);
  const [tempFilter, setTempFilter] = useState<IFilterCriteria<TWordList>>({
    search: {
      searchText: '',
      searchFn: (searchText: string) => search(searchText, wordLists),
    },
    sort: {
      accessor: '',
      order: 'asc',
    },
  });
  const wordLists = useSelector(selectWordLists);
  const dispatch = useDispatch();

  const applyFilter = () => {
    let filteredWordLists = [...wordLists];

    filteredWordLists = tempFilter.search.searchFn(tempFilter?.search?.searchText, wordLists);

    if (tempFilter?.sort?.accessor) {
      filteredWordLists = filteredWordLists.sort((a, b) => {
        if (tempFilter?.sort?.order === 'asc') {
          if (a[tempFilter?.sort?.accessor] < b[tempFilter?.sort?.accessor]) {
            return -1;
          }
          if (a[tempFilter?.sort?.accessor] > b[tempFilter?.sort?.accessor]) {
            return 1;
          }
          return 0;
        } else {
          if (a[tempFilter?.sort?.accessor] > b[tempFilter?.sort?.accessor]) {
            return -1;
          }
          if (a[tempFilter?.sort?.accessor] < b[tempFilter?.sort?.accessor]) {
            return 1;
          }
          return 0;
        }
      });
    }

    dispatch(wordListsFiltered(filteredWordLists));
  };

  const handleSetTempFilter = <
    TWordList,
    TTarget extends keyof IFilterCriteria<TWordList>,
    TKey extends keyof IFilterCriteria<TWordList>[TTarget],
  >(
    target: TTarget,
    key: TKey,
    value: Object
  ) => {
    setTempFilter({
      ...tempFilter,
      [target]: { ...tempFilter[target], [key]: value },
    });
  };

  const handleClearFilter = () => {
    setTempFilter({
      search: {
        searchText: '',
        searchFn: (searchText: string) => search(searchText, wordLists),
      },
      sort: {
        accessor: '',
        order: 'desc',
      },
    });
    setOpenFilterModal(false);
  };

  const handleApplyFilter = () => {
    setOpenFilterModal(false);
    console.log('tempFilter', tempFilter);
    applyFilter();
  };

  useEffect(() => {
    let filteredWordLists = [...wordLists];
    filteredWordLists = tempFilter.search.searchFn(tempFilter?.search?.searchText, wordLists);
    dispatch(wordListsFiltered(filteredWordLists));
  }, [tempFilter.search.searchText]);

  return (
    <View style={styles.overallContainer}>
      <View style={styles.inputRoot}>
        <View style={[styles.inputContainer]}>
          <Ionicons name="search-outline" size={24} color={Colors.primary[600]} />
          <TextInput
            style={[
              styles.textInput,
              tempFilter?.search?.searchText === '' ? { flexBasis: '85%' } : null,
            ]}
            onChangeText={(value) =>
              setTempFilter({
                ...tempFilter,
                search: {
                  ...tempFilter.search,
                  searchText: value,
                },
              })
            }
            value={tempFilter?.search?.searchText}
            placeholder="Search by title, description, or word"
          />

          {tempFilter?.search?.searchText !== '' && (
            <View style={{ alignSelf: 'center', marginRight: 20 }}>
              <ActionIcon
                icon={<Ionicons name="close-outline" size={24} color={Colors.primary[600]} />}
                onPress={() =>
                  setTempFilter({
                    ...tempFilter,
                    search: {
                      ...tempFilter.search,
                      searchText: '',
                    },
                  })
                }
              />
            </View>
          )}
        </View>
      </View>
      <View style={styles.filterOptionContainer}>
        <ActionIcon
          icon={<Ionicons name="options-outline" size={32} color={Colors.primary[600]} />}
          onPress={() => setOpenFilterModal(true)}
        />
      </View>
      <ModalWrapper
        onRequestClose={() => setOpenFilterModal(false)}
        visible={openFilterModal}
        title="Filter"
        width={300}
      >
        <View style={styles.formContent}>
          <View style={styles.orderByContainer}>
            <Text style={styles.label}>Order By:</Text>
            <View style={styles.actionRow}>
              <View style={styles.sortByOptionsContainer}>
                {SORT_BY_OPTIONS.map((option) => (
                  <ActionButton
                    title={option.label}
                    key={option.value}
                    icon={option.icon}
                    selected={tempFilter?.sort?.accessor === option.value}
                    selectedBgColor={Colors.primary[600]}
                    maxWidth={150}
                    onPress={() =>
                      handleSetTempFilter('sort', 'accessor', option.value as keyof TWordList)
                    }
                  />
                ))}
              </View>
              <ActionIcon
                icon={
                  tempFilter?.sort?.order === 'asc' ? (
                    <Ionicons name="arrow-up-outline" size={24} color={Colors.gray[700]} />
                  ) : (
                    <Ionicons name="arrow-down-outline" size={24} color={Colors.gray[700]} />
                  )
                }
                onPress={() =>
                  handleSetTempFilter(
                    'sort',
                    'order',
                    tempFilter?.sort?.order === 'asc' ? 'desc' : 'asc'
                  )
                }
              />
            </View>
          </View>
          <View style={styles.formControls}>
            <ModalControlButtons
              onCancel={handleClearFilter}
              onSubmit={handleApplyFilter}
              okText="Apply"
            />
          </View>
        </View>
      </ModalWrapper>
    </View>
  );
};

const styles = StyleSheet.create({
  overallContainer: {
    paddingHorizontal: 4,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  filterOptionContainer: {
    flex: 1,
    alignItems: 'flex-end',
    borderColor: Colors.primary[600],
    borderWidth: 1.5,
    borderRadius: 4,
  },
  textInput: {
    flexBasis: '75%',
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 8,
    width: '100%',
    gap: 6,
  },
  inputRoot: {
    flex: 8,
    height: 50,
    borderWidth: 2,
    borderBottomColor: Colors.primary[300],
    borderTopColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    color: Colors.gray[600],
  },
  formContent: {
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: 20,
  },
  formControls: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
    gap: 35,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  orderByContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 10,
  },
  pickerRow: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    gap: 10,
  },
  pickerItem: {
    height: 60,
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
  },
  picker: {
    width: 200,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: Colors.gray[600],
    borderRadius: 4,
    marginBottom: 20,
    textAlign: 'center',
  },
  actionIconContainer: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: Colors.primary[600],
    borderRadius: 4,
    padding: 5,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  sortByOptionsContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  sortByOption: {
    width: 120,
  },
});

export default WordListFilter;
