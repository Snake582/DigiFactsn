import type { BaseEntity } from "@/types/common.types";
import { generateId } from "@/lib/utils/generate-id";
import { STORAGE_KEYS } from "./storage-keys";

const EVENT = "digifact:storage";
const isBrowser = () => typeof window !== "undefined";

export const storage = {
  get<T>(key: string, fallback: T): T {
    if (!isBrowser()) return fallback;
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
      return fallback;
    }
  },

  set<T>(key: string, value: T) {
    if (!isBrowser()) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      window.dispatchEvent(new CustomEvent(EVENT, { detail: key }));
    } catch (error) {
      console.error("DigiFact : impossible d'enregistrer les données.", error);
    }
  },

  remove(key: string) {
    if (!isBrowser()) return;
    window.localStorage.removeItem(key);
    window.dispatchEvent(new CustomEvent(EVENT, { detail: key }));
  },

  /** Réagit aux changements faits dans cet onglet ou dans un autre onglet. */
  subscribe(key: string, callback: () => void) {
    const onLocal = (event: Event) => {
      if ((event as CustomEvent<string>).detail === key) callback();
    };
    const onOther = (event: StorageEvent) => {
      if (event.key === key || event.key === null) callback();
    };
    window.addEventListener(EVENT, onLocal);
    window.addEventListener("storage", onOther);
    return () => {
      window.removeEventListener(EVENT, onLocal);
      window.removeEventListener("storage", onOther);
    };
  },

  exportAll(): Record<string, unknown> {
    const data: Record<string, unknown> = {};
    for (const key of Object.values(STORAGE_KEYS)) data[key] = storage.get<unknown>(key, null);
    return data;
  },

  importAll(data: Record<string, unknown>) {
    for (const key of Object.values(STORAGE_KEYS)) {
      if (data[key] !== undefined && data[key] !== null) storage.set(key, data[key]);
    }
  },

  clearAll() {
    for (const key of Object.values(STORAGE_KEYS)) storage.remove(key);
  },
};

/** CRUD générique pour une collection d'entités stockée dans LocalStorage. */
export function createRepository<T extends BaseEntity>(key: string) {
  type Input = Omit<T, keyof BaseEntity>;
  const list = () => storage.get<T[]>(key, []);

  return {
    list,
    get: (id: string) => list().find((item) => item.id === id),
    create(data: Input): T {
      const now = new Date().toISOString();
      const item = { ...data, id: generateId(), createdAt: now, updatedAt: now } as unknown as T;
      storage.set(key, [...list(), item]);
      return item;
    },
    update(id: string, patch: Partial<Input>) {
      storage.set(
        key,
        list().map((item) =>
          item.id === id ? { ...item, ...patch, updatedAt: new Date().toISOString() } : item,
        ),
      );
    },
    remove(id: string) {
      storage.set(key, list().filter((item) => item.id !== id));
    },
  };
}
