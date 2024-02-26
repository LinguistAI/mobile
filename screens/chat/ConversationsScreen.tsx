import  { StyleSheet, View } from "react-native";
import ConversationsWrapper from "../../components/chat/conversations/ConversationsWrapper";

const ConversationsScreen = () => {
    return (
        <View style={styles.root}>
            <ConversationsWrapper />
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1
    }
})
 
export default ConversationsScreen;