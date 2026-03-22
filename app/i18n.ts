import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

import en from './locales/en.json';
import hi from './locales/hi.json';
import mr from './locales/mr.json';

const LANGUAGE_KEY = '@jalsakhi_language';

const resources = {
    en: { translation: en },
    hi: { translation: hi },
    mr: { translation: mr },
};

// Detect device language and map to supported languages
const getDeviceLanguage = (): string => {
    const locale = Localization.getLocales?.()?.[0]?.languageCode || 'en';
    return ['en', 'hi', 'mr'].includes(locale) ? locale : 'en';
};

i18n
    .use(initReactI18next)
    .init({
        compatibilityJSON: 'v4',
        resources,
        lng: getDeviceLanguage(),
        fallbackLng: 'en',
        load: 'languageOnly',
        interpolation: {
            escapeValue: false,
        },
    });

// Load saved language preference (call this on app startup)
export const loadSavedLanguage = async () => {
    try {
        const savedLang = await AsyncStorage.getItem(LANGUAGE_KEY);
        if (savedLang && ['en', 'hi', 'mr'].includes(savedLang)) {
            await i18n.changeLanguage(savedLang);
        }
    } catch (e) {
        // Silently fail — use device language
    }
};

// Save language preference and switch
export const changeLanguage = async (lang: string) => {
    try {
        await AsyncStorage.setItem(LANGUAGE_KEY, lang);
        await i18n.changeLanguage(lang);
    } catch (e) {
        // Silently fail
    }
};

export default i18n;
