import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ActivityIndicator,
  Image,
  StatusBar,
  Dimensions,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Theme } from '../../constants/JalSakhiTheme';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

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
    <View style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      <Stack.Screen options={{ headerShown: false }} />

      {/* Decorative Layer */}
      <View style={styles.decorativeLayer} pointerEvents="none">
        <View style={[styles.designLine, { top: '30%', right: -60, transform: [{ rotate: '-30deg' }] }]} />
        <View style={[styles.designLine, { bottom: '20%', left: -80, width: 300, transform: [{ rotate: '15deg' }] }]} />
      </View>

      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <BlurView intensity={60} tint="light" style={styles.backBlur}>
              <MaterialCommunityIcons name="chevron-left" size={28} color={Theme.colors.text} />
            </BlurView>
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.title}>JalSakhi AI</Text>
            <View style={styles.onlineStatus}>
              <View style={styles.statusDot} />
              <Text style={styles.statusTextLine}>Online</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.infoBtn}>
            <MaterialCommunityIcons name="information-outline" size={22} color={Theme.colors.textMuted} />
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
        >
          {/* Language Selector */}
          <View style={styles.langArea}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.langList}>
              {['English', 'Hindi', 'Marathi', 'Gujarati', 'Tamil'].map(l => (
                <TouchableOpacity
                  key={l}
                  style={[styles.langChip, language === l && styles.activeLang]}
                  onPress={() => setLanguage(l)}
                >
                  <Text style={[styles.langText, language === l && styles.activeLangText]}>{l}</Text>
                </TouchableOpacity>
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
                placeholder="Ask your question..."
                placeholderTextColor="#94a3b8"
                value={input}
                onChangeText={setInput}
                style={[styles.input, { maxHeight: 100 }]}
                multiline
              />
              <TouchableOpacity
                onPress={sendMessage}
                disabled={!input.trim()}
              >
                <LinearGradient
                  colors={input.trim() ? ['#10b981', '#059669'] : ['#e2e8f0', '#cbd5e1']}
                  style={styles.sendBtn}
                >
                  <Ionicons name="send" size={18} color="white" />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </BlurView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  backBlur: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
  },
  headerTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: Theme.colors.text,
    letterSpacing: -0.5,
  },
  onlineStatus: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#10b981' },
  statusTextLine: { fontSize: 12, color: Theme.colors.textMuted, fontWeight: '600' },
  backBtn: {},
  infoBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  list: { padding: 16, paddingBottom: 24 },
  messageRow: { flexDirection: 'row', alignItems: 'flex-end', marginVertical: 8 },
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
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
  },
  bubbleAssistant: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
  },
  bubbleUser: {
    backgroundColor: Theme.colors.primary,
  },
  bubbleText: { fontSize: 15, lineHeight: 22, fontWeight: '500' },
  bubbleTextAssistant: { color: Theme.colors.text },
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
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: Theme.colors.text,
    fontWeight: '600',
    paddingVertical: 10,
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
