import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, StatusBar, Dimensions } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Theme } from '../../constants/JalSakhiTheme';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

const screenWidth = Dimensions.get('window').width;

export default function UsageHistoryScreen() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <Stack.Screen options={{ headerShown: false }} />

            <View style={styles.decorativeLayer} pointerEvents="none">
                <View style={[styles.designLine, { top: '15%', left: -60, transform: [{ rotate: '45deg' }] }]} />
                <View style={[styles.designLine, { bottom: '25%', right: -80, width: 300, transform: [{ rotate: '-30deg' }] }]} />
            </View>

            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <BlurView intensity={60} tint="light" style={styles.backBlur}>
                        <Feather name="chevron-left" size={24} color={Theme.colors.text} />
                    </BlurView>
                </TouchableOpacity>
                <View style={styles.headerTextContainer}>
                    <Text style={styles.title}>Usage History</Text>
                    <Text style={styles.subtitle}>Detailed historical analytics</Text>
                </View>
            </View>

            <View style={styles.content}>
                <BlurView intensity={40} tint="light" style={styles.premiumPlaceholder}>
                    <LinearGradient
                        colors={['rgba(99, 102, 241, 0.1)', 'rgba(168, 85, 247, 0.1)']}
                        style={styles.placeholderIcon}
                    >
                        <MaterialCommunityIcons name="chart-bell-curve-cumulative" size={64} color="#6366f1" />
                    </LinearGradient>
                    <Text style={styles.placeholderTitle}>History Reports Soon</Text>
                    <Text style={styles.placeholderText}>
                        Comprehensive water usage and savings reports are being prepared for your monthly farm summary.
                    </Text>

                    <TouchableOpacity style={styles.notifyBtn} onPress={() => router.back()}>
                        <LinearGradient colors={['#10b981', '#059669']} style={styles.notifGradient}>
                            <Text style={styles.btnText}>Return to Home</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </BlurView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC' },
    decorativeLayer: { ...StyleSheet.absoluteFillObject, overflow: 'hidden' },
    designLine: { position: 'absolute', width: 350, height: 1, backgroundColor: 'rgba(16, 185, 129, 0.1)' },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 20, gap: 16 },
    backBlur: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.85)', borderWidth: 1.2, borderColor: '#E2E8F0' },
    headerTextContainer: { flex: 1 },
    title: { fontSize: 24, fontWeight: '900', color: Theme.colors.text, letterSpacing: -0.5 },
    subtitle: { fontSize: 13, color: Theme.colors.textMuted },
    content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
    premiumPlaceholder: { padding: 32, borderRadius: 32, alignItems: 'center', backgroundColor: '#FFFFFF', borderWidth: 1.5, borderColor: '#E2E8F0', width: '100%' },
    placeholderIcon: { width: 120, height: 120, borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
    placeholderTitle: { fontSize: 22, fontWeight: '900', color: Theme.colors.text, marginBottom: 12 },
    placeholderText: { fontSize: 15, color: Theme.colors.textMuted, textAlign: 'center', lineHeight: 22, fontWeight: '600' },
    notifyBtn: { marginTop: 32, borderRadius: 16, overflow: 'hidden', width: '100%' },
    notifGradient: { height: 56, alignItems: 'center', justifyContent: 'center' },
    btnText: { color: 'white', fontSize: 16, fontWeight: '800' },
    backBtn: {},
});
