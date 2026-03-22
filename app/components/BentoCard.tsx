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
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        shadowColor: Theme.colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
        flex: 1, // Allow flex grow
        marginHorizontal: 6, // Gutter
    },
    fullWidth: {
        width: '100%',
        marginHorizontal: 0,
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
