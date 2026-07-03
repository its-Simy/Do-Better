import React from 'react';
import { Button, Card, Icon, Input, Select } from '../../components';
import './CreateListItemPage.css';

const categoryOptions = [
  { value: '', label: 'Choose category' },
  { value: 'work', label: 'Work' },
  { value: 'school', label: 'School' },
  { value: 'for-fun', label: 'For fun' },
  { value: 'grind', label: 'Grind' },
  { value: 'personal', label: 'Personal' },
  { value: 'errands', label: 'Errands' },
  { value: 'health', label: 'Health' },
];

const importanceOptions = [
  { value: '', label: 'Choose importance' },
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
];

export function CreateListItemPage({ onNavigate }) {
  const [category, setCategory] = React.useState('');
  const [name, setName] = React.useState('');
  const [importance, setImportance] = React.useState('');

  const canFinalize = category && name.trim().length > 0 && importance;

  const finalizeItem = (event) => {
    event.preventDefault();
    if (!canFinalize) return;
    onNavigate?.('lists');
  };

  return (
    <div className="create-list-item-screen">
      <form className="create-list-item-screen__content" onSubmit={finalizeItem}>
        <Card padding="lg">
          <div className="create-list-item-form">
            <div className="create-list-item-main-row">
              <Select
                label="Category"
                value={category}
                onChange={setCategory}
                options={categoryOptions}
                style={{ flex: '0 0 190px' }}
              />
              <Input
                label="List item"
                placeholder="Ex: Finish lab writeup"
                value={name}
                onChange={(event) => setName(event.target.value)}
                iconLeft={<Icon name="tasks" size={16} />}
                style={{ flex: 1 }}
              />
            </div>

            <Select
              label="Importance"
              value={importance}
              onChange={setImportance}
              options={importanceOptions}
            />

            <div className="create-list-item-actions">
              <Button
                type="button"
                variant="secondary"
                onClick={() => onNavigate?.('lists')}
              >
                Back
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={!canFinalize}
                iconLeft={<Icon name="check" size={16} />}
              >
                Add item
              </Button>
            </div>
          </div>
        </Card>
      </form>
    </div>
  );
}
