"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { storage } from "@/lib/storage/storage";

/**
 * Lit une valeur du LocalStorage et se met à jour automatiquement.
 * `ready` passe à true une fois la lecture faite côté navigateur
 * (évite les écarts d'hydratation et les faux « liste vide »).
 */
export function useLocalStorage<T>(key: string, initial: T) {
  const initialRef = useRef(initial);
  const [value, setValue] = useState<T>(initial);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const read = () => setValue(storage.get<T>(key, initialRef.current));
    read();
    setReady(true);
    return storage.subscribe(key, read);
  }, [key]);

  const set = useCallback((next: T) => storage.set(key, next), [key]);
  return [value, set, ready] as const;
}
