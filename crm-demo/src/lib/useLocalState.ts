import { useEffect, useRef, useState } from "react";

/**
 * Estado persistido en localStorage. Inicializa con `seed` la primera vez
 * y mantiene los cambios entre recargas (clave-versión para invalidar).
 */
export function useLocalState<T>(key: string, seed: T) {
  const storageKey = `nexum-crm:${key}`;
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) return JSON.parse(raw) as T;
    } catch {
      /* ignore */
    }
    return seed;
  });

  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
    }
    try {
      localStorage.setItem(storageKey, JSON.stringify(value));
    } catch {
      /* ignore */
    }
  }, [storageKey, value]);

  return [value, setValue] as const;
}
