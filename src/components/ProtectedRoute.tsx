import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("ProtectedRoute: Starting auth check");
    let mounted = true;

    const checkSession = async () => {
      try {
        console.log("ProtectedRoute: Checking session...");
        const { data: { session }, error } = await supabase.auth.getSession();
        console.log("ProtectedRoute: Session result", { session: !!session, error });
        
        if (mounted) {
          setUser(session?.user ?? null);
          setLoading(false);
          console.log("ProtectedRoute: Auth check complete", { hasUser: !!session?.user });
        }
      } catch (error) {
        console.error("ProtectedRoute: Auth error", error);
        if (mounted) {
          setUser(null);
          setLoading(false);
        }
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("ProtectedRoute: Auth state changed", { event, hasUser: !!session?.user });
        if (mounted) {
          setUser(session?.user ?? null);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  console.log("ProtectedRoute: Render state", { loading, hasUser: !!user });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-subtle">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log("ProtectedRoute: Redirecting to /auth");
    return <Navigate to="/auth" replace />;
  }

  console.log("ProtectedRoute: Rendering protected content");
  return <>{children}</>;
};

export default ProtectedRoute;
