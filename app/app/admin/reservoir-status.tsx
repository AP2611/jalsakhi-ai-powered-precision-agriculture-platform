import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Theme } from '../../constants/JalSakhiTheme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ReservoirStatusScreen() {
    const { t } = useTranslation();
    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ title: t('admin.reservoir.title') }} />
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.tankCard}>
                    <View style={styles.tankOuter}>
                        <View style={[styles.tankInner, { height: '75%' }]} />
                    </View>
                    <Text style={styles.percent}>{t('admin.reservoir.full', { percent: 75 })}</Text>
                    <Text style={styles.volume}>{t('admin.reservoir.volume', { current: '450,000', total: '600,000' })}</Text>
                </View>

                <View style={styles.detailsBox}>
                    <Text style={styles.sectionTitle}>{t('admin.reservoir.weeklyInflowOutflow')}</Text>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>{t('admin.reservoir.dailyAverageInflow')}</Text>
                        <Text style={[styles.detailValue, { color: Theme.colors.emerald }]}>+12,400 L</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>{t('admin.reservoir.dailyAverageOutflow')}</Text>
                        <Text style={[styles.detailValue, { color: Theme.colors.error }]}>-52,000 L</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Theme.colors.background, overflow: 'hidden' as const },
    content: { padding: 20 },
    tankCard: { backgroundColor: Theme.colors.card, padding: 40, borderRadius: 24, alignItems: 'center' },
    tankOuter: { width: 120, height: 180, backgroundColor: Theme.colors.dew, borderRadius: 12, borderWidth: 4, borderColor: Theme.colors.emerald, overflow: 'hidden', justifyContent: 'flex-end', marginBottom: 20 },
    tankInner: { width: '100%', backgroundColor: Theme.colors.emerald },
    percent: { fontSize: 32, fontWeight: '900', color: Theme.colors.forest },
    volume: { fontSize: 14, color: Theme.colors.moss, marginTop: 4 },
    detailsBox: { marginTop: 30, backgroundColor: Theme.colors.card, padding: 20, borderRadius: 20 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: Theme.colors.forest, marginBottom: 16 },
    detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Theme.colors.border },
    detailLabel: { fontSize: 14, color: Theme.colors.moss },
    detailValue: { fontSize: 16, fontWeight: 'bold' },
});
