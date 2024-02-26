import { SafeAreaView, StyleSheet } from "react-native";
import ChatBotsListsWrapper from "../../components/chat/bots/ChatBotsListWrapper";

const ChatBotsScreen = () => {
    return (
        <SafeAreaView style={styles.root}>
            <ChatBotsListsWrapper />
        </SafeAreaView>
    );
}
 
const styles = StyleSheet.create({
    root: {
        flex: 1,
    }
})

export default ChatBotsScreen;