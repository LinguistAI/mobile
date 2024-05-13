import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated } from 'react-native';
import ReactNativeModal from 'react-native-modal';
import Colors from '../../theme/colors';
import { useDispatch, useSelector } from 'react-redux';
import { selectIsLevelUpModalOpen, selectLevelUpModalConfig } from '../../redux/chatSelectors';
import { setLevelUpModalConfig } from '../../redux/chatSlice';
import AnimatedLottieView from 'lottie-react-native';
import LText from '../common/Text';
import UserExperienceBar from '../gamification/experience/UserExperienceBar';

const LevelUpModal = () => {
  const isLevelUpModalVisible = useSelector(selectIsLevelUpModalOpen);
  const config = useSelector(selectLevelUpModalConfig);
  const dispatch = useDispatch();

  const newLevelScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isLevelUpModalVisible) {
      // Animate the new level scale
      Animated.sequence([
        Animated.timing(newLevelScale, {
          toValue: 1.5,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(newLevelScale, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      newLevelScale.setValue(1);
    }
  }, [isLevelUpModalVisible, newLevelScale]);

  const handleCancel = () => {
    dispatch(setLevelUpModalConfig({ ...config, visible: false }));
  };

  return (
    <ReactNativeModal isVisible={isLevelUpModalVisible} onBackdropPress={handleCancel}>
      <View style={styles.container}>
        <AnimatedLottieView
          style={styles.lottie}
          autoPlay
          loop
          source={require('../../assets/lottie/level-up.json')}
          speed={1}
        />
        <View style={styles.levelDisplayFeedback}>
          <LText style={styles.levelText}>You reached level</LText>
          <Animated.Text
            style={[
              styles.newLevel,
              {
                transform: [{ scale: newLevelScale }],
              },
            ]}
          >
            {config.newLevel}!
          </Animated.Text>
        </View>
      </View>
    </ReactNativeModal>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.gray[100],
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  lottie: {
    width: 250,
    height: 250,
    alignSelf: 'center',
  },
  levelDisplayFeedback: {
    alignItems: 'center',
    marginTop: 16,
  },
  levelText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.gray[800],
  },
  newLevel: {
    fontSize: 80,
    fontWeight: 'bold',
    color: Colors.primary[700],
  },
});

export default LevelUpModal;
