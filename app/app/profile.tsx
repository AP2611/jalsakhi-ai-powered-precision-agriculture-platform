import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image, Switch, Alert, StatusBar, Dimensions } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Theme } from '../constants/JalSakhiTheme';
import { useAuth } from '../context/AuthContext';
import { Logger } from '../utils/Logger';
import { MaterialIcons, Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { changeLanguage } from '../i18n';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

const screenWidth = Dimensions.get('window').width;

export default function ProfileScreen() {
    const router = useRouter();
    const { t, i18n } = useTranslation();
    const { user: authUser, logout: authLogout } = useAuth();
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [darkMode, setDarkMode] = useState(false);

    const handleLogout = () => {
        Alert.alert(t('profile.logout'), t('profile.logoutConfirm'), [
            { text: t('common.cancel'), style: 'cancel' },
            {
                text: t('profile.logout'),
                style: 'destructive',
                onPress: async () => {
                    await authLogout();
                    router.replace('/');
                }
            }
        ]);
    };

    const handleLanguageChange = () => {
        Alert.alert(
            t('profile.language'),
            t('profile.selectLanguage'),
            [
                {
                    text: 'English',
                    onPress: async () => {
                        await changeLanguage('en');
                        i18n.changeLanguage('en');
                    }
                },
                {
                    text: 'हिन्दी',
                    onPress: async () => {
                        await changeLanguage('hi');
                        i18n.changeLanguage('hi');
                    }
                },
                {
                    text: 'मराठी',
                    onPress: async () => {
                        await changeLanguage('mr');
                        i18n.changeLanguage('mr');
                    }
                },
                { text: t('common.cancel'), style: 'cancel' }
            ]
        );
    };

    const currentLanguage = i18n.language.startsWith('mr') ? 'मराठी' : i18n.language.startsWith('hi') ? 'हिन्दी' : 'English';

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
        <View style={styles.safe}>
            <StatusBar barStyle="dark-content" />
            <Stack.Screen options={{ headerShown: false }} />

            {/* Decorative Layer */}
            <View style={styles.decorativeLayer} pointerEvents="none">
                <View style={[styles.designLine, { top: '25%', right: -80, transform: [{ rotate: '-30deg' }] }]} />
                <View style={[styles.designLine, { bottom: '15%', left: -40, width: 250, transform: [{ rotate: '45deg' }] }]} />
            </View>

            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                        <BlurView intensity={60} tint="light" style={styles.backBlur}>
                            <MaterialCommunityIcons name="chevron-left" size={28} color={Theme.colors.text} />
                        </BlurView>
                    </TouchableOpacity>
                    <View style={styles.headerTitles}>
                        <Text style={styles.headerTitle}>{t('profile.myProfile')}</Text>
                        <Text style={styles.headerSubtitle}>User Account & Preferences</Text>
                    </View>
                    <TouchableOpacity style={styles.editBtn}>
                        <MaterialCommunityIcons name="pencil-outline" size={22} color={Theme.colors.text} />
                    </TouchableOpacity>
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                    {/* User Hero Card */}
                    <GlassCard intensity={40} style={styles.heroCard}>
                        <View style={styles.heroTop}>
                            <View style={styles.avatarWrapper}>
                                <Image
                                    source={require('../assets/images/logo.png')}
                                    style={styles.avatar}
                                />
                                <LinearGradient colors={['#10b981', '#059669']} style={styles.roleBadge}>
                                    <Text style={styles.roleText}>{authUser?.role?.toUpperCase() || 'USER'}</Text>
                                </LinearGradient>
                            </View>
                            <View style={styles.heroInfo}>
                                <Text style={styles.userName}>{authUser?.name || 'User'}</Text>
                                <Text style={styles.userLocation}>{authUser?.village && authUser?.district ? `${authUser.village}, ${authUser.district}` : (authUser?.village || authUser?.district || 'Green Valley')}</Text>
                            </View>
                        </View>

                        <View style={styles.statsRow}>
                            <View style={styles.statItem}>
                                <Feather name="phone" size={14} color={Theme.colors.primary} />
                                <Text style={styles.statText}>+91 {authUser?.mobile || 'N/A'}</Text>
                            </View>
                            <View style={styles.statDivider} />
                            <View style={styles.statItem}>
                                <MaterialIcons name="fingerprint" size={15} color={Theme.colors.primary} />
                                <Text style={styles.statText}>{authUser?.aadhar ? `**** ${authUser.aadhar.slice(-4)}` : 'N/A'}</Text>
                            </View>
                        </View>
                    </GlassCard>

                    {/* App Settings Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionHeader}>{t('profile.appSettings')}</Text>

                        <GlassCard style={styles.settingsGroup}>
                            <View style={styles.settingItem}>
                                <View style={[styles.settingIconBox, { backgroundColor: 'rgba(59, 130, 246, 0.1)' }]}>
                                    <MaterialCommunityIcons name="bell-outline" size={20} color="#3b82f6" />
                                </View>
                                <Text style={styles.settingLabel}>{t('profile.notifications')}</Text>
                                <Switch
                                    value={notificationsEnabled}
                                    onValueChange={setNotificationsEnabled}
                                    trackColor={{ false: '#e2e8f0', true: '#10b981' }}
                                    thumbColor="white"
                                />
                            </View>

                            <View style={styles.settingDivider} />

                            <View style={styles.settingItem}>
                                <View style={[styles.settingIconBox, { backgroundColor: 'rgba(168, 85, 247, 0.1)' }]}>
                                    <MaterialCommunityIcons name="moon-waning-crescent" size={20} color="#a855f7" />
                                </View>
                                <Text style={styles.settingLabel}>{t('profile.darkMode')}</Text>
                                <Switch
                                    value={darkMode}
                                    onValueChange={setDarkMode}
                                    trackColor={{ false: '#e2e8f0', true: '#10b981' }}
                                    thumbColor="white"
                                />
                            </View>

                            <View style={styles.settingDivider} />

                            <TouchableOpacity style={styles.settingItem} onPress={handleLanguageChange}>
                                <View style={[styles.settingIconBox, { backgroundColor: 'rgba(245, 158, 11, 0.1)' }]}>
                                    <MaterialCommunityIcons name="earth" size={20} color="#f59e0b" />
                                </View>
                                <Text style={[styles.settingLabel, { flex: 1 }]}>{t('profile.language')}</Text>
                                <View style={styles.settingRight}>
                                    <Text style={styles.settingValue}>{currentLanguage}</Text>
                                    <MaterialCommunityIcons name="chevron-right" size={22} color={Theme.colors.textMuted} />
                                </View>
                            </TouchableOpacity>
                        </GlassCard>
                    </View>

                    {/* Support Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionHeader}>{t('profile.support')}</Text>

                        <GlassCard style={styles.settingsGroup}>
                            <TouchableOpacity style={styles.settingItem}>
                                <View style={[styles.settingIconBox, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}>
                                    <MaterialCommunityIcons name="help-circle-outline" size={20} color="#10b981" />
                                </View>
                                <Text style={[styles.settingLabel, { flex: 1 }]}>{t('profile.helpFaq')}</Text>
                                <MaterialCommunityIcons name="chevron-right" size={22} color={Theme.colors.textMuted} />
                            </TouchableOpacity>

                            <View style={styles.settingDivider} />

                            <TouchableOpacity style={styles.settingItem}>
                                <View style={[styles.settingIconBox, { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]}>
                                    <MaterialCommunityIcons name="alert-circle-outline" size={20} color="#ef4444" />
                                </View>
                                <Text style={[styles.settingLabel, { flex: 1 }]}>{t('profile.reportIssue')}</Text>
                                <MaterialCommunityIcons name="chevron-right" size={22} color={Theme.colors.textMuted} />
                            </TouchableOpacity>
                        </GlassCard>
                    </View>

                    <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                        <LinearGradient colors={['#fee2e2', '#fecaca']} style={styles.logoutGradient}>
                            <MaterialCommunityIcons name="logout" size={20} color="#dc2626" />
                            <Text style={styles.logoutText}>{t('profile.logout')}</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    <Text style={styles.versionText}>{t('profile.version')} 1.0.0 • JalSakhi Premium</Text>

                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#F8FAFC' },
    decorativeLayer: {
        ...StyleSheet.absoluteFillObject,
        overflow: 'hidden',
    },
    designLine: {
        position: 'absolute',
        width: 350,
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
    backBlur: {
        width: 44, height: 44, borderRadius: 14,
        justifyContent: 'center', alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.85)',
        borderWidth: 1.2, borderColor: '#E2E8F0',
    },
    headerTitles: { flex: 1 },
    headerTitle: { fontSize: 24, fontWeight: '900', color: Theme.colors.text, letterSpacing: -0.5 },
    headerSubtitle: { fontSize: 13, color: Theme.colors.textMuted },
    editBtn: { padding: 10 },
    scrollContent: { padding: 20, paddingBottom: 40 },
    glassCard: {
        borderRadius: 24,
        overflow: 'hidden',
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderColor: '#E2E8F0',
    },
    cardBlur: { padding: 20, backgroundColor: 'rgba(255,255,255,0.35)' },
    cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 },
    cardIconBox: { width: 30, height: 30, borderRadius: 10, backgroundColor: 'rgba(16, 185, 129, 0.08)', justifyContent: 'center', alignItems: 'center' },
    cardTitle: { fontSize: 13, fontWeight: '800', color: Theme.colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.6 },
    heroCard: { marginBottom: 24 },
    heroTop: { flexDirection: 'row', alignItems: 'center', gap: 20, marginBottom: 20 },
    avatarWrapper: { position: 'relative' },
    avatar: { width: 80, height: 80, borderRadius: 30, borderWidth: 3, borderColor: 'white' },
    roleBadge: { position: 'absolute', bottom: -4, right: -4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10, borderWidth: 2, borderColor: 'white' },
    roleText: { color: 'white', fontSize: 10, fontWeight: '900' },
    heroInfo: { flex: 1 },
    userName: { fontSize: 22, fontWeight: '900', color: Theme.colors.text, letterSpacing: -0.5 },
    userLocation: { fontSize: 14, color: Theme.colors.textMuted, fontWeight: '600', marginTop: 2 },
    statsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: 16, padding: 12 },
    statItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    statText: { fontSize: 13, fontWeight: '700', color: Theme.colors.text },
    statDivider: { width: 1, height: 16, backgroundColor: '#E2E8F0' },
    section: { marginBottom: 24 },
    sectionHeader: { fontSize: 16, fontWeight: '800', color: Theme.colors.text, marginBottom: 12, marginLeft: 4 },
    settingsGroup: { padding: 0 },
    settingItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16, gap: 14 },
    settingIconBox: { width: 38, height: 38, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
    settingLabel: { fontSize: 15, fontWeight: '700', color: Theme.colors.text },
    settingDivider: { height: 1, backgroundColor: '#E2E8F0', marginHorizontal: 16 },
    settingRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    settingValue: { fontSize: 14, fontWeight: '700', color: Theme.colors.textMuted },
    logoutBtn: { borderRadius: 20, overflow: 'hidden', marginTop: 10 },
    logoutGradient: { paddingVertical: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10 },
    logoutText: { color: '#dc2626', fontWeight: '900', fontSize: 16 },
    versionText: { textAlign: 'center', color: Theme.colors.textMuted, fontSize: 12, marginTop: 24, fontWeight: '600' },
    backBtn: {},
});
