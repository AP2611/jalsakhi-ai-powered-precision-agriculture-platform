import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, FlatList } from 'react-native';
import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Theme } from '../../constants/JalSakhiTheme';
import { CustomButton } from '../../components/shared/CustomButton';
import { MaterialCommunityIcons, MaterialIcons, Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Logger } from '../../utils/Logger';

const MOCK_FARMS = [
    { id: '1', owner: 'Ramesh Kumar', area: '5 Acre', requirement: '1,200 L', share: '24%', priority: 'High' },
    { id: '2', owner: 'Suresh Patil', area: '3 Acre', requirement: '850 L', share: '17%', priority: 'Medium' },
    { id: '3', owner: 'Anita Deshmukh', area: '4 Acre', requirement: '1,000 L', share: '20%', priority: 'High' },
    { id: '4', owner: 'Ganesh More', area: '7 Acre', requirement: '1,500 L', share: '30%', priority: 'Medium' },
    { id: '5', owner: 'Sunita Rao', area: '2 Acre', requirement: '450 L', share: '9%', priority: 'Low' },
];

export default function WaterAllocationOptimizationScreen() {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [optimized, setOptimized] = useState(false);

    const handleOptimize = () => {
        setLoading(true);
        Logger.info('Model3', 'Optimizing village water allocation...');
        setTimeout(() => {
            setLoading(false);
            setOptimized(true);
        }, 2500);
    };

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ title: t('admin.optimizer.title'), headerShown: true }} />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <MaterialCommunityIcons name="molecule" size={40} color={Theme.colors.emerald} />
                    <Text style={styles.title}>{t('admin.optimizer.title')}</Text>
                    <Text style={styles.subtitle}>{t('admin.optimizer.subtitle')}</Text>
                </View>

                <View style={styles.statsRow}>
                    <View style={styles.statBox}>
                        <Text style={styles.statLabel}>{t('admin.optimizer.totalAvailable')}</Text>
                        <Text style={styles.statValue}>450K L</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Text style={styles.statLabel}>{t('admin.optimizer.totalDemand')}</Text>
                        <Text style={styles.statValue}>520K L</Text>
                    </View>
                </View>

                {!optimized ? (
                    <View style={styles.prepCard}>
                        <Feather name="info" size={24} color={Theme.colors.moss} />
                        <Text style={styles.prepText}>
                            {t('admin.optimizer.deficitDetected', { amount: '70,000' })}
                        </Text>
                        <CustomButton
                            title={t('admin.optimizer.runOptimization')}
                            onPress={handleOptimize}
                            loading={loading}
                            icon={<MaterialCommunityIcons name="auto-fix" size={20} color="white" />}
                        />
                    </View>
                ) : (
                    <View style={styles.resultsContainer}>
                        <View style={styles.successBadge}>
                            <MaterialIcons name="check-circle" size={20} color={Theme.colors.emerald} />
                            <Text style={styles.successText}>{t('admin.optimizer.optimizationComplete', { efficiency: '98%' })}</Text>
                        </View>

                        <Text style={styles.sectionTitle}>{t('admin.optimizer.farmAllocation')}</Text>
                        {MOCK_FARMS.map(farm => (
                            <View key={farm.id} style={styles.farmRow}>
                                <View style={styles.farmInfo}>
                                    <Text style={styles.farmOwner}>{farm.owner}</Text>
                                    <Text style={styles.farmMeta}>{farm.area} • {t('admin.optimizer.priority')} {t(`common.${farm.priority.toLowerCase()}`)}</Text>
                                </View>
                                <View style={styles.allocationBox}>
                                    <Text style={styles.allocVal}>{farm.share}</Text>
                                    <Text style={styles.allocTarget}>{farm.requirement}</Text>
                                </View>
                            </View>
                        ))}

                        <CustomButton
                            title={t('admin.optimizer.releaseWater')}
                            onPress={() => Logger.info('Admin', 'Water released')}
                            style={{ marginTop: 24 }}
                            type="primary"
                        />
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Theme.colors.background, overflow: 'hidden' as const },
    scrollContent: { padding: 20 },
    header: { alignItems: 'center', marginBottom: 24 },
    title: { fontSize: 24, fontWeight: 'bold', color: Theme.colors.forest, marginTop: 12 },
    subtitle: { fontSize: 13, color: Theme.colors.moss, textAlign: 'center', marginTop: 8, paddingHorizontal: 10 },
    statsRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
    statBox: { flex: 1, backgroundColor: Theme.colors.card, padding: 16, borderRadius: 16, borderWidth: 1, borderColor: Theme.colors.border, alignItems: 'center' },
    statLabel: { fontSize: 11, color: Theme.colors.moss, textTransform: 'uppercase', fontWeight: 'bold' },
    statValue: { fontSize: 22, fontWeight: '900', color: Theme.colors.forest, marginTop: 4 },
    prepCard: { backgroundColor: Theme.colors.dew, padding: 24, borderRadius: 24, alignItems: 'center' },
    prepText: { fontSize: 14, color: Theme.colors.forest, textAlign: 'center', marginVertical: 16, lineHeight: 20 },
    resultsContainer: { marginTop: 10 },
    successBadge: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#E8F5E9', padding: 8, borderRadius: 12, marginBottom: 20 },
    successText: { fontSize: 13, color: Theme.colors.emerald, fontWeight: '700', marginLeft: 8 },
    sectionTitle: { fontSize: 18, fontWeight: '800', color: Theme.colors.forest, marginBottom: 16 },
    farmRow: { flexDirection: 'row', backgroundColor: Theme.colors.card, padding: 16, borderRadius: 16, marginBottom: 10, alignItems: 'center', borderWidth: 1, borderColor: Theme.colors.border },
    farmInfo: { flex: 1 },
    farmOwner: { fontSize: 16, fontWeight: 'bold', color: Theme.colors.forest },
    farmMeta: { fontSize: 12, color: Theme.colors.moss, marginTop: 2 },
    allocationBox: { alignItems: 'flex-end' },
    allocVal: { fontSize: 18, fontWeight: '900', color: Theme.colors.emerald },
    allocTarget: { fontSize: 11, color: Theme.colors.moss, marginTop: 2 },
});
