import React from 'react';
import { StyleSheet, View, Text, TextInput, TextInputProps, ViewStyle } from 'react-native';
import { Theme } from '../../constants/JalSakhiTheme';

interface CustomInputProps extends TextInputProps {
    label?: string;
    error?: string;
    containerStyle?: ViewStyle;
    leftIcon?: React.ReactNode;
}

export const CustomInput: React.FC<CustomInputProps> = ({
    label,
    error,
    containerStyle,
    leftIcon,
    ...props
}) => {
    return (
        <View style={[styles.container, containerStyle]}>
            {label && <Text style={styles.label}>{label}</Text>}
            <View style={[styles.inputContainer, error ? styles.inputError : null]}>
                {leftIcon && <View style={styles.icon}>{leftIcon}</View>}
                <TextInput
                    style={styles.input}
                    placeholderTextColor={Theme.colors.moss}
                    {...props}
                />
            </View>
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginBottom: Theme.spacing.md,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: Theme.colors.forest,
        marginBottom: Theme.spacing.xs,
        marginLeft: 4,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Theme.colors.background,
        borderWidth: 1,
        borderColor: Theme.colors.border,
        borderRadius: Theme.roundness.md,
        paddingHorizontal: Theme.spacing.sm,
    },
    input: {
        flex: 1,
        paddingVertical: 12,
        color: Theme.colors.text,
        fontSize: 16,
        fontFamily: 'System',
    },
    icon: {
        marginRight: Theme.spacing.sm,
    },
    inputError: {
        borderColor: Theme.colors.error,
    },
    errorText: {
        color: Theme.colors.error,
        fontSize: 12,
        marginTop: 4,
        marginLeft: 4,
    },
});
