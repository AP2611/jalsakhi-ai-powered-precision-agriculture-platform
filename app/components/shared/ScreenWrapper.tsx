import React from 'react';
import { StyleSheet, ImageBackground, View, ScrollView, ViewStyle, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ScreenWrapperProps {
    children: React.ReactNode;
    style?: ViewStyle;
    scrollable?: boolean;
    contentContainerStyle?: ViewStyle;
}

/**
 * A shared screen wrapper that provides a consistent background and layout
 * across all screens in the application.
 */
export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
    children,
    style,
    scrollable = true,
    contentContainerStyle,
}) => {
    const Content = scrollable ? ScrollView : View;

    return (
        <ImageBackground
            source={require('../../assets/images/background.jpeg')}
            style={[styles.background, style]}
            imageStyle={{ opacity: 0.12 }}
            resizeMode="cover"
        >
            <StatusBar barStyle="dark-content" />
            <SafeAreaView style={styles.safeArea}>
                <Content
                    style={styles.content}
                    contentContainerStyle={scrollable ? [styles.scrollContent, contentContainerStyle] : undefined}
                    showsVerticalScrollIndicator={false}
                >
                    {children}
                </Content>
            </SafeAreaView>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    safeArea: {
        flex: 1,
    },
    content: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
    },
});
