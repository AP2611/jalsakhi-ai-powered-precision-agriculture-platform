import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Theme } from '../../constants/JalSakhiTheme';
import { AdminHeader } from '../../components/AdminHeader';
import { BentoCard } from '../../components/BentoCard';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

export default function FarmerDetails() {
    const { id } = useLocalSearchParams();
    // In a real app, fetch details based on ID.
    const farmer = {
        name: 'Raju Kumar',
        phone: '+91 98001 23456',
        address: 'House #42, North Lane, Rampur',
        credits: 840,
        farms: [
            { name: 'North Field', crop: 'Wheat', size: '3.5 Acres', status: 'Optimal' },
            { name: 'South Patch', crop: 'Mustard', size: '1.2 Acres', status: 'Needs Water' },
        ]
    };

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <AdminHeader title="Farmer Profile" />

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Profile Header */}
                <View style={styles.profileCard}>
                    <View style={styles.avatarContainer}>
                        <Text style={styles.avatarText}>RK</Text>
                    </View>
                    <Text style={styles.name}>{farmer.name}</Text>
                    <Text style={styles.phone}>{farmer.phone}</Text>
                    <Text style={styles.address}>{farmer.address}</Text>

                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Text style={styles.statVal}>{farmer.farms.length}</Text>
                            <Text style={styles.statLab}>Farms</Text>
                        </View>
                        <View style={styles.verticalLine} />
                        <View style={styles.statItem}>
                            <Text style={styles.statVal}>{farmer.credits}</Text>
                            <Text style={styles.statLab}>Credits</Text>
                        </View>
                    </View>
                </View>

                {/* Farms List */}
                <Text style={styles.sectionTitle}>Registered Farms</Text>
                {farmer.farms.map((farm, index) => (
                    <BentoCard key={index} style={styles.farmCard}>
                        <View style={styles.farmRow}>
                            <View>
                                <Text style={styles.farmName}>{farm.name}</Text>
                                <Text style={styles.farmMeta}>{farm.crop} • {farm.size}</Text>
                            </View>
                            <View style={[
                                styles.statusBadge,
                                { backgroundColor: farm.status === 'Optimal' ? Theme.colors.dew : '#fef2f2' }
                            ]}>
                                <Text style={[
                                    styles.statusText,
                                    { color: farm.status === 'Optimal' ? Theme.colors.emerald : Theme.colors.error }
                                ]}>{farm.status}</Text>
                            </View>
                        </View>
                    </BentoCard>
                ))}

                {/* Actions */}
                <View style={styles.actionRow}>
                    <TouchableOpacity style={[styles.actionBtn, { backgroundColor: Theme.colors.primary }]}>
                        <Feather name="message-square" size={20} color="white" />
                        <Text style={styles.actionBtnText}>Message</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#fef2f2', borderWidth: 1, borderColor: '#fee2e2' }]}>
                        <Feather name="alert-triangle" size={20} color={Theme.colors.error} />
                        <Text style={[styles.actionBtnText, { color: Theme.colors.error }]}>Flag User</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Theme.colors.bg, overflow: 'hidden' as const },
    scrollContent: { padding: 16 },
    profileCard: {
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 24,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: Theme.colors.border,
    },
    avatarContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: Theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    avatarText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: 'white',
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Theme.colors.text,
        marginBottom: 4,
    },
    phone: {
        fontSize: 14,
        color: Theme.colors.textMuted,
        marginBottom: 2,
    },
    address: {
        fontSize: 14,
        color: Theme.colors.textMuted,
        textAlign: 'center',
        marginBottom: 20,
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        justifyContent: 'space-evenly',
        borderTopWidth: 1,
        borderTopColor: Theme.colors.border,
        paddingTop: 16,
    },
    statItem: {
        alignItems: 'center',
    },
    statVal: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Theme.colors.text,
    },
    statLab: {
        fontSize: 12,
        color: Theme.colors.textMuted,
        fontWeight: '600',
    },
    verticalLine: {
        width: 1,
        height: 30,
        backgroundColor: Theme.colors.border,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Theme.colors.text,
        marginBottom: 12,
    },
    farmCard: {
        marginBottom: 12,
    },
    farmRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    farmName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Theme.colors.text,
    },
    farmMeta: {
        fontSize: 12,
        color: Theme.colors.textMuted,
        marginTop: 2,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
    },
    actionRow: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 12,
    },
    actionBtn: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 14,
        borderRadius: 12,
        gap: 8,
    },
    actionBtnText: {
        fontSize: 14,
        fontWeight: '700',
        color: 'white',
    },
});
