// Minimal IndexedDB helper for storing JSON-serializable values.
export const openDB = (dbName = 'ebay-template-builder', storeName = 'kv') => {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const req = indexedDB.open(dbName, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
};

export const idbGet = async (key: string, dbName = 'ebay-template-builder', storeName = 'kv') => {
  const db = await openDB(dbName, storeName);
  return new Promise<any>((resolve, reject) => {
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const req = store.get(key);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
};

export const idbSet = async (key: string, value: any, dbName = 'ebay-template-builder', storeName = 'kv') => {
  const db = await openDB(dbName, storeName);
  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const req = store.put(value, key);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
};

export const idbRemove = async (key: string, dbName = 'ebay-template-builder', storeName = 'kv') => {
  const db = await openDB(dbName, storeName);
  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const req = store.delete(key);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
};
