import React from 'react';
import { Button, Icon, Segmented } from '../../components';
import { TaskList } from './components/TaskList.jsx';
import { initialLists } from './data/mockLists.js';
import {
  getTaskDropParentId,
  getTaskInsertionTargetId,
  moveTaskToEnd,
  reorderLists,
  reorderTasks,
} from './utils/reorder.js';
import './ListsPage.css';

/* Do Better — Lists page: separated lists, nested + checkable tasks, drag handles */

export function ListsPage() {
  const [filter, setFilter] = React.useState('all');
  const [draggingListId, setDraggingListId] = React.useState(null);
  const [dropTargetListId, setDropTargetListId] = React.useState(null);
  const draggingListIdRef = React.useRef(null);
  const [draggingTask, setDraggingTask] = React.useState(null);
  const [dropTargetTask, setDropTargetTask] = React.useState(null);
  const draggingTaskRef = React.useRef(null);
  const [lists, setLists] = React.useState(() => initialLists);

  const toggle = (lid, tid) => setLists((ls) => ls.map((l) => l.id !== lid ? l : { ...l, tasks: l.tasks.map((t) => t.id === tid ? { ...t, done: !t.done } : t) }));
  const collapse = (lid, tid) => setLists((ls) => ls.map((l) => l.id !== lid ? l : { ...l, collapsed: { ...l.collapsed, [tid]: !l.collapsed[tid] } }));
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

  const moveList = React.useCallback((activeId, targetId) => {
    setLists((currentLists) => reorderLists(currentLists, activeId, targetId));
  }, []);

  const moveTask = React.useCallback((listId, activeTaskId, targetTaskId) => {
    setLists((currentLists) => currentLists.map((list) => {
      if (list.id !== listId) return list;

      const nextParentId = getTaskDropParentId(list.tasks, activeTaskId, targetTaskId);
      return {
        ...list,
        collapsed: nextParentId ? { ...list.collapsed, [nextParentId]: false } : list.collapsed,
        tasks: reorderTasks(list.tasks, activeTaskId, targetTaskId),
      };
    }));
  }, []);

  const moveTaskToListEnd = React.useCallback((listId, activeTaskId) => {
    setLists((currentLists) => currentLists.map((list) => (
      list.id !== listId
        ? list
        : { ...list, tasks: moveTaskToEnd(list.tasks, activeTaskId) }
    )));
  }, []);

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
    if (draggingTaskRef.current) return;

    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';

    const activeId = draggingListIdRef.current;
    if (!activeId || activeId === targetId) return;
    setDropTargetListId(targetId);
  };

  const dropList = (event, targetId) => {
    if (draggingTaskRef.current) {
      event.preventDefault();
      event.stopPropagation();
      clearTaskDragState();
      return;
    }

    event.preventDefault();
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
    if (!activeTask || activeTask.listId !== listId) return;

    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = 'move';

    const list = lists.find((candidate) => candidate.id === listId);
    if (!list || !getTaskInsertionTargetId(list.tasks, activeTask.taskId, taskId)) return;

    setDropTargetTask({ listId, taskId });
  };

  const dropTask = (event, listId, taskId) => {
    const activeTask = draggingTaskRef.current;
    if (!activeTask || activeTask.listId !== listId) return;

    event.preventDefault();
    event.stopPropagation();
    moveTask(listId, activeTask.taskId, taskId);
    clearTaskDragState();
  };

  const dragOverTaskArea = (event, listId) => {
    const activeTask = draggingTaskRef.current;
    if (!activeTask || activeTask.listId !== listId) return;

    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = 'move';

    setDropTargetTask({ listId, taskId: null });
  };

  const dropTaskArea = (event, listId) => {
    const activeTask = draggingTaskRef.current;
    if (!activeTask || activeTask.listId !== listId) return;

    event.preventDefault();
    event.stopPropagation();
    moveTaskToListEnd(listId, activeTask.taskId);
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

  const gridClass = [
    'tasks-screen__grid',
    draggingListId || draggingTask ? 'is-reordering' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className="tasks-screen">
      <div className="tasks-screen__content">
        <div className="tasks-screen__toolbar">
          <Segmented options={[{ value: 'all', label: 'All' }, { value: 'today', label: 'Today' }, { value: 'done', label: 'Done' }]} value={filter} onChange={setFilter} />
          <Button variant="primary" iconLeft={<Icon name="plus" size={16} />}>New list</Button>
        </div>
        <p className="tasks-screen__hint" id="tasks-list-reorder-status">
          <Icon name="grip" size={15} /> Lists stay separate while you arrange them.
        </p>
        <div className={gridClass} onDrop={clearDragState} onDragEnd={clearDragState}>
          {lists.map((l, index) => (
            <TaskList
              key={l.id}
              list={l}
              index={index}
              listCount={lists.length}
              isDragging={draggingListId === l.id}
              isDropTarget={dropTargetListId === l.id && draggingListId !== l.id}
              draggingTaskId={draggingTask?.listId === l.id ? draggingTask.taskId : null}
              dropTargetTaskId={dropTargetTask?.listId === l.id ? dropTargetTask.taskId : null}
              onToggle={toggle}
              onCollapse={collapse}
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
            />
          ))}
        </div>
      </div>
    </div>
  );
}
