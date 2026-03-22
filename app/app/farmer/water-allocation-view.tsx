import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, StatusBar, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Theme } from '../../constants/JalSakhiTheme';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { MLService } from '../../services/ml';
import { Logger } from '../../utils/Logger';
import { useApp } from '../../context/AppContext';

const screenWidth = Dimensions.get('window').width;

export default function WaterAllocationView() {
  const router = useRouter();
  const { farms, loadFarms, farmsLoading } = useApp();
  const [loading, setLoading] = useState(true);
  const [allocation, setAllocation] = useState<any>(null);

  useEffect(() => {
    initFetch();
  }, []);

  const initFetch = async () => {
    setLoading(true);
    await loadFarms();
    await fetchAllocation();
    setLoading(false);
  };

  const fetchAllocation = async () => {
    try {
      // 1. Get real farms from AppContext
      // If no farms, we stop and show empty state
      if (farms.length === 0) {
        setAllocation(null);
        return;
      }

      // 2. Map user farms to AI payload
      const mappedUserFarms = farms.map(f => ({
        id: f.id,
        area_acre: parseFloat(f.size) || 1.0,
        crop_type: (f.crop || 'RICE').toUpperCase(),
        soil_type: 'DRY', // Defaults for allocation context
        region: 'SEMI ARID',
        priority_score: 2
      }));

      // 3. Add village simulations (neighbors) for context
      const villageFarms = [
        ...mappedUserFarms,
        { id: 'N-01', area_acre: 1.5, crop_type: 'MAIZE', soil_type: 'WET', region: 'SEMI ARID', priority_score: 1 },
        { id: 'N-02', area_acre: 3.0, crop_type: 'WHEAT', soil_type: 'HUMID', region: 'HUMID', priority_score: 2 },
      ];

      const availableWater = 1000 * villageFarms.length * 5; // Scaled total water

      const result = await MLService.optimizeAllocation(availableWater, villageFarms);

      if (result) {
        // Map AI result to UI state
        // We take the first farm as the "primary" focus for the summary tiles
        const firstFarmId = farms[0].id;
        const myFarmReport = result.per_farm_report.find((r: any) => r.farm_id === firstFarmId);
        const myFarmAlloc = result.allocations.find((a: any) => a.farm_id === firstFarmId);

        setAllocation({
          farmerId: firstFarmId,
          farmerName: farms[0].name,
          village: 'Khadki Unit',
          totalLand: farms.reduce((acc, f) => acc + (parseFloat(f.size) || 0), 0),
          currentAllocation: {
            amount: myFarmReport?.allocated_liters || 0,
            demand: myFarmReport?.demand_liters || 0,
            validFrom: new Date().toLocaleDateString(),
            validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
            status: myFarmReport?.status === 'met' ? 'active' : 'deficit',
            share: myFarmAlloc?.share_percent || 0
          },
          efficiency: result.village_efficiency_score,
          totalVillageDemand: result.total_demand_liters,
          totalVillageAllocated: result.total_allocated_liters,
          report: result.per_farm_report,
          priority: 'standard',
          lastUpdated: new Date().toISOString(),
        });
      }
    } catch (error) {
      Logger.error('WaterAllocation', 'Fetch failed', error);
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

  if (loading || farmsLoading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={Theme.colors.primary} />
      </View>
    );
  }

  // Handle Empty State: No farms registered
  if (!allocation && farms.length === 0) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <BlurView intensity={60} tint="light" style={styles.backBlur}>
                <Feather name="chevron-left" size={24} color={Theme.colors.text} />
              </BlurView>
            </TouchableOpacity>
            <View style={styles.headerTextContainer}>
              <Text style={styles.title}>Allocation Report</Text>
              <Text style={styles.subtitle}>Action Required</Text>
            </View>
          </View>

          <View style={[styles.center, { flex: 1, paddingHorizontal: 32 }]}>
            <LinearGradient
              colors={['#f0fdf4', '#ffffff']}
              style={styles.emptyStateCard}
            >
              <View style={styles.emptyIconBox}>
                <MaterialCommunityIcons name="sprout-outline" size={48} color={Theme.colors.primary} />
              </View>
              <Text style={styles.emptyTitle}>No Farms Found</Text>
              <Text style={styles.emptyDesc}>
                We need your farm details to calculate your water allocation from the village reservoir.
              </Text>
              <TouchableOpacity
                style={styles.emptyBtn}
                onPress={() => router.push('/farmer/my-farms-add-edit')}
              >
                <LinearGradient
                  colors={['#10b981', '#059669']}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                  style={styles.emptyBtnGradient}
                >
                  <Feather name="plus" size={20} color="white" />
                  <Text style={styles.emptyBtnText}>Register Your Farm</Text>
                </LinearGradient>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  if (!allocation) {
    return (
      <View style={[styles.container, styles.center]}>
        <MaterialCommunityIcons name="alert-circle-outline" size={48} color="#ef4444" />
        <Text style={{ marginTop: 10, color: Theme.colors.textMuted }}>Failed to load allocation data.</Text>
        <TouchableOpacity onPress={initFetch} style={{ marginTop: 20 }}>
          <Text style={{ color: Theme.colors.primary, fontWeight: '700' }}>RETRY</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Decorative Layer */}
      <View style={styles.decorativeLayer} pointerEvents="none">
        <View style={[styles.designLine, { top: '20%', left: -60, transform: [{ rotate: '30deg' }] }]} />
        <View style={[styles.designLine, { bottom: '15%', right: -40, width: 250, transform: [{ rotate: '-45deg' }] }]} />
      </View>

      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <BlurView intensity={60} tint="light" style={styles.backBlur}>
              <Feather name="chevron-left" size={24} color={Theme.colors.text} />
            </BlurView>
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.title}>Allocation Report</Text>
            <Text style={styles.subtitle}>Village Optimization Status</Text>
          </View>
          <View style={styles.reportBadge}>
            <Text style={styles.reportBadgeText}>FINALIZED</Text>
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Bento Grid */}
          <View style={styles.bentoGrid}>

            {/* Main Level Tile */}
            <GlassCard style={styles.fullWidth} intensity={40}>
              <View style={styles.mainAllocationRow}>
                <View>
                  <Text style={styles.miniLabel}>Assigned Quota</Text>
                  <Text style={styles.mainValue}>{Math.round(allocation.currentAllocation.amount).toLocaleString()} L</Text>
                </View>
                <LinearGradient colors={['#10b981', '#059669']} style={styles.dropletIcon}>
                  <MaterialCommunityIcons name="water-check" size={28} color="white" />
                </LinearGradient>
              </View>
              <View style={styles.statusBadgeRow}>
                <View style={[styles.badge, { backgroundColor: allocation.currentAllocation.status === 'active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)' }]}>
                  <Text style={[styles.badgeText, { color: allocation.currentAllocation.status === 'active' ? '#059669' : '#ef4444' }]}>
                    {allocation.currentAllocation.status === 'active' ? 'FULLY MET' : 'DEFICIT'}
                  </Text>
                </View>
                <Text style={styles.dateRange}>
                  Cycle: {allocation.currentAllocation.validFrom} - {allocation.currentAllocation.validUntil}
                </Text>
              </View>
            </GlassCard>

            {/* Side-by-Side Status */}
            <View style={styles.row}>
              <GlassCard title="Village Priority" icon="shield-check" style={styles.halfWidth}>
                <Text style={[styles.priorityText, { color: allocation.priority === 'high' ? Theme.colors.primary : '#f59e0b', fontSize: 20 }]}>
                  {allocation.priority.toUpperCase()}
                </Text>
              </GlassCard>
              <GlassCard title="Registered Area" icon="map-marker-radius" style={styles.halfWidth}>
                <Text style={[styles.landText, { fontSize: 20 }]}>{allocation.totalLand} Acres</Text>
              </GlassCard>
            </View>

            {/* Reservoir Progress */}
            <GlassCard title="Village Optimization" icon="chart-donut" style={styles.fullWidth}>
              <View style={styles.reservoirContainer}>
                <View style={styles.reservoirMeta}>
                  <Text style={styles.resPercent}>{allocation.efficiency || 0}%</Text>
                  <Text style={styles.resVolume}>
                    Allocated: {Math.round(allocation.totalVillageAllocated).toLocaleString()} / {Math.round(allocation.totalVillageDemand).toLocaleString()} L (Demand)
                  </Text>
                </View>
                <View style={styles.progressBg}>
                  <LinearGradient
                    colors={['#10b981', '#3b82f6']}
                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                    style={[styles.progressFill, { width: `${Math.min(100, allocation.efficiency || 0)}%` }]}
                  />
                </View>
                <Text style={styles.resSubText}>AI-calculated efficiency score for fair water distribution across the village.</Text>
              </View>
            </GlassCard>

            {/* Farm Report Section */}
            <View style={{ marginTop: 8 }}>
              <Text style={styles.sectionHeader}>Full Village Allocation Summary</Text>
              {(allocation.report || []).map((item: any, idx: number) => {
                const isUserFarm = farms.some(f => f.id === item.farm_id);
                const farmName = isUserFarm
                  ? (farms.find(f => f.id === item.farm_id)?.name || 'My Farm')
                  : `Village Unit ${item.farm_id.startsWith('N-') ? item.farm_id.split('-')[1] : item.farm_id}`;

                return (
                  <GlassCard
                    key={idx}
                    style={[styles.scheduleItem, { marginBottom: 12 }]}
                    intensity={isUserFarm ? 40 : 15}
                  >
                    <View style={styles.scheduleRow}>
                      <View style={[styles.scheduleStatus, { backgroundColor: item.status === 'met' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)' }]}>
                        <MaterialCommunityIcons
                          name={item.status === 'met' ? 'check-circle' : 'alert-circle'}
                          size={22}
                          color={item.status === 'met' ? '#059669' : '#ef4444'}
                        />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.scheduleDate, isUserFarm && { color: Theme.colors.primary }]}>
                          {item.farm_id === allocation.farmerId ? 'Primary Farm' : farmName}
                        </Text>
                        <Text style={styles.scheduleSlot}>Units: {Math.round(item.demand_liters).toLocaleString()} L Required</Text>
                      </View>
                      <View style={styles.amountBox}>
                        <Text style={styles.itemAmount}>{Math.round(item.allocated_liters).toLocaleString()} L</Text>
                        <Text style={[styles.itemStatus, { color: item.status === 'met' ? '#059669' : '#ef4444' }]}>
                          {item.status === 'met' ? 'OPTIMAL' : 'DEFICIT'}
                        </Text>
                      </View>
                    </View>
                  </GlassCard>
                );
              })}
            </View>

          </View>
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
  center: {
    justifyContent: 'center',
    alignItems: 'center',
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
  reportBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  reportBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#2563eb',
    letterSpacing: 0.5,
  },
  emptyStateCard: {
    width: '100%',
    borderRadius: 32,
    padding: 32,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  emptyIconBox: {
    width: 80,
    height: 80,
    borderRadius: 30,
    backgroundColor: '#f0fdf4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: Theme.colors.text,
    marginBottom: 12,
  },
  emptyDesc: {
    fontSize: 15,
    color: Theme.colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  emptyBtn: {
    width: '100%',
    borderRadius: 18,
    overflow: 'hidden',
  },
  emptyBtnGradient: {
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  emptyBtnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '800',
  },
  refreshBtn: {
    padding: 10,
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
  halfWidth: {
    flex: 1,
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
    gap: 8,
    marginBottom: 12,
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
  miniLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: 'rgba(6, 78, 59, 0.7)',
    marginBottom: 4,
  },
  mainAllocationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  mainValue: {
    fontSize: 36,
    fontWeight: '900',
    color: '#064e3b',
  },
  dropletIcon: {
    width: 52,
    height: 52,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '900',
  },
  dateRange: {
    fontSize: 13,
    fontWeight: '600',
    color: Theme.colors.textMuted,
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  priorityText: {
    fontSize: 22,
    fontWeight: '900',
  },
  landText: {
    fontSize: 22,
    fontWeight: '900',
    color: Theme.colors.text,
  },
  reservoirContainer: {
    marginTop: 4,
  },
  reservoirMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 10,
  },
  resPercent: {
    fontSize: 28,
    fontWeight: '900',
    color: '#064e3b',
  },
  resVolume: {
    fontSize: 11,
    fontWeight: '600',
    color: Theme.colors.textMuted,
  },
  progressBg: {
    height: 10,
    backgroundColor: '#E2E8F0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 5,
  },
  resSubText: {
    fontSize: 12,
    color: Theme.colors.textMuted,
    marginTop: 10,
    fontStyle: 'italic',
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '800',
    color: Theme.colors.text,
    marginBottom: 16,
    marginLeft: 4,
  },
  scheduleItem: {
    padding: 0,
  },
  scheduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  scheduleStatus: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scheduleDate: {
    fontSize: 15,
    fontWeight: '700',
    color: Theme.colors.text,
  },
  scheduleSlot: {
    fontSize: 12,
    color: Theme.colors.textMuted,
    marginTop: 2,
  },
  amountBox: {
    alignItems: 'flex-end',
  },
  itemAmount: {
    fontSize: 16,
    fontWeight: '900',
    color: Theme.colors.primary,
  },
  itemStatus: {
    fontSize: 10,
    fontWeight: '800',
    color: Theme.colors.textMuted,
    textTransform: 'uppercase',
    marginTop: 2,
  }
});
