import React from 'react';
import { Avatar, Card, Icon, Input, Select, Segmented, Switch } from '../../components';
import './SettingsPage.css';

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

export function SettingsPage({
  themePreference = 'light',
  onThemePreferenceChange,
}) {
  const [profile, setProfile] = React.useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    avatarSrc: '',
    notifications: true,
    notificationType: 'email',
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
    <div className="settings-screen">
      <div className="settings-screen__content">
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
          </Card>

          <Card padding="lg">
            <div className="settings-section-header">
              <span className="db-eyebrow">Notifications</span>
              <Switch
                checked={profile.notifications}
                onChange={(checked) => setProfile((current) => ({ ...current, notifications: checked }))}
                size="sm"
              />
            </div>
            <div className={`settings-notification-type${profile.notifications ? '' : ' is-disabled'}`}>
              <span className="settings-field-label">Type of notifications</span>
              <Segmented
                options={NOTIFICATION_TYPES}
                value={profile.notificationType}
                onChange={profile.notifications ? updateProfile('notificationType') : undefined}
                size="md"
                style={{ width: '100%', justifyContent: 'space-between' }}
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
