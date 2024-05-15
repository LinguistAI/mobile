import { StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import { CollapsableContainer } from '../../../common/CollapsableContainer';
import { WordConfidence, WordWithConfidence } from '../types';
import { useState } from 'react';
import Colors from '../../../../theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { displayWordConfidence, isDictionaryWordGroup } from '../utils';
import WordDetail from './WordDetail';
import { useDeleteWordMutation, useGetWordMeaningsQuery } from '../../api';
import LoadingIndicator from '../../../common/feedback/LoadingIndicator';
import useError from '../../../../hooks/useError';
import { isDataResponse } from '../../../../services';
import useNotifications from '../../../../hooks/useNotifications';

interface WordDetailsCollapseInterface {
  word: WordWithConfidence;
  listId: string;
}

const WordDetailsCollapse = ({ word, listId }: WordDetailsCollapseInterface) => {
  const [expanded, setExpanded] = useState(false);

  const { data: wordMeanings, isLoading, isError } = useGetWordMeaningsQuery([word.word]);
  const [deleteWord, { isError: isDeleteWordError, error: deleteWordError }] = useDeleteWordMutation();
  useError(deleteWordError);

  const { add } = useNotifications();

  const onItemPress = () => {
    setExpanded(!expanded);
  };

  const renderWordConfidence = () => {
    const confidenceLevels = [
      WordConfidence.LOWEST,
      WordConfidence.LOW,
      WordConfidence.MODERATE,
      WordConfidence.HIGH,
      WordConfidence.HIGHEST,
    ];

    const currentConfidenceIndex = confidenceLevels.indexOf(word.confidence);
    const confidenceColor = (index: number) => {
      switch (index) {
        case 0:
          return Colors.red[500];
        case 1:
          return Colors.orange[500];
        case 2:
          return Colors.yellow[500];
        case 3:
          return Colors.green[500];
        case 4:
          return Colors.blue[500];
        default:
          return Colors.gray[400];
      }
    };

    return (
      <View style={styles.confidenceLabelContainer}>
        <Text style={[styles.confidenceLabelText, { color: confidenceColor(currentConfidenceIndex) }]}>
          {displayWordConfidence(word.confidence)}
        </Text>
        <View style={styles.confidenceContainer}>
          {confidenceLevels.map((level, index) => (
            <View
              key={level}
              style={[
                styles.confidenceCircle,
                {
                  backgroundColor:
                    index <= currentConfidenceIndex ? confidenceColor(currentConfidenceIndex) : 'transparent',
                },
              ]}
            />
          ))}
        </View>
      </View>
    );
  };

  const renderWordDetails = () => {
    let result = null;
    if (isLoading) {
      result = <LoadingIndicator subtext="Get ready to learn!" />;
    } else if (isError) {
      result = <Text>We couldn't fetch the details for this word.</Text>;
    } else if (!wordMeanings) {
      result = <Text>We couldn't fetch the details for this word.</Text>;
    } else {
      const dict = wordMeanings.dict!;
      const wordGroupOrNot = dict[word.word];
      if (isDictionaryWordGroup(wordGroupOrNot)) {
        const wordGroupObj = wordGroupOrNot;
        result = wordGroupObj.wordGroup.map((group) => <WordDetail key={group.id} definition={group} />);
      } else {
        result = <Text>Unfortunately this word does not exist in our dictionary. Sorry...</Text>;
      }
    }

    return <CollapsableContainer expanded={expanded}>{result}</CollapsableContainer>;
  };

  const onDelete = async () => {
    console.log(listId, word.word);
    const deleteResponse = await deleteWord({ listId: listId, word: word.word });
    console.log(deleteResponse);
    if (deleteWordError || isDeleteWordError || !isDataResponse(deleteResponse)) {
      return;
    }
    add({ type: 'success', body: 'Word deleted successfully.' });
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
            <View style={styles.wordInfoContainer}>
              <View>
                <Text style={styles.word}>{word.word}</Text>
              </View>
              <View style={styles.actionsContainer}>
                {renderWordConfidence()}
                <TouchableWithoutFeedback onPress={onDelete}>
                  <Ionicons name="trash" size={24} color="white" />
                </TouchableWithoutFeedback>
              </View>
            </View>
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
    borderRadius: 20,
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
    fontSize: 20,
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
  wordInfoContainer: {
    width: '90%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  confidenceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: 100,
  },
  confidenceCircle: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    borderColor: Colors.gray[0],
    borderWidth: 1,
  },
  filledCircle: {
    backgroundColor: Colors.yellow[500],
  },
  emptyCircle: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'white',
  },
  confidenceLabelContainer: {
    alignItems: 'center',
    marginBottom: 5,
  },
  confidenceLabelText: {
    color: 'white',
    fontSize: 14,
    marginBottom: 3,
    fontWeight: 'bold',
  },
});

export default WordDetailsCollapse;
