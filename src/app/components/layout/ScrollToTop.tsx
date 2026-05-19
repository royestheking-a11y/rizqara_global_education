import { useEffect } from "react";
import { useLocation } from "react-router";
import { api } from "../../services/api";

export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant", // Use "instant" to avoid smooth scroll flashing when navigating
    });

    // Track page views on route changes (excluding admin dashboard page views)
    if (!pathname.startsWith('/admin')) {
      api.post('/stats/view').catch((err) => {
        console.error("Failed to track page view", err);
      });
    }
  }, [pathname]);

  return null;
}
