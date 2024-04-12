import { Dimensions } from 'react-native';
import { DEFAULT_GRAPH_HEIGHT, GRAPH_WIDTH_TO_SCREEN_WIDTH_RATIO } from './constants';

export const getGraphDimensions = () => {
  const screenWidth = Dimensions.get('window').width;
  return {
    width: screenWidth * GRAPH_WIDTH_TO_SCREEN_WIDTH_RATIO,
    height: DEFAULT_GRAPH_HEIGHT,
  };
};
