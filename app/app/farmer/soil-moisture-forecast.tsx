import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput, Alert, StatusBar, Dimensions } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Theme } from '../../constants/JalSakhiTheme';
import { Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { MLService } from '../../services/ml';
import { Logger } from '../../utils/Logger';

const screenWidth = Dimensions.get('window').width;

export default function SoilMoistureForecast() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [mode, setMode] = useState<'sensor' | 'location'>('sensor');

    // Sensor values
    const [sensorData, setSensorData] = useState({
        avg_pm1: '10',
        avg_pm2: '20',
        avg_pm3: '15',
        avg_am: '0.5',
        avg_lum: '200',
        avg_temp: '28',
        avg_humd: '65',
        avg_pres: '101325'
    });

    // List of states and months for ChipSelector
    const states = ['Maharashtra', 'Rajasthan', 'Gujarat', 'Karnataka', 'Madhya Pradesh', 'Uttar Pradesh'];
    const months = [
        { label: 'Jan', value: '1' }, { label: 'Feb', value: '2' }, { label: 'Mar', value: '3' },
        { label: 'Apr', value: '4' }, { label: 'May', value: '5' }, { label: 'Jun', value: '6' },
        { label: 'Jul', value: '7' }, { label: 'Aug', value: '8' }, { label: 'Sep', value: '9' },
        { label: 'Oct', value: '10' }, { label: 'Nov', value: '11' }, { label: 'Dec', value: '12' }
    ];

    // Location values
    const [locationData, setLocationData] = useState({
        state: 'Maharashtra',
        district: 'Pune',
        month: (new Date().getMonth() + 1).toString(),
        smHistory: '45, 42, 40, 38, 41, 44, 46'
    });

    const handleForecast = async () => {
        setLoading(true);
        setResult(null);
        try {
            let input: any;
            if (mode === 'sensor') {
                input = {
                    avg_pm1: parseFloat(sensorData.avg_pm1),
                    avg_pm2: parseFloat(sensorData.avg_pm2),
                    avg_pm3: parseFloat(sensorData.avg_pm3),
                    avg_am: parseFloat(sensorData.avg_am),
                    avg_lum: parseFloat(sensorData.avg_lum),
                    avg_temp: parseFloat(sensorData.avg_temp),
                    avg_humd: parseFloat(sensorData.avg_humd),
                    avg_pres: parseFloat(sensorData.avg_pres)
                };
            } else {
                input = {
                    state: locationData.state,
                    district: locationData.district,
                    month: parseInt(locationData.month),
                    sm_history: locationData.smHistory.split(',').map(n => parseInt(n.trim()))
                };
            }
            const forecastData = await MLService.forecastSoilMoisture(input);

            // Map the different API outputs to a consistent UI object
            let mappedResult: any = {
                level: 0,
                advice: forecastData?.advice || 'Monitor soil levels regularly.',
                trend: forecastData?.trend?.toUpperCase() || 'STABLE',
                futureForecast: []
            };

            // Unified handling for predictions array (returned by both modes)
            const predictions = forecastData?.predictions || forecastData?.forecast || [];
            const days = forecastData?.days_ahead || [];

            if (predictions.length > 0) {
                mappedResult.level = Math.round(predictions[0]);
                // Calculate trend based on first vs last prediction
                const first = predictions[0];
                const last = predictions[predictions.length - 1];
                mappedResult.trend = last > first ? 'UP' : last < first ? 'DOWN' : 'STABLE';

                mappedResult.futureForecast = predictions.map((val: number, idx: number) => ({
                    day: `Day ${days[idx] || (idx + 1)}`,
                    value: Math.round(val)
                }));
            } else if (forecastData?.current_level !== undefined) {
                mappedResult.level = Math.round(forecastData.current_level);
            }

            setResult(mappedResult);
        } catch (error) {
            Logger.error('SoilMoistureForecast', 'Forecast failed', error);
            Alert.alert('Error', 'Failed to forecast soil moisture.');
        } finally {
            setLoading(false);
        }
    };

    const GlassCard = ({ title, icon, children, style, intensity = 40 }: any) => (
        <View style={[styles.glassCard, style]}>
            <BlurView intensity={intensity} tint="light" style={styles.cardBlur}>
                <View style={styles.cardHeader}>
                    <View style={styles.cardIconBox}>
                        <MaterialCommunityIcons name={icon} size={20} color={Theme.colors.primary} />
                    </View>
                    <Text style={styles.cardTitle}>{title}</Text>
                </View>
                {children}
            </BlurView>
        </View>
    );

    const ChipSelector = ({ label, options, selectedValue, onValueChange, horizontal = true }: any) => (
        <View style={styles.inputContainer}>
            <Text style={styles.miniLabel}>{label}</Text>
            <ScrollView
                horizontal={horizontal}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.chipList}
            >
                {options.map((option: any) => {
                    const val = typeof option === 'string' ? option : option.value;
                    const lab = typeof option === 'string' ? option : option.label;
                    const isSelected = selectedValue === val;
                    return (
                        <TouchableOpacity
                            key={val}
                            style={[styles.chip, isSelected && styles.activeChip]}
                            onPress={() => onValueChange(val)}
                        >
                            <Text style={[styles.chipText, isSelected && styles.activeChipText]}>
                                {lab}
                            </Text>
                            {isSelected && <Ionicons name="checkmark-circle" size={14} color="white" style={{ marginLeft: 6 }} />}
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <Stack.Screen options={{ headerShown: false }} />

            {/* Decorative Patterns */}
            <View style={styles.decorativeLayer} pointerEvents="none">
                <View style={[styles.designLine, { top: '15%', left: -50, transform: [{ rotate: '45deg' }] }]} />
                <View style={[styles.designLine, { bottom: '10%', right: -80, width: 300, transform: [{ rotate: '-30deg' }] }]} />
            </View>

            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                        <BlurView intensity={60} tint="light" style={styles.backBlur}>
                            <Feather name="chevron-left" size={24} color={Theme.colors.text} />
                        </BlurView>
                    </TouchableOpacity>
                    <View style={styles.headerTextContainer}>
                        <Text style={styles.title}>Moisture Forecast</Text>
                        <Text style={styles.subtitle}>AI Soil Retension Analysis</Text>
                    </View>
                </View>

                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.bentoGrid}>
                        {/* Mode Switcher */}
                        <View style={styles.modeSwitcher}>
                            <TouchableOpacity
                                style={[styles.modeBtn, mode === 'sensor' && styles.activeMode]}
                                onPress={() => setMode('sensor')}
                            >
                                <Text style={[styles.modeText, mode === 'sensor' && styles.activeModeText]}>SENSORS</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modeBtn, mode === 'location' && styles.activeMode]}
                                onPress={() => setMode('location')}
                            >
                                <Text style={[styles.modeText, mode === 'location' && styles.activeModeText]}>LOCATION</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Input Section */}
                        {mode === 'sensor' ? (
                            <GlassCard title="Environment Sensors" icon="sensor" style={styles.fullWidth}>
                                <View style={styles.sensorGrid}>
                                    <View style={styles.sensorInputHalf}>
                                        <Text style={styles.miniLabel}>PM1</Text>
                                        <View style={styles.inputWrapper}>
                                            <TextInput style={styles.input} value={sensorData.avg_pm1} onChangeText={t => setSensorData({ ...sensorData, avg_pm1: t })} keyboardType="numeric" />
                                        </View>
                                    </View>
                                    <View style={styles.sensorInputHalf}>
                                        <Text style={styles.miniLabel}>PM2.5</Text>
                                        <View style={styles.inputWrapper}>
                                            <TextInput style={styles.input} value={sensorData.avg_pm2} onChangeText={t => setSensorData({ ...sensorData, avg_pm2: t })} keyboardType="numeric" />
                                        </View>
                                    </View>
                                    <View style={styles.sensorInputHalf}>
                                        <Text style={styles.miniLabel}>PM10</Text>
                                        <View style={styles.inputWrapper}>
                                            <TextInput style={styles.input} value={sensorData.avg_pm3} onChangeText={t => setSensorData({ ...sensorData, avg_pm3: t })} keyboardType="numeric" />
                                        </View>
                                    </View>
                                    <View style={styles.sensorInputHalf}>
                                        <Text style={styles.miniLabel}>Ammonia</Text>
                                        <View style={styles.inputWrapper}>
                                            <TextInput style={styles.input} value={sensorData.avg_am} onChangeText={t => setSensorData({ ...sensorData, avg_am: t })} keyboardType="numeric" />
                                        </View>
                                    </View>
                                    <View style={styles.sensorInputHalf}>
                                        <Text style={styles.miniLabel}>Luminosity</Text>
                                        <View style={styles.inputWrapper}>
                                            <TextInput style={styles.input} value={sensorData.avg_lum} onChangeText={t => setSensorData({ ...sensorData, avg_lum: t })} keyboardType="numeric" />
                                        </View>
                                    </View>
                                    <View style={styles.sensorInputHalf}>
                                        <Text style={styles.miniLabel}>Temp (°C)</Text>
                                        <View style={styles.inputWrapper}>
                                            <TextInput style={styles.input} value={sensorData.avg_temp} onChangeText={t => setSensorData({ ...sensorData, avg_temp: t })} keyboardType="numeric" />
                                        </View>
                                    </View>
                                    <View style={styles.sensorInputHalf}>
                                        <Text style={styles.miniLabel}>Humidity (%)</Text>
                                        <View style={styles.inputWrapper}>
                                            <TextInput style={styles.input} value={sensorData.avg_humd} onChangeText={t => setSensorData({ ...sensorData, avg_humd: t })} keyboardType="numeric" />
                                        </View>
                                    </View>
                                    <View style={styles.sensorInputHalf}>
                                        <Text style={styles.miniLabel}>Pressure (Pa)</Text>
                                        <View style={styles.inputWrapper}>
                                            <TextInput style={styles.input} value={sensorData.avg_pres} onChangeText={t => setSensorData({ ...sensorData, avg_pres: t })} keyboardType="numeric" />
                                        </View>
                                    </View>
                                </View>
                                <TouchableOpacity
                                    style={[styles.forecastBtn, loading && styles.btnDisabled]}
                                    onPress={handleForecast}
                                    disabled={loading}
                                >
                                    <LinearGradient colors={['#10b981', '#059669']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.gradientBtn}>
                                        <MaterialCommunityIcons name="lightning-bolt" size={20} color="white" />
                                        <Text style={styles.btnText}>{loading ? 'Analyzing...' : 'Run Sensor Analysis'}</Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </GlassCard>
                        ) : (
                            <GlassCard title="Location Forecast" icon="map-marker-radius" style={styles.fullWidth}>
                                <ChipSelector
                                    label="State"
                                    options={states}
                                    selectedValue={locationData.state}
                                    onValueChange={(v: string) => setLocationData({ ...locationData, state: v })}
                                />

                                <View style={styles.row}>
                                    <View style={styles.halfInput}>
                                        <Text style={styles.miniLabel}>District</Text>
                                        <View style={styles.inputWrapper}>
                                            <TextInput
                                                style={styles.input}
                                                placeholder="Udaipur"
                                                value={locationData.district}
                                                onChangeText={t => setLocationData({ ...locationData, district: t })}
                                            />
                                        </View>
                                    </View>
                                </View>

                                <ChipSelector
                                    label="Month"
                                    options={months}
                                    selectedValue={locationData.month}
                                    onValueChange={(v: string) => setLocationData({ ...locationData, month: v })}
                                />

                                <View style={[styles.inputContainer, { marginTop: 4 }]}>
                                    <Text style={styles.miniLabel}>Past 7 Days History (%)</Text>
                                    <View style={styles.inputWrapper}>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="42, 45, 40..."
                                            value={locationData.smHistory}
                                            onChangeText={t => setLocationData({ ...locationData, smHistory: t })}
                                        />
                                    </View>
                                </View>
                                <TouchableOpacity
                                    style={[styles.forecastBtn, loading && styles.btnDisabled, { marginTop: 12 }]}
                                    onPress={handleForecast}
                                    disabled={loading}
                                >
                                    <LinearGradient colors={['#3b82f6', '#2563eb']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.gradientBtn}>
                                        <MaterialCommunityIcons name="map-search" size={20} color="white" />
                                        <Text style={styles.btnText}>{loading ? 'Processing...' : 'Run Location Forecast'}</Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </GlassCard>
                        )}

                        {/* Results Section */}
                        {result && (
                            <>
                                <View style={styles.row}>
                                    <GlassCard title="Soil Level" icon="percent" style={styles.halfWidth} intensity={50}>
                                        <View style={styles.levelContainer}>
                                            <Text style={[styles.levelValue, { color: result.level < 40 ? Theme.colors.error : Theme.colors.success }]}>
                                                {result.level}%
                                            </Text>
                                            <View style={[styles.trendBadge, { backgroundColor: result.trend === 'UP' ? '#dcfce7' : '#fee2e2' }]}>
                                                <Feather
                                                    name={result.trend === 'UP' ? 'trending-up' : (result.trend === 'DOWN' ? 'trending-down' : 'minus')}
                                                    size={14}
                                                    color={result.trend === 'UP' ? '#166534' : (result.trend === 'DOWN' ? '#991b1b' : '#475569')}
                                                />
                                                <Text style={[styles.trendText, { color: result.trend === 'UP' ? '#166534' : (result.trend === 'DOWN' ? '#991b1b' : '#475569') }]}>{result.trend}</Text>
                                            </View>
                                        </View>
                                    </GlassCard>

                                    <GlassCard title="Condition" icon="leaf-circle" style={styles.halfWidth}>
                                        <View style={styles.conditionBox}>
                                            <Text style={styles.conditionStatus}>
                                                {result.level > 60 ? 'Optimal' : result.level > 30 ? 'Adequate' : 'Critical'}
                                            </Text>
                                            <Ionicons
                                                name={result.level > 30 ? "checkmark-circle" : "alert-circle"}
                                                size={32}
                                                color={result.level > 30 ? Theme.colors.success : Theme.colors.error}
                                            />
                                        </View>
                                    </GlassCard>
                                </View>

                                <GlassCard title="Smart Advice" icon="lightbulb-on-outline" style={styles.fullWidth}>
                                    <View style={styles.adviceContent}>
                                        <Text style={styles.adviceText}>{result.advice}</Text>
                                    </View>
                                </GlassCard>

                                {result.futureForecast && result.futureForecast.length > 0 && (
                                    <View style={{ marginTop: 8 }}>
                                        <Text style={styles.sectionHeader}>Future Moisture Forecast</Text>
                                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -20, paddingHorizontal: 20 }}>
                                            {result.futureForecast.map((item: any, idx: number) => (
                                                <View key={idx} style={styles.forecastItem}>
                                                    <View style={styles.forecastDayBox}>
                                                        <Text style={styles.forecastDayText}>{item.day}</Text>
                                                    </View>
                                                    <Text style={[styles.forecastValue, { color: item.value < 40 ? '#ef4444' : '#10b981' }]}>{item.value}%</Text>
                                                    <View style={styles.miniProgressBg}>
                                                        <View style={[styles.miniProgressFill, { width: `${item.value}%`, backgroundColor: item.value < 40 ? '#ef4444' : '#10b981' }]} />
                                                    </View>
                                                </View>
                                            ))}
                                        </ScrollView>
                                    </View>
                                )}
                            </>
                        )}
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    decorativeLayer: {
        ...StyleSheet.absoluteFillObject,
        overflow: 'hidden',
    },
    designLine: {
        position: 'absolute',
        width: 300,
        height: 1,
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 20,
        gap: 16,
    },
    backBtn: {},
    backBlur: {
        width: 44,
        height: 44,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.8)',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
    },
    headerTextContainer: {
        flex: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: '900',
        color: Theme.colors.text,
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 13,
        color: Theme.colors.textMuted,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    bentoGrid: {
        gap: 16,
    },
    fullWidth: {
        width: '100%',
    },
    halfWidth: {
        flex: 1,
    },
    glassCard: {
        borderRadius: 24,
        overflow: 'hidden',
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderColor: '#E2E8F0',
    },
    cardBlur: {
        padding: 20,
        backgroundColor: 'rgba(255,255,255,0.4)',
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 16,
    },
    cardIconBox: {
        width: 32,
        height: 32,
        borderRadius: 10,
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: Theme.colors.text,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    infoText: {
        fontSize: 15,
        color: Theme.colors.textSecondary,
        lineHeight: 22,
    },
    inputContainer: {
        marginBottom: 16,
    },
    miniLabel: {
        fontSize: 12,
        fontWeight: '800',
        color: 'rgba(6, 78, 59, 0.7)',
        marginBottom: 8,
        marginLeft: 4,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 14,
        paddingRight: 16,
        borderWidth: 1.5,
        borderColor: '#E2E8F0',
        height: 56,
    },
    input: {
        flex: 1,
        height: 56,
        paddingHorizontal: 16,
        fontSize: 16,
        color: '#064e3b',
        fontWeight: '700',
    },
    inputIcon: {
        marginLeft: 8,
    },
    forecastBtn: {
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1.5,
        borderColor: 'rgba(16, 185, 129, 0.3)',
    },
    gradientBtn: {
        height: 48,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    },
    btnText: {
        color: 'white',
        fontSize: 15,
        fontWeight: '800',
    },
    btnDisabled: {
        opacity: 0.7,
    },
    row: {
        flexDirection: 'row',
        gap: 16,
    },
    halfInput: {
        flex: 1,
    },
    modeSwitcher: {
        flexDirection: 'row',
        backgroundColor: '#E2E8F0',
        borderRadius: 14,
        padding: 4,
        marginBottom: 8,
    },
    modeBtn: {
        flex: 1,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },
    activeMode: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)',
    },
    modeText: {
        fontSize: 11,
        fontWeight: '800',
        color: '#64748b',
        letterSpacing: 0.5,
    },
    activeModeText: {
        color: '#064e3b',
    },
    levelContainer: {
        alignItems: 'center',
        gap: 8,
    },
    levelValue: {
        fontSize: 32,
        fontWeight: '900',
    },
    trendBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 4,
    },
    trendText: {
        fontSize: 11,
        fontWeight: '900',
        textTransform: 'uppercase',
    },
    conditionBox: {
        alignItems: 'center',
        gap: 6,
    },
    conditionStatus: {
        fontSize: 18,
        fontWeight: '900',
        color: Theme.colors.text,
    },
    adviceContent: {
        padding: 4,
    },
    adviceText: {
        fontSize: 15,
        color: '#064e3b',
        lineHeight: 24,
        fontWeight: '600',
    },
    sectionHeader: {
        fontSize: 16,
        fontWeight: '800',
        color: Theme.colors.text,
        marginBottom: 16,
        marginLeft: 4,
    },
    forecastItem: {
        width: 100,
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 12,
        marginRight: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    forecastDayBox: {
        marginBottom: 8,
    },
    forecastDayText: {
        fontSize: 12,
        fontWeight: '700',
        color: Theme.colors.textMuted,
    },
    forecastValue: {
        fontSize: 20,
        fontWeight: '900',
        marginBottom: 8,
    },
    miniProgressBg: {
        height: 4,
        width: '100%',
        backgroundColor: '#f1f5f9',
        borderRadius: 2,
        overflow: 'hidden',
    },
    miniProgressFill: {
        height: '100%',
        borderRadius: 2,
    },
    sensorGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 8,
    },
    sensorInputHalf: {
        width: (screenWidth - 80) / 2, // Accounting for padding and gap
    },
    chipList: {
        flexDirection: 'row',
        gap: 8,
        paddingBottom: 8,
    },
    chip: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 14,
        backgroundColor: 'white',
        borderWidth: 1.5,
        borderColor: '#E2E8F0',
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 4,
    },
    activeChip: {
        backgroundColor: '#064e3b',
        borderColor: '#064e3b',
    },
    chipText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#64748b',
    },
    activeChipText: {
        color: 'white',
    },
});
