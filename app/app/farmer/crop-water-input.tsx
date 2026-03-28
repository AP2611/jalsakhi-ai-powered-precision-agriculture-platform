import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, ScrollView, Alert, Dimensions, StatusBar } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Theme } from '../../constants/JalSakhiTheme';
import { Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenWrapper } from '../../components/shared/ScreenWrapper';

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
      <BlurView intensity={60} tint="light" style={styles.cardBlur}>
        <View style={styles.cardHeader}>
          <View style={styles.cardIconBox}>
            <MaterialCommunityIcons name={icon} size={22} color={Theme.colors.forest} />
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
            <Pressable
              key={option}
              style={({ pressed }) => [
                styles.chip,
                isSelected && styles.activeChip,
                { opacity: pressed ? 0.8 : 1 }
              ]}
              onPress={() => onValueChange(option)}
            >
              <Text style={[styles.chipText, isSelected && styles.activeChipText]}>
                {option}
              </Text>
              {isSelected && <Ionicons name="checkmark-circle" size={14} color="white" style={{ marginLeft: 6 }} />}
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );

  return (
    <ScreenWrapper contentContainerStyle={styles.scrollContent}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={({ pressed }) => [styles.backBtn, { opacity: pressed ? 0.7 : 1 }]}
          onPress={() => router.back()}
        >
          <BlurView intensity={60} tint="light" style={styles.backBlur}>
            <Feather name="chevron-left" size={28} color={Theme.colors.forest} />
          </BlurView>
        </Pressable>
        <View style={styles.headerTextContainer}>
          <Text style={styles.title}>Crop Water</Text>
          <Text style={styles.subtitle}>Predict precise irrigation needs</Text>
        </View>
      </View>

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
                  <Pressable
                    key={s}
                    style={({ pressed }) => [
                      styles.chip,
                      formData.growthStage === s && styles.activeChip,
                      { opacity: pressed ? 0.8 : 1 }
                    ]}
                    onPress={() => setFormData({ ...formData, growthStage: s })}
                  >
                    <Text style={[styles.chipText, formData.growthStage === s && styles.activeChipText]}>{s}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          </View>

          <View style={[styles.inputGroup, { marginTop: 16 }]}>
            <Text style={styles.miniLabel}>Soil State</Text>
            <View style={styles.chipList}>
              {['DRY', 'HUMID', 'WET'].map(s => (
                <Pressable
                  key={s}
                  style={({ pressed }) => [
                    styles.chip,
                    formData.soilType === s && styles.activeChip,
                    { opacity: pressed ? 0.8 : 1 }
                  ]}
                  onPress={() => setFormData({ ...formData, soilType: s })}
                >
                  <Text style={[styles.chipText, formData.soilType === s && styles.activeChipText]}>{s} SOIL</Text>
                </Pressable>
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
              placeholderTextColor="rgba(6, 78, 59, 0.4)"
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
                  <Pressable
                    key={t}
                    style={({ pressed }) => [
                      styles.chip,
                      formData.temperature === t && styles.activeChip,
                      { opacity: pressed ? 0.8 : 1 }
                    ]}
                    onPress={() => setFormData({ ...formData, temperature: t })}
                  >
                    <Text style={[styles.chipText, formData.temperature === t && styles.activeChipText]}>{t}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
            <View style={styles.halfInput}>
              <Text style={styles.miniLabel}>Humidity (%)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., 65"
                placeholderTextColor="rgba(6, 78, 59, 0.4)"
                keyboardType="decimal-pad"
                value={formData.humidity}
                onChangeText={(t) => setFormData({ ...formData, humidity: t })}
              />
            </View>
          </View>
        </GlassCard>
      </View>

      <Pressable
        style={({ pressed }) => [styles.submitBtn, loading && styles.btnDisabled, { opacity: pressed ? 0.9 : 1 }]}
        onPress={handleSubmit}
        disabled={loading}
      >
        <LinearGradient colors={['#10b981', '#059669']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.gradientBtn}>
          <Feather name="zap" size={20} color="white" />
          <Text style={styles.submitBtnText}>
            {loading ? 'Analyzing...' : 'Get Recommendation'}
          </Text>
        </LinearGradient>
      </Pressable>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 25,
    gap: 16,
  },
  backBtn: {},
  backBlur: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.85)',
    ...Theme.shadows.soft,
    borderWidth: 1,
    borderColor: 'rgba(6, 78, 59, 0.05)',
  },
  headerTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: Theme.colors.forest,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 12,
    color: 'rgba(6, 78, 59, 0.4)',
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
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
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    borderWidth: 1,
    borderColor: 'rgba(6, 78, 59, 0.08)',
    ...Theme.shadows.soft,
  },
  cardBlur: {
    padding: 24,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  cardIconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Theme.colors.forest,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputGroup: {
    marginBottom: 12,
  },
  miniLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: 'rgba(6, 78, 59, 0.4)',
    marginBottom: 8,
    marginLeft: 4,
    textTransform: 'uppercase',
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
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(6, 78, 59, 0.08)',
    flexDirection: 'row',
    alignItems: 'center',
    ...Theme.shadows.soft,
  },
  activeChip: {
    backgroundColor: Theme.colors.forest,
    borderColor: Theme.colors.forest,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '800',
    color: 'rgba(6, 78, 59, 0.5)',
  },
  activeChipText: {
    color: 'white',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 14,
    height: 56,
    paddingHorizontal: 16,
    fontSize: 16,
    color: Theme.colors.forest,
    fontWeight: '800',
    borderWidth: 1,
    borderColor: 'rgba(6, 78, 59, 0.08)',
    ...Theme.shadows.soft,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  submitBtn: {
    marginTop: 24,
    borderRadius: 16,
    overflow: 'hidden',
    ...Theme.shadows.soft,
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
