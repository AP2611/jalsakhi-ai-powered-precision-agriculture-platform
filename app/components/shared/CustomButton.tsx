import React from 'react';
import { StyleSheet, Text, Pressable, ViewStyle, TextStyle, ActivityIndicator, View } from 'react-native';
import { Theme } from '../../constants/JalSakhiTheme';

interface CustomButtonProps {
    title: string;
    onPress: () => void;
    type?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    disabled?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
    icon?: React.ReactNode;
}

export const CustomButton: React.FC<CustomButtonProps> = ({
    title,
    onPress,
    type = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    style,
    textStyle,
    icon,
}) => {
    const getButtonStyle = (): ViewStyle => {
        switch (type) {
            case 'primary':
                return { backgroundColor: Theme.colors.emerald };
            case 'secondary':
                return { backgroundColor: Theme.colors.sage };
            case 'outline':
                return { backgroundColor: 'transparent', borderWidth: 2, borderColor: Theme.colors.emerald };
            case 'ghost':
                return { backgroundColor: 'transparent' };
            default:
                return { backgroundColor: Theme.colors.emerald };
        }
    };

    const getTextColor = (): string => {
        if (type === 'outline' || type === 'ghost') return Theme.colors.emerald;
        return '#FFFFFF';
    };

    const getSizeStyle = (): ViewStyle => {
        switch (size) {
            case 'sm':
                return { paddingVertical: 8, paddingHorizontal: 16, borderRadius: Theme.roundness.sm };
            case 'md':
                return { paddingVertical: 12, paddingHorizontal: 24, borderRadius: Theme.roundness.md };
            case 'lg':
                return { paddingVertical: 16, paddingHorizontal: 32, borderRadius: Theme.roundness.lg };
        }
    };

    return (
        <Pressable
            onPress={onPress}
            disabled={disabled || loading}
            style={({ pressed }) => [
                styles.button,
                getButtonStyle(),
                getSizeStyle(),
                { opacity: (pressed || disabled) ? 0.7 : 1 },
                style,
            ]}
        >
            {loading ? (
                <ActivityIndicator color={getTextColor()} />
            ) : (
                <>
                    {icon && <View style={styles.iconContainer}>{icon}</View>}
                    <Text style={[styles.text, { color: getTextColor() }, textStyle]}>{title}</Text>
                </>
            )}
        </Pressable>
    );
};

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    text: {
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'System',
    },
    iconContainer: {
        marginRight: 8,
    },
});
