import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, StatusBar, Animated, Dimensions, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Theme } from '../constants/JalSakhiTheme';
import { Feather, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from '../components/LanguageSelector';

const { width, height } = Dimensions.get('window');

export default function Index() {
    const router = useRouter();
    const { t } = useTranslation();
    const [splashLoading, setSplashLoading] = useState(true);
    const [selectedRole, setSelectedRole] = useState<'FARMER' | 'ADMIN' | null>(null);

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
            Animated.timing(slideAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
        ]).start();

        const timer = setTimeout(() => setSplashLoading(false), 2500);
        return () => clearTimeout(timer);
    }, []);

    const handleContinue = () => {
        if (!selectedRole) return;
        if (selectedRole === 'FARMER') {
            router.push('/(auth)/farmer-signup');
        } else {
            router.push('/(auth)/admin-signup');
        }
    };

    if (splashLoading) {
        return (
            <View style={styles.splashContainer}>
                <StatusBar barStyle="light-content" backgroundColor="#052e16" />
                <LinearGradient colors={['#052e16', '#14532d', '#166534']} style={styles.splashGradient}>
                    <View style={styles.splashBlobTop} />
                    <View style={styles.splashBlobBottom} />
                    <Animated.View style={[styles.splashContent, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
                        <View style={styles.splashLogoWrap}>
                            <Image source={require('../assets/images/logo.png')} style={styles.splashLogo} resizeMode="contain" />
                        </View>
                        <Text style={styles.splashTitle}>{t('common.appName')}</Text>
                        <Text style={styles.splashTagline}>{t('splash.tagline')}</Text>
                        <View style={styles.splashBar}><View style={styles.splashBarFill} /></View>
                    </Animated.View>
                </LinearGradient>
            </View>
        );
    }

    return (
        <ImageBackground
            source={require('../assets/images/background.jpeg')}
            style={styles.container}
            imageStyle={{ opacity: 0.12 }}
        >
            <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
            <SafeAreaView style={styles.safeArea}>
                {/* Top section — branding */}
                <View style={styles.topSection}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                        <Image source={require('../assets/images/logo.png')} style={styles.logo} resizeMode="contain" />
                        <LanguageSelector />
                    </View>
                    <Text style={styles.appName}>{t('common.appName')}</Text>
                    <Text style={styles.tagline}>{t('common.tagline')}</Text>
                </View>

                {/* Role selection */}
                <View style={styles.roleSection}>
                    <Text style={styles.roleLabel}>{t('role.iAmA')}</Text>

                    <View style={styles.roleRow}>
                        {/* Farmer Card */}
                        <TouchableOpacity
                            style={[styles.roleCard, selectedRole === 'FARMER' && styles.roleCardSelected]}
                            onPress={() => setSelectedRole('FARMER')}
                            activeOpacity={0.85}
                        >
                            <View style={[styles.roleIconWrap, selectedRole === 'FARMER' && styles.roleIconSelected]}>
                                <MaterialCommunityIcons
                                    name="sprout"
                                    size={32}
                                    color={selectedRole === 'FARMER' ? '#fff' : Theme.colors.primary}
                                />
                            </View>
                            <Text style={[styles.roleTitle, selectedRole === 'FARMER' && styles.roleTitleSelected]}>
                                {t('role.farmer')}
                            </Text>
                            <Text style={styles.roleDesc}>{t('role.farmerDesc')}</Text>
                            {selectedRole === 'FARMER' && (
                                <View style={styles.checkBadge}>
                                    <Feather name="check" size={14} color="#fff" />
                                </View>
                            )}
                        </TouchableOpacity>

                        {/* Admin Card */}
                        <TouchableOpacity
                            style={[styles.roleCard, selectedRole === 'ADMIN' && styles.roleCardSelected]}
                            onPress={() => setSelectedRole('ADMIN')}
                            activeOpacity={0.85}
                        >
                            <View style={[styles.roleIconWrap, selectedRole === 'ADMIN' && styles.roleIconSelected]}>
                                <MaterialIcons
                                    name="admin-panel-settings"
                                    size={32}
                                    color={selectedRole === 'ADMIN' ? '#fff' : Theme.colors.primary}
                                />
                            </View>
                            <Text style={[styles.roleTitle, selectedRole === 'ADMIN' && styles.roleTitleSelected]}>
                                {t('role.admin')}
                            </Text>
                            <Text style={styles.roleDesc}>{t('role.adminDesc')}</Text>
                            {selectedRole === 'ADMIN' && (
                                <View style={styles.checkBadge}>
                                    <Feather name="check" size={14} color="#fff" />
                                </View>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Bottom actions */}
                <View style={styles.bottomSection}>
                    <TouchableOpacity
                        style={[styles.primaryBtn, !selectedRole && styles.primaryBtnDisabled]}
                        onPress={handleContinue}
                        disabled={!selectedRole}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.primaryBtnText}>{t('role.getStarted')}</Text>
                        <Feather name="arrow-right" size={20} color="#fff" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.secondaryBtn}
                        onPress={() => router.push({ pathname: '/(auth)/login', params: { role: selectedRole || 'FARMER' } })}
                    >
                        <Text style={styles.secondaryBtnText}>{t('role.alreadyHaveAccount')} <Text style={{ fontWeight: '800' }}>{t('role.signIn')}</Text></Text>
                    </TouchableOpacity>

                    <Text style={styles.footerText}>{t('common.footer')}</Text>
                </View>
            </SafeAreaView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    // Splash
    splashContainer: { flex: 1 },
    splashGradient: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    splashContent: { alignItems: 'center' },
    splashLogoWrap: {
        width: 160, height: 160, borderRadius: 80,
        backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center',
        marginBottom: 24,
        shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.15, shadowRadius: 20, elevation: 10,
    },
    splashLogo: { width: 110, height: 110 },
    splashTitle: { fontSize: 40, fontWeight: '900', color: '#fff', letterSpacing: -1 },
    splashTagline: { fontSize: 15, color: 'rgba(255,255,255,0.6)', marginTop: 8 },
    splashBar: { width: 100, height: 3, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 2, marginTop: 40 },
    splashBarFill: { width: '50%', height: '100%', backgroundColor: '#fff', borderRadius: 2 },
    splashBlobTop: { position: 'absolute', width: 280, height: 280, borderRadius: 140, backgroundColor: 'rgba(255,255,255,0.06)', top: -60, right: -80 },
    splashBlobBottom: { position: 'absolute', width: 180, height: 180, borderRadius: 90, backgroundColor: 'rgba(255,255,255,0.04)', bottom: 60, left: -40 },

    // Main screen
    container: { flex: 1, backgroundColor: '#fff', overflow: 'hidden' as const },
    safeArea: { flex: 1 },

    // Top branding
    topSection: {
        alignItems: 'center',
        paddingTop: 40,
        paddingBottom: 20,
    },
    logo: { width: 80, height: 80, marginBottom: 12 },
    appName: {
        fontSize: 30, fontWeight: '900', color: Theme.colors.text,
        letterSpacing: -1,
    },
    tagline: {
        fontSize: 14, color: Theme.colors.textMuted, marginTop: 4,
        textAlign: 'center', paddingHorizontal: 40,
    },

    // Role section
    roleSection: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    roleLabel: {
        fontSize: 16, fontWeight: '700', color: Theme.colors.textMuted,
        textAlign: 'center', marginBottom: 20,
        textTransform: 'uppercase', letterSpacing: 2,
    },
    roleRow: {
        flexDirection: 'row',
        gap: 16,
    },
    roleCard: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 28,
        paddingHorizontal: 12,
        borderRadius: Theme.roundness.lg,
        backgroundColor: 'rgba(255,255,255,0.7)',
        borderWidth: 2,
        borderColor: 'rgba(5, 150, 105, 0.08)',
        position: 'relative',
    },
    roleCardSelected: {
        backgroundColor: 'rgba(5, 150, 105, 0.06)',
        borderColor: Theme.colors.primary,
        ...Theme.shadows.soft,
    },
    roleIconWrap: {
        width: 64, height: 64, borderRadius: 20,
        backgroundColor: 'rgba(5, 150, 105, 0.08)',
        alignItems: 'center', justifyContent: 'center',
        marginBottom: 14,
    },
    roleIconSelected: {
        backgroundColor: Theme.colors.primary,
    },
    roleTitle: {
        fontSize: 18, fontWeight: '800', color: Theme.colors.text,
        marginBottom: 4,
    },
    roleTitleSelected: {
        color: Theme.colors.primary,
    },
    roleDesc: {
        fontSize: 12, color: Theme.colors.textMuted, textAlign: 'center',
    },
    checkBadge: {
        position: 'absolute', top: 10, right: 10,
        width: 24, height: 24, borderRadius: 12,
        backgroundColor: Theme.colors.primary,
        alignItems: 'center', justifyContent: 'center',
    },

    // Bottom actions
    bottomSection: {
        paddingHorizontal: 24,
        paddingBottom: 16,
        gap: 14,
    },
    primaryBtn: {
        height: 56, borderRadius: Theme.roundness.md,
        backgroundColor: Theme.colors.primary,
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        gap: 10,
        ...Theme.shadows.medium,
    },
    primaryBtnDisabled: {
        backgroundColor: 'rgba(5, 150, 105, 0.3)',
    },
    primaryBtnText: {
        fontSize: 17, fontWeight: '800', color: '#fff',
    },
    secondaryBtn: {
        height: 48, alignItems: 'center', justifyContent: 'center',
    },
    secondaryBtnText: {
        fontSize: 14, color: Theme.colors.textMuted,
    },
    footerText: {
        fontSize: 12, color: Theme.colors.textMuted,
        textAlign: 'center', fontStyle: 'italic',
    },
});
