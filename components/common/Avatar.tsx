// Import necessary components and types from React and React Native
import React from "react";
import { Image, ImageSourcePropType, StyleSheet, View } from "react-native";

interface AvatarProps {
  src: ImageSourcePropType | null | undefined;
  width?: number;
  height?: number;
}

const Avatar = ({ src, width, height }: AvatarProps) => {
  if (!src) return null;
  
  return (
    <View>
      <Image
        source={src}
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
