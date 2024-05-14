import { StyleSheet, Text, View } from 'react-native';
import { IDictionaryWordGroup } from '../types';
import Colors from '../../../../theme/colors';

interface WordDetailProps {
  definition: IDictionaryWordGroup;
}

const WordDetail = ({ definition }: WordDetailProps) => {
  const { audio, func_label, phonetic, meaning } = definition;

  const renderExamples = (examples: string[] | string | undefined | null) => {
    if (!examples || examples.length === 0) {
      return null;
    }

    if (typeof examples === 'string') {
      return <Text style={styles.example}>{examples}</Text>;
    }

    return examples.map((e, index) => (
      <Text style={styles.example} key={e}>
        {index + 1} - {e}
      </Text>
    ));
  };

  const renderDefinition = (def: string[]) => {
    return def.toString().replace(/{[^}]*}/g, ' ');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.wordType}>
        {func_label} {phonetic ? `- ${phonetic}` : ''}
      </Text>
      {meaning.map((m, index) => {
        return (
          <View key={m.definition.toString()} style={styles.definitionContainer}>
            <View style={styles.meaningContainer}>
              <Text style={styles.meaning}>{renderDefinition(m.definition)}</Text>
            </View>
            <View style={styles.examplesContaienr}>{renderExamples(m.examples)}</View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  wordType: {
    fontStyle: 'italic',
    fontSize: 20,
    borderBottomColor: Colors.gray[600],
    borderBottomWidth: 2,
    fontWeight: 'bold',
  },
  definitionContainer: {
    marginTop: 10,
    marginBottom: 10,
  },
  meaning: {
    fontSize: 16,
    color: Colors.gray[800],
    fontWeight: 'bold',
  },
  meaningContainer: {
    marginTop: 5,
  },
  examplesContaienr: {
    paddingLeft: 15,
    marginTop: 10,
  },
  example: {
    fontStyle: 'italic',
  },
});

export default WordDetail;
