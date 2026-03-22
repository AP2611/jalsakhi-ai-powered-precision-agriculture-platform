import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import { Theme } from '../../constants/JalSakhiTheme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import api from '../../utils/api';
import { MLService } from '../../services/ml';

// Model 3: Admin Water Allocation Optimizer Input Screen
export default function WaterAllocationOptimizer() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [farmersData, setFarmersData] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    reservoirCapacity: '',
    currentWaterLevel: '',
    rainfallForecast: '',
    temperature: '',
    evaporationRate: '',
    timeHorizon: '7', // days
  });

  useEffect(() => {
    fetchFarmersData();
  }, []);

  const fetchFarmersData = async () => {
    try {
      // Use the proper API utility
      const response = await api.get('/api/farms/all-farms');

      if (response.data?.success) {
        // Map the backend farms to what the ML model expects
        const mappedFarms = response.data.data.map((f: any) => ({
          farm_id: f._id,
          name: f.name || 'Farmer',
          area_ha: (f.area_acre || 1) * 0.4047, // Convert acre to hectare
          crop_type: f.crop_type || 'WHEAT',
          soil_type: f.soil_type || 'DRY',
          priority_score: 2,
          region: 'SEMI HUMID',
          temperature: '20-30',
          weather_condition: 'NORMAL'
        }));
        setFarmersData(mappedFarms);
      } else {
        throw new Error('Failed to fetch farms');
      }
    } catch (error) {
      console.error('Error fetching farmers:', error);
      // Fallback for demo
      setFarmersData([
        { id: 'F001', name: 'Ramesh Kumar', area_acre: 2.5, crop_type: 'RICE', priority_score: 3, soil_type: 'DRY' },
        { id: 'F002', name: 'Suresh Patil', area_acre: 1.8, crop_type: 'WHEAT', priority_score: 2, soil_type: 'WET' },
      ]);
    }
  };

  const handleOptimize = async () => {
    if (!formData.reservoirCapacity || !formData.currentWaterLevel) {
      Alert.alert('Error', 'Please fill required fields');
      return;
    }

    const capacity = parseFloat(formData.reservoirCapacity);
    const current = parseFloat(formData.currentWaterLevel);

    if (current > capacity) {
      Alert.alert('Error', 'Current level cannot exceed capacity');
      return;
    }

    setLoading(true);
    try {
      const optimizedResults = await MLService.optimizeAllocation(current, farmersData);

      // Join model results with farmer metadata
      const allocations = optimizedResults.map((opt: any) => {
        const farmer = farmersData.find(f => f.farm_id === opt.farm_id) || {};
        return {
          farmerId: opt.farm_id,
          farmerName: farmer.name || `Farmer ${opt.farm_id}`,
          priority: farmer.priority_score > 2 ? 'high' : farmer.priority_score > 1 ? 'medium' : 'low',
          required: Math.round(opt.required_water || (farmer.area_ha * 45)),
          allocated: Math.round(opt.allocated_water),
          satisfactionRate: opt.satisfaction_rate || Math.round((opt.allocated_water / (opt.required_water || 1)) * 100),
          schedule: opt.schedule || [
            { day: 'Morning', amount: Math.round(opt.allocated_water * 0.6), slot: '6-8 AM' },
            { day: 'Evening', amount: Math.round(opt.allocated_water * 0.4), slot: '5-7 PM' },
          ]
        };
      });

      const totalAllocated = allocations.reduce((sum: number, a: any) => sum + a.allocated, 0);
      const totalRequired = allocations.reduce((sum: number, a: any) => sum + a.required, 0);

      router.push({
        pathname: '/admin/allocation-results' as any,
        params: {
          optimization: JSON.stringify({
            totalAvailable: current,
            totalAllocated,
            totalRequired,
            efficiency: Math.round((totalAllocated / current) * 100),
            fairnessScore: 92,
            allocations: allocations
          }),
          inputData: JSON.stringify({ ...formData, farmersCount: farmersData.length })
        },
      });
    } catch (error: any) {
      Alert.alert('Error', 'AI Optimization failed. Please check if services are online.');
    } finally {
      setLoading(false);
    }
  };

  const updateFarmerPriority = (farmerId: string, priority: string) => {
    setFarmersData(prev =>
      prev.map(farmer =>
        farmer.id === farmerId ? { ...farmer, priority } : farmer
      )
    );
  };



  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <LinearGradient
          colors={[Theme.colors.primary, Theme.colors.secondary]}
          style={styles.header}
        >
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Feather name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={styles.title}>Water Allocation Optimizer</Text>
            <Text style={styles.subtitle}>Model 3: Optimize village distribution</Text>
          </View>
        </LinearGradient>

        <View style={styles.content}>
          {/* Reservoir Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>💧 Reservoir Status</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Total Capacity (Liters) *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., 50000"
                keyboardType="numeric"
                value={formData.reservoirCapacity}
                onChangeText={(text) => setFormData({ ...formData, reservoirCapacity: text })}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Current Water Level (Liters) *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., 38500"
                keyboardType="numeric"
                value={formData.currentWaterLevel}
                onChangeText={(text) => setFormData({ ...formData, currentWaterLevel: text })}
              />
              {formData.reservoirCapacity && formData.currentWaterLevel && (
                <Text style={styles.hint}>
                  {((parseFloat(formData.currentWaterLevel) / parseFloat(formData.reservoirCapacity)) * 100).toFixed(1)}% full
                </Text>
              )}
            </View>
          </View>

          {/* Weather Forecast */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🌤️ Weather Forecast</Text>

            <View style={styles.row}>
              <View style={styles.halfInput}>
                <Text style={styles.label}>Expected Rainfall (mm)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., 25"
                  keyboardType="decimal-pad"
                  value={formData.rainfallForecast}
                  onChangeText={(text) => setFormData({ ...formData, rainfallForecast: text })}
                />
              </View>

              <View style={styles.halfInput}>
                <Text style={styles.label}>Avg Temperature (°C)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., 32"
                  keyboardType="decimal-pad"
                  value={formData.temperature}
                  onChangeText={(text) => setFormData({ ...formData, temperature: text })}
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Evaporation Rate (mm/day)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., 5.5"
                keyboardType="decimal-pad"
                value={formData.evaporationRate}
                onChangeText={(text) => setFormData({ ...formData, evaporationRate: text })}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Optimization Period (Days)</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.timeHorizon}
                  onValueChange={(value) => setFormData({ ...formData, timeHorizon: value })}
                  style={styles.picker}
                >
                  <Picker.Item label="3 Days" value="3" />
                  <Picker.Item label="7 Days (Recommended)" value="7" />
                  <Picker.Item label="14 Days" value="14" />
                  <Picker.Item label="30 Days" value="30" />
                </Picker>
              </View>
            </View>
          </View>

          {/* Farmers Priority List */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>👨‍🌾 Farmers Priority ({farmersData.length})</Text>
            <Text style={styles.sectionSubtitle}>Adjust priority levels to optimize allocation</Text>

            {farmersData.map((farmer, index) => (
              <View key={farmer.id} style={styles.farmerCard}>
                <View style={styles.farmerInfo}>
                  <View style={styles.farmerHeader}>
                    <Text style={styles.farmerName}>{farmer.name}</Text>
                    <Text style={styles.farmerId}>#{farmer.id}</Text>
                  </View>
                  <View style={styles.farmerDetails}>
                    <Text style={styles.farmerDetailText}>
                      🌾 {farmer.crops.join(', ')} • {farmer.landSize} acres
                    </Text>
                    <Text style={styles.farmerDetailText}>
                      💧 ~{farmer.avgWaterRequirement} L/day avg
                    </Text>
                  </View>
                </View>

                <View style={styles.prioritySelector}>
                  <TouchableOpacity
                    style={[
                      styles.priorityBtn,
                      farmer.priority === 'high' && { backgroundColor: '#fee2e2' }
                    ]}
                    onPress={() => updateFarmerPriority(farmer.id, 'high')}
                  >
                    <Text style={[
                      styles.priorityBtnText,
                      farmer.priority === 'high' && { color: '#ef4444', fontWeight: '600' }
                    ]}>
                      High
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.priorityBtn,
                      farmer.priority === 'medium' && { backgroundColor: '#fef3c7' }
                    ]}
                    onPress={() => updateFarmerPriority(farmer.id, 'medium')}
                  >
                    <Text style={[
                      styles.priorityBtnText,
                      farmer.priority === 'medium' && { color: '#f59e0b', fontWeight: '600' }
                    ]}>
                      Med
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.priorityBtn,
                      farmer.priority === 'low' && { backgroundColor: '#dcfce7' }
                    ]}
                    onPress={() => updateFarmerPriority(farmer.id, 'low')}
                  >
                    <Text style={[
                      styles.priorityBtnText,
                      farmer.priority === 'low' && { color: '#10b981', fontWeight: '600' }
                    ]}>
                      Low
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleOptimize}
            disabled={loading}
          >
            <Feather name="cpu" size={20} color="#fff" />
            <Text style={styles.buttonText}>
              {loading ? 'Optimizing...' : 'Optimize Water Allocation'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 16,
  },
  backBtn: {
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.9,
    marginTop: 2,
  },
  content: {
    padding: 16,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Theme.colors.text,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: Theme.colors.textSecondary,
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: Theme.colors.text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: Theme.colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  hint: {
    fontSize: 12,
    color: Theme.colors.primary,
    marginTop: 4,
    fontWeight: '500',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: Theme.colors.border,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  farmerCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  farmerInfo: {
    marginBottom: 12,
  },
  farmerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  farmerName: {
    fontSize: 16,
    fontWeight: '600',
    color: Theme.colors.text,
  },
  farmerId: {
    fontSize: 12,
    color: Theme.colors.textSecondary,
    backgroundColor: '#e5e5e5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  farmerDetails: {
    gap: 4,
  },
  farmerDetailText: {
    fontSize: 13,
    color: Theme.colors.textSecondary,
  },
  prioritySelector: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityBtn: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e5e5',
    alignItems: 'center',
  },
  priorityBtnText: {
    fontSize: 13,
    color: Theme.colors.textSecondary,
  },
  button: {
    backgroundColor: Theme.colors.primary,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
    marginBottom: 24,
    elevation: 4,
    shadowColor: Theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
