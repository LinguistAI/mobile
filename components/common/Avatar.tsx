// Import necessary components and types from React and React Native
import React from "react";
import { Image, ImageSourcePropType, StyleSheet, View } from "react-native";

interface AvatarProps {
  src: ImageSourcePropType | string | undefined;
  width?: number;
  height?: number;
}

const Avatar = ({ src, width, height }: AvatarProps) => {
  if (!src) return null;

  const getSource = () => {
    if (typeof src === "string") {
      return {uri: src}
    }

    return src
  }
  
  return (
    <View>
      <Image
        source={getSource()}
        style={[
          styles.image,
          { width: width ? width : 100, height: height ? height : 100 },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    resizeMode: "cover",
  },
});

export default Avatar;
