import React from 'react';
import { Avatar, Badge, Button, Card, Icon, Input, Select, Segmented, Swatches, Switch } from '../../components';
import { useSettings } from '../../state/SettingsContext.jsx';
import { useLists } from '../../state/ListsContext.jsx';
import { LIST_COLORS, getListColorValue } from '../Lists/data/listColors.js';
import './SettingsPage.css';

const SECTIONS = [
  { value: 'general', label: 'General' },
  { value: 'lists', label: 'Lists' },
  { value: 'widgets', label: 'Goals & Sleep' },
];

const BACKGROUND_OPTIONS = [
  { value: 'light', label: 'Light mode' },
  { value: 'dark', label: 'Dark mode' },
  { value: 'system', label: 'System default' },
];

const NOTIFICATION_TYPES = [
  { value: 'email', label: 'Email' },
  { value: 'text', label: 'Text' },
  { value: 'both', label: 'Both' },
];

const TIME_FORMATS = [
  { value: '12h', label: '12-hour' },
  { value: '24h', label: '24-hour' },
];

const WEEK_STARTS = [
  { value: 'monday', label: 'Monday' },
  { value: 'sunday', label: 'Sunday' },
];

const GOAL_ACTIVITY_CHARTS = [
  { value: 'heatmap', label: 'Heatmap' },
  { value: 'bar', label: 'Bars' },
  { value: 'line', label: 'Line' },
];

const GOAL_PROGRESS_STYLES = [
  { value: 'bar', label: 'Bars' },
  { value: 'ring', label: 'Rings' },
];

const SLEEP_CHARTS = [
  { value: 'bar', label: 'Bars' },
  { value: 'line', label: 'Line' },
  { value: 'heatmap', label: 'Heatmap' },
];

const SLEEP_GOALS = [6, 6.5, 7, 7.5, 8, 8.5, 9].map((hours) => ({
  value: String(hours),
  label: `${hours} hours`,
}));

/* One settings line: label + explanation on the left, control on the right. */
function SettingRow({ label, description, disabled = false, children }) {
  return (
    <div className={`settings-row${disabled ? ' is-disabled' : ''}`}>
      <div className="settings-row__copy">
        <span className="settings-row__label">{label}</span>
        {description && <span className="settings-row__desc">{description}</span>}
      </div>
      <div className="settings-row__control">{children}</div>
    </div>
  );
}

function GeneralSection({ themePreference, onThemePreferenceChange }) {
  const { settings, updateSetting, resetSettings } = useSettings();
  const general = settings.general;
  const [profile, setProfile] = React.useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    avatarSrc: '',
  });

  const fullName = [profile.firstName, profile.lastName].filter(Boolean).join(' ') || 'Profile';

  const updateProfile = (field) => (eventOrValue) => {
    const value = eventOrValue?.target ? eventOrValue.target.value : eventOrValue;
    setProfile((current) => ({ ...current, [field]: value }));
  };

  const updateAvatar = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setProfile((current) => ({ ...current, avatarSrc: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      <Card padding="lg">
        <div className="settings-profile">
          <div className="settings-profile__avatar">
            <Avatar src={profile.avatarSrc} name={fullName} size={92} />
            <label className="settings-upload-button db-hoverable">
              <Icon name="plus" size={16} />
              <span>Photo</span>
              <input type="file" accept="image/*" onChange={updateAvatar} />
            </label>
          </div>
          <div className="settings-profile__fields">
            <div className="settings-section-header">
              <span className="db-eyebrow">Profile</span>
            </div>
            <div className="settings-field-grid">
              <Input label="First name" value={profile.firstName} onChange={updateProfile('firstName')} autoComplete="given-name" />
              <Input label="Last name" value={profile.lastName} onChange={updateProfile('lastName')} autoComplete="family-name" />
              <Input label="Phone number" type="tel" value={profile.phone} onChange={updateProfile('phone')} autoComplete="tel" />
              <Input label="Email" type="email" value={profile.email} onChange={updateProfile('email')} autoComplete="email" />
            </div>
          </div>
        </div>
      </Card>

      <div className="settings-screen__grid">
        <Card padding="lg">
          <div className="settings-section-header">
            <span className="db-eyebrow">Appearance</span>
          </div>
          <Select
            label="Default background color"
            value={themePreference}
            onChange={onThemePreferenceChange}
            options={BACKGROUND_OPTIONS}
          />
          <SettingRow label="Time format" description="How times read across the app.">
            <Segmented
              size="sm"
              options={TIME_FORMATS}
              value={general.timeFormat}
              onChange={(value) => updateSetting('general', 'timeFormat', value)}
            />
          </SettingRow>
          <SettingRow label="Week starts on" description="Sets the day order in weekly charts.">
            <Segmented
              size="sm"
              options={WEEK_STARTS}
              value={general.weekStart}
              onChange={(value) => updateSetting('general', 'weekStart', value)}
            />
          </SettingRow>
        </Card>

        <div className="settings-general-col">
          <Card padding="lg">
            <div className="settings-section-header">
              <span className="db-eyebrow">Notifications</span>
              <Switch
                checked={general.notifications}
                onChange={(checked) => updateSetting('general', 'notifications', checked)}
                size="sm"
              />
            </div>
            <div className={`settings-notification-type${general.notifications ? '' : ' is-disabled'}`}>
              <span className="settings-field-label">Type of notifications</span>
              <Segmented
                options={NOTIFICATION_TYPES}
                value={general.notificationType}
                onChange={general.notifications ? (value) => updateSetting('general', 'notificationType', value) : undefined}
                size="md"
                style={{ width: '100%', justifyContent: 'space-between' }}
              />
            </div>
          </Card>

          <Card padding="lg">
            <SettingRow
              label="Reset all settings"
              description="Preferences live in this browser. Resetting restores every default; your lists are untouched."
            >
              <Button variant="ghost" size="sm" onClick={resetSettings}>Reset</Button>
            </SettingRow>
          </Card>
        </div>
      </div>
    </>
  );
}

function ListsSection() {
  const { settings, updateSetting } = useSettings();
  const { lists, setListColor } = useLists();
  const listSettings = settings.lists;

  return (
    <>
      <Card padding="lg">
        <div className="settings-section-header">
          <span className="db-eyebrow">List behavior</span>
        </div>
        <SettingRow
          label="Auto-delete empty lists"
          description="Remove a list automatically when its last item is moved out."
        >
          <Switch
            size="sm"
            checked={listSettings.autoDeleteEmpty}
            onChange={(checked) => updateSetting('lists', 'autoDeleteEmpty', checked)}
          />
        </SettingRow>
        <SettingRow
          label="Confirm before deleting"
          description="Deleting a list from its ⋯ menu asks for a second click first."
        >
          <Switch
            size="sm"
            checked={listSettings.confirmDelete}
            onChange={(checked) => updateSetting('lists', 'confirmDelete', checked)}
          />
        </SettingRow>
        <SettingRow
          label="Show completed items"
          description="Keep checked-off items visible in their lists."
        >
          <Switch
            size="sm"
            checked={listSettings.showCompleted}
            onChange={(checked) => updateSetting('lists', 'showCompleted', checked)}
          />
        </SettingRow>
        <SettingRow
          label="Completed items sink"
          description="Checked-off items drop below the open ones in their group."
          disabled={!listSettings.showCompleted}
        >
          <Switch
            size="sm"
            checked={listSettings.completedToBottom}
            onChange={(checked) => updateSetting('lists', 'completedToBottom', checked)}
          />
        </SettingRow>
        <SettingRow
          label="Default color for new lists"
          description="Applied when a list is created."
        >
          <Swatches
            options={LIST_COLORS}
            value={listSettings.defaultColor}
            onChange={(colorId) => updateSetting('lists', 'defaultColor', colorId)}
          />
        </SettingRow>
      </Card>

      <Card padding="lg">
        <div className="settings-section-header">
          <span className="db-eyebrow">Your lists</span>
        </div>
        {lists.length === 0 ? (
          <p className="settings-empty-copy">No lists yet — create one from the Lists page.</p>
        ) : (
          lists.map((list) => (
            <div className="settings-list-row" key={list.id}>
              <span className="settings-list-row__dot" style={{ background: getListColorValue(list.color) }} />
              <span className="settings-list-row__name">{list.name}</span>
              <Badge tone="neutral">{list.tasks.length} items</Badge>
              <Swatches
                options={LIST_COLORS}
                value={list.color}
                onChange={(colorId) => setListColor(list.id, colorId)}
                size={22}
                style={{ marginLeft: 'auto' }}
              />
            </div>
          ))
        )}
      </Card>
    </>
  );
}

function WidgetsSection() {
  const { settings, updateSetting } = useSettings();
  const goals = settings.goals;
  const sleep = settings.sleep;

  return (
    <div className="settings-screen__grid">
      <Card padding="lg">
        <div className="settings-section-header">
          <span className="db-eyebrow">Goals page</span>
          <Icon name="target" size={16} color="var(--goal)" />
        </div>
        <SettingRow
          label="Check-in activity as"
          description="How the past year of check-ins is drawn."
        >
          <Segmented
            size="sm"
            options={GOAL_ACTIVITY_CHARTS}
            value={goals.activityChart}
            onChange={(value) => updateSetting('goals', 'activityChart', value)}
          />
        </SettingRow>
        <SettingRow
          label="Goal progress as"
          description="Each goal shows a progress bar or a compact ring."
        >
          <Segmented
            size="sm"
            options={GOAL_PROGRESS_STYLES}
            value={goals.progressStyle}
            onChange={(value) => updateSetting('goals', 'progressStyle', value)}
          />
        </SettingRow>
        <SettingRow
          label="Show “good enough” targets"
          description="Mark each goal's threshold on its progress bar."
          disabled={goals.progressStyle !== 'bar'}
        >
          <Switch
            size="sm"
            checked={goals.showTargets}
            onChange={(checked) => updateSetting('goals', 'showTargets', checked)}
          />
        </SettingRow>
        <SettingRow
          label="Show insight notes"
          description="The “how this moves the needle” callout."
        >
          <Switch
            size="sm"
            checked={goals.showInsights}
            onChange={(checked) => updateSetting('goals', 'showInsights', checked)}
          />
        </SettingRow>
      </Card>

      <Card padding="lg">
        <div className="settings-section-header">
          <span className="db-eyebrow">Sleep page</span>
          <Icon name="moon" size={16} color="var(--sleep)" />
        </div>
        <SettingRow
          label="Sleep chart as"
          description="Bars and line show this week; the heatmap shows four."
        >
          <Segmented
            size="sm"
            options={SLEEP_CHARTS}
            value={sleep.chartType}
            onChange={(value) => updateSetting('sleep', 'chartType', value)}
          />
        </SettingRow>
        <SettingRow
          label="Nightly sleep goal"
          description="Sets the goal line and what counts as a short night."
        >
          <Select
            size="sm"
            options={SLEEP_GOALS}
            value={String(sleep.goalHours)}
            onChange={(value) => updateSetting('sleep', 'goalHours', Number(value))}
            style={{ minWidth: 130 }}
          />
        </SettingRow>
        <SettingRow
          label="Show goal line"
          description="Draw the goal across the sleep chart."
          disabled={sleep.chartType === 'heatmap'}
        >
          <Switch
            size="sm"
            checked={sleep.showGoalLine}
            onChange={(checked) => updateSetting('sleep', 'showGoalLine', checked)}
          />
        </SettingRow>
        <SettingRow
          label="Show insight notes"
          description="The nightly-pattern callout under the stats."
        >
          <Switch
            size="sm"
            checked={sleep.showInsights}
            onChange={(checked) => updateSetting('sleep', 'showInsights', checked)}
          />
        </SettingRow>
      </Card>
    </div>
  );
}

export function SettingsPage({
  themePreference = 'light',
  onThemePreferenceChange,
}) {
  const [section, setSection] = React.useState('general');

  return (
    <div className="settings-screen">
      <div className="settings-screen__content">
        <Segmented
          options={SECTIONS}
          value={section}
          onChange={setSection}
          style={{ alignSelf: 'center' }}
        />
        {section === 'general' && (
          <GeneralSection
            themePreference={themePreference}
            onThemePreferenceChange={onThemePreferenceChange}
          />
        )}
        {section === 'lists' && <ListsSection />}
        {section === 'widgets' && <WidgetsSection />}
      </div>
    </div>
  );
}
