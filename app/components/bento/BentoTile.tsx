import React from 'react';
import { StyleSheet, View, Text, Pressable, ViewStyle } from 'react-native';
import { Theme } from '../../constants/JalSakhiTheme';
import { Logger } from '../../utils/Logger';
import { InvertedCorner } from '../shared/InvertedCorner';

interface BentoTileProps {
    title: string;
    subtitle?: string;
    icon?: React.ReactNode;
    onPress?: () => void;
    style?: ViewStyle;
    size?: 'small' | 'medium' | 'large' | 'wide';
    children?: React.ReactNode;
    showInvertedCorner?: boolean;
}

export const BentoTile: React.FC<BentoTileProps> = ({
    title,
    subtitle,
    icon,
    onPress,
    style,
    size = 'medium',
    children,
    showInvertedCorner = true,
}) => {
    const getTileSize = () => {
        switch (size) {
            case 'small':
                return { width: '48%', aspectRatio: 1 };
            case 'medium':
                return { width: '48%', aspectRatio: 0.8 };
            case 'large':
                return { width: '100%', minHeight: 180 };
            case 'wide':
                return { width: '100%', aspectRatio: 2 };
            default:
                return { width: '48%', aspectRatio: 1 };
        }
    };

    const handlePress = () => {
        Logger.debug('BentoTile', `Pressed: ${title}`);
        onPress?.();
    };

    return (
        <Pressable
            style={({ pressed }) => [
                styles.container,
                getTileSize() as ViewStyle,
                { opacity: pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] as any },
                style,
            ]}
            onPress={handlePress}
        >
            {showInvertedCorner && (size === 'large' || size === 'wide') && (
                <InvertedCorner position="top-right" size={24} style={{ top: 0, right: 0 }} />
            )}
            <View style={styles.header}>
                {icon && <View style={styles.iconContainer}>{icon}</View>}
                <View style={styles.titleContainer}>
                    <Text style={styles.title} numberOfLines={1}>{title}</Text>
                    {subtitle && <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>}
                </View>
            </View>
            <View style={styles.content}>
                {children}
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Theme.colors.glass,
        borderRadius: Theme.roundness.lg,
        padding: Theme.spacing.md,
        marginBottom: Theme.spacing.md,
        ...Theme.shadows.soft,
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.5)',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Theme.spacing.sm,
    },
    iconContainer: {
        width: 36,
        height: 36,
        backgroundColor: 'rgba(5, 150, 105, 0.1)',
        borderRadius: Theme.roundness.md,
        marginRight: Theme.spacing.sm,
        alignItems: 'center',
        justifyContent: 'center',
    },
    titleContainer: {
        flex: 1,
    },
    title: {
        fontSize: 14,
        fontWeight: '700',
        color: Theme.colors.text,
        fontFamily: 'System',
    },
    subtitle: {
        fontSize: 11,
        color: Theme.colors.moss,
        fontFamily: 'System',
        marginTop: 1,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
