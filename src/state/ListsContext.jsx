import React from 'react';
import { initialLists } from '../pages/Lists/data/mockLists.js';
import { DEFAULT_LIST_COLOR } from '../pages/Lists/data/listColors.js';
import {
  getTaskDropParentId,
  moveTaskAcrossLists,
  moveTaskToEnd,
  reorderLists,
  reorderTasks,
} from '../pages/Lists/utils/reorder.js';
import { useSettings } from './SettingsContext.jsx';

/* Do Better — shared lists store.
 * Lists live at the app level so the Lists page, Settings, and the create
 * flow all see the same data, and arrangement survives navigation. Demo data
 * is in-memory on purpose: a reload restores it.
 */
const ListsContext = React.createContext(null);

let listIdCounter = 0;
function nextId(prefix) {
  listIdCounter += 1;
  return `${prefix}-${Date.now().toString(36)}-${listIdCounter}`;
}

export function ListsProvider({ children }) {
  const { settings } = useSettings();
  const [lists, setLists] = React.useState(() => initialLists);
  const { autoDeleteEmpty, defaultColor } = settings.lists;

  const toggleTask = React.useCallback((listId, taskId) => {
    setLists((current) => current.map((list) => (
      list.id !== listId
        ? list
        : { ...list, tasks: list.tasks.map((task) => (task.id === taskId ? { ...task, done: !task.done } : task)) }
    )));
  }, []);

  const toggleCollapse = React.useCallback((listId, taskId) => {
    setLists((current) => current.map((list) => (
      list.id !== listId
        ? list
        : { ...list, collapsed: { ...list.collapsed, [taskId]: !list.collapsed[taskId] } }
    )));
  }, []);

  const moveList = React.useCallback((activeId, targetId) => {
    setLists((current) => reorderLists(current, activeId, targetId));
  }, []);

  const moveTask = React.useCallback((listId, activeTaskId, targetTaskId) => {
    setLists((current) => current.map((list) => {
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
    setLists((current) => current.map((list) => (
      list.id !== listId
        ? list
        : { ...list, tasks: moveTaskToEnd(list.tasks, activeTaskId) }
    )));
  }, []);

  const moveTaskBetweenLists = React.useCallback((sourceListId, targetListId, activeTaskId, targetTaskId = null) => {
    if (sourceListId === targetListId) {
      if (targetTaskId) moveTask(targetListId, activeTaskId, targetTaskId);
      else moveTaskToListEnd(targetListId, activeTaskId);
      return;
    }

    setLists((current) => {
      const next = moveTaskAcrossLists(current, sourceListId, targetListId, activeTaskId, targetTaskId);
      if (!autoDeleteEmpty) return next;
      return next.filter((list) => list.id !== sourceListId || list.tasks.length > 0);
    });
  }, [moveTask, moveTaskToListEnd, autoDeleteEmpty]);

  const setListColor = React.useCallback((listId, colorId) => {
    setLists((current) => current.map((list) => (
      list.id === listId ? { ...list, color: colorId } : list
    )));
  }, []);

  const deleteList = React.useCallback((listId) => {
    setLists((current) => current.filter((list) => list.id !== listId));
  }, []);

  const addList = React.useCallback(({ name, items = [] }) => {
    const listId = nextId('list');
    setLists((current) => [
      ...current,
      {
        id: listId,
        name: name.trim() || 'Untitled list',
        color: defaultColor || DEFAULT_LIST_COLOR,
        collapsed: {},
        tasks: items
          .map((title) => title.trim())
          .filter(Boolean)
          .map((title) => ({ id: nextId('task'), title, done: false })),
      },
    ]);
    return listId;
  }, [defaultColor]);

  const value = React.useMemo(() => ({
    lists,
    toggleTask,
    toggleCollapse,
    moveList,
    moveTask,
    moveTaskToListEnd,
    moveTaskBetweenLists,
    setListColor,
    deleteList,
    addList,
  }), [lists, toggleTask, toggleCollapse, moveList, moveTask, moveTaskToListEnd, moveTaskBetweenLists, setListColor, deleteList, addList]);

  return <ListsContext.Provider value={value}>{children}</ListsContext.Provider>;
}

export function useLists() {
  const context = React.useContext(ListsContext);
  if (!context) throw new Error('useLists must be used within a ListsProvider');
  return context;
}
