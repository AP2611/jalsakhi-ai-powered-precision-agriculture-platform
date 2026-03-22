import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Theme } from '../../constants/JalSakhiTheme';
import { AdminHeader } from '../../components/AdminHeader';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';

export default function SimulationEngine() {
    const router = useRouter();
    const { t } = useTranslation();
    const [rainfall, setRainfall] = useState(50);
    const [population, setPopulation] = useState(0);
    const [cropMix, setCropMix] = useState(false); // false = Normal, true = High Water

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <AdminHeader title={t('admin.simulation.title')} />

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.headerCard}>
                    <MaterialCommunityIcons name="flask-outline" size={32} color={Theme.colors.primary} />
                    <Text style={styles.introText}>
                        {t('admin.simulation.intro')}
                    </Text>
                </View>

                <View style={styles.controlGroup}>
                    <Text style={styles.label}>{t('admin.simulation.expectedRainfall')}</Text>
                    <View style={styles.sliderRow}>
                        <Text style={styles.sliderVal}>{rainfall}%</Text>
                        <Slider
                            style={{ flex: 1, height: 40 }}
                            minimumValue={0}
                            maximumValue={100}
                            step={5}
                            value={rainfall}
                            onValueChange={setRainfall}
                            minimumTrackTintColor={Theme.colors.primary}
                            maximumTrackTintColor="#cbd5e1"
                            thumbTintColor={Theme.colors.primary}
                        />
                    </View>
                    <Text style={styles.hint}>{t('admin.simulation.monsoonHint')}</Text>
                </View>

                <View style={styles.controlGroup}>
                    <Text style={styles.label}>{t('admin.simulation.populationGrowth')}</Text>
                    <View style={styles.sliderRow}>
                        <Text style={styles.sliderVal}>+{population}%</Text>
                        <Slider
                            style={{ flex: 1, height: 40 }}
                            minimumValue={0}
                            maximumValue={20}
                            step={1}
                            value={population}
                            onValueChange={setPopulation}
                            minimumTrackTintColor="#d97706"
                            maximumTrackTintColor="#cbd5e1"
                            thumbTintColor="#d97706"
                        />
                    </View>
                    <Text style={styles.hint}>{t('admin.simulation.populationHint')}</Text>
                </View>

                <View style={styles.controlGroup}>
                    <View style={styles.switchRow}>
                        <Text style={styles.label}>{t('admin.simulation.highWaterCropShift')}</Text>
                        <Switch
                            value={cropMix}
                            onValueChange={setCropMix}
                            trackColor={{ false: '#e2e8f0', true: '#bbf7d0' }}
                            thumbColor={cropMix ? Theme.colors.success : '#f4f4f5'}
                        />
                    </View>
                    <Text style={styles.hint}>{t('admin.simulation.cropShiftHint')}</Text>
                </View>

                <TouchableOpacity
                    style={styles.runBtn}
                    onPress={() => router.push({ pathname: '/admin/run-simulation', params: { rainfall, population, cropMix: cropMix ? 'High' : 'Normal' } })}
                >
                    <MaterialCommunityIcons name="play" size={24} color="white" />
                    <Text style={styles.runBtnText}>{t('admin.simulation.run')}</Text>
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Theme.colors.bg, overflow: 'hidden' as const },
    scrollContent: { padding: 16 },
    headerCard: {
        backgroundColor: '#f0f9ff',
        padding: 20,
        borderRadius: 16,
        alignItems: 'center',
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#bae6fd',
    },
    introText: {
        textAlign: 'center',
        marginTop: 12,
        color: '#0369a1',
        lineHeight: 20,
    },
    controlGroup: {
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: Theme.colors.border,
    },
    label: {
        fontSize: 14,
        fontWeight: 'bold',
        color: Theme.colors.text,
        marginBottom: 8,
    },
    sliderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    sliderVal: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Theme.colors.primary,
        width: 48,
    },
    hint: {
        fontSize: 12,
        color: Theme.colors.textMuted,
        marginTop: 8,
    },
    switchRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    runBtn: {
        backgroundColor: Theme.colors.primary,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 16,
        borderRadius: 16,
        marginTop: 12,
        gap: 8,
        shadowColor: Theme.colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    runBtnText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
});
