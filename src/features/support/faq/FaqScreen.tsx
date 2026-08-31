// Mirrors SupportPage.tsx + data/supportFAQ.ts on web.
// Searchable, category-grouped, role-filtered FAQ.
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Search, ChevronDown, ArrowLeft } from 'lucide-react-native';
import { supportFAQ, getFAQCategories } from '@/data/supportFAQ';
import { supabase } from '@/core/services/supabaseClient';
import { colors, radius, spacing, fontSize, fontWeight } from '@/app/theme';

export function FaqScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = React.useState('');
  const [role, setRole] = React.useState<'guests' | 'drivers' | 'operators'>('guests');
  const [expanded, setExpanded] = React.useState<string | null>(null);

  React.useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // Could pull role from profiles — default to 'guests' for now
        const { data } = await supabase.from('profiles').select('role').eq('id', session.user.id).single();
        if (data?.role === 'driver' || data?.role === 'operator') {
          setRole(data.role);
        }
      }
    })();
  }, []);

  const categories = getFAQCategories(role);
  const filtered = supportFAQ.filter((f) => {
    if (f.role !== role) return false;
    if (!query.trim()) return true;
    const lower = query.toLowerCase();
    return f.question.toLowerCase().includes(lower) || f.answer.toLowerCase().includes(lower) || f.tags.some((t) => t.toLowerCase().includes(lower));
  });

  const grouped = categories.map((cat) => ({
    category: cat,
    items: filtered.filter((f) => f.category === cat),
  })).filter((g) => g.items.length > 0);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft size={22} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.heading}>FAQ</Text>
          <Text style={styles.subheading}>
            Common questions from {role}
          </Text>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchBar}>
        <Search size={20} color={colors.textMuted} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search the FAQ"
          placeholderTextColor={colors.textSubtle}
          style={styles.searchInput}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      {/* Role chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.roleChips}
      >
        {(['guests', 'drivers', 'operators'] as const).map((r) => (
          <TouchableOpacity
            key={r}
            onPress={() => setRole(r)}
            style={[styles.chip, role === r && styles.chipActive]}
          >
            <Text style={[styles.chipText, role === r && styles.chipTextActive]}>
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 80 }]}
        showsVerticalScrollIndicator={false}
      >
        {grouped.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No matches</Text>
            <Text style={styles.emptyHint}>Try a different search term</Text>
          </View>
        ) : (
          grouped.map((g) => (
            <View key={g.category} style={styles.categorySection}>
              <Text style={styles.categoryTitle}>{g.category}</Text>
              {g.items.map((item) => (
                <FaqItem
                  key={item.id}
                  question={item.question}
                  answer={item.answer}
                  expanded={expanded === item.id}
                  onPress={() => setExpanded(expanded === item.id ? null : item.id)}
                />
              ))}
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

function FaqItem({
  question, answer, expanded, onPress,
}: { question: string; answer: string; expanded: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity
      style={[styles.faqItem, expanded && styles.faqItemExpanded]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <View style={styles.faqItemHeader}>
        <Text style={styles.faqQuestion}>{question}</Text>
        <ChevronDown
          size={20}
          color={colors.textMuted}
          style={expanded ? { transform: [{ rotate: '180deg' }] } : {}}
        />
      </View>
      {expanded && (
        <Text style={styles.faqAnswer}>{answer}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.md,
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
  heading: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.extrabold,
    color: colors.text,
  },
  subheading: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surfaceSunken,
    borderRadius: radius.xl,
    paddingHorizontal: spacing.md,
    height: 48,
    marginHorizontal: spacing.lg,
    marginTop: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: fontSize.base,
    color: colors.text,
  },
  roleChips: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.text,
  },
  chipTextActive: {
    color: '#fff',
  },
  content: {
    paddingHorizontal: spacing.lg,
  },
  categorySection: {
    marginBottom: spacing.lg,
  },
  categoryTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  faqItem: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  faqItemExpanded: {
    borderColor: colors.primary,
  },
  faqItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  faqQuestion: {
    flex: 1,
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
    color: colors.text,
  },
  faqAnswer: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    lineHeight: 20,
    marginTop: spacing.sm,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
    gap: spacing.xs,
  },
  emptyText: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  emptyHint: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },
});
