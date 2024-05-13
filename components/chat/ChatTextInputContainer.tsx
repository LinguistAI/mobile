import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import Colors from '../../theme/colors';
import ActionIcon from '../common/ActionIcon';
import MultilineTextInput from '../common/form/MultilineTextInput';
import LText from '../common/Text';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import useUser from '../../hooks/useUser';
import { useLazyGetTranscriptionResultQuery, useSendTranscriptionRequestMutation } from './api';
import { isDataResponse } from '../../services';
import useNotifications from '../../hooks/useNotifications';

interface ChatTextInputContainerProps {
  isPending: boolean;
  onSend: (text: string) => void;
}

const ChatTextInputContainer = (props: ChatTextInputContainerProps) => {
  const [text, setText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [audioPermission, setAudioPermission] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [
    mutate,
    { isLoading: isLoadingTransRequest, isError: isErrorTransRequest, error: errorTransRequest },
  ] = useSendTranscriptionRequestMutation();
  const [
    trigger,
    { data: transData, isError: isErrorTransResult, isFetching: isLoadingTransResult, error: errorTransData },
  ] = useLazyGetTranscriptionResultQuery();
  const { add: addNotification } = useNotifications();

  const { user } = useUser();
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = async () => {
    try {
      // Needed for IoS
      if (audioPermission) {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });
      }

      const newRecording = new Audio.Recording();
      setIsRecording(true);

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
      if (isRecording && recording) {
        cleanInterval();

        await recording.stopAndUnloadAsync();
        const recordingUri = recording.getURI();
        const audioBase64 = await FileSystem.readAsStringAsync(recordingUri!, {
          encoding: FileSystem.EncodingType.Base64,
        });

        const fileName = `${user.username}-${Date.now()}-recording.3gp`;

        setRecording(null);
        setIsRecording(false);
        let currentJobName = '';

        try {
          const transRequestData = await mutate({
            audio: audioBase64,
            key: {
              key: fileName,
            },
          });

          currentJobName = transRequestData?.data.jobName;
        } catch (error) {
          addNotification({
            time: 800,
            body: 'There was an error recording your voice. You can try again later on.',
            type: 'error',
          });
          console.log('Error in sending audio recording:', error);
          return;
        }

        try {
          // After request is sent successfully, retrieve the transcription
          const transResult = await trigger({ jobName: currentJobName });

          setText(transResult?.data?.result[0].transcript || '');
        } catch (error) {
          console.log('Error in retrieving transcription:', error);
          addNotification({
            time: 800,
            body: 'There was an error recording your voice. You can try again later on.',
            type: 'error',
          });
        }

        // Since this part is really fun I couldn't delete it :)
        // const playbackObject = new Audio.Sound();
        // await playbackObject.loadAsync({ uri: recordingUri! });
        // await playbackObject.playAsync();
      }
    } catch (error) {
      console.error('Failed to stop recording', error);
    }
  };

  const cleanupRecording = async () => {
    try {
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
        clearInterval(intervalRef?.current!);
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
            ) : isLoadingTransRequest || isLoadingTransResult ? (
              <ActivityIndicator size={24} color={Colors.primary[100]} />
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
});

export default ChatTextInputContainer;
