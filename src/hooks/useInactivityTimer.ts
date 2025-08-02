import { useState, useEffect, useRef, RefObject } from 'react';

export function useInactivityTimer(
  ref: RefObject<HTMLElement>,
  delay: number = 1000
): boolean {
  const [isActive, setIsActive] = useState(true);
  const inactivityTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleActivity = () => {
      setIsActive(true);
      if (inactivityTimer.current) {
        clearTimeout(inactivityTimer.current);
      }
      inactivityTimer.current = setTimeout(() => {
        setIsActive(false);
      }, delay);
    };

    const element = ref.current;
    if (element) {
      element.addEventListener('mousemove', handleActivity);
      element.addEventListener('mousedown', handleActivity);
      element.addEventListener('touchstart', handleActivity);
      element.addEventListener('touchmove', handleActivity);
      handleActivity(); // Initial call
    }

    return () => {
      if (element) {
        element.removeEventListener('mousemove', handleActivity);
        element.removeEventListener('mousedown', handleActivity);
        element.removeEventListener('touchstart', handleActivity);
        element.removeEventListener('touchmove', handleActivity);
      }
      if (inactivityTimer.current) {
        clearTimeout(inactivityTimer.current);
      }
    };
  }, [ref, delay]);

  return isActive;
}
