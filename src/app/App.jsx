import React from 'react';
import { AppShell, TopBar } from '../layout/AppShell.jsx';
import { Button, Icon } from '../components';
import { StartPage } from '../pages/Start/StartPage.jsx';
import { GOALS_LIST } from '../pages/Goals/GoalsPage.jsx';
import { SettingsProvider } from '../state/SettingsContext.jsx';
import { ListsProvider, useLists } from '../state/ListsContext.jsx';
import { APP_ROUTES, PRIMARY_ROUTE_IDS } from './routes.js';

/* Inside the providers so the sidebar badges track the real list count. */
function AppChrome({ active, onNavigate, themePreference, onThemePreferenceChange }) {
  const { lists } = useLists();
  const route = APP_ROUTES[active];
  const Screen = route?.component;

  return (
    <AppShell
      active={active} onNavigate={onNavigate}
      counts={{ lists: lists.length, goals: GOALS_LIST.length }}
    >
      <TopBar title={route.title} subtitle={route.subtitle} actions={
        <Button
          variant="primary"
          iconLeft={<Icon name="plus" size={16} />}
          onClick={() => onNavigate('create')}
        >
          New
        </Button>
      } />
      <Screen
        onNavigate={onNavigate}
        themePreference={themePreference}
        onThemePreferenceChange={onThemePreferenceChange}
      />
    </AppShell>
  );
}

export function App() {
  const [active, setActive] = React.useState('start');
  const [themePreference, setThemePreference] = React.useState('light');
  const [systemDark, setSystemDark] = React.useState(() => (
    window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false
  ));
  const [switching, setSwitching] = React.useState(false);
  const firstRun = React.useRef(true);
  const dark = themePreference === 'system' ? systemDark : themePreference === 'dark';

  React.useEffect(() => {
    const media = window.matchMedia?.('(prefers-color-scheme: dark)');
    if (!media) return undefined;

    const handleChange = (event) => setSystemDark(event.matches);
    media.addEventListener('change', handleChange);
    return () => media.removeEventListener('change', handleChange);
  }, []);

  // Suppress transitions for one frame whenever the theme flips, so colors
  // backed by var() snap to their new resolved values instead of freezing.
  React.useLayoutEffect(() => {
    if (firstRun.current) { firstRun.current = false; return; }
    setSwitching(true);
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setSwitching(false)));
    return () => cancelAnimationFrame(id);
  }, [dark]);

  const startOptions = PRIMARY_ROUTE_IDS.map((id) => ({ id, ...APP_ROUTES[id] }));

  return (
    <div
      data-theme={dark ? 'dark' : 'light'}
      data-hover-highlight="on"
      data-theme-switching={switching ? '' : undefined}
      style={{ height: '100%' }}
    >
      <SettingsProvider>
        <ListsProvider>
          {active === 'start' ? (
            <StartPage options={startOptions} onNavigate={setActive} />
          ) : (
            <AppChrome
              active={active}
              onNavigate={setActive}
              themePreference={themePreference}
              onThemePreferenceChange={setThemePreference}
            />
          )}
        </ListsProvider>
      </SettingsProvider>
    </div>
  );
}
