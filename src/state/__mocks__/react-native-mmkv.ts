/**
 * In-memory MMKV for Jest. Legend State persist uses createMMKV.
 */
const stores = new Map<string, Map<string, string | number | boolean>>();

function getStore(id: string): Map<string, string | number | boolean> {
  let store = stores.get(id);
  if (!store) {
    store = new Map();
    stores.set(id, store);
  }
  return store;
}

export function createMMKV(config: { id?: string } = {}) {
  const id = config.id ?? "mmkv.default";
  const store = getStore(id);

  return {
    getString: (key: string) => {
      const value = store.get(key);
      return typeof value === "string" ? value : undefined;
    },
    getNumber: (key: string) => {
      const value = store.get(key);
      return typeof value === "number" ? value : undefined;
    },
    getBoolean: (key: string) => {
      const value = store.get(key);
      return typeof value === "boolean" ? value : undefined;
    },
    set: (key: string, value: string | number | boolean) => {
      store.set(key, value);
    },
    remove: (key: string) => {
      store.delete(key);
    },
    delete: (key: string) => {
      store.delete(key);
    },
    contains: (key: string) => store.has(key),
    clearAll: () => {
      store.clear();
    },
    getAllKeys: () => [...store.keys()],
  };
}

export function clearAllMMKVStores() {
  stores.clear();
}

export const __stores = stores;
