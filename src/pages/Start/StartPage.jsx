import React from 'react';
import { Icon } from '../../components';
import './StartPage.css';

export function StartPage({ options = [], onNavigate }) {
  return (
    <main className="start-page">
      <div className="start-page__content">
        <div className="start-page__mark">
          <span className="start-page__brand">Do Better</span>
        </div>
        <div className="start-page__options" aria-label="Primary sections">
          {options.map((option) => (
            <button
              key={option.id}
              type="button"
              className="start-option db-hoverable"
              onClick={() => onNavigate(option.id)}
            >
              <span className="start-option__icon">
                <Icon name={option.icon} size={22} />
              </span>
              <span className="start-option__copy">
                <span className="start-option__title">{option.title}</span>
                <span className="start-option__subtitle">{option.subtitle}</span>
              </span>
              <Icon name="arrow-right" size={18} color="var(--text-tertiary)" />
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
