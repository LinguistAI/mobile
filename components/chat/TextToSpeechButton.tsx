import { Ionicons } from '@expo/vector-icons';
import ActionIcon from '../common/ActionIcon';
import Colors from '../../theme/colors';
import { useState } from 'react';
import { useLazyGetSpeechQuery } from './api';
import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';
import { useSelector } from 'react-redux';
import { selectCurrentBot } from '../../redux/chatSelectors';

interface TextToSpeechButtonProps {
  text: string;
  isSentByUser: boolean;
  messageId?: string;
}

type TextToSpeechState = 'playing' | 'synthesizing' | 'idle';

const TextToSpeechButton = ({ text, isSentByUser, messageId }: TextToSpeechButtonProps) => {
  const [state, setState] = useState<TextToSpeechState>('idle');
  const currentBot = useSelector(selectCurrentBot);

  const [getSpeech, {}] = useLazyGetSpeechQuery();

  const handleTextToSpeechLocally = async () => {
    Speech.speak(text);
  };

  const handleTextToSpeech = async () => {
    setState('synthesizing');
    if (!messageId) {
      handleTextToSpeechLocally();
      setState('idle');
      return;
    }

    try {
      const response = await getSpeech({ messageId, text, pollyVoiceId: currentBot?.voiceCharacteristics });
      // Implement text to speech functionality here
      const audio = response.data?.audio;
      if (!audio) {
        setState('idle');
        return;
      }

      setState('playing');
      await playBase64(audio);
    } catch {
      handleTextToSpeechLocally();
    }

    setState('idle');
  };

  const playBase64 = async (base64: string) => {
    const { sound } = await Audio.Sound.createAsync({ uri: `data:audio/mp3;base64,${base64}` });
    await sound.playAsync();
  };

  return (
    <ActionIcon
      icon={
        <Ionicons
          name="volume-medium"
          size={32}
          color={isSentByUser ? Colors.gray['100'] : Colors.primary['500']}
        />
      }
      loading={state === 'synthesizing'}
      onPress={handleTextToSpeech}
    />
  );
};

export default TextToSpeechButton;
