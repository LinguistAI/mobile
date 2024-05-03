import { WalkthroughStep } from '../../hooks/useWalkthrough';

export const CHAT_WALKTHROUGH_STEPS: WalkthroughStep[] = [
  {
    id: 'chat-general',
    content:
      'This is the chat screen. You can chat with the chatbot here. The chatbot will adapt to your language, hobbies, and interests as you talk.',
  },
  {
    id: 'chat-send-message',
    content: 'Type a message here and see the chatbot’s response.',
  },
  {
    id: 'chat-word-bank',
    content:
      'You can tap on any word in the chat to see its definition. Try tapping on a word in the chat to see its definition.',
  },
  {
    id: 'chat-settings',
    content:
      'You can access the settings by tapping on the settings icon on the top right corner of the screen.',
  },
  {
    id: 'chat-clear-conversation',
    content: 'You can clear the conversation by tapping on the clear conversation whenever you like.',
  },
  {
    id: 'chat-active-words',
    content:
      'Active words are words that are used frequently in the chat. You can tap on an active word to see its definition. Each conversation has its own set of active words.',
  },
  {
    id: 'chat-end',
    content: 'That’s it! You can now chat with the chatbot. Enjoy!',
  },
];
