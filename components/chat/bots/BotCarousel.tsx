import { Dimensions, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { useCreateNewConversationMutation, useGetAllConversationsQuery, useGetAvailableBotsQuery } from '../api';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import { LinearGradient } from 'expo-linear-gradient';
import BotProfile from './BotProfile';
import FetchError from '../../common/FetchError';
import Colors from '../../../theme/colors';
import { AirbnbRating } from 'react-native-ratings';
import { getDifficultyLevel } from './utils';
import { TChatBot } from '../types';
import { useNavigation } from '@react-navigation/native';
import useNotifications from '../../../hooks/useNotifications';
import { generateErrorResponseMessage } from '../../../utils/httpUtils';
import { useDispatch } from 'react-redux';
import { startConversation } from '../../../redux/chatSlice';
import { isDataResponse } from '../../../services';

const BotCarouselShimmer = () => {
  const width = Dimensions.get('window').width;
  const height = width / 2;
  return (
    <View>
      <ShimmerPlaceholder
        LinearGradient={LinearGradient}
        style={[
          shimmerStyles.botCardShimmer,
          {
            width: width - 20,
            height,
          },
        ]}
      />
    </View>
  );
};

const shimmerStyles = StyleSheet.create({
  botCardShimmer: {
    borderRadius: 10,
    margin: 10,
  },
});

const BotCarousel = () => {
  const {
    data: conversations,
    isFetching: isFetchingConversations,
    isError: conversationsNotLoaded,
  } = useGetAllConversationsQuery();
  const { data: bots, isFetching: isFetchingBots, isError: botsLoadError } = useGetAvailableBotsQuery();
  const [createConvo, { isLoading: pendingBotCreateResponse, error: createConversationError }] =
    useCreateNewConversationMutation();
  const navigation = useNavigation();
  const { add: notify } = useNotifications();
  const dispatch = useDispatch();

  const width = Dimensions.get('window').width;
  const itemHeight = width * 0.4; // Set a fixed height for each item
  if (isFetchingBots) {
    return <BotCarouselShimmer />;
  }

  if (!bots || botsLoadError) {
    return <FetchError />;
  }

  const handleBotPress = async (bot: TChatBot) => {
    if (!pendingBotCreateResponse) {
      const foundExistingConvo = conversations?.find((c) => c.bot.id === bot.id);

      if (foundExistingConvo) {
        navigation.navigate('Chat', { params: { conversationId: foundExistingConvo.id }, screen: 'ChatScreen' });
      } else {
        const response = await createConvo(bot.id);

        if (isDataResponse(response)) {
          const data = response.data;
          const convoId = data.id;
          if (!convoId) {
            return;
          }
          navigation.navigate('Chat', { params: { conversationId: convoId }, screen: 'ChatScreen' });
        } else {
          notify({
            body: generateErrorResponseMessage(createConversationError, 'Error creating conversation'),
            type: 'error',
          });
        }
      }
      dispatch(startConversation({ bot }));
    }
  };

  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <Carousel
        loop
        width={width * 0.95}
        height={itemHeight}
        autoPlay={true}
        autoPlayInterval={3000}
        data={bots}
        scrollAnimationDuration={1000}
        pagingEnabled={true}
        mode="parallax"
        renderItem={({ item }) => (
          <Pressable onPress={() => handleBotPress(item)} style={{ flex: 1 }}>
            <View
              style={{
                height: itemHeight,
                borderColor: Colors.primary[500],
                borderWidth: 2,
                backgroundColor: Colors.gray[0],
                borderRadius: 8,
                flex: 1,
                marginHorizontal: '2.5%',
              }}
            >
              <BotProfile bot={item} simple />
            </View>
          </Pressable>
        )}
      />
    </View>
  );
};

export default BotCarousel;
