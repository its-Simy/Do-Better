import React from 'react';
import { AppShell, TopBar } from '../layout/AppShell.jsx';
import { Button, IconButton, Icon } from '../components';
import { StartPage } from '../pages/Start/StartPage.jsx';
import { APP_ROUTES, PRIMARY_ROUTE_IDS } from './routes.js';

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

  const route = APP_ROUTES[active];
  const Screen = route?.component;
  const startOptions = PRIMARY_ROUTE_IDS.map((id) => ({ id, ...APP_ROUTES[id] }));

  if (active === 'start') {
    return (
      <div
        data-theme={dark ? 'dark' : 'light'}
        data-hover-highlight="on"
        data-theme-switching={switching ? '' : undefined}
        style={{ height: '100%' }}
      >
        <StartPage options={startOptions} onNavigate={setActive} />
      </div>
    );
  }

  return (
    <div
      data-theme={dark ? 'dark' : 'light'}
      data-hover-highlight="on"
      data-theme-switching={switching ? '' : undefined}
      style={{ height: '100%' }}
    >
      <AppShell
        active={active} onNavigate={setActive}
        dark={dark} onToggleDark={(checked) => setThemePreference(checked ? 'dark' : 'light')}
        counts={{ lists: 6, goals: 3 }}
      >
        <TopBar title={route.title} subtitle={route.subtitle} actions={
          <>
            <IconButton label="Notifications"><Icon name="bell" size={18} /></IconButton>
            <Button
              variant="primary"
              iconLeft={<Icon name="plus" size={16} />}
              onClick={() => setActive('create')}
            >
              New
            </Button>
          </>
        } />
        <Screen
          onNavigate={setActive}
          themePreference={themePreference}
          onThemePreferenceChange={setThemePreference}
        />
      </AppShell>
    </div>
  );
}
