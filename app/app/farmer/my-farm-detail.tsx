import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, FlatList, StatusBar, Dimensions, ActivityIndicator } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Theme } from '../../constants/JalSakhiTheme';
import { Farm, IrrigationLog } from '../../services/farms';
import { useApp } from '../../context/AppContext';
import { Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const screenWidth = Dimensions.get('window').width;

export default function MyFarmDetail() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const id = params.id as string;
  const { t } = useTranslation();
  const { getFarm, deleteFarm, irrigationLogs, loadIrrigationLogs } = useApp();

  const [farm, setFarm] = useState<Farm | null>(null);

  useEffect(() => {
    (async () => {
      if (id) {
        const f = await getFarm(id);
        if (f) {
          setFarm(f);
          await loadIrrigationLogs(id);
        }
      }
    })();
  }, [id]);

  const logs = irrigationLogs[id] || [];

  const handleEdit = () => router.push({ pathname: '/farmer/my-farms-add-edit', params: { id } } as any);

  const handleDelete = async () => {
    Alert.alert(t('common.confirm'), t('farms.confirmDelete'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.delete'), style: 'destructive', onPress: async () => {
          await deleteFarm(id);
          router.replace('/farmer/my-farms');
        }
      }
    ]);
  };

  const handleLog = () => router.push({ pathname: '/farmer/log-irrigation', params: { farmId: id } } as any);

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

  if (!farm) return (
    <View style={[styles.container, styles.center]}><ActivityIndicator color={Theme.colors.primary} /></View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Stack.Screen options={{ headerShown: false }} />

      {/* Decorative Patterns */}
      <View style={styles.decorativeLayer} pointerEvents="none">
        <View style={[styles.designLine, { top: '10%', right: -40, transform: [{ rotate: '-45deg' }] }]} />
        <View style={[styles.designLine, { bottom: '30%', left: -60, width: 250, transform: [{ rotate: '30deg' }] }]} />
      </View>

      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.topHeader}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <BlurView intensity={60} tint="light" style={styles.backBlur}>
              <Feather name="chevron-left" size={24} color={Theme.colors.text} />
            </BlurView>
          </TouchableOpacity>
          <View style={styles.headerTitles}>
            <Text style={styles.title}>{farm.name}</Text>
            <Text style={styles.subtitle}>Farm Health & Logs</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={handleEdit} style={styles.miniActionBtn}>
              <Feather name="edit-3" size={18} color={Theme.colors.text} />
            </TouchableOpacity>
          </View>
        </View>

        <FlatList
          data={logs}
          keyExtractor={(item, idx) => item.id ?? String(idx)}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={styles.bentoGrid}>

              {/* Profile Card */}
              <GlassCard style={styles.fullWidth} intensity={40}>
                <View style={styles.mainInfoRow}>
                  <View>
                    <Text style={styles.miniLabel}>{t('farms.status')}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: farm.status === 'Optimal' ? '#dcfce7' : '#fee2e2' }]}>
                      <Text style={[styles.statusText, { color: farm.status === 'Optimal' ? '#166534' : '#991b1b' }]}>
                        {farm.status ? t(`farms.${farm.status.toLowerCase()}`, { defaultValue: farm.status }) : t('farms.unknown')}
                      </Text>
                    </View>
                  </View>
                  <LinearGradient colors={['#10b981', '#059669']} style={styles.sproutIcon}>
                    <MaterialCommunityIcons name="sprout" size={28} color="white" />
                  </LinearGradient>
                </View>

                <View style={styles.infoRow}>
                  <View style={styles.infoBlock}>
                    <Text style={styles.miniLabel}>{t('farms.crop')}</Text>
                    <Text style={styles.infoValue}>{farm.crop}</Text>
                  </View>
                  <View style={styles.infoBlock}>
                    <Text style={styles.miniLabel}>{t('farms.size')}</Text>
                    <Text style={styles.infoValue}>{farm.size} Ac</Text>
                  </View>
                </View>
              </GlassCard>

              {/* Action Tile */}
              <TouchableOpacity onPress={handleLog} activeOpacity={0.9} style={styles.fullWidth}>
                <LinearGradient colors={['#3b82f6', '#2563eb']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.logTile}>
                  <View style={styles.logTileContent}>
                    <View>
                      <Text style={styles.logTileTitle}>{t('irrigation.logManual')}</Text>
                      <Text style={styles.logTileSub}>Last irrigation: {logs.length > 0 ? new Date(logs[0].date).toLocaleDateString() : 'None'}</Text>
                    </View>
                    <View style={styles.logPlusBox}>
                      <Feather name="plus" size={24} color="#2563eb" />
                    </View>
                  </View>
                </LinearGradient>
              </TouchableOpacity>

              <Text style={styles.sectionHeader}>{t('irrigation.history')}</Text>
            </View>
          }
          renderItem={({ item, index }) => (
            <GlassCard style={[styles.logCard, { marginBottom: 12 }]} intensity={index === 0 ? 30 : 15}>
              <View style={styles.logRow}>
                <View style={[styles.logIcon, { backgroundColor: '#F1F5F9' }]}>
                  <Feather name="droplet" size={18} color={Theme.colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.logDate}>{new Date(item.date).toLocaleDateString()} at {new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                  {item.notes && <Text style={styles.logNotes}>{item.notes}</Text>}
                </View>
                <Text style={styles.logAmount}>{item.amount}L</Text>
              </View>
            </GlassCard>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <BlurView intensity={20} tint="light" style={styles.emptyBlur}>
                <Feather name="calendar" size={48} color={Theme.colors.textMuted} />
                <Text style={styles.emptyText}>{t('irrigation.noLogs')}</Text>
              </BlurView>
            </View>
          }
          ListFooterComponent={
            <TouchableOpacity onPress={handleDelete} style={styles.deleteBtn}>
              <Text style={styles.deleteBtnText}>Unregister Farm</Text>
            </TouchableOpacity>
          }
        />
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
  topHeader: {
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
  backBlur: {},
  headerTitles: {
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
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  miniActionBtn: {
    padding: 10,
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
  mainInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  miniLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Theme.colors.textMuted,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '900',
  },
  sproutIcon: {
    width: 52,
    height: 52,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    gap: 40,
  },
  infoBlock: {
    flex: 1,
  },
  infoValue: {
    fontSize: 18,
    fontWeight: '800',
    color: Theme.colors.text,
  },
  logTile: {
    borderRadius: 24,
    padding: 20,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  logTileContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logTileTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: 'white',
  },
  logTileSub: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  logPlusBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '800',
    color: Theme.colors.text,
    marginTop: 10,
    marginBottom: 16,
    marginLeft: 4,
  },
  logCard: {
    padding: 0,
  },
  logRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  logIcon: {
    width: 40,
    height: 40,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logDate: {
    fontSize: 14,
    fontWeight: '700',
    color: Theme.colors.text,
  },
  logNotes: {
    fontSize: 12,
    color: Theme.colors.textMuted,
    marginTop: 2,
  },
  logAmount: {
    fontSize: 16,
    fontWeight: '900',
    color: Theme.colors.primary,
  },
  emptyContainer: {
    paddingTop: 40,
    alignItems: 'center',
  },
  emptyBlur: {
    padding: 40,
    borderRadius: 32,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    width: screenWidth - 80,
  },
  emptyText: {
    fontSize: 14,
    color: Theme.colors.textMuted,
    fontWeight: '700',
    marginTop: 12,
  },
  deleteBtn: {
    marginTop: 40,
    alignItems: 'center',
    marginBottom: 20,
  },
  deleteBtnText: {
    color: '#ef4444',
    fontSize: 14,
    fontWeight: '700',
    textDecorationLine: 'underline',
  }
});
