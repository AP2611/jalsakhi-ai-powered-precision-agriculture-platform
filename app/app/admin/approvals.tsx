import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Theme } from '../../constants/JalSakhiTheme';
import { AdminHeader } from '../../components/AdminHeader';
import { Feather, MaterialIcons } from '@expo/vector-icons';

const REQUESTS = [
    { id: '1', farmer: 'Sunita Patel', type: 'Extra Allocation', amount: '500 L', reason: 'Heatwave expected', time: '2 hours ago', status: 'Pending' },
    { id: '2', farmer: 'Raju Kumar', type: 'Schedule Change', amount: '-', reason: 'Pump maintenance', time: '4 hours ago', status: 'Pending' },
    { id: '3', farmer: 'Village School', type: 'New Connection', amount: '1000 L', reason: 'Garden setup', time: '1 day ago', status: 'Pending' },
];

export default function Approvals() {
    const { t } = useTranslation();
    const renderItem = ({ item }: { item: typeof REQUESTS[0] }) => (
        <View style={styles.card}>
            <View style={styles.header}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{item.farmer[0]}</Text>
                </View>
                <View style={styles.headerText}>
                    <Text style={styles.name}>{item.farmer}</Text>
                    <Text style={styles.time}>{item.time}</Text>
                </View>
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>{item.type}</Text>
                </View>
            </View>

            <View style={styles.body}>
                <Text style={styles.label}>{t('admin.approvals.reason')}</Text>
                <Text style={styles.value}>{item.reason}</Text>
                {item.amount !== '-' && (
                    <>
                        <Text style={[styles.label, { marginTop: 8 }]}>{t('admin.approvals.requestedAmount')}</Text>
                        <Text style={[styles.value, { color: Theme.colors.primary, fontWeight: 'bold' }]}>{item.amount}</Text>
                    </>
                )}
            </View>

            <View style={styles.actions}>
                <TouchableOpacity style={[styles.btn, styles.btnReject]}>
                    <Feather name="x" size={18} color={Theme.colors.error} />
                    <Text style={styles.btnTextReject}>{t('admin.approvals.reject')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.btn, styles.btnApprove]}>
                    <Feather name="check" size={18} color="white" />
                    <Text style={styles.btnTextApprove}>{t('admin.approvals.approve')}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <AdminHeader title={t('admin.approvals.title')} />

            <View style={styles.content}>
                {REQUESTS.length > 0 ? (
                    <FlatList
                        data={REQUESTS}
                        keyExtractor={(item) => item.id}
                        renderItem={renderItem}
                        contentContainerStyle={styles.list}
                        showsVerticalScrollIndicator={false}
                    />
                ) : (
                    <View style={styles.emptyState}>
                        <Feather name="check-circle" size={48} color={Theme.colors.success} />
                        <Text style={styles.emptyText}>{t('admin.approvals.noPending')}</Text>
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Theme.colors.bg, overflow: 'hidden' as const },
    content: { flex: 1, padding: 16 },
    list: { gap: 16 },
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 12,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    headerText: {
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Theme.colors.text,
    },
    time: {
        fontSize: 12,
        color: Theme.colors.textMuted,
    },
    badge: {
        backgroundColor: '#f0f9ff',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e0f2fe',
    },
    badgeText: {
        fontSize: 10,
        fontWeight: '600',
        color: '#0369a1',
    },
    body: {
        backgroundColor: '#f8fafc',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
    },
    label: {
        fontSize: 12,
        color: Theme.colors.textMuted,
        marginBottom: 2,
    },
    value: {
        fontSize: 14,
        color: Theme.colors.text,
    },
    actions: {
        flexDirection: 'row',
        gap: 12,
    },
    btn: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
        borderRadius: 8,
        gap: 8,
    },
    btnReject: {
        backgroundColor: '#fff1f2',
        borderWidth: 1,
        borderColor: '#ffe4e6',
    },
    btnApprove: {
        backgroundColor: Theme.colors.primary,
    },
    btnTextReject: {
        color: Theme.colors.error,
        fontWeight: '600',
        fontSize: 14,
    },
    btnTextApprove: {
        color: 'white',
        fontWeight: '600',
        fontSize: 14,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 16,
    },
    emptyText: {
        fontSize: 18,
        color: Theme.colors.textMuted,
        fontWeight: '600',
    },
});
