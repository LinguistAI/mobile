import { FlatList, Pressable, View } from "react-native";
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
                    <Pressable>
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
 
export default BotLists;