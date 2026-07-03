import React from 'react';
import { Card, Button, Icon, Select, ProgressBar, ProgressRing } from '../../components';
import { useHoldToFill } from '../../hooks/useHoldToFill.js';
import { useSettings } from '../../state/SettingsContext.jsx';
import './GoalsPage.css';

/* Do Better — Goals screen: goal breakdown → habits → roadmap, with "good enough" target.
 * The check-in widget and per-goal progress render per the Goals & Sleep settings. */

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

const TRACKER_WEEKS = 52;

/* The "All goals" view is always the default; the only other scope for now is
 * the goal currently shown in the hold tracker above. */
const TRACKER_SCOPES = [
  { value: 'all', label: 'All goals' },
  { value: 'read', label: GOAL_TRACKER_BEHAVIOR },
];

/* Deterministic mock activity so the grid is stable across renders.
 * Levels 0–4 mirror GitHub's contribution intensity buckets. */
function buildContributions(weeks) {
  let seed = 7;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  return Array.from({ length: weeks }, () => (
    Array.from({ length: 7 }, () => {
      const r = rand();
      if (r < 0.42) return 0;
      if (r < 0.63) return 1;
      if (r < 0.82) return 2;
      if (r < 0.93) return 3;
      return 4;
    })
  ));
}

const DAY_LABELS = {
  monday: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  sunday: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
};
const LABELED_DAYS = ['Mon', 'Wed', 'Fri'];

function ActivityHeatmap({ weeks, weekStart }) {
  const dayLabels = DAY_LABELS[weekStart] || DAY_LABELS.monday;
  return (
    <>
      <div className="goals-tracker__frame">
        <div className="goals-tracker__days" aria-hidden="true">
          {dayLabels.map((day) => (
            <span key={day} className="goals-tracker__day-label">
              {LABELED_DAYS.includes(day) ? day : ''}
            </span>
          ))}
        </div>
        <div className="goals-tracker__grid">
          {weeks.map((week, wi) => (
            <div className="goals-tracker__week" key={wi}>
              {week.map((level, di) => (
                <span
                  key={di}
                  className="goals-tracker__cell"
                  data-level={level}
                  title={`${dayLabels[di]} · wk ${wi + 1} · ${level === 0 ? 'no check-ins' : `level ${level}`}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="goals-tracker__legend">
        <span>Less</span>
        {[0, 1, 2, 3, 4].map((level) => (
          <span key={level} className="goals-tracker__cell" data-level={level} />
        ))}
        <span>More</span>
      </div>
    </>
  );
}

function ActivityBars({ weeklyActive }) {
  return (
    <>
      <div className="goals-activity-plot">
        {weeklyActive.map((days, index) => (
          <div className="goals-activity-plot__col" key={index} title={`Week ${index + 1} · ${days} active ${days === 1 ? 'day' : 'days'}`}>
            <span className="goals-activity-bar" style={{ height: `${(days / 7) * 100}%` }} />
          </div>
        ))}
      </div>
      <div className="goals-tracker__legend">
        <span>Active days per week · 0–7 · past year</span>
      </div>
    </>
  );
}

function ActivityLine({ weeklyActive }) {
  const last = weeklyActive.length - 1;
  const x = (index) => 1 + (index / last) * 98;
  const y = (days) => 6 + (1 - days / 7) * 88;
  const lineD = weeklyActive.map((days, index) => `${index === 0 ? 'M' : 'L'} ${x(index).toFixed(2)} ${y(days).toFixed(2)}`).join(' ');
  const areaD = `${lineD} L 99 94 L 1 94 Z`;

  return (
    <>
      <div className="goals-activity-plot goals-activity-plot--line">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <path d={areaD} fill="color-mix(in srgb, var(--goal) 13%, transparent)" stroke="none" />
          <path d={lineD} fill="none" stroke="var(--goal)" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round" />
        </svg>
        <span
          className="goals-activity-line-dot"
          style={{ left: `${x(last)}%`, top: `${y(weeklyActive[last])}%` }}
          title={`This week · ${weeklyActive[last]} active days`}
        />
        <div className="goals-activity-plot__hover">
          {weeklyActive.map((days, index) => (
            <span key={index} title={`Week ${index + 1} · ${days} active ${days === 1 ? 'day' : 'days'}`} />
          ))}
        </div>
      </div>
      <div className="goals-tracker__legend">
        <span>Active days per week · 0–7 · past year</span>
      </div>
    </>
  );
}

function ContributionTracker({ variant, weekStart }) {
  const [scope, setScope] = React.useState('all');
  const weeks = React.useMemo(() => buildContributions(TRACKER_WEEKS), []);
  const weeklyActive = React.useMemo(
    () => weeks.map((week) => week.filter((level) => level > 0).length),
    [weeks],
  );
  const activeDays = weeklyActive.reduce((total, count) => total + count, 0);

  return (
    <Card padding="lg">
      <div className="goals-card-header">
        <div className="goals-tracker__heading">
          <span className="db-eyebrow">Check-in streak</span>
          <span className="goals-tracker__count">{activeDays} active days · past year</span>
        </div>
        <Select
          size="sm"
          value={scope}
          options={TRACKER_SCOPES}
          onChange={setScope}
          style={{ flex: '0 0 auto', minWidth: 160 }}
        />
      </div>
      <div className="goals-tracker">
        {variant === 'bar' && <ActivityBars weeklyActive={weeklyActive} />}
        {variant === 'line' && <ActivityLine weeklyActive={weeklyActive} />}
        {variant !== 'bar' && variant !== 'line' && <ActivityHeatmap weeks={weeks} weekStart={weekStart} />}
      </div>
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

/* Each goal carries its own roadmap — the subgoals it breaks down into,
 * ordered from done → active → upcoming. */
export const GOALS_LIST = [
  {
    name: 'Read 12 books', sub: 'Become wiser / analytical', value: 66, target: 75,
    roadmap: [
      { done: true, title: 'Finish 4 books', sub: 'Q1 · foundations shelf' },
      { done: true, title: 'Reach 6 books', sub: 'Halfway mark' },
      { active: true, title: 'Finish the classics shelf', sub: '8 / 12 books' },
      { title: 'Hit 12 books', sub: 'Good enough threshold' },
    ],
  },
  {
    name: 'Run a 16 km long run', sub: 'Good enough by race day', value: 72, target: 80,
    roadmap: [
      { done: true, title: 'Build a running base', sub: 'Weeks 1–3 · 3 runs / week' },
      { done: true, title: 'Add a weekly long run', sub: 'Weeks 4–5 · up to 10 km' },
      { active: true, title: 'Reach 16 km long run', sub: 'Weeks 6–8 · good enough threshold' },
      { title: 'Taper + race week', sub: 'Weeks 9–10 · keep it easy' },
    ],
  },
  {
    name: 'Save $5,000', sub: 'Emergency fund', value: 40, target: 60,
    roadmap: [
      { done: true, title: 'Save first $1,000', sub: 'Starter buffer' },
      { active: true, title: 'Reach $2,000', sub: '40% funded' },
      { title: 'Hit $3,500', sub: 'Auto-transfer boost' },
      { title: 'Reach $5,000', sub: 'Fully funded' },
    ],
  },
  {
    name: 'Ship the MVP', sub: 'Do Better v1 live', value: 55, target: 70,
    roadmap: [
      { done: true, title: 'Lock the scope', sub: 'Core loop only' },
      { active: true, title: 'Build core screens', sub: 'Goals + habits' },
      { title: 'Wire the data layer', sub: 'Persistence' },
      { title: 'Ship v1', sub: 'Good enough to launch' },
    ],
  },
  {
    name: 'Meditate 100 days', sub: 'Calmer mornings', value: 30, target: 50,
    roadmap: [
      { done: true, title: 'First 10-day streak', sub: 'Morning anchor' },
      { active: true, title: 'Reach 30 days', sub: 'Habit forming' },
      { title: 'Hit 60 days', sub: 'Consistency' },
      { title: 'Reach 100 days', sub: 'Good enough threshold' },
    ],
  },
  {
    name: 'Sleep 7h+ nightly', sub: 'Consistent recovery', value: 84, target: 80,
    roadmap: [
      { done: true, title: 'Set a wind-down alarm', sub: '10:30pm cue' },
      { done: true, title: 'Reach 6h average', sub: 'Baseline' },
      { active: true, title: 'Hold 7h for 2 weeks', sub: '84% of nights' },
      { title: 'Maintain 7h+ nightly', sub: 'Good enough threshold' },
    ],
  },
];

const GOAL_SCOPES = GOALS_LIST.map((goal) => ({ value: goal.name, label: goal.name }));

function GoalListRow({ name, sub, value, target, progressStyle, showTargets }) {
  const asRing = progressStyle === 'ring';
  return (
    <div className="goals-list-row">
      <span className="goals-list-row__icon">
        <Icon name="target" size={18} />
      </span>
      <div className="goals-list-row__copy">
        <div className="goals-list-row__title">{name}</div>
        <div className="goals-list-row__sub">{sub}</div>
        {!asRing && (
          <ProgressBar
            value={value}
            target={showTargets ? target : null}
            color="var(--goal)"
            height={7}
            style={{ marginTop: 6 }}
          />
        )}
      </div>
      {asRing ? (
        <ProgressRing value={value} size={46} thickness={5} color="var(--goal)" label={value} sublabel="%" />
      ) : (
        <span className="db-num goals-list-row__pct">{value}%</span>
      )}
    </div>
  );
}

export function GoalsPage({ onNavigate }) {
  const [roadmapGoal, setRoadmapGoal] = React.useState(GOALS_LIST[0].name);
  const selectedGoal = GOALS_LIST.find((goal) => goal.name === roadmapGoal) || GOALS_LIST[0];
  const { settings } = useSettings();
  const goalSettings = settings.goals;

  return (
    <div className="goals-screen">
      <div className="goals-screen__content">
        <div className="goals-checkin">
          <span className="db-eyebrow goals-section-title">Daily Habits Towards Goals</span>
          <GoalHoldTracker />
        </div>

        {goalSettings.showInsights && (
          <AiNote>
            <strong>How this moves the needle.</strong> Your “Run 3× / week” habit is the biggest driver — at the current pace you’ll clear a 16 km long run by week 7, hitting <em>good enough</em> 9 days before race day. Missing more than one run a week is the main risk.
          </AiNote>
        )}

        <ContributionTracker
          variant={goalSettings.activityChart}
          weekStart={settings.general.weekStart}
        />

        <div className="goals-screen__grid">
          {/* List of goals */}
          <Card padding="lg">
            <div className="goals-card-header">
              <span className="db-eyebrow">List of goals</span>
              <Button
                variant="ghost"
                size="sm"
                iconLeft={<Icon name="plus" size={16} />}
                onClick={() => onNavigate?.('create-goal')}
              >
                Add
              </Button>
            </div>
            <div className="goals-list">
              {GOALS_LIST.map((goal) => (
                <GoalListRow
                  key={goal.name}
                  {...goal}
                  progressStyle={goalSettings.progressStyle}
                  showTargets={goalSettings.showTargets}
                />
              ))}
            </div>
          </Card>

          {/* Roadmap — per selected goal, showing its subgoals */}
          <Card padding="lg">
            <div className="goals-roadmap-header">
              <div className="goals-roadmap-header__title">
                <Icon name="map" size={16} color="var(--text-tertiary)" />
                <span className="db-eyebrow">Roadmap</span>
              </div>
              <Select
                size="sm"
                value={roadmapGoal}
                options={GOAL_SCOPES}
                onChange={setRoadmapGoal}
                style={{ flex: '0 0 auto', minWidth: 180 }}
              />
            </div>
            <div className="goals-roadmap-list">
              {selectedGoal.roadmap.map((milestone) => (
                <Milestone
                  key={milestone.title}
                  done={milestone.done}
                  active={milestone.active}
                  title={milestone.title}
                  sub={milestone.sub}
                />
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
