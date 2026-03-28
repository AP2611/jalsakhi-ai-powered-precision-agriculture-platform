import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Pressable, KeyboardAvoidingView, Platform, ActivityIndicator, Image, StatusBar, Dimensions, ScrollView, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Theme } from '../../constants/JalSakhiTheme';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { ScreenWrapper } from '../../components/shared/ScreenWrapper';

import api from '../../utils/api';
import { Logger } from '../../utils/Logger';

const screenWidth = Dimensions.get('window').width;

type Role = 'user' | 'assistant';
type Message = { id: string; role: Role; text: string; time?: number };

export default function ChatbotScreen() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    { id: 'welcome', role: 'assistant', text: 'Hi — I can help with crop water, soil forecasts, and allocation. Ask me anything.', time: Date.now() },
  ]);
  const [input, setInput] = useState('');
  const [language, setLanguage] = useState('English');
  const [isTyping, setIsTyping] = useState(false);
  const listRef = useRef<FlatList<Message>>(null);

  useEffect(() => {
    setTimeout(() => listRef.current?.scrollToEnd?.({ animated: true }), 50);
  }, [messages]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;
    const userMsg: Message = { id: `u_${Date.now()}`, role: 'user', text, time: Date.now() };
    setMessages((m) => [...m, userMsg]);
    setInput('');

    setIsTyping(true);
    try {
      const response = await api.post('/api/ai/chat', {
        message: text,
        language
      });

      const replyText = response.data?.data?.reply || "I'm sorry, I couldn't process that right now.";
      const reply: Message = {
        id: `a_${Date.now()}`,
        role: 'assistant',
        text: replyText,
        time: Date.now(),
      };
      setMessages((m) => [...m, reply]);
    } catch (error: any) {
      Logger.error('Chatbot', 'Failed to get reply', error);
      const errorMsg: Message = {
        id: `err_${Date.now()}`,
        role: 'assistant',
        text: "My connection is a bit unstable. Please check if the AI service is online.",
        time: Date.now(),
      };
      setMessages((m) => [...m, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.role === 'user';
    return (
      <View style={[styles.messageRow, isUser ? styles.messageRowUser : styles.messageRowAssistant]}>
        {!isUser && (
          <LinearGradient colors={['#10b981', '#059669']} style={styles.assistantAvatarBox}>
            <MaterialCommunityIcons name="robot-outline" size={20} color="white" />
          </LinearGradient>
        )}
        <View style={[
          styles.bubble,
          isUser ? styles.bubbleUser : styles.bubbleAssistant,
          { borderTopLeftRadius: isUser ? 20 : 4, borderTopRightRadius: isUser ? 4 : 20 }
        ]}>
          <Text style={[styles.bubbleText, isUser ? styles.bubbleTextUser : styles.bubbleTextAssistant]}>{item.text}</Text>
          <View style={styles.bubbleFooter}>
            <Text style={[styles.timeText, isUser && { color: 'rgba(255,255,255,0.7)' }]}>
              {new Date(item.time || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
            {isUser && <Ionicons name="checkmark-done" size={14} color="rgba(255,255,255,0.7)" style={{ marginLeft: 4 }} />}
          </View>
        </View>
      </View>
    );
  };

    return (
        <ScreenWrapper scrollable={false} style={{ backgroundColor: 'transparent' }}>
            <Stack.Screen options={{ headerShown: false }} />

            <View style={styles.header}>
                <Pressable
                    style={({ pressed }) => [styles.backBtn, { opacity: pressed ? 0.7 : 1 }]}
                    onPress={() => router.back()}
                >
                    <BlurView intensity={60} tint="light" style={styles.backBlur}>
                        <MaterialCommunityIcons name="chevron-left" size={28} color={Theme.colors.forest} />
                    </BlurView>
                </Pressable>
                <View style={styles.headerTextContainer}>
                    <Text style={styles.title}>JalSakhi AI</Text>
                    <View style={styles.onlineStatus}>
                        <View style={styles.statusDot} />
                        <Text style={styles.statusTextLine}>Online</Text>
                    </View>
                </View>
                <Pressable style={({ pressed }) => [styles.infoBtn, { opacity: pressed ? 0.6 : 1 }]}>
                    <MaterialCommunityIcons name="information-outline" size={24} color={Theme.colors.forest} />
                </Pressable>
            </View>

            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            >
                {/* Language Selector */}
                <View style={styles.langArea}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.langList}>
                        {['English', 'Hindi', 'Marathi', 'Gujarati', 'Tamil'].map(l => (
                            <Pressable
                                key={l}
                                style={({ pressed }) => [
                                    styles.langChip,
                                    language === l && styles.activeLang,
                                    { opacity: pressed ? 0.8 : 1 }
                                ]}
                                onPress={() => setLanguage(l)}
                            >
                                <Text style={[styles.langText, language === l && styles.activeLangText]}>{l}</Text>
                            </Pressable>
                        ))}
                    </ScrollView>
                </View>

                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={{ flex: 1 }}>
                        <FlatList
                            ref={listRef}
                            data={messages}
                            keyExtractor={(i) => i.id}
                            renderItem={renderMessage}
                            contentContainerStyle={styles.list}
                            showsVerticalScrollIndicator={false}
                            keyboardDismissMode="on-drag"
                        />

                        {isTyping && (
                            <View style={styles.typingRow}>
                                <BlurView intensity={30} tint="light" style={styles.typingBubble}>
                                    <View style={styles.dot} />
                                    <View style={[styles.dot, { opacity: 0.5 }]} />
                                    <View style={[styles.dot, { opacity: 0.2 }]} />
                                </BlurView>
                            </View>
                        )}
                    </View>
                </TouchableWithoutFeedback>

                <BlurView intensity={80} tint="light" style={styles.inputArea}>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            placeholder="Ask JalSakhi AI..."
                            placeholderTextColor="rgba(6, 78, 59, 0.3)"
                            value={input}
                            onChangeText={setInput}
                            style={styles.input}
                            multiline
                        />
                        <Pressable
                            onPress={sendMessage}
                            disabled={!input.trim()}
                            style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
                        >
                            <LinearGradient
                                colors={input.trim() ? ['#10b981', '#059669'] : ['#f1f5f9', '#e2e8f0']}
                                style={styles.sendBtn}
                            >
                                <Ionicons name="send" size={18} color={input.trim() ? "white" : "#94a3b8"} />
                            </LinearGradient>
                        </Pressable>
                    </View>
                </BlurView>
            </KeyboardAvoidingView>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8FAFC' },
  container: { flex: 1 },
  decorativeLayer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  designLine: {
    position: 'absolute',
    width: 350,
    height: 1,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 12,
  },
  backBlur: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.85)',
    ...Theme.shadows.soft,
    borderWidth: 1,
    borderColor: 'rgba(6, 78, 59, 0.05)',
  },
  headerTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: Theme.colors.forest,
    letterSpacing: -0.5,
  },
  onlineStatus: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#10b981', ...Theme.shadows.soft },
  statusTextLine: { fontSize: 12, color: 'rgba(6, 78, 59, 0.4)', fontWeight: '700', textTransform: 'uppercase' },
  backBtn: {},
  infoBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  list: { padding: 20, paddingBottom: 24 },
  messageRow: { flexDirection: 'row', alignItems: 'flex-end', marginVertical: 10 },
  messageRowAssistant: { justifyContent: 'flex-start' },
  messageRowUser: { justifyContent: 'flex-end' },
  assistantAvatarBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  bubble: {
    maxWidth: '82%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(6, 78, 59, 0.08)',
    ...Theme.shadows.soft,
  },
  bubbleAssistant: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  bubbleUser: {
    backgroundColor: Theme.colors.forest,
  },
  bubbleText: { fontSize: 15, lineHeight: 22, fontWeight: '600' },
  bubbleTextAssistant: { color: Theme.colors.forest },
  bubbleTextUser: { color: '#fff' },
  bubbleFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginTop: 4 },
  timeText: { fontSize: 10, color: Theme.colors.textMuted },
  typingRow: { paddingLeft: 56, marginBottom: 12 },
  typingBubble: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
  },
  dot: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: Theme.colors.primary },
  inputArea: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(6, 78, 59, 0.05)',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(6, 78, 59, 0.08)',
    ...Theme.shadows.soft,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: Theme.colors.forest,
    fontWeight: '700',
    paddingVertical: 12,
    maxHeight: 120,
  },
  sendBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  langArea: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  langList: {
    paddingHorizontal: 16,
    gap: 8,
  },
  langChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
  },
  activeLang: {
    backgroundColor: Theme.colors.primary,
  },
  langText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748b',
  },
  activeLangText: {
    color: 'white',
  },
});
