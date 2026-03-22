import React from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, TouchableOpacity, StatusBar, Dimensions } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Theme } from '../../constants/JalSakhiTheme';
import { Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

const screenWidth = Dimensions.get('window').width;

export default function IrrigationDetailsScreen() {
    const router = useRouter();

    const GlassCard = ({ title, icon, children, style, intensity = 20 }: any) => (
        <View style={[styles.glassCard, style]}>
            <BlurView intensity={intensity} tint="light" style={styles.cardBlur}>
                {title && (
                    <View style={styles.cardHeader}>
                        <View style={styles.cardIconBox}>
                            <MaterialCommunityIcons name={icon} size={18} color={Theme.colors.primary} />
                        </View>
                        <Text style={styles.cardTitle}>{title}</Text>
                    </View>
                )}
                {children}
            </BlurView>
        </View>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <Stack.Screen options={{ headerShown: false }} />

            {/* Decorative Layer */}
            <View style={styles.decorativeLayer} pointerEvents="none">
                <View style={[styles.designLine, { top: '10%', right: -40, transform: [{ rotate: '-45deg' }] }]} />
                <View style={[styles.designLine, { bottom: '30%', left: -60, width: 250, transform: [{ rotate: '30deg' }] }]} />
            </View>

            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                        <BlurView intensity={60} tint="light" style={styles.backBlur}>
                            <Feather name="chevron-left" size={24} color={Theme.colors.text} />
                        </BlurView>
                    </TouchableOpacity>
                    <View style={styles.headerTextContainer}>
                        <Text style={styles.title}>Irrigation Details</Text>
                        <Text style={styles.subtitle}>Specific recommendations for today</Text>
                    </View>
                </View>

                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.bentoGrid}>
                        {/* Main Recommendation */}
                        <TouchableOpacity activeOpacity={0.9} style={styles.fullWidth}>
                            <LinearGradient
                                colors={['#10b981', '#059669']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.mainRecGradient}
                            >
                                <View style={styles.mainRecHeader}>
                                    <View style={styles.recIconCircle}>
                                        <MaterialCommunityIcons name="water" size={30} color="white" />
                                    </View>
                                    <View>
                                        <Text style={styles.mainRecLabel}>Today's Recommendation</Text>
                                        <Text style={styles.mainRecTitle}>Field Watering: 45 Mins</Text>
                                    </View>
                                </View>

                                <View style={styles.mainRecStats}>
                                    <View style={styles.mainRecStat}>
                                        <Text style={styles.mainStatLabel}>Optimal Time</Text>
                                        <Text style={styles.mainStatValue}>6:00 AM</Text>
                                    </View>
                                    <View style={styles.recStatDivider} />
                                    <View style={styles.mainRecStat}>
                                        <Text style={styles.mainStatLabel}>Est. Water</Text>
                                        <Text style={styles.mainStatValue}>1,200 L</Text>
                                    </View>
                                </View>
                            </LinearGradient>
                        </TouchableOpacity>

                        {/* Upcoming Schedule */}
                        <GlassCard title="Upcoming Schedule" icon="calendar-clock" style={styles.fullWidth} intensity={40}>
                            {[
                                { day: 'Wednesday', time: '6:30 AM', duration: '30 mins', icon: 'weather-sunny' },
                                { day: 'Friday', time: '6:00 AM', duration: '45 mins', icon: 'weather-partly-cloudy' },
                            ].map((item, index) => (
                                <View key={index} style={[styles.scheduleItem, index === 0 && { borderTopWidth: 0, paddingTop: 0 }]}>
                                    <View style={styles.scheduleLeft}>
                                        <View style={styles.dayIconBox}>
                                            <MaterialCommunityIcons name={item.icon as any} size={20} color={Theme.colors.primary} />
                                        </View>
                                        <View>
                                            <Text style={styles.itemDay}>{item.day}</Text>
                                            <View style={styles.timeRow}>
                                                <Feather name="clock" size={12} color={Theme.colors.textMuted} />
                                                <Text style={styles.itemTime}>{item.time}</Text>
                                            </View>
                                        </View>
                                    </View>
                                    <View style={styles.durationBadge}>
                                        <Text style={styles.durationText}>{item.duration}</Text>
                                    </View>
                                </View>
                            ))}
                        </GlassCard>

                        {/* Advice Card */}
                        <GlassCard intensity={30} style={styles.fullWidth}>
                            <View style={styles.adviceRow}>
                                <Ionicons name="bulb-outline" size={24} color="#f59e0b" />
                                <Text style={styles.adviceText}>
                                    Pro Tip: Check soil moisture manually once a week to verify AI sensors.
                                </Text>
                            </View>
                        </GlassCard>
                    </View>

                    <TouchableOpacity
                        style={styles.logBtn}
                        onPress={() => router.push('/farmer/log-irrigation')}
                    >
                        <LinearGradient colors={['#3b82f6', '#2563eb']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.gradientBtn}>
                            <MaterialCommunityIcons name="pencil-box-multiple-outline" size={20} color="white" />
                            <Text style={styles.logBtnText}>Log Manual Usage</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC' },
    decorativeLayer: { ...StyleSheet.absoluteFillObject, overflow: 'hidden' },
    designLine: { position: 'absolute', width: 300, height: 1, backgroundColor: 'rgba(16, 185, 129, 0.1)' },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 20, gap: 16 },
    backBlur: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.8)', borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)' },
    headerTextContainer: { flex: 1 },
    title: { fontSize: 24, fontWeight: '900', color: Theme.colors.text, letterSpacing: -0.5 },
    subtitle: { fontSize: 13, color: Theme.colors.textMuted },
    scrollView: { flex: 1 },
    scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
    bentoGrid: { gap: 16 },
    fullWidth: { width: '100%' },
    glassCard: { borderRadius: 24, overflow: 'hidden', backgroundColor: 'transparent', borderWidth: 1.5, borderColor: '#E2E8F0' },
    cardBlur: { padding: 24, backgroundColor: 'rgba(255,255,255,0.4)' },
    cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20 },
    cardIconBox: { width: 28, height: 28, borderRadius: 8, backgroundColor: 'rgba(16, 185, 129, 0.08)', justifyContent: 'center', alignItems: 'center' },
    cardTitle: { fontSize: 13, fontWeight: '800', color: Theme.colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.5 },
    mainRecGradient: { borderRadius: 28, padding: 24, borderWidth: 1, borderColor: 'rgba(16, 185, 129, 0.2)' },
    mainRecHeader: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 24 },
    recIconCircle: { width: 56, height: 56, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
    mainRecLabel: { fontSize: 13, color: 'rgba(255,255,255,0.8)', fontWeight: '700' },
    mainRecTitle: { fontSize: 24, fontWeight: '900', color: 'white', marginTop: 2, letterSpacing: -0.5 },
    mainRecStats: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 16, padding: 16 },
    mainRecStat: { flex: 1, alignItems: 'center' },
    mainStatLabel: { fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: '600', marginBottom: 4 },
    mainStatValue: { fontSize: 18, fontWeight: '800', color: 'white' },
    recStatDivider: { width: 1, height: 30, backgroundColor: 'rgba(255,255,255,0.2)' },
    scheduleItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.05)', paddingTop: 16, marginTop: 16 },
    scheduleLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    dayIconBox: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#f8fafc', justifyContent: 'center', alignItems: 'center' },
    itemDay: { fontSize: 16, fontWeight: '800', color: Theme.colors.text },
    timeRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
    itemTime: { fontSize: 12, color: Theme.colors.textMuted, fontWeight: '600' },
    durationBadge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, backgroundColor: 'rgba(16, 185, 129, 0.08)' },
    durationText: { fontSize: 12, fontWeight: '900', color: Theme.colors.primary },
    adviceRow: { flexDirection: 'row', gap: 16, alignItems: 'center' },
    adviceText: { flex: 1, fontSize: 14, color: Theme.colors.text, fontWeight: '600', lineHeight: 20 },
    logBtn: { marginTop: 24, borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(59, 130, 246, 0.1)' },
    gradientBtn: { height: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12 },
    logBtnText: { color: 'white', fontSize: 18, fontWeight: '800', letterSpacing: 0.5 },
    backBtn: {},
});
