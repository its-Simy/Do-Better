import React from 'react';
import { Button, Card, Icon } from '../../components';
import './CreateHabitPage.css';

const emptyHabit = {
  behavior: '',
  when: '',
  location: '',
  reason: '',
};

function HabitSentenceField({ label, placeholder, value, onChange }) {
  return (
    <label className="create-habit-field">
      <span className="create-habit-field__label">{label}</span>
      <input
        className="create-habit-field__input"
        type="text"
        required
        value={value}
        placeholder={placeholder}
        onChange={onChange}
      />
    </label>
  );
}

export function CreateHabitPage({ onNavigate }) {
  const [habit, setHabit] = React.useState(emptyHabit);
  const canFinalize = Object.values(habit).every((value) => value.trim().length > 0);

  const updateHabit = (field, value) => {
    setHabit((current) => ({ ...current, [field]: value }));
  };

  const finalizeHabit = (event) => {
    event.preventDefault();
    if (!canFinalize) return;
    onNavigate?.('goals');
  };

  return (
    <div className="create-habit-screen">
      <form className="create-habit-screen__content" onSubmit={finalizeHabit}>
        <Card padding="lg">
          <div className="create-habit-form">
            <span className="db-eyebrow">Habit sentence</span>

            <div className="create-habit-sentence">
              <span className="create-habit-sentence__text">I will</span>
              <HabitSentenceField
                label="Behavior"
                placeholder="Ex: read"
                value={habit.behavior}
                onChange={(event) => updateHabit('behavior', event.target.value)}
              />
              <span className="create-habit-sentence__text">,</span>
              <HabitSentenceField
                label="Time / when"
                placeholder="Ex: after breakfast"
                value={habit.when}
                onChange={(event) => updateHabit('when', event.target.value)}
              />
              <span className="create-habit-sentence__text">in</span>
              <HabitSentenceField
                label="Location"
                placeholder="Ex: the kitchen"
                value={habit.location}
                onChange={(event) => updateHabit('location', event.target.value)}
              />
              <span className="create-habit-sentence__text">to</span>
              <HabitSentenceField
                label="Reason"
                placeholder="Ex: to become wiser"
                value={habit.reason}
                onChange={(event) => updateHabit('reason', event.target.value)}
              />
              <span className="create-habit-sentence__text">.</span>
            </div>

            <div className="create-habit-actions">
              <Button
                type="button"
                variant="secondary"
                onClick={() => onNavigate?.('create')}
              >
                Back
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={!canFinalize}
                iconLeft={<Icon name="check" size={16} />}
              >
                Finalize habit
              </Button>
            </div>
          </div>
        </Card>
      </form>
    </div>
  );
}
