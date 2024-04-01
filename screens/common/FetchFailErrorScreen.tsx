import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const FetchFailErrorScreen = () => {
    return (
        <View style={styles.container}>
            <Ionicons name="cloud-offline-outline" size={100} color="red" />
            <Text style={styles.title}>Oops!</Text>
            <Text style={styles.message}>We couldn't fetch the data. Please check your internet connection and try again.</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 20,
        color: 'red',
    },
    message: {
        fontSize: 18,
        textAlign: 'center',
        marginTop: 10,
        color: '#333',
    },
});

export default FetchFailErrorScreen;
