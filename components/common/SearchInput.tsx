import { StyleSheet, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../theme/colors';
import { useState } from 'react';
import ActionIcon from '../common/ActionIcon';

interface SearchInputProps {
  searchText: string;
  onChangeText: (text: string) => void;
  onClear: () => void;
  onSearch: () => void;
  placeholder?: string;
}

const SearchInput = ({ searchText, placeholder, onChangeText, onClear, onSearch }: SearchInputProps) => {
  return (
    <View style={styles.inputRoot}>
      <View style={[styles.inputContainer]}>
        <ActionIcon
          icon={<Ionicons name="search-outline" size={24} color={Colors.primary[600]} />}
          onPress={onSearch}
        />
        <TextInput
          style={[styles.textInput, searchText === '' ? { flexBasis: '85%' } : null]}
          onChangeText={onChangeText}
          value={searchText}
          placeholder={placeholder ?? 'Type something...'}
        />
        {searchText !== '' && (
          <View style={{ alignSelf: 'center', marginRight: 20 }}>
            <ActionIcon
              icon={<Ionicons name="close-outline" size={24} color={Colors.primary[600]} />}
              onPress={onClear}
            />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  textInput: {
    flexBasis: '78%',
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
    height: 50,
    borderWidth: 2,
    borderBottomColor: Colors.primary[500],
    borderTopColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    color: Colors.gray[600],
  },
});

export default SearchInput;
