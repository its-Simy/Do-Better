import React from 'react';
import { Badge, Card, Icon, IconButton, Menu, MenuItem, MenuLabel, MenuSeparator, Swatches } from '../../../components';
import { TaskItem } from './TaskItem.jsx';
import { LIST_COLORS, getListColorValue } from '../data/listColors.js';

function ListColorDot({ colorId, size = 10 }) {
  return (
    <span
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        flex: '0 0 auto',
        borderRadius: 3,
        background: getListColorValue(colorId),
      }}
    />
  );
}

/* Two-step delete: with confirmation on, the first press arms the item
 * instead of deleting. */
function DeleteListItem({ listName, confirmDelete, onDelete }) {
  const [armed, setArmed] = React.useState(false);

  if (confirmDelete && !armed) {
    return (
      <MenuItem danger keepOpen onSelect={() => setArmed(true)} icon={<Icon name="x" size={14} />}>
        Delete list…
      </MenuItem>
    );
  }
  return (
    <MenuItem danger onSelect={onDelete} icon={<Icon name="x" size={14} />}>
      {confirmDelete ? `Really delete “${listName}”?` : 'Delete list'}
    </MenuItem>
  );
}

export function TaskList({
  list,
  visibleTasks,
  allLists = [],
  index,
  listCount,
  isDragging,
  isDropTarget,
  isTaskDropTarget = false,
  draggingTaskId,
  dropTargetTaskId,
  confirmDelete = true,
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
  onTaskMoveToList,
  onSetColor,
  onDeleteList,
  onAddTask,
}) {
  const tasks = visibleTasks ?? list.tasks;
  const otherLists = allLists.filter((candidate) => candidate.id !== list.id);
  const highlighted = isDropTarget || isTaskDropTarget;
  const cardClass = [
    'tasks-list-card',
    isDragging ? 'is-dragging' : '',
    highlighted ? 'is-drop-target' : '',
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
        border: highlighted ? '1.5px solid var(--brand-border)' : undefined,
        cursor: isDragging ? 'grabbing' : undefined,
      }}
    >
      <div className="tasks-list-header">
        <ListColorDot colorId={list.color} />
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
          <Menu
            width={224}
            trigger={({ open, toggle }) => (
              <IconButton
                label={`Options for ${list.name}`}
                size="sm"
                onClick={toggle}
                aria-haspopup="menu"
                aria-expanded={open}
              >
                <Icon name="more-horizontal" size={16} />
              </IconButton>
            )}
          >
            <MenuLabel>List color</MenuLabel>
            <Swatches
              options={LIST_COLORS}
              value={list.color}
              onChange={(colorId) => onSetColor?.(list.id, colorId)}
              style={{ padding: '4px 9px 7px' }}
            />
            <MenuSeparator />
            <DeleteListItem
              listName={list.name}
              confirmDelete={confirmDelete}
              onDelete={() => onDeleteList?.(list.id)}
            />
          </Menu>
        </span>
      </div>
      <div
        className="tasks-list-items"
        onDragOver={(event) => onTaskAreaDragOver(event, list.id)}
        onDrop={(event) => onTaskAreaDrop(event, list.id)}
      >
        {tasks.map((t) => {
          if (t.parent && list.collapsed[t.parent]) return null;
          return (
            <TaskItem
              key={t.id}
              title={t.title}
              done={t.done}
              depth={t.parent ? 1 : 0}
              accent={getListColorValue(list.color)}
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
              trailing={(
                <Menu
                  width={200}
                  trigger={({ open, toggle }) => (
                    <IconButton
                      label={`Options for ${t.title}`}
                      size="sm"
                      onClick={toggle}
                      aria-haspopup="menu"
                      aria-expanded={open}
                    >
                      <Icon name="more-horizontal" size={15} />
                    </IconButton>
                  )}
                >
                  <MenuLabel>{t.hasChildren ? 'Move with subtasks to' : 'Move to'}</MenuLabel>
                  {otherLists.length === 0 && (
                    <MenuItem disabled>No other lists</MenuItem>
                  )}
                  {otherLists.map((target) => (
                    <MenuItem
                      key={target.id}
                      icon={<ListColorDot colorId={target.color} size={9} />}
                      onSelect={() => onTaskMoveToList?.(list.id, t.id, target.id)}
                    >
                      {target.name}
                    </MenuItem>
                  ))}
                </Menu>
              )}
            />
          );
        })}
      </div>
    </Card>
  );
}
