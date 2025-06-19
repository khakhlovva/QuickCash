import type { Session, User } from '@supabase/supabase-js';
import {
  type PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import type { Profile } from '~/types/profile';

import { supabase } from '~/lib/supabase';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  profile: null,
});

export default function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  const user = session?.user || null;

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  useEffect(() => {
    if (!user) {
      setProfile(null);

      return;
    }

    const fetchProfile = async () => {
      const { data } = await supabase
        .from('User')
        .select('*')
        .eq('id', user.id)
        .single();

      setProfile(data as Profile);
    };

    fetchProfile();
  }, [user]);

  return (
    <AuthContext.Provider value={{ session, user, profile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

