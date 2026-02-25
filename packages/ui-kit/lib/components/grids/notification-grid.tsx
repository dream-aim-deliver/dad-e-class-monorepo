'use client';
import { notification } from '@maany_shr/e-class-models';
import { AllCommunityModule, IRowNode, ModuleRegistry } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { RefObject, useState, useCallback, useMemo, useEffect, useRef, useLayoutEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { BaseGrid } from './base-grid';
import { formatDate } from '../../utils/format-utils';
import { Button } from '../button';
import { Tabs, } from '../tabs/tab';
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';
import { NotificationGridFilterModal, NotificationFilterModel } from './notification-grid-filter-modal';
import { IconFilter } from '../icons/icon-filter';
import { IconSearch } from '../icons/icon-search';
import { InputField } from '../input-field';


export interface ExtendedNotification extends notification.TNotification {
  id: number | string;
  platform: string;
}

export interface PlatformNotificationGridProps extends isLocalAware {
  notifications: ExtendedNotification[];
  onNotificationClick: (notification: ExtendedNotification) => void;
  onMarkAsRead?: (notification: ExtendedNotification) => void;
  onMarkAllRead: (notificationIds: (number | string)[]) => void;
  gridRef: RefObject<AgGridReact>;
  variant: 'student' | 'coach';
  loading: boolean;
  highlightNotificationId?: string | null;
  onHighlightApplied?: () => void;
}

export interface CMSNotificationGridProps extends isLocalAware {
  notifications: ExtendedNotification[];
  onNotificationClick: (notification: ExtendedNotification) => void;
  onMarkAsRead?: (notification: ExtendedNotification) => void;
  onMarkAllRead: (notificationIds: (number | string)[]) => void;
  gridRef: RefObject<AgGridReact>;
  variant: 'cms';
  platforms: string[];
  loading: boolean;
  highlightNotificationId?: string | null;
  onHighlightApplied?: () => void;
}

export type NotificationGridProps = PlatformNotificationGridProps | CMSNotificationGridProps;

ModuleRegistry.registerModules([AllCommunityModule]);

const NotificationMessageRenderer = (props: {
  value: string;
  data?: { id?: string | number };
  expandedMessagesRef?: { current: Set<string | number> };
}) => {
  const notificationId = props.data?.id;
  const expandedRef = props.expandedMessagesRef;

  const [isExpanded, setIsExpanded] = useState(() => {
    if (notificationId != null && expandedRef?.current) {
      return expandedRef.current.has(notificationId);
    }
    return false;
  });
  const [isTruncated, setIsTruncated] = useState(false);
  const spanRef = useRef<HTMLSpanElement>(null);
  const message = props.value || '';

  useEffect(() => {
    const el = spanRef.current;
    if (!el) return;

    const update = () => {
      if (!isExpanded) {
        setIsTruncated(el.scrollWidth > el.clientWidth);
      }
    };

    update(); // initial check

    const resizeObserver = new ResizeObserver(update);
    resizeObserver.observe(el);

    return () => resizeObserver.disconnect();
  }, [message, isExpanded]);

  const handleClick = () => {
    if (!isTruncated) return;
    setIsExpanded(prev => {
      const next = !prev;
      if (notificationId != null && expandedRef?.current) {
        if (next) expandedRef.current.add(notificationId);
        else expandedRef.current.delete(notificationId);
      }
      return next;
    });
  };

  return (
    <div
      className="flex items-center text-sm my-2.5 space-x-2"
      onClick={handleClick}
      style={{ cursor: isTruncated ? 'pointer' : 'default' }}
    >
      <span
        ref={spanRef}
        className={isExpanded ? 'whitespace-normal' : 'truncate'}
      >
        {message}
      </span>
      {isTruncated &&
        (isExpanded ? (
          <ChevronUp className="flex-shrink-0 w-4 h-4" />
        ) : (
          <ChevronDown className="flex-shrink-0 w-4 h-4" />
        ))}
    </div>
  );
};


const NotificationActionRenderer = (props: { value: notification.TNotification['action'] }) => {
  const action = props.value;
  return <Button variant="text" className="text-sm px-0" text={action?.title || ''} />;
};

const NotificationStatusRenderer = (props: { value: boolean }) => {
  const isRead = props.value;
  return isRead ? null : (
    <div className="flex items-center justify-center h-full">
      <div className="rounded-full bg-base-brand-500 w-2 h-2"></div>
    </div>
  );
};

/**
 * A component that displays a grid of notifications with filtering, pagination, and tabbed navigation for different platforms.
 *
 * @param notifications An array of notification objects, each extended with a platform property.
 * @param onNotificationClick Callback function to handle clicking on a notification action.
 * @param gridRef A React ref object for accessing the AgGridReact instance.
 * @param variant Optional variant to determine the grid's behavior ('student', 'coach', or 'cms').
 * @param platforms Optional array of platform names for filtering notifications in the CMS variant.
 * @param locale The locale for translations, used to fetch localized dictionary strings.
 * @param loading Optional boolean to indicate if the grid is in a loading state.
 */
export const NotificationGrid = (props: NotificationGridProps) => {

  const {
    notifications,
    onNotificationClick,
    onMarkAsRead,
    onMarkAllRead,
    gridRef,
    variant,
    locale,
    loading,
    highlightNotificationId,
    onHighlightApplied,
  } = props;

  const platforms = variant === 'cms' ? props.platforms : [];

  const [highlightedRowId, setHighlightedRowId] = useState<string | number | null>(null);
  const pendingHighlightRef = useRef<string | null>(null);

  useEffect(() => {
    if (!highlightNotificationId) return;
    pendingHighlightRef.current = highlightNotificationId;

    const tryApply = () => {
      const id = pendingHighlightRef.current;
      if (!id || !gridRef.current?.api) return false;

      const rowNode = gridRef.current.api.getRowNode(id);
      if (!rowNode) return false;

      pendingHighlightRef.current = null;
      setHighlightedRowId(id);
      gridRef.current.api.ensureNodeVisible(rowNode, 'middle');
      onHighlightApplied?.();

      setTimeout(() => {
        setHighlightedRowId(null);
      }, 3000);

      return true;
    };

    if (tryApply()) return;

    // Grid not ready yet — poll every 200ms, give up after 5s
    const interval = setInterval(() => {
      if (tryApply()) clearInterval(interval);
    }, 200);
    const safety = setTimeout(() => clearInterval(interval), 5000);

    return () => { clearInterval(interval); clearTimeout(safety); };
  }, [highlightNotificationId]);

  // Redraw rows after React re-renders with new highlightedRowId so getRowStyle picks it up
  useEffect(() => {
    if (!gridRef.current?.api) return;
    gridRef.current.api.redrawRows();
  }, [highlightedRowId]);

  const dictionary = getDictionary(locale).components.notificationGrid;

  const [selectedTab, setSelectedTab] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [modifiedNotifications, setModifiedNotifications] = useState<ExtendedNotification[]>(notifications);

  // Modal and filter state
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState<Partial<NotificationFilterModel>>({});

  // Track selected IDs during loading to restore selection after data refresh
  const [selectedIdsBeforeLoading, setSelectedIdsBeforeLoading] = useState<(number | string)[]>([]);

  // Persist expanded message state across AG Grid remounts
  const expandedMessagesRef = useRef<Set<string | number>>(new Set());

  // Track IDs optimistically marked as read (cleared once props confirm)
  const optimisticReadIdsRef = useRef<Set<string | number>>(new Set());

  const handleOptimisticMarkAsRead = useCallback((notification: ExtendedNotification) => {
    if (!notification.isRead) {
      optimisticReadIdsRef.current.add(notification.id);
      setModifiedNotifications(prev =>
        prev.map(n => n.id === notification.id ? { ...n, isRead: true } : n)
      );
    }
    if (onMarkAsRead) onMarkAsRead(notification);
  }, [onMarkAsRead]);

  const handleOptimisticNotificationClick = useCallback((notification: ExtendedNotification) => {
    if (!notification.isRead) {
      optimisticReadIdsRef.current.add(notification.id);
      setModifiedNotifications(prev =>
        prev.map(n => n.id === notification.id ? { ...n, isRead: true } : n)
      );
    }
    onNotificationClick(notification);
  }, [onNotificationClick]);

  const handleClearAllFilters = useCallback(() => {
    setSearchTerm(''); // Clear search input
    setFilters({}); // Reset modal filters
    if (gridRef.current?.api) {
      gridRef.current.api.setFilterModel(null);
      gridRef.current.api.refreshClientSideRowModel('filter');
      gridRef.current.api.onFilterChanged();
    }
  }, [gridRef]);

  const columnDefs = useMemo(() => [
    {
      headerName: dictionary.new,
      field: 'isRead',
      cellRenderer: NotificationStatusRenderer,
      minWidth: 100,
      maxWidth: 100,
    },
    {
      flex: 1,
      field: 'message',
      headerName: dictionary.message,
      wrapText: true,
      autoHeight: true,
      cellRenderer: NotificationMessageRenderer,
      cellRendererParams: { expandedMessagesRef },
      filter: 'agTextColumnFilter',
      onCellClicked: (event: { data: ExtendedNotification }) => {
        handleOptimisticMarkAsRead(event.data);
      },
    },
    {
      field: 'action',
      headerName: dictionary.action,
      cellRenderer: NotificationActionRenderer,
      onCellClicked: (event: { data: ExtendedNotification; }) => {
        handleOptimisticNotificationClick(event.data);
      },
      sortable: false,
    },
    {
      field: 'timestamp',
      headerName: dictionary.dateTime,
      valueFormatter: (params: { value: string | number | Date; }) => (params.value ? formatDate(new Date(params.value)) : ''),
      filter: 'agDateColumnFilter',
      sort: 'desc' as 'asc' | 'desc' | null,
      onCellClicked: (event: { data: ExtendedNotification }) => {
        handleOptimisticMarkAsRead(event.data);
      },
    },
    {
      field: 'platform',
      hide: true,
      // filter: 'agSetColumnFilter', // Remove this line to avoid AG Grid SetFilterModule error
      filterParams: {
        values: platforms,
      },
    },
  ], [dictionary, handleOptimisticMarkAsRead, handleOptimisticNotificationClick]);

  // Get notification counts for each tab
  const notificationCounts = useMemo(() => {
    const counts: Record<string, number> = { all: notifications.length };
    platforms.forEach(platform => {
      counts[platform] = notifications.filter(n => n.platform === platform).length;
    });
    return counts;
  }, [notifications, platforms]);

  // Localized platform names for tabs
  const localizedPlatformName = (platform: string) => {
    return (dictionary as Record<string, string>)[platform] || platform;
  };

  // Client-side filtering logic for search, platform, and modal filters
  const doesExternalFilterPass = useCallback(
    (node: IRowNode<ExtendedNotification>) => {
      const notification = node.data;
      if (!notification) return false;

      // Search filter
      const searchLower = searchTerm.toLowerCase();
      const messageMatch = notification.message?.toLowerCase().includes(searchLower);
      const actionMatch = notification.action?.title?.toLowerCase().includes(searchLower);

      // Platform filter (only for CMS variant)
      const platformMatch =
        variant === 'cms'
          ? selectedTab === 'all' || notification.platform === selectedTab
          : true;

      // Modal filters
      if (filters.platform && filters.platform.length > 0 && !filters.platform.includes(notification.platform)) {
        return false;
      }
      if (filters.isRead !== undefined && notification.isRead !== filters.isRead) {
        return false;
      }
      if (filters.dateAfter && notification.timestamp && new Date(notification.timestamp).getTime() < new Date(filters.dateAfter).getTime()) {
        return false;
      }
      if (filters.dateBefore && notification.timestamp && new Date(notification.timestamp).getTime() > new Date(filters.dateBefore).getTime()) {
        return false;
      }
      // Modal search filter (overrides top search if set)
      if (filters.search && filters.search.length > 0) {
        const modalSearch = filters.search.toLowerCase();
        if (!notification.message?.toLowerCase().includes(modalSearch) && !notification.action?.title?.toLowerCase().includes(modalSearch)) {
          return false;
        }
      } else if (searchTerm && !(messageMatch || actionMatch)) {
        return false;
      }
      return platformMatch;
    },
    [searchTerm, selectedTab, variant, filters]
  );

  // Force refresh the grid
  const refreshGrid = useCallback(() => {
    if (gridRef.current?.api) {
      gridRef.current.api.setGridOption('isExternalFilterPresent', () => true);
      gridRef.current.api.setGridOption('doesExternalFilterPass', doesExternalFilterPass);
      gridRef.current.api.setFilterModel(null);
      gridRef.current.api.refreshClientSideRowModel('filter');
      gridRef.current.api.onFilterChanged();
    }
  }, [doesExternalFilterPass, gridRef]);

  // Sync local state when props change, but preserve optimistic reads
  useEffect(() => {
    setModifiedNotifications(prev =>
      notifications.map(n => {
        if (n.isRead) {
          // Server confirmed read — clear from optimistic set
          optimisticReadIdsRef.current.delete(n.id);
          return n;
        }
        if (optimisticReadIdsRef.current.has(n.id)) {
          // Preserve optimistic read — reuse existing reference to avoid AG Grid remount
          const existing = prev.find(p => p.id === n.id);
          return existing ?? { ...n, isRead: true };
        }
        return n;
      })
    );
  }, [notifications]);

  // Refresh external filter only when filter inputs change
  useEffect(() => {
    refreshGrid();
  }, [refreshGrid, searchTerm, selectedTab, filters]);

  // Restore selection after loading completes and data refreshes
  // Using useLayoutEffect to run synchronously before browser paint
  useLayoutEffect(() => {
    if (!loading && selectedIdsBeforeLoading.length > 0 && gridRef.current?.api) {
      // Restore selection immediately after data update
      gridRef.current.api.forEachNode((node) => {
        if (node.data && selectedIdsBeforeLoading.includes(node.data.id)) {
          node.setSelected(true);
        }
      });
      setSelectedIdsBeforeLoading([]); // Clear stored IDs after restoration
    }
  }, [loading, selectedIdsBeforeLoading, gridRef, modifiedNotifications]);

  // Render grid with actions
  const renderGridWithActions = (notificationsToShow = modifiedNotifications) => {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-4">
          <InputField
            className="flex-grow relative md:mr-2 h-10"
            setValue={setSearchTerm} value={searchTerm}
            inputText={dictionary.searchPlaceholder}
            hasLeftContent
            leftContent={<IconSearch />}
          />
          <div className="flex flex-row gap-2">
            { /* CMS-specific buttons */
              variant === 'cms' && (
                <>
                  <Button
                    variant="secondary"
                    size="medium"
                    text={dictionary.filterButton}
                    onClick={() => setShowFilterModal(true)}
                    hasIconLeft
                    iconLeft={<IconFilter />}
                    className="w-full md:w-auto" />
                  <Button
                    variant="secondary"
                    size="medium"
                    text={dictionary.clearFilters}
                    onClick={handleClearAllFilters}
                    className="w-full md:w-auto" />
                </>
              )}
            <Button
              variant="primary"
              size="medium"
              text={loading ? 'Marking as read...' : dictionary.markAllAsRead}
              onClick={() => {
                if (!gridRef.current?.api) return;
                const selectedRows: ExtendedNotification[] = gridRef.current.api.getSelectedRows();
                const selectedIds = selectedRows.map(row => row.id);
                if (selectedIds.length > 0) {
                  setSelectedIdsBeforeLoading(selectedIds); // Store IDs before mutation
                  onMarkAllRead(selectedIds);
                }
              }}
              disabled={loading}
            />
          </div>
        </div>

        <BaseGrid
          shouldDelayRender={true}
          gridRef={gridRef}
          locale={locale}
          suppressRowHoverHighlight={true}
          columnDefs={columnDefs}
          rowData={notificationsToShow}
          pagination={true}
          paginationAutoPageSize={true}
          suppressPaginationPanel={true}
          domLayout="normal"
          isExternalFilterPresent={() => true}
          doesExternalFilterPass={doesExternalFilterPass}
          rowSelection={{ mode: 'multiRow' }}
          noRowsMessage={dictionary.noNotifications}
          getRowId={(params) => String(params.data.id)}
          getRowStyle={(params) => {
            if (!params.data) return undefined;
            const base = params.data.isRead
              ? { background: 'inherit' }
              : { background: 'var(--color-base-neutral-800)' };
            if (String(params.data.id) === String(highlightedRowId)) {
              return { ...base, border: '2px solid #facc15' };
            }
            return base;
          }}
        />
        {showFilterModal && (
          <NotificationGridFilterModal
            onApplyFilters={(f) => setFilters(f)}
            onClose={() => setShowFilterModal(false)}
            initialFilters={filters}
            platforms={platforms}
            locale={locale}
          />
        )}
      </div>
    );
  };

  // Render tabs for CMS variant
  const renderTabs = () => (
    <Tabs.Root
      defaultTab={selectedTab}
      className="h-full flex flex-col"
    >
      <Tabs.List
        className="flex bg-base-neutral-800 rounded-medium gap-2 text-sm whitespace-nowrap flex-shrink-0"
        variant="small"
      >
        <Tabs.Trigger value="all" className="cursor-pointer" isLast={platforms.length === 0}>
          {dictionary.all} ({notificationCounts.all})
        </Tabs.Trigger>
        {platforms.map((platform, index) => (
          <Tabs.Trigger key={platform} value={platform} className="cursor-pointer" isLast={index === platforms.length - 1}>
            {localizedPlatformName(platform)} ({notificationCounts[platform]})
          </Tabs.Trigger>
        ))}
      </Tabs.List>

      <div className="mt-4 grow">
        <Tabs.Content value="all" className="w-full">
          {renderGridWithActions()}
        </Tabs.Content>
        {platforms.map((platform) => (
          <Tabs.Content key={platform} value={platform} className="w-full">
            {renderGridWithActions(modifiedNotifications.filter(n => n.platform === platform))}
          </Tabs.Content>
        ))}
      </div>

    </Tabs.Root>
  );

  // Main render
  return (
    <div className="w-full h-full">
      {variant === 'cms' ? renderTabs() : renderGridWithActions()}
    </div>
  );
};
