import type { Meta, StoryObj } from '@storybook/react';
import { useMemo, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { CardListView } from '../index';
import type { CardListViewConfig, TabStatus } from '../index';
import {
  ALL_GAMES,
  GameGrid,
  REGULATION_ITEMS,
  filterGames,
  paginate,
  type Game,
  type GameFilters,
} from './fixtures';
import { GameFiltersBar, PaginationBar, SearchBar } from './widgets';
import { DefaultEmpty, DefaultError, DefaultLoading } from './statusNodes';

const meta: Meta<typeof CardListView> = {
  title: 'Components/CardListView',
  component: CardListView,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof CardListView>;

// =============================================================================
// 1. Default — Game Deploy clone with two fully-loaded tabs
// =============================================================================

function GameDeployExample() {
  const PAGE_SIZE = 8;

  // Per-tab state (consumer owns it)
  const [gamesQuery, setGamesQuery] = useState('');
  const [gamesFilters, setGamesFilters] = useState<GameFilters>({});
  const [gamesPage, setGamesPage] = useState(1);

  const [regsQuery, setRegsQuery] = useState('');
  const [regsFilters, setRegsFilters] = useState<GameFilters>({});
  const [regsPage, setRegsPage] = useState(1);

  // Derive items per tab
  const gamesFiltered = useMemo(
    () => filterGames(ALL_GAMES, gamesQuery, gamesFilters),
    [gamesQuery, gamesFilters],
  );
  const regsFiltered = useMemo(
    () => filterGames(REGULATION_ITEMS, regsQuery, regsFilters),
    [regsQuery, regsFilters],
  );

  const gamesVisible = paginate(gamesFiltered, gamesPage, PAGE_SIZE);
  const regsVisible = paginate(regsFiltered, regsPage, PAGE_SIZE);

  // Consumer derives status from data. Empty here means filtered-out, not "no data".
  const gamesStatus: TabStatus = gamesVisible.length === 0 ? 'empty' : 'ready';
  const regsStatus: TabStatus = regsVisible.length === 0 ? 'empty' : 'ready';

  const config: CardListViewConfig = {
    title: 'Game Deploy',
    subtitle: 'Subtitle',
    defaultActiveTab: 'games',
    loadingNode: <DefaultLoading />,
    emptyNode: <DefaultEmpty />,
    errorNode: <DefaultError />,
    tabs: [
      {
        tabId: 'games',
        label: 'Games',
        status: gamesStatus,
        searchInput: (
          <SearchBar
            value={gamesQuery}
            onChange={(v) => {
              setGamesQuery(v);
              setGamesPage(1);
            }}
            placeholder="Search campaigns..."
          />
        ),
        filters: (
          <GameFiltersBar
            value={gamesFilters}
            onChange={(v) => {
              setGamesFilters(v);
              setGamesPage(1);
            }}
          />
        ),
        pagination: (
          <PaginationBar
            page={gamesPage}
            count={Math.max(1, Math.ceil(gamesFiltered.length / PAGE_SIZE))}
            onChange={setGamesPage}
          />
        ),
        contentComponent: <GameGrid items={gamesVisible} columns={4} />,
      },
      {
        tabId: 'regulations',
        label: 'Regulations',
        status: regsStatus,
        searchInput: (
          <SearchBar
            value={regsQuery}
            onChange={(v) => {
              setRegsQuery(v);
              setRegsPage(1);
            }}
            placeholder="Search regulations..."
          />
        ),
        filters: (
          <GameFiltersBar
            value={regsFilters}
            onChange={(v) => {
              setRegsFilters(v);
              setRegsPage(1);
            }}
          />
        ),
        pagination: (
          <PaginationBar
            page={regsPage}
            count={Math.max(1, Math.ceil(regsFiltered.length / PAGE_SIZE))}
            onChange={setRegsPage}
          />
        ),
        contentComponent: <GameGrid items={regsVisible} columns={4} />,
      },
    ],
  };

  return <CardListView config={config} />;
}

export const Default: Story = {
  render: () => <GameDeployExample />,
};

// =============================================================================
// 2. hideTabBar — single-tab page
// =============================================================================

function HideTabBarExample() {
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => filterGames(ALL_GAMES, query, {}), [query]);

  const config: CardListViewConfig = {
    title: 'All Games',
    subtitle: 'Single content surface, no tab bar',
    hideTabBar: true,
    tabs: [
      {
        tabId: 'all',
        label: 'All',
        searchInput: <SearchBar value={query} onChange={setQuery} />,
        contentComponent: <GameGrid items={filtered.slice(0, 8)} columns={4} />,
      },
    ],
  };
  return <CardListView config={config} />;
}

export const HideTabBar: Story = {
  render: () => <HideTabBarExample />,
};

// =============================================================================
// 3. Loading state
// =============================================================================

export const LoadingState: Story = {
  render: () => {
    const config: CardListViewConfig = {
      title: 'Game Deploy',
      loadingNode: <DefaultLoading />,
      tabs: [
        {
          tabId: 'games',
          label: 'Games',
          status: 'loading',
          contentComponent: null, // not rendered while loading
        },
      ],
    };
    return <CardListView config={config} />;
  },
};

// =============================================================================
// 4. Empty state
// =============================================================================

export const EmptyState: Story = {
  render: () => {
    const config: CardListViewConfig = {
      title: 'Game Deploy',
      emptyNode: <DefaultEmpty />,
      tabs: [
        {
          tabId: 'games',
          label: 'Games',
          status: 'empty',
          contentComponent: null,
        },
      ],
    };
    return <CardListView config={config} />;
  },
};

// =============================================================================
// 5. Error state
// =============================================================================

export const ErrorState: Story = {
  render: () => {
    const config: CardListViewConfig = {
      title: 'Game Deploy',
      errorNode: <DefaultError />,
      tabs: [
        {
          tabId: 'games',
          label: 'Games',
          status: 'error',
          contentComponent: null,
        },
      ],
    };
    return <CardListView config={config} />;
  },
};

// =============================================================================
// 6. Per-tab status overrides
// =============================================================================

export const PerTabStatusOverrides: Story = {
  render: () => {
    const config: CardListViewConfig = {
      title: 'Per-tab status overrides',
      subtitle: 'First tab uses top-level fallback. Second tab overrides empty state.',
      // Top-level fallbacks
      loadingNode: <DefaultLoading />,
      emptyNode: <DefaultEmpty message="No items (top-level fallback)" />,
      errorNode: <DefaultError />,
      tabs: [
        {
          tabId: 'a',
          label: 'Default empty',
          status: 'empty',
          contentComponent: null,
        },
        {
          tabId: 'b',
          label: 'Custom empty',
          status: 'empty',
          // Per-tab override
          emptyNode: (
            <Box
              sx={{
                py: 6,
                textAlign: 'center',
                bgcolor: 'warning.light',
                color: 'warning.contrastText',
                borderRadius: 1,
              }}
            >
              <Typography variant="h6">Custom empty for this tab</Typography>
              <Typography variant="body2">
                This overrides the top-level empty fallback.
              </Typography>
            </Box>
          ),
          contentComponent: null,
        },
      ],
    };
    return <CardListView config={config} />;
  },
};

// =============================================================================
// 7. contentComponent as render fn (receives the tab itself)
// =============================================================================

export const ContentAsRenderFn: Story = {
  render: () => {
    const config: CardListViewConfig = {
      title: 'contentComponent as render fn',
      subtitle: 'The fn receives the tab so it can read tab metadata.',
      tabs: [
        {
          tabId: 'a',
          label: 'Tab A',
          contentComponent: (tab) => (
            <Box sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              <Typography variant="h6">Hello from {tab.label}</Typography>
              <Typography variant="body2" color="text.secondary">
                tabId: <code>{tab.tabId}</code> · status: <code>{tab.status ?? 'ready'}</code>
              </Typography>
            </Box>
          ),
        },
        {
          tabId: 'b',
          label: 'Tab B',
          contentComponent: (tab) => (
            <Box sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              <Typography variant="h6">Hello from {tab.label}</Typography>
            </Box>
          ),
        },
      ],
    };
    return <CardListView config={config} />;
  },
};

// =============================================================================
// 8. Sparse tab — only contentComponent, no toolbar slots, no pagination
// =============================================================================

export const SparseTab: Story = {
  render: () => {
    const config: CardListViewConfig = {
      title: 'Sparse tab',
      subtitle: 'No search/filters/pagination — toolbar collapses cleanly.',
      tabs: [
        {
          tabId: 'a',
          label: 'Just content',
          contentComponent: <GameGrid items={ALL_GAMES.slice(0, 4)} columns={4} />,
        },
      ],
    };
    return <CardListView config={config} />;
  },
};
