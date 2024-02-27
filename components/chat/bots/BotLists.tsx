import { FlatList, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { TChatBot } from "../types";
import BotProfile from "./BotProfile";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { selectConversations } from "../../../slices/chatSelectors";
import { useMutation } from "@tanstack/react-query";
import { createNewConversation } from "../Chat.service";

interface BotListsProps {
    bots: TChatBot[]
}

const BotLists = ({ bots }: BotListsProps) => {
    const navigation = useNavigation()
    const conversations = useSelector(selectConversations)

    const {mutateAsync: createConvo, isPending: pendingBotCreateResponse} = useMutation({
        mutationFn: (botId: string) => createNewConversation(botId),
        mutationKey: ["createNewConversation"]
    })
    
    const handleBotPress = async (botId: string) => {
        if (!pendingBotCreateResponse) {
            console.log(conversations)
            const foundExistingConvo = conversations.find((c) => c.bot.id === botId)
    
            if (foundExistingConvo) {
                navigation.navigate("ChatScreen", { conversationId: foundExistingConvo.id })
            }
            else {
                const response = await createConvo(botId)
                console.log(response)
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
                    <Pressable onPress={() => handleBotPress(item.id)} style={styles.profile}>
                        <BotProfile bot={item}/>
                    </Pressable>
                )}
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
        marginHorizontal: 12
    }
})
 
export default BotLists;