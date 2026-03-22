import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { Theme } from '../../constants/JalSakhiTheme';
import { Logger } from '../../utils/Logger';

import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function SplashScreen() {
    const router = useRouter();
    const fadeAnim = new Animated.Value(0);
    const scaleAnim = new Animated.Value(0.9);

    useEffect(() => {
        Logger.info('SplashScreen', 'Initializing JalSakhi...');

        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 4,
                useNativeDriver: true,
            }),
        ]).start();

        const timer = setTimeout(() => {
            router.replace('/(auth)/role');
        }, 2500);

        return () => clearTimeout(timer);
    }, []);

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
                <View style={styles.logoContainer}>
                    <MaterialCommunityIcons name="water" size={60} color={Theme.colors.emerald} />
                </View>
                <Text style={styles.title}>JalSakhi</Text>
                <Text style={styles.subtitle}>Smart Water Management for Farmers</Text>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Theme.colors.forest,
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        alignItems: 'center',
    },
    logoContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: Theme.colors.dew,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    logoText: {
        fontSize: 50,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: Theme.colors.dew,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: Theme.colors.mint,
        textAlign: 'center',
        paddingHorizontal: 40,
    },
});
