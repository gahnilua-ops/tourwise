// Mirrors NotificationBell.tsx / lib/useNotifications.ts on web.
// Mobile uses real push via Expo Notifications (FCM/APNs), triggered
// from a Supabase DB webhook or Edge Function.
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { supabase } from './supabaseClient';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function registerForPushNotificationsAsync(): Promise<string | null> {
  if (!Device.isDevice) return null;

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') return null;

  const token = (await Notifications.getExpoPushTokenAsync()).data;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
    });
  }

  // Persist token against the current user in Supabase
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.user?.id) {
    await supabase
      .from('push_tokens')
      .upsert({ user_id: session.user.id, token, platform: Platform.OS, updated_at: new Date().toISOString() });
  }

  return token;
}
