import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { TChatBot } from '../types';
import Colors from '../../../theme/colors';
import { NUM_OF_DIFFICULTY_LEVELS } from './constants';
import { getDifficultyLevel } from './utils';
import { AirbnbRating, Rating } from 'react-native-ratings';

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
                <View style={{flex: 1}}>
                    <Text style={styles.name}>{name}</Text>
                    <Text style={styles.description}>{description}</Text>
                    <View>
                        <Text>{voiceCharacteristics}</Text>
                    </View>
                    <View>
                        <AirbnbRating
                            isDisabled
                            count={5}
                            reviewSize={16}
                            reviews={["Beginner", "Elementary", "Intermediate", "Advanced", "Expert"]}
                            size={20}
                            defaultRating={getDifficultyLevel(difficultyLevel)}
                        />
                    </View>
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
        gap: 20,
        flex: 1,
    },
    image: {
        width: 100,
        height: 100,
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
        color: Colors.gray[600],
    }
});

export default BotProfile;
