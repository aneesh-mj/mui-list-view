import { Box, Typography } from '@mui/material';
import { useCallback, useState, type ReactNode } from 'react';
import { CardListViewTabBar } from './parts/CardListViewTabBar';
import { CardListViewToolbar } from './parts/CardListViewToolbar';
import type {
  CardListViewProps,
  ContentRenderFn,
  TabConfig,
  TabStatus,
} from './types';

/**
 * Reusable view shell driven by a single `config` object.
 *
 * Responsibilities:
 *  - Render title / subtitle / tab bar
 *  - Track the active tab (uncontrolled, defaultActiveTab)
 *  - Resolve which slot to render for the active tab, based on `status`
 *  - Lay out per-tab toolbar slots (searchInput | filters) and pagination
 *
 * NOT this component's responsibility (consumer owns):
 *  - Data fetching, filtering, debouncing
 *  - Search input UI (provide via tab.searchInput)
 *  - Filter widgets (provide via tab.filters)
 *  - Pagination UI (provide via tab.pagination)
 *  - Item rendering / layout (provide via tab.contentComponent)
 */
export function CardListView({ config }: CardListViewProps) {
  const {
    title,
    subtitle,
    tabs,
    defaultActiveTab,
    onTabChange,
    hideTabBar,
    loadingNode: topLoading,
    emptyNode: topEmpty,
    errorNode: topError,
  } = config;

  // ---- Active tab (uncontrolled, locked at mount-time default) ----------
  const initialTabId = defaultActiveTab ?? tabs[0]?.tabId ?? '';
  const [activeTabId, setActiveTabId] = useState<string>(initialTabId);

  const handleTabChange = useCallback(
    (tabId: string) => {
      setActiveTabId(tabId);
      onTabChange?.(tabId);
    },
    [onTabChange],
  );

  // ---- Resolve the active tab; fall back to tabs[0] defensively ---------
  const activeTab: TabConfig | undefined =
    tabs.find((t) => t.tabId === activeTabId) ?? tabs[0];

  if (!activeTab) {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.error('[CardListView] config.tabs is empty; rendering nothing.');
    }
    return null;
  }

  const status: TabStatus = activeTab.status ?? 'ready';

  // ---- Slot resolution --------------------------------------------------
  const resolvedStatusNode: ReactNode = resolveStatusNode(
    status,
    activeTab,
    { topLoading, topEmpty, topError },
  );

  const resolvedContent: ReactNode =
    status === 'ready' ? resolveContent(activeTab.contentComponent, activeTab) : null;

  return (
    <Box data-testid="cardlistview-root">
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" data-testid="cardlistview-title">
          {title}
        </Typography>
        {subtitle && (
          <Typography
            variant="body2"
            color="text.secondary"
            data-testid="cardlistview-subtitle"
          >
            {subtitle}
          </Typography>
        )}
      </Box>

      {/* Toolbar: tab bar | searchInput | filters */}
      <CardListViewToolbar
        left={
          hideTabBar ? undefined : (
            <CardListViewTabBar
              tabs={tabs}
              activeTabId={activeTab.tabId}
              onChange={handleTabChange}
            />
          )
        }
        center={activeTab.searchInput}
        right={activeTab.filters}
      />

      {/* Body: status node OR contentComponent */}
      <Box data-testid="cardlistview-body">
        {status === 'ready' ? resolvedContent : resolvedStatusNode}
      </Box>

      {/* Pagination: only when status === 'ready' AND a node was provided */}
      {status === 'ready' && activeTab.pagination && (
        <Box sx={{ mt: 2 }} data-testid="cardlistview-pagination-slot">
          {activeTab.pagination}
        </Box>
      )}
    </Box>
  );
}

// =============================================================================
// Internal helpers
// =============================================================================

function resolveStatusNode(
  status: TabStatus,
  tab: TabConfig,
  fallbacks: { topLoading?: ReactNode; topEmpty?: ReactNode; topError?: ReactNode },
): ReactNode {
  switch (status) {
    case 'loading':
      return tab.loadingNode ?? fallbacks.topLoading ?? null;
    case 'empty':
      return tab.emptyNode ?? fallbacks.topEmpty ?? null;
    case 'error':
      return tab.errorNode ?? fallbacks.topError ?? null;
    case 'ready':
    default:
      return null;
  }
}

function resolveContent(
  content: ReactNode | ContentRenderFn,
  tab: TabConfig,
): ReactNode {
  if (typeof content === 'function') {
    // Narrow: contentComponent in `function` form is ContentRenderFn.
    return (content as ContentRenderFn)(tab);
  }
  return content;
}
