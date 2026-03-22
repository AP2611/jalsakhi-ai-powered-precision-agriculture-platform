import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, FlatList } from 'react-native';
import { Theme } from '../constants/JalSakhiTheme';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { changeLanguage } from '../i18n';

const LANGUAGES = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'hi', label: 'Hindi', native: 'हिंदी' },
    { code: 'mr', label: 'Marathi', native: 'मराठी' },
];

export const LanguageSelector: React.FC = () => {
    const { i18n } = useTranslation();
    const [modalVisible, setModalVisible] = React.useState(false);

    const selectedLang = LANGUAGES.find(l => l.code === i18n.language) || LANGUAGES[0];

    const handleSelect = async (code: string) => {
        await changeLanguage(code);
        setModalVisible(false);
    };

    return (
        <>
            <TouchableOpacity
                style={styles.selector}
                onPress={() => setModalVisible(true)}
            >
                <Ionicons name="language" size={18} color={Theme.colors.primary} />
                <Text style={styles.text}>{selectedLang.native}</Text>
                <Ionicons name="chevron-down" size={16} color={Theme.colors.textMuted} />
            </TouchableOpacity>

            <Modal
                transparent={true}
                visible={modalVisible}
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setModalVisible(false)}
                >
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Select Language / भाषा चुनें</Text>
                        <FlatList
                            data={LANGUAGES}
                            keyExtractor={(item) => item.code}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[
                                        styles.langItem,
                                        i18n.language === item.code && styles.selectedItem
                                    ]}
                                    onPress={() => handleSelect(item.code)}
                                >
                                    <View>
                                        <Text style={styles.langNative}>{item.native}</Text>
                                        <Text style={styles.langLabel}>{item.label}</Text>
                                    </View>
                                    {i18n.language === item.code && (
                                        <Ionicons name="checkmark-circle" size={20} color={Theme.colors.success} />
                                    )}
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    selector: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: Theme.colors.border,
        gap: 6,
    },
    text: {
        fontSize: 14,
        fontWeight: '600',
        color: Theme.colors.text,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        padding: 20,
        shadowColor: Theme.colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Theme.colors.primary,
        marginBottom: 16,
        textAlign: 'center',
    },
    langItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    selectedItem: {
        backgroundColor: Theme.colors.dew,
        borderColor: Theme.colors.primary,
    },
    langNative: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Theme.colors.text,
    },
    langLabel: {
        fontSize: 12,
        color: Theme.colors.textMuted,
    },
});
