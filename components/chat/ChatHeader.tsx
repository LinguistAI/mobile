import { useSelector } from "react-redux";
import { selectCurrentBot } from "../../slices/chatSelectors";
import { StyleSheet, Text, View } from "react-native";
import Colors from "../../theme/colors";
import Avatar from "../common/Avatar";

const ChatHeader = () => {
  const currentBot = useSelector(selectCurrentBot)
  
  return (
    <View style={styles.root}>
      <View style={styles.container}>
        <Avatar 
          src={currentBot?.profileImage}
          height={50}
          width={50}
        />
        <Text>{currentBot?.name}</Text>
      </View>
    </View>

  )
}

const styles = StyleSheet.create({
  root: {
    height: 75,
    borderBottomColor: Colors.primary[600],
    borderBottomWidth: 1
  },
  container: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  }
})
 
export default ChatHeader;