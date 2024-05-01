import FetchError from '../../common/feedback/FetchError';
import { useGetUserExperienceQuery } from '../api';
import ExperienceBar from './ExperienceBar';
import ExperienceBarSkeleton from './ExperienceBarSkeleton';

const UserExperienceBar = () => {
  const { data, isLoading, isError } = useGetUserExperienceQuery();

  if (isLoading) {
    return <ExperienceBarSkeleton />;
  }

  if (isError || !data) {
    return <FetchError withNavigation={false} />;
  }

  return <ExperienceBar data={data} />;
};

export default UserExperienceBar;
