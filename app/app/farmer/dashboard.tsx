import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity, StatusBar, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Theme } from '../../constants/JalSakhiTheme';
import { WeatherWidget } from '../../components/WeatherWidget';
import { LineChart } from 'react-native-chart-kit';
import { Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { BlurView } from 'expo-blur';

const screenWidth = Dimensions.get('window').width;
const GRID_GAP = 14;
const COLUMN_WIDTH = (screenWidth - 40 - GRID_GAP) / 2;
const ROW_HEIGHT = 90;

export default function FarmerDashboard() {
    const router = useRouter();
    const { t } = useTranslation();
    const { user } = useAuth();

    const GlassTile = ({ children, style, onPress, intensity = 40 }: any) => (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={onPress}
            style={[styles.gridItem, style]}
            disabled={!onPress}
        >
            <BlurView intensity={intensity} tint="light" style={styles.glassBackground}>
                {children}
            </BlurView>
        </TouchableOpacity>
    );

    return (
        <ImageBackground
            source={require('../../assets/images/forest_bg.jpg')}
            style={styles.container}
            resizeMode="cover"
        >
            <StatusBar barStyle="dark-content" />
            <SafeAreaView style={{ flex: 1 }}>

                {/* Decorative Pattern Layer */}
                <View style={styles.decorativeLayer} pointerEvents="none">
                    <View style={[styles.designLine, { top: '15%', left: -50, transform: [{ rotate: '45deg' }] }]} />
                    <View style={[styles.designLine, { bottom: '10%', right: -80, width: 300, transform: [{ rotate: '-30deg' }] }]} />
                    <View style={styles.blurCircle} />
                </View>

                {/* [div 1] Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.welcomeText}>{t('dashboard.welcomeBack')},</Text>
                        <Text style={styles.boldHeader}>{user?.name || 'Sameer'}</Text>
                    </View>
                    <TouchableOpacity style={styles.notifBtn} onPress={() => router.push('/notifications')}>
                        <BlurView intensity={80} tint="light" style={styles.notifBlur}>
                            <MaterialCommunityIcons name="bell-outline" size={24} color="#064e3b" />
                            <View style={styles.badgeDot} />
                        </BlurView>
                    </TouchableOpacity>
                </View>

                <ScrollView
                    contentContainerStyle={styles.gridContainer}
                    showsVerticalScrollIndicator={false}
                >
                    {/* [div 3] AI Assistant - Span 2, 1 Row */}
                    <GlassTile
                        style={styles.div3}
                        onPress={() => router.push('/farmer/chatbot')}
                        intensity={60}
                    >
                        <View style={styles.tileContentRow}>
                            <LinearGradient colors={['#10b981', '#059669']} style={styles.tileIconBox}>
                                <MaterialCommunityIcons name="robot-outline" size={24} color="white" />
                            </LinearGradient>
                            <View style={styles.tileTextContent}>
                                <Text style={styles.tileTitle}>{t('dashboard.chat')} Assistant</Text>
                                <Text style={styles.tileSub}>Ready to help with your farm query</Text>
                            </View>
                            <Ionicons name="sparkles" size={18} color="#fbbf24" style={{ marginRight: 10 }} />
                        </View>
                    </GlassTile>

                    {/* [div 4] Crop Prediction AI - Span 2, 2 Rows */}
                    <GlassTile
                        style={styles.div4}
                        onPress={() => router.push('/farmer/crop-water-input')}
                    >
                        <View style={styles.fullTileContent}>
                            <View style={[styles.iconCircle, { backgroundColor: 'rgba(59, 130, 246, 0.2)' }]}>
                                <MaterialCommunityIcons name="water-pump" size={36} color="#60a5fa" />
                            </View>
                            <View>
                                <Text style={styles.tileTitleLarge}>{t('dashboard.cropPrediction')}</Text>
                                <Text style={styles.tileSubText}>Advanced AI water requirement analysis</Text>
                            </View>
                            <View style={styles.tileActionRow}>
                                <Text style={styles.tileBtnText}>Analyze Now</Text>
                                <Feather name="arrow-right-circle" size={18} color="#064e3b" />
                            </View>
                        </View>
                    </GlassTile>

                    {/* [div 5] Soil Forecast - Span 2, 2 Rows */}
                    <GlassTile
                        style={styles.div5}
                        onPress={() => router.push('/farmer/soil-moisture-forecast')}
                    >
                        <View style={styles.fullTileContent}>
                            <View style={[styles.iconCircle, { backgroundColor: 'rgba(245, 158, 11, 0.2)' }]}>
                                <MaterialCommunityIcons name="chart-bell-curve-cumulative" size={36} color="#fbbf24" />
                            </View>
                            <View>
                                <Text style={styles.tileTitleLarge}>{t('dashboard.moistureForecast')}</Text>
                                <Text style={styles.tileSubText}>7-day soil moisture retention model</Text>
                            </View>
                            <View style={styles.tileActionRow}>
                                <Text style={styles.tileBtnText}>View Forecast</Text>
                                <Feather name="arrow-right-circle" size={18} color="#064e3b" />
                            </View>
                        </View>
                    </GlassTile>

                    {/* Side-by-Side Area */}
                    <View style={styles.sideBySideRow}>
                        {/* [div 8] Weather - 1 Col, 2 Rows */}
                        <GlassTile style={styles.div8Fixed} intensity={50}>
                            <WeatherWidget compact={true} light={true} />
                        </GlassTile>

                        {/* [div 9] Water Spend - 1 Col, 2 Rows */}
                        <GlassTile style={styles.div9Fixed}>
                            <View style={styles.metricTile}>
                                <Text style={styles.metricLabel}>Water Spend</Text>
                                <View style={styles.metricValueRow}>
                                    <Text style={styles.metricValue}>1,250</Text>
                                    <Text style={styles.metricUnit}>L</Text>
                                </View>
                                <View style={styles.metricFooter}>
                                    <Feather name="trending-down" size={14} color="#4ade80" />
                                    <Text style={styles.metricTrend}>-12.4%</Text>
                                </View>
                            </View>
                        </GlassTile>
                    </View>

                    {/* [div 6] Water Allocation - Span 2, 2 Rows */}
                    <GlassTile
                        style={styles.div6}
                        onPress={() => router.push('/farmer/water-allocation-view')}
                    >
                        <View style={styles.tileContentRow}>
                            <LinearGradient colors={['#8b5cf6', '#6d28d9']} style={styles.tileIconBox}>
                                <MaterialCommunityIcons name="water-outline" size={24} color="white" />
                            </LinearGradient>
                            <View style={styles.tileTextContent}>
                                <Text style={styles.tileTitle}>{t('dashboard.waterAllocation')}</Text>
                                <Text style={styles.tileSub}>Optimized distribution schedule</Text>
                            </View>
                            <Feather name="chevron-right" size={20} color="rgba(6, 78, 59, 0.4)" />
                        </View>
                    </GlassTile>

                    {/* [div 10] Chart - Span 2, 3 Rows */}
                    <GlassTile style={styles.div10} intensity={30}>
                        <View style={styles.chartCard}>
                            <View style={styles.chartHeader}>
                                <Text style={styles.chartTitle}>{t('dashboard.weeklyUsage')}</Text>
                                <Text style={styles.chartSub}>Last 7 Days (Litres)</Text>
                            </View>
                            <LineChart
                                data={{
                                    labels: [t('dashboard.days.mon'), t('dashboard.days.tue'), t('dashboard.days.wed'), t('dashboard.days.thu'), t('dashboard.days.fri'), t('dashboard.days.sat'), t('dashboard.days.sun')],
                                    datasets: [{ data: [450, 320, 200, 400, 380, 500, 250] }]
                                }}
                                width={screenWidth - 64}
                                height={150}
                                chartConfig={{
                                    backgroundColor: "transparent",
                                    backgroundGradientFrom: "rgba(255,255,255,0)",
                                    backgroundGradientTo: "rgba(255,255,255,0)",
                                    decimalPlaces: 0,
                                    color: (opacity = 1) => `rgba(6, 78, 59, ${opacity})`,
                                    labelColor: (opacity = 1) => `rgba(6, 78, 59, ${opacity * 0.7})`,
                                    style: { borderRadius: 16 },
                                    propsForDots: { r: "3", strokeWidth: "2", stroke: "#10b981" },
                                    propsForBackgroundLines: { strokeDasharray: "", stroke: "rgba(6, 78, 59, 0.1)" }
                                }}
                                bezier
                                withDots={true}
                                withInnerLines={true}
                                withOuterLines={false}
                                style={{ marginTop: 15, marginLeft: -15 }}
                            />
                        </View>
                    </GlassTile>
                </ScrollView>
            </SafeAreaView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ecfdf5',
    },
    decorativeLayer: {
        ...StyleSheet.absoluteFillObject,
        overflow: 'hidden',
    },
    designLine: {
        position: 'absolute',
        width: 200,
        height: 1,
        backgroundColor: 'rgba(16, 185, 129, 0.3)',
    },
    blurCircle: {
        position: 'absolute',
        top: '40%',
        right: '-10%',
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 15,
        paddingBottom: 25,
    },
    welcomeText: {
        fontSize: 16,
        color: 'rgba(6, 78, 59, 0.7)',
        fontWeight: '500',
    },
    boldHeader: {
        fontSize: 32,
        fontWeight: '900',
        color: '#064e3b',
        letterSpacing: -0.5,
    },
    notifBtn: {
        overflow: 'hidden',
        borderRadius: 25,
    },
    notifBlur: {
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    badgeDot: {
        position: 'absolute',
        top: 14,
        right: 14,
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#ef4444',
        borderWidth: 2,
        borderColor: '#064e3b',
    },
    gridContainer: {
        paddingHorizontal: 20,
        paddingBottom: 40,
        gap: GRID_GAP,
    },
    gridItem: {
        borderRadius: 32,
        overflow: 'hidden',
        borderWidth: 1.5,
        borderColor: 'rgba(6, 78, 59, 0.15)',
    },
    glassBackground: {
        flex: 1,
        paddingVertical: 20,
        paddingHorizontal: 24,
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
    },
    div3: { height: 110 },
    div4: { height: ROW_HEIGHT * 2.3 },
    div5: { height: ROW_HEIGHT * 2.3 },
    div6: { height: 110 },
    div10: { height: ROW_HEIGHT * 3.2 },
    sideBySideRow: {
        flexDirection: 'row',
        gap: GRID_GAP,
        width: '100%',
    },
    div8Fixed: {
        flex: 1,
        height: ROW_HEIGHT * 2.2,
    },
    div9Fixed: {
        flex: 1,
        height: ROW_HEIGHT * 2.2,
    },
    tileContentRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
        height: '100%',
    },
    tileIconBox: {
        width: 48,
        height: 48,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    tileTextContent: {
        flex: 1,
    },
    tileTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#064e3b',
    },
    tileSub: {
        fontSize: 13,
        color: 'rgba(6, 78, 59, 0.6)',
        marginTop: 2,
    },
    fullTileContent: {
        flex: 1,
        justifyContent: 'space-between',
    },
    iconCircle: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    tileTitleLarge: {
        fontSize: 22,
        fontWeight: '900',
        color: '#064e3b',
        letterSpacing: -0.5,
    },
    tileSubText: {
        fontSize: 14,
        color: 'rgba(6, 78, 59, 0.6)',
        lineHeight: 20,
        marginTop: 4,
    },
    tileActionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 15,
    },
    tileBtnText: {
        fontSize: 14,
        fontWeight: '800',
        color: '#064e3b',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    metricTile: {
        flex: 1,
        justifyContent: 'space-between',
    },
    metricLabel: {
        fontSize: 13,
        fontWeight: '800',
        color: 'rgba(6, 78, 59, 0.5)',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    metricValueRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 4,
        marginVertical: 10,
    },
    metricValue: {
        fontSize: 36,
        fontWeight: '900',
        color: '#064e3b',
    },
    metricUnit: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'rgba(6, 78, 59, 0.5)',
    },
    metricFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    metricTrend: {
        fontSize: 14,
        color: '#4ade80',
        fontWeight: '900',
    },
    chartCard: {
        flex: 1,
    },
    chartHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
    },
    chartTitle: {
        fontSize: 16,
        fontWeight: '900',
        color: '#064e3b',
    },
    chartSub: {
        fontSize: 12,
        color: 'rgba(6, 78, 59, 0.4)',
    },
});
