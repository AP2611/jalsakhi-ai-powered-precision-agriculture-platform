import React from 'react';
import { StyleSheet, View, Text, TextInput, ImageBackground, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Theme } from '../../constants/JalSakhiTheme';
import { CustomButton } from '../../components/shared/CustomButton';
import { useAuth } from '../../context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

export default function OTPScreen() {
    const router = useRouter();
    const { verifyAccount, sendVerifyOtp } = useAuth();
    const { t } = useTranslation();
    const [otp, setOtp] = React.useState(['', '', '', '', '', '']);
    const [loading, setLoading] = React.useState(false);

    // Refs for each input
    const inputRefs = [
        React.useRef<TextInput>(null),
        React.useRef<TextInput>(null),
        React.useRef<TextInput>(null),
        React.useRef<TextInput>(null),
        React.useRef<TextInput>(null),
        React.useRef<TextInput>(null),
    ];

    const otpString = otp.join('');

    const handleVerify = async () => {
        if (otpString.length < 6) {
            Alert.alert(t('otp.invalidOtp'), t('otp.enter6Digit'));
            return;
        }
        setLoading(true);
        try {
            const result = await verifyAccount(otpString);
            if (result.success) {
                Alert.alert(t('otp.verified'), t('otp.accountVerified'));
                router.replace('/farmer/dashboard');
            } else {
                Alert.alert(t('common.error'), result.message || t('otp.invalidOtp'));
            }
        } catch (error: any) {
            Alert.alert(t('common.error'), error.message || t('otp.verificationFailed'));
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        try {
            const result = await sendVerifyOtp();
            if (result.success) {
                Alert.alert(t('otp.sent'), t('otp.newOtpSent'));
            } else {
                Alert.alert(t('common.error'), result.message || t('otp.resendFailed'));
            }
        } catch (error: any) {
            Alert.alert(t('common.error'), error.message || t('otp.resendFailed'));
        }
    };

    const handleChange = (text: string, index: number) => {
        const newOtp = [...otp];
        // Only take the last character entered
        newOtp[index] = text.slice(-1);
        setOtp(newOtp);

        // Move to next field if text is entered
        if (text && index < 5) {
            inputRefs[index + 1].current?.focus();
        }
    };

    const handleKeyPress = (e: any, index: number) => {
        // Move to previous field on backspace if current field is empty
        if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs[index - 1].current?.focus();
        }
    };

    return (
        <ImageBackground
            source={require('../../assets/images/background.jpeg')}
            style={styles.bg}
            imageStyle={{ opacity: 0.12 }}
        >
            <SafeAreaView style={styles.safe}>
                {/* Back */}
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <Feather name="arrow-left" size={22} color={Theme.colors.text} />
                </TouchableOpacity>

                {/* Heading */}
                <Text style={styles.heading}>{t('otp.verify')}</Text>
                <Text style={styles.heading2}>{t('otp.yourEmail')}</Text>
                <Text style={styles.sub}>{t('otp.enterCode')}</Text>

                {/* OTP Input */}
                <View style={styles.otpContainer}>
                    {otp.map((digit, index) => (
                        <TextInput
                            key={index}
                            ref={inputRefs[index]}
                            style={[
                                styles.otpBox,
                                digit ? styles.otpBoxActive : null
                            ]}
                            keyboardType="number-pad"
                            maxLength={1}
                            value={digit}
                            onChangeText={(text) => handleChange(text, index)}
                            onKeyPress={(e) => handleKeyPress(e, index)}
                            autoFocus={index === 0}
                            selectTextOnFocus
                        />
                    ))}
                </View>

                {/* Resend */}
                <Text style={styles.resendText}>
                    {t('otp.didntReceive')}{' '}
                    <Text style={styles.resendLink} onPress={handleResend}>{t('otp.resendOtp')}</Text>
                </Text>

                {/* Verify */}
                <View style={styles.bottom}>
                    <CustomButton
                        title={t('otp.verifyAccount')}
                        onPress={handleVerify}
                        loading={loading}
                        disabled={otpString.length < 6}
                        size="lg"
                    />
                </View>
            </SafeAreaView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    bg: { flex: 1, backgroundColor: '#fff', overflow: 'hidden' as const },
    safe: { flex: 1, paddingHorizontal: 28, paddingTop: 20 },
    backBtn: {
        width: 42, height: 42, borderRadius: 14,
        backgroundColor: 'rgba(255,255,255,0.75)',
        alignItems: 'center', justifyContent: 'center',
        marginBottom: 36,
        ...Theme.shadows.soft,
    },
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
        lineHeight: 22, marginBottom: 40,
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 40,
        gap: 8,
    },
    otpBox: {
        flex: 1,
        height: 60,
        borderRadius: 16,
        backgroundColor: '#F8FAFC',
        borderWidth: 2,
        borderColor: '#E2E8F0',
        fontSize: 24,
        fontWeight: '800',
        color: Theme.colors.text,
        textAlign: 'center',
    },
    otpBoxActive: {
        borderColor: Theme.colors.primary,
        backgroundColor: '#FFFFFF',
        ...Theme.shadows.soft,
    },
    resendText: {
        textAlign: 'center', color: Theme.colors.textMuted, fontSize: 14,
    },
    resendLink: {
        color: Theme.colors.primary, fontWeight: '800',
    },
    bottom: {
        flex: 1, justifyContent: 'flex-end', paddingBottom: 24,
    },
});
