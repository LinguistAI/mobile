import { useEffect, useState } from "react";
import { Text, View } from "react-native";

const WritingAnimation = () => {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      if (dots.length === 3) {
        setDots("");
      } else {
        setDots(dots + ".");
      }
    }, 300);

    return () => clearInterval(interval);
  }, [dots]);

  return (
    <View>
      <Text style={{ fontSize: 20, textAlign: "center" }}>{dots}</Text>
    </View>
  );
};

export default WritingAnimation;
