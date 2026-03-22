import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Theme } from '../constants/JalSakhiTheme';
import { Feather } from '@expo/vector-icons';

interface AdminHeaderProps {
    title: string;
    showBack?: boolean;
    actionLabel?: string;
    actionIcon?: keyof typeof Feather.glyphMap;
    onActionPress?: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ title, showBack = true, actionLabel, actionIcon, onActionPress }) => {
    const router = useRouter();

    return (
        <View style={styles.header}>
            {showBack && (
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <Feather name="arrow-left" size={20} color={Theme.colors.primary} />
                </TouchableOpacity>
            )}
            <Text style={styles.title} numberOfLines={1}>{title}</Text>
            {(actionLabel || actionIcon) && (
                <TouchableOpacity onPress={onActionPress} style={styles.actionBtn}>
                    {actionLabel && <Text style={styles.actionText}>{actionLabel}</Text>}
                    {actionIcon && <Feather name={actionIcon} size={20} color={Theme.colors.primary} />}
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: Theme.colors.border,
        gap: 12,
    },
    backBtn: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: Theme.colors.dew,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        flex: 1,
        fontSize: 18,
        fontWeight: 'bold',
        color: Theme.colors.text,
    },
    actionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 4,
    },
    actionText: {
        fontSize: 14,
        fontWeight: '700',
        color: Theme.colors.primary,
    },
});
