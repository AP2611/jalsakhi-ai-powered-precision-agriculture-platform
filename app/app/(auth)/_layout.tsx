import React from 'react';
import { Stack } from 'expo-router';

export default function AuthLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                animation: 'fade',
                gestureEnabled: false,
            }}
        >
            <Stack.Screen name="index" />
            <Stack.Screen name="role" />
            <Stack.Screen name="language" />
            <Stack.Screen name="admin-signup" />
            <Stack.Screen name="farmer-signup" />
            <Stack.Screen name="login" />
            <Stack.Screen name="otp" />
        </Stack>
    );
}
