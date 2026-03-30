import { View, Text, StyleSheet, Dimensions, StatusBar, Pressable } from 'react-native';
import { Theme } from '../../constants/JalSakhiTheme';
import { WeatherWidget } from '../../components/WeatherWidget';
import { LineChart } from 'react-native-chart-kit';
import { Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { BlurView } from 'expo-blur';
import { ScreenWrapper } from '../../components/shared/ScreenWrapper';

const screenWidth = Dimensions.get('window').width;
const GRID_GAP = 14;
const COLUMN_WIDTH = (screenWidth - 40 - GRID_GAP) / 2;
const ROW_HEIGHT = 90;

export default function FarmerDashboard() {
    const router = useRouter();
    const { t } = useTranslation();
    const { user } = useAuth();

    const GlassTile = ({ children, style, onPress, intensity = 50 }: any) => (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                styles.gridItem,
                style,
                { opacity: pressed && onPress ? 0.92 : 1, transform: [{ scale: pressed && onPress ? 0.98 : 1 }] }
            ]}
            disabled={!onPress}
        >
            <BlurView intensity={intensity} tint="light" style={styles.glassBackground}>
                {children}
            </BlurView>
        </Pressable>
    );

    return (
        <ScreenWrapper contentContainerStyle={styles.gridContainer}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.welcomeText}>WELCOME BACK,</Text>
                    <Text style={styles.boldHeader}>{user?.name || 'Arya Sinha'}</Text>
                </View>
                
                <Pressable
                    style={({ pressed }) => [styles.farmAiHeader, { opacity: pressed ? 0.7 : 1 }]}
                    onPress={() => router.push('/farmer/chatbot')}
                >
                    <View style={styles.squareIconBackground}>
                        <MaterialCommunityIcons name="robot-outline" size={28} color="#10b981" />
                    </View>
                </Pressable>
            </View>


            {/* Top Metrics Area: Temperature & Water Spend */}
            <View style={styles.sideBySideRow}>
                <GlassTile style={styles.div8Fixed} intensity={70}>
                    <WeatherWidget compact={true} light={true} />
                </GlassTile>

                <GlassTile style={styles.div9Fixed} intensity={60}>
                    <View style={styles.metricTile}>
                        <Text style={styles.metricLabel}>Water Spend</Text>
                        <View style={styles.metricValueRow}>
                            <Text style={styles.metricValue}>1,250</Text>
                            <Text style={styles.metricUnit}>L</Text>
                        </View>
                        <View style={styles.metricFooter}>
                            <Feather name="trending-down" size={14} color="#10b981" />
                            <Text style={styles.metricTrend}>-12.4%</Text>
                        </View>
                    </View>
                </GlassTile>
            </View>

            {/* Crop Prediction AI */}
            <GlassTile
                style={styles.compactFeatureTile}
                onPress={() => router.push('/farmer/crop-water-input')}
                intensity={60}
            >
                <View style={styles.tileContentRow}>
                    <View style={[styles.tileIconBox, { backgroundColor: 'rgba(59, 130, 246, 0.12)' }]}>
                        <MaterialCommunityIcons name="water-pump" size={28} color="#3b82f6" />
                    </View>
                    <View style={styles.tileTextContent}>
                        <Text style={styles.tileTitle}>{t('dashboard.cropPrediction')}</Text>
                        <Text style={styles.tileSub} numberOfLines={1}>Advanced AI water analysis</Text>
                    </View>
                    <Feather name="chevron-right" size={20} color="rgba(6, 78, 59, 0.3)" />
                </View>
            </GlassTile>

            {/* Soil Forecast */}
            <GlassTile
                style={styles.compactFeatureTile}
                onPress={() => router.push('/farmer/soil-moisture-forecast')}
                intensity={60}
            >
                <View style={styles.tileContentRow}>
                    <View style={[styles.tileIconBox, { backgroundColor: 'rgba(245, 158, 11, 0.12)' }]}>
                        <MaterialCommunityIcons name="chart-bell-curve-cumulative" size={28} color="#f59e0b" />
                    </View>
                    <View style={styles.tileTextContent}>
                        <Text style={styles.tileTitle}>{t('dashboard.moistureForecast')}</Text>
                        <Text style={styles.tileSub} numberOfLines={1}>7-day soil moisture model</Text>
                    </View>
                    <Feather name="chevron-right" size={20} color="rgba(6, 78, 59, 0.3)" />
                </View>
            </GlassTile>

            {/* Water Allocation */}
            <GlassTile
                style={styles.div6}
                onPress={() => router.push('/farmer/water-allocation-view')}
                intensity={70}
            >
                <View style={styles.tileContentRow}>
                    <LinearGradient colors={['#8b5cf6', '#6d28d9']} style={[styles.tileIconBox, Theme.shadows.soft]}>
                        <MaterialCommunityIcons name="calendar-clock-outline" size={24} color="white" />
                    </LinearGradient>
                    <View style={styles.tileTextContent}>
                        <Text style={styles.tileTitle}>{t('dashboard.waterAllocation')}</Text>
                        <Text style={styles.tileSub}>Optimized distribution schedule</Text>
                    </View>
                    <Feather name="chevron-right" size={22} color="rgba(6, 78, 59, 0.4)" />
                </View>
            </GlassTile>

            {/* Weekly Usage Chart */}
            <GlassTile style={styles.div10} intensity={40}>
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
                        width={screenWidth - 88}
                        height={160}
                        chartConfig={{
                            backgroundColor: "transparent",
                            backgroundGradientFrom: "rgba(255,255,255,0)",
                            backgroundGradientTo: "rgba(255,255,255,0)",
                            decimalPlaces: 0,
                            color: (opacity = 1) => `rgba(6, 78, 59, ${opacity})`,
                            labelColor: (opacity = 1) => `rgba(6, 78, 59, ${opacity * 0.7})`,
                            style: { borderRadius: 16 },
                            propsForDots: { r: "4", strokeWidth: "2", stroke: "#10b981" },
                            propsForBackgroundLines: { strokeDasharray: "", stroke: "rgba(6, 78, 59, 0.08)" }
                        }}
                        bezier
                        withDots={true}
                        withInnerLines={true}
                        withOuterLines={false}
                        style={{ marginTop: 15, marginLeft: -20 }}
                    />
                </View>
            </GlassTile>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 4, // More left
        paddingRight: 4, 
        paddingTop: 10,
        paddingBottom: 20,
    },
    welcomeText: {
        fontSize: 15,
        color: 'rgba(6, 78, 59, 0.6)',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    boldHeader: {
        fontSize: 26,
        fontWeight: '900',
        color: Theme.colors.forest,
        letterSpacing: -0.5,
    },
    farmAiHeader: {
        padding: 4, // Smaller padding around the icon
    },
    squareIconBackground: {
        width: 44,
        height: 44,
        borderRadius: 12, // Slight rounding but still feels "square"
        backgroundColor: 'rgba(16, 185, 129, 0.12)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(16, 185, 129, 0.1)',
        ...Theme.shadows.soft,
    },
    notifBtn: {
        overflow: 'hidden',
        borderRadius: 18,
        ...Theme.shadows.soft,
    },
    notifBlur: {
        width: 52,
        height: 52,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.8)',
    },
    badgeDot: {
        position: 'absolute',
        top: 15,
        right: 15,
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#ef4444',
        borderWidth: 2,
        borderColor: 'white',
    },
    gridContainer: {
        paddingHorizontal: 12, // Reduced from 24 to allow more left alignment
        paddingBottom: 110,
        gap: GRID_GAP,
    },
    gridItem: {
        borderRadius: 24,
        overflow: 'hidden',
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        borderWidth: 1,
        borderColor: 'rgba(6, 78, 59, 0.08)',
        ...Theme.shadows.soft,
    },
    glassBackground: {
        flex: 1,
        padding: 24,
    },
    div6: { height: 100 },
    div10: { height: ROW_HEIGHT * 3.2 },
    compactFeatureTile: { height: 100 },
    sideBySideRow: {
        flexDirection: 'row',
        gap: GRID_GAP,
        width: '100%',
    },
    div8Fixed: {
        flex: 1.1,
        height: 150, // Reduced from ROW_HEIGHT * 2.3
    },
    div9Fixed: {
        flex: 0.9,
        height: 150, // Reduced from ROW_HEIGHT * 2.3
    },
    tileContentRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        height: '100%',
    },
    tileIconBox: {
        width: 52,
        height: 52,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tileTextContent: {
        flex: 1,
    },
    tileTitle: {
        fontSize: 19,
        fontWeight: '800',
        color: Theme.colors.forest,
        letterSpacing: -0.3,
    },
    tileSub: {
        fontSize: 13,
        color: 'rgba(6, 78, 59, 0.5)',
        marginTop: 2,
        fontWeight: '500',
    },
    fullTileContent: {
        flex: 1,
        justifyContent: 'space-between',
    },
    iconCircle: {
        width: 68,
        height: 68,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    tileTitleLarge: {
        fontSize: 24,
        fontWeight: '900',
        color: Theme.colors.forest,
        letterSpacing: -0.8,
    },
    tileSubText: {
        fontSize: 15,
        color: 'rgba(6, 78, 59, 0.5)',
        lineHeight: 21,
        marginTop: 6,
        fontWeight: '500',
    },
    tileActionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 15,
    },
    tileBtnText: {
        fontSize: 13,
        fontWeight: '900',
        color: Theme.colors.forest,
        textTransform: 'uppercase',
        letterSpacing: 1.2,
    },
    metricTile: {
        flex: 1,
        justifyContent: 'space-between',
    },
    metricLabel: {
        fontSize: 12,
        fontWeight: '900',
        color: 'rgba(6, 78, 59, 0.4)',
        textTransform: 'uppercase',
        letterSpacing: 1.2,
    },
    metricValueRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 4,
        marginVertical: 6,
    },
    metricValue: {
        fontSize: 38,
        fontWeight: '900',
        color: Theme.colors.forest,
        letterSpacing: -1,
    },
    metricUnit: {
        fontSize: 18,
        fontWeight: '700',
        color: 'rgba(6, 78, 59, 0.4)',
    },
    metricFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    metricTrend: {
        fontSize: 14,
        color: '#10b981',
        fontWeight: '800',
    },
    chartCard: {
        flex: 1,
    },
    chartHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: 5,
    },
    chartTitle: {
        fontSize: 18,
        fontWeight: '900',
        color: Theme.colors.forest,
    },
    chartSub: {
        fontSize: 13,
        color: 'rgba(6, 78, 59, 0.4)',
        fontWeight: '600',
    },
});
