import type { ReactNode } from 'react';

/**
 * Drives which slot the shell renders for a tab.
 * - 'loading' | 'empty' | 'error' → status node (per-tab override or top-level fallback)
 * - 'ready' (default) → contentComponent
 */
export type TabStatus = 'loading' | 'empty' | 'error' | 'ready';

/**
 * Render function form of contentComponent. The shell passes the tab itself
 * so consumers can read tab metadata (status/label/etc.) without closing over it.
 */
export type ContentRenderFn = (tab: TabConfig) => ReactNode;

export interface TabConfig {
  /** Stable identifier; used as the React key and the active-tab value. */
  tabId: string;
  /** Human-readable label shown in the tab bar. */
  label: string;

  /**
   * Drives slot resolution. Defaults to 'ready' when omitted (renders contentComponent).
   */
  status?: TabStatus;

  // ---- Per-tab toolbar slots (all ReactNodes; all optional) -----------
  /** Rendered in the toolbar's center slot. */
  searchInput?: ReactNode;
  /** Rendered in the toolbar's right slot. */
  filters?: ReactNode;
  /** Rendered below the content area. Only shown when status === 'ready'. */
  pagination?: ReactNode;

  // ---- Content (ReactNode OR render fn) -------------------------------
  /** Rendered when status === 'ready'. ReactNode or a render fn that receives the tab. */
  contentComponent: ReactNode | ContentRenderFn;

  // ---- Per-tab status-slot overrides (fall back to top-level) ---------
  loadingNode?: ReactNode;
  emptyNode?: ReactNode;
  errorNode?: ReactNode;
}

export interface CardListViewConfig {
  title: string;
  subtitle?: string;

  tabs: TabConfig[];

  /**
   * Initial active tab (uncontrolled). Defaults to tabs[0].tabId when omitted.
   * NOTE: Changing this prop after mount will NOT change the active tab.
   * The shell owns active-tab state internally.
   */
  defaultActiveTab?: string;

  /** Fired whenever the active tab changes. */
  onTabChange?: (tabId: string) => void;

  /**
   * When true, the tab bar is not rendered. The active tab's content is still
   * shown (defaults to tabs[0]). Useful for single-tab pages.
   */
  hideTabBar?: boolean;

  // ---- Top-level status fallbacks ------------------------------------
  loadingNode?: ReactNode;
  emptyNode?: ReactNode;
  errorNode?: ReactNode;
}

export interface CardListViewProps {
  config: CardListViewConfig;
}
