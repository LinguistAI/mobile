import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { TChatBot } from '../types';
import Colors from '../../../theme/colors';

// Assuming TChatBot is defined with the properties used below
interface BotProfileProps {
    bot: TChatBot;
}

const BotProfile = ({ bot }: BotProfileProps) => {
    const { description, difficultyLevel, name, profileImage, voiceCharacteristics } = bot;

    return (
        <View style={styles.card}>
            <View style={styles.botContainer}>
                <Image source={{ uri: profileImage }} style={styles.image} />
                <View>
                    <Text style={styles.name}>{name}</Text>
                    <Text style={styles.description}>{description}</Text>
                    <Text>{difficultyLevel}</Text>
                    <Text>{voiceCharacteristics}</Text>

                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 8,
        elevation: 3,
        shadowOffset: { width: 1, height: 1 },
        shadowColor: '#333',
        shadowOpacity: 0.3,
        shadowRadius: 2,
        borderColor: Colors.primary["500"],
        borderWidth: 1,
        padding: 10
    },
    botContainer: {
        display: 'flex',
        flexDirection: "row",
        alignItems: "center",
        gap: 20
    },
    image: {
        width: 75,
        height: 75,
        borderRadius: 50,
        margin: 12,
    },
    name: {
        fontSize: 18,
        fontWeight: "bold",
    },
    description: {
        fontStyle: "italic",
        fontSize: 14,
        color: Colors.gray[600]
    }
});

export default BotProfile;
