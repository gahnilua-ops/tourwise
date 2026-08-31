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
    let mounted = true;

    (async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        if (mounted) navigation.replace('Login');
        return;
      }

      // Fetch role from `profiles` table
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (!mounted) return;

      if (profile?.role === 'driver') {
        navigation.replace('DriverShell');
      } else {
        navigation.replace('TouristShell');
      }
      setChecking(false);
    })();

    // Listen for auth changes (e.g. magic link clicks)
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      if (!session) {
        navigation.replace('Login');
        return;
      }
      // Refetch profile on sign-in
      supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single()
        .then(({ data: profile }) => {
          if (!mounted) return;
          if (profile?.role === 'driver') {
            navigation.replace('DriverShell');
          } else {
            navigation.replace('TouristShell');
          }
        });
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [navigation]);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      {checking && <ActivityIndicator size="large" color="#0E7C7B" />}
    </View>
  );
}
