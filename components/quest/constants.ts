import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;
export const BAR_WIDTH = screenWidth * 0.7;
export const BAR_HEIGHT = 20;
export const EMPTY_BAR_FILL = 1 / 30;
export const QUEST_TYPE_WORD = 'WORD';
export const QUEST_TYPE_MESSAGE = 'MESSAGE';
export const QUEST_ICON_SIZE = 60;
export const SECONDS_IN_MILLIS = 1000;
export const MINUTES_IN_MILLIS = SECONDS_IN_MILLIS * 60;
export const HOURS_IN_MILLIS = MINUTES_IN_MILLIS * 60;
export const DAYS_IN_MILLIS = HOURS_IN_MILLIS * 24;
export const QUEST_DONE_TEXT = 'Done';
export const QUEST_DONE_ICON_SIZE = 25;