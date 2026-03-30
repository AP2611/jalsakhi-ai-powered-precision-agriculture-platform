import React from 'react';
import { StyleSheet, View, Text, Pressable, StatusBar, Dimensions } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Theme } from '../../constants/JalSakhiTheme';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenWrapper } from '../../components/shared/ScreenWrapper';

const screenWidth = Dimensions.get('window').width;

export default function UsageHistoryScreen() {
  const router = useRouter();

  return (
    <ScreenWrapper>
      <StatusBar barStyle="dark-content" />
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.header}>
        <Pressable 
          onPress={() => router.back()} 
          style={({ pressed }) => [styles.backBtn, { opacity: pressed ? 0.7 : 1 }]}
        >
          <BlurView intensity={60} tint="light" style={styles.backBlur}>
            <Feather name="chevron-left" size={28} color={Theme.colors.forest} />
          </BlurView>
        </Pressable>
        <View style={styles.headerTextContainer}>
          <Text style={styles.title}>History</Text>
          <Text style={styles.subtitle}>Detailed historical analytics</Text>
        </View>
      </View>

      <View style={styles.content}>
        <BlurView intensity={80} tint="light" style={styles.premiumPlaceholder}>
          <LinearGradient
            colors={['rgba(16, 185, 129, 0.1)', 'rgba(5, 150, 105, 0.05)']}
            style={styles.placeholderIcon}
          >
            <MaterialCommunityIcons name="chart-bell-curve-cumulative" size={80} color={Theme.colors.forest} />
          </LinearGradient>
          
          <Text style={styles.placeholderTitle}>Usage Analytics</Text>
          <Text style={styles.placeholderText}>
            Comprehensive water usage patterns, irrigation historical data, and cost-saving reports are being prepared for your personalized farm analytics dashboard.
          </Text>

          <Pressable 
            style={({ pressed }) => [styles.notifyBtn, { transform: [{ scale: pressed ? 0.98 : 1 }] }]} 
            onPress={() => router.back()}
          >
            <LinearGradient colors={['#10b981', '#059669']} style={styles.notifGradient}>
              <Text style={styles.btnText}>Return to Dashboard</Text>
            </LinearGradient>
          </Pressable>
        </BlurView>
      </View>
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
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    marginTop: -40,
  },
  premiumPlaceholder: {
    padding: 40,
    borderRadius: 32,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    borderWidth: 1,
    borderColor: 'rgba(6, 78, 59, 0.08)',
    ...Theme.shadows.soft,
  },
  placeholderIcon: {
    width: 140,
    height: 140,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  placeholderTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: Theme.colors.forest,
    marginBottom: 16,
    textAlign: 'center',
  },
  placeholderText: {
    fontSize: 15,
    color: 'rgba(6, 78, 59, 0.6)',
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '600',
    marginBottom: 8,
  },
  notifyBtn: {
    marginTop: 40,
    borderRadius: 20,
    overflow: 'hidden',
    width: '100%',
    ...Theme.shadows.soft,
  },
  notifGradient: {
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  backBtn: {},
});
