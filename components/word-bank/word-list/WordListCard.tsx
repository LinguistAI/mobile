import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { type TWordList, TMenuOption } from './types';
import ActionIcon from '../../common/ActionIcon';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../../theme/colors';
import PopupMenu from './WordListCardOptionMenu';
import { useMutation } from '@tanstack/react-query';
import {
  useActivateWordListMutation,
  useAddWordListToFavoriteMutation,
  useDeactivateWordListMutation,
  useDeleteListMutation,
  usePinWordListMutation,
  useRemoveWordListFromFavoritesMutation,
  useUnpinWordListMutation,
} from '../api';

interface WordListProps {
  list: TWordList;
  handleListSelection: (id: string) => void;
}

const WordListCard = ({ list, handleListSelection }: WordListProps) => {
  const [menuVisible, setMenuVisible] = useState(false);

  const [deleteList] = useDeleteListMutation();
  const [addWordListToFavorite] = useAddWordListToFavoriteMutation();
  const [removeWordListFromFavorites] = useRemoveWordListFromFavoritesMutation();
  const [activateWordList] = useActivateWordListMutation();
  const [deactivateWordList] = useDeactivateWordListMutation();
  const [pinWordList] = usePinWordListMutation();
  const [unpinWordList] = useUnpinWordListMutation();

  const { mutate: deleteListMutate } = useMutation({
    mutationFn: async () => await deleteList(list.listId),
    mutationKey: ['deleteWordList'],
  });

  const { mutate: addFavoriteMutate } = useMutation({
    mutationFn: async () => await addWordListToFavorite(list.listId),
    mutationKey: ['addListFavorite'],
  });

  const { mutate: removeFavoriteMutate } = useMutation({
    mutationFn: async () => await removeWordListFromFavorites(list.listId),
    mutationKey: ['removeListFavorite'],
  });

  const { mutate: activateMutate } = useMutation({
    mutationFn: async () => await activateWordList(list.listId),
    mutationKey: ['activateList'],
  });

  const { mutate: deactivateMutate } = useMutation({
    mutationFn: async () => await deactivateWordList(list.listId),
    mutationKey: ['deactivateList'],
  });

  const { mutate: pinMutate } = useMutation({
    mutationFn: async () => await pinWordList(list.listId),
    mutationKey: ['pinList'],
  });

  const { mutate: unpinMutate } = useMutation({
    mutationFn: async () => await unpinWordList(list.listId),
    mutationKey: ['unpinList'],
  });

  const triggerOption = (option: TMenuOption) => {
    switch (option) {
      case TMenuOption.DELETE:
        deleteListMutate();
        break;
      case TMenuOption.FAVORITE:
        addFavoriteMutate();
        break;
      case TMenuOption.UNFAVORITE:
        removeFavoriteMutate();
        break;
      case TMenuOption.ACTIVATE:
        activateMutate();
        break;
      case TMenuOption.DEACTIVATE:
        deactivateMutate();
        break;
      case TMenuOption.PIN:
        pinMutate();
        break;
      case TMenuOption.UNPIN:
        unpinMutate();
        break;
      case TMenuOption.EDIT:
        break;
      case TMenuOption.CANCEL:
        setMenuVisible(false);
        break;
      default:
        break;
    }
    setMenuVisible(false);
  };

  const renderPin = () => {
    if (list.isPinned) {
      return (
        <View style={styles.pin}>
          <ActionIcon
            icon={<Ionicons size={24} name="pin" color={Colors.gray['900']} />}
            onPress={() => {
              triggerOption(TMenuOption.PIN);
            }}
          />
        </View>
      );
    }
  };

  const renderFavourite = () => {
    if (list.isFavorite) {
      return (
        <View style={styles.favourite}>
          <ActionIcon
            icon={<Ionicons size={24} name="heart-circle-outline" color={Colors.gray['100']} />}
            onPress={() => {
              triggerOption(TMenuOption.FAVORITE);
            }}
          />
        </View>
      );
    }
  };

  const getMenuOptions = () => {
    return [
      {
        label: 'Edit',
        value: TMenuOption.EDIT,
        icon: <Ionicons name="create-outline" size={18} color={Colors.blue[600]} />,
      },
      {
        label: list.isFavorite ? 'Unfavorite' : 'Favorite',
        value: list.isFavorite ? TMenuOption.UNFAVORITE : TMenuOption.FAVORITE,
        icon: list.isFavorite ? (
          <Ionicons name="heart" size={18} color={Colors.primary[600]} />
        ) : (
          <Ionicons name="heart-outline" size={18} color={Colors.primary[600]} />
        ),
      },
      {
        label: list.isPinned ? 'Unpin' : 'Pin',
        value: list.isPinned ? TMenuOption.UNPIN : TMenuOption.PIN,
        icon: list.isPinned ? (
          <Ionicons name="pin" size={18} color="black" />
        ) : (
          <Ionicons name="pin-outline" size={18} color="black" />
        ),
      },
      {
        label: list.isActive ? 'Deactivate' : 'Activate',
        value: list.isActive ? TMenuOption.DEACTIVATE : TMenuOption.ACTIVATE,
        icon: list.isActive ? (
          <Ionicons name="bookmark-sharp" size={18} color="black" />
        ) : (
          <Ionicons name="bookmark-outline" size={18} color="black" />
        ),
      },
      {
        label: 'Delete',
        value: TMenuOption.DELETE,
        icon: <Ionicons name="trash-outline" size={18} color={Colors.red[600]} />,
      },
      {
        label: 'Cancel',
        value: TMenuOption.CANCEL,
        icon: <Ionicons name="close-circle-outline" size={18} color={Colors.gray[600]} />,
      },
    ];
  };

  const getTotalNumOfWords = (listStats: {
    learning: number;
    reviewing: number;
    mastered: number;
  }): number => {
    return listStats.learning + listStats.reviewing + listStats.mastered;
  };

  return (
    <Pressable
      style={styles.card}
      onLongPress={() => {
        setMenuVisible(true);
      }}
      onPress={() => {
        handleListSelection(list.listId);
      }}
    >
      <View key={list.listId}>
        <Image source={{ uri: 'https://picsum.photos/150' }} style={styles.image} />
        <View style={styles.overlay}>
          {renderPin()}
          {renderFavourite()}
          <View>
            <Text style={styles.title}>{list.title}</Text>
            <Text style={styles.words}>{getTotalNumOfWords(list.listStats)} words in total</Text>
          </View>
          <View style={styles.bottomRow}>
            <View style={styles.stats}>
              <Text style={styles.stat}>Learning: {list.listStats.learning}</Text>
              <Text style={styles.stat}>Reviewing: {list.listStats.reviewing}</Text>
              <Text style={styles.stat}>Mastered: {list.listStats.mastered}</Text>
            </View>
            <View style={styles.menuContainer}>
              <PopupMenu
                menuVisible={menuVisible}
                setMenuVisible={setMenuVisible}
                triggerOption={triggerOption}
                menuOptions={getMenuOptions()}
              />
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 10,
    width: '48%',
    position: 'relative',
    marginRight: 8,
  },
  pin: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1,
  },
  favourite: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 1,
  },
  words: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 4,
    position: 'absolute',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.primary['500'],
    opacity: 0.8,
    marginTop: 25,
  },
  title: {
    paddingHorizontal: 10,
    paddingTop: 15,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  stats: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    flexDirection: 'column',
  },
  stat: {
    fontSize: 13,
    color: '#fff',
    fontStyle: 'italic',
  },
  menuContainer: {
    alignSelf: 'flex-end',
    paddingHorizontal: 5,
    paddingBottom: 5,
  },
});

export default WordListCard;
