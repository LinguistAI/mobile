import { FlatList, ScrollView } from "react-native";
import { TConversation } from "../types";
import { useSelector } from "react-redux";
import { selectConversations } from "../../../slices/chatSelectors";

interface ConversationListProps {
    conversations: TConversation[]
}

const ConversationList = () => {
    const conversations = useSelector(selectConversations)

    const renderConversation = (item: TConversation) => {
        return null
    }

    return (
        <FlatList
            data={conversations}
            renderItem={({item}) => renderConversation(item)}
        />
    );
}
 
export default ConversationList;