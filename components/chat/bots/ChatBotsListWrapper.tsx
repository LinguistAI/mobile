import { ActivityIndicator, View } from "react-native";
import BotLists from "./BotLists";
import { getAvailableBots } from "../Chat.service";
import { useQuery } from "@tanstack/react-query";
import FetchFailErrorScreen from "../../../screens/common/FetchFailErrorScreen";

const ChatBotsListsWrapper = () => {
    const { data: bots, isPending: botsAreLoading, isError: botFetchFailed } = useQuery({
        queryKey: ["getAvailableChatbots"],
        queryFn: () => getAvailableBots()
    })

    if (botsAreLoading) {
        return <ActivityIndicator />;
    }

    if (botFetchFailed || !bots?.data) {
        return <FetchFailErrorScreen />
    }

    return (
        <View>
            <BotLists bots={bots.data}/>
        </View>
    );
}
 
export default ChatBotsListsWrapper;