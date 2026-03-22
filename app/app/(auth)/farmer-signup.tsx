import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Alert, TextInput, KeyboardAvoidingView, Platform, ImageBackground } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Theme } from '../../constants/JalSakhiTheme';
import { CustomInput } from '../../components/shared/CustomInput';
import { CustomButton } from '../../components/shared/CustomButton';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';

export default function FarmerSignup() {
    const router = useRouter();
    const { register, verifyAccount } = useAuth();
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState<'FORM' | 'OTP'>('FORM');

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [aadhar, setAadhar] = useState('');
    const [state, setState] = useState('');
    const [district, setDistrict] = useState('');
    const [village, setVillage] = useState('');
    const [landSize, setLandSize] = useState('');
    const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
    const [mobile, setMobile] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);

    const handleRegister = async () => {
        if (!fullName || !email || !password) {
            Alert.alert(t('auth.missingFields'), t('signup.fillRequired'));
            return;
        }
        setLoading(true);
        try {
            const result = await register({
                name: fullName, email, password, role: 'farmer',
                mobile, aadhar, gender, state, district, village, farmSize: landSize,
            });
            if (result.success) {
                Alert.alert(t('signup.otpSent'), t('signup.otpSentMsg'));
                setStep('OTP');
            } else {
                Alert.alert(t('common.error'), result.message || t('signup.registrationFailed'));
            }
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Registration failed.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        const otpString = otp.join('');
        if (otpString.length < 6) {
            Alert.alert(t('otp.invalidOtp'), t('otp.enter6Digit'));
            return;
        }
        setLoading(true);
        try {
            const result = await verifyAccount(otpString);
            if (result.success) {
                Alert.alert(t('common.success'), t('otp.accountVerified'));
                router.replace('/farmer/dashboard');
            } else {
                Alert.alert(t('common.error'), result.message || t('otp.invalidOtp'));
            }
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Verification failed.');
        } finally {
            setLoading(false);
        }
    };

    const handleOtpChange = (text: string, index: number) => {
        const newOtp = [...otp];
        newOtp[index] = text;
        setOtp(newOtp);
    };

    return (
        <ImageBackground
            source={require('../../assets/images/background.jpeg')}
            style={styles.bg}
            imageStyle={{ opacity: 0.12 }}
        >
            <SafeAreaView style={{ flex: 1 }}>
                <Stack.Screen options={{ headerShown: false }} />
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                    <ScrollView
                        contentContainerStyle={styles.scroll}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        {/* Back */}
                        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                            <Feather name="arrow-left" size={22} color={Theme.colors.text} />
                        </TouchableOpacity>

                        {step === 'FORM' ? (
                            <>
                                {/* Heading */}
                                <Text style={styles.heading}>{t('signup.create')}</Text>
                                <Text style={styles.heading2}>{t('signup.account')}</Text>
                                <Text style={styles.sub}>{t('signup.joinAs')}</Text>

                                {/* Section: Account */}
                                <Text style={styles.sectionLabel}>{t('signup.accountSection')}</Text>
                                <CustomInput label={t('signup.fullName')} placeholder="Rajesh Kumar" value={fullName} onChangeText={setFullName} />
                                <CustomInput label={t('signup.emailLabel')} placeholder="you@example.com" keyboardType="email-address" value={email} onChangeText={setEmail} />
                                <CustomInput label={t('signup.passwordLabel')} placeholder={t('signup.createPassword')} secureTextEntry value={password} onChangeText={setPassword} />

                                {/* Section: Personal */}
                                <Text style={styles.sectionLabel}>{t('signup.personalSection')}</Text>
                                <CustomInput
                                    label={t('signup.aadhar')}
                                    placeholder="1234 5678 9012"
                                    keyboardType="number-pad"
                                    maxLength={12}
                                    value={aadhar}
                                    onChangeText={setAadhar}
                                    leftIcon={<MaterialIcons name="fingerprint" size={20} color={Theme.colors.textMuted} />}
                                />

                                <Text style={styles.fieldLabel}>{t('signup.gender')}</Text>
                                <View style={styles.genderRow}>
                                    {['Male', 'Female', 'Other'].map((g) => (
                                        <TouchableOpacity
                                            key={g}
                                            style={[styles.genderPill, gender === g && styles.genderPillActive]}
                                            onPress={() => setGender(g as any)}
                                        >
                                            <Text style={[styles.genderPillText, gender === g && styles.genderPillTextActive]}>{t(`signup.${g.toLowerCase()}`)}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>

                                {/* Section: Location */}
                                <Text style={styles.sectionLabel}>{t('signup.locationSection')}</Text>
                                <View style={styles.row}>
                                    <View style={{ flex: 1 }}>
                                        <CustomInput label={t('signup.state')} placeholder="Maharashtra" value={state} onChangeText={setState} />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <CustomInput label={t('signup.district')} placeholder="Pune" value={district} onChangeText={setDistrict} />
                                    </View>
                                </View>
                                <CustomInput label={t('signup.village')} placeholder="Indapur" value={village} onChangeText={setVillage} />
                                <CustomInput
                                    label={t('signup.landArea')}
                                    placeholder="5.2"
                                    keyboardType="numeric"
                                    value={landSize}
                                    onChangeText={setLandSize}
                                    leftIcon={<MaterialIcons name="landscape" size={20} color={Theme.colors.textMuted} />}
                                />

                                {/* Section: Contact */}
                                <Text style={styles.sectionLabel}>{t('signup.contactSection')}</Text>
                                <CustomInput
                                    label={t('signup.mobile')}
                                    placeholder="9876543210"
                                    keyboardType="phone-pad"
                                    maxLength={10}
                                    value={mobile}
                                    onChangeText={setMobile}
                                    leftIcon={<Text style={styles.prefix}>+91</Text>}
                                />

                                <CustomButton
                                    title={t('signup.registerVerify')}
                                    onPress={handleRegister}
                                    loading={loading}
                                    style={styles.submitBtn}
                                />
                            </>
                        ) : (
                            /* OTP Step — also open layout, no container */
                            <>
                                <Text style={styles.heading}>{t('otp.verify')}</Text>
                                <Text style={styles.heading2}>{t('otp.yourEmail')}</Text>
                                <Text style={styles.sub}>{t('otp.enterCodeTo', { email })}</Text>

                                <View style={styles.otpRow}>
                                    {otp.map((digit, index) => (
                                        <TextInput
                                            key={index}
                                            style={[styles.otpBox, digit ? styles.otpBoxFilled : null]}
                                            keyboardType="number-pad"
                                            maxLength={1}
                                            value={digit}
                                            onChangeText={(text) => handleOtpChange(text, index)}
                                            autoFocus={index === 0}
                                        />
                                    ))}
                                </View>

                                <CustomButton
                                    title={t('otp.verifyAccount')}
                                    onPress={handleVerifyOtp}
                                    loading={loading}
                                    style={styles.submitBtn}
                                />

                                <TouchableOpacity onPress={() => setStep('FORM')} style={styles.linkBtn}>
                                    <Text style={styles.linkText}>{t('otp.editDetails')}</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    bg: { flex: 1, backgroundColor: '#fff', overflow: 'hidden' as const },
    scroll: {
        paddingHorizontal: 28,
        paddingTop: 20,
        paddingBottom: 60,
    },
    backBtn: {
        width: 42, height: 42, borderRadius: 14,
        backgroundColor: 'rgba(255,255,255,0.75)',
        alignItems: 'center', justifyContent: 'center',
        marginBottom: 28,
        ...Theme.shadows.soft,
    },

    // Headings
    heading: {
        fontSize: 38, fontWeight: '900', color: Theme.colors.text,
        letterSpacing: -1, lineHeight: 44,
    },
    heading2: {
        fontSize: 38, fontWeight: '900', color: Theme.colors.primary,
        letterSpacing: -1, lineHeight: 44, marginBottom: 6,
    },
    sub: {
        fontSize: 15, color: Theme.colors.textMuted,
        marginBottom: 32, lineHeight: 22,
    },

    // Section labels
    sectionLabel: {
        fontSize: 13, fontWeight: '800', color: Theme.colors.primary,
        textTransform: 'uppercase', letterSpacing: 2,
        marginTop: 28, marginBottom: 16,
        paddingBottom: 8,
        borderBottomWidth: 1, borderBottomColor: 'rgba(5,150,105,0.1)',
    },
    fieldLabel: {
        fontSize: 13, fontWeight: '700', color: Theme.colors.textMuted,
        marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1,
    },

    // Gender pills
    genderRow: {
        flexDirection: 'row', gap: 10, marginBottom: 20,
    },
    genderPill: {
        flex: 1, paddingVertical: 12,
        borderRadius: 24,
        backgroundColor: 'rgba(255,255,255,0.5)',
        borderWidth: 1.5, borderColor: 'rgba(5,150,105,0.1)',
        alignItems: 'center',
    },
    genderPillActive: {
        backgroundColor: Theme.colors.primary,
        borderColor: Theme.colors.primary,
    },
    genderPillText: {
        fontSize: 14, fontWeight: '600', color: Theme.colors.textMuted,
    },
    genderPillTextActive: {
        color: '#fff', fontWeight: '800',
    },

    // Layout helpers
    row: { flexDirection: 'row', gap: 12 },
    prefix: {
        fontSize: 16, fontWeight: '800', color: Theme.colors.primary, marginRight: 6,
    },
    submitBtn: {
        marginTop: 28, height: 56, borderRadius: Theme.roundness.md,
    },

    // OTP
    otpRow: {
        flexDirection: 'row', justifyContent: 'center',
        gap: 10, marginTop: 20, marginBottom: 36,
    },
    otpBox: {
        width: 48, height: 56, borderRadius: 14,
        borderWidth: 2, borderColor: 'rgba(5,150,105,0.1)',
        backgroundColor: 'rgba(255,255,255,0.5)',
        textAlign: 'center', fontSize: 22, fontWeight: '800',
        color: Theme.colors.primary,
    },
    otpBoxFilled: {
        borderColor: Theme.colors.primary,
        backgroundColor: 'rgba(5,150,105,0.05)',
    },

    // Links
    linkBtn: { marginTop: 20, alignItems: 'center' },
    linkText: {
        color: Theme.colors.primary, fontWeight: '700', fontSize: 14,
    },
});
