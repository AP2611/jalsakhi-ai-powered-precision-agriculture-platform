import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Theme } from '../../constants/JalSakhiTheme';

interface InvertedCornerProps {
    size?: number;
    color?: string;
    backgroundColor?: string;
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    style?: ViewStyle;
}

/**
 * A component that creates an inverted (concave) corner effect.
 * Useful for the "neck" where two Bento tiles meet or for premium container shapes.
 */
export const InvertedCorner: React.FC<InvertedCornerProps> = ({
    size = 20,
    color = Theme.colors.card,
    backgroundColor = Theme.colors.background,
    position = 'top-left',
    style,
}) => {
    const getCornerStyle = (): ViewStyle => {
        switch (position) {
            case 'top-left':
                return { top: -size, left: -size };
            case 'top-right':
                return { top: -size, right: -size };
            case 'bottom-left':
                return { bottom: -size, left: -size };
            case 'bottom-right':
                return { bottom: -size, right: -size };
        }
    };

    return (
        <View style={[styles.outer, { width: size, height: size, backgroundColor }, style]}>
            <View
                style={[
                    styles.inner,
                    {
                        width: size * 2,
                        height: size * 2,
                        borderRadius: size,
                        backgroundColor: color,
                        ...getCornerStyle(),
                    },
                ]}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    outer: {
        overflow: 'hidden',
        position: 'absolute',
    },
    inner: {
        position: 'absolute',
    },
});
