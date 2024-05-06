import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Colors from '../../theme/colors';
import ActionIcon from '../common/ActionIcon';
import MultilineTextInput from '../common/form/MultilineTextInput';
import LText from '../common/Text';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { isRequestOptions } from 'openai/core';
import useUser from '../../hooks/useUser';
import { decode as atob, encode as btoa } from 'base-64';
import { useSendTranscriptionRequestMutation } from './api';

interface ChatTextInputContainerProps {
  isPending: boolean;
  onSend: (text: string) => void;
}

const ChatTextInputContainer = (props: ChatTextInputContainerProps) => {
  const [text, setText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [audioPermission, setAudioPermission] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [mutate, { isLoading, isError }] = useSendTranscriptionRequestMutation();
  const { user } = useUser();
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

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

      // Start the timer
      intervalRef.current = setInterval(() => {
        setElapsedTime((prevElapsedTime) => prevElapsedTime + 1);
      }, 1000);
    } catch (error) {
      console.error('Failed to start recording', error);
    }
  };

  const stopRecording = async () => {
    try {
      console.log('Stopping Recording??');
      if (isRecording && recording) {
        console.log('Stopping Recording');
        cleanInterval();

        await recording!.stopAndUnloadAsync();
        const recordingUri = recording!.getURI();

        // reset our states to record again
        setRecording(null);
        setIsRecording(false);

        // Create a file name for the recording
        const fileName = `${user.username}-${Date.now()}-recording.mp3`;

        // Move the recording to the new directory with the new file name
        await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'recordings/', {
          intermediates: true,
        });
        const fileUri = FileSystem.documentDirectory + 'recordings/' + `${fileName}`;

        await FileSystem.moveAsync({
          from: recordingUri!,
          to: fileUri,
        });

        const recordingData = await FileSystem.readAsStringAsync(fileUri!, {
          encoding: FileSystem.EncodingType.Base64,
        });

        console.log('sending data:', recordingData);

        // const response = await FileSystem.uploadAsync(
        //   `https://oy0r09kq6c.execute-api.eu-central-1.amazonaws.com/test/transcribe?key=${fileName}`,
        //   fileUri
        // );

        // console.log('ressponse:', response);

        try {
          mutate({ key: { key: fileName }, audio: recordingData });
        } catch (error) {
          console.log('alo eror var:', error);
        }

        // const fileInfo = await FileSystem.getInfoAsync(fileUri!);
        // if (fileInfo.exists) {
        //   const fileArray = await FileSystem.readAsStringAsync(fileUri!, {
        //     encoding: FileSystem.EncodingType.Base64,
        //   });

        // console.log(base64ToByteArray(fileArray));

        // Send the audio file as a byte array
        // sendAudio({ key: { key: fileName }, audio: base64ToByteArray(fileArray) });
        // } else {
        //   console.error('Recording file does not exist');
        // }
        // This is for simply playing the sound back
        const playbackObject = new Audio.Sound();
        await playbackObject.loadAsync({ uri: fileUri });
        await playbackObject.playAsync();

        // resert our states to record again
        // setRecording(null);
        // setIsRecording(false);
      }
    } catch (error) {
      console.error('Failed to stop recording', error);
    }
  };

  // does not work
  // if (isSendingTransError) {
  //   console.log('of:', transError);
  // }

  function base64ToByteArray(base64String: string) {
    var binaryString = atob(base64String);
    var byteArray = new Uint8Array(binaryString.length);

    for (var i = 0; i < binaryString.length; i++) {
      byteArray[i] = binaryString.charCodeAt(i);
    }

    return byteArray;
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

  const cleanInterval = () => {
    clearInterval(intervalRef.current!);
    setElapsedTime(0);
    intervalRef.current = null;
  };

  const deleteRecording = () => {
    cleanupRecording();
    cleanInterval();
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
        clearInterval();
      }
    };
  }, []);

  const formatTimeElapsed = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  };

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
                <LText size={18}>{`Recording: ${formatTimeElapsed(elapsedTime)}`}</LText>
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
