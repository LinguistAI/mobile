import { ActivityIndicator, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import { CollapsableContainer } from '../../../common/CollapsableContainer';
import { WordDefinition, WordWithConfidence } from '../types';
import { useState } from 'react';
import Colors from '../../../../theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { getWordMeanings } from '../../../../screens/word-list/WordList.service';
import { useQuery } from '@tanstack/react-query';
import { isEmptyObj } from 'openai/core';
import { isDictionaryWordGroup } from '../utils';
import WordDetail from './WordDetail';

interface WordDetailsInterface {
  word: WordWithConfidence;
}

const WordDetails = ({ word }: WordDetailsInterface) => {
  const [expanded, setExpanded] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['wordMeaning', word],
    queryFn: () => getWordMeanings([word.word]),
    staleTime: 1000000
  });

  const onItemPress = () => {
    setExpanded(!expanded);
  };

  const renderWordDetails = () => {
    let result = null;
    if (isLoading) {
      result = <ActivityIndicator />
    }
    else if (isError) {
      result = (
        <Text>
          We couldn't fetch the details for this word.
        </Text>
      )
    }
    else {
      const dict = data?.data?.dict!
      const wordGroupOrNot = dict[word.word]
      if (isDictionaryWordGroup(wordGroupOrNot)) {
        const wordGroupObj = wordGroupOrNot
        result = wordGroupObj.wordGroup.map(group => (
          <WordDetail 
            definition={group}
          />
        ))
      } else {
        result = (
          <Text>
            Unfortunately this word does not exist in our dictionary. Sorry...
          </Text>
        )
      }
    }

    return (
      <CollapsableContainer expanded={expanded}>
        {result}
      </CollapsableContainer>
    )
  }

  return (
    <View style={styles.wrap}>
      <TouchableWithoutFeedback onPress={onItemPress}>
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            {expanded ? (
              <Ionicons name="chevron-down" size={24} color="white" />
            ) : (
              <Ionicons name="chevron-forward" size={24} color="white" />
            )}
            <Text style={styles.word}>{word.word}</Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
      {renderWordDetails()}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: Colors.primary['300'],
    padding: 12,
    borderColor: Colors.primary['700'],
    borderWidth: 2,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerContainer: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  word: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  details: {
    marginTop: 10,
  },
  collapsibleHeader: {
    fontStyle: 'italic',
    fontWeight: 'bold',
    color: 'white',
    padding: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'white',
    fontSize: 16,
  },
  meaning: {
    fontStyle: 'italic',
  },
  example: {
    fontStyle: 'italic',
  },
});

export default WordDetails;
