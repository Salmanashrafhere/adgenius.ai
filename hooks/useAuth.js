"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export function useAuth(requireAuth = true) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      if (supabase) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setSession(session);
          setUser(session.user);
        } else {
          // Check for demo user even if supabase exists but no session
          const demoUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
          if (demoUser) {
            setUser(JSON.parse(demoUser));
          } else if (requireAuth) {
            router.push("/login");
          }
        }
        setLoading(false);

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
          setSession(session);
          setUser(session?.user || null);
          if (requireAuth && !session) {
            // Check for demo user on auth change too
            const demoUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
            if (demoUser) {
              setUser(JSON.parse(demoUser));
            } else {
              router.push("/login");
            }
          }
        });

        return () => subscription.unsubscribe();
      } else {
        // Demo Mode
        const demoUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
        if (demoUser) {
          setUser(JSON.parse(demoUser));
        } else if (requireAuth) {
          router.push("/login");
        }
        setLoading(false);
      }
    };

    checkAuth();
  }, [requireAuth, router]);

  return { session, user, loading };
}
