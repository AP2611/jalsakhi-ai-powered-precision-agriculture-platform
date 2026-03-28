import React, { useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, Pressable, Image, Alert, StatusBar, Dimensions } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Theme } from '../../constants/JalSakhiTheme';
import { Farm } from '../../services/farms';
import { useApp } from '../../context/AppContext';
import { useIsFocused } from '@react-navigation/native';
import { Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { ScreenWrapper } from '../../components/shared/ScreenWrapper';

const screenWidth = Dimensions.get('window').width;

export default function MyFarmsScreen() {
    const router = useRouter();
    const isFocused = useIsFocused();
    const { t } = useTranslation();
    const { farms, farmsLoading, loadFarms, deleteFarm } = useApp();

    useEffect(() => {
        loadFarms();
    }, []);

    useEffect(() => {
        if (isFocused) loadFarms();
    }, [isFocused]);

    const handleDelete = (id: string) => {
        Alert.alert(t('farms.deleteFarm'), t('farms.confirmDelete'), [
            { text: t('common.cancel'), style: 'cancel' },
            { text: t('common.delete'), style: 'destructive', onPress: () => deleteFarm(id) }
        ]);
    };

    const renderFarmItem = ({ item }: { item: Farm }) => (
        <View style={styles.farmCard}>
            <Pressable
                style={({ pressed }) => [{ flex: 1, opacity: pressed ? 0.95 : 1 }]}
                onPress={() => router.push({ pathname: '/farmer/my-farm-detail', params: { id: item.id } } as any)}
            >
                <Image
                    source={{ uri: item.image || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=600&auto=format&fit=crop' }}
                    style={styles.farmImage}
                />

                <BlurView intensity={20} tint="dark" style={styles.imageOverlay}>
                    <View style={styles.overlayContent}>
                        <View style={[styles.statusBadge, { backgroundColor: item.status === 'Optimal' ? Theme.colors.success : Theme.colors.error }]}>
                            <Text style={styles.statusText}>
                                {item.status ? t(`farms.${item.status.toLowerCase()}`, { defaultValue: item.status }) : t('farms.unknown')}
                            </Text>
                        </View>
                    </View>
                </BlurView>

                <View style={styles.farmContent}>
                    <Text style={styles.farmName}>{item.name}</Text>
                    <View style={styles.detailsRow}>
                        <View style={styles.detailItem}>
                            <MaterialCommunityIcons name="sprout" size={16} color={Theme.colors.primary} />
                            <Text style={styles.detailText}>{item.crop}</Text>
                        </View>
                        <View style={styles.detailItem}>
                            <MaterialCommunityIcons name="texture-box" size={16} color={Theme.colors.primary} />
                            <Text style={styles.detailText}>{item.size}</Text>
                        </View>
                    </View>
                </View>
            </Pressable>

            {/* Float Actions */}
            <View style={styles.cardActions}>
                <Pressable
                    style={({ pressed }) => [styles.cardActionBtn, { opacity: pressed ? 0.7 : 1 }]}
                    onPress={() => router.push({ pathname: '/farmer/my-farms-add-edit', params: { id: item.id } } as any)}
                >
                    <BlurView intensity={80} tint="light" style={styles.actionBlur}>
                        <MaterialCommunityIcons name="pencil-outline" size={18} color={Theme.colors.text} />
                    </BlurView>
                </Pressable>
                <Pressable
                    style={({ pressed }) => [styles.cardActionBtn, { opacity: pressed ? 0.7 : 1 }]}
                    onPress={() => handleDelete(item.id)}
                >
                    <BlurView intensity={80} tint="light" style={styles.actionBlur}>
                        <MaterialCommunityIcons name="trash-can-outline" size={18} color={Theme.colors.error} />
                    </BlurView>
                </Pressable>
            </View>
        </View>
    );

    return (
        <ScreenWrapper contentContainerStyle={{ paddingBottom: 100 }}>
            <Stack.Screen options={{ headerShown: false }} />

            <View style={styles.header}>
                <View style={styles.headerTitles}>
                    <Text style={styles.headerTitle}>{t('farms.myFarms')}</Text>
                    <Text style={styles.headerSubtitle}>Manage your agricultural assets</Text>
                </View>
                <Pressable
                    style={({ pressed }) => [styles.addBtn, { opacity: pressed ? 0.8 : 1 }]}
                    onPress={() => router.push('/farmer/my-farms-add-edit')}
                >
                    <LinearGradient colors={['#10b981', '#059669']} style={styles.addGradient}>
                        <MaterialCommunityIcons name="plus" size={28} color="white" />
                    </LinearGradient>
                </Pressable>
            </View>

            <FlatList
                data={farms}
                keyExtractor={(item) => item.id}
                scrollEnabled={false} // Managed by ScreenWrapper ScrollView
                contentContainerStyle={styles.list}
                renderItem={renderFarmItem}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <BlurView intensity={20} tint="light" style={styles.emptyBlur}>
                            <MaterialCommunityIcons name="sprout-outline" size={64} color={Theme.colors.primary} />
                            <Text style={styles.emptyText}>
                                {farmsLoading ? t('farms.loadingFarms') : t('farms.noFarms')}
                            </Text>
                            <Pressable
                                style={({ pressed }) => [styles.emptyAddBtn, { opacity: pressed ? 0.8 : 1 }]}
                                onPress={() => router.push('/farmer/my-farms-add-edit')}
                            >
                                <Text style={styles.emptyAddText}>Register First Farm</Text>
                            </Pressable>
                        </BlurView>
                    </View>
                }
            />
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 25,
    },
    headerTitles: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '900',
        color: Theme.colors.text,
        letterSpacing: -0.5,
    },
    headerSubtitle: {
        fontSize: 13,
        color: Theme.colors.textMuted,
        marginTop: 2,
    },
    addBtn: {
        width: 50,
        height: 50,
        borderRadius: 18,
        overflow: 'hidden',
        elevation: 6,
        shadowColor: Theme.colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
    },
    addGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    list: {
        paddingHorizontal: 20,
        paddingBottom: 20,
        gap: 20,
    },
    farmCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        borderRadius: 24,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(6, 78, 59, 0.08)',
        ...Theme.shadows.soft,
    },
    farmImage: {
        width: '100%',
        height: 200,
        backgroundColor: '#E2E8F0',
    },
    imageOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 200,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.1)',
    },
    overlayContent: {
        padding: 20,
    },
    statusBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    statusText: {
        fontSize: 11,
        fontWeight: '900',
        color: 'white',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    farmContent: {
        padding: 24,
        backgroundColor: 'white',
    },
    farmName: {
        fontSize: 22,
        fontWeight: '900',
        color: Theme.colors.text,
        letterSpacing: -0.4,
    },
    detailsRow: {
        flexDirection: 'row',
        gap: 20,
        marginTop: 12,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    detailText: {
        fontSize: 14,
        fontWeight: '700',
        color: Theme.colors.textMuted,
    },
    cardActions: {
        position: 'absolute',
        top: 16,
        right: 16,
        flexDirection: 'row',
        gap: 10,
    },
    cardActionBtn: {
        width: 40,
        height: 40,
        borderRadius: 14,
        overflow: 'hidden',
    },
    actionBlur: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.7)',
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 60,
    },
    emptyBlur: {
        padding: 40,
        borderRadius: 32,
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.5)',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
        width: screenWidth - 80,
    },
    emptyText: {
        fontSize: 16,
        color: Theme.colors.textMuted,
        fontWeight: '700',
        marginTop: 16,
        textAlign: 'center',
    },
    emptyAddBtn: {
        marginTop: 24,
        backgroundColor: Theme.colors.primary,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 16,
    },
    emptyAddText: {
        color: 'white',
        fontWeight: '800',
        fontSize: 15,
    }
});
