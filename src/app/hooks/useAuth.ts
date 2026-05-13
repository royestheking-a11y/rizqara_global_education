import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";

export { useAuth } from "../context/AuthContext";
export type { User } from "../context/AuthContext";

export function useSavedScholarships() {
  const { user, isLoggedIn, refreshProfile } = useAuth();
  const [localSaved, setLocalSaved] = useState<string[]>([]);

  const toggle = async (id: string) => {
    if (isLoggedIn && user) {
      const currentSaved = user.savedScholarships || [];
      const isCurrentlySaved = currentSaved.includes(id);
      const updatedSaved = isCurrentlySaved
        ? currentSaved.filter(s => s !== id)
        : [...currentSaved, id];
      
      try {
        await api.put('/auth/profile', { savedScholarships: updatedSaved });
        await refreshProfile();
      } catch (err) {
        console.error("Failed to toggle saved scholarship", err);
      }
    } else {
      setLocalSaved(prev => 
        prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
      );
    }
  };

  return {
    saved: isLoggedIn && user ? user.savedScholarships || [] : localSaved,
    toggle,
    isSaved: (id: string) => isLoggedIn && user 
      ? (user.savedScholarships || []).includes(id) 
      : localSaved.includes(id)
  };
}
