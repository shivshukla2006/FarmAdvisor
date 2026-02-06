import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export type UserRole = "admin" | "moderator" | "user";

export const useUserRole = () => {
  const { user, loading: authLoading } = useAuth();
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Wait for auth to finish loading before fetching roles
    if (authLoading) {
      setIsLoading(true);
      return;
    }

    const fetchUserRoles = async () => {
      if (!user) {
        setRoles([]);
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id);

        if (error) throw error;

        setRoles(data?.map((r) => r.role as UserRole) || []);
      } catch (error) {
        console.error("Error fetching user roles:", error);
        setRoles([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserRoles();
  }, [user, authLoading]);

  const hasRole = (role: UserRole) => roles.includes(role);
  const isAdmin = hasRole("admin");
  const isModerator = hasRole("moderator");

  return {
    roles,
    isLoading,
    hasRole,
    isAdmin,
    isModerator,
  };
};
