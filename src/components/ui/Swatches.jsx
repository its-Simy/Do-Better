import React from 'react';
import { Icon } from '../icons/Icon.jsx';

/**
 * Do Better — Swatches
 * Compact color picker row. Options are { id, label, value } where value is a
 * CSS color; every swatch carries its label for assistive tech and tooltips,
 * so the choice is never color-alone.
 */
export function Swatches({ options = [], value, onChange, size = 24, style = {} }) {
  return (
    <div role="radiogroup" style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', ...style }}>
      {options.map((option) => {
        const active = option.id === value;
        return (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={option.label}
            title={option.label}
            onClick={() => onChange?.(option.id)}
            style={{
              width: size,
              height: size,
              flex: '0 0 auto',
              padding: 0,
              border: '2px solid var(--surface)',
              borderRadius: '50%',
              background: option.value,
              color: '#fff',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: active ? `0 0 0 2px ${option.value}` : '0 0 0 1.5px var(--border-strong)',
              transform: active ? 'scale(1.05)' : 'scale(1)',
              transition: 'box-shadow var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out)',
            }}
          >
            {active && <Icon name="check" size={Math.round(size * 0.55)} strokeWidth={3} />}
          </button>
        );
      })}
    </div>
  );
}
