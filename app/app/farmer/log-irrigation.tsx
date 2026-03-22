import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, StatusBar, Dimensions, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { Theme } from '../../constants/JalSakhiTheme';
import { useApp } from '../../context/AppContext';
import { Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

const screenWidth = Dimensions.get('window').width;

export default function LogIrrigation() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const farmId = params.farmId as string | undefined;
  const { t } = useTranslation();
  const { addIrrigationLog } = useApp();

  const [amount, setAmount] = useState('');
  const [duration, setDuration] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!amount) {
      Alert.alert(t('common.error'), t('irrigation.missingAmount'));
      return;
    }
    setLoading(true);
    try {
      await addIrrigationLog({
        farmId: farmId || 'unknown',
        date: new Date().toISOString(),
        amount: parseFloat(amount),
        duration,
        notes,
      });
      Alert.alert(t('irrigation.logged'), t('irrigation.manualLogged'));
      router.replace({ pathname: '/farmer/my-farm-detail', params: { id: farmId } } as any);
    } catch (error) {
      console.error('Log irrigation error', error);
      Alert.alert(t('common.error'), t('irrigation.failedLog'));
    } finally {
      setLoading(false);
    }
  };

  const GlassCard = ({ title, icon, children, style, intensity = 40 }: any) => (
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
        <View style={[styles.designLine, { top: '20%', left: -50, transform: [{ rotate: '45deg' }] }]} />
        <View style={[styles.designLine, { bottom: '10%', right: -80, width: 300, transform: [{ rotate: '-30deg' }] }]} />
      </View>

      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <BlurView intensity={60} tint="light" style={styles.backBlur}>
              <Feather name="chevron-left" size={24} color={Theme.colors.text} />
            </BlurView>
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.title}>{t('irrigation.logIrrigation')}</Text>
            <Text style={styles.subtitle}>Track your manual water usage</Text>
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.bentoGrid}>
            <GlassCard title="Usage Details" icon="water-pump" style={styles.fullWidth} intensity={40}>

              <View style={styles.inputGroup}>
                <Text style={styles.miniLabel}>{t('irrigation.amountLiters')}</Text>
                <View style={styles.inputWrapper}>
                  <Feather name="droplet" size={18} color={Theme.colors.primary} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={amount}
                    onChangeText={setAmount}
                    placeholder="e.g., 200"
                    placeholderTextColor="#94a3b8"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.miniLabel}>{t('irrigation.duration')}</Text>
                <View style={styles.inputWrapper}>
                  <Feather name="clock" size={18} color={Theme.colors.primary} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    value={duration}
                    onChangeText={setDuration}
                    placeholder="e.g., 30 mins"
                    placeholderTextColor="#94a3b8"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.miniLabel}>{t('irrigation.notes')}</Text>
                <View style={[styles.inputWrapper, { height: 100, alignItems: 'flex-start', paddingTop: 12 }]}>
                  <MaterialCommunityIcons name="note-text-outline" size={20} color={Theme.colors.primary} style={[styles.inputIcon, { marginTop: 2 }]} />
                  <TextInput
                    style={[styles.input, { height: '100%' }]}
                    value={notes}
                    onChangeText={setNotes}
                    placeholder={t('irrigation.optionalNotes')}
                    placeholderTextColor="#94a3b8"
                    multiline
                    textAlignVertical="top"
                  />
                </View>
              </View>
            </GlassCard>
          </View>

          <TouchableOpacity
            style={[styles.submitBtn, loading && styles.btnDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <LinearGradient colors={['#3b82f6', '#2563eb']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.gradientBtn}>
              <Feather name="save" size={20} color="white" />
              <Text style={styles.submitBtnText}>
                {loading ? t('farms.saving') : t('irrigation.logIrrigation')}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  decorativeLayer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  designLine: {
    position: 'absolute',
    width: 300,
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
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  backBlur: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  headerTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: Theme.colors.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    color: Theme.colors.textMuted,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  bentoGrid: {
    gap: 16,
  },
  fullWidth: {
    width: '100%',
  },
  glassCard: {
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  cardBlur: {
    padding: 24,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  cardIconBox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: 'rgba(59, 130, 246, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: Theme.colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputGroup: {
    marginBottom: 16,
  },
  miniLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Theme.colors.textMuted,
    marginBottom: 8,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#064e3b',
  },
  submitBtn: {
    marginTop: 24,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  gradientBtn: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  submitBtnText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  btnDisabled: {
    opacity: 0.7,
  }
});
