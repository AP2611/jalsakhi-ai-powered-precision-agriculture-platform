import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, StatusBar, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Theme } from '../constants/JalSakhiTheme';
import { Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

const screenWidth = Dimensions.get('window').width;

export default function Notifications() {
    const router = useRouter();
    const { t } = useTranslation();

    const NOTIFICATIONS_DATA = [
        { id: '1', title: t('notifications.waterAllocationApproved'), message: t('notifications.allocationApprovedMsg', { amount: 500 }), time: '2 mins ago', type: 'success', read: false },
        { id: '2', title: t('notifications.criticalLowLevel'), message: t('notifications.reservoirLowMsg'), time: '1 hour ago', type: 'critical', read: false },
        { id: '3', title: t('notifications.weatherAlert'), message: t('notifications.rainExpectedMsg'), time: '5 hours ago', type: 'info', read: true },
        { id: '4', title: t('notifications.weeklyReportReady'), message: t('notifications.reportReadyMsg'), time: '1 day ago', type: 'info', read: true },
    ];

    const [list, setList] = useState(NOTIFICATIONS_DATA);

    const markAllRead = () => {
        setList(list.map(n => ({ ...n, read: true })));
    };

    const GlassCard = ({ children, style, intensity = 20 }: any) => (
        <View style={[styles.glassCard, style]}>
            <BlurView intensity={intensity} tint="light" style={styles.cardBlur}>
                {children}
            </BlurView>
        </View>
    );

    const renderItem = ({ item }: { item: any }) => (
        <TouchableOpacity activeOpacity={0.8} style={styles.itemWrapper}>
            <GlassCard intensity={item.read ? 15 : 40} style={!item.read && styles.unreadOutline}>
                <View style={styles.cardRow}>
                    <View style={[styles.iconBox,
                    item.type === 'success' && { backgroundColor: 'rgba(16, 185, 129, 0.1)' },
                    item.type === 'critical' && { backgroundColor: 'rgba(239, 68, 68, 0.1)' },
                    item.type === 'info' && { backgroundColor: 'rgba(59, 130, 246, 0.1)' },
                    ]}>
                        <MaterialCommunityIcons
                            name={item.type === 'success' ? 'check-circle-outline' : item.type === 'critical' ? 'alert-outline' : 'information-outline'}
                            size={22}
                            color={
                                item.type === 'success' ? '#10b981' :
                                    item.type === 'critical' ? '#ef4444' : '#3b82f6'
                            }
                        />
                    </View>
                    <View style={styles.textContainer}>
                        <View style={styles.headerRow}>
                            <Text style={[styles.title, !item.read && styles.unreadTitle]}>{item.title}</Text>
                            <Text style={styles.time}>{item.time}</Text>
                        </View>
                        <Text style={styles.message} numberOfLines={2}>{item.message}</Text>
                    </View>
                    {!item.read && <View style={styles.dot} />}
                </View>
            </GlassCard>
        </TouchableOpacity>
    );

    return (
        <View style={styles.safe}>
            <StatusBar barStyle="dark-content" />
            <Stack.Screen options={{ headerShown: false }} />

            {/* Decorative Layer */}
            <View style={styles.decorativeLayer} pointerEvents="none">
                <View style={[styles.designLine, { top: '15%', left: -60, transform: [{ rotate: '45deg' }] }]} />
                <View style={[styles.designLine, { bottom: '25%', right: -80, width: 300, transform: [{ rotate: '-30deg' }] }]} />
            </View>

            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                        <BlurView intensity={60} tint="light" style={styles.backBlur}>
                            <MaterialCommunityIcons name="chevron-left" size={28} color={Theme.colors.text} />
                        </BlurView>
                    </TouchableOpacity>
                    <View style={styles.headerTitles}>
                        <Text style={styles.headerTitle}>{t('notifications.title')}</Text>
                        <Text style={styles.headerSubtitle}>Latest alerts & updates</Text>
                    </View>
                    <TouchableOpacity onPress={markAllRead} style={styles.readAllBtn}>
                        <Text style={styles.actionText}>{t('notifications.readAll')}</Text>
                    </TouchableOpacity>
                </View>

                <FlatList
                    data={list}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <View style={styles.empty}>
                            <BlurView intensity={20} tint="light" style={styles.emptyBlur}>
                                <MaterialCommunityIcons name="bell-off-outline" size={48} color={Theme.colors.textMuted} />
                                <Text style={styles.emptyText}>{t('notifications.noNotifications')}</Text>
                            </BlurView>
                        </View>
                    }
                />
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#F8FAFC' },
    decorativeLayer: {
        ...StyleSheet.absoluteFillObject,
        overflow: 'hidden',
    },
    designLine: {
        position: 'absolute',
        width: 350,
        height: 1,
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 20,
        gap: 16,
    },
    backBlur: {
        width: 44,
        height: 44,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.85)',
        borderWidth: 1.2,
        borderColor: '#E2E8F0',
    },
    headerTitles: {
        flex: 1,
    },
    headerTitle: { fontSize: 24, fontWeight: '900', color: Theme.colors.text, letterSpacing: -0.5 },
    headerSubtitle: { fontSize: 13, color: Theme.colors.textMuted },
    readAllBtn: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 12,
    },
    actionText: { fontSize: 13, fontWeight: '800', color: Theme.colors.primary },
    list: { padding: 20, gap: 16 },
    itemWrapper: {
        width: '100%',
    },
    glassCard: {
        borderRadius: 24,
        overflow: 'hidden',
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderColor: '#E2E8F0',
    },
    unreadOutline: {
        borderColor: '#bad6ff',
        borderWidth: 1.5,
    },
    cardBlur: {
        padding: 16,
        backgroundColor: 'rgba(255,255,255,0.4)',
    },
    cardRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    iconBox: {
        width: 44, height: 44, borderRadius: 14,
        justifyContent: 'center', alignItems: 'center',
    },
    textContainer: { flex: 1 },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
    title: { fontSize: 15, fontWeight: '700', color: Theme.colors.text },
    unreadTitle: { fontWeight: '900', color: '#0f172a' },
    time: { fontSize: 11, color: Theme.colors.textMuted, fontWeight: '600' },
    message: { fontSize: 13, color: Theme.colors.textMuted, lineHeight: 18, fontWeight: '500' },
    dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Theme.colors.primary },
    empty: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100 },
    emptyBlur: {
        padding: 40,
        borderRadius: 32,
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.6)',
        borderWidth: 1.5,
        borderColor: '#E2E8F0',
        width: screenWidth - 80,
    },
    emptyText: { fontSize: 16, color: Theme.colors.textMuted, fontWeight: '700', marginTop: 16 },
    backBtn: {},
});
