import FetchError from '../../common/feedback/FetchError';
import { useGetFriendProfileQuery } from '../../user/userApi';
import { IUserExperience } from '../types';
import ExperienceBar from './ExperienceBar';
import ExperienceBarSkeleton from './ExperienceBarSkeleton';

interface FriendExperienceBarProps {
  friendId: string;
}

const FriendExperienceBar = ({ friendId }: FriendExperienceBarProps) => {
  const {
    data: profileInfo,
    isLoading,
    isError,
    refetch: profileRefetch,
  } = useGetFriendProfileQuery(friendId);

  useFocusEffect(
    useCallback(() => {
      profileRefetch();
    }, [profileRefetch])
  );

  if (isLoading) {
    return <ExperienceBarSkeleton />;
  }

  if (isError || !profileInfo) {
    return <FetchError withNavigation={false} />;
  }

  return <ExperienceBar data={profileInfo.xp} />;
};

export default FriendExperienceBar;
