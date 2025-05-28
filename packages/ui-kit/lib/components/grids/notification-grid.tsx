import { notification } from '@maany_shr/e-class-models';
import { AllCommunityModule, ColDef, IRowNode, ModuleRegistry } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { RefObject, useState, useCallback, useMemo, useEffect } from 'react';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';
import { BaseGrid } from './base-grid';
import { formatDate } from '../../utils/format-utils';
import { Button } from '../button';
import { Tabs, TabList, TabTrigger, TabContent } from '../tabs/tab';
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';
import { NotificationGridFilterModal, NotificationFilterModel } from './notification-grid-filter-modal';
import { IconFilter } from '../icons/icon-filter';

interface ExtendedNotification extends notification.TNotification {
  platform: string; // e.g., "justdoad", "bewerbeagentur", "cms"
}

export interface NotificationGridProps extends isLocalAware {
  notifications: ExtendedNotification[];
  onNotificationClick: (notification: ExtendedNotification) => void;
  gridRef: RefObject<AgGridReact>;
  variant?: 'student' | 'coach' | 'cms';
  platforms?: string[];
  loading?: boolean;
}

ModuleRegistry.registerModules([AllCommunityModule]);

const PAGE_SIZE = 15;

const NotificationMessageRenderer = (props: { value: string }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const message = props.value || '';
  return (
    <div
      className="flex items-center text-sm my-2.5 space-x-2"
      onClick={() => setIsExpanded(prevState => !prevState)}
    >
      <span className={isExpanded ? 'text-wrap' : 'truncate'}>{message}</span>
      {isExpanded ? <ChevronUp className="flex-shrink-0 w-4 h-4" /> : <ChevronDown className="flex-shrink-0 w-4 h-4" />}
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
 * @param variant Optional variant to determine the grid's behavior ('student', 'coach', or 'cms'). Defaults to 'student'.
 * @param platforms Optional array of platform names for filtering notifications in the CMS variant. Defaults to ['justdoad', 'bewerbeagentur', 'cms'].
 * @param locale The locale for translations, used to fetch localized dictionary strings.
 * @param loading Optional boolean to indicate if the grid is in a loading state. Defaults to false.
 */
export const NotificationGrid = ({
  notifications,
  onNotificationClick,
  locale,
  gridRef,
  variant = 'student',
  platforms = ['justdoad', 'bewerbeagentur', 'cms'],
  loading = false,
}: NotificationGridProps) => {
  const dictionary = getDictionary(locale).components.notificationGrid;
  const [selectedTab, setSelectedTab] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [modifiedNotifications, setModifiedNotifications] = useState<ExtendedNotification[]>(notifications);
  // Modal and filter state
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState<Partial<NotificationFilterModel>>({});

  // Mark all notifications as read
  const handleMarkAllRead = useCallback(() => {
    setModifiedNotifications(prev =>
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  }, []);

  const handleClearAllFilters = useCallback(() => {
    setSearchTerm(''); // Clear search input
    setFilters({}); // Reset modal filters
    if (gridRef.current?.api) {
      gridRef.current.api.setFilterModel(null);
      gridRef.current.api.refreshClientSideRowModel('filter');
      gridRef.current.api.onFilterChanged();
    }
  }, [gridRef]);

  const [columnDefs] = useState<ColDef[]>([
    {
      headerName: '',
      field: 'isRead',
      cellRenderer: NotificationStatusRenderer,
      maxWidth: 40,
      minWidth: 40,
    },
    {
      flex: 1,
      field: 'message',
      headerName: dictionary.message,
      wrapText: true,
      autoHeight: true,
      cellRenderer: NotificationMessageRenderer,
      filter: 'agTextColumnFilter',
    },
    {
      field: 'action',
      headerName: dictionary.action,
      cellRenderer: NotificationActionRenderer,
      onCellClicked: (event) => {
        const notification = event.data as ExtendedNotification;
        onNotificationClick(notification);
      },
    },
    {
      field: 'timestamp',
      headerName: dictionary.dateTime,
      valueFormatter: (params) => (params.value ? formatDate(new Date(params.value)) : ''),
      filter: 'agDateColumnFilter',
    },
    {
      field: 'platform',
      hide: true,
      // filter: 'agSetColumnFilter', // Remove this line to avoid AG Grid SetFilterModule error
      filterParams: {
        values: platforms,
      },
    },
  ]);

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
    return dictionary?.[platform] || platform;
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
      if (filters.dateAfter && typeof notification.timestamp === 'number' && notification.timestamp < new Date(filters.dateAfter).getTime()) {
        return false;
      }
      if (filters.dateBefore && typeof notification.timestamp === 'number' && notification.timestamp > new Date(filters.dateBefore).getTime()) {
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

  // Handle tab change (for CMS variant)
  const handleTabChange = useCallback(
    (value: string) => {
      setSelectedTab(value);
      refreshGrid();
    },
    [refreshGrid]
  );

  // Apply filter when search term or notifications change
  useEffect(() => {
    refreshGrid();
  }, [refreshGrid, searchTerm, notifications, selectedTab, filters]);

  // Update modifiedNotifications when props.notifications change
  useEffect(() => {
    setModifiedNotifications(notifications);
    refreshGrid();
  }, [notifications, refreshGrid]);

  // Render grid with actions
  const renderGridWithActions = (notificationsToShow = modifiedNotifications) => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-base-brand-500"></div>
        </div>
      );
    }

    if (notificationsToShow.length === 0) {
      return (
        <div className="flex justify-center items-center h-64 text-text-secondary">
          {dictionary.noNotifications}
        </div>
      );
    }

    return (
      <div>
        <div className="flex items-center justify-between mb-2 mt-4 ml-1">
          <div className="flex-grow mr-2 relative">
            <input
              type="text"
              placeholder={dictionary.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 pl-10 border rounded bg-input-fill text-text-primary border-input-stroke focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-5 text-gray-500 opacity-50 z-10" />
          </div>
          <Button
            variant="secondary"
            size="medium"
            text={dictionary.filterButton}
            onClick={() => setShowFilterModal(true)}
            hasIconLeft
            iconLeft={<IconFilter />}
            className="w-full md:w-auto mr-2"
          />
          <Button
            variant="secondary"
            size="medium"
            text={dictionary.clearFilters}
            onClick={handleClearAllFilters}
            className="w-full md:w-auto mr-2"
          />
          <Button
            variant="primary"
            size="medium"
            text={dictionary.markAllAsRead}
            onClick={handleMarkAllRead}
            disabled={loading}
          />
        </div>
        <BaseGrid
          gridRef={gridRef}
          suppressRowHoverHighlight={true}
          columnDefs={columnDefs}
          rowData={notificationsToShow}
          pagination={true}
          paginationPageSize={PAGE_SIZE}
          suppressPaginationPanel={true}
          domLayout="normal"
          isExternalFilterPresent={() => true}
          doesExternalFilterPass={doesExternalFilterPass}
          getRowStyle={(params) => {
            if (!params.data) return {};
            return params.data.isRead
              ? { background: 'inherit' }
              : { background: 'rgba(0, 112, 243, 0.04)' };
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
        <Tabs.Trigger value="all" className="cursor-pointer">
          {dictionary.all} ({notificationCounts.all})
        </Tabs.Trigger>
        {platforms.map((platform) => (
          <Tabs.Trigger key={platform} value={platform} className="cursor-pointer">
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