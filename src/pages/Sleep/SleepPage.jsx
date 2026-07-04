import React from 'react';
import { Card, Badge, Button, StatTile, Icon, Input } from '../../components';
import { useSettings } from '../../state/SettingsContext.jsx';
import './SleepPage.css';

/* Do Better — Sleep screen: log bed/wake, weekly chart, analysis, sleep habits.
 * The chart form, goal line, and time format come from Settings. */

const SLEEP_WEEKS = [
  { label: '3 wks ago', nights: [6.9, 7.2, 6.1, 7.4, 5.8, 8.0, 7.1] },
  { label: '2 wks ago', nights: [6.4, 7.0, 6.8, 5.9, 7.3, 8.4, 7.6] },
  { label: 'Last week', nights: [7.1, 6.6, 6.2, 7.8, 6.9, 7.9, 6.4] },
  { label: 'This week', nights: [6.2, 7.4, 5.9, 7.1, 6.5, 8.2, 6.8] },
];

const DAY_LETTERS = {
  monday: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
  sunday: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
};
const DAY_NAMES = {
  monday: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  sunday: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
};

/* Times are stored as 24h "HH:MM" strings and formatted per the setting. */
function formatTime(value, timeFormat) {
  if (!value) return 'Not set';
  const [hourStr, minuteStr] = value.split(':');
  const hours = Number(hourStr);
  if (Number.isNaN(hours) || minuteStr === undefined) return value;
  if (timeFormat === '24h') return `${hourStr.padStart(2, '0')}:${minuteStr}`;
  const period = hours >= 12 ? 'pm' : 'am';
  const hour12 = hours % 12 || 12;
  return `${hour12}:${minuteStr} ${period}`;
}

function SleepBars({ nights, dayLetters, dayNames, goal, showGoalLine, max }) {
  return (
    <div className="sleep-bars">
      {showGoalLine && (
        <div className="sleep-bars__goal-line" style={{ bottom: `${(goal / max) * 100}%` }} />
      )}
      {nights.map((hours, i) => {
        const short = hours < goal;
        return (
          <div key={i} className="sleep-bars__night">
            <div
              className={`db-hoverable sleep-bars__bar ${short ? 'is-short' : ''}`}
              style={{ height: `${(hours / max) * 100}%` }}
              title={`${dayNames[i]} · ${hours}h`}
            >
              <span className="db-num sleep-bars__value">{hours}</span>
            </div>
            <span className="sleep-bars__day">{dayLetters[i]}</span>
          </div>
        );
      })}
    </div>
  );
}

function SleepLine({ nights, dayLetters, dayNames, goal, showGoalLine, max }) {
  const last = nights.length - 1;
  const x = (index) => 7 + (index / last) * 86;
  const y = (hours) => (1 - hours / max) * 100;
  const lineD = nights.map((hours, index) => `${index === 0 ? 'M' : 'L'} ${x(index).toFixed(2)} ${y(hours).toFixed(2)}`).join(' ');
  const areaD = `${lineD} L ${x(last).toFixed(2)} 100 L ${x(0).toFixed(2)} 100 Z`;

  return (
    <div className="sleep-line">
      <div className="sleep-line__plot">
        {showGoalLine && (
          <div className="sleep-bars__goal-line" style={{ bottom: `${(goal / max) * 100}%` }} />
        )}
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <path d={areaD} fill="color-mix(in srgb, var(--sleep) 13%, transparent)" stroke="none" />
          <path d={lineD} fill="none" stroke="var(--sleep)" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round" />
        </svg>
        {nights.map((hours, i) => (
          <React.Fragment key={i}>
            <span
              className={`sleep-line__point${hours < goal ? ' is-short' : ''}`}
              style={{ left: `${x(i)}%`, top: `${y(hours)}%` }}
              title={`${dayNames[i]} · ${hours}h`}
            />
            <span className="db-num sleep-line__value" style={{ left: `${x(i)}%`, top: `${y(hours)}%` }}>
              {hours}
            </span>
          </React.Fragment>
        ))}
      </div>
      <div className="sleep-line__days">
        {nights.map((_, i) => (
          <span key={i} className="sleep-bars__day" style={{ left: `${x(i)}%` }}>{dayLetters[i]}</span>
        ))}
      </div>
    </div>
  );
}

function sleepLevel(hours, goal) {
  if (hours >= goal) return 4;
  if (hours >= goal - 0.5) return 3;
  if (hours >= goal - 1.5) return 2;
  return 1;
}

function SleepHeatmap({ weeks, dayLetters, dayNames, goal }) {
  return (
    <div className="sleep-heatmap-wrap">
      <div className="sleep-heatmap">
        <span />
        {dayLetters.map((letter, i) => (
          <span key={`day-${i}`} className="sleep-heatmap__day">{letter}</span>
        ))}
        {weeks.map((week) => (
          <React.Fragment key={week.label}>
            <span className="sleep-heatmap__week">{week.label}</span>
            {week.nights.map((hours, di) => (
              <span
                key={di}
                className="sleep-heatmap__cell"
                data-level={sleepLevel(hours, goal)}
                title={`${week.label} ${dayNames[di]} · ${hours}h`}
              />
            ))}
          </React.Fragment>
        ))}
      </div>
      <div className="sleep-heatmap__legend">
        <span>Shorter</span>
        {[1, 2, 3, 4].map((level) => (
          <span key={level} className="sleep-heatmap__cell" data-level={level} />
        ))}
        <span>Longer · vs {goal}h goal</span>
      </div>
    </div>
  );
}

function LogField({ icon, label, value, color }) {
  return (
    <div className="sleep-log-field">
      <span className="sleep-log-field__icon">
        <Icon name={icon} size={18} color={color} />
      </span>
      <div>
        <div className="sleep-log-field__label">{label}</div>
        <div className="db-num sleep-log-field__value">{value}</div>
      </div>
    </div>
  );
}

export function SleepPage() {
  const { settings } = useSettings();
  const { chartType, showGoalLine, goalHours, showInsights } = settings.sleep;
  const { timeFormat, weekStart } = settings.general;

  const [logMode, setLogMode] = React.useState('current');
  const [currentLog, setCurrentLog] = React.useState({
    inBed: '00:18',
    wokeUp: '07:05',
    slept: '6h 47m',
  });
  const [draftLog, setDraftLog] = React.useState({
    date: '2026-07-02',
    inBed: '00:18',
    wokeUp: '07:05',
  });
  const updateDraftLog = (field) => (event) => {
    setDraftLog((log) => ({ ...log, [field]: event.target.value }));
  };
  const startNewLog = () => {
    setDraftLog({
      date: '2026-07-02',
      inBed: '',
      wokeUp: '',
    });
    setLogMode('new');
  };
  const saveDraftLog = (event) => {
    event.preventDefault();
    setCurrentLog({
      inBed: draftLog.inBed,
      wokeUp: draftLog.wokeUp,
      slept: currentLog.slept,
    });
    setLogMode('current');
  };

  const dayLetters = DAY_LETTERS[weekStart] || DAY_LETTERS.monday;
  const dayNames = DAY_NAMES[weekStart] || DAY_NAMES.monday;
  const thisWeek = SLEEP_WEEKS[SLEEP_WEEKS.length - 1].nights;
  const max = Math.max(9, goalHours + 0.5);
  const shownNights = chartType === 'heatmap'
    ? SLEEP_WEEKS.flatMap((week) => week.nights)
    : thisWeek;
  const avg = shownNights.reduce((total, hours) => total + hours, 0) / shownNights.length;

  return (
    <div className="sleep-screen">
      <div className="sleep-screen__content">
        {/* Log card */}
        <Card padding="lg">
          <div className="sleep-card-header">
            <span className="db-eyebrow">{logMode === 'new' ? 'Add sleep log' : 'Log last night'}</span>
            {logMode === 'current' && (
              <Button
                variant="soft"
                size="sm"
                iconLeft={<Icon name="plus" size={16} />}
                onClick={startNewLog}
              >
                New log
              </Button>
            )}
          </div>
          <div className={`sleep-log-transition is-${logMode}`}>
            <div className="sleep-log-panel sleep-log-panel--current">
              <div className="sleep-log-grid">
                <LogField icon="bed" label="In bed" value={formatTime(currentLog.inBed, timeFormat)} color="var(--sleep)" />
                <LogField icon="sun" label="Woke up" value={formatTime(currentLog.wokeUp, timeFormat)} color="var(--goal)" />
                <LogField icon="clock" label="Slept" value={currentLog.slept} color="var(--brand)" />
              </div>
            </div>

            <form className="sleep-log-panel sleep-log-panel--new" onSubmit={saveDraftLog}>
              <div className="sleep-log-form">
                <Input label="Date" type="date" value={draftLog.date} onChange={updateDraftLog('date')} />
                <Input label="In bed" type="time" value={draftLog.inBed} onChange={updateDraftLog('inBed')} />
                <Input label="Woke up" type="time" value={draftLog.wokeUp} onChange={updateDraftLog('wokeUp')} />
              </div>
              <div className="sleep-log-actions">
                <Button type="button" variant="ghost" size="sm" onClick={() => setLogMode('current')}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" iconLeft={<Icon name="check" size={16} />}>
                  Save log
                </Button>
              </div>
            </form>
          </div>
        </Card>

        <div className="sleep-screen__grid">
          {/* Chart */}
          <Card padding="lg">
            <div className="sleep-chart-header">
              <span className="db-eyebrow">{chartType === 'heatmap' ? 'Past 4 weeks' : 'This week'}</span>
              <div className="sleep-chart-header__meta">
                {showGoalLine && chartType !== 'heatmap' && (
                  <span className="sleep-goal-key">
                    <span className="sleep-goal-key__dash" aria-hidden="true" />
                    goal {goalHours}h
                  </span>
                )}
                <Badge tone="sleep">avg {avg.toFixed(1)}h</Badge>
              </div>
            </div>
            {chartType === 'line' && (
              <SleepLine nights={thisWeek} dayLetters={dayLetters} dayNames={dayNames} goal={goalHours} showGoalLine={showGoalLine} max={max} />
            )}
            {chartType === 'heatmap' && (
              <SleepHeatmap weeks={SLEEP_WEEKS} dayLetters={dayLetters} dayNames={dayNames} goal={goalHours} />
            )}
            {chartType !== 'line' && chartType !== 'heatmap' && (
              <SleepBars nights={thisWeek} dayLetters={dayLetters} dayNames={dayNames} goal={goalHours} showGoalLine={showGoalLine} max={max} />
            )}
          </Card>

          {/* Analysis */}
          <div className="sleep-analysis">
            <div className="sleep-analysis__stats">
              <StatTile label="Median bedtime" value={timeFormat === '24h' ? '23:52' : '11:52'} unit={timeFormat === '24h' ? '' : 'pm'} tone="sleep" trend={{ dir: 'down', text: '18m earlier' }} trendGood="down" />
              <StatTile label="Late nights" value="3" unit="/7" trend={{ dir: 'down', text: '-2' }} trendGood="down" />
            </div>
            {showInsights && (
              <Card padding="md">
                <div className="sleep-note">
                  <Icon name="sparkles" size={18} color="var(--sleep)" style={{ flex: '0 0 auto', marginTop: 1 }} />
                  <p className="sleep-note__copy">
                    You fall short most on <strong>Sunday and Wednesday</strong> — both follow late screen time. Shifting lights-out 30 min earlier would close most of your 0.6h weekly deficit.
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
