import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Theme } from '../../constants/JalSakhiTheme';
import { AdminHeader } from '../../components/AdminHeader';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const ANOMALIES = [
    { id: '1', title: 'Sudden Spike in Sector 4', desc: 'Usage increased by 200% between 2 AM - 4 AM.', risk: 'High', status: 'Unresolved' },
    { id: '2', title: 'Pressure Drop in Main Line', desc: 'Possible leakage near Pump House B.', risk: 'Critical', status: 'Investigating' },
    { id: '3', title: 'Irregular Usage Pattern', desc: 'Farm #42 using water outside schedule.', risk: 'Medium', status: 'Resolved' },
];

export default function Anomalies() {
    const { t } = useTranslation();
    const renderItem = ({ item }: { item: typeof ANOMALIES[0] }) => (
        <TouchableOpacity style={styles.card}>
            <View style={styles.row}>
                <View style={styles.iconContainer}>
                    <MaterialCommunityIcons name="pulse" size={24} color={Theme.colors.error} />
                </View>
                <View style={styles.content}>
                    <Text style={styles.cardTitle}>{item.title}</Text>
                    <Text style={styles.cardDesc}>{item.desc}</Text>
                </View>
            </View>
            <View style={styles.footer}>
                <View style={[
                    styles.tag,
                    item.risk === 'Critical' && { backgroundColor: '#fee2e2' },
                    item.risk === 'High' && { backgroundColor: '#ffedd5' },
                    item.risk === 'Medium' && { backgroundColor: '#f1f5f9' },
                ]}>
                    <Text style={[
                        styles.tagText,
                        item.risk === 'Critical' && { color: Theme.colors.error },
                        item.risk === 'High' && { color: '#c2410c' },
                        item.risk === 'Medium' && { color: Theme.colors.textMuted },
                    ]}>{t('admin.anomalies.risk', { risk: t(`common.${item.risk.toLowerCase()}`) })}</Text>
                </View>
                <Text style={styles.status}>{t(`common.${item.status.toLowerCase()}`)}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <AdminHeader title={t('admin.anomalyDetection')} />

            <View style={styles.padding}>
                <View style={styles.chartCard}>
                    <Text style={styles.chartTitle}>{t('admin.liveAnomalyMonitor')}</Text>
                    <LineChart
                        data={{
                            labels: ["10:00", "10:10", "10:20", "10:30", "10:40", "10:50"],
                            datasets: [{ data: [20, 22, 19, 85, 23, 21] }]
                        }}
                        width={screenWidth - 64}
                        height={160}
                        withDots={false}
                        withInnerLines={false}
                        chartConfig={{
                            backgroundColor: "#ffffff",
                            backgroundGradientFrom: "#ffffff",
                            backgroundGradientTo: "#ffffff",
                            decimalPlaces: 0,
                            color: (opacity = 1) => `rgba(220, 38, 38, ${opacity})`,
                            labelColor: (opacity = 1) => `rgba(100, 116, 139, ${opacity})`,
                            strokeWidth: 3,
                        }}
                        bezier
                        style={{ marginVertical: 8 }}
                    />
                    <Text style={styles.chartSub}>{t('admin.anomalies.spikeDetected', { time: '10:30 AM', sector: 'Sector 4' })}</Text>
                </View>

                <Text style={styles.sectionTitle}>{t('admin.detectedIssues')}</Text>
                <FlatList
                    data={ANOMALIES}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Theme.colors.bg, overflow: 'hidden' as const },
    padding: { flex: 1, padding: 16 },
    chartCard: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: Theme.colors.border,
    },
    chartTitle: { fontSize: 12, fontWeight: '700', color: Theme.colors.error, letterSpacing: 1, marginBottom: 8 },
    chartSub: { fontSize: 12, color: Theme.colors.error, textAlign: 'center', marginTop: 8, fontWeight: '600' },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: Theme.colors.text, marginBottom: 12 },
    list: { gap: 12 },
    card: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: Theme.colors.border,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    row: { flexDirection: 'row', gap: 12, marginBottom: 12 },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#fef2f2',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: { flex: 1 },
    cardTitle: { fontSize: 16, fontWeight: 'bold', color: Theme.colors.text },
    cardDesc: { fontSize: 12, color: Theme.colors.textMuted, marginTop: 4 },
    footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTopWidth: 1, borderTopColor: Theme.colors.border },
    tag: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
    tagText: { fontSize: 11, fontWeight: '700' },
    status: { fontSize: 12, color: Theme.colors.primary, fontWeight: '600' },
});
