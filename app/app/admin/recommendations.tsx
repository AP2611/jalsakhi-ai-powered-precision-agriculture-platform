import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { Theme } from '../../constants/JalSakhiTheme';
import { AdminHeader } from '../../components/AdminHeader';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

const RECOMMENDATIONS = [
    { id: '1', crop: 'Wheat (HD 2967)', suitablity: '98%', waterReq: 'Moderate', reason: 'High yield potential with current reservoir levels.', season: 'Rabi' },
    { id: '2', crop: 'Mustard', suitablity: '95%', waterReq: 'Low', reason: 'Excellent for current soil moisture.', season: 'Rabi' },
    { id: '3', crop: 'Chickpea', suitablity: '88%', waterReq: 'Very Low', reason: 'Good backup options for dryer zones.', season: 'Rabi' },
];

export default function CropRecommendations() {
    const renderItem = ({ item }: { item: typeof RECOMMENDATIONS[0] }) => (
        <View style={styles.card}>
            <View style={styles.header}>
                <View style={styles.iconBox}>
                    <MaterialCommunityIcons name="sprout" size={24} color={Theme.colors.emerald} />
                </View>
                <View style={styles.headerText}>
                    <Text style={styles.cropName}>{item.crop}</Text>
                    <Text style={styles.meta}>{item.season} Season • {item.waterReq} Water</Text>
                </View>
                <View style={styles.scoreBadge}>
                    <Text style={styles.score}>{item.suitablity}</Text>
                    <Text style={styles.scoreLabel}>Match</Text>
                </View>
            </View>

            <View style={styles.body}>
                <Text style={styles.label}>AI Reasoning:</Text>
                <Text style={styles.reason}>{item.reason}</Text>
            </View>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.actionBtn}>
                    <Feather name="send" size={16} color="white" />
                    <Text style={styles.btnText}>Broadcast to Farmers</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <AdminHeader title="Crop Recommendations" />

            <View style={styles.content}>
                <View style={styles.infoCard}>
                    <Feather name="info" size={20} color="#0369a1" />
                    <Text style={styles.infoText}>Recommendations based on current soil moisture (38%) and reservoir levels (68%).</Text>
                </View>

                <FlatList
                    data={RECOMMENDATIONS}
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
    infoCard: {
        flexDirection: 'row',
        backgroundColor: '#f0f9ff',
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#bae6fd',
        marginBottom: 20,
        gap: 12,
        alignItems: 'center',
    },
    infoText: { flex: 1, fontSize: 13, color: '#0369a1', lineHeight: 20 },
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
    header: { flexDirection: 'row', gap: 12, alignItems: 'center', marginBottom: 12 },
    iconBox: {
        width: 48, height: 48, borderRadius: 12, backgroundColor: Theme.colors.dew,
        justifyContent: 'center', alignItems: 'center',
    },
    headerText: { flex: 1 },
    cropName: { fontSize: 18, fontWeight: 'bold', color: Theme.colors.text },
    meta: { fontSize: 12, color: Theme.colors.textMuted, marginTop: 2 },
    scoreBadge: { alignItems: 'center', backgroundColor: '#ecfccb', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
    score: { fontSize: 16, fontWeight: 'bold', color: '#4d7c0f' },
    scoreLabel: { fontSize: 10, color: '#4d7c0f', fontWeight: '600' },
    body: { backgroundColor: '#f8fafc', padding: 12, borderRadius: 8, marginBottom: 16 },
    label: { fontSize: 12, color: Theme.colors.textMuted, marginBottom: 2, fontWeight: '600' },
    reason: { fontSize: 14, color: Theme.colors.text, lineHeight: 20 },
    footer: { alignItems: 'flex-end' },
    actionBtn: { flexDirection: 'row', backgroundColor: Theme.colors.primary, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8, gap: 8, alignItems: 'center' },
    btnText: { color: 'white', fontWeight: 'bold', fontSize: 14 },
});
