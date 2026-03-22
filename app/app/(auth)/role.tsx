import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { Theme } from '../../constants/JalSakhiTheme';
import { MaterialCommunityIcons, MaterialIcons, Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

export default function WelcomeScreen() {
    const router = useRouter();
    const { t } = useTranslation();

    const handleRoleSelect = (role: 'farmer' | 'admin') => {
        if (role === 'farmer') {
            router.push('/(auth)/farmer-signup');
        } else {
            router.push('/(auth)/admin-signup');
        }
    };

    return (
        <ImageBackground
            source={require('../../assets/images/background.jpeg')}
            style={styles.bg}
            imageStyle={{ opacity: 0.12 }}
        >
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.content}>
                    {/* Heading */}
                    <View style={styles.top}>
                        <Text style={styles.heading}>{t('role.chooseRole')}</Text>
                        <Text style={styles.heading2}></Text>
                        <Text style={styles.sub}>{t('role.selectHow')}</Text>
                    </View>

                    {/* Role Cards */}
                    <View style={styles.cards}>
                        <TouchableOpacity
                            style={styles.card}
                            activeOpacity={0.85}
                            onPress={() => handleRoleSelect('farmer')}
                        >
                            <View style={[styles.iconWrap, { backgroundColor: 'rgba(5,150,105,0.08)' }]}>
                                <MaterialCommunityIcons name="sprout" size={36} color={Theme.colors.primary} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.cardTitle}>{t('role.iAmFarmer')}</Text>
                                <Text style={styles.cardDesc}>{t('role.farmerMonitor')}</Text>
                            </View>
                            <Feather name="arrow-right" size={20} color={Theme.colors.primary} />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.card}
                            activeOpacity={0.85}
                            onPress={() => handleRoleSelect('admin')}
                        >
                            <View style={[styles.iconWrap, { backgroundColor: 'rgba(59,130,246,0.08)' }]}>
                                <MaterialIcons name="admin-panel-settings" size={36} color="#3b82f6" />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.cardTitle}>{t('role.villageAdmin')}</Text>
                                <Text style={styles.cardDesc}>{t('role.adminManage')}</Text>
                            </View>
                            <Feather name="arrow-right" size={20} color="#3b82f6" />
                        </TouchableOpacity>
                    </View>

                    {/* Login link */}
                    <TouchableOpacity
                        style={styles.loginLink}
                        onPress={() => router.push('/(auth)/login')}
                    >
                        <Text style={styles.loginText}>
                            {t('role.alreadyHaveAccount')} <Text style={{ fontWeight: '800', color: Theme.colors.primary }}>{t('role.signIn')}</Text>
                        </Text>
                    </TouchableOpacity>

                    {/* Footer */}
                    <Text style={styles.footer}>{t('role.madeWithLove')}</Text>
                </View>
            </SafeAreaView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    bg: { flex: 1, backgroundColor: '#fff', overflow: 'hidden' as const },
    content: {
        flex: 1,
        paddingHorizontal: 28,
        paddingTop: 60,
        paddingBottom: 20,
    },
    top: { marginBottom: 48 },
    heading: {
        fontSize: 38, fontWeight: '900', color: Theme.colors.text,
        letterSpacing: -1, lineHeight: 44,
    },
    heading2: {
        fontSize: 38, fontWeight: '900', color: Theme.colors.primary,
        letterSpacing: -1, lineHeight: 44, marginBottom: 8,
    },
    sub: {
        fontSize: 16, color: Theme.colors.textMuted,
    },
    cards: { gap: 16 },
    card: {
        flexDirection: 'row', alignItems: 'center',
        paddingVertical: 20, paddingHorizontal: 18,
        borderRadius: Theme.roundness.md,
        backgroundColor: 'rgba(255,255,255,0.5)',
        borderBottomWidth: 2, borderBottomColor: 'rgba(5,150,105,0.06)',
        gap: 14,
    },
    iconWrap: {
        width: 56, height: 56, borderRadius: 18,
        alignItems: 'center', justifyContent: 'center',
    },
    cardTitle: {
        fontSize: 18, fontWeight: '800', color: Theme.colors.text,
        marginBottom: 2,
    },
    cardDesc: {
        fontSize: 13, color: Theme.colors.textMuted,
    },
    loginLink: {
        marginTop: 40, alignItems: 'center',
    },
    loginText: {
        fontSize: 14, color: Theme.colors.textMuted,
    },
    footer: {
        marginTop: 'auto',
        fontSize: 12, color: Theme.colors.textMuted,
        textAlign: 'center', fontStyle: 'italic',
    },
});
