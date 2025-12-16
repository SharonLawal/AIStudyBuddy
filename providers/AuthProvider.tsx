import React, { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "../libs/supabase";

type AuthContextType = {
  session: Session | null;
  loading: boolean;
  user: User | null;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  loading: true,
  user: null,
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{ session, loading, user: session?.user ?? null }}
    >
      {children}
    </AuthContext.Provider>
  );
}
