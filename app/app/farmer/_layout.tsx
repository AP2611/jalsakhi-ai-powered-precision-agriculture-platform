import React from 'react';
import { Tabs, useRouter, usePathname } from 'expo-router';
import { Theme } from '../../constants/JalSakhiTheme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View, TouchableOpacity, Text, StyleSheet, Dimensions, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

const screenWidth = Dimensions.get('window').width;

export default function FarmerLayout() {
    const router = useRouter();
    const pathname = usePathname();
    const hideBar = pathname?.includes('/chatbot') || pathname?.includes('/prediction-results');

    return (
        <View style={{ flex: 1 }}>
            <Tabs
                screenOptions={{
                    headerShown: false,
                    tabBarStyle: { display: 'none' },
                }}
            >
                <Tabs.Screen name="dashboard" />
                <Tabs.Screen name="my-farms" />
            </Tabs>

            {/* Custom Premium Glass Bottom Bar */}
            {!hideBar && (
                <View style={styles.bottomBarContainer} pointerEvents="box-none">
                    <BlurView intensity={80} tint="light" style={styles.glassBar}>
                        <View style={styles.barMain}>
                            <TabItem
                                icon={pathname.includes('/dashboard') ? "home-variant" : "home-variant-outline"}
                                label="Home"
                                active={pathname.includes('/dashboard')}
                                onPress={() => router.push('/farmer/dashboard')}
                            />
                            <TabItem
                                icon={pathname.includes('/my-farms') ? "sprout" : "sprout-outline"}
                                label="Farms"
                                active={pathname.includes('/my-farms')}
                                onPress={() => router.push('/farmer/my-farms')}
                            />

                            <TabItem
                                icon="robot-outline"
                                label="FarmAI"
                                active={pathname.includes('/chatbot')}
                                onPress={() => router.push('/farmer/chatbot')}
                            />

                            <TabItem
                                icon={pathname.includes('/notifications') ? "bell" : "bell-outline"}
                                label="Alerts"
                                active={pathname.includes('/notifications')}
                                onPress={() => router.push('/notifications')}
                            />
                            <TabItem
                                icon={pathname.includes('/profile') ? "account" : "account-outline"}
                                label="Profile"
                                active={pathname.includes('/profile')}
                                onPress={() => router.push('/profile')}
                            />
                        </View>
                    </BlurView>
                </View>
            )}
        </View>
    );
}

const TabItem = ({ icon, label, active, onPress }: any) => (
    <TouchableOpacity style={styles.tabBtn} onPress={onPress} activeOpacity={0.7}>
        <View style={[styles.iconWrapper, active && styles.activeIconWrapper]}>
            <MaterialCommunityIcons
                name={icon}
                size={22}
                color={active ? Theme.colors.primary : '#64748b'}
            />
        </View>
        <Text style={[styles.tabLabel, active && styles.activeTabLabel]}>{label}</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    bottomBarContainer: {
        position: 'absolute',
        bottom: Platform.OS === 'ios' ? 24 : 16,
        left: 0,
        right: 0,
        height: 85,
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingHorizontal: 16,
    },
    glassBar: {
        width: '100%',
        height: 70,
        borderRadius: 25,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderWidth: 1.5,
        borderColor: '#E2E8F0',
        overflow: 'hidden',
    },
    barMain: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingHorizontal: 8,
    },
    tabBtn: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 60,
    },
    iconWrapper: {
        width: 32,
        height: 32,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 2,
    },
    activeIconWrapper: {
        backgroundColor: 'rgba(16, 185, 129, 0.08)',
    },
    tabLabel: {
        fontSize: 10,
        fontWeight: '700',
        color: '#94a3b8',
    },
    activeTabLabel: {
        color: Theme.colors.primary,
    },
});
