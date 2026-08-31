// Mirrors ClientChatWidget.tsx on web — realtime chat thread.
// Subscribes to messages table via Supabase Realtime (Postgres Changes).
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Send, ArrowLeft } from 'lucide-react-native';
import { supabase } from '@/core/services/supabaseClient';
import { Avatar } from '@/shared/components/Avatar';
import { colors, radius, spacing, fontSize, fontWeight } from '@/app/theme';

interface Message {
  id: string;
  booking_id: string | null;
  sender_email: string;
  sender_role: 'guest' | 'admin' | 'driver';
  body: string;
  created_at: string;
}

export function ChatScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = React.useState(true);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [input, setInput] = React.useState('');
  const [sending, setSending] = React.useState(false);
  const [session, setSession] = React.useState<any>(null);
  const scrollRef = React.useRef<ScrollView>(null);

  React.useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      if (data.session) {
        await loadMessages(data.session.user.email);
        subscribeToMessages(data.session.user.email);
      } else {
        setLoading(false);
      }
    })();
    return () => {
      supabase.removeAllChannels();
    };
  }, []);

  const loadMessages = async (email: string) => {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .or(`sender_email.eq.${email},recipient_email.eq.${email}`)
      .order('created_at', { ascending: true });
    setMessages((data as Message[]) ?? []);
    setLoading(false);
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const subscribeToMessages = (email: string) => {
    supabase
      .channel('messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        const msg = payload.new as Message;
        if (msg.sender_email === email || msg.sender_role === 'admin') {
          setMessages((prev) => [...prev, msg]);
          setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
        }
      })
      .subscribe();
  };

  const handleSend = async () => {
    if (!input.trim() || !session) return;
    setSending(true);
    const body = input.trim();
    setInput('');
    await supabase.from('messages').insert({
      sender_email: session.user.email,
      sender_role: 'guest',
      body,
    });
    setSending(false);
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={insets.top}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft size={22} color={colors.text} />
        </TouchableOpacity>
        <Avatar name="TourWise Support" size="sm" />
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>TourWise Support</Text>
          <View style={styles.headerStatusRow}>
            <View style={styles.statusDot} />
            <Text style={styles.headerStatus}>Online</Text>
          </View>
        </View>
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollRef}
        style={styles.messages}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Say hello 👋</Text>
            <Text style={styles.emptyHint}>
              We typically reply within a few minutes during business hours.
            </Text>
          </View>
        ) : (
          messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} currentEmail={session?.user.email} />
          ))
        )}
      </ScrollView>

      {/* Input bar */}
      <View style={[styles.inputBar, { paddingBottom: insets.bottom + spacing.sm }]}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Type a message..."
          placeholderTextColor={colors.textSubtle}
          style={styles.input}
          multiline
        />
        <TouchableOpacity
          onPress={handleSend}
          disabled={!input.trim() || sending}
          style={[styles.sendBtn, !input.trim() && { opacity: 0.5 }]}
        >
          <Send size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

function MessageBubble({ message, currentEmail }: { message: Message; currentEmail?: string }) {
  const isOwn = message.sender_email === currentEmail;
  const time = new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <View style={[styles.bubbleRow, isOwn ? styles.bubbleRowOwn : styles.bubbleRowOther]}>
      <View style={[styles.bubble, isOwn ? styles.bubbleOwn : styles.bubbleOther]}>
        <Text style={[styles.bubbleText, isOwn ? styles.bubbleTextOwn : styles.bubbleTextOther]}>
          {message.body}
        </Text>
        <Text style={[styles.bubbleTime, isOwn ? styles.bubbleTimeOwn : styles.bubbleTimeOther]}>
          {time}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  headerStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 1,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.success,
  },
  headerStatus: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
  },
  messages: {
    flex: 1,
  },
  messagesContent: {
    padding: spacing.lg,
    gap: spacing.sm,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 100,
    gap: spacing.sm,
  },
  emptyTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  emptyHint: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
    lineHeight: 20,
  },
  bubbleRow: {
    flexDirection: 'row',
    marginBottom: spacing.xs,
  },
  bubbleRowOwn: {
    justifyContent: 'flex-end',
  },
  bubbleRowOther: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '75%',
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  bubbleOwn: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  bubbleOther: {
    backgroundColor: colors.surface,
    borderBottomLeftRadius: 4,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  bubbleText: {
    fontSize: fontSize.base,
    lineHeight: 20,
  },
  bubbleTextOwn: {
    color: '#fff',
  },
  bubbleTextOther: {
    color: colors.text,
  },
  bubbleTime: {
    fontSize: 10,
    marginTop: 2,
  },
  bubbleTimeOwn: {
    color: 'rgba(255,255,255,0.75)',
    textAlign: 'right',
  },
  bubbleTimeOther: {
    color: colors.textMuted,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  input: {
    flex: 1,
    fontSize: fontSize.base,
    color: colors.text,
    backgroundColor: colors.surfaceSunken,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    maxHeight: 100,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
