
import { AppState } from '../types';
import { STORAGE_KEY, DEFAULT_SETTINGS } from '../constants';

export const storageService = {
  saveData: (data: AppState): void => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  },

  loadData: (): AppState => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        settings: DEFAULT_SETTINGS,
        logs: [],
        lastSmsSentAt: null
      };
    }
    return JSON.parse(raw);
  },

  reset: (): void => {
    localStorage.removeItem(STORAGE_KEY);
  }
};
