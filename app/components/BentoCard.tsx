import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Theme } from '../constants/JalSakhiTheme';

interface BentoCardProps {
    title?: string;
    children: React.ReactNode;
    colSpan?: 1 | 2;
    style?: ViewStyle;
}

export const BentoCard: React.FC<BentoCardProps> = ({ title, children, colSpan = 1, style }) => {
    return (
        <View
            style={[
                styles.card,
                colSpan === 2 && styles.fullWidth,
                style
            ]}
        >
            {title && <Text style={styles.title}>{title}</Text>}
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        borderRadius: 24,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(6, 78, 59, 0.08)',
        ...Theme.shadows.soft,
        flex: 1,
        marginHorizontal: 0,
    },
    fullWidth: {
        width: '100%',
    },
    title: {
        fontSize: 12,
        fontWeight: '700',
        color: Theme.colors.textMuted,
        textTransform: 'uppercase',
        letterSpacing: 0.6,
        marginBottom: 10,
    },
    content: {
        flex: 1,
    },
});
