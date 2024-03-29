import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { TWordList } from './types';
import ActionIcon from '../../common/ActionIcon';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../../theme/colors';
import { useState } from 'react';
import WordListCardOptionMenu from './WordListCardOptionMenu';
import { TMenuOption } from './types';
import { useMutation } from '@tanstack/react-query';
import {
  activateWordList,
  addWordListToFavorite,
  deactivateWordList,
  deleteList,
  pinWordList,
  removeWordListFromFavorites,
  unpinWordList,
} from '../../../screens/word-list/WordList.service';

interface WordListProps {
  list: TWordList;
  handleListSelection: (id: string) => void;
  updateList: (newList: TWordList) => void;
  deleteList: (listId: string) => void;
}

const WordListCard = ({
  list,
  handleListSelection,
  updateList,
  deleteList: deleteListFn,
}: WordListProps) => {
  const [menuVisible, setMenuVisible] = useState(false);

  const { mutate: deleteListMutate } = useMutation({
    mutationFn: () => deleteList(list.listId),
    mutationKey: ['deleteWordList'],
    onSuccess: () => {
      deleteListFn(list.listId);
    },
    onError: () => {},
  });

  const { mutate: addFavoriteMutate } = useMutation({
    mutationFn: () => addWordListToFavorite(list.listId),
    mutationKey: ['addListFavorite'],
    onSuccess: () => {
      updateList({
        ...list,
        isFavorite: true,
      });
    },
  });

  const { mutate: removeFavoriteMutate } = useMutation({
    mutationFn: () => removeWordListFromFavorites(list.listId),
    mutationKey: ['removeListFavorite'],
    onSuccess: () => {
      updateList({
        ...list,
        isFavorite: false,
      });
    },
  });

  const { mutate: activateMutate } = useMutation({
    mutationFn: () => activateWordList(list.listId),
    mutationKey: ['activateList'],
    onSuccess: () => {
      updateList({
        ...list,
        isActive: true,
      });
    },
  });

  const { mutate: deactivateMutate } = useMutation({
    mutationFn: () => deactivateWordList(list.listId),
    mutationKey: ['deactivateList'],
    onSuccess: () => {
      updateList({
        ...list,
        isActive: false,
      });
    },
  });

  const { mutate: pinMutate } = useMutation({
    mutationFn: () => pinWordList(list.listId),
    mutationKey: ['pinList'],
    onSuccess: () => {
      updateList({
        ...list,
        isPinned: true,
      });
    },
  });

  const { mutate: unpinMutate } = useMutation({
    mutationFn: () => unpinWordList(list.listId),
    mutationKey: ['unpinList'],
    onSuccess: () => {
      updateList({
        ...list,
        isPinned: false,
      });
    },
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
            onPress={() => triggerOption(TMenuOption.PIN)}
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
            onPress={() => triggerOption(TMenuOption.FAVORITE)}
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

  return (
    <Pressable
      style={styles.card}
      onLongPress={() => setMenuVisible(true)}
      onPress={() => handleListSelection(list.listId)}
    >
      <View key={list.listId}>
        <Image source={{ uri: 'https://picsum.photos/150' }} style={styles.image} />
        <View style={styles.overlay}>
          {renderPin()}
          {renderFavourite()}
          <View>
            <Text style={styles.title}>{list.title}</Text>
            {/* TODO: <Text style={styles.words}>{list.words.length} words in total</Text> */}
          </View>
          <View style={styles.bottomRow}>
            <View style={styles.stats}>
              <Text style={styles.stat}>Learning: {list.listStats.learning}</Text>
              <Text style={styles.stat}>Reviewing: {list.listStats.reviewing}</Text>
              <Text style={styles.stat}>Mastered: {list.listStats.mastered}</Text>
            </View>
            <View style={styles.menuContainer}>
              <WordListCardOptionMenu
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
