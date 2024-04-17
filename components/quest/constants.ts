import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;
export const BAR_WIDTH = screenWidth * 0.7;
export const BAR_HEIGHT = 20;
export const EMPTY_BAR_FILL = 1 / 30;
export const QUEST_TYPE_WORD = 'WORD';
export const QUEST_TYPE_MESSAGE = 'MESSAGE';
export const QUEST_ICON_SIZE = 60;
