import AnimatedLottieView from "lottie-react-native";
import ActionButton from "../common/ActionButton";
import { StyleSheet, Text, View } from "react-native";

interface ChatStreakButtonProps {
    currentStreak: number;
    handleOpenModal: () => void;
}

const ChatStreakButton = ({ currentStreak, handleOpenModal }: ChatStreakButtonProps) => {
    return (
        <ActionButton
            icon={
            <AnimatedLottieView
                style={styles.lottie}
                autoPlay
                loop
                source={require("../../assets/lottie/streak/streakFireAnim.json")}
            />
            }
            onPress={handleOpenModal}
            title={
            <View style={styles.lottieContainer}>
                <Text style={{ fontWeight: "bold" }}>{currentStreak}</Text>
            </View>
            }
        />
    );
}

const styles = StyleSheet.create({
    lottieContainer: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 5,
      },
      lottie: {
        width: 20,
        height: 20,
      },
})
 
export default ChatStreakButton;