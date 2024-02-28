import { FlatList, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { TChatBot } from "../types";
import BotProfile from "./BotProfile";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { selectConversations } from "../../../slices/chatSelectors";
import { useMutation } from "@tanstack/react-query";
import { createNewConversation } from "../Chat.service";
import { startConversation } from "../../../slices/chatSlice";

interface BotListsProps {
    bots: TChatBot[]
}

const BotLists = ({ bots }: BotListsProps) => {
    const navigation = useNavigation()
    const conversations = useSelector(selectConversations)
    const dispatch = useDispatch()

    const {mutateAsync: createConvo, isPending: pendingBotCreateResponse} = useMutation({
        mutationFn: (botId: string) => createNewConversation(botId),
        mutationKey: ["createNewConversation"]
    })
    
    const handleBotPress = async (bot: TChatBot) => {
        if (!pendingBotCreateResponse) {
            dispatch(startConversation({ bot }))
            const foundExistingConvo = conversations?.find((c) => c.bot.id === bot.id)

            if (foundExistingConvo) {
                navigation.navigate("ChatScreen", { conversationId: foundExistingConvo.id })
            }
            else {
                const response = await createConvo(bot.id)
                const convoId = response.data?.id
                if (!convoId) {return}
                navigation.navigate("ChatScreen", { conversationId: convoId })
            }
        }
    }

    const renderBots = () => {
        return (
            <FlatList 
                data={bots}
                renderItem={({ item }) => (
                    <Pressable onPress={() => handleBotPress(item)} style={styles.profile}>
                        <BotProfile bot={item}/>
                    </Pressable>
                )}
                contentContainerStyle={styles.botListContainer}
                keyExtractor={item => item.id}
            />
        )
    }
    
    return (
        <View style={styles.container}>
            {renderBots()}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
    },
    profile: {
        marginHorizontal: 12,
    },
    botListContainer: {
        gap: 15
    }
})
 
export default BotLists;