// Entry point after launch/login. Checks the signed-in user's role
// (from the Supabase `profiles` table) and routes into either the
// tourist shell or the driver shell.
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '@/core/services/supabaseClient';

export function RoleGate() {
  const navigation = useNavigation<any>();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        navigation.replace('Login');
        return;
      }

      // TODO: fetch role from `profiles` table and route accordingly.
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (profile?.role === 'driver') {
        navigation.replace('DriverShell');
      } else {
        navigation.replace('TouristShell');
      }
      setChecking(false);
    })();
  }, [navigation]);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      {checking && <ActivityIndicator size="large" />}
    </View>
  );
}
