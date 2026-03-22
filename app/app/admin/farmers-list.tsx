import React from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Theme } from '../../constants/JalSakhiTheme';
import { AdminHeader } from '../../components/AdminHeader';
import { Feather, MaterialIcons } from '@expo/vector-icons';

// Mock Data
const FARMERS = [
    { id: '1', name: 'Raju Kumar', phone: '+91 98001 23456', farms: 3, status: 'Active', credits: 840, avatarColor: ['#16a34a', '#15803d'] },
    { id: '2', name: 'Sunita Patel', phone: '+91 97654 32109', farms: 5, status: 'Warning', credits: 310, avatarColor: ['#f59e0b', '#d97706'] },
    { id: '3', name: 'Mohan Meena', phone: '+91 96543 21098', farms: 2, status: 'Critical', credits: -40, avatarColor: ['#ef4444', '#b91c1c'] },
    { id: '4', name: 'Priya Devi', phone: '+91 95432 10987', farms: 4, status: 'Active', credits: 1240, avatarColor: ['#14b8a6', '#0d9488'] },
];

export default function FarmersList() {
    const router = useRouter();
    const { t } = useTranslation();

    const renderItem = ({ item }: { item: typeof FARMERS[0] }) => (
        <TouchableOpacity style={styles.card} onPress={() => router.push({ pathname: '/admin/farmer-details', params: { id: item.id } })}>
            <View style={[styles.avatar, { backgroundColor: item.avatarColor[0] }]}>
                <Text style={styles.avatarText}>{item.name.split(' ').map(n => n[0]).join('')}</Text>
            </View>
            <View style={styles.cardContent}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.phone}>{item.phone}</Text>
                <View style={styles.tagsRow}>
                    <View style={styles.tag}>
                        <Text style={styles.tagText}>{item.farms} {t('admin.farms')}</Text>
                    </View>
                    <View style={styles.dotSeparator} />
                    <Text style={[
                        styles.statusText,
                        item.status === 'Active' && { color: Theme.colors.success },
                        item.status === 'Warning' && { color: '#d97706' },
                        item.status === 'Critical' && { color: Theme.colors.error }
                    ]}>{t(`common.${item.status.toLowerCase()}`)}</Text>
                </View>
            </View>
            <View style={styles.rightContent}>
                <Text style={[
                    styles.credits,
                    item.credits < 0 && { color: Theme.colors.error },
                    item.credits < 500 && item.credits >= 0 && { color: '#d97706' }
                ]}>{item.credits}</Text>
                <Text style={styles.creditsLabel}>{t('farmer.credits')}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <AdminHeader title={t('admin.farmersDirectory')} actionLabel={t('admin.addFarmer')} onActionPress={() => { }} />

            <View style={styles.content}>
                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <Feather name="search" size={20} color={Theme.colors.textMuted} />
                    <TextInput
                        placeholder={t('admin.searchFarmers')}
                        placeholderTextColor={Theme.colors.textMuted}
                        style={styles.input}
                    />
                    <Feather name="mic" size={20} color={Theme.colors.textMuted} />
                </View>

                {/* Filters */}
                <View style={styles.filterRow}>
                    <TouchableOpacity style={styles.filterPill}><Text style={styles.filterText}>{t('admin.status')} ▾</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.filterPill}><Text style={styles.filterText}>{t('admin.sort')} ▾</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.filterPill}><Text style={styles.filterText}>{t('admin.area')} ▾</Text></TouchableOpacity>
                </View>

                {/* List */}
                <FlatList
                    data={FARMERS}
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
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: Theme.colors.border,
    },
    input: {
        flex: 1,
        marginHorizontal: 10,
        fontSize: 16,
        color: Theme.colors.text,
    },
    filterRow: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 16,
    },
    filterPill: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: Theme.colors.border,
    },
    filterText: {
        fontSize: 12,
        color: Theme.colors.textMuted,
        fontWeight: '600',
    },
    list: {
        gap: 12,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: Theme.colors.border,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    avatarText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
    cardContent: {
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Theme.colors.text,
    },
    phone: {
        fontSize: 12,
        color: Theme.colors.textMuted,
        marginTop: 2,
    },
    tagsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 6,
    },
    tag: {
        backgroundColor: '#f1f5f9',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    tagText: {
        fontSize: 10,
        fontWeight: '600',
        color: Theme.colors.textMuted,
    },
    dotSeparator: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: Theme.colors.border,
        marginHorizontal: 6,
    },
    statusText: {
        fontSize: 10,
        fontWeight: '700',
    },
    rightContent: {
        alignItems: 'flex-end',
    },
    credits: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Theme.colors.primary,
        fontFamily: 'monospace',
    },
    creditsLabel: {
        fontSize: 10,
        color: Theme.colors.textMuted,
        marginTop: 2,
    },
});
