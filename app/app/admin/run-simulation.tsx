import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Dimensions, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Theme } from '../../constants/JalSakhiTheme';
import { AdminHeader } from '../../components/AdminHeader';
import { LineChart } from 'react-native-chart-kit';
import { BentoCard } from '../../components/BentoCard';
import { Feather } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width;

export default function RunSimulation() {
    const params = useLocalSearchParams();
    const router = useRouter();
    const { t } = useTranslation();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => setLoading(false), 2000);
    }, []);

    if (loading) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <Stack.Screen options={{ headerShown: false }} />
                <ActivityIndicator size="large" color={Theme.colors.primary} />
                <Text style={styles.loadingText}>{t('admin.simulation.running')}</Text>
                <Text style={styles.loadingSub}>{t('admin.simulation.calculating', { percent: params.rainfall || 50 })}</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <AdminHeader title={t('admin.simulation.results')} />

            <ScrollView contentContainerStyle={styles.scrollContent}>

                <View style={[styles.resultBanner, { backgroundColor: '#fee2e2', borderColor: '#fecaca' }]}>
                    <Feather name="alert-triangle" size={24} color={Theme.colors.error} />
                    <View style={styles.bannerText}>
                        <Text style={styles.bannerTitle}>{t('admin.simulation.criticalRiskDetected')}</Text>
                        <Text style={styles.bannerDesc}>{t('admin.simulation.reservoirsDepleteBy')}</Text>
                    </View>
                </View>

                <BentoCard title={t('admin.simulation.projectedLevels')}>
                    <LineChart
                        data={{
                            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
                            datasets: [{
                                data: [100, 85, 60, 25, 10, 5],
                                color: (opacity = 1) => `rgba(220, 38, 38, ${opacity})`,
                            }]
                        }}
                        width={screenWidth - 64}
                        height={200}
                        yAxisSuffix="%"
                        chartConfig={{
                            backgroundColor: "#ffffff",
                            backgroundGradientFrom: "#ffffff",
                            backgroundGradientTo: "#ffffff",
                            decimalPlaces: 0,
                            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                            labelColor: (opacity = 1) => `rgba(100, 116, 139, ${opacity})`,
                        }}
                        bezier
                        style={{ marginVertical: 8, borderRadius: 16 }}
                    />
                </BentoCard>

                <View style={styles.statsRow}>
                    <View style={[styles.statItem, { borderColor: Theme.colors.error }]}>
                        <Text style={[styles.statVal, { color: Theme.colors.error }]}>-42%</Text>
                        <Text style={styles.statLab}>{t('admin.simulation.availabilityGap')}</Text>
                    </View>
                    <View style={[styles.statItem, { borderColor: '#d97706' }]}>
                        <Text style={[styles.statVal, { color: '#d97706' }]}>2.1K</Text>
                        <Text style={styles.statLab}>{t('admin.simulation.acresAtRisk')}</Text>
                    </View>
                </View>

                <TouchableOpacity style={styles.actionBtn} onPress={() => router.back()}>
                    <Text style={styles.actionBtnText}>{t('admin.simulation.adjustParams')}</Text>
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Theme.colors.bg, overflow: 'hidden' as const },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Theme.colors.bg },
    loadingText: { marginTop: 16, fontSize: 18, fontWeight: 'bold', color: Theme.colors.text },
    loadingSub: { marginTop: 8, fontSize: 14, color: Theme.colors.textMuted },
    scrollContent: { padding: 16 },
    resultBanner: {
        flexDirection: 'row',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        alignItems: 'center',
        gap: 12,
        marginBottom: 16,
    },
    bannerText: { flex: 1 },
    bannerTitle: { fontSize: 14, fontWeight: 'bold', color: Theme.colors.error, letterSpacing: 0.5 },
    bannerDesc: { fontSize: 13, color: '#b91c1c', marginTop: 2 },
    statsRow: { flexDirection: 'row', gap: 16, marginVertical: 16 },
    statItem: {
        flex: 1,
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        alignItems: 'center',
    },
    statVal: { fontSize: 24, fontWeight: 'bold' },
    statLab: { fontSize: 12, color: Theme.colors.textMuted, marginTop: 4 },
    actionBtn: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: Theme.colors.border,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 20,
    },
    actionBtnText: { fontSize: 16, fontWeight: '600', color: Theme.colors.text },
});
