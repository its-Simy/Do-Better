import React from 'react';
import { Icon } from '../../components';
import './CreatePage.css';

const CREATE_OPTIONS = [
  {
    id: 'list',
    title: 'List',
    subtitle: 'Capture tasks, ideas, and next steps.',
    icon: 'tasks',
    route: 'create-list',
  },
  {
    id: 'goal',
    title: 'Goal',
    subtitle: 'Define an outcome and break it into progress.',
    icon: 'target',
    route: 'create-goal',
  },
  {
    id: 'habit',
    title: 'Habit',
    subtitle: 'Build a repeatable action inside a goal.',
    icon: 'flame',
    route: 'create-habit',
  },
];

export function CreatePage({ onNavigate }) {
  return (
    <div className="create-screen">
      <div className="create-screen__content">
        <div className="create-options" aria-label="Choose what to create">
          {CREATE_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              className="create-option db-hoverable"
              onClick={() => onNavigate?.(option.route)}
            >
              <span className="create-option__icon">
                <Icon name={option.icon} size={22} />
              </span>
              <span className="create-option__copy">
                <span className="create-option__title">{option.title}</span>
                <span className="create-option__subtitle">{option.subtitle}</span>
              </span>
              <Icon name="arrow-right" size={18} color="var(--text-tertiary)" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
