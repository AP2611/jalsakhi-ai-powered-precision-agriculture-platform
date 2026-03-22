import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, StatusBar, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { Theme } from '../../constants/JalSakhiTheme';
import { useApp } from '../../context/AppContext';
import { Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

const screenWidth = Dimensions.get('window').width;

export default function MyFarmsAddEdit() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const editingId = params.id as string | undefined;
  const { t } = useTranslation();
  const { getFarm, createFarm, updateFarm } = useApp();

  const [name, setName] = useState('');
  const [crop, setCrop] = useState('');
  const [size, setSize] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingId) {
      (async () => {
        const f = await getFarm(editingId);
        if (f) {
          setName(f.name);
          setCrop(f.crop);
          setSize(f.size);
        }
      })();
    }
  }, [editingId]);

  const handleSave = async () => {
    if (!name || !crop || !size) {
      Alert.alert(t('farms.missingFields'));
      return;
    }

    setLoading(true);
    try {
      if (editingId) {
        await updateFarm(editingId, { name, crop, size });
        Alert.alert(t('common.success'), t('farms.farmUpdated'));
      } else {
        await createFarm({ name, crop, size, status: 'Unknown' });
        Alert.alert(t('common.success'), t('farms.farmCreated'));
      }
      router.replace('/farmer/my-farms');
    } catch (error) {
      console.error('Save farm error', error);
      Alert.alert(t('common.error'), t('farms.failedSave'));
    } finally {
      setLoading(false);
    }
  };

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
            <Text style={styles.title}>{editingId ? t('farms.editFarm') : t('farms.addFarm')}</Text>
            <Text style={styles.subtitle}>{editingId ? 'Update your agricultural data' : 'Register a new farm sector'}</Text>
          </View>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.bentoGrid}>
              <GlassCard title="Information" icon="information-outline" style={styles.fullWidth} intensity={40}>
                <View style={styles.inputGroup}>
                  <Text style={styles.miniLabel}>{t('farms.farmName')}</Text>
                  <View style={styles.inputWrapper}>
                    <Feather name="type" size={18} color={Theme.colors.primary} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      value={name}
                      onChangeText={setName}
                      placeholder="e.g., North Field"
                      placeholderTextColor="#94a3b8"
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.miniLabel}>{t('farms.primaryCrop')}</Text>
                  <View style={styles.inputWrapper}>
                    <MaterialCommunityIcons name="sprout" size={20} color={Theme.colors.primary} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      value={crop}
                      onChangeText={setCrop}
                      placeholder="e.g., Wheat"
                      placeholderTextColor="#94a3b8"
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.miniLabel}>{t('farms.areaAcres')}</Text>
                  <View style={styles.inputWrapper}>
                    <MaterialCommunityIcons name="texture-box" size={18} color={Theme.colors.primary} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      value={size}
                      onChangeText={setSize}
                      placeholder="e.g., 3.5"
                      keyboardType="numeric"
                      placeholderTextColor="#94a3b8"
                    />
                  </View>
                </View>
              </GlassCard>
            </View>

            <TouchableOpacity
              style={[styles.submitBtn, loading && styles.btnDisabled]}
              onPress={handleSave}
              disabled={loading}
            >
              <LinearGradient colors={['#10b981', '#059669']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.gradientBtn}>
                <Feather name="save" size={20} color="white" />
                <Text style={styles.submitBtnText}>
                  {loading ? t('farms.saving') : t('farms.saveFarm')}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
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
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.7)',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
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
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
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
    fontWeight: '600',
    color: Theme.colors.text,
  },
  submitBtn: {
    marginTop: 24,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(16, 185, 129, 0.3)',
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
