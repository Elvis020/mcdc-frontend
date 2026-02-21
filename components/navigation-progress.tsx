"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  ReactNode,
} from "react";
import { usePathname } from "next/navigation";

interface NavigationContextType {
  isNavigating: boolean;
  startNavigation: () => void;
}

const NavigationContext = createContext<NavigationContextType>({
  isNavigating: false,
  startNavigation: () => {},
});

export function useNavigation() {
  return useContext(NavigationContext);
}

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [isNavigating, setIsNavigating] = useState(false);
  const [progress, setProgress] = useState(0);
  const pathname = usePathname();
  // Store timer handles so the effect cleanup can cancel both timers.
  // Previously, fadeTimer was created inside setTimeout and its clearTimeout
  // was never reachable by React's cleanup — it was a no-op closure.
  // This caused orphaned timers when startNavigation was called a second time
  // while the fade was in progress, creating competing timer chains.
  const completeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fadeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startNavigation = useCallback(() => {
    setIsNavigating(true);
    setProgress(30);
  }, []);

  // Complete when pathname changes
  useEffect(() => {
    if (isNavigating) {
      // Clear any leftover timers before starting new ones
      if (completeTimerRef.current) clearTimeout(completeTimerRef.current);
      if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);

      // Delay before completing to ensure page renders
      completeTimerRef.current = setTimeout(() => {
        setProgress(100);
        fadeTimerRef.current = setTimeout(() => {
          setIsNavigating(false);
          setProgress(0);
        }, 400);
      }, 150);
      return () => {
        if (completeTimerRef.current) clearTimeout(completeTimerRef.current);
        if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
      };
    }
  }, [pathname, isNavigating]);

  // Progress animation
  useEffect(() => {
    if (isNavigating && progress < 90) {
      const timer = setTimeout(() => {
        setProgress((p) => Math.min(p + 15, 90));
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isNavigating, progress]);

  return (
    <NavigationContext.Provider value={{ isNavigating, startNavigation }}>
      {children}
      {/* Progress bar at header bottom */}
      <div
        className="fixed top-20 left-0 right-0 h-0.5 bg-slate-200 overflow-hidden pointer-events-none z-50"
        style={{
          opacity: isNavigating ? 1 : 0,
          transition: "opacity 150ms",
        }}
      >
        <div
          className="h-full bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-500"
          style={{
            width: `${progress}%`,
            transition: "width 250ms cubic-bezier(0.4, 0, 0.2, 1)",
            boxShadow:
              "0 0 12px rgba(16, 185, 129, 0.9), 0 0 6px rgba(16, 185, 129, 0.6)",
          }}
        />
      </div>
    </NavigationContext.Provider>
  );
}
