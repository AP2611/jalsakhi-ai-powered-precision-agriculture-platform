import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Theme } from '../../constants/JalSakhiTheme';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { MLService } from '../../services/ml';
import { LinearGradient } from 'expo-linear-gradient';

export default function InternalAITools() {
    const router = useRouter();
    const [loading, setLoading] = useState<string | null>(null);
    const [payload, setPayload] = useState('{\n  "test": "data"\n}');
    const [result, setResult] = useState<any>(null);

    const handleTest = async (model: 'model1' | 'model2') => {
        setLoading(model);
        setResult(null);
        try {
            const body = JSON.parse(payload);
            const data = model === 'model1'
                ? await MLService.predictModel1(body)
                : await MLService.predictModel2(body);
            setResult(data);
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Invalid JSON or Service Error');
        } finally {
            setLoading(null);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Feather name="arrow-left" size={24} color={Theme.colors.text} />
                </TouchableOpacity>
                <Text style={styles.title}>Internal AI Tools</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.sectionTitle}>Model Payload (JSON)</Text>
                <TextInput
                    style={styles.jsonInput}
                    multiline
                    value={payload}
                    onChangeText={setPayload}
                    placeholder="Enter JSON payload"
                />

                <View style={styles.btnRow}>
                    <TouchableOpacity
                        style={[styles.btn, styles.model1Btn]}
                        onPress={() => handleTest('model1')}
                        disabled={!!loading}
                    >
                        <Text style={styles.btnText}>
                            {loading === 'model1' ? 'Testing...' : 'Test Model 1'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.btn, styles.model2Btn]}
                        onPress={() => handleTest('model2')}
                        disabled={!!loading}
                    >
                        <Text style={styles.btnText}>
                            {loading === 'model2' ? 'Testing...' : 'Test Model 2'}
                        </Text>
                    </TouchableOpacity>
                </View>

                {result && (
                    <View style={styles.resultContainer}>
                        <Text style={styles.resultTitle}>Result:</Text>
                        <Text style={styles.resultText}>{JSON.stringify(result, null, 2)}</Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc' },
    header: { flexDirection: 'row', alignItems: 'center', padding: 20, gap: 16 },
    backBtn: { padding: 4 },
    title: { fontSize: 20, fontWeight: 'bold', color: Theme.colors.text },
    content: { padding: 20 },
    sectionTitle: { fontSize: 14, fontWeight: '700', color: Theme.colors.textMuted, marginBottom: 12 },
    jsonInput: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        height: 150,
        textAlignVertical: 'top',
        fontSize: 14,
        fontFamily: 'monospace',
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    btnRow: { flexDirection: 'row', gap: 12, marginTop: 20 },
    btn: { flex: 1, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
    model1Btn: { backgroundColor: Theme.colors.primary },
    model2Btn: { backgroundColor: '#3b82f6' },
    btnText: { color: 'white', fontWeight: 'bold' },
    resultContainer: { marginTop: 24, padding: 16, backgroundColor: '#1e293b', borderRadius: 12 },
    resultTitle: { color: '#94a3b8', fontSize: 12, fontWeight: 'bold', marginBottom: 8 },
    resultText: { color: '#f1f5f9', fontSize: 13, fontFamily: 'monospace' },
});
