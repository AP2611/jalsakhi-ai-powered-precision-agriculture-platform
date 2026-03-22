import React from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Theme } from '../../constants/JalSakhiTheme';
import { CustomButton } from '../../components/shared/CustomButton';
import { changeLanguage } from '../../i18n';
import { Logger } from '../../utils/Logger';

const LANGUAGES = [
    { id: 'en', label: 'English', nativeLabel: 'English' },
    { id: 'hi', label: 'Hindi', nativeLabel: 'हिंदी' },
    { id: 'mr', label: 'Marathi', nativeLabel: 'मराठी' },
];

export default function LanguageScreen() {
    const router = useRouter();
    const [selected, setSelected] = React.useState('en');

    const handleContinue = async () => {
        Logger.info('LanguageScreen', `Selected language: ${selected}`);
        await changeLanguage(selected);
        router.push('/(auth)/login');
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Select Language</Text>
                <Text style={styles.subtitle}>कृपया अपनी भाषा चुनें / कृपया तुमची भाषा निवडा</Text>
            </View>

            <FlatList
                data={LANGUAGES}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[
                            styles.item,
                            selected === item.id && styles.selectedItem
                        ]}
                        onPress={() => setSelected(item.id)}
                    >
                        <View>
                            <Text style={[styles.itemLabel, selected === item.id && styles.selectedText]}>
                                {item.label}
                            </Text>
                            <Text style={[styles.itemNative, selected === item.id && styles.selectedText]}>
                                {item.nativeLabel}
                            </Text>
                        </View>
                        <View style={[styles.radio, selected === item.id && styles.radioActive]} />
                    </TouchableOpacity>
                )}
            />

            <View style={styles.footer}>
                <CustomButton
                    title="Continue"
                    onPress={handleContinue}
                    size="lg"
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Theme.colors.background,
        padding: Theme.spacing.lg,
    },
    header: {
        marginTop: 60,
        marginBottom: 40,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Theme.colors.forest,
    },
    subtitle: {
        fontSize: 16,
        color: Theme.colors.moss,
        marginTop: 8,
    },
    list: {
        gap: Theme.spacing.md,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: Theme.spacing.md,
        backgroundColor: Theme.colors.card,
        borderRadius: Theme.roundness.md,
        borderWidth: 1,
        borderColor: Theme.colors.border,
    },
    selectedItem: {
        borderColor: Theme.colors.emerald,
        backgroundColor: Theme.colors.dew,
    },
    itemLabel: {
        fontSize: 18,
        fontWeight: '600',
        color: Theme.colors.text,
    },
    itemNative: {
        fontSize: 14,
        color: Theme.colors.textSecondary,
        marginTop: 2,
    },
    selectedText: {
        color: Theme.colors.emerald,
    },
    radio: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: Theme.colors.border,
    },
    radioActive: {
        borderColor: Theme.colors.emerald,
        borderWidth: 6,
    },
    footer: {
        paddingBottom: 20,
    },
});
