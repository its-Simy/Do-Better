import React from 'react';
import { Avatar, Badge, Icon } from '../components';
import { APP_ROUTES } from '../app/routes.js';

/* Do Better — App shell: sidebar nav + topbar with theme controls. */

export const DB_NAV = [
  { id: 'lists', label: APP_ROUTES.lists.title, icon: APP_ROUTES.lists.icon },
  { id: 'goals', label: APP_ROUTES.goals.title, icon: APP_ROUTES.goals.icon },
  { id: 'sleep', label: APP_ROUTES.sleep.title, icon: APP_ROUTES.sleep.icon },
  { id: 'insights', label: APP_ROUTES.insights.title, icon: APP_ROUTES.insights.icon },
  { id: 'settings', label: APP_ROUTES.settings.title, icon: APP_ROUTES.settings.icon },
];

function NavItem({ item, active, onClick }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button
      className="db-hoverable"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 'var(--space-3)', width: '100%',
        padding: '10px 12px', border: 'none', cursor: 'pointer', textAlign: 'left',
        borderRadius: 'var(--radius-md)',
        background: active ? 'var(--brand-subtle)' : (hover ? 'var(--surface-hover)' : 'transparent'),
        color: active ? 'var(--brand-active)' : 'var(--text-secondary)',
        fontFamily: 'var(--font-sans)', fontSize: 'var(--fs-body-md)',
        fontWeight: active ? 'var(--fw-bold)' : 'var(--fw-medium)',
        transition: 'background-color var(--dur-fast) var(--ease-out)',
      }}
    >
      <Icon name={item.icon} size={20} />
      {item.label}
      {item.badge != null && (
        <span style={{ marginLeft: 'auto' }}><Badge tone={active ? 'brand' : 'neutral'}>{item.badge}</Badge></span>
      )}
    </button>
  );
}

export function AppShell({ active, onNavigate, children, counts = {} }) {
  const nav = DB_NAV.map((n) => ({ ...n, badge: counts[n.id] }));
  return (
    <div style={{ display: 'flex', height: '100%', background: 'var(--bg-base)' }}>
      {/* Sidebar */}
      <aside style={{
        width: 'var(--sidebar-w)', flex: '0 0 auto', display: 'flex', flexDirection: 'column',
        gap: 'var(--space-2)', padding: 'var(--space-5) var(--space-4)',
        borderRight: '1.5px solid var(--border)', background: 'var(--surface)',
      }}>
        <button
          className="db-hoverable"
          type="button"
          onClick={() => onNavigate('start')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            width: '100%',
            padding: '4px 8px 16px',
            border: 'none',
            background: 'transparent',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
            textAlign: 'center',
          }}
        >
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 19, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>Do Better</span>
        </button>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {nav.map((item) => (
            <NavItem key={item.id} item={item} active={active === item.id} onClick={() => onNavigate(item.id)} />
          ))}
        </nav>

        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 16, borderTop: '1.5px solid var(--border-subtle)' }}>
          <button
            className="db-hoverable"
            type="button"
            onClick={() => onNavigate('settings')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              width: '100%',
              padding: '6px 4px',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              background: active === 'settings' ? 'var(--brand-subtle)' : 'transparent',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'background-color var(--dur-fast) var(--ease-out)',
            }}
          >
            <Avatar name="Sam Rivera" size={36} />
            <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
              <span style={{ fontSize: 'var(--fs-body-sm)', fontWeight: 700, color: 'var(--text-primary)' }}>Sam Rivera</span>
              <span style={{ fontSize: 'var(--fs-caption)', color: 'var(--text-tertiary)' }}>Level up · 12 day streak</span>
            </div>
          </button>
        </div>
      </aside>

      {/* Main column */}
      <main style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {children}
      </main>
    </div>
  );
}

export function TopBar({ title, subtitle, actions }) {
  return (
    <header style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
      padding: 'var(--space-5) var(--space-8)', borderBottom: '1.5px solid var(--border)',
      background: 'var(--surface)', flex: '0 0 auto',
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <h1 style={{ fontSize: 'var(--fs-title-lg)', fontWeight: 800 }}>{title}</h1>
        {subtitle && <span style={{ fontSize: 'var(--fs-body-sm)', color: 'var(--text-tertiary)' }}>{subtitle}</span>}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>{actions}</div>
    </header>
  );
}
