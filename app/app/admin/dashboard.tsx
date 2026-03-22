import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Theme } from '../../constants/JalSakhiTheme';
import { BentoCard } from '../../components/BentoCard';
import { StatsWidget } from '../../components/StatsWidget';
import { PieChart } from 'react-native-chart-kit';
import { Feather, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';

const screenWidth = Dimensions.get('window').width;

export default function AdminDashboard() {
    const router = useRouter();
    const { t } = useTranslation();
    const { user } = useAuth();
    return (
        <SafeAreaView style={styles.container}>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerTopRow}>
                        <View style={styles.brandingContainer}>
                            <View style={styles.logoCircle}>
                                <Image source={require('../../assets/images/logo.png')} style={styles.logo} resizeMode="contain" />
                            </View>
                            <View>
                                <Text style={styles.welcomeText}>{t('dashboard.welcomeBack')} <Text style={styles.adminName}>{user?.name || 'Admin'}</Text></Text>
                                <Text style={styles.dashboardTitle}>{t('admin.dashboard')}</Text>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.notifBtn} onPress={() => router.push('/notifications')}>
                            <Feather name="bell" size={24} color="white" />
                            <View style={styles.badgeDot} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.villageSelector}>
                        <View style={styles.villageDropdown}>
                            <MaterialIcons name="location-on" size={20} color="white" />
                            <Text style={styles.selectedVillage}>Rampur Gram Panchayat</Text>
                            <Feather name="chevron-down" size={20} color="rgba(255,255,255,0.7)" />
                        </View>
                        <Text style={styles.updatedTime}>Live Updates • Today 09:41 AM</Text>
                    </View>
                </View>

                {/* Live Activities / Stats */}
                <View style={styles.statsRow}>
                    {/* Water Status */}
                    <View style={styles.statCard}>
                        <View style={[styles.iconBox, { backgroundColor: '#e0f2fe' }]}>
                            <MaterialCommunityIcons name="water-percent" size={24} color="#0ea5e9" />
                        </View>
                        <Text style={styles.statVal}>2.8M L</Text>
                        <Text style={styles.statLabel}>{t('admin.waterAvailable')}</Text>
                        <Text style={styles.statSub}>+12% vs last week</Text>
                    </View>

                    {/* Farmers */}
                    <View style={styles.statCard}>
                        <View style={[styles.iconBox, { backgroundColor: '#dcfce7' }]}>
                            <Feather name="users" size={24} color="#16a34a" />
                        </View>
                        <Text style={styles.statVal}>284</Text>
                        <Text style={styles.statLabel}>{t('admin.activeFarmers')}</Text>
                        <Text style={styles.statSub}>24 New Requests</Text>
                    </View>

                    {/* Usage/Credits */}
                    <View style={styles.statCard}>
                        <View style={[styles.iconBox, { backgroundColor: '#fef9c3' }]}>
                            <MaterialCommunityIcons name="hand-coin-outline" size={24} color="#ca8a04" />
                        </View>
                        <Text style={styles.statVal}>850k</Text>
                        <Text style={styles.statLabel}>{t('admin.creditsDistributed')}</Text>
                        <Text style={styles.statSub}>High Savings</Text>
                    </View>
                </View>

                {/* Main Bento Grid */}
                <View style={styles.bentoGrid}>

                    {/* Alerts Section */}
                    <BentoCard colSpan={2} title={t('admin.criticalAlerts')}>
                        <TouchableOpacity onPress={() => router.push('/admin/anomalies')}>
                            <View style={styles.alertItem}>
                                <View style={styles.alertIconBox}>
                                    <Feather name="alert-triangle" size={20} color={Theme.colors.error} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.alertTitle}>{t('admin.waterShortageDetected')}</Text>
                                    <Text style={styles.alertDesc}>Sector 4 is at 15% capacity. Immediate allocation needed.</Text>
                                </View>
                                <View style={styles.actionBadge}>
                                    <Text style={styles.actionText}>{t('admin.resolve')}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>

                        <View style={styles.divider} />

                        <TouchableOpacity onPress={() => router.push('/admin/approvals')}>
                            <View style={styles.alertItem}>
                                <View style={[styles.alertIconBox, { backgroundColor: '#fff7ed' }]}>
                                    <Feather name="user-check" size={20} color="#ea580c" />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.alertTitle}>{t('admin.farmerApprovalsPending')}</Text>
                                    <Text style={styles.alertDesc}>7 new farmers waiting for approval in Rampur.</Text>
                                </View>
                                <Feather name="chevron-right" size={20} color={Theme.colors.textMuted} />
                            </View>
                        </TouchableOpacity>
                    </BentoCard>

                    {/* ML Model Entry */}
                    <BentoCard colSpan={2} style={{ backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' }}>
                        <TouchableOpacity
                            style={styles.mlCardContent}
                            onPress={() => router.push('/admin/water-allocation-optimization')} // Pointing to existing screen
                        >
                            <View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                    <MaterialCommunityIcons name="molecule" size={24} color={Theme.colors.primary} />
                                    <Text style={[styles.cardTitle, { color: Theme.colors.primary }]}>{t('admin.aiModel')}</Text>
                                </View>
                                <Text style={styles.mlDesc}>Run "Village-Level Water Allocation" to fix Sector 4 shortage.</Text>
                            </View>
                            <View style={styles.playBtn}>
                                <Feather name="play" size={20} color="white" />
                            </View>
                        </TouchableOpacity>
                    </BentoCard>

                    {/* Internal AI Tools Entry */}
                    <BentoCard colSpan={2} style={{ backgroundColor: '#f8fafc', borderColor: '#e2e8f0' }}>
                        <TouchableOpacity
                            style={styles.mlCardContent}
                            onPress={() => router.push('/admin/internal-ai' as any)}
                        >
                            <View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                    <MaterialCommunityIcons name="test-tube" size={24} color={Theme.colors.textMuted} />
                                    <Text style={[styles.cardTitle, { color: Theme.colors.text }]}>Internal AI Tools</Text>
                                </View>
                                <Text style={styles.mlDesc}>Test experimental Model 1 & 2 endpoints with custom JSON payloads.</Text>
                            </View>
                            <View style={[styles.playBtn, { backgroundColor: Theme.colors.textMuted }]}>
                                <Feather name="settings" size={20} color="white" />
                            </View>
                        </TouchableOpacity>
                    </BentoCard>

                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Theme.colors.bg,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 40,
    },
    header: {
        backgroundColor: Theme.colors.primary,
        paddingTop: 20,
        paddingHorizontal: 20,
        paddingBottom: 24,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        marginBottom: 20,
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    headerTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    brandingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    logoCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
    },
    logo: {
        width: 65,
        height: 65,
    },
    welcomeText: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.9)',
        fontWeight: '600',
    },
    adminName: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 22,
    },
    dashboardTitle: {
        display: 'none', // Hidden as requested
    },
    notifBtn: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    badgeDot: {
        position: 'absolute',
        top: 10,
        right: 12,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: Theme.colors.error,
        borderWidth: 1,
        borderColor: 'white',
    },
    villageSelector: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.15)',
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    villageDropdown: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    selectedVillage: {
        fontSize: 14,
        fontWeight: 'bold',
        color: 'white',
    },
    updatedTime: {
        fontSize: 11,
        color: 'rgba(255,255,255,0.8)',
        fontWeight: '500',
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
        gap: 12,
    },
    statCard: {
        flex: 1,
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        alignItems: 'flex-start',
    },
    iconBox: {
        width: 32,
        height: 32,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    statVal: {
        fontSize: 18,
        fontWeight: '800',
        color: Theme.colors.text,
        marginBottom: 2,
    },
    statLabel: {
        fontSize: 11,
        color: Theme.colors.textMuted,
        fontWeight: '600',
        marginBottom: 4,
    },
    statSub: {
        fontSize: 10,
        color: Theme.colors.success,
        fontWeight: '600',
    },
    bentoGrid: {
        gap: 16,
    },
    alertItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 8,
    },
    alertIconBox: {
        width: 36,
        height: 36,
        borderRadius: 8,
        backgroundColor: '#fef2f2',
        justifyContent: 'center',
        alignItems: 'center',
    },
    alertTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: Theme.colors.text,
        marginBottom: 2,
    },
    alertDesc: {
        fontSize: 12,
        color: Theme.colors.textMuted,
    },
    actionBadge: {
        backgroundColor: Theme.colors.error,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    actionText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },
    mlCardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Theme.colors.text,
    },
    mlDesc: {
        fontSize: 12,
        color: Theme.colors.textMuted,
        maxWidth: '80%',
    },
    playBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: Theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
    },
    divider: {
        height: 1,
        backgroundColor: '#f1f5f9',
        marginVertical: 12,
    },
});
