import React, { useState } from 'react';
import { StyleSheet, View, Text, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, Alert, TextInput, ImageBackground, Image } from 'react-native';
import { useRouter, Stack, useLocalSearchParams } from 'expo-router';
import { Theme } from '../../constants/JalSakhiTheme';
import { CustomButton } from '../../components/shared/CustomButton';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';

export default function LoginScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const role = (params.role as 'FARMER' | 'ADMIN') || 'FARMER';
    const { login } = useAuth();
    const { t } = useTranslation();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert(t('auth.missingFields'), t('auth.enterEmailPassword'));
            return;
        }

        setLoading(true);
        try {
            const result = await login({ email, password });
            if (result.success) {
                if (role === 'FARMER') {
                    router.replace('/farmer/dashboard');
                } else {
                    router.replace('/admin/dashboard');
                }
            } else {
                Alert.alert(t('auth.loginFailed'), result.message || t('auth.invalidCreds'));
            }
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Login failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ImageBackground
            source={require('../../assets/images/background.jpeg')}
            style={styles.bg}
            imageStyle={{ opacity: 0.12 }}
        >
            <SafeAreaView style={{ flex: 1 }}>
                <Stack.Screen options={{ headerShown: false }} />
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}
                >
                    <ScrollView
                        contentContainerStyle={styles.scroll}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        {/* Back */}
                        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                            <Feather name="arrow-left" size={22} color={Theme.colors.text} />
                        </TouchableOpacity>

                        {/* Logo */}
                        <View style={{ alignItems: 'center', marginBottom: 24 }}>
                            <View style={styles.logoWrap}>
                                <Image
                                    source={require('../../assets/images/logo.png')}
                                    style={styles.logo}
                                    resizeMode="contain"
                                />
                            </View>
                        </View>

                        {/* Heading */}
                        <Text style={styles.greeting}>{t('auth.welcome')}</Text>
                        <Text style={styles.greeting2}>{t('auth.back')}</Text>
                        <Text style={styles.sub}>
                            {t('auth.signInTo', { role: role === 'FARMER' ? t('role.farmer').toLowerCase() : t('role.admin').toLowerCase() })}
                        </Text>

                        {/* Email */}
                        <Text style={styles.label}>{t('auth.email')}</Text>
                        <View style={styles.inputRow}>
                            <Feather name="mail" size={18} color={Theme.colors.primary} />
                            <TextInput
                                style={styles.input}
                                placeholder="you@example.com"
                                placeholderTextColor="rgba(0,0,0,0.25)"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                value={email}
                                onChangeText={setEmail}
                            />
                        </View>

                        {/* Password */}
                        <Text style={styles.label}>{t('auth.password')}</Text>
                        <View style={styles.inputRow}>
                            <Feather name="lock" size={18} color={Theme.colors.primary} />
                            <TextInput
                                style={styles.input}
                                placeholder={t('auth.enterPassword')}
                                placeholderTextColor="rgba(0,0,0,0.25)"
                                secureTextEntry={!showPassword}
                                value={password}
                                onChangeText={setPassword}
                            />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                                <Feather name={showPassword ? 'eye-off' : 'eye'} size={18} color={Theme.colors.textMuted} />
                            </TouchableOpacity>
                        </View>

                        {/* Login Button */}
                        <CustomButton
                            title={t('auth.signInBtn')}
                            onPress={handleLogin}
                            loading={loading}
                            style={styles.btn}
                        />

                        {/* Link */}
                        <TouchableOpacity
                            onPress={() => router.push({ pathname: '/(auth)/farmer-signup', params: { role } } as any)}
                            style={styles.linkBtn}
                        >
                            <Text style={styles.linkText}>
                                {t('auth.noAccount')} <Text style={{ fontWeight: '800', color: Theme.colors.primary }}>{t('auth.signUp')}</Text>
                            </Text>
                        </TouchableOpacity>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    bg: {
        flex: 1,
        backgroundColor: '#fff',
        overflow: 'hidden' as const,
    },
    scroll: {
        flexGrow: 1,
        paddingHorizontal: 28,
        paddingTop: 20,
        paddingBottom: 40,
    },
    backBtn: {
        width: 42, height: 42, borderRadius: 14,
        backgroundColor: 'rgba(255,255,255,0.75)',
        alignItems: 'center', justifyContent: 'center',
        marginBottom: 36,
        ...Theme.shadows.soft,
    },
    logoWrap: {
        width: 100, height: 100, borderRadius: 30,
        backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center',
        ...Theme.shadows.medium,
    },
    logo: { width: 70, height: 70 },
    greeting: {
        fontSize: 38, fontWeight: '900', color: Theme.colors.text,
        letterSpacing: -1, lineHeight: 44,
    },
    greeting2: {
        fontSize: 38, fontWeight: '900', color: Theme.colors.primary,
        letterSpacing: -1, lineHeight: 44, marginBottom: 8,
    },
    sub: {
        fontSize: 16, color: Theme.colors.textMuted,
        marginBottom: 40, lineHeight: 22,
    },
    label: {
        fontSize: 13, fontWeight: '700', color: Theme.colors.textMuted,
        marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1,
    },
    inputRow: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.5)',
        borderRadius: 16, paddingHorizontal: 16,
        height: 56, marginBottom: 24,
        borderBottomWidth: 2, borderBottomColor: 'rgba(5, 150, 105, 0.1)',
        gap: 12,
    },
    input: {
        flex: 1, fontSize: 16, fontWeight: '600', color: Theme.colors.text,
    },
    btn: {
        marginTop: 12, height: 56, borderRadius: Theme.roundness.md,
    },
    linkBtn: {
        marginTop: 24, alignItems: 'center',
    },
    linkText: {
        fontSize: 14, color: Theme.colors.textMuted,
    },
});
