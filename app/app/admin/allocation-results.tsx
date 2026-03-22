import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Theme } from '../../constants/JalSakhiTheme';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function AllocationResults() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Parse the optimization results
  const optimization = params.optimization ? JSON.parse(params.optimization as string) : null;
  const inputData = params.inputData ? JSON.parse(params.inputData as string) : null;

  // Sample data structure (replace with actual API response)
  const results = optimization || {
    totalAvailable: 38500,
    totalAllocated: 36200,
    totalRequired: 42000,
    efficiency: 86.2,
    fairnessScore: 92,
    allocations: [
      {
        farmerId: 'F001',
        farmerName: 'Ramesh Kumar',
        priority: 'high',
        required: 1750,
        allocated: 1650,
        satisfactionRate: 94.3,
        schedule: [
          { day: 'Jan 15', amount: 250, slot: 'Morning 6-8 AM' },
          { day: 'Jan 17', amount: 300, slot: 'Evening 5-7 PM' },
          { day: 'Jan 19', amount: 350, slot: 'Morning 6-8 AM' },
          { day: 'Jan 21', amount: 350, slot: 'Evening 5-7 PM' },
          { day: 'Jan 22', amount: 400, slot: 'Morning 6-8 AM' },
        ],
      },
      {
        farmerId: 'F002',
        farmerName: 'Suresh Patil',
        priority: 'medium',
        required: 1260,
        allocated: 1180,
        satisfactionRate: 93.7,
        schedule: [
          { day: 'Jan 15', amount: 200, slot: 'Evening 5-7 PM' },
          { day: 'Jan 18', amount: 240, slot: 'Morning 6-8 AM' },
          { day: 'Jan 20', amount: 240, slot: 'Evening 5-7 PM' },
          { day: 'Jan 22', amount: 250, slot: 'Evening 5-7 PM' },
          { day: 'Jan 23', amount: 250, slot: 'Morning 6-8 AM' },
        ],
      },
      {
        farmerId: 'F003',
        farmerName: 'Mahesh Desai',
        priority: 'high',
        required: 2240,
        allocated: 2100,
        satisfactionRate: 93.8,
        schedule: [
          { day: 'Jan 16', amount: 350, slot: 'Morning 6-8 AM' },
          { day: 'Jan 18', amount: 350, slot: 'Evening 5-7 PM' },
          { day: 'Jan 20', amount: 400, slot: 'Morning 6-8 AM' },
          { day: 'Jan 22', amount: 500, slot: 'Morning 6-8 AM' },
          { day: 'Jan 23', amount: 500, slot: 'Evening 5-7 PM' },
        ],
      },
      {
        farmerId: 'F004',
        farmerName: 'Ganesh Bhosale',
        priority: 'low',
        required: 1050,
        allocated: 920,
        satisfactionRate: 87.6,
        schedule: [
          { day: 'Jan 17', amount: 180, slot: 'Morning 6-8 AM' },
          { day: 'Jan 19', amount: 200, slot: 'Evening 5-7 PM' },
          { day: 'Jan 21', amount: 180, slot: 'Morning 6-8 AM' },
          { day: 'Jan 23', amount: 180, slot: 'Evening 5-7 PM' },
          { day: 'Jan 24', amount: 180, slot: 'Morning 6-8 AM' },
        ],
      },
    ],
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return '#10b981';
    if (score >= 75) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <LinearGradient
          colors={[Theme.colors.primary, Theme.colors.secondary]}
          style={styles.header}
        >
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Feather name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Optimization Results</Text>
            <Text style={styles.headerSubtitle}>{inputData?.timeHorizon || 7}-day allocation plan</Text>
          </View>
        </LinearGradient>

        <View style={styles.content}>
          {/* Summary Cards */}
          <View style={styles.summaryGrid}>
            <View style={styles.summaryCard}>
              <View style={styles.summaryIcon}>
                <Feather name="droplet" size={24} color={Theme.colors.primary} />
              </View>
              <Text style={styles.summaryValue}>{results.totalAllocated.toLocaleString()} L</Text>
              <Text style={styles.summaryLabel}>Total Allocated</Text>
            </View>

            <View style={styles.summaryCard}>
              <View style={[styles.summaryIcon, { backgroundColor: '#dcfce7' }]}>
                <Feather name="trending-up" size={24} color="#10b981" />
              </View>
              <Text style={styles.summaryValue}>{results.efficiency}%</Text>
              <Text style={styles.summaryLabel}>Efficiency</Text>
            </View>

            <View style={styles.summaryCard}>
              <View style={[styles.summaryIcon, { backgroundColor: '#fef3c7' }]}>
                <Feather name="users" size={24} color="#f59e0b" />
              </View>
              <Text style={styles.summaryValue}>{results.allocations.length}</Text>
              <Text style={styles.summaryLabel}>Farmers</Text>
            </View>

            <View style={styles.summaryCard}>
              <View style={[styles.summaryIcon, { backgroundColor: '#dbeafe' }]}>
                <Feather name="check-circle" size={24} color="#3b82f6" />
              </View>
              <Text style={styles.summaryValue}>{results.fairnessScore}%</Text>
              <Text style={styles.summaryLabel}>Fairness Score</Text>
            </View>
          </View>

          {/* Water Balance */}
          <View style={styles.balanceCard}>
            <Text style={styles.sectionTitle}>💧 Water Balance</Text>
            
            <View style={styles.balanceItem}>
              <Text style={styles.balanceLabel}>Total Available</Text>
              <Text style={[styles.balanceValue, { color: Theme.colors.primary }]}>
                {results.totalAvailable.toLocaleString()} L
              </Text>
            </View>

            <View style={styles.balanceItem}>
              <Text style={styles.balanceLabel}>Total Required</Text>
              <Text style={[styles.balanceValue, { color: '#6b7280' }]}>
                {results.totalRequired.toLocaleString()} L
              </Text>
            </View>

            <View style={styles.balanceItem}>
              <Text style={styles.balanceLabel}>Total Allocated</Text>
              <Text style={[styles.balanceValue, { color: '#10b981' }]}>
                {results.totalAllocated.toLocaleString()} L
              </Text>
            </View>

            <View style={styles.balanceDivider} />

            <View style={styles.balanceItem}>
              <Text style={[styles.balanceLabel, { fontWeight: '600' }]}>Remaining Reserve</Text>
              <Text style={[styles.balanceValue, { color: Theme.colors.primary, fontWeight: 'bold' }]}>
                {(results.totalAvailable - results.totalAllocated).toLocaleString()} L
              </Text>
            </View>

            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${(results.totalAllocated / results.totalAvailable) * 100}%` }
                ]}
              />
            </View>
            <Text style={styles.progressLabel}>
              {((results.totalAllocated / results.totalAvailable) * 100).toFixed(1)}% of available water allocated
            </Text>
          </View>

          {/* Individual Allocations */}
          <View style={styles.allocationsSection}>
            <Text style={styles.sectionTitle}>👨‍🌾 Individual Allocations</Text>
            
            {results.allocations.map((allocation: any, index: number) => (
              <View key={allocation.farmerId} style={styles.allocationCard}>
                <View style={styles.allocationHeader}>
                  <View style={styles.allocationHeaderLeft}>
                    <Text style={styles.farmerName}>{allocation.farmerName}</Text>
                    <View style={[
                      styles.priorityBadge,
                      { backgroundColor: `${getPriorityColor(allocation.priority)}20` }
                    ]}>
                      <Text style={[styles.priorityText, { color: getPriorityColor(allocation.priority) }]}>
                        {allocation.priority.toUpperCase()} PRIORITY
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.farmerId}>#{allocation.farmerId}</Text>
                </View>

                <View style={styles.allocationStats}>
                  <View style={styles.allocationStat}>
                    <Text style={styles.statLabel}>Required</Text>
                    <Text style={styles.statValue}>{allocation.required} L</Text>
                  </View>
                  <View style={styles.allocationStat}>
                    <Text style={styles.statLabel}>Allocated</Text>
                    <Text style={[styles.statValue, { color: Theme.colors.primary }]}>
                      {allocation.allocated} L
                    </Text>
                  </View>
                  <View style={styles.allocationStat}>
                    <Text style={styles.statLabel}>Satisfaction</Text>
                    <Text style={[styles.statValue, { color: getScoreColor(allocation.satisfactionRate) }]}>
                      {allocation.satisfactionRate}%
                    </Text>
                  </View>
                </View>

                <View style={styles.schedulePreview}>
                  <Text style={styles.scheduleTitle}>Schedule ({allocation.schedule.length} slots)</Text>
                  {allocation.schedule.slice(0, 3).map((slot: any, idx: number) => (
                    <Text key={idx} style={styles.scheduleText}>
                      • {slot.day}: {slot.amount} L ({slot.slot})
                    </Text>
                  ))}
                  {allocation.schedule.length > 3 && (
                    <Text style={styles.scheduleMore}>
                      +{allocation.schedule.length - 3} more slots
                    </Text>
                  )}
                </View>
              </View>
            ))}
          </View>

          {/* Action Buttons */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => router.back()}
            >
              <Feather name="edit" size={18} color={Theme.colors.primary} />
              <Text style={styles.secondaryButtonText}>Adjust Parameters</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => {
                // TODO: Save allocation to database
                router.push('/admin');
              }}
            >
              <Feather name="check" size={18} color="#fff" />
              <Text style={styles.primaryButtonText}>Apply Allocation</Text>
            </TouchableOpacity>
          </View>
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
    padding: 20,
    paddingTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    marginRight: 16,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    marginTop: 4,
  },
  content: {
    padding: 16,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  summaryCard: {
    width: (width - 44) / 2,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  summaryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${Theme.colors.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Theme.colors.text,
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 13,
    color: Theme.colors.textSecondary,
  },
  balanceCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Theme.colors.text,
    marginBottom: 16,
  },
  balanceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  balanceLabel: {
    fontSize: 14,
    color: Theme.colors.textSecondary,
  },
  balanceValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  balanceDivider: {
    height: 1,
    backgroundColor: '#e5e5e5',
    marginVertical: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e5e5e5',
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: 16,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Theme.colors.primary,
  },
  progressLabel: {
    fontSize: 12,
    color: Theme.colors.textSecondary,
    textAlign: 'center',
  },
  allocationsSection: {
    marginBottom: 16,
  },
  allocationCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  allocationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  allocationHeaderLeft: {
    flex: 1,
  },
  farmerName: {
    fontSize: 16,
    fontWeight: '600',
    color: Theme.colors.text,
    marginBottom: 6,
  },
  priorityBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  priorityText: {
    fontSize: 11,
    fontWeight: '600',
  },
  farmerId: {
    fontSize: 12,
    color: Theme.colors.textSecondary,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  allocationStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
    marginBottom: 12,
  },
  allocationStat: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: Theme.colors.textSecondary,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Theme.colors.text,
  },
  schedulePreview: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
  },
  scheduleTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: Theme.colors.text,
    marginBottom: 8,
  },
  scheduleText: {
    fontSize: 12,
    color: Theme.colors.textSecondary,
    lineHeight: 18,
  },
  scheduleMore: {
    fontSize: 12,
    color: Theme.colors.primary,
    marginTop: 4,
    fontStyle: 'italic',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
    marginBottom: 24,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Theme.colors.primary,
    backgroundColor: '#fff',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Theme.colors.primary,
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    borderRadius: 12,
    backgroundColor: Theme.colors.primary,
    elevation: 4,
    shadowColor: Theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
