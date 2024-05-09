import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  View,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import useLatestConversationDetails from '../../../hooks/useLatestConversationDetails';
import { useSelector } from 'react-redux';
import { selectCurrentConversation } from '../../../redux/chatSelectors';
import ActiveWordCard from './ActiveWordCard';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../../theme/colors';

type LayoutEvent = NativeSyntheticEvent<{ layout: { width: number; height: number } }>;

const isCloseToRight = ({ layoutMeasurement, contentOffset, contentSize }: NativeScrollEvent) => {
  const paddingToRight = 30;
  return layoutMeasurement.width + contentOffset.x >= contentSize.width - paddingToRight;
};

const isAwayFromLeft = ({ contentOffset }: NativeScrollEvent) => {
  return contentOffset.x > 10;
};

const ActiveWordsRow: React.FC = () => {
  const conversation = useSelector(selectCurrentConversation);
  const { latestConvoDetails } = useLatestConversationDetails(conversation);
  const [viewWidth, setViewWidth] = useState<number>(0);
  const [closeToRight, setCloseToRight] = useState<boolean>(false);
  const [closeToLeft, setCloseToLeft] = useState<boolean>(true);
  const [showScrollIcons, setShowScrollIcons] = useState<boolean>(true);
  const deviceWidth = Dimensions.get('screen').width;

  useEffect(() => {
    let timeout: NodeJS.Timeout | null = null;
    if (showScrollIcons) {
      timeout = setTimeout(() => {
        setShowScrollIcons(false);
      }, 3000);
    }
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [showScrollIcons]);

  const handleLayout = (e: LayoutEvent) => {
    setViewWidth(e.nativeEvent.layout.width);
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (isCloseToRight(event.nativeEvent)) {
      setCloseToRight(true);
    } else {
      setCloseToRight(false);
    }

    if (isAwayFromLeft(event.nativeEvent)) {
      setCloseToLeft(false);
    } else {
      setCloseToLeft(true);
    }

    setShowScrollIcons(true);
  };

  const renderRightScroll = () => {
    if (viewWidth >= deviceWidth && !closeToRight && showScrollIcons) {
      return (
        <Ionicons
          name="caret-forward-outline"
          color={Colors.gray[800]}
          style={styles.rightScrollIndicator}
          size={24}
        />
      );
    }

    return null;
  };

  const renderLeftScroll = () => {
    if (!closeToLeft && showScrollIcons) {
      return <Ionicons name="caret-back-outline" style={styles.leftScrollIndicator} size={24} />;
    }

    return null;
  };

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <ScrollView onScroll={handleScroll} horizontal showsHorizontalScrollIndicator={false}>
        <View onLayout={handleLayout} style={styles.cardContainer}>
          {latestConvoDetails?.unknownWords.map((word) => <ActiveWordCard key={word.id} word={word.word} />)}
        </View>
      </ScrollView>
      {renderLeftScroll()}
      {renderRightScroll()}
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    alignItems: 'center',
    paddingHorizontal: 8,
    marginRight: 8,
  },
  rightScrollIndicator: {
    position: 'absolute',
    right: 0,
    marginRight: 4,
    backgroundColor: 'transparent',
  },
  leftScrollIndicator: {
    position: 'absolute',
    left: 0,
    marginLeft: 4,
    backgroundColor: 'transparent',
  },
});

export default ActiveWordsRow;
