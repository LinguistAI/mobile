import  { SafeAreaView, StyleSheet, View } from "react-native";
import ConversationsWrapper from "../../components/chat/conversations/ConversationsWrapper";

const ConversationsScreen = () => {
    return (
        <SafeAreaView style={styles.root}>
            <ConversationsWrapper />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        marginTop: 30
    }
})
 
export default ConversationsScreen;