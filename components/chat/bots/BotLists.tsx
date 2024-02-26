import { FlatList, Pressable, StyleSheet, View } from "react-native";
import { TChatBot } from "../types";
import BotProfile from "./BotProfile";

interface BotListsProps {
    bots: TChatBot[]
}

const BotLists = ({ bots }: BotListsProps) => {
    const renderBots = () => {
        return (
            <FlatList 
                data={bots}
                renderItem={({ item }) => (
                    <Pressable style={styles.profile}>
                        <BotProfile bot={item}/>
                    </Pressable>
                )}
                keyExtractor={item => item.id}
            />
        )
    }
    
    return (
        <View>
            {renderBots()}
        </View>
    );
}

const styles = StyleSheet.create({
    profile: {
        marginHorizontal: 16
    }
})
 
export default BotLists;