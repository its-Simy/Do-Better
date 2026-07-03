import React from 'react';

/* Do Better — app settings store.
 * Front-end only: preferences persist to localStorage; defaults are merged
 * over saved values per section, so adding a new setting never breaks an
 * existing save.
 */
const STORAGE_KEY = 'do-better:settings';

export const DEFAULT_SETTINGS = {
  general: {
    notifications: true,
    notificationType: 'email', // 'email' | 'text' | 'both'
    timeFormat: '12h', // '12h' | '24h'
    weekStart: 'monday', // 'monday' | 'sunday'
  },
  lists: {
    autoDeleteEmpty: false,
    confirmDelete: true,
    showCompleted: true,
    completedToBottom: false,
    defaultColor: 'sprout',
  },
  goals: {
    activityChart: 'heatmap', // 'heatmap' | 'bar' | 'line'
    progressStyle: 'bar', // 'bar' | 'ring'
    showTargets: true,
    showInsights: true,
  },
  sleep: {
    chartType: 'bar', // 'bar' | 'line' | 'heatmap'
    showGoalLine: true,
    goalHours: 7.5,
    showInsights: true,
  },
};

function mergeWithDefaults(saved) {
  return Object.fromEntries(Object.entries(DEFAULT_SETTINGS).map(([section, defaults]) => [
    section,
    { ...defaults, ...(saved && typeof saved[section] === 'object' ? saved[section] : {}) },
  ]));
}

function loadSettings() {
  try {
    return mergeWithDefaults(JSON.parse(window.localStorage.getItem(STORAGE_KEY)));
  } catch {
    return mergeWithDefaults(null);
  }
}

const SettingsContext = React.createContext(null);

export function SettingsProvider({ children }) {
  const [settings, setSettings] = React.useState(loadSettings);

  React.useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      /* storage unavailable (private mode, quota) — settings stay in-memory */
    }
  }, [settings]);

  const updateSetting = React.useCallback((section, key, value) => {
    setSettings((current) => ({
      ...current,
      [section]: { ...current[section], [key]: value },
    }));
  }, []);

  const resetSettings = React.useCallback(() => {
    setSettings(mergeWithDefaults(null));
  }, []);

  const value = React.useMemo(
    () => ({ settings, updateSetting, resetSettings }),
    [settings, updateSetting, resetSettings],
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const context = React.useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within a SettingsProvider');
  return context;
}
