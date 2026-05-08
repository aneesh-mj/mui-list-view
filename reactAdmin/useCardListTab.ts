import type { ReactNode } from 'react';
import { useGetList, type RaRecord, type GetListParams } from 'react-admin';
import type { TabConfig, TabStatus } from '../types';

export interface UseCardListTabOptions<TRecord extends RaRecord = RaRecord> {
  tabId: string;
  label: string;
  resource: string;
  /** Passed directly to useGetList — sort, filter, pagination are all consumer-owned. */
  queryOptions?: Partial<GetListParams>;
  /** Called with the fetched records to produce the content ReactNode. */
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

/**
 * Bridges react-admin's useGetList into a TabConfig for CardListView.
 *
 * Status mapping:
 *   isLoading (first fetch, no cache)  → 'loading'
 *   error                              → 'error'
 *   data.length === 0                  → 'empty'
 *   else                               → 'ready'
 *
 * Uses `isLoading` (not `isFetching`) so background refetches do not
 * re-trigger the loading skeleton when cached data is already present.
 *
 * Must be called at the top level of a component rendered inside an
 * react-admin <Admin> (or <AdminContext>) tree.
 *
 * @example
 * function GameDeployPage() {
 *   const [page, setPage] = useState(1);
 *
 *   const gamesTab = useCardListTab({
 *     tabId: 'games',
 *     label: 'Games',
 *     resource: 'games',
 *     queryOptions: { pagination: { page, perPage: 8 } },
 *     renderContent: (records) => <GameCardGrid items={records} />,
 *     pagination: <PaginationBar page={page} onChange={setPage} />,
 *     loadingNode: <LoadingSkeleton />,
 *     emptyNode: <EmptyState />,
 *     errorNode: <ErrorAlert />,
 *   });
 *
 *   return (
 *     <CardListView config={{ title: 'Game Deploy', tabs: [gamesTab] }} />
 *   );
 * }
 */
export function useCardListTab<TRecord extends RaRecord = RaRecord>(
  options: UseCardListTabOptions<TRecord>,
): TabConfig {
  const {
    tabId,
    label,
    resource,
    queryOptions,
    renderContent,
    searchInput,
    filters,
    pagination,
    loadingNode,
    emptyNode,
    errorNode,
  } = options;

  const { data, isLoading, error } = useGetList<TRecord>(resource, queryOptions);

  const records = data ?? [];

  const status: TabStatus = isLoading
    ? 'loading'
    : error
    ? 'error'
    : records.length === 0
    ? 'empty'
    : 'ready';

  return {
    tabId,
    label,
    status,
    // renderContent is called here (hook body), not inside a callback,
    // so Rules of Hooks are not violated even if the consumer uses hooks inside it.
    contentComponent: renderContent(records),
    searchInput,
    filters,
    pagination,
    loadingNode,
    emptyNode,
    errorNode,
  };
}
