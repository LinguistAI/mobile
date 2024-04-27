import { useState } from 'react';
import { Platform, StyleSheet, TextInput, TextInputProps, View } from 'react-native';
import Colors from '../../../theme/colors';

interface MultilineTextInputProps extends TextInputProps {
  onChangeText: (text: string) => void;
  value: string;
  maxHeight?: number;
}

const MultilineTextInput = (props: MultilineTextInputProps) => {
  const [height, setHeight] = useState(0);

  const inputHeight = Math.max(props.maxHeight ?? 35, height);
  return (
    <View
      style={{
        height: inputHeight,
        marginTop: Platform.OS === 'ios' ? 10 : 0,
      }}
    >
      <TextInput
        {...props}
        placeholder="Type a message..."
        value={props.value}
        multiline={true}
        onChangeText={props.onChangeText}
        onContentSizeChange={(event) => setHeight(event.nativeEvent.contentSize.height)}
        style={[
          styles.input,
          {
            height: inputHeight,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    fontSize: 16,
    color: Colors.gray[900],
    padding: 0,
  },
});

export default MultilineTextInput;
