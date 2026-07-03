export function reorderLists(lists, activeId, targetId) {
  if (activeId === targetId) return lists;

  const activeIndex = lists.findIndex((list) => list.id === activeId);
  const targetIndex = lists.findIndex((list) => list.id === targetId);
  if (activeIndex === -1 || targetIndex === -1) return lists;

  const next = [...lists];
  const [activeList] = next.splice(activeIndex, 1);
  next.splice(targetIndex, 0, activeList);
  return next;
}

function getTaskBlock(tasks, task) {
  const blockIds = new Set([task.id]);

  if (!task.parent) {
    tasks.forEach((candidate) => {
      if (candidate.parent === task.id) blockIds.add(candidate.id);
    });
  }

  return {
    block: tasks.filter((candidate) => blockIds.has(candidate.id)),
    remaining: tasks.filter((candidate) => !blockIds.has(candidate.id)),
  };
}

function removeParent(task) {
  const { parent, ...taskWithoutParent } = task;
  return taskWithoutParent;
}

function updateBlockParent(block, parentId) {
  const [rootTask, ...childTasks] = block;
  const nextRootTask = parentId ? { ...rootTask, parent: parentId } : removeParent(rootTask);
  return [nextRootTask, ...childTasks];
}

export function getTaskDropParentId(tasks, activeId, targetId) {
  const activeTask = tasks.find((task) => task.id === activeId);
  const targetTask = tasks.find((task) => task.id === targetId);
  if (!activeTask || !targetTask) return undefined;

  if (activeTask.hasChildren) return null;

  if (activeTask.parent) {
    if (targetTask.parent) return targetTask.parent;
    if (targetTask.hasChildren) return targetTask.id;
    if (!targetTask.parent) return null;
    return undefined;
  }

  if (targetTask.parent) return targetTask.parent;
  if (targetTask.hasChildren) return targetTask.id;
  return null;
}

function getTopLevelBlockEndIndex(tasks, taskId) {
  const targetIndex = tasks.findIndex((task) => task.id === taskId);
  if (targetIndex === -1) return -1;

  let insertionIndex = targetIndex + 1;
  while (tasks[insertionIndex]?.parent === taskId) {
    insertionIndex += 1;
  }
  return insertionIndex;
}

export function getTaskInsertionTargetId(tasks, activeId, targetId) {
  if (activeId === targetId) return null;

  const activeTask = tasks.find((task) => task.id === activeId);
  const targetTask = tasks.find((task) => task.id === targetId);
  if (!activeTask || !targetTask) return null;

  if (activeTask.hasChildren) {
    return targetTask.parent || targetTask.id;
  }

  if (activeTask.parent) {
    return targetTask.id;
  }

  if (targetTask.parent) return targetTask.id;
  return targetTask.parent || targetTask.id;
}

export function reorderTasks(tasks, activeId, targetId) {
  const activeTask = tasks.find((task) => task.id === activeId);
  const insertionTargetId = getTaskInsertionTargetId(tasks, activeId, targetId);
  const nextParentId = getTaskDropParentId(tasks, activeId, targetId);
  if (!activeTask || !insertionTargetId || insertionTargetId === activeId || nextParentId === undefined) return tasks;

  const activeIndex = tasks.findIndex((task) => task.id === activeTask.id);
  const targetIndex = tasks.findIndex((task) => task.id === insertionTargetId);
  const { block, remaining } = getTaskBlock(tasks, activeTask);
  const blockToMove = updateBlockParent(block, nextParentId);
  const targetIndexAfterRemoval = remaining.findIndex((task) => task.id === insertionTargetId);
  if (targetIndexAfterRemoval === -1) return tasks;

  const movesChildToMainList = activeTask.parent && nextParentId === null;
  const nestsAtEndOfTopLevelTask = nextParentId === insertionTargetId;
  const insertionIndex = movesChildToMainList
    ? getTopLevelBlockEndIndex(remaining, insertionTargetId)
    : nestsAtEndOfTopLevelTask
      ? getTopLevelBlockEndIndex(remaining, insertionTargetId)
    : activeIndex < targetIndex ? targetIndexAfterRemoval + 1 : targetIndexAfterRemoval;
  if (insertionIndex === -1) return tasks;

  const next = [...remaining];
  next.splice(insertionIndex, 0, ...blockToMove);
  return next;
}

export function moveTaskToEnd(tasks, activeId) {
  const activeTask = tasks.find((task) => task.id === activeId);
  if (!activeTask) return tasks;

  const { block, remaining } = getTaskBlock(tasks, activeTask);
  return [...remaining, ...updateBlockParent(block, null)];
}

/* Moves a task (with its subtasks, when it is a parent) from one list into
 * another. Childless tasks dropped onto a parent or one of its children join
 * that parent; everything else lands top-level, after the whole block the
 * drop target belongs to — never in the middle of another parent's children. */
export function moveTaskAcrossLists(lists, sourceListId, targetListId, activeTaskId, targetTaskId = null) {
  const sourceList = lists.find((list) => list.id === sourceListId);
  const targetList = lists.find((list) => list.id === targetListId);
  const activeTask = sourceList?.tasks.find((task) => task.id === activeTaskId);
  if (!sourceList || !targetList || !activeTask || sourceListId === targetListId) return lists;

  const { block, remaining: sourceTasks } = getTaskBlock(sourceList.tasks, activeTask);
  const targetTask = targetTaskId
    ? targetList.tasks.find((task) => task.id === targetTaskId)
    : null;

  let nextParentId = null;
  if (!activeTask.hasChildren && targetTask) {
    if (targetTask.parent) nextParentId = targetTask.parent;
    else if (targetTask.hasChildren) nextParentId = targetTask.id;
  }

  const blockToMove = updateBlockParent(block, nextParentId);

  const targetTasks = [...targetList.tasks];
  let insertionIndex = targetTasks.length;
  if (targetTask) {
    if (nextParentId && targetTask.id === nextParentId) {
      insertionIndex = getTopLevelBlockEndIndex(targetTasks, targetTask.id);
    } else if (nextParentId) {
      insertionIndex = targetTasks.findIndex((task) => task.id === targetTask.id) + 1;
    } else {
      insertionIndex = getTopLevelBlockEndIndex(targetTasks, targetTask.parent || targetTask.id);
    }
  }
  if (insertionIndex < 0) insertionIndex = targetTasks.length;

  targetTasks.splice(insertionIndex, 0, ...blockToMove);

  return lists.map((list) => {
    if (list.id === sourceListId) return { ...list, tasks: sourceTasks };
    if (list.id === targetListId) {
      return {
        ...list,
        collapsed: nextParentId ? { ...list.collapsed, [nextParentId]: false } : list.collapsed,
        tasks: targetTasks,
      };
    }
    return list;
  });
}

/* Render-time view of a list's tasks honoring the list display settings.
 * Completed parents stay visible while any child is still open; sinking
 * completed items keeps parent/child blocks intact and the manual order
 * otherwise untouched. */
export function getVisibleTasks(tasks, { showCompleted = true, completedToBottom = false } = {}) {
  let visible = tasks;

  if (!showCompleted) {
    visible = visible.filter((task) => {
      if (!task.done) return true;
      return Boolean(task.hasChildren) && tasks.some((child) => child.parent === task.id && !child.done);
    });
  }

  if (completedToBottom) {
    const roots = visible.filter((task) => !task.parent);
    const orderedRoots = [...roots.filter((root) => !root.done), ...roots.filter((root) => root.done)];
    const flat = [];
    orderedRoots.forEach((root) => {
      const children = visible.filter((task) => task.parent === root.id);
      flat.push(root, ...children.filter((child) => !child.done), ...children.filter((child) => child.done));
    });
    visible.forEach((task) => {
      if (!flat.includes(task)) flat.push(task);
    });
    visible = flat;
  }

  return visible;
}
