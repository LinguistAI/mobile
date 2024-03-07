import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { TConversation } from "../types";
import { useSelector } from "react-redux";
import { selectConversations } from "../../../slices/chatSelectors";
import Colors from "../../../theme/colors";
import Avatar from "../../common/Avatar";
import { useEffect, useState } from "react";
import { getLastMessages } from "../../../utils";
import { LastMessageObject } from "../../../hooks/useChatMessages";
import { useNavigation } from "@react-navigation/native";


const ConversationList = () => {
    const [lastMessages, setLastMessages] = useState<LastMessageObject>({})
    console.log(lastMessages)
    const conversations = useSelector(selectConversations)
    const navigation = useNavigation()

    useEffect(() => {
        const initLastMessages = async () => {
            const lastMsgs = await getLastMessages()
            setLastMessages(lastMsgs)
        }

        initLastMessages()
    }, [])

    const handleConversationClick = (id: string) => {
        navigation.navigate("ChatScreen", { conversationId: id })
    }

    const getLastMessage = (conversationId: string) => {
        if (lastMessages[conversationId]) {
            console.log(conversationId)
            const lastMessageInfo = lastMessages[conversationId]
            return lastMessageInfo.msg
        }
        
        return ""
    }

    const renderConversation = (item: TConversation) => {
        return (
            <Pressable onPress={() => handleConversationClick(item.id)}>
                <View style={styles.cardContainer}>
                    <View style={styles.conversationRowContainer}>
                        <Avatar 
                            src={item.bot.profileImage}
                            width={40}
                            height={40}
                        />
                        <View style={styles.conversationInfoContainer}>
                            <Text style={styles.conversationTitle}>{item.title}</Text>
                            <Text style={styles.conversationLastMessage}></Text>
                        </View>
                        <View>
                            
                        </View>
                    </View>
                </View>
            </Pressable>
        )
    }

    return (
        <FlatList
            data={conversations}
            renderItem={({item}) => renderConversation(item)}
        />
    );
}

const styles = StyleSheet.create({
    cardContainer: {
        flex: 1,
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderColor: Colors.gray[300]
    },
    conversationRowContainer: {
        display: "flex",
        flexDirection: 'row',
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 15
    },
    conversationInfoContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start"
    },
    conversationTitle: {
        fontWeight: "bold"
    },
    conversationLastMessage: {
        fontSize: 13,
        fontWeight: "300"
    },
    conversationTimestamp: {

    }
})
 
export default ConversationList;