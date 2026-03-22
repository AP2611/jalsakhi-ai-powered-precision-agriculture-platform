import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Theme } from '../../constants/JalSakhiTheme';
import { BentoTile } from '../../components/bento/BentoTile';
import { useTranslation } from 'react-i18next';
import { Logger } from '../../utils/Logger';

import { MaterialCommunityIcons, MaterialIcons, Feather } from '@expo/vector-icons';

export default function AdminDashboardIndex() {
    const router = useRouter();
    const { t } = useTranslation();

    const handleTilePress = (screen: string) => {
        Logger.info('AdminDashboard', `Navigating to: ${screen}`);
        if (screen === 'water-allocation') router.push('/admin/water-allocation-optimizer');
        if (screen === 'reservoir-status') router.push('/admin/reservoir-status');
        if (screen === 'village-analytics') router.push('/admin/analytics');
        if (screen === 'farmer-management') router.push('/admin/farmers-list');
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <View>
                        <View style={styles.villageRow}>
                            <MaterialIcons name="location-on" size={16} color={Theme.colors.emerald} />
                            <Text style={styles.welcomeText}>{t('signup.village')}: Shirur</Text>
                        </View>
                        <Text style={styles.userName}>{t('admin.dashboard')}</Text>
                    </View>
                    <TouchableOpacity style={styles.logoButton} onPress={() => router.push('/profile')}>
                        <Image source={require('../../assets/images/logo.png')} style={styles.headerLogo} resizeMode="contain" />
                    </TouchableOpacity>
                </View>

                <View style={styles.villageAnalysis}>
                    <Text style={styles.sectionTitle}>{t('admin.villageAnalysis')} (Feb 2026)</Text>
                    <View style={styles.analysisGrid}>
                        <View style={styles.analysisItem}>
                            <Text style={styles.analysisVal}>142</Text>
                            <Text style={styles.analysisLabel}>{t('admin.farmers')}</Text>
                        </View>
                        <View style={styles.analysisItem}>
                            <Text style={styles.analysisVal}>320</Text>
                            <Text style={styles.analysisLabel}>{t('admin.farms')}</Text>
                        </View>
                        <View style={styles.analysisItem}>
                            <Text style={styles.analysisVal}>85%</Text>
                            <Text style={styles.analysisLabel}>{t('common.efficiency')}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.grid}>
                    <BentoTile
                        title={t('admin.waterAllocation')}
                        subtitle="Current Period: Feb 17"
                        size="wide"
                        icon={<MaterialCommunityIcons name="water" size={24} color={Theme.colors.emerald} />}
                        onPress={() => handleTilePress('water-allocation')}
                    >
                        <View style={styles.allocationSummary}>
                            <View style={styles.allocStat}>
                                <Text style={styles.allocValue}>850K L</Text>
                                <Text style={styles.allocLabel}>{t('admin.totalVillageQuota')}</Text>
                            </View>
                            <View style={styles.allocStat}>
                                <Text style={styles.allocValue}>520K L</Text>
                                <Text style={styles.allocLabel}>{t('admin.allocatedToday')}</Text>
                            </View>
                        </View>
                    </BentoTile>

                    <BentoTile
                        title={t('admin.reservoirStatus')}
                        subtitle="75% Full"
                        size="large"
                        icon={<MaterialCommunityIcons name="waves" size={24} color={Theme.colors.emerald} />}
                        onPress={() => handleTilePress('reservoir-status')}
                    >
                        <View style={styles.reservoirFocus}>
                            <View style={styles.waterTank}>
                                <View style={[styles.waterFill, { height: '75%' }]} />
                            </View>
                            <Text style={styles.focusValue}>450,000 L</Text>
                            <Text style={styles.focusLabel}>{t('admin.currentVolume')}</Text>
                        </View>
                    </BentoTile>

                    <View style={styles.row}>
                        <BentoTile
                            title={t('admin.analytics')}
                            subtitle="Efficiency"
                            size="medium"
                            icon={<MaterialIcons name="analytics" size={24} color={Theme.colors.emerald} />}
                            onPress={() => handleTilePress('village-analytics')}
                        >
                            <Text style={styles.statValue}>68%</Text>
                            <Text style={styles.statLabel}>{t('admin.waterEfficiency')}</Text>
                        </BentoTile>

                        <BentoTile
                            title={t('admin.farmers')}
                            subtitle="Management"
                            size="medium"
                            icon={<MaterialIcons name="people" size={24} color={Theme.colors.emerald} />}
                            onPress={() => handleTilePress('farmer-management')}
                        >
                            <Text style={styles.statValue}>142</Text>
                            <Text style={styles.statLabel}>{t('admin.farmers')}</Text>
                        </BentoTile>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Theme.colors.background, overflow: 'hidden' as const },
    scrollContent: { padding: Theme.spacing.md },
    header: {
        flexDirection: 'row', justifyContent: 'space-between',
        alignItems: 'center', marginTop: 20, marginBottom: 30, paddingHorizontal: 4,
    },
    villageRow: { flexDirection: 'row', alignItems: 'center' },
    welcomeText: { fontSize: 16, color: Theme.colors.moss, marginLeft: 4 },
    userName: { fontSize: 24, fontWeight: 'bold', color: Theme.colors.forest, marginTop: 4 },
    logoButton: {
        width: 50, height: 50, borderRadius: 16,
        backgroundColor: '#fff', alignItems: 'center',
        justifyContent: 'center', borderWidth: 1, borderColor: Theme.colors.border,
        ...Theme.shadows.soft,
    },
    headerLogo: { width: 36, height: 36 },
    villageAnalysis: { marginBottom: 24, backgroundColor: Theme.colors.dew, padding: 20, borderRadius: 24 },
    sectionTitle: { fontSize: 16, fontWeight: '800', color: Theme.colors.forest, marginBottom: 16 },
    analysisGrid: { flexDirection: 'row', justifyContent: 'space-between' },
    analysisItem: { alignItems: 'center', flex: 1 },
    analysisVal: { fontSize: 22, fontWeight: '900', color: Theme.colors.emerald },
    analysisLabel: { fontSize: 12, color: Theme.colors.moss, marginTop: 4 },
    grid: { flex: 1 },
    row: { flexDirection: 'row', justifyContent: 'space-between' },
    tileIcon: { fontSize: 24 },
    allocationSummary: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', paddingVertical: 10 },
    allocStat: { alignItems: 'center' },
    allocValue: { fontSize: 24, fontWeight: '800', color: Theme.colors.emerald },
    allocLabel: { fontSize: 12, color: Theme.colors.moss, marginTop: 4 },
    reservoirFocus: { alignItems: 'center', width: '100%', paddingVertical: 10 },
    waterTank: {
        width: 60, height: 80, backgroundColor: Theme.colors.dew,
        borderRadius: 8, borderWidth: 2, borderColor: Theme.colors.emerald,
        overflow: 'hidden', justifyContent: 'flex-end', marginBottom: 10,
    },
    waterFill: { width: '100%', backgroundColor: Theme.colors.emerald },
    focusValue: { fontSize: 28, fontWeight: 'bold', color: Theme.colors.forest },
    focusLabel: { fontSize: 14, color: Theme.colors.moss, marginTop: 4 },
    statValue: { fontSize: 28, fontWeight: 'bold', color: Theme.colors.forest },
    statLabel: { fontSize: 14, color: Theme.colors.moss, marginTop: 4 },
});
