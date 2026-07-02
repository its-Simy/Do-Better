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
