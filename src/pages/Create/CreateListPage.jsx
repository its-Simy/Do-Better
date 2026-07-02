import React from 'react';
import { Button, Card, Icon, IconButton, Input } from '../../components';
import './CreateListPage.css';

const initialComponents = [
  { id: 'component-1', title: '' },
];

function createComponent() {
  return {
    id: `component-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    title: '',
  };
}

export function CreateListPage({ onNavigate }) {
  const [listName, setListName] = React.useState('');
  const [components, setComponents] = React.useState(initialComponents);

  const updateComponent = (id, title) => {
    setComponents((items) => items.map((item) => (
      item.id === id ? { ...item, title } : item
    )));
  };

  const addComponent = () => {
    setComponents((items) => [...items, createComponent()]);
  };

  const removeComponent = (id) => {
    setComponents((items) => (
      items.length === 1 ? initialComponents : items.filter((item) => item.id !== id)
    ));
  };

  const canFinalize = listName.trim().length > 0
    && components.some((component) => component.title.trim().length > 0);

  const finalizeList = (event) => {
    event.preventDefault();
    if (!canFinalize) return;
    onNavigate?.('lists');
  };

  return (
    <div className="create-list-screen">
      <form className="create-list-screen__content" onSubmit={finalizeList}>
        <Card padding="lg">
          <div className="create-list-form">
            <Input
              label="List name"
              placeholder="Ex: Morning routine"
              value={listName}
              onChange={(event) => setListName(event.target.value)}
              iconLeft={<Icon name="folder" size={16} />}
            />

            <div className="create-list-components">
              <div className="create-list-components__header">
                <span className="db-eyebrow">Components</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  iconLeft={<Icon name="plus" size={16} />}
                  onClick={addComponent}
                >
                  Add
                </Button>
              </div>

              <div className="create-list-components__rows">
                {components.map((component, index) => (
                  <div className="create-list-component-row" key={component.id}>
                    <Input
                      placeholder={`Component ${index + 1}`}
                      value={component.title}
                      onChange={(event) => updateComponent(component.id, event.target.value)}
                      iconLeft={<Icon name="tasks" size={16} />}
                      style={{ flex: 1 }}
                    />
                    <IconButton
                      type="button"
                      label="Remove component"
                      variant="outline"
                      disabled={components.length === 1 && component.title.trim().length === 0}
                      onClick={() => removeComponent(component.id)}
                    >
                      <Icon name="x" size={16} />
                    </IconButton>
                  </div>
                ))}
              </div>
            </div>

            <div className="create-list-actions">
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
                Finalize list
              </Button>
            </div>
          </div>
        </Card>
      </form>
    </div>
  );
}
