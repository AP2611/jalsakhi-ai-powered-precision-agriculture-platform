import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { Theme } from '../../constants/JalSakhiTheme';
import { AdminHeader } from '../../components/AdminHeader';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

const SOURCES = [
    { id: '1', name: 'Main Reservoir A', type: 'Reservoir', capacity: '5M Liters', current: '3.2M', status: 'Online', lastMaint: '2 days ago' },
    { id: '2', name: 'North Canal Pump', type: 'Pump', capacity: '2000 L/min', current: 'Active', status: 'Online', lastMaint: '1 week ago' },
    { id: '3', name: 'East Borewell', type: 'Borewell', capacity: '500 L/min', current: 'Inactive', status: 'Offline', lastMaint: '3 weeks ago' },
    { id: '4', name: 'Village Tank', type: 'Tank', capacity: '50k Liters', current: '45k', status: 'Online', lastMaint: '5 days ago' },
];

export default function WaterSources() {
    const renderItem = ({ item }: { item: typeof SOURCES[0] }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View style={styles.iconBox}>
                    <MaterialCommunityIcons
                        name={item.type === 'Reservoir' ? 'waves' : item.type === 'Pump' ? 'water-pump' : 'water-well'}
                        size={24}
                        color={Theme.colors.primary}
                    />
                </View>
                <View style={styles.headerText}>
                    <Text style={styles.sourceName}>{item.name}</Text>
                    <Text style={styles.sourceType}>{item.type}</Text>
                </View>
                <Switch
                    value={item.status === 'Online'}
                    trackColor={{ false: '#e2e8f0', true: '#bbf7d0' }}
                    thumbColor={item.status === 'Online' ? Theme.colors.success : '#f4f4f5'}
                />
            </View>

            <View style={styles.divider} />

            <View style={styles.detailsRow}>
                <View>
                    <Text style={styles.detailLabel}>Capacity</Text>
                    <Text style={styles.detailValue}>{item.capacity}</Text>
                </View>
                <View>
                    <Text style={styles.detailLabel}>Current Level/Flow</Text>
                    <Text style={[styles.detailValue, { color: Theme.colors.primary }]}>{item.current}</Text>
                </View>
                <View>
                    <Text style={styles.detailLabel}>Last Maint.</Text>
                    <Text style={styles.detailValue}>{item.lastMaint}</Text>
                </View>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <AdminHeader title="Water Sources" actionLabel="+ Add Source" onActionPress={() => { }} />

            <View style={styles.content}>
                <View style={styles.summaryRow}>
                    <View style={styles.summaryCard}>
                        <Text style={styles.summaryVal}>4</Text>
                        <Text style={styles.summaryLab}>Total Sources</Text>
                    </View>
                    <View style={styles.summaryCard}>
                        <Text style={[styles.summaryVal, { color: Theme.colors.success }]}>3</Text>
                        <Text style={styles.summaryLab}>Online</Text>
                    </View>
                    <View style={styles.summaryCard}>
                        <Text style={[styles.summaryVal, { color: Theme.colors.error }]}>1</Text>
                        <Text style={styles.summaryLab}>Offline</Text>
                    </View>
                </View>

                <FlatList
                    data={SOURCES}
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
    summaryRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 20,
    },
    summaryCard: {
        flex: 1,
        backgroundColor: 'white',
        padding: 12,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Theme.colors.border,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    summaryVal: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Theme.colors.text,
    },
    summaryLab: {
        fontSize: 10,
        color: Theme.colors.textMuted,
        marginTop: 2,
        fontWeight: '600',
    },
    list: {
        gap: 16,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: Theme.colors.border,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconBox: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: '#f0fdf4',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerText: {
        flex: 1,
    },
    sourceName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Theme.colors.text,
    },
    sourceType: {
        fontSize: 12,
        color: Theme.colors.textMuted,
        marginTop: 2,
    },
    divider: {
        height: 1,
        backgroundColor: Theme.colors.border,
        marginVertical: 12,
    },
    detailsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    detailLabel: {
        fontSize: 10,
        color: Theme.colors.textMuted,
        marginBottom: 2,
        textTransform: 'uppercase',
    },
    detailValue: {
        fontSize: 14,
        fontWeight: '600',
        color: Theme.colors.text,
    },
});
