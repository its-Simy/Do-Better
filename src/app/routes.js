import { ListsPage } from '../pages/Lists/ListsPage.jsx';
import { GoalsPage } from '../pages/Goals/GoalsPage.jsx';
import { SleepPage } from '../pages/Sleep/SleepPage.jsx';
import { InsightsPage } from '../pages/Insights/InsightsPage.jsx';
import { SettingsPage } from '../pages/Settings/SettingsPage.jsx';
import { CreatePage } from '../pages/Create/CreatePage.jsx';
import { CreateListPage } from '../pages/Create/CreateListPage.jsx';
import { CreateGoalPage } from '../pages/Create/CreateGoalPage.jsx';
import { CreateHabitPage } from '../pages/Create/CreateHabitPage.jsx';

export const APP_ROUTES = {
  lists: {
    title: 'Lists',
    subtitle: 'Everything on your plate',
    icon: 'tasks',
    component: ListsPage,
  },
  goals: {
    title: 'Goals',
    subtitle: 'Big things, broken into habits',
    icon: 'target',
    component: GoalsPage,
  },
  sleep: {
    title: 'Sleep',
    subtitle: 'Rest is part of the plan',
    icon: 'moon',
    component: SleepPage,
  },
  insights: {
    title: 'Insights',
    subtitle: 'How the week actually went',
    icon: 'chart',
    component: InsightsPage,
  },
  settings: {
    title: 'Settings',
    subtitle: 'Profile, appearance, and notifications',
    icon: 'settings',
    component: SettingsPage,
  },
  create: {
    title: 'New',
    subtitle: 'Choose what to create',
    icon: 'plus',
    component: CreatePage,
  },
  'create-list': {
    title: 'New List',
    subtitle: 'Name it, add components, then finalize',
    icon: 'tasks',
    component: CreateListPage,
  },
  'create-goal': {
    title: 'New Goal',
    subtitle: 'Set a target, break it into subgoals and habits',
    icon: 'target',
    component: CreateGoalPage,
  },
  'create-habit': {
    title: 'New Habit',
    subtitle: 'Fill out the habit sentence',
    icon: 'flame',
    component: CreateHabitPage,
  },
};

export const PRIMARY_ROUTE_IDS = ['lists', 'goals', 'sleep', 'insights'];
