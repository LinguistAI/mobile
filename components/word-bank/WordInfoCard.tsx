import React from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CloseIcon from '../common/CloseIcon';
import Colors from '../../theme/colors';
import WordDetail from './word-list/words/WordDetail';
import { isDictionaryWordGroup } from './word-list/utils';
import Title from '../common/Title';
import Divider from '../common/Divider';
import { useGetWordMeaningsQuery } from './api';
import WordAddContainer from './WordAddContainer';
import { useSelector } from 'react-redux';
import { selectCurrentActiveWords, selectCurrentConversation } from '../../redux/chatSelectors';

interface WordInfoCardProps {
  selectedWord: string;
  onDismiss: () => void;
}

const WordInfoCard = ({ selectedWord, onDismiss }: WordInfoCardProps) => {
  const activeWords = useSelector(selectCurrentActiveWords);
  const lowercaseWord = selectedWord.toLowerCase();
  const { data, isLoading, isError } = useGetWordMeaningsQuery([lowercaseWord], {
    refetchOnFocus: false,
    refetchOnReconnect: false,
    refetchOnMountOrArgChange: false,
  });

  const isActiveWord = !!activeWords?.find((a) => a.word.toLowerCase() === lowercaseWord);

  const renderWordDetails = () => {
    let result = null;
    if (isLoading) {
      result = <ActivityIndicator />;
    } else if (isError) {
      result = <Text>We couldn't fetch the details for this word.</Text>;
    } else {
      const dict = data?.dict!;
      const wordGroupOrNot = dict[lowercaseWord];
      if (isDictionaryWordGroup(wordGroupOrNot)) {
        const wordGroupObj = wordGroupOrNot;
        result = wordGroupObj.wordGroup.map((group) => <WordDetail key={group.id} definition={group} />);
      } else {
        result = <Text>Unfortunately this word does not exist in our dictionary. Sorry...</Text>;
      }

      return result;
    }
  };

  return (
    <View>
      {/* <View style={styles.container}> */}
      {/* <TouchableOpacity style={styles.overlay} onPress={onDismiss} activeOpacity={1} /> */}
      <ScrollView contentContainerStyle={styles.cardContainer}>
        <CloseIcon onPress={onDismiss} />
        <Title centered size="h4">
          Add to your list
        </Title>
        <View style={styles.actionsContainer}>
          <WordAddContainer onDismiss={onDismiss} selectedWord={selectedWord} />
        </View>
        <Divider />
        <View>
          <Text style={[styles.word, isActiveWord ? styles.activeWord : null]}>
            {selectedWord}
            {isActiveWord ? '*' : ''}
          </Text>
          {isActiveWord ? (
            <Text style={styles.activeWordDescription}>
              *This word is highlighted because it is being actively taught during this conversation.
            </Text>
          ) : null}
          {renderWordDetails()}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderWidth: 2,
    borderColor: 'red',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  cardContainer: {
    margin: 20,
    backgroundColor: Colors.primary[500],
    borderRadius: 10,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%',
  },
  word: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  activeWord: {
    color: Colors.yellow[600],
    marginBottom: 8,
  },
  activeWordDescription: {
    fontSize: 12,
    color: Colors.yellow[600],
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  actionsContainer: {
    marginTop: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    columnGap: 15,
  },
});

export default WordInfoCard;
