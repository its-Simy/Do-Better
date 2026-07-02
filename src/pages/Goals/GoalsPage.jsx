import React from 'react';
import { Card, Button, HabitRow, Icon } from '../../components';
import { useHoldToFill } from '../../hooks/useHoldToFill.js';
import './GoalsPage.css';

/* Do Better — Goals screen: goal breakdown → habits → roadmap, with "good enough" target */

function AiNote({ children }) {
  return (
    <div className="goals-ai-note">
      <span className="goals-ai-note__icon"><Icon name="sparkles" size={18} color="var(--accent-hover)" /></span>
      <div className="goals-ai-note__copy">{children}</div>
    </div>
  );
}

const GOAL_TRACKER_SPEED = 80;
const GOAL_TRACKER_FLASH_MS = 500;
const GOAL_TRACKER_BEHAVIOR = 'Read';
const GOAL_TRACKER_REASON = 'wiser / analytical';

function GoalHoldTracker() {
  const {
    fillRef,
    holdProps,
    done,
    completeFlash,
  } = useHoldToFill({
    speed: GOAL_TRACKER_SPEED,
    completeFlashMs: GOAL_TRACKER_FLASH_MS,
  });
  const trackerClass = [
    'goals-hold-tracker',
    done ? 'is-done' : '',
    completeFlash ? 'is-flashing' : '',
  ].filter(Boolean).join(' ');

  return (
    <Card padding="lg">
      <button
        ref={fillRef}
        type="button"
        className={trackerClass}
        aria-label={done ? `Reset ${GOAL_TRACKER_BEHAVIOR.toLowerCase()} tracker` : `Hold to track ${GOAL_TRACKER_BEHAVIOR.toLowerCase()}`}
        {...holdProps}
      >
        <span className="goals-hold-tracker__main">
          <span className="goals-hold-tracker__icon">
            <Icon name={done ? 'check' : 'target'} size={22} strokeWidth={done ? 3 : 2} />
          </span>
          <span className="goals-hold-tracker__copy">
            <span className="goals-hold-tracker__title">{GOAL_TRACKER_BEHAVIOR}</span>
            <span className="goals-hold-tracker__sub">I want to become</span>
            <span className="goals-hold-tracker__title">{GOAL_TRACKER_REASON}</span>
          </span>
        </span>
        <span className="goals-hold-tracker__status">{done ? 'Done' : 'Hold'}</span>
      </button>
    </Card>
  );
}

function Milestone({ done, active, title, sub }) {
  const markerClass = [
    'goals-milestone__marker',
    done ? 'is-done' : '',
    active ? 'is-active' : '',
  ].filter(Boolean).join(' ');
  const titleClass = [
    'goals-milestone__title',
    done ? 'is-done' : '',
    active ? 'is-active' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className="goals-milestone">
      <div className="goals-milestone__rail">
        <span className={markerClass}>
          {done ? <Icon name="check" size={15} strokeWidth={3} /> : <span className="db-num goals-milestone__dot">•</span>}
        </span>
        <span className="goals-milestone__line" />
      </div>
      <div className="goals-milestone__copy">
        <div className={titleClass}>{title}</div>
        <div className="goals-milestone__sub">{sub}</div>
      </div>
    </div>
  );
}

export function GoalsPage() {
  const [habits, setHabits] = React.useState([
    { name: 'Run 3× / week', days: [true, true, false, true, true, true, false], streak: 3, accent: 'var(--goal)' },
    { name: 'Stretch 10 min', days: [true, true, true, true, true, false, true], streak: 9, accent: 'var(--goal)' },
    { name: 'Strength session', days: [false, true, false, false, true, false, false], streak: 1, accent: 'var(--goal)' },
  ]);
  const toggleDay = (hi, di) => setHabits((hs) => hs.map((h, i) => i !== hi ? h : { ...h, days: h.days.map((d, j) => j === di ? !d : d) }));

  return (
    <div className="goals-screen">
      <div className="goals-screen__content">
        <GoalHoldTracker />

        <AiNote>
          <strong>How this moves the needle.</strong> Your “Run 3× / week” habit is the biggest driver — at the current pace you’ll clear a 16 km long run by week 7, hitting <em>good enough</em> 9 days before race day. Missing more than one run a week is the main risk.
        </AiNote>

        <div className="goals-screen__grid">
          {/* Habits this goal breaks into */}
          <Card padding="lg">
            <div className="goals-card-header">
              <span className="db-eyebrow">Breaks down into habits</span>
              <Button variant="ghost" size="sm" iconLeft={<Icon name="plus" size={16} />}>Add</Button>
            </div>
            <div className="goals-habits">
              {habits.map((h, i) => (
                <HabitRow key={h.name} name={h.name} days={h.days} streak={h.streak} accent={h.accent} onToggleDay={(di) => toggleDay(i, di)} />
              ))}
            </div>
          </Card>

          {/* Roadmap */}
          <Card padding="lg">
            <div className="goals-roadmap-header">
              <Icon name="map" size={16} color="var(--text-tertiary)" />
              <span className="db-eyebrow">Roadmap</span>
            </div>
            <Milestone done title="Build a running base" sub="Weeks 1–3 · 3 runs / week" />
            <Milestone done title="Add a weekly long run" sub="Weeks 4–5 · up to 10 km" />
            <Milestone active title="Reach 16 km long run" sub="Weeks 6–8 · good enough threshold" />
            <Milestone title="Taper + race week" sub="Weeks 9–10 · keep it easy" />
          </Card>
        </div>
      </div>
    </div>
  );
}
