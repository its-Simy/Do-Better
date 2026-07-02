import React from 'react';

/**
 * Do Better — Button
 * Primary action control. Rounded, friendly, with the shared hover-highlight glow.
 */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  iconLeft = null,
  iconRight = null,
  style = {},
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const [press, setPress] = React.useState(false);

  const sizes = {
    sm: { height: 'var(--control-sm)', padding: '0 var(--space-3)', fontSize: 'var(--fs-label)', radius: 'var(--radius-sm)', gap: 'var(--space-2)' },
    md: { height: 'var(--control-md)', padding: '0 var(--space-5)', fontSize: 'var(--fs-body-md)', radius: 'var(--radius-md)', gap: 'var(--space-2)' },
    lg: { height: 'var(--control-lg)', padding: '0 var(--space-6)', fontSize: 'var(--fs-body-lg)', radius: 'var(--radius-lg)', gap: 'var(--space-3)' },
  };

  const palettes = {
    primary: {
      bg: hover ? 'var(--brand-hover)' : 'var(--brand)',
      color: 'var(--on-brand)',
      border: 'transparent',
      shadow: hover ? 'var(--shadow-brand)' : 'var(--shadow-sm)',
    },
    secondary: {
      bg: hover ? 'var(--surface-hover)' : 'var(--surface)',
      color: 'var(--text-primary)',
      border: 'var(--border-strong)',
      shadow: 'var(--shadow-xs)',
    },
    ghost: {
      bg: hover ? 'var(--surface-hover)' : 'transparent',
      color: 'var(--text-secondary)',
      border: 'transparent',
      shadow: 'none',
    },
    soft: {
      bg: hover ? 'var(--brand-subtle-hover)' : 'var(--brand-subtle)',
      color: 'var(--brand-active)',
      border: 'transparent',
      shadow: 'none',
    },
    danger: {
      bg: hover ? 'var(--danger-hover)' : 'var(--danger)',
      color: '#fff',
      border: 'transparent',
      shadow: 'var(--shadow-sm)',
    },
  };

  const s = sizes[size] || sizes.md;
  const p = palettes[variant] || palettes.primary;

  return (
    <button
      className="db-hoverable"
      disabled={disabled || loading}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setPress(false); }}
      onMouseDown={() => setPress(true)}
      onMouseUp={() => setPress(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: s.gap,
        height: s.height,
        width: fullWidth ? '100%' : 'auto',
        padding: s.padding,
        fontFamily: 'var(--font-sans)',
        fontSize: s.fontSize,
        fontWeight: 'var(--fw-semibold)',
        lineHeight: 1,
        letterSpacing: 'var(--ls-snug)',
        color: p.color,
        background: p.bg,
        border: `1.5px solid ${p.border}`,
        borderRadius: s.radius,
        boxShadow: p.shadow,
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transform: press && !disabled ? 'scale(0.97)' : 'scale(1)',
        transition: 'transform var(--dur-fast) var(--ease-out), background-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-base) var(--ease-out)',
        whiteSpace: 'nowrap',
        ...style,
      }}
      {...rest}
    >
      {loading && <Spinner />}
      {!loading && iconLeft}
      {children}
      {!loading && iconRight}
    </button>
  );
}

function Spinner() {
  return (
    <span
      style={{
        width: '1em',
        height: '1em',
        border: '2px solid currentColor',
        borderTopColor: 'transparent',
        borderRadius: '50%',
        display: 'inline-block',
        animation: 'db-spin 0.7s linear infinite',
      }}
    />
  );
}
