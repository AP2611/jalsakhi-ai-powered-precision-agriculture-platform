import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Theme } from '../constants/JalSakhiTheme';
import { Feather } from '@expo/vector-icons';

interface StatsWidgetProps {
    label: string;
    value: string;
    icon?: keyof typeof Feather.glyphMap;
    trend?: string;
    trendType?: 'up' | 'down' | 'neutral';
    color?: string;
}

export const StatsWidget: React.FC<StatsWidgetProps> = ({ label, value, icon, trend, trendType = 'neutral', color = Theme.colors.primary }) => {
    return (
        <View style={styles.container}>
            <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
                {icon && <Feather name={icon} size={18} color={color} />}
            </View>
            <View>
                <Text style={styles.label}>{label}</Text>
                <Text style={[styles.value, { color: color }]}>{value}</Text>
                {trend && (
                    <Text style={[
                        styles.trend,
                        trendType === 'up' && styles.trendUp,
                        trendType === 'down' && styles.trendDown
                    ]}>
                        {trend}
                    </Text>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    label: {
        fontSize: 11,
        color: Theme.colors.textMuted,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.4,
    },
    value: {
        fontSize: 20,
        fontWeight: '800',
        marginTop: 2,
    },
    trend: {
        fontSize: 10,
        marginTop: 2,
        fontWeight: '600',
    },
    trendUp: {
        color: Theme.colors.success,
    },
    trendDown: {
        color: Theme.colors.error,
    },
});
