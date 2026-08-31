// Mirrors DriverRegister.tsx on web.
// Driver/operator registration form with vehicle details + permit upload.
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ImagePicker } from 'expo-image-picker';
import {
  Car, Phone, Upload, FileText, CheckCircle, ArrowLeft, User, X, Loader2,
  ChevronLeft, ChevronRight,
} from 'lucide-react-native';
import { supabase } from '@/core/services/supabaseClient';
import { VEHICLE_TYPES, DRIVER_TYPES, VehicleType, DriverType } from '@/core/constants/appConstants';
import { Field } from '@/shared/components/Field';
import { Button } from '@/shared/components/Button';
import { colors, radius, spacing, fontSize, fontWeight } from '@/app/theme';

export function DriverRegisterScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const [driverName, setDriverName] = React.useState('');
  const [contactNumber, setContactNumber] = React.useState('');
  const [type, setType] = React.useState<DriverType>('driver');
  const [vehicleType, setVehicleType] = React.useState<VehicleType>('');
  const [vehicleColor, setVehicleColor] = React.useState('');
  const [plateNumber, setPlateNumber] = React.useState('');
  const [permitUri, setPermitUri] = React.useState<string | null>(null);

  const [submitting, setSubmitting] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const [error, setError] = React.useState('');

  const uploadFile = async (uri: string, folder: string): Promise<string | null> => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const fileName = `${folder}-${Date.now()}-${uri.split('/').pop() || 'file'}`;
    const path = `drivers/${(await supabase.auth.getSession()).data.session?.user.id}/${fileName}`;

    const { error } = await supabase.storage.from('driver-docs').upload(path, blob, { upsert: true, cacheControl: '3600' });
    if (error) throw error;
    return supabase.storage.from('driver-docs').getPublicUrl(path).data.publicUrl;
  };

  const pickPermit = async () => {
    const result = await ImagePicker.launchDocumentPickerAsync({
      allowedTypes: ['image/*', 'application/pdf'],
    });
    if (!result.canceled && result.assets[0]) {
      setPermitUri(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    setError('');
    if (!driverName.trim() || !contactNumber.trim() || !vehicleType || !vehicleColor.trim() || !plateNumber.trim()) {
      setError('Please fill in all required fields.');
      return;
    }
    if (type === 'operator' && !permitUri) {
      setError('Operators must upload their business / permit papers.');
      return;
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      Alert.alert('Sign in required', 'Please sign in to register as a driver.', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign in', onPress: () => navigation.navigate('Login') },
      ]);
      return;
    }

    setSubmitting(true);
    try {
      let permitUrl: string | null = null;
      if (permitUri) permitUrl = await uploadFile(permitUri, 'permit');

      const { error: insertError } = await supabase.from('drivers').insert({
        user_id: session.user.id,
        email: session.user.email || null,
        driver_name: driverName.trim(),
        contact_number: contactNumber.trim(),
        type,
        vehicle_type: vehicleType,
        vehicle_color: vehicleColor.trim(),
        plate_number: plateNumber.trim(),
        permit_url: permitUrl,
        status: 'pending',
      });
      if (insertError) throw insertError;
      setDone(true);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <View style={[styles.successContainer, { paddingTop: insets.top + spacing.xl }]}>
        <View style={styles.successCard}>
          <View style={styles.successIcon}>
            <CheckCircle size={40} color={colors.success} />
          </View>
          <Text style={styles.successTitle}>Application Received!</Text>
          <Text style={styles.successBody}>
            Thank you, {driverName.split(' ')[0] || 'partner'}! Our team will review your registration and notify you once approved. We may send you a secure link to upload your photo and license.
          </Text>
          <Button
            title="Back to Home"
            onPress={() => navigation.reset({ routes: [{ name: 'TouristShell' }] })}
            size="lg"
            fullWidth
            style={{ marginTop: spacing.md }}
          />
        </View>
      </View>
    );
  }

  // Check if user is signed in
  const [session, setSession] = React.useState<any>(null);
  const [loadingSession, setLoadingSession] = React.useState(true);

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoadingSession(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  if (loadingSession) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={colors.primary} />
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
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {/* Back button */}
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => navigation.goBack()}
        activeOpacity={0.75}
      >
        <ChevronLeft size={22} color={colors.text} />
        <Text style={styles.backBtnText}>Back</Text>
      </TouchableOpacity>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Car size={28} color="#2c3400" />
        </View>
        <Text style={styles.headerTitle}>Drive with TourWise</Text>
        <Text style={styles.headerSubtitle}>Register as a driver or operator partner</Text>
      </View>

      <View style={styles.form}>
        {/* Name + Phone */}
        <View style={styles.row}>
          <Field
            label="Driver Name *"
            value={driverName}
            onChangeText={setDriverName}
            placeholder="Juan Dela Cruz"
            autoCapitalize="words"
            required
          />
          <Field
            label="Contact Number *"
            value={contactNumber}
            onChangeText={setContactNumber}
            placeholder="+63 912 345 6789"
            keyboardType="phone-pad"
            required
          />
        </View>

        {/* Partner type */}
        <Text style={styles.subSectionTitle}>Partner Type</Text>
        <View style={styles.typeChips}>
          {DRIVER_TYPES.map((t) => (
            <TouchableOpacity
              key={t}
              onPress={() => setType(t)}
              style={[styles.typeChip, type === t && styles.typeChipActive]}
            >
              <Text style={[styles.typeChipText, type === t && styles.typeChipTextActive]}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Vehicle details */}
        <Text style={styles.subSectionTitle}>Vehicle Details</Text>
        <View style={styles.row}>
          <Field
            label="Type *"
            value={vehicleType}
            onChangeText={(t) => setVehicleType(t as VehicleType)}
            placeholder="Select"
            required
          />
          <Field
            label="Color *"
            value={vehicleColor}
            onChangeText={setVehicleColor}
            placeholder="White"
            required
          />
          <Field
            label="Plate Number *"
            value={plateNumber}
            onChangeText={setPlateNumber}
            placeholder="XYZ-123"
            required
          />
        </View>

        {/* Permit for operators */}
        {type === 'operator' && (
          <View style={styles.permitSection}>
            <Text style={styles.subSectionTitle}>Business / Permit Papers *</Text>
            <TouchableOpacity
              style={[styles.permitBtn, permitUri && styles.permitBtnHasFile]}
              onPress={pickPermit}
              activeOpacity={0.75}
            >
              <FileText size={20} color={permitUri ? colors.success : colors.accent} />
              <Text style={[styles.permitBtnText, permitUri && styles.permitBtnTextHasFile]}>
                {permitUri ? 'Permit uploaded ✓' : 'Upload business permit / DTI / SEC papers'}
              </Text>
              {permitUri && (
                <TouchableOpacity onPress={() => setPermitUri(null)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <X size={18} color={colors.textMuted} />
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          </View>
        )}

        {error && <Text style={styles.error}>{error}</Text>}

        <Button
          title={submitting ? 'Submitting...' : 'Submit Registration'}
          onPress={handleSubmit}
          disabled={submitting}
          loading={submitting}
          size="lg"
          fullWidth
        />

        <Text style={styles.note}>
          Your photo and license are uploaded later via a secure link we send you.
        </Text>
      </View>
    </ScrollView>
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
  successContainer: {
    flex: 1,
    alignItems: 'center',
  },
  successCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.xl,
    width: '100%',
    alignItems: 'center',
    gap: spacing.lg,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.successBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.text,
    textAlign: 'center',
  },
  successBody: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.xs,
  },
  backBtnText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.text,
  },
  header: {
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  headerIcon: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.extrabold,
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },
  form: {
    gap: spacing.lg,
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  subSectionTitle: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: colors.accent,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: spacing.sm,
  },
  typeChips: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  typeChip: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  typeChipActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  typeChipText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: colors.textMuted,
  },
  typeChipTextActive: {
    color: colors.primary,
  },
  permitSection: {
    gap: spacing.sm,
  },
  permitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceSunken,
    borderWidth: 1,
    borderColor: colors.border,
  },
  permitBtnHasFile: {
    borderColor: colors.success,
    backgroundColor: colors.successBg,
  },
  permitBtnText: {
    flex: 1,
    fontSize: fontSize.sm,
    color: colors.text,
  },
  permitBtnTextHasFile: {
    color: colors.success,
    fontWeight: fontWeight.medium,
  },
  error: {
    fontSize: fontSize.sm,
    color: colors.error,
    textAlign: 'center',
  },
  note: {
    fontSize: fontSize.xs,
    color: colors.textSubtle,
    textAlign: 'center',
    marginTop: spacing.md,
  },
});
