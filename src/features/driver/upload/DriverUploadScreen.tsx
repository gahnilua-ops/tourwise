// Mirrors DriverUploadPage.tsx on web — document upload via tokenized link or session.
// 4 fields: vehicle photo, driver selfie, license, permit.
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { Car, Camera, FileText, CheckCircle, Loader2, ShieldCheck, ArrowLeft } from 'lucide-react-native';
import { supabase } from '@/core/services/supabaseClient';
import { Button } from '@/shared/components/Button';
import { Badge } from '@/shared/components/Badge';
import { colors, radius, spacing, fontSize, fontWeight } from '@/app/theme';

type RouteParams = { token?: string; field?: string };

interface UploadFieldDef {
  key: string;
  label: string;
  icon: any;
  accept: string;
}

const FIELDS: UploadFieldDef[] = [
  { key: 'vehicle_photo', label: 'Vehicle Photo', icon: Car, accept: 'image/*' },
  { key: 'driver_selfie', label: "Driver's Selfie", icon: Camera, accept: 'image/*' },
  { key: 'license', label: "Driver's License", icon: FileText, accept: 'image/*' },
  { key: 'permit', label: 'Operator Permit', icon: ShieldCheck, accept: 'image/*' },
];

type FieldKey = UploadFieldDef['key'];

export function DriverUploadScreen() {
  const route = useRoute<RouteProp<Record<string, RouteParams>, string>>();
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { token, field: requestedField } = route.params as RouteParams;

  const [status, setStatus] = React.useState<'loading' | 'ready' | 'invalid' | 'used' | 'expired'>('loading');
  const [files, setFiles] = React.useState<Record<FieldKey, string | null>>({
    vehicle_photo: null,
    driver_selfie: null,
    license: null,
    permit: null,
  });
  const [uploading, setUploading] = React.useState<FieldKey | null>(null);
  const [done, setDone] = React.useState<Record<FieldKey, boolean>>({
    vehicle_photo: false,
    driver_selfie: false,
    license: false,
    permit: false,
  });
  const [error, setError] = React.useState('');

  const visibleFields = requestedField
    ? FIELDS.filter((f) => f.key === requestedField)
    : FIELDS;

  React.useEffect(() => {
    if (!token) {
      setStatus('invalid');
      return;
    }
    (async () => {
      try {
        const { data, error } = await supabase.functions.invoke('driver-upload', {
          body: { token },
          method: 'GET',
        });
        if (error) throw error;
        if (data?.valid) setStatus('ready');
        else if (data?.used) setStatus('used');
        else if (data?.expired) setStatus('expired');
        else setStatus('invalid');
      } catch {
        setStatus('invalid');
      }
    })();
  }, [token]);

  const pickFile = async (field: FieldKey) => {
    const fieldDef = FIELDS.find((f) => f.key === field);
    if (!fieldDef) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: fieldDef.accept === 'image/*' ? ['images'] : ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.85,
    });
    if (!result.canceled && result.assets[0]) {
      setFiles((prev) => ({ ...prev, [field]: result.assets[0].uri }));
    }
  };

  const upload = async (field: FieldKey) => {
    if (!token || !files[field]) return;
    setUploading(field);
    setError('');
    try {
      const uri = files[field]!;
      const response = await fetch(uri);
      const blob = await response.blob();

      const formData = new FormData();
      formData.append('token', token);
      formData.append('field', field);
      formData.append('file', blob, `${field}-${Date.now()}.jpg`);

      const { data, error } = await supabase.functions.invoke('driver-upload', {
        body: formData,
      });
      if (error || !data?.ok) throw new Error(data?.error || 'Upload failed');
      setDone((d) => ({ ...d, [field]: true }));
    } catch (e: any) {
      setError(e?.message || 'Upload failed');
    } finally {
      setUploading(null);
    }
  };

  if (status === 'loading') {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (status === 'invalid') {
    return (
      <View style={[styles.container, styles.centered, { paddingTop: insets.top + spacing.xl }]}>
        <Text style={styles.errorTitle}>Invalid or missing upload link</Text>
        <Text style={styles.errorBody}>
          This upload link is not valid. Please request a new link from the admin.
        </Text>
        <Button title="Back" onPress={() => navigation.goBack()} style={{ marginTop: spacing.md }} />
      </View>
    );
  }

  if (status === 'used' || status === 'expired') {
    return (
      <View style={[styles.container, styles.centered, { paddingTop: insets.top + spacing.xl }]}>
        <View style={styles.statusIcon}>
          {status === 'used' ? (
            <CheckCircle size={48} color={colors.success} />
          ) : (
            <Text style={styles.expiredIcon}>⏱</Text>
          )}
        </View>
        <Text style={styles.statusTitle}>
          {status === 'used' ? 'Upload Completed' : 'Link Expired'}
        </Text>
        <Text style={styles.statusBody}>
          {status === 'used'
            ? 'All requested documents have been uploaded.'
            : 'This upload link has expired. Please request a new one from the admin.'}
        </Text>
        <Button title="Back" onPress={() => navigation.goBack()} style={{ marginTop: spacing.md }} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        paddingTop: insets.top + spacing.xl,
        paddingBottom: insets.bottom + spacing.xl,
        paddingHorizontal: spacing.lg,
      }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Upload Documents</Text>
          <Text style={styles.cardSubtitle}>
            {requestedField
              ? `Uploading: ${FIELDS.find((f) => f.key === requestedField)?.label}`
              : 'Upload all required documents'}
          </Text>
        </View>

        {error && <Text style={styles.formError}>{error}</Text>}

        {visibleFields.map((f) => (
          <UploadField
            key={f.key}
            field={f}
            file={files[f.key]}
            uploading={uploading === f.key}
            done={done[f.key]}
            onPick={() => pickFile(f.key)}
            onUpload={() => upload(f.key)}
            onRemove={() => setFiles((prev) => ({ ...prev, [f.key]: null }))}
          />
        ))}

        {visibleFields.every((f) => done[f.key]) && (
          <View style={styles.allDone}>
            <CheckCircle size={40} color={colors.success} />
            <Text style={styles.allDoneText}>All documents uploaded successfully!</Text>
            <Button title="Done" onPress={() => navigation.goBack()} size="md" style={{ marginTop: spacing.md, width: 200 }} />
          </View>
        )}
      </View>
    </ScrollView>
  );
}

function UploadField({
  field,
  file,
  uploading,
  done,
  onPick,
  onUpload,
  onRemove,
}: {
  field: UploadFieldDef;
  file: string | null;
  uploading: boolean;
  done: boolean;
  onPick: () => void;
  onUpload: () => void;
  onRemove: () => void;
}) {
  return (
    <View style={styles.fieldRow}>
      <View style={styles.fieldIcon}>
        <field.icon size={24} color={done ? colors.success : colors.accent} />
      </View>
      <View style={styles.fieldContent}>
        <Text style={styles.fieldLabel}>{field.label}</Text>
        <Text style={styles.fieldStatus}>
          {done ? 'Uploaded ✓' : file ? 'File selected' : 'Tap to upload'}
        </Text>
      </View>
      <View style={styles.fieldActions}>
        {done ? (
          <Badge variant="success" size="sm">Done</Badge>
        ) : file ? (
          <>
            <TouchableOpacity onPress={onUpload} disabled={uploading} activeOpacity={0.75} style={styles.actionBtn}>
              {uploading ? (
                <Loader2 size={18} color="#fff" />
              ) : (
                <Text style={styles.actionBtnText}>Upload</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={onRemove} activeOpacity={0.75}>
              <Text style={styles.removeText}>Remove</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity onPress={onPick} activeOpacity={0.75} style={styles.actionBtn}>
            <Text style={styles.actionBtnText}>Select File</Text>
          </TouchableOpacity>
        )}
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
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.lg,
    gap: spacing.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  cardHeader: {
    gap: spacing.xs,
  },
  cardTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  cardSubtitle: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },
  formError: {
    fontSize: fontSize.sm,
    color: colors.error,
    backgroundColor: colors.errorBg,
    padding: spacing.md,
    borderRadius: radius.md,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  fieldIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceSunken,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fieldContent: {
    flex: 1,
    gap: 2,
  },
  fieldLabel: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
    color: colors.text,
  },
  fieldStatus: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
  },
  fieldActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
  },
  actionBtnText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: '#fff',
  },
  removeText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
    color: colors.error,
  },
  allDone: {
    alignItems: 'center',
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  allDoneText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.success,
  },
  statusIcon: {
    marginBottom: spacing.md,
  },
  expiredIcon: {
    fontSize: 48,
  },
  statusTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.text,
    textAlign: 'center',
  },
  statusBody: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: spacing.xl,
  },
  errorTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text,
    textAlign: 'center',
  },
  errorBody: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.md,
  },
});
