import React from 'react';

/**
 * Do Better — Menu
 * Lightweight dropdown for row/card actions. Closes on outside press, Escape,
 * or item select. The panel is absolutely positioned against the trigger, so
 * the surrounding container must not clip overflow.
 */
const MenuCloseContext = React.createContext(() => {});

export function useMenuClose() {
  return React.useContext(MenuCloseContext);
}

export function Menu({ trigger, align = 'right', width = 210, style = {}, children }) {
  const [open, setOpen] = React.useState(false);
  const rootRef = React.useRef(null);
  const close = React.useCallback(() => setOpen(false), []);

  React.useEffect(() => {
    if (!open) return undefined;

    const handlePress = (event) => {
      if (!rootRef.current?.contains(event.target)) close();
    };
    const handleKey = (event) => {
      if (event.key === 'Escape') close();
    };
    document.addEventListener('pointerdown', handlePress);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('pointerdown', handlePress);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open, close]);

  return (
    <span ref={rootRef} style={{ position: 'relative', display: 'inline-flex', flex: '0 0 auto', ...style }}>
      {trigger({ open, toggle: () => setOpen((value) => !value) })}
      {open && (
        <div
          role="menu"
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            [align === 'right' ? 'right' : 'left']: 0,
            zIndex: 40,
            minWidth: width,
            padding: 6,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            background: 'var(--surface-raised)',
            border: '1.5px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          <MenuCloseContext.Provider value={close}>{children}</MenuCloseContext.Provider>
        </div>
      )}
    </span>
  );
}

export function MenuItem({ children, icon = null, onSelect, danger = false, disabled = false, keepOpen = false }) {
  const close = useMenuClose();
  const [hover, setHover] = React.useState(false);

  return (
    <button
      type="button"
      role="menuitem"
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => {
        if (disabled) return;
        onSelect?.();
        if (!keepOpen) close();
      }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-2)',
        width: '100%',
        padding: '7px 9px',
        border: 'none',
        textAlign: 'left',
        borderRadius: 'var(--radius-sm)',
        background: hover && !disabled ? (danger ? 'var(--danger-subtle)' : 'var(--surface-hover)') : 'transparent',
        color: disabled ? 'var(--text-disabled)' : (danger ? 'var(--danger)' : 'var(--text-primary)'),
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--fs-body-sm)',
        fontWeight: 'var(--fw-medium)',
        cursor: disabled ? 'default' : 'pointer',
        transition: 'background-color var(--dur-fast) var(--ease-out)',
      }}
    >
      {icon && <span style={{ display: 'inline-flex', flex: '0 0 auto' }}>{icon}</span>}
      <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{children}</span>
    </button>
  );
}

export function MenuLabel({ children }) {
  return (
    <span style={{
      padding: '6px 9px 4px',
      fontSize: 'var(--fs-caption)',
      fontWeight: 'var(--fw-bold)',
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      color: 'var(--text-tertiary)',
    }}>{children}</span>
  );
}

export function MenuSeparator() {
  return <span aria-hidden="true" style={{ display: 'block', height: 1, margin: '5px 3px', background: 'var(--border-subtle)' }} />;
}
