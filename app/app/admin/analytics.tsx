import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Theme } from '../../constants/JalSakhiTheme';
import { AdminHeader } from '../../components/AdminHeader';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { BentoCard } from '../../components/BentoCard';

const screenWidth = Dimensions.get('window').width;

export default function Analytics() {
    const { t } = useTranslation();
    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <AdminHeader title={t('admin.analytics.title')} actionLabel={t('admin.analytics.exportPdf')} onActionPress={() => { }} />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Usage Trends */}
                <BentoCard colSpan={2} title={t('admin.analytics.usageTrends')}>
                    <LineChart
                        data={{
                            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
                            datasets: [{ data: [2.1, 2.4, 3.2, 4.1, 3.8, 4.5] }]
                        }}
                        width={screenWidth - 64}
                        height={220}
                        yAxisLabel=""
                        yAxisSuffix="M"
                        chartConfig={{
                            backgroundColor: "#ffffff",
                            backgroundGradientFrom: "#ffffff",
                            backgroundGradientTo: "#ffffff",
                            decimalPlaces: 1,
                            color: (opacity = 1) => `rgba(14, 165, 233, ${opacity})`,
                            labelColor: (opacity = 1) => `rgba(100, 116, 139, ${opacity})`,
                            propsForDots: { r: "5", strokeWidth: "2", stroke: "#0ea5e9" }
                        }}
                        bezier
                        style={{ marginVertical: 8, borderRadius: 16 }}
                    />
                </BentoCard>

                {/* Crop Distribution */}
                <BentoCard colSpan={2} title={t('admin.analytics.cropDistribution')}>
                    <BarChart
                        data={{
                            labels: [t('crops.wheat'), t('crops.rice'), t('crops.cotton'), t('crops.sugar'), t('crops.pulse')],
                            datasets: [{ data: [120, 85, 60, 45, 30] }]
                        }}
                        width={screenWidth - 64}
                        height={220}
                        yAxisLabel=""
                        yAxisSuffix=""
                        chartConfig={{
                            backgroundColor: "#ffffff",
                            backgroundGradientFrom: "#ffffff",
                            backgroundGradientTo: "#ffffff",
                            color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
                            labelColor: (opacity = 1) => `rgba(100, 116, 139, ${opacity})`,
                            barPercentage: 0.7,
                        }}
                        style={{ marginVertical: 8, borderRadius: 16 }}
                    />
                </BentoCard>

                <View style={styles.summaryRow}>
                    <BentoCard title={t('admin.analytics.efficiencyScore')}>
                        <View style={styles.scoreContainer}>
                            <Text style={styles.scoreVal}>87/100</Text>
                            <Text style={styles.scoreChange}>{t('admin.analytics.vsLastMonth', { change: '+5%' })}</Text>
                        </View>
                    </BentoCard>
                    <BentoCard title={t('admin.analytics.totalWastage')}>
                        <View style={styles.scoreContainer}>
                            <Text style={[styles.scoreVal, { color: Theme.colors.error }]}>4.2%</Text>
                            <Text style={styles.scoreChange}>{t('admin.analytics.vsLastMonth', { change: '-2%' })}</Text>
                        </View>
                    </BentoCard>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Theme.colors.bg, overflow: 'hidden' as const },
    scrollContent: { padding: 16 },
    summaryRow: { flexDirection: 'row', gap: 16 },
    scoreContainer: { alignItems: 'center', paddingVertical: 12 },
    scoreVal: { fontSize: 32, fontWeight: 'bold', color: Theme.colors.primary },
    scoreChange: { fontSize: 12, color: Theme.colors.success, marginTop: 4, fontWeight: '600' },
});
