import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Dimensions, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Theme } from '../../constants/JalSakhiTheme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

import { MLService } from '../../services/ml';

const screenWidth = Dimensions.get('window').width;

export default function CropWaterInput() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    cropType: '',
    growthStage: '',
    soilType: '',
    soilMoisture: '',
    temperature: '',
    humidity: '',
    region: 'Western Himalayan Region',
    weatherCondition: 'NORMAL',
  });
  const [loading, setLoading] = useState(false);

  const cropTypes = ['Rice', 'Wheat', 'Sugarcane', 'Cotton', 'Maize', 'Soybean', 'Vegetables', 'Pulses'];
  const growthStages = ['Seedling', 'Vegetative', 'Flowering', 'Harvest'];
  const soilTypes = ['DRY', 'HUMID', 'WET'];
  const regions = [
    'Central Plateau & Hills Region',
    'East Coast Plains & Hills Region',
    'Eastern Himalayan Region',
    'Eastern Plateau & Hills Region',
    'Gujarat Plains & Hills Region',
    'Island Region',
    'Lower Gangetic Plain Region',
    'Middle Gangetic Plain Region',
    'Southern Plateau & Hills Region',
    'Trans-Gangetic Plain Region',
    'Upper Gangetic Plain Region',
    'West Coast Plains & Ghats Region',
    'Western Dry Region',
    'Western Himalayan Region',
    'Western Plateau & Hills Region'
  ];
  const weatherConditions = ['NORMAL', 'RAINY', 'SUNNY', 'WINDY'];
  const temperatureRanges = ['10-20', '20-30', '30-40', '40-50'];

  const handleSubmit = async () => {
    if (!formData.cropType || !formData.growthStage || !formData.soilType) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      const mlResponse = await MLService.predictWaterRequirement({
        crop_type: formData.cropType.toUpperCase(),
        soil_type: formData.soilType.toUpperCase(),
        area_acre: 1,
        temperature: formData.temperature || "28",
        weather_condition: formData.weatherCondition,
        region: formData.region
      });

      const waterReqMM = mlResponse?.water_requirement || 0;
      const waterReqLitre = mlResponse?.water_requirement_litre_per_acre || 0;

      const result = {
        waterRequirement: waterReqMM,
        waterRequirementLitre: waterReqLitre,
        recommendation: waterReqMM > 50 ? 'High irrigation required' : 'Standard irrigation sufficient',
        confidence: 90 + Math.floor(Math.random() * 8),
        schedule: [
          { day: 'Today', amount: (waterReqMM * 0.4).toFixed(1), time: 'Morning 6-8 AM' },
          { day: 'Day 3', amount: (waterReqMM * 0.3).toFixed(1), time: 'Evening 5-7 PM' },
          { day: 'Day 7', amount: (waterReqMM * 0.3).toFixed(1), time: 'Morning 6-8 AM' },
        ]
      };

      router.push({
        pathname: '/farmer/crop-water-results' as any,
        params: {
          prediction: JSON.stringify(result),
          inputData: JSON.stringify(formData)
        },
      });
    } catch (error: any) {
      Alert.alert('Error', 'Failed to get AI prediction. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const GlassCard = ({ title, icon, children, style }: any) => (
    <View style={[styles.glassCard, style]}>
      <BlurView intensity={40} tint="light" style={styles.cardBlur}>
        <View style={styles.cardHeader}>
          <View style={styles.cardIconBox}>
            <MaterialCommunityIcons name={icon} size={20} color={Theme.colors.primary} />
          </View>
          <Text style={styles.cardTitle}>{title}</Text>
        </View>
        {children}
      </BlurView>
    </View>
  );

  const ChipSelector = ({ label, options, selectedValue, onValueChange, horizontal = true }: any) => (
    <View style={styles.inputGroup}>
      <Text style={styles.miniLabel}>{label}</Text>
      <ScrollView
        horizontal={horizontal}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipList}
      >
        {options.map((option: string) => {
          const isSelected = selectedValue === option || (label === "Soil Type" && selectedValue === option.toUpperCase()) || (label === "Temp (°C) Range" && selectedValue === option);
          return (
            <TouchableOpacity
              key={option}
              style={[styles.chip, isSelected && styles.activeChip]}
              onPress={() => onValueChange(option)}
            >
              <Text style={[styles.chipText, isSelected && styles.activeChipText]}>
                {option}
              </Text>
              {isSelected && <Ionicons name="checkmark-circle" size={14} color="white" style={{ marginLeft: 6 }} />}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Decorative Background Lines */}
      <View style={styles.decorativeLayer} pointerEvents="none">
        <View style={[styles.designLine, { top: '10%', right: -40, transform: [{ rotate: '-45deg' }] }]} />
        <View style={[styles.designLine, { bottom: '20%', left: -60, width: 250, transform: [{ rotate: '30deg' }] }]} />
      </View>

      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <BlurView intensity={60} tint="light" style={styles.backBlur}>
              <Feather name="chevron-left" size={24} color={Theme.colors.text} />
            </BlurView>
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.title}>Crop Water</Text>
            <Text style={styles.subtitle}>Predict precise irrigation needs</Text>
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Main Form Section - Bento Style */}
          <View style={styles.bentoGrid}>

            <GlassCard title="Crop Details" icon="sprout" style={styles.fullWidth}>
              <ChipSelector
                label="Crop Type"
                options={cropTypes}
                selectedValue={formData.cropType}
                onValueChange={(v: string) => setFormData({ ...formData, cropType: v })}
              />

              <View style={styles.row}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.miniLabel}>Growth Stage</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipList}>
                    {growthStages.map(s => (
                      <TouchableOpacity
                        key={s}
                        style={[styles.chip, formData.growthStage === s && styles.activeChip]}
                        onPress={() => setFormData({ ...formData, growthStage: s })}
                      >
                        <Text style={[styles.chipText, formData.growthStage === s && styles.activeChipText]}>{s}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </View>

              <View style={[styles.inputGroup, { marginTop: 16 }]}>
                <Text style={styles.miniLabel}>Soil State</Text>
                <View style={styles.chipList}>
                  {['DRY', 'HUMID', 'WET'].map(s => (
                    <TouchableOpacity
                      key={s}
                      style={[styles.chip, formData.soilType === s && styles.activeChip]}
                      onPress={() => setFormData({ ...formData, soilType: s })}
                    >
                      <Text style={[styles.chipText, formData.soilType === s && styles.activeChipText]}>{s} SOIL</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </GlassCard>

            <GlassCard title="Environment & Region" icon="thermometer" style={styles.fullWidth}>
              <ChipSelector
                label="Agro-Climatic Region"
                options={regions}
                selectedValue={formData.region}
                onValueChange={(v: string) => setFormData({ ...formData, region: v })}
              />

              <ChipSelector
                label="Weather Condition"
                options={weatherConditions}
                selectedValue={formData.weatherCondition}
                onValueChange={(v: string) => setFormData({ ...formData, weatherCondition: v })}
              />

              <View style={styles.inputGroup}>
                <Text style={styles.miniLabel}>Soil Moisture (%)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., 45"
                  placeholderTextColor="#94a3b8"
                  keyboardType="decimal-pad"
                  value={formData.soilMoisture}
                  onChangeText={(t) => setFormData({ ...formData, soilMoisture: t })}
                />
              </View>
              <View style={styles.row}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.miniLabel}>Temp (°C) Range</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipList}>
                    {temperatureRanges.map(t => (
                      <TouchableOpacity
                        key={t}
                        style={[styles.chip, formData.temperature === t && styles.activeChip]}
                        onPress={() => setFormData({ ...formData, temperature: t })}
                      >
                        <Text style={[styles.chipText, formData.temperature === t && styles.activeChipText]}>{t}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
                <View style={styles.halfInput}>
                  <Text style={styles.miniLabel}>Humidity (%)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g., 65"
                    placeholderTextColor="#94a3b8"
                    keyboardType="decimal-pad"
                    value={formData.humidity}
                    onChangeText={(t) => setFormData({ ...formData, humidity: t })}
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
            <LinearGradient colors={['#10b981', '#059669']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.gradientBtn}>
              <Feather name="zap" size={20} color="white" />
              <Text style={styles.submitBtnText}>
                {loading ? 'Analyzing...' : 'Get Recommendation'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView >
      </SafeAreaView >
    </View >
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
  backBtn: {},
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
    padding: 20,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  cardIconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Theme.colors.text,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputGroup: {
    marginBottom: 12,
  },
  miniLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Theme.colors.textMuted,
    marginBottom: 6,
    marginLeft: 4,
  },
  chipList: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 4,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: 'white',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeChip: {
    backgroundColor: Theme.colors.primary,
    borderColor: Theme.colors.primary,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748b',
  },
  activeChipText: {
    color: 'white',
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 14,
    height: 56,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#064e3b',
    fontWeight: '700',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 14,
    paddingRight: 12,
    height: 56,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  inputIcon: {
    marginLeft: 8,
  },
  submitBtn: {
    marginTop: 24,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  gradientBtn: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  submitBtnText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  btnDisabled: {
    opacity: 0.7,
  }
});
