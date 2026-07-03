import React from 'react';
import { Button, Card, Icon, Segmented } from '../../components';
import { TaskList } from './components/TaskList.jsx';
import { useLists } from '../../state/ListsContext.jsx';
import { useSettings } from '../../state/SettingsContext.jsx';
import { getTaskInsertionTargetId, getVisibleTasks } from './utils/reorder.js';
import './ListsPage.css';

/* Do Better — Lists page: separated lists, nested + checkable tasks, drag handles.
 * Items move freely between lists: drag a row onto another list (or its card),
 * or use the row's ⋯ menu. */

export function ListsPage({ onNavigate }) {
  const [filter, setFilter] = React.useState('all');
  const [draggingListId, setDraggingListId] = React.useState(null);
  const [dropTargetListId, setDropTargetListId] = React.useState(null);
  const draggingListIdRef = React.useRef(null);
  const [draggingTask, setDraggingTask] = React.useState(null);
  const [dropTargetTask, setDropTargetTask] = React.useState(null);
  const draggingTaskRef = React.useRef(null);

  const {
    lists,
    toggleTask,
    toggleCollapse,
    moveList,
    moveTask,
    moveTaskBetweenLists,
    setListColor,
    deleteList,
  } = useLists();
  const { settings } = useSettings();
  const listSettings = settings.lists;

  const clearListDragState = () => {
    draggingListIdRef.current = null;
    setDraggingListId(null);
    setDropTargetListId(null);
  };
  const clearTaskDragState = () => {
    draggingTaskRef.current = null;
    setDraggingTask(null);
    setDropTargetTask(null);
  };
  const clearDragState = () => {
    clearListDragState();
    clearTaskDragState();
  };

  const startListDrag = (event, listId) => {
    const card = event.currentTarget.closest('.tasks-list-card');
    draggingListIdRef.current = listId;
    setDraggingListId(listId);
    setDropTargetListId(listId);

    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', listId);

    if (card) {
      const rect = card.getBoundingClientRect();
      event.dataTransfer.setDragImage(card, event.clientX - rect.left, event.clientY - rect.top);
    }
  };

  const dragOverList = (event, targetId) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';

    if (draggingTaskRef.current) {
      // A task hovering anywhere over a card targets that list's end.
      setDropTargetTask({ listId: targetId, taskId: null });
      return;
    }

    const activeId = draggingListIdRef.current;
    if (!activeId || activeId === targetId) return;
    setDropTargetListId(targetId);
  };

  const dropList = (event, targetId) => {
    event.preventDefault();
    const activeTask = draggingTaskRef.current;
    if (activeTask) {
      moveTaskBetweenLists(activeTask.listId, targetId, activeTask.taskId);
      clearTaskDragState();
      return;
    }

    const activeId = draggingListIdRef.current || event.dataTransfer.getData('text/plain');
    if (activeId) moveList(activeId, targetId);
    clearDragState();
  };

  const moveListByKeyboard = (event, listId, index) => {
    const forwardKeys = ['ArrowDown', 'ArrowRight'];
    const backwardKeys = ['ArrowUp', 'ArrowLeft'];
    if (![...forwardKeys, ...backwardKeys].includes(event.key)) return;

    event.preventDefault();
    const nextIndex = forwardKeys.includes(event.key) ? index + 1 : index - 1;
    const targetList = lists[nextIndex];
    if (!targetList) return;

    moveList(listId, targetList.id);
  };

  const startTaskDrag = (event, listId, taskId) => {
    const taskRow = event.currentTarget.closest('[data-task-item="true"]');
    event.stopPropagation();

    draggingTaskRef.current = { listId, taskId };
    setDraggingTask({ listId, taskId });
    setDropTargetTask({ listId, taskId });

    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('application/x-do-better-task', JSON.stringify({ listId, taskId }));
    event.dataTransfer.setData('text/plain', taskId);

    if (taskRow) {
      const rect = taskRow.getBoundingClientRect();
      event.dataTransfer.setDragImage(taskRow, event.clientX - rect.left, event.clientY - rect.top);
    }
  };

  const dragOverTask = (event, listId, taskId) => {
    const activeTask = draggingTaskRef.current;
    if (!activeTask) return;

    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = 'move';

    const list = lists.find((candidate) => candidate.id === listId);
    const targetTask = list?.tasks.find((task) => task.id === taskId);
    if (!list || !targetTask) return;
    if (
      activeTask.listId === listId
      && !getTaskInsertionTargetId(list.tasks, activeTask.taskId, taskId)
    ) return;

    setDropTargetTask({ listId, taskId });
  };

  const dropTask = (event, listId, taskId) => {
    const activeTask = draggingTaskRef.current;
    if (!activeTask) return;

    event.preventDefault();
    event.stopPropagation();
    moveTaskBetweenLists(activeTask.listId, listId, activeTask.taskId, taskId);
    clearTaskDragState();
  };

  const dragOverTaskArea = (event, listId) => {
    const activeTask = draggingTaskRef.current;
    if (!activeTask) return;

    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = 'move';

    setDropTargetTask({ listId, taskId: null });
  };

  const dropTaskArea = (event, listId) => {
    const activeTask = draggingTaskRef.current;
    if (!activeTask) return;

    event.preventDefault();
    event.stopPropagation();
    moveTaskBetweenLists(activeTask.listId, listId, activeTask.taskId);
    clearTaskDragState();
  };

  const moveTaskByKeyboard = (event, listId, taskId) => {
    const forwardKeys = ['ArrowDown', 'ArrowRight'];
    const backwardKeys = ['ArrowUp', 'ArrowLeft'];
    if (![...forwardKeys, ...backwardKeys].includes(event.key)) return;

    const list = lists.find((candidate) => candidate.id === listId);
    const activeTask = list?.tasks.find((task) => task.id === taskId);
    if (!list || !activeTask) return;

    const peers = list.tasks.filter((task) => (
      activeTask.parent ? task.parent === activeTask.parent : !task.parent
    ));
    const activeIndex = peers.findIndex((task) => task.id === taskId);
    const targetIndex = forwardKeys.includes(event.key) ? activeIndex + 1 : activeIndex - 1;
    const targetTask = peers[targetIndex];
    if (!targetTask) return;

    event.preventDefault();
    moveTask(listId, taskId, targetTask.id);
  };

  const moveTaskToList = (sourceListId, taskId, targetListId) => {
    moveTaskBetweenLists(sourceListId, targetListId, taskId);
  };

  const gridClass = [
    'tasks-screen__grid',
    draggingListId || draggingTask ? 'is-reordering' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className="tasks-screen">
      <div className="tasks-screen__content">
        <div className="tasks-screen__toolbar">
          <Segmented options={[{ value: 'all', label: 'All' }, { value: 'today', label: 'Today' }]} value={filter} onChange={setFilter} />
          <Button
            variant="primary"
            iconLeft={<Icon name="plus" size={16} />}
            onClick={() => onNavigate?.('create-list')}
          >
            New list
          </Button>
        </div>
        <p className="tasks-screen__hint" id="tasks-list-reorder-status">
          <Icon name="grip" size={15} /> Drag lists to arrange them — items can move between lists too, by dragging or from their ⋯ menu.
        </p>
        {lists.length === 0 ? (
          <Card padding="lg" className="tasks-empty">
            <p className="tasks-empty__copy">No lists yet. Create one to start collecting tasks.</p>
            <Button
              variant="primary"
              iconLeft={<Icon name="plus" size={16} />}
              onClick={() => onNavigate?.('create-list')}
            >
              New list
            </Button>
          </Card>
        ) : (
          <div className={gridClass} onDrop={clearDragState} onDragEnd={clearDragState}>
            {lists.map((l, index) => (
              <TaskList
                key={l.id}
                list={l}
                visibleTasks={getVisibleTasks(l.tasks, listSettings)}
                allLists={lists}
                index={index}
                listCount={lists.length}
                isDragging={draggingListId === l.id}
                isDropTarget={dropTargetListId === l.id && draggingListId !== l.id}
                isTaskDropTarget={dropTargetTask?.listId === l.id && dropTargetTask?.taskId === null}
                draggingTaskId={draggingTask?.listId === l.id ? draggingTask.taskId : null}
                dropTargetTaskId={dropTargetTask?.listId === l.id ? dropTargetTask.taskId : null}
                confirmDelete={listSettings.confirmDelete}
                onToggle={toggleTask}
                onCollapse={toggleCollapse}
                onDragStart={startListDrag}
                onDragOver={dragOverList}
                onDrop={dropList}
                onDragEnd={clearDragState}
                onMoveByKeyboard={moveListByKeyboard}
                onTaskDragStart={startTaskDrag}
                onTaskDragOver={dragOverTask}
                onTaskDrop={dropTask}
                onTaskAreaDragOver={dragOverTaskArea}
                onTaskAreaDrop={dropTaskArea}
                onTaskMoveByKeyboard={moveTaskByKeyboard}
                onTaskMoveToList={moveTaskToList}
                onSetColor={setListColor}
                onDeleteList={deleteList}
                onAddTask={() => onNavigate?.('create-list-item')}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
