import React from 'react';
import { Checkbox } from '../../../components';

/**
 * Do Better — TaskItem
 * A todo row: drag handle, checkbox, title, optional meta + trailing slot.
 * Supports nesting via `depth` (indent) and a collapse toggle for parents.
 */
export function TaskItem({
  title,
  done = false,
  onToggle,
  depth = 0,
  meta = null,
  trailing = null,
  hasChildren = false,
  collapsed = false,
  onCollapse,
  dragging = false,
  dropTarget = false,
  dragHandleLabel = 'Reorder task',
  dragHandleDescriptionId,
  draggable = false,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  onReorderKeyDown,
  accent = 'var(--brand)',
  style = {},
}) {
  const [hover, setHover] = React.useState(false);

  return (
    <div
      className="db-hoverable"
      data-task-item="true"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onDragOver={onDragOver}
      onDrop={onDrop}
      style={{
        display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
        marginLeft: depth * 26,
        padding: 'var(--space-2) var(--space-3)',
        background: dragging || dropTarget ? 'var(--surface-raised)' : (hover ? 'var(--surface-hover)' : 'transparent'),
        border: '1.5px solid', borderColor: dragging || dropTarget ? 'var(--brand-border)' : 'transparent',
        borderRadius: 'var(--radius-md)',
        boxShadow: dragging ? 'var(--shadow-lg)' : 'none',
        opacity: dragging ? 0.58 : 1,
        transition: 'background-color var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out), opacity var(--dur-fast) var(--ease-out)',
        ...style,
      }}
    >
      <button
        type="button"
        aria-label={dragHandleLabel}
        aria-describedby={dragHandleDescriptionId}
        aria-grabbed={dragging}
        className={`task-item-grip${dragging ? ' is-dragging' : ''}`}
        draggable={draggable}
        disabled={!draggable}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onKeyDown={onReorderKeyDown}
        style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: 18, height: 24, cursor: draggable ? (dragging ? 'grabbing' : 'grab') : 'default', flex: '0 0 auto',
          color: 'var(--text-tertiary)', opacity: hover || dragging ? 1 : 0.25,
          padding: 0, border: 0, background: 'transparent', borderRadius: 'var(--radius-xs)',
          transition: 'opacity var(--dur-fast)',
        }}
      >
        <svg width="12" height="16" viewBox="0 0 12 16" fill="currentColor">
          <circle cx="3" cy="3" r="1.5" /><circle cx="9" cy="3" r="1.5" />
          <circle cx="3" cy="8" r="1.5" /><circle cx="9" cy="8" r="1.5" />
          <circle cx="3" cy="13" r="1.5" /><circle cx="9" cy="13" r="1.5" />
        </svg>
      </button>

      {hasChildren ? (
        <button
          onClick={onCollapse} aria-label={collapsed ? 'Expand' : 'Collapse'}
          style={{
            width: 20, height: 20, border: 'none', background: 'transparent', cursor: 'pointer',
            color: 'var(--text-tertiary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            flex: '0 0 auto',
          }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
            style={{ transform: collapsed ? 'rotate(-90deg)' : 'rotate(0deg)', transition: 'transform var(--dur-fast) var(--ease-out)' }}>
            <path d="M2.5 4.5 L6 8 L9.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      ) : <span style={{ width: 20, flex: '0 0 auto' }} />}

      <Checkbox checked={done} onChange={onToggle} accent={accent} size="md" />

      <span style={{
        flex: 1, minWidth: 0, fontSize: 'var(--fs-body-md)',
        fontWeight: hasChildren ? 'var(--fw-semibold)' : 'var(--fw-medium)',
        color: done ? 'var(--text-tertiary)' : 'var(--text-primary)',
        textDecoration: done ? 'line-through' : 'none',
        textDecorationColor: 'var(--text-tertiary)',
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        transition: 'color var(--dur-fast)',
      }}>{title}</span>

      {meta && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', flex: '0 0 auto' }}>{meta}</span>}
      {trailing && <span style={{ flex: '0 0 auto', opacity: hover ? 1 : 0.5, transition: 'opacity var(--dur-fast)' }}>{trailing}</span>}
    </div>
  );
}
