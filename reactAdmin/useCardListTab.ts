import type { ReactNode } from 'react';
import { useGetList, type RaRecord, type GetListParams } from 'react-admin';
import type { TabConfig, TabStatus } from '../types';

export interface UseCardListTabOptions<TRecord extends RaRecord = RaRecord> {
  tabId: string;
  label: string;
  resource: string;

  // ---- Server-side mode -----------------------------------------------
  /**
   * Passed directly to useGetList. Use this when the API handles filtering
   * and pagination (server-side mode). Ignored when `transform` is provided.
   */
  queryOptions?: Partial<GetListParams>;

  // ---- Client-side mode -----------------------------------------------
  /**
   * When provided, switches to client-side mode:
   *   - Fetches all records via useGetList (using fetchAllPerPage as the limit)
   *   - Calls transform(allRecords) every render so you can apply your own
   *     filtering and pagination, closing over whatever state you need
   *   - Returns { records, total } where records is the visible slice and
   *     total is the filtered (pre-pagination) count for computing pageCount
   */
  transform?: (allRecords: TRecord[]) => { records: TRecord[]; total: number };
  /**
   * Upper bound for the "fetch all" request used in client-side mode.
   * Defaults to 1000. Only relevant when `transform` is provided.
   */
  fetchAllPerPage?: number;

  // ---- Shared ---------------------------------------------------------
  /** Called with the resolved records to produce the content ReactNode. */
  renderContent: (records: TRecord[]) => ReactNode;
  /** Per-tab toolbar slots (consumer owns the UI and state). */
  searchInput?: ReactNode;
  filters?: ReactNode;
  pagination?: ReactNode;
  /** Status-slot overrides; fall back to top-level CardListViewConfig nodes if omitted. */
  loadingNode?: ReactNode;
  emptyNode?: ReactNode;
  errorNode?: ReactNode;
}

export interface UseCardListTabResult {
  tab: TabConfig;
  /**
   * Server-side mode: total record count from the dataProvider.
   * Client-side mode: filtered (pre-pagination) count from transform().
   * Use this to compute pagination page count: Math.ceil(total / perPage)
   */
  total: number;
}

/**
 * Bridges react-admin's useGetList into a TabConfig for CardListView.
 * Supports two modes, selected by whether `transform` is provided:
 *
 * SERVER-SIDE MODE (no transform)
 *   Pass `queryOptions` with filters/pagination — the API handles them.
 *   `total` in the result is the raw dataProvider total.
 *
 *   const { tab, total } = useCardListTab({
 *     resource: 'games',
 *     queryOptions: { pagination: { page, perPage: 8 }, filter: { q: query } },
 *     renderContent: (records) => <GameCardGrid items={records} />,
 *   });
 *
 * CLIENT-SIDE MODE (with transform)
 *   Pass `transform` — the hook fetches ALL records once and calls your
 *   function every render. Close over your own filter/search/page state.
 *   `total` in the result is whatever transform() returns as total.
 *
 *   const { tab, total } = useCardListTab({
 *     resource: 'games',
 *     transform: (all) => {
 *       const filtered = filterGames(all, query, filters);
 *       return { records: paginate(filtered, page, PAGE_SIZE), total: filtered.length };
 *     },
 *     renderContent: (records) => <GameCardGrid items={records} />,
 *   });
 *
 * In both modes, pass toolbar slots (searchInput, filters, pagination) and
 * use `total` from the result to compute pagination page count:
 *   Math.ceil(total / perPage)
 *
 * Status mapping:
 *   isLoading (first fetch, no cache)  → 'loading'
 *   error                              → 'error'
 *   resolved records.length === 0      → 'empty'
 *   else                               → 'ready'
 *
 * Uses `isLoading` (not `isFetching`) so background refetches do not
 * re-trigger the loading skeleton when cached data is already present.
 *
 * Must be called at the top level of a component inside a react-admin
 * <Admin> or <AdminContext> tree. No <List> wrapper needed.
 */
export function useCardListTab<TRecord extends RaRecord = RaRecord>(
  options: UseCardListTabOptions<TRecord>,
): UseCardListTabResult {
  const {
    tabId,
    label,
    resource,
    queryOptions,
    transform,
    fetchAllPerPage = 1000,
    renderContent,
    searchInput,
    filters,
    pagination,
    loadingNode,
    emptyNode,
    errorNode,
  } = options;

  const isClientMode = transform !== undefined;

  const { data, total: serverTotal, isLoading, error } = useGetList<TRecord>(
    resource,
    isClientMode ? { pagination: { page: 1, perPage: fetchAllPerPage } } : queryOptions,
  );

  const allRecords = data ?? [];

  const { records, total } = isClientMode
    ? transform(allRecords)
    : { records: allRecords, total: serverTotal ?? 0 };

  const status: TabStatus = isLoading
    ? 'loading'
    : error
    ? 'error'
    : records.length === 0
    ? 'empty'
    : 'ready';

  return {
    total,
    tab: {
      tabId,
      label,
      status,
      contentComponent: renderContent(records),
      searchInput,
      filters,
      pagination,
      loadingNode,
      emptyNode,
      errorNode,
    },
  };
}
