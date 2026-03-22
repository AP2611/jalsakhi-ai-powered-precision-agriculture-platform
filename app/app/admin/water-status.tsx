import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { Theme } from '../../constants/JalSakhiTheme';
import { AdminHeader } from '../../components/AdminHeader';
import { BentoCard } from '../../components/BentoCard';
import { LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

export default function WaterStatus() {
    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <AdminHeader title="Village Water Status" />

            <ScrollView contentContainerStyle={styles.scrollContent}>

                {/* Main Gauge */}
                <BentoCard colSpan={2} style={styles.gaugeCard}>
                    <Text style={styles.gaugeTitle}>TOTAL RESERVES</Text>
                    <View style={styles.gaugeContent}>
                        <View style={styles.gaugeCircle}>
                            <Text style={styles.gaugeVal}>68%</Text>
                        </View>
                        <View style={styles.gaugeMetrics}>
                            <Text style={styles.metricVal}>2.8M Liters</Text>
                            <Text style={styles.metricLab}>Available</Text>
                            <View style={{ height: 16 }} />
                            <Text style={styles.metricVal}>18 Days</Text>
                            <Text style={styles.metricLab}>To Depletion</Text>
                        </View>
                    </View>
                    <Text style={styles.subtitle}>Forecast based on current usage trends</Text>
                </BentoCard>

                {/* Depletion Chart */}
                <BentoCard colSpan={2} title="DEPLETION FORECAST (7 DAYS)">
                    <LineChart
                        data={{
                            labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                            datasets: [{ data: [68, 65, 62, 60, 58, 55, 52] }]
                        }}
                        width={screenWidth - 64}
                        height={200}
                        yAxisLabel=""
                        yAxisSuffix="%"
                        chartConfig={{
                            backgroundColor: "#ffffff",
                            backgroundGradientFrom: "#ffffff",
                            backgroundGradientTo: "#ffffff",
                            decimalPlaces: 0,
                            color: (opacity = 1) => `rgba(14, 165, 233, ${opacity})`,
                            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                            style: { borderRadius: 16 }
                        }}
                        bezier
                        style={{ marginVertical: 8, borderRadius: 16 }}
                    />
                </BentoCard>

                {/* Sources Breakdown */}
                <Text style={styles.sectionHeading}>Water Sources Status</Text>
                <View style={styles.row}>
                    <BentoCard title="Reservoir A">
                        <View style={styles.sourceItem}>
                            <Text style={[styles.sourceVal, { color: Theme.colors.success }]}>82%</Text>
                            <Text style={styles.sourceLab}>Optimal</Text>
                        </View>
                    </BentoCard>
                    <BentoCard title="Reservoir B">
                        <View style={styles.sourceItem}>
                            <Text style={[styles.sourceVal, { color: Theme.colors.error }]}>22%</Text>
                            <Text style={styles.sourceLab}>Critical</Text>
                        </View>
                    </BentoCard>
                </View>
                <View style={styles.row}>
                    <BentoCard title="Village Tank">
                        <View style={styles.sourceItem}>
                            <Text style={[styles.sourceVal, { color: Theme.colors.primary }]}>90%</Text>
                            <Text style={styles.sourceLab}>Full</Text>
                        </View>
                    </BentoCard>
                    <BentoCard title="Groundwater">
                        <View style={styles.sourceItem}>
                            <Text style={[styles.sourceVal, { color: '#fbbf24' }]}>45%</Text>
                            <Text style={styles.sourceLab}>Moderate</Text>
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
    gaugeCard: { backgroundColor: '#f0f9ff', borderColor: '#bae6fd', borderWidth: 1 },
    gaugeTitle: { fontSize: 12, fontWeight: '700', color: '#0369a1', letterSpacing: 1, marginBottom: 16 },
    gaugeContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 32, marginBottom: 16 },
    gaugeCircle: {
        width: 100, height: 100, borderRadius: 50, borderWidth: 8, borderColor: '#0ea5e9',
        justifyContent: 'center', alignItems: 'center', backgroundColor: 'white'
    },
    gaugeVal: { fontSize: 28, fontWeight: '800', color: '#0ea5e9' },
    gaugeMetrics: { alignItems: 'flex-start' },
    metricVal: { fontSize: 20, fontWeight: '800', color: Theme.colors.text },
    metricLab: { fontSize: 12, color: Theme.colors.textMuted },
    subtitle: { fontSize: 12, color: Theme.colors.textMuted, textAlign: 'center', fontStyle: 'italic' },
    sectionHeading: { fontSize: 16, fontWeight: 'bold', color: Theme.colors.text, marginVertical: 12 },
    row: { flexDirection: 'row', gap: 12, marginBottom: 0 },
    sourceItem: { alignItems: 'center', paddingVertical: 8 },
    sourceVal: { fontSize: 24, fontWeight: '800' },
    sourceLab: { fontSize: 12, color: Theme.colors.textMuted },
});
