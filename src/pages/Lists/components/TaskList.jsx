import React from 'react';
import { Badge, Card, Icon, IconButton } from '../../../components';
import { TaskItem } from './TaskItem.jsx';

export function TaskList({
  list,
  index,
  listCount,
  isDragging,
  isDropTarget,
  draggingTaskId,
  dropTargetTaskId,
  onToggle,
  onCollapse,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  onMoveByKeyboard,
  onTaskDragStart,
  onTaskDragOver,
  onTaskDrop,
  onTaskAreaDragOver,
  onTaskAreaDrop,
  onTaskMoveByKeyboard,
  onAddTask,
}) {
  const cardClass = [
    'tasks-list-card',
    isDragging ? 'is-dragging' : '',
    isDropTarget ? 'is-drop-target' : '',
  ].filter(Boolean).join(' ');

  return (
    <Card
      padding="md"
      className={cardClass}
      onDragOver={(event) => onDragOver(event, list.id)}
      onDrop={(event) => onDrop(event, list.id)}
      style={{
        opacity: isDragging ? 0.58 : 1,
        transform: isDragging ? 'scale(0.985)' : 'scale(1)',
        boxShadow: isDragging ? 'var(--shadow-lg)' : undefined,
        border: isDropTarget ? '1.5px solid var(--brand-border)' : undefined,
        cursor: isDragging ? 'grabbing' : undefined,
      }}
    >
      <div className="tasks-list-header">
        <span className="tasks-list-dot" style={{ background: list.color }} />
        <span className="tasks-list-title">{list.name}</span>
        <Badge tone="neutral">{list.tasks.filter((t) => !t.done).length}</Badge>
        <span className="tasks-list-actions">
          <button
            type="button"
            aria-label={`Reorder ${list.name} list`}
            aria-describedby="tasks-list-reorder-status"
            aria-grabbed={isDragging}
            title="Reorder list"
            className={`tasks-list-grip${isDragging ? ' is-dragging' : ''}`}
            draggable
            onDragStart={(event) => onDragStart(event, list.id)}
            onDragEnd={onDragEnd}
            onKeyDown={(event) => onMoveByKeyboard(event, list.id, index)}
            disabled={listCount < 2}
          >
            <Icon name="grip" size={15} />
          </button>
          <IconButton label="Add task" size="sm" onClick={onAddTask}><Icon name="plus" size={16} /></IconButton>
          <IconButton label="List options" size="sm"><Icon name="more-horizontal" size={16} /></IconButton>
        </span>
      </div>
      <div
        className="tasks-list-items"
        onDragOver={(event) => onTaskAreaDragOver(event, list.id)}
        onDrop={(event) => onTaskAreaDrop(event, list.id)}
      >
        {list.tasks.map((t) => {
          if (t.parent && list.collapsed[t.parent]) return null;
          return (
            <TaskItem
              key={t.id}
              title={t.title}
              done={t.done}
              depth={t.parent ? 1 : 0}
              accent={list.color}
              hasChildren={t.hasChildren}
              collapsed={list.collapsed[t.id]}
              onCollapse={() => onCollapse(list.id, t.id)}
              onToggle={() => onToggle(list.id, t.id)}
              dragging={draggingTaskId === t.id}
              dropTarget={dropTargetTaskId === t.id && draggingTaskId !== t.id}
              draggable
              dragHandleLabel={`Reorder ${t.title}`}
              dragHandleDescriptionId="tasks-list-reorder-status"
              onDragStart={(event) => onTaskDragStart(event, list.id, t.id)}
              onDragOver={(event) => onTaskDragOver(event, list.id, t.id)}
              onDrop={(event) => onTaskDrop(event, list.id, t.id)}
              onDragEnd={onDragEnd}
              onReorderKeyDown={(event) => onTaskMoveByKeyboard(event, list.id, t.id)}
              meta={t.tag ? <Badge tone={t.tag === 'Goal' ? 'goal' : 'brand'}>{t.tag}</Badge> : null}
              trailing={<IconButton label="More" size="sm"><Icon name="more-horizontal" size={15} /></IconButton>}
            />
          );
        })}
      </div>
    </Card>
  );
}
