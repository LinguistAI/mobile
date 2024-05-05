import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Colors from '../../theme/colors';
import ActionIcon from '../common/ActionIcon';
import MultilineTextInput from '../common/form/MultilineTextInput';
import LText from '../common/Text';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { isRequestOptions } from 'openai/core';
import { useSendTranscriptionRequestMutation } from './api';
import useUser from '../../hooks/useUser';

interface ChatTextInputContainerProps {
  isPending: boolean;
  onSend: (text: string) => void;
}

const ChatTextInputContainer = (props: ChatTextInputContainerProps) => {
  const [text, setText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [audioPermission, setAudioPermission] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [sendAudio, { isLoading: isSendingTransLoading, isError: isSendingTransError, error: transError }] =
    useSendTranscriptionRequestMutation();
  const { user } = useUser();

  const startRecording = async () => {
    try {
      // needed for IoS
      if (audioPermission) {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });
      }

      const newRecording = new Audio.Recording();
      setIsRecording(true);
      console.log('Starting Recording');
      // await newRecording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);

      await newRecording.prepareToRecordAsync();
      await newRecording.startAsync();
      setRecording(newRecording);
    } catch (error) {
      console.error('Failed to start recording', error);
    }
  };

  const stopRecording = async () => {
    console.log('aloo');
    try {
      console.log('Stopping Recording??');
      if (isRecording && recording) {
        console.log('Stopping Recording');
        await recording!.stopAndUnloadAsync();
        const recordingUri = recording!.getURI();

        // Create a file name for the recording
        const fileName = `${user.username}-${Date.now()}-recording-.flac`;

        // Move the recording to the new directory with the new file name
        await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'recordings/', {
          intermediates: true,
        });
        await FileSystem.moveAsync({
          from: recordingUri!,
          to: FileSystem.documentDirectory + 'recordings/' + `${fileName}`,
        });

        const fileUri = FileSystem.documentDirectory + 'recordings/' + `${fileName}`;
        sendAudio({ key: { key: fileName }, audio: fileUri });

        // This is for simply playing the sound back
        const playbackObject = new Audio.Sound();
        await playbackObject.loadAsync({ uri: FileSystem.documentDirectory + 'recordings/' + `${fileName}` });
        await playbackObject.playAsync();

        // resert our states to record again
        setRecording(null);
        setIsRecording(false);
      }
    } catch (error) {
      console.error('Failed to stop recording', error);
    }
  };

  if (isSendingTransError) {
    console.log('of:', transError);
  }

  const cleanupRecording = async () => {
    try {
      console.log('Cleaning up recording');
      if (isRecording && recording) {
        await recording.stopAndUnloadAsync();
        setRecording(null);
        setIsRecording(false);
      }
    } catch (error) {
      console.error('Failed to cleanup recording', error);
    }
  };

  const deleteRecording = () => {
    cleanupRecording();
  };

  useEffect(() => {
    // Get recording permission from the user
    async function getPermission() {
      await Audio.requestPermissionsAsync()
        .then((permission) => {
          console.log('Permission Granted: ' + permission.granted);
          setAudioPermission(permission.granted);
        })
        .catch((error) => {
          console.log(error);
        });
    }

    // Call function to get permission
    getPermission();
    // Cleanup upon first render
    return () => {
      if (isRecording) {
        cleanupRecording();
      }
    };
  }, []);

  return (
    <View style={styles.innerBorder}>
      <View style={styles.innerContainer}>
        {isRecording ? null : (
          <View style={{ flex: 8 }}>
            <MultilineTextInput onChangeText={(text) => setText(text)} value={text} maxHeight={60} />
          </View>
        )}
        {text ? (
          <View style={{ flex: 1 }}>
            <ActionIcon
              loading={props.isPending}
              disabled={props.isPending}
              icon={
                <Ionicons
                  name="send"
                  size={24}
                  color={props.isPending ? Colors.gray[300] : Colors.primary[600]}
                />
              }
              onPress={() => {
                props.onSend(text);
                setText('');
              }}
            />
          </View>
        ) : (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {isRecording ? (
              <View style={styles.recordingContainer}>
                <ActionIcon
                  icon={<Ionicons name="trash" size={32} color={Colors.primary[600]} />}
                  onPress={() => deleteRecording()}
                  loading={props.isPending}
                  disabled={props.isPending}
                />
                <LText>Alo</LText>
                <ActionIcon
                  icon={<Ionicons name="stop" size={32} color={Colors.red[500]} />}
                  onPress={() => stopRecording()}
                  loading={props.isPending}
                  disabled={props.isPending}
                />
              </View>
            ) : (
              <ActionIcon
                icon={<Ionicons name="mic" size={32} color={Colors.primary[600]} />}
                onPress={() => startRecording()}
                loading={props.isPending}
                disabled={props.isPending}
              />
            )}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 10,
  },
  innerBorder: {
    borderWidth: 2,
    borderColor: Colors.gray[600],
    borderRadius: 24,
    paddingHorizontal: 16,
    backgroundColor: Colors.gray[0],
  },
  recordingContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between', // Adjust this as needed
    alignItems: 'center',
    paddingVertical: 8,
  },
});

export default ChatTextInputContainer;
