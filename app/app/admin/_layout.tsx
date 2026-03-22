import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

export default function AdminLayout() {
    const { t } = useTranslation();
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: '#FFFFFF',
                tabBarInactiveTintColor: '#a7f3d0', // Light green for inactive
                tabBarStyle: {
                    backgroundColor: '#166534', // Hardcoded primary color to ensure visibility
                    borderTopWidth: 0,
                    elevation: 8,
                    height: 60,
                    paddingBottom: 8,
                    paddingTop: 8,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '600',
                },
            }}
        >
            <Tabs.Screen name="index" options={{ href: null }} />
            <Tabs.Screen
                name="dashboard"
                options={{
                    title: t('common.home'),
                    tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="farmers-list"
                options={{
                    title: t('admin.farmers'),
                    tabBarIcon: ({ color }) => <Ionicons name="people" size={24} color={color} />,
                }}
            />
            {/* Hide other screens from the tab bar but keep them in the stack/tabs context if needed, 
                though typically non-tab screens should be in a separate stack or hidden here */}
            <Tabs.Screen name="anomalies" options={{ href: null }} />
            <Tabs.Screen name="approvals" options={{ href: null }} />
            <Tabs.Screen name="water-allocation-optimization" options={{ href: null }} />
            <Tabs.Screen name="water-status" options={{ href: null }} />
            <Tabs.Screen name="wastage-reports" options={{ href: null }} />
            <Tabs.Screen name="water-sources" options={{ href: null }} />
            <Tabs.Screen name="analytics" options={{ href: null }} />
            <Tabs.Screen name="allocation" options={{ href: null }} />
            <Tabs.Screen name="simulation" options={{ href: null }} />
            <Tabs.Screen name="recommendations" options={{ href: null }} />
            <Tabs.Screen name="farmer-details" options={{ href: null }} />
        </Tabs>
    );
}
