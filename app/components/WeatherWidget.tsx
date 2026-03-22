import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { WeatherService, WeatherData } from '../services/weather';

interface WeatherWidgetProps {
    style?: any;
    compact?: boolean;
    light?: boolean;
}

export const WeatherWidget = ({ style, compact = false, light = false }: WeatherWidgetProps) => {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadWeather();
    }, []);

    const loadWeather = async () => {
        setLoading(true);
        const coords = await WeatherService.getLocation();
        if (coords) {
            const data = await WeatherService.getCurrentWeather(coords.lat, coords.lon);
            if (data) {
                setWeather(data);
            }
        }
        setLoading(false);
    };

    const displayWeather = weather || {
        temp: 28,
        condition: 'Partly Cloudy',
        city: 'Rampur Village',
        icon: '02d'
    };

    const Content = () => (
        <>
            <View style={[styles.header, compact && styles.headerCompact]}>
                <View style={compact ? styles.infoCompact : undefined}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: compact ? 0 : 4 }}>
                        <Ionicons name="location-sharp" size={12} color={light ? "rgba(6, 78, 59, 0.7)" : "rgba(255,255,255,0.8)"} />
                        <Text style={[styles.location, light && { color: "rgba(6, 78, 59, 0.7)" }]}>
                            {compact && displayWeather.city.length > 10
                                ? displayWeather.city.substring(0, 10) + '...'
                                : displayWeather.city}
                        </Text>
                    </View>
                    <Text style={[styles.temp, compact && styles.tempCompact, light && { color: "#064e3b" }]}>
                        {displayWeather.temp}°C
                    </Text>
                    <Text style={[styles.condition, compact && styles.conditionCompact, light && { color: "rgba(6, 78, 59, 0.8)" }]}>
                        {displayWeather.condition}
                    </Text>
                </View>
                <Feather
                    name={getIconName(displayWeather.condition)}
                    size={compact ? 40 : 48}
                    color={light ? "#064e3b" : "rgba(255,255,255,0.9)"}
                />
            </View>

            {!compact && (
                <View style={styles.forecastRow}>
                    <View style={styles.forecastItem}>
                        <Text style={styles.day}>Today</Text>
                        <Ionicons name="sunny" size={16} color="#fbbf24" />
                        <Text style={styles.forecastTemp}>{displayWeather.temp}°</Text>
                    </View>
                    <View style={styles.forecastItem}>
                        <Text style={styles.day}>Tom</Text>
                        <Ionicons name="partly-sunny" size={16} color="white" />
                        <Text style={styles.forecastTemp}>{displayWeather.temp - 1}°</Text>
                    </View>
                    <View style={styles.forecastItem}>
                        <Text style={styles.day}>Wed</Text>
                        <Ionicons name="cloud" size={16} color="white" />
                        <Text style={styles.forecastTemp}>{displayWeather.temp - 2}°</Text>
                    </View>
                </View>
            )}
        </>
    );

    if (light) {
        return (
            <View style={[styles.containerLight, compact && styles.containerCompact, style]}>
                {loading && !weather ? (
                    <ActivityIndicator color="#064e3b" />
                ) : (
                    <Content />
                )}
            </View>
        );
    }

    return (
        <LinearGradient
            colors={['#0ea5e9', '#0284c7']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.container, compact && styles.containerCompact, style]}
        >
            {loading && !weather ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator color="white" />
                    <Text style={{ color: 'white', marginTop: 8, fontSize: 12 }}>Loading Weather...</Text>
                </View>
            ) : (
                <Content />
            )}
        </LinearGradient>
    );
};

// Helper to map condition string to Icon name
const getIconName = (condition: string): any => {
    const lower = condition.toLowerCase();
    if (lower.includes('clear')) return 'sun';
    if (lower.includes('cloud')) return 'cloud';
    if (lower.includes('rain')) return 'cloud-rain';
    if (lower.includes('snow')) return 'cloud-snow';
    if (lower.includes('thunder')) return 'cloud-lightning';
    if (lower.includes('drizzle')) return 'cloud-drizzle';
    return 'cloud';
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 20,
        padding: 20,
        marginBottom: 16,
    },
    containerLight: {
        borderRadius: 20,
        padding: 20,
        backgroundColor: 'transparent',
    },
    containerCompact: {
        padding: 16,
        justifyContent: 'center',
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    headerCompact: {
        marginBottom: 0,
    },
    infoCompact: {
        justifyContent: 'center',
    },
    location: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 12,
        fontWeight: '600',
    },
    temp: {
        color: '#FFFFFF',
        fontSize: 36,
        fontWeight: '800',
        lineHeight: 40,
    },
    tempCompact: {
        fontSize: 32,
        lineHeight: 36,
        marginVertical: 4,
    },
    condition: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '500',
    },
    conditionCompact: {
        fontSize: 12,
    },
    forecastRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: 12,
        padding: 12,
        marginTop: 'auto'
    },
    forecastItem: {
        alignItems: 'center',
        gap: 6,
    },
    day: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 11,
        fontWeight: '600',
    },
    forecastTemp: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: '700',
    },
});
