import React from 'react';
import { Button, Card, Icon, IconButton, Input, Select } from '../../components';
import './CreateGoalPage.css';

/* Do Better — Create Goal wizard.
 * Three steps that mirror the goal hierarchy:
 *   1. Goal    — a quantifiable outcome (name + target number).
 *   2. Subgoals — measurable milestones, each with its own target.
 *   3. Habits   — repeatable actions attached to each subgoal.
 * "Number required, unit optional": a target number gates each step;
 * unit and direction are conveniences for the readback sentence. */

const DIRECTION_OPTIONS = [
  { value: 'reach', label: 'Reach' },
  { value: 'reduce', label: 'Reduce to' },
  { value: 'maintain', label: 'Maintain' },
];

const DIRECTION_VERB = {
  reach: 'reach',
  reduce: 'reduce to',
  maintain: 'maintain',
};

const emptyGoal = { name: '', measure: '', target: '', unit: '', direction: 'reach' };

function makeSubgoal() {
  const id = `subgoal-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  return {
    id,
    name: '',
    target: '',
    unit: '',
    direction: 'reach',
    habits: [makeHabit()],
  };
}

function makeHabit() {
  return {
    id: `habit-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    behavior: '',
    when: '',
    location: '',
    reason: '',
  };
}

/* Mirrors HabitSentenceField on CreateHabitPage so the wording and placement
 * stay identical to the standalone "New Habit" flow. */
function HabitSentenceField({ label, placeholder, value, onChange }) {
  return (
    <label className="create-goal-habit-field">
      <span className="create-goal-habit-field__label">{label}</span>
      <input
        className="create-goal-habit-field__input"
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={onChange}
      />
    </label>
  );
}

const isPositiveNumber = (value) => {
  const trimmed = String(value).trim();
  return trimmed !== '' && !Number.isNaN(Number(trimmed)) && Number(trimmed) > 0;
};

const STEPS = [
  { id: 1, label: 'Goal' },
  { id: 2, label: 'Subgoals' },
  { id: 3, label: 'Habits' },
];

function StepRail({ step }) {
  return (
    <div className="create-goal-rail" aria-label="Progress">
      {STEPS.map((item, index) => {
        const done = item.id < step;
        const active = item.id === step;
        const markerClass = [
          'create-goal-rail__marker',
          done ? 'is-done' : '',
          active ? 'is-active' : '',
        ].filter(Boolean).join(' ');
        return (
          <React.Fragment key={item.id}>
            <div className="create-goal-rail__step">
              <span className={markerClass}>
                {done ? <Icon name="check" size={14} strokeWidth={3} /> : item.id}
              </span>
              <span className={`create-goal-rail__label${active ? ' is-active' : ''}`}>
                {item.label}
              </span>
            </div>
            {index < STEPS.length - 1 && <span className="create-goal-rail__line" />}
          </React.Fragment>
        );
      })}
    </div>
  );
}

/* Target + unit + direction — the fields that make an outcome quantifiable. */
function MetricFields({ metric, onChange, targetLabel = 'Target', size = 'md' }) {
  return (
    <div className="create-goal-metric">
      <Select
        label="Direction"
        size={size}
        value={metric.direction}
        options={DIRECTION_OPTIONS}
        onChange={(value) => onChange('direction', value)}
        style={{ flex: '0 0 128px' }}
      />
      <Input
        label={targetLabel}
        size={size}
        type="number"
        min="0"
        placeholder="Ex: 12"
        value={metric.target}
        onChange={(event) => onChange('target', event.target.value)}
        style={{ flex: '1 1 120px' }}
      />
      <Input
        label="Unit (optional)"
        size={size}
        placeholder="Ex: books"
        value={metric.unit}
        onChange={(event) => onChange('unit', event.target.value)}
        style={{ flex: '1 1 140px' }}
      />
    </div>
  );
}

function metricSentence(name, metric) {
  if (!isPositiveNumber(metric.target)) return null;
  const verb = DIRECTION_VERB[metric.direction] || 'reach';
  const unit = metric.unit.trim();
  return `${verb} ${Number(metric.target)}${unit ? ` ${unit}` : ''}`;
}

export function CreateGoalPage({ onNavigate }) {
  const [step, setStep] = React.useState(1);
  const [goal, setGoal] = React.useState(emptyGoal);
  const [subgoals, setSubgoals] = React.useState(() => [makeSubgoal()]);

  const updateGoal = (field, value) => setGoal((current) => ({ ...current, [field]: value }));

  const updateSubgoal = (id, field, value) => {
    setSubgoals((items) => items.map((item) => (
      item.id === id ? { ...item, [field]: value } : item
    )));
  };

  const addSubgoal = () => setSubgoals((items) => [...items, makeSubgoal()]);

  const removeSubgoal = (id) => setSubgoals((items) => (
    items.length === 1 ? items : items.filter((item) => item.id !== id)
  ));

  const addHabit = (subgoalId) => setSubgoals((items) => items.map((item) => (
    item.id === subgoalId ? { ...item, habits: [...item.habits, makeHabit()] } : item
  )));

  const removeHabit = (subgoalId, habitId) => setSubgoals((items) => items.map((item) => {
    if (item.id !== subgoalId) return item;
    if (item.habits.length === 1) return item;
    return { ...item, habits: item.habits.filter((habit) => habit.id !== habitId) };
  }));

  const updateHabit = (subgoalId, habitId, field, value) => setSubgoals((items) => items.map((item) => {
    if (item.id !== subgoalId) return item;
    return {
      ...item,
      habits: item.habits.map((habit) => (
        habit.id === habitId ? { ...habit, [field]: value } : habit
      )),
    };
  }));

  // Per-step gates. A goal/subgoal is valid only once it has a name and a target number.
  const goalReady = goal.name.trim().length > 0 && isPositiveNumber(goal.target);
  const subgoalsReady = subgoals.length > 0
    && subgoals.every((s) => s.name.trim().length > 0 && isPositiveNumber(s.target));
  const habitsReady = subgoals.every((s) => s.habits.some((h) => h.behavior.trim().length > 0));

  const stepReady = step === 1 ? goalReady : step === 2 ? subgoalsReady : habitsReady;

  const goBack = () => {
    if (step === 1) return onNavigate?.('create');
    return setStep((current) => current - 1);
  };

  const goForward = (event) => {
    event.preventDefault();
    if (!stepReady) return;
    if (step < 3) return setStep((current) => current + 1);
    // Final step — hand off to the goals view.
    return onNavigate?.('goals');
  };

  const goalLine = metricSentence(goal.name, goal);

  return (
    <div className="create-goal-screen">
      <form className="create-goal-screen__content" onSubmit={goForward}>
        <StepRail step={step} />

        <Card padding="lg">
          <div className="create-goal-form">
            {step === 1 && (
              <>
                <div className="create-goal-section-head">
                  <span className="db-eyebrow">Define the goal</span>
                  <p className="create-goal-hint">
                    Make it measurable — pick a number you can point to and know you&apos;re done.
                  </p>
                </div>

                <Input
                  label="Goal"
                  placeholder="Ex: Read more this year"
                  value={goal.name}
                  onChange={(event) => updateGoal('name', event.target.value)}
                  iconLeft={<Icon name="target" size={16} />}
                />
                <Input
                  label="What you'll measure (optional)"
                  placeholder="Ex: books finished"
                  value={goal.measure}
                  onChange={(event) => updateGoal('measure', event.target.value)}
                  iconLeft={<Icon name="chart" size={16} />}
                />
                <MetricFields metric={goal} onChange={updateGoal} />

                {goalLine && (
                  <div className="create-goal-readback">
                    <Icon name="check" size={15} strokeWidth={3} color="var(--accent-hover)" />
                    <span>
                      Done when I <strong>{goalLine}</strong>
                      {goal.measure.trim() ? ` of ${goal.measure.trim()}` : ''}.
                    </span>
                  </div>
                )}
              </>
            )}

            {step === 2 && (
              <>
                <div className="create-goal-section-head">
                  <span className="db-eyebrow">Break it into subgoals</span>
                  <p className="create-goal-hint">
                    Each subgoal is a measurable milestone on the way to
                    {goal.name.trim() ? ` “${goal.name.trim()}”` : ' your goal'}.
                  </p>
                </div>

                <div className="create-goal-cards">
                  {subgoals.map((subgoal, index) => {
                    const line = metricSentence(subgoal.name, subgoal);
                    return (
                      <div className="create-goal-subcard" key={subgoal.id}>
                        <div className="create-goal-subcard__head">
                          <span className="create-goal-subcard__index">Subgoal {index + 1}</span>
                          <IconButton
                            type="button"
                            label="Remove subgoal"
                            variant="outline"
                            size="sm"
                            disabled={subgoals.length === 1}
                            onClick={() => removeSubgoal(subgoal.id)}
                          >
                            <Icon name="x" size={15} />
                          </IconButton>
                        </div>
                        <Input
                          placeholder="Ex: Finish the classics shelf"
                          value={subgoal.name}
                          onChange={(event) => updateSubgoal(subgoal.id, 'name', event.target.value)}
                        />
                        <MetricFields
                          metric={subgoal}
                          size="sm"
                          onChange={(field, value) => updateSubgoal(subgoal.id, field, value)}
                        />
                        {line && (
                          <div className="create-goal-readback is-compact">
                            <Icon name="check" size={14} strokeWidth={3} color="var(--accent-hover)" />
                            <span>Done when I <strong>{line}</strong>.</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  iconLeft={<Icon name="plus" size={16} />}
                  onClick={addSubgoal}
                >
                  Add subgoal
                </Button>
              </>
            )}

            {step === 3 && (
              <>
                <div className="create-goal-section-head">
                  <span className="db-eyebrow">Add habits to each subgoal</span>
                  <p className="create-goal-hint">
                    Habits are the repeatable actions that move each subgoal forward. Add at least one per subgoal.
                  </p>
                </div>

                <div className="create-goal-cards">
                  {subgoals.map((subgoal, index) => (
                    <div className="create-goal-subcard" key={subgoal.id}>
                      <div className="create-goal-subcard__head">
                        <span className="create-goal-subcard__index">
                          {subgoal.name.trim() || `Subgoal ${index + 1}`}
                        </span>
                      </div>

                      <div className="create-goal-habits">
                        {subgoal.habits.map((habit) => (
                          <div className="create-goal-habit" key={habit.id}>
                            <div className="create-goal-habit-sentence">
                              <span className="create-goal-habit-sentence__text">I will</span>
                              <HabitSentenceField
                                label="Behavior"
                                placeholder="Ex: read"
                                value={habit.behavior}
                                onChange={(event) => updateHabit(subgoal.id, habit.id, 'behavior', event.target.value)}
                              />
                              <span className="create-goal-habit-sentence__text">,</span>
                              <HabitSentenceField
                                label="Time / when"
                                placeholder="Ex: after breakfast"
                                value={habit.when}
                                onChange={(event) => updateHabit(subgoal.id, habit.id, 'when', event.target.value)}
                              />
                              <span className="create-goal-habit-sentence__text">in</span>
                              <HabitSentenceField
                                label="Location"
                                placeholder="Ex: the kitchen"
                                value={habit.location}
                                onChange={(event) => updateHabit(subgoal.id, habit.id, 'location', event.target.value)}
                              />
                              <span className="create-goal-habit-sentence__text">to</span>
                              <HabitSentenceField
                                label="Reason"
                                placeholder="Ex: to become wiser"
                                value={habit.reason}
                                onChange={(event) => updateHabit(subgoal.id, habit.id, 'reason', event.target.value)}
                              />
                              <span className="create-goal-habit-sentence__text">.</span>
                            </div>
                            <IconButton
                              type="button"
                              label="Remove habit"
                              variant="outline"
                              size="sm"
                              disabled={subgoal.habits.length === 1}
                              onClick={() => removeHabit(subgoal.id, habit.id)}
                            >
                              <Icon name="x" size={15} />
                            </IconButton>
                          </div>
                        ))}
                      </div>

                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        iconLeft={<Icon name="plus" size={16} />}
                        onClick={() => addHabit(subgoal.id)}
                      >
                        Add habit
                      </Button>
                    </div>
                  ))}
                </div>
              </>
            )}

            <div className="create-goal-actions">
              <Button type="button" variant="secondary" onClick={goBack}>
                {step === 1 ? 'Back' : 'Previous'}
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={!stepReady}
                iconLeft={<Icon name={step === 3 ? 'check' : 'arrow-right'} size={16} />}
              >
                {step === 3 ? 'Finalize goal' : 'Continue'}
              </Button>
            </div>
          </div>
        </Card>
      </form>
    </div>
  );
}
