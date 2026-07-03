export const initialLists = [
  {
    id: 'work',
    name: 'Work',
    color: 'sprout',
    collapsed: {},
    tasks: [
      { id: 'w1', title: 'Ship Q3 roadmap', hasChildren: true },
      { id: 'w2', title: 'Draft milestones', parent: 'w1', tag: 'Goal' },
      { id: 'w3', title: 'Review with team', parent: 'w1', done: true },
      { id: 'w4', title: 'Reply to design feedback', done: false },
      { id: 'w5', title: 'Inbox to zero', done: true },
    ],
  },
  {
    id: 'life',
    name: 'Personal',
    color: 'honey',
    collapsed: {},
    tasks: [
      { id: 'l1', title: 'Half-marathon block', hasChildren: true },
      { id: 'l2', title: 'Tuesday intervals', parent: 'l1', tag: 'Goal' },
      { id: 'l3', title: 'Long run Saturday', parent: 'l1' },
      { id: 'l4', title: 'Call Mom', done: false },
      { id: 'l5', title: 'Meal prep', done: true },
    ],
  },
];
