import React from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import CloseIcon from '../common/CloseIcon';
import Colors from '../../theme/colors';
import WordDetail from './word-list/words/WordDetail';
import { isDictionaryWordGroup } from './word-list/utils';
import Title from '../common/Title';
import Divider from '../common/Divider';
import { useGetWordMeaningsQuery } from './api';
import WordAddContainer from './WordAddContainer';

interface WordInfoCardProps {
  selectedWord: string;
  onDismiss: () => void;
}

const WordInfoCard = ({ selectedWord, onDismiss }: WordInfoCardProps) => {
  const { data, isFetching, isError } = useGetWordMeaningsQuery([selectedWord], { refetchOnFocus: false });

  const renderWordDetails = () => {
    let result = null;
    if (isFetching) {
      result = <ActivityIndicator />;
    } else if (isError) {
      result = <Text>We couldn't fetch the details for this word.</Text>;
    } else {
      const dict = data?.dict!;
      const wordGroupOrNot = dict[selectedWord];
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
      <ScrollView contentContainerStyle={styles.cardContainer}>
        <CloseIcon onPress={onDismiss} />
        <View>
          <Text style={styles.word}>{selectedWord}</Text>
          {renderWordDetails()}
        </View>
        <Divider />
        <Title fontSize="h4">Add to your list</Title>
        <View style={styles.actionsContainer}>
          <WordAddContainer onDismiss={onDismiss} selectedWord={selectedWord} />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
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
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    columnGap: 15,
  },
});

export default WordInfoCard;
