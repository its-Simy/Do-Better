import React from 'react';
import { Card, Badge, Button, StatTile, HabitRow, Icon, Input } from '../../components';
import './SleepPage.css';

/* Do Better — Sleep screen: log bed/wake, weekly chart, analysis, sleep habits */

function SleepBars() {
  const nights = [
    { d: 'M', h: 6.2 }, { d: 'T', h: 7.4 }, { d: 'W', h: 5.9 },
    { d: 'T', h: 7.1 }, { d: 'F', h: 6.5 }, { d: 'S', h: 8.2 }, { d: 'S', h: 6.8 },
  ];
  const max = 9;
  const goal = 7.5;
  return (
    <div className="sleep-bars">
      {/* goal line */}
      <div className="sleep-bars__goal-line" style={{ bottom: `${(goal / max) * 100}%` }}>
        <span className="db-num sleep-bars__goal-label">goal 7.5h</span>
      </div>
      {nights.map((n, i) => {
        const short = n.h < goal;
        return (
          <div key={i} className="sleep-bars__night">
            <div
              className={`db-hoverable sleep-bars__bar ${short ? 'is-short' : ''}`}
              style={{ height: `${(n.h / max) * 100}%` }}
            >
              <span className="db-num sleep-bars__value">{n.h}</span>
            </div>
            <span className="sleep-bars__day">{n.d}</span>
          </div>
        );
      })}
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
  const [logMode, setLogMode] = React.useState('current');
  const [currentLog, setCurrentLog] = React.useState({
    inBed: '12:18 am',
    wokeUp: '7:05 am',
    slept: '6h 47m',
  });
  const [draftLog, setDraftLog] = React.useState({
    date: '2026-07-02',
    inBed: '00:18',
    wokeUp: '07:05',
  });
  const [habits, setHabits] = React.useState([
    { name: 'No screens after 10pm', days: [true, true, true, false, true, true, true], streak: 4 },
    { name: 'In bed by 11:00pm', days: [false, true, false, true, false, true, true], streak: 2 },
  ]);
  const toggleDay = (hi, di) => setHabits((hs) => hs.map((h, i) => i !== hi ? h : { ...h, days: h.days.map((d, j) => j === di ? !d : d) }));
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
      inBed: draftLog.inBed || 'Not set',
      wokeUp: draftLog.wokeUp || 'Not set',
      slept: currentLog.slept,
    });
    setLogMode('current');
  };

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
                <LogField icon="bed" label="In bed" value={currentLog.inBed} color="var(--sleep)" />
                <LogField icon="sun" label="Woke up" value={currentLog.wokeUp} color="var(--goal)" />
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
              <span className="db-eyebrow">This week</span>
              <Badge tone="sleep">avg 6.9h</Badge>
            </div>
            <SleepBars />
          </Card>

          {/* Analysis */}
          <div className="sleep-analysis">
            <div className="sleep-analysis__stats">
              <StatTile label="Median bedtime" value="11:52" unit="pm" tone="sleep" trend={{ dir: 'down', text: '18m earlier' }} trendGood="down" />
              <StatTile label="Late nights" value="3" unit="/7" trend={{ dir: 'down', text: '-2' }} trendGood="down" />
            </div>
            <Card padding="md">
              <div className="sleep-note">
                <Icon name="sparkles" size={18} color="var(--sleep)" style={{ flex: '0 0 auto', marginTop: 1 }} />
                <p className="sleep-note__copy">
                  You fall short most on <strong>Sunday and Wednesday</strong> — both follow late screen time. Shifting lights-out 30 min earlier would close most of your 0.6h weekly deficit.
                </p>
              </div>
            </Card>
          </div>
        </div>

        {/* Sleep habits */}
        <Card padding="lg">
          <span className="db-eyebrow">Sleep habits</span>
          <div className="sleep-habits">
            {habits.map((h, i) => (
              <HabitRow key={h.name} name={h.name} days={h.days} streak={h.streak} accent="var(--sleep)" onToggleDay={(di) => toggleDay(i, di)} />
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
