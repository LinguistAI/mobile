import { ActivityIndicator, StyleSheet, View } from "react-native";
import ConversationList from "./ConversationList";
import { useEffect, useState } from "react";
import FloatingButton from "../../common/FloatingButton";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../../theme/colors";
import { useQuery } from "@tanstack/react-query";
import { getAllConversations, getAvailableBots } from "../Chat.service";
import FetchFailErrorScreen from "../../../screens/common/FetchFailErrorScreen";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { conversationsInitialized } from "../../../slices/chatSlice";

const ConversationsWrapper = () => {
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const { data: conversations, isLoading: conversationsAreLoading, isError: conversationFetchFailed } = useQuery({
        queryKey: ["getAllConversations"],
        queryFn: () => getAllConversations()
    })

    useEffect(() => {
        dispatch(conversationsInitialized(conversations?.data))
    }, [conversations])


    if (conversationsAreLoading) {
        return <ActivityIndicator />
    }

    if (conversationFetchFailed) {
        return <FetchFailErrorScreen />
    }


    const handleCreateNewConversation = () => {
        navigation.navigate("ChatBotsListScreen")
    }

    return (
        <View style={styles.root}>
            <ConversationList />
            <FloatingButton
                icon={<Ionicons name="chatbubble-ellipses" size={30} color={Colors.gray[100]}/>}
                handlePress={handleCreateNewConversation}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1
    }
})
 
export default ConversationsWrapper;