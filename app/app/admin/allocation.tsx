import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { Theme } from '../../constants/JalSakhiTheme';
import { AdminHeader } from '../../components/AdminHeader';
import { Feather } from '@expo/vector-icons';

const ALLOCATIONS = [
    { id: '1', farmer: 'Raju Kumar', farm: 'North Field (Wheat)', amount: '1,200 L', status: 'Approved' },
    { id: '2', farmer: 'Sunita Patel', farm: 'River Bank (Rice)', amount: '2,500 L', status: 'Pending' },
    { id: '3', farmer: 'Mohan Meena', farm: 'Hill Side (Cotton)', amount: '800 L', status: 'Approved' },
    { id: '4', farmer: 'Priya Devi', farm: 'East Patch (Soybean)', amount: '1,000 L', status: 'Rejected' },
];

export default function WaterAllocation() {
    const renderItem = ({ item }: { item: typeof ALLOCATIONS[0] }) => (
        <View style={styles.card}>
            <View style={styles.row}>
                <View>
                    <Text style={styles.farmer}>{item.farmer}</Text>
                    <Text style={styles.farm}>{item.farm}</Text>
                </View>
                <View style={styles.right}>
                    <Text style={styles.amount}>{item.amount}</Text>
                    <Text style={[
                        styles.status,
                        item.status === 'Approved' && { color: Theme.colors.success },
                        item.status === 'Pending' && { color: '#d97706' },
                        item.status === 'Rejected' && { color: Theme.colors.error }
                    ]}>{item.status}</Text>
                </View>
            </View>
            {item.status === 'Pending' && (
                <View style={styles.actions}>
                    <TouchableOpacity style={[styles.btn, styles.btnReject]}>
                        <Text style={styles.btnTextReject}>Reject</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.btn, styles.btnApprove]}>
                        <Text style={styles.btnTextApprove}>Approve</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <AdminHeader title="Water Allocation" actionLabel="Auto-Allocate" onActionPress={() => { }} />

            <View style={styles.content}>
                <View style={styles.stats}>
                    <View style={styles.statItem}>
                        <Text style={styles.statVal}>4.2M</Text>
                        <Text style={styles.statLab}>Total Demand</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.statItem}>
                        <Text style={[styles.statVal, { color: Theme.colors.success }]}>1.2M</Text>
                        <Text style={styles.statLab}>Allocated</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.statItem}>
                        <Text style={[styles.statVal, { color: Theme.colors.error }]}>3.0M</Text>
                        <Text style={styles.statLab}>Deficit</Text>
                    </View>
                </View>

                <View style={styles.listHeader}>
                    <Text style={styles.listTitle}>Recent Requests</Text>
                    <TouchableOpacity><Text style={styles.filter}>Filter ▾</Text></TouchableOpacity>
                </View>

                <FlatList
                    data={ALLOCATIONS}
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
    stats: {
        flexDirection: 'row',
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: Theme.colors.border,
        marginBottom: 20,
        justifyContent: 'space-between',
    },
    statItem: { alignItems: 'center', flex: 1 },
    statVal: { fontSize: 18, fontWeight: 'bold', color: Theme.colors.text },
    statLab: { fontSize: 10, color: Theme.colors.textMuted, marginTop: 4, textTransform: 'uppercase' },
    divider: { width: 1, height: '100%', backgroundColor: Theme.colors.border },
    listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    listTitle: { fontSize: 16, fontWeight: 'bold', color: Theme.colors.text },
    filter: { fontSize: 12, color: Theme.colors.primary, fontWeight: '600' },
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
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    farmer: { fontSize: 16, fontWeight: 'bold', color: Theme.colors.text },
    farm: { fontSize: 12, color: Theme.colors.textMuted, marginTop: 2 },
    right: { alignItems: 'flex-end' },
    amount: { fontSize: 16, fontWeight: 'bold', color: Theme.colors.primary },
    status: { fontSize: 12, fontWeight: '600', marginTop: 2 },
    actions: { flexDirection: 'row', gap: 12, marginTop: 12 },
    btn: { flex: 1, paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
    btnReject: { backgroundColor: '#fef2f2', borderWidth: 1, borderColor: '#fee2e2' },
    btnApprove: { backgroundColor: Theme.colors.primary },
    btnTextReject: { color: Theme.colors.error, fontWeight: '600', fontSize: 12 },
    btnTextApprove: { color: 'white', fontWeight: '600', fontSize: 12 },
});
