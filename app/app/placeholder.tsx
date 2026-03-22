import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Stack } from 'expo-router';
import { Theme } from '../constants/JalSakhiTheme';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const PlaceholderScreen = ({ title, icon }: { title: string, icon: any }) => (
    <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ title }} />
        <View style={styles.content}>
            <MaterialIcons name={icon} size={64} color={Theme.colors.dew} />
            <Text style={styles.text}>{title} Feature Coming Soon</Text>
            <Text style={styles.subtext}>We are working on bringing this functionality to the app.</Text>
        </View>
    </SafeAreaView>
);

export default PlaceholderScreen;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Theme.colors.background, overflow: 'hidden' as const },
    content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
    text: { fontSize: 24, fontWeight: 'bold', color: Theme.colors.forest, marginTop: 24, textAlign: 'center' },
    subtext: { fontSize: 14, color: Theme.colors.moss, textAlign: 'center', marginTop: 12, lineHeight: 20 },
});
