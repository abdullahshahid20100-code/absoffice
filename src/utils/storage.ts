import { SavedDocument } from '../types';
import { INITIAL_SAVED_DOCS } from '../data/templates';

const DEVICE_ID_KEY = 'absoffice_device_id';

/**
 * Retrieves existing unique device/browser UUID from localStorage or generates a new one.
 */
export const getOrCreateDeviceId = (): string => {
  try {
    let deviceId = localStorage.getItem(DEVICE_ID_KEY);
    if (!deviceId) {
      // Check alternate legacy keys if any
      const legacyId = localStorage.getItem('deviceId') || localStorage.getItem('absoffice_user_id');
      if (legacyId && legacyId.trim()) {
        deviceId = legacyId.trim();
      } else if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        deviceId = crypto.randomUUID();
      } else {
        deviceId = 'dev_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 11);
      }
      localStorage.setItem(DEVICE_ID_KEY, deviceId);
    }
    return deviceId;
  } catch (e) {
    console.error('Failed to access localStorage for deviceId', e);
    return 'dev_local_fallback';
  }
};

/**
 * Returns the scoped storage key for the current browser/device.
 */
export const getScopedStorageKey = (customDeviceId?: string): string => {
  const deviceId = customDeviceId || getOrCreateDeviceId();
  return `absoffice_projects_${deviceId}`;
};

/**
 * Loads documents scoped strictly to the current browser/device UUID.
 */
export const loadUserDocuments = (customDeviceId?: string): SavedDocument[] => {
  const deviceId = customDeviceId || getOrCreateDeviceId();
  const scopedKey = getScopedStorageKey(deviceId);

  try {
    const rawData = localStorage.getItem(scopedKey);
    if (rawData !== null) {
      const parsed = JSON.parse(rawData);
      if (Array.isArray(parsed)) {
        // Filter and verify documents belong to this device
        return parsed
          .filter((doc) => !doc.deviceId || doc.deviceId === deviceId)
          .map((doc) => ({
            ...doc,
            deviceId: doc.deviceId || deviceId
          }));
      }
    }
  } catch (e) {
    console.error('Failed to parse scoped documents', e);
  }

  // First time initialization for this device: create starter documents tagged with deviceId
  const initialDocs: SavedDocument[] = INITIAL_SAVED_DOCS.map((doc, idx) => ({
    ...doc,
    id: `doc-${Date.now()}-${idx}`,
    deviceId: deviceId,
    updatedAt: Date.now() - idx * 3600000
  }));

  try {
    localStorage.setItem(scopedKey, JSON.stringify(initialDocs));
  } catch (e) {
    console.error('Failed to store initial docs', e);
  }

  return initialDocs;
};

/**
 * Persists documents scoped strictly to this browser's unique deviceId.
 */
export const saveUserDocuments = (documents: SavedDocument[], customDeviceId?: string): void => {
  const deviceId = customDeviceId || getOrCreateDeviceId();
  const scopedKey = getScopedStorageKey(deviceId);

  try {
    const scopedDocs = documents.map((doc) => ({
      ...doc,
      deviceId: doc.deviceId || deviceId
    }));
    localStorage.setItem(scopedKey, JSON.stringify(scopedDocs));
  } catch (e) {
    console.error('Failed to save scoped documents to localStorage', e);
  }
};

/**
 * Clears only the local user's document history without affecting other storage.
 */
export const clearUserDocuments = (customDeviceId?: string): void => {
  const deviceId = customDeviceId || getOrCreateDeviceId();
  const scopedKey = getScopedStorageKey(deviceId);

  try {
    localStorage.removeItem(scopedKey);
    localStorage.setItem(scopedKey, JSON.stringify([]));
  } catch (e) {
    console.error('Failed to clear user documents', e);
  }
};
