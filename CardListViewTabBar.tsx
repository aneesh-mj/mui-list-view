import { Tab, Tabs } from '@mui/material';
import type { SyntheticEvent } from 'react';
import type { TabConfig } from '../types';

export interface CardListViewTabBarProps {
  tabs: TabConfig[];
  activeTabId: string;
  onChange: (tabId: string) => void;
  /** When true, render nothing. Used by hideTabBar. */
  hidden?: boolean;
}

export function CardListViewTabBar({
  tabs,
  activeTabId,
  onChange,
  hidden,
}: CardListViewTabBarProps) {
  if (hidden) return null;

  const handleChange = (_event: SyntheticEvent, value: string) => {
    onChange(value);
  };

  return (
    <Tabs
      value={activeTabId}
      onChange={handleChange}
      textColor="primary"
      indicatorColor="primary"
      data-testid="cardlistview-tabbar"
    >
      {tabs.map((tab) => (
        <Tab
          key={tab.tabId}
          value={tab.tabId}
          label={tab.label}
          data-testid={`cardlistview-tab-${tab.tabId}`}
        />
      ))}
    </Tabs>
  );
}
