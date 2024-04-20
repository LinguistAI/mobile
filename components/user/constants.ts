import { ConversationStep } from './types';

export const HOBBIES_LIST = [
  { label: 'Sports', value: 'Sports' },
  { label: 'Reading', value: 'Reading' },
  { label: 'Gardening', value: 'Gardening' },
  { label: 'Cooking', value: 'Cooking' },
  { label: 'Baking', value: 'Baking' },
  { label: 'Photography', value: 'Photography' },
  { label: 'Writing', value: 'Writing' },
  { label: 'Drawing', value: 'Drawing' },
  { label: 'Painting', value: 'Painting' },
  { label: 'Knitting', value: 'Knitting' },
  { label: 'Crocheting', value: 'Crocheting' },
  { label: 'Fishing', value: 'Fishing' },
  { label: 'Hiking', value: 'Hiking' },
  { label: 'Cycling', value: 'Cycling' },
  { label: 'Bird Watching', value: 'Bird Watching' },
  { label: 'Astronomy', value: 'Astronomy' },
  {
    label: 'Playing Musical Instruments',
    value: 'Playing Musical Instruments',
  },
  { label: 'Singing', value: 'Singing' },
  { label: 'Dancing', value: 'Dancing' },
  { label: 'Yoga', value: 'Yoga' },
  { label: 'Meditation', value: 'Meditation' },
  { label: 'Collecting', value: 'Collecting' },
  { label: 'Model Building', value: 'Model Building' },
  { label: 'DIY Projects', value: 'DIY Projects' },
  { label: 'Video Gaming', value: 'Video Gaming' },
  { label: 'Board Gaming', value: 'Board Gaming' },
  { label: 'Puzzle Solving', value: 'Puzzle Solving' },
  { label: 'Traveling', value: 'Traveling' },
  { label: 'Learning New Languages', value: 'Learning New Languages' },
  { label: 'Volunteering', value: 'Volunteering' },
];

export const ENGLISH_LEVELS = [
  { value: "DON'T KNOW", label: "I don't know" },
  { value: 'BEGINNER', label: 'Beginner' },
  { value: 'INTERMEDIEAET', label: 'Intermediate' },
  { value: 'ADVANCED', label: 'Advanced' },
  { value: 'NATIVE', label: 'Native' },
];

export const BOT_MESSAGES: ConversationStep[] = [
  {
    id: 0,
    message:
      "Hi, I'm Luna. Your personal language learning assistant. I'm here to help you learn English. What's your name?",
    skippedMsg: "Okay, let's skip that for now. What's your name?",
    skippable: true,
    name: 'name',
    trigger: 1,
    type: 'text',
  },
  {
    id: 1,
    message: 'Nice to meet you! How old are you?',
    skippedMsg: "Okay, let's skip that for now. How old are you?",
    skippable: true,
    name: 'age',
    trigger: 2,
    type: 'date',
  },
  {
    id: 2,
    message:
      "That's amazing! I was just developed this year, I am new to this world. Why don't you tell me what you would like to do in your free time?",
    skippedMsg: 'Fine, we can skip that. What do you like to do in your free time?',
    skippable: true,
    name: 'hobbies',
    trigger: 3,
    options: HOBBIES_LIST,
    multiple: true,
    type: 'multiple-choice',
  },
  {
    id: 3,
    message:
      'Cool! I am still figuring out what I like, but I LOVE talking to people. By the way, how well do you think your English is?',
    skippedMsg: "Alright, let's skip that. What is your current English level?",
    options: ENGLISH_LEVELS,
    name: 'englishLevel',
    skippable: true,
    trigger: -1,
    type: 'multiple-choice',
  },
  {
    id: -1,
    message: "Great, Nice to meet you again! I'll be in touch soon to help you learn English!",
    skippedMsg: "It's okay, we can continue later. Nice to meet you!",
    skippable: false,
    name: 'end',
    trigger: -1,
    type: '',
  },
];
