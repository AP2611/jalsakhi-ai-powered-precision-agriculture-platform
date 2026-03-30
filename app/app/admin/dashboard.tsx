import { View, Text, StyleSheet, Dimensions, Pressable, Image, StatusBar } from 'react-native';
import { Theme } from '../../constants/JalSakhiTheme';
import { BentoCard } from '../../components/BentoCard';
import { PieChart } from 'react-native-chart-kit';
import { Feather, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { ScreenWrapper } from '../../components/shared/ScreenWrapper';
import { BlurView } from 'expo-blur';

const screenWidth = Dimensions.get('window').width;

export default function AdminDashboard() {
    const router = useRouter();
    const { t } = useTranslation();
    const { user } = useAuth();
    return (
        <ScreenWrapper contentContainerStyle={styles.scrollContent}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerTopRow}>
                    <View style={styles.brandingContainer}>
                        <View style={styles.logoCircle}>
                            <Image source={require('../../assets/images/logo.png')} style={styles.logo} resizeMode="contain" />
                        </View>
                        <View>
                            <Text style={styles.welcomeText}>{t('dashboard.welcomeBack')},</Text>
                            <Text style={styles.adminName}>{user?.name || 'Admin'}</Text>
                        </View>
                    </View>
                    <Pressable
                        style={({ pressed }) => [styles.notifBtn, { opacity: pressed ? 0.7 : 1 }]}
                        onPress={() => router.push('/notifications')}
                    >
                        <BlurView intensity={80} tint="light" style={styles.notifBlur}>
                            <Feather name="bell" size={24} color={Theme.colors.forest} />
                            <View style={styles.badgeDot} />
                        </BlurView>
                    </Pressable>
                </View>

                <View style={styles.villageSelector}>
                    <BlurView intensity={20} tint="light" style={styles.villageBlur}>
                        <View style={styles.villageDropdown}>
                            <MaterialIcons name="location-on" size={20} color={Theme.colors.forest} />
                            <Text style={styles.selectedVillage}>Rampur Gram Panchayat</Text>
                            <Feather name="chevron-down" size={20} color={Theme.colors.textMuted} />
                        </View>
                    </BlurView>
                    <Text style={styles.updatedTime}>Live Updates • Today 09:41 AM</Text>
                </View>
            </View>

            {/* Live Activities / Stats */}
            <View style={styles.statsRow}>
                {/* Water Status */}
                <View style={styles.statCard}>
                    <View style={[styles.iconBox, { backgroundColor: '#e0f2fe' }]}>
                        <MaterialCommunityIcons name="water-percent" size={24} color="#0ea5e9" />
                    </View>
                    <Text style={styles.statVal}>2.8M L</Text>
                    <Text style={styles.statLabel}>{t('admin.waterAvailable')}</Text>
                    <Text style={styles.statSub}>+12% vs last week</Text>
                </View>

                {/* Farmers */}
                <View style={styles.statCard}>
                    <View style={[styles.iconBox, { backgroundColor: '#dcfce7' }]}>
                        <Feather name="users" size={24} color="#16a34a" />
                    </View>
                    <Text style={styles.statVal}>284</Text>
                    <Text style={styles.statLabel}>{t('admin.activeFarmers')}</Text>
                    <Text style={styles.statSub}>24 New Requests</Text>
                </View>

                {/* Usage/Credits */}
                <View style={styles.statCard}>
                    <View style={[styles.iconBox, { backgroundColor: '#fef9c3' }]}>
                        <MaterialCommunityIcons name="hand-coin-outline" size={24} color="#ca8a04" />
                    </View>
                    <Text style={styles.statVal}>850k</Text>
                    <Text style={styles.statLabel}>{t('admin.creditsDistributed')}</Text>
                    <Text style={styles.statSub}>High Savings</Text>
                </View>
            </View>

            {/* Main Bento Grid */}
            <View style={styles.bentoGrid}>

                {/* Alerts Section */}
                <BentoCard colSpan={2} title={t('admin.criticalAlerts')}>
                    <Pressable
                        style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
                        onPress={() => router.push('/admin/anomalies')}
                    >
                        <View style={styles.alertItem}>
                            <View style={styles.alertIconBox}>
                                <View style={[styles.innerIconBox, { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]}>
                                    <Feather name="alert-triangle" size={20} color={Theme.colors.error} />
                                </View>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.alertTitle}>{t('admin.waterShortageDetected')}</Text>
                                <Text style={styles.alertDesc}>Sector 4 is at 15% capacity. Immediate allocation needed.</Text>
                            </View>
                            <View style={styles.actionBadge}>
                                <Text style={styles.actionText}>{t('admin.resolve')}</Text>
                            </View>
                        </View>
                    </Pressable>

                    <View style={styles.divider} />

                    <Pressable
                        style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
                        onPress={() => router.push('/admin/approvals')}
                    >
                        <View style={styles.alertItem}>
                            <View style={styles.alertIconBox}>
                                <View style={[styles.innerIconBox, { backgroundColor: 'rgba(245, 158, 11, 0.1)' }]}>
                                    <Feather name="user-check" size={20} color="#f59e0b" />
                                </View>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.alertTitle}>{t('admin.farmerApprovalsPending')}</Text>
                                <Text style={styles.alertDesc}>7 new farmers waiting for approval in Rampur.</Text>
                            </View>
                            <Feather name="chevron-right" size={20} color="rgba(6, 78, 59, 0.3)" />
                        </View>
                    </Pressable>
                </BentoCard>

                {/* ML Model Entry */}
                <BentoCard colSpan={2} style={{ backgroundColor: 'rgba(16, 185, 129, 0.08)', borderColor: 'rgba(16, 185, 129, 0.15)' }}>
                    <Pressable
                        style={({ pressed }) => [styles.mlCardContent, { opacity: pressed ? 0.8 : 1 }]}
                        onPress={() => router.push('/admin/water-allocation-optimization')} 
                    >
                        <View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                                <MaterialCommunityIcons name="molecule" size={26} color={Theme.colors.primary} />
                                <Text style={[styles.cardTitle, { color: Theme.colors.forest }]}>{t('admin.aiModel')}</Text>
                            </View>
                            <Text style={styles.mlDesc}>Run "Village-Level Water Allocation" to fix Sector 4 shortage.</Text>
                        </View>
                        <View style={[styles.playBtn, Theme.shadows.soft]}>
                            <Feather name="play" size={20} color="white" />
                        </View>
                    </Pressable>
                </BentoCard>

                {/* Internal AI Tools Entry */}
                <BentoCard colSpan={2} style={{ backgroundColor: 'rgba(71, 85, 105, 0.05)', borderColor: 'rgba(71, 85, 105, 0.1)' }}>
                    <Pressable
                        style={({ pressed }) => [styles.mlCardContent, { opacity: pressed ? 0.8 : 1 }]}
                        onPress={() => router.push('/admin/internal-ai' as any)}
                    >
                        <View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                                <MaterialCommunityIcons name="test-tube" size={26} color="#64748b" />
                                <Text style={[styles.cardTitle, { color: Theme.colors.forest }]}>Internal AI Tools</Text>
                            </View>
                            <Text style={styles.mlDesc}>Test experimental Model 1 & 2 endpoints with custom JSON payloads.</Text>
                        </View>
                        <View style={[styles.playBtn, { backgroundColor: '#64748b' }, Theme.shadows.soft]}>
                            <Feather name="settings" size={20} color="white" />
                        </View>
                    </Pressable>
                </BentoCard>
            </View>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Theme.colors.bg,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    header: {
        paddingTop: 10,
        paddingBottom: 24,
        marginBottom: 10,
    },
    headerTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    brandingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    logoCircle: {
        width: 72,
        height: 72,
        borderRadius: 24,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        ...Theme.shadows.soft,
    },
    logo: {
        width: 54,
        height: 54,
    },
    welcomeText: {
        fontSize: 14,
        color: 'rgba(6, 78, 59, 0.5)',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.8,
    },
    adminName: {
        color: Theme.colors.forest,
        fontWeight: '900',
        fontSize: 28,
        letterSpacing: -0.5,
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
        backgroundColor: Theme.colors.error,
        borderWidth: 2,
        borderColor: 'white',
    },
    villageSelector: {
        marginBottom: 10,
    },
    villageBlur: {
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: 'rgba(255,255,255,0.4)',
        borderWidth: 1,
        borderColor: 'rgba(6, 78, 59, 0.08)',
    },
    villageDropdown: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        padding: 12,
        paddingHorizontal: 16,
    },
    selectedVillage: {
        fontSize: 15,
        fontWeight: '800',
        color: Theme.colors.forest,
        flex: 1,
    },
    updatedTime: {
        fontSize: 11,
        color: 'rgba(6, 78, 59, 0.4)',
        fontWeight: '700',
        marginTop: 8,
        textAlign: 'right',
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
        gap: 12,
    },
    statCard: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.65)',
        borderRadius: 20,
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(6, 78, 59, 0.08)',
        ...Theme.shadows.soft,
        alignItems: 'flex-start',
    },
    iconBox: {
        width: 36,
        height: 36,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    statVal: {
        fontSize: 20,
        fontWeight: '900',
        color: Theme.colors.forest,
        marginBottom: 2,
    },
    statLabel: {
        fontSize: 11,
        color: 'rgba(6, 78, 59, 0.4)',
        fontWeight: '800',
        marginBottom: 4,
        textTransform: 'uppercase',
    },
    statSub: {
        fontSize: 10,
        color: Theme.colors.primary,
        fontWeight: '800',
    },
    bentoGrid: {
        gap: 16,
    },
    alertItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 8,
    },
    alertIconBox: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
    },
    innerIconBox: {
        width: 36,
        height: 36,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    alertTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: Theme.colors.forest,
        marginBottom: 2,
    },
    alertDesc: {
        fontSize: 13,
        color: 'rgba(6, 78, 59, 0.5)',
        fontWeight: '500',
    },
    actionBadge: {
        backgroundColor: Theme.colors.error,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
    },
    actionText: {
        color: 'white',
        fontSize: 11,
        fontWeight: '900',
        textTransform: 'uppercase',
    },
    mlCardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Theme.colors.text,
    },
    mlDesc: {
        fontSize: 12,
        color: Theme.colors.textMuted,
        maxWidth: '80%',
    },
    playBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: Theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
    },
    divider: {
        height: 1,
        backgroundColor: '#f1f5f9',
        marginVertical: 12,
    },
});
