import React from 'react';
import { Card, Badge, StatTile, ProgressBar, Icon } from '../../components';
import './InsightsPage.css';

/* Do Better — Insights screen: weekly completed, trends, AI goal-contribution */

function WeekBars() {
  const weeks = [
    { w: 'W1', pct: 58 }, { w: 'W2', pct: 64 }, { w: 'W3', pct: 55 },
    { w: 'W4', pct: 72 }, { w: 'W5', pct: 78 }, { w: 'W6', pct: 82 },
  ];
  return (
    <div className="insights-week-bars">
      {weeks.map((wk, i) => {
        const last = i === weeks.length - 1;
        return (
          <div key={i} className="insights-week-bars__week">
            <span className={`db-num insights-week-bars__value ${last ? 'is-current' : ''}`}>{wk.pct}%</span>
            <div
              className={`db-hoverable insights-week-bars__bar ${last ? 'is-current' : ''}`}
              style={{ height: `${wk.pct}%` }}
            />
            <span className="insights-week-bars__label">{wk.w}</span>
          </div>
        );
      })}
    </div>
  );
}

function GoalContribution({ name, pct, color, note }) {
  return (
    <div className="insights-goal-card">
      <div className="insights-goal-card__header">
        <span className="insights-goal-card__name">{name}</span>
        <span className="db-num insights-goal-card__pct" style={{ color }}>{pct}%</span>
      </div>
      <ProgressBar value={pct} color={color} height={8} />
      <span className="insights-goal-card__note">{note}</span>
    </div>
  );
}

export function InsightsPage() {
  const completed = [
    { title: 'Ran 4 times', tag: 'Goal', tone: 'goal' },
    { title: 'Read 3 books this month', tag: 'Goal', tone: 'goal' },
    { title: 'Hit inbox zero 5 days', tag: 'Work', tone: 'brand' },
    { title: '9-day stretch streak', tag: 'Habit', tone: 'accent' },
    { title: 'In bed by 11 — 4 nights', tag: 'Sleep', tone: 'sleep' },
  ];
  return (
    <div className="insights-screen">
      <div className="insights-screen__content">
        <div className="insights-stats-grid">
          <StatTile label="Tasks done" value="38" trend={{ dir: 'up', text: '+5' }} tone="brand" />
          <StatTile label="Completion" value="82" unit="%" trend={{ dir: 'up', text: '+6%' }} tone="goal" />
          <StatTile label="Best streak" value="12" unit="d" tone="accent" />
          <StatTile label="Avg sleep" value="6.9" unit="h" trend={{ dir: 'up', text: '+22m' }} tone="sleep" />
        </div>

        <div className="insights-main-grid">
          {/* Completion trend */}
          <Card padding="lg">
            <div className="insights-card-header">
              <span className="db-eyebrow">Weekly completion</span>
              <Badge tone="success" dot>Trending up</Badge>
            </div>
            <WeekBars />
          </Card>

          {/* Weekly review */}
          <Card padding="lg">
            <span className="db-eyebrow">What you finished this week</span>
            <div className="insights-finished-list">
              {completed.map((c, i) => (
                <div key={i} className="insights-finished-item">
                  <span className="insights-finished-item__check">
                    <Icon name="check" size={13} color="var(--on-brand)" strokeWidth={3} />
                  </span>
                  <span className="insights-finished-item__title">{c.title}</span>
                  <Badge tone={c.tone}>{c.tag}</Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* AI goal contribution */}
        <Card padding="lg">
          <div className="insights-ai-header">
            <span className="insights-ai-header__icon">
              <Icon name="sparkles" size={17} color="var(--accent-hover)" />
            </span>
            <span className="db-eyebrow">Did this week move your goals?</span>
          </div>
          <p className="insights-ai-copy">
            Most of your effort landed where it counts. Your running goal got the lion’s share and is now <strong>2 weeks ahead</strong>. Reading slipped a little — three short sessions would put it back on pace.
          </p>
          <div className="insights-goal-grid">
            <GoalContribution name="Half marathon" pct={62} color="var(--goal)" note="4 of 4 runs · ahead of schedule" />
            <GoalContribution name="Read 24 books" pct={24} color="var(--brand)" note="Slightly behind — add 1 session" />
            <GoalContribution name="Better sleep" pct={14} color="var(--sleep)" note="Improving — 2 fewer late nights" />
          </div>
        </Card>
      </div>
    </div>
  );
}
