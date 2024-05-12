import { useDispatch } from 'react-redux';
import { TConversation } from '../components/chat/types';
import { useGetConversationQuery } from '../components/chat/api';
import { useEffect } from 'react';
import { updateSelectedConversation } from '../redux/chatSlice';

const useLatestConversationDetails = (conversation: TConversation | null) => {
  const dispatch = useDispatch();

  const { data: latestConvoDetails, isLoading } = useGetConversationQuery(conversation?.id, {
    skip: !conversation,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (latestConvoDetails) {
      dispatch(updateSelectedConversation({ conversation: latestConvoDetails }));
    }
  }, [latestConvoDetails]);

  return { latestConvoDetails, isLoading };
};

export default useLatestConversationDetails;
