import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Theme } from '../../constants/JalSakhiTheme';
import { AdminHeader } from '../../components/AdminHeader';
import { Feather, MaterialIcons } from '@expo/vector-icons';

const REPORTS = [
    { id: '1', location: 'North Field Pipe A', type: 'Leakage', severity: 'High', reporter: 'System Sensor', time: '30 mins ago', status: 'Open' },
    { id: '2', location: 'Village Tap #4', type: 'Overflow', severity: 'Medium', reporter: 'Mohan Meena', time: '2 hours ago', status: 'In Progress' },
    { id: '3', location: 'Canal Gate B', type: 'Blockage', severity: 'Low', reporter: 'Rakeshbhai', time: '1 day ago', status: 'Resolved' },
];

export default function WastageReports() {
    const { t } = useTranslation();
    const renderItem = ({ item }: { item: typeof REPORTS[0] }) => (
        <View style={styles.card}>
            <View style={styles.header}>
                <View style={[
                    styles.iconBox,
                    item.severity === 'High' && { backgroundColor: '#fef2f2' },
                    item.severity === 'Medium' && { backgroundColor: '#fffbeb' },
                    item.severity === 'Low' && { backgroundColor: '#f0f9ff' },
                ]}>
                    <Feather
                        name="alert-triangle"
                        size={20}
                        color={
                            item.severity === 'High' ? Theme.colors.error :
                                item.severity === 'Medium' ? '#d97706' : '#0369a1'
                        }
                    />
                </View>
                <View style={styles.headerText}>
                    <Text style={styles.location}>{item.location}</Text>
                    <Text style={styles.meta}>{t(`admin.wastage.types.${item.type.toLowerCase()}`)} • {item.time}</Text>
                </View>
                <View style={[
                    styles.statusBadge,
                    item.status === 'Open' && { backgroundColor: Theme.colors.error },
                    item.status === 'In Progress' && { backgroundColor: '#fbbf24' },
                    item.status === 'Resolved' && { backgroundColor: Theme.colors.success },
                ]}>
                    <Text style={styles.statusText}>{t(`common.${item.status === 'In Progress' ? 'inProgress' : item.status.toLowerCase()}`)}</Text>
                </View>
            </View>

            <View style={styles.footer}>
                <Text style={styles.reporter}>{t('admin.wastage.reportedBy', { reporter: item.reporter === 'System Sensor' ? t('admin.wastage.reporters.systemSensor') : item.reporter })}</Text>
                <TouchableOpacity>
                    <Text style={styles.actionLink}>{t('admin.wastage.viewDetails')}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <AdminHeader title={t('admin.wastage.title')} actionLabel={t('admin.wastage.export')} onActionPress={() => { }} />

            <View style={styles.content}>
                <View style={styles.statsRow}>
                    <View style={[styles.statCard, { backgroundColor: '#fef2f2', borderColor: '#fee2e2' }]}>
                        <Text style={[styles.statVal, { color: Theme.colors.error }]}>5</Text>
                        <Text style={styles.statLab}>{t('admin.wastage.criticalLeakages')}</Text>
                    </View>
                    <View style={[styles.statCard, { backgroundColor: '#fffbeb', borderColor: '#fef3c7' }]}>
                        <Text style={[styles.statVal, { color: '#d97706' }]}>12%</Text>
                        <Text style={styles.statLab}>{t('admin.wastage.lossRate')}</Text>
                    </View>
                </View>

                <Text style={styles.listTitle}>{t('admin.wastage.recentIncidents')}</Text>
                <FlatList
                    data={REPORTS}
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
    content: { flex: 1, padding: 16 },
    statsRow: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 24,
    },
    statCard: {
        flex: 1,
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        alignItems: 'center',
    },
    statVal: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    statLab: {
        fontSize: 12,
        color: Theme.colors.textMuted,
        fontWeight: '600',
    },
    listTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Theme.colors.text,
        marginBottom: 12,
    },
    list: { gap: 12 },
    card: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: Theme.colors.border,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 12,
    },
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerText: {
        flex: 1,
    },
    location: {
        fontSize: 14,
        fontWeight: 'bold',
        color: Theme.colors.text,
    },
    meta: {
        fontSize: 12,
        color: Theme.colors.textMuted,
        marginTop: 2,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        fontSize: 10,
        color: 'white',
        fontWeight: '700',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: Theme.colors.border,
    },
    reporter: {
        fontSize: 12,
        color: Theme.colors.textMuted,
    },
    actionLink: {
        fontSize: 12,
        fontWeight: '700',
        color: Theme.colors.primary,
    },
});
